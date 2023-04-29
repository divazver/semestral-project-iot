'use strict';

const Gateway = require('../models/gateway-model');
const Measured = require('../models/measured-model');

const {upsamplingTimeTransformation, upsampling} = require("../helpers/upsampling");
const {downsamplingTimeTransformation, downsampling} = require("../helpers/downsampling");

const logger = require('../utils/logger');

/**
 * Create measurement
 * This endpoint is only for Gateway
 * @param {Object} data
 * @param {Object} gateway
 * @returns Boolean
 */
const createMeasurement = async (data, gateway) => {
  data.gatewayId = gateway._id;
  data.time = new Date(+data.time).toUTCString();
  data.temperature = data.temperature.toFixed(1);
  data.humidity = data.humidity.toFixed(2);

  const measurement = new Measured(data);

  return await measurement
    .save()
    .then(async (response) => {
      await Gateway.findOneAndUpdate(
        { _id: gateway._id },
        {
          $push: { measurements: response._id },
        },
      );

      return true;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * Get measurements depends gateway ID and some parameters
 * @param {string} gatewayId
 * @param {string} dateTo
 * @param {string} dateFrom
 * @param {string} granularity
 * @returns
 */
const getMeasurement = async (gatewayId, dateFrom, dateTo, granularity) => {
  let dateFromSearch;
  let dateToSearch;
  let datapoints;
  let index;
  let descriptionsArray;
  let measurements;

  // case Upsampling
  if (+granularity === 1) {
    [dateFromSearch, dateToSearch, datapoints, index, descriptionsArray] = upsamplingTimeTransformation(dateFrom, dateTo);
  }
  // case Downsampling
  else {
    [dateFromSearch, dateToSearch, datapoints, descriptionsArray] = downsamplingTimeTransformation(dateFrom, dateTo, granularity);
  }

  const measurementRaw = await Measured.find({
    gatewayId,
    time: {
      $lte: dateToSearch,
      $gte: dateFromSearch,
    },
  })
    .populate([{ path: 'gateway', select: { name: 1 } }])
    .lean();

  // reversing the array 
  measurementRaw.reverse();

  // case Upsampling
  if (+granularity == 1) {
    measurements = upsampling(measurementRaw, datapoints, index, descriptionsArray);
  }
  // case Downsampling
  else {
    measurements = downsampling(measurementRaw, datapoints, descriptionsArray);
  }

  return measurements;
};

module.exports = {
  createMeasurement,
  getMeasurement,
};
