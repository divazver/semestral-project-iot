'use strict';

const { _checkGatewayToken } = require('../controllers/gateway-controller');

const { NotAuthorizedError } = require('../utils/errors');

/**
 * Check if gateway token is valid
 * @param {authorization} req
 * @param {none} res
 * @param {next step} next
 */
const checkGatewayToken = (value) => {
  return async (req, res, next) => {
    try {
      // Take token from http request
      const token = `Bearer ${req.headers.authorization}`;
      if (!token) throw new NotAuthorizedError();

      const getGateway = await _checkGatewayToken(token);

      if (getGateway) {
        req.gateway = getGateway;
        next();
      } else {
        throw new NotAuthorizedError();
      }
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { checkGatewayToken };
