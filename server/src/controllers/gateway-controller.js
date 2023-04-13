'use strict';

const User = require('../models/user-model');
const Gateway = require('../models/gateway-model');

const { NotFoundError, NoContentError } = require('../utils/errors');
const logger = require('../utils/logger');
const { randomStringGenerator } = require('../utils/helpers');

/**
 * Create new gateway
 * @param {Object} data
 * @param {String} userId
 * @returns Object
 */
const createGateway = async (data, userId) => {
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw new NotFoundError('User does not exists');
  }

  const gatewayToken = randomStringGenerator(50);
  data.token = gatewayToken;
  data.userId = userId;

  const gateway = new Gateway(data);

  return await gateway
    .save()
    .then(async (response) => {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: { gateways: gateway._id },
        },
      );

      return response;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * Get one gateway by ID
 * @param {String} gatewayId
 * @returns Object
 */
const getGateway = async (gatewayId) => {
  const gateway = await Gateway.findOne({ _id: gatewayId }, { token: 0 })
    .populate([{ path: 'user', select: { firstName: 1, lastName: 1, email: 1 } }])
    // .populate([{ path: 'measurements', select: { temperature: 1, humidity: 1, time: 1 } }])
    .lean();

  if (!gateway) throw new NotFoundError("Gateway doesn't exists");

  return gateway;
};

/**
 * All gateways
 * @returns Array[Object]
 */
const allGateways = async () => {
  const gateways = await Gateway.find({}, { token: 0 })
    .populate([{ path: 'user', select: { firstName: 1, lastName: 1, email: 1 } }])
    // .populate([{ path: 'measurements', select: { temperature: 1, humidity: 1, time: 1 } }])
    .lean();

  if (gateways?.length <= 0) throw new NoContentError('No gateways');
  return gateways;
};

/**
 * Update gateway by id
 * @param {String} gatewayId
 * @param {Object} data
 * @returns Boolean
 */
const updateGateway = async (gatewayId, data) => {
  const checkGateway = await Gateway.findOne({ _id: gatewayId }).lean();
  if (!checkGateway) throw new NotFoundError("Gateway doesn't exists");

  const filter = { _id: gatewayId };
  const update = data;
  const opts = { new: false };

  const gateway = await Gateway.findOneAndUpdate(filter, update, opts);

  if (gateway) return true;
  else return false;
};

/**
 * Delete gateway by id
 * @param {String} gatewayId
 * @returns Boolean
 */
const deleteGateway = async (gatewayId) => {
  const gateway = await Gateway.findOne({ _id: gatewayId }).lean();
  if (!gateway) throw new NotFoundError("Gateway doesn't exists");

  const userId = gateway.userId;

  const response = await Gateway.deleteOne({ _id: gatewayId });
  if (response) {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { gateways: gatewayId },
      },
    );

    return true;
  } else return false;
};

const _checkGatewayToken = async (token) => {
  const gateway = await Gateway.findOne({ token }).lean();
  if (!gateway) return false;

  return gateway;
};

module.exports = {
  createGateway,
  getGateway,
  allGateways,
  updateGateway,
  deleteGateway,
  _checkGatewayToken,
};
