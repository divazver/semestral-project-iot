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

module.exports = {
  createMeasurement,
};
