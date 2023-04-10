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


const getMeasurement = async (gatewayId, dateTo, dateFrom) => {
  const measurement = await Measured.find({
    gatewayId,
    time: {
      $lte: dateTo ? dateTo : new Date(),
      $gte: dateFrom ? dateFrom : new Date(Date.now() - 1000 * (60 * 60)),
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
