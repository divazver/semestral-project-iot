'use strict';

const Gateway = require('../models/gateway-model');
const Measured = require('../models/measured-model');

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
 * @returns
 */
const getMeasurement = async (gatewayId, dateTo, dateFrom) => {
  const oneDayBefore = new Date();
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);
  const today = new Date();

  const measurement = await Measured.find({
    gatewayId,
    time: {
      $lte: dateTo ?? today,
      $gte: dateFrom ?? oneDayBefore,
    },
  })
    .populate([{ path: 'gateway', select: { name: 1 } }])
    .lean();

  return measurement;
};

module.exports = {
  createMeasurement,
  getMeasurement,
};
