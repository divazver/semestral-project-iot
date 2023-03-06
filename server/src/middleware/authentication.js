'use strict';

const jwt = require('jsonwebtoken');
const env = require('env-var');

const logger = require('../utils/logger');
const { getRole } = require('../controllers/role-controller');
const { getUser } = require('../controllers/user-controller');

const { NotAuthorizedError } = require('../utils/errors');
const { AUTH_MODE, ROLE } = require('../utils/constants');

/**
 * Check if JWT token agree with JWT secret key
 * @param {authorization} req
 * @param {none} res
 * @param {next step} next
 */
const checkJwt = (value) => {
  return async (req, res, next) => {
    try {
      // Take token from http request
      const tokenOrigin = req.headers.authorization;
      if (!tokenOrigin) throw new NotAuthorizedError();

      let token = '';

      // Check if prefix is Bearer or not and take only token
      if (tokenOrigin.includes('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      } else token = tokenOrigin;

      // Check if JWT Token is valid and decoded it
      let decoded = null;
      try {
        decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
      } catch (err) {
        throw new NotAuthorizedError();
      }

      await getUser(decoded.id);

      if (value === AUTH_MODE.getCurrentUser) {
        req.userId = decoded.id;
        next();
      } else if (value) {
        // Check JWT custom value
        let response = null;
        let ownerUserId = null;

        if (value === AUTH_MODE.isOwnerOrAdmin) {
          ownerUserId = req.params.userId;
        }

        // eslint-disable-next-line no-use-before-define
        response = await trySwitch(value, decoded, ownerUserId);

        if (response === 'admin') {
          req.isAdmin = true;
          next();
        } else if (response) {
          req.userId = decoded.id;
          next();
        } else throw new NotAuthorizedError();
      } else {
        req.token = token;
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Routing for additional authorization rules
 * @param {String} value
 * @param {String} token
 * @returns Boolean
 */
const trySwitch = async (value, decoded, ownerUserId) => {
  switch (value) {
    case AUTH_MODE.isAdmin:
      // eslint-disable-next-line no-use-before-define
      return await checkIsAdmin(decoded);
    case AUTH_MODE.isOwnerOrAdmin:
      // eslint-disable-next-line no-use-before-define
      return await checkIsOwnerOrAdmin(decoded, ownerUserId);
    default:
      logger.error(`Sorry, you are out of ${value}.`);
      throw new NotAuthorizedError();
  }
};

/**
 * Check if user is Admin from JWT-Token
 * @param {Object} decoded
 * @returns Boolean
 */
const checkIsAdmin = async (decoded) => {
  try {
    const role = await getRole(decoded.role, undefined);
    if (role.name !== ROLE.admin) throw new NotAuthorizedError();

    return true;
  } catch (error) {
    logger.error(`Error checkIsAdmin: ${error}.`);
    throw new NotAuthorizedError();
  }
};

/**
 * The user can only work with their own resources and admin can do everything
 * @param {Object} decode
 * @param {String} ownerUserId
 * @returns Boolean || String
 */
const checkIsOwnerOrAdmin = async (decoded, ownerUserId) => {
  try {
    const role = await getRole(decoded.role, undefined);

    if (role.name === ROLE.admin) return 'admin';
    else if (ownerUserId && decoded.id === ownerUserId) return true;
    else return false;
  } catch (error) {
    logger.error(`Error checkIsOwnerOrAdmin: ${error}.`);
    throw new NotAuthorizedError();
  }
};

module.exports = { checkJwt };
