'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData, query } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { isEmptyObject, isValidMongoId } = require('../utils/helpers');
const { BadRequestError } = require('../utils/errors');

const {
  createGateway,
  getGateway,
  allGateways,
  updateGateway,
  deleteGateway,
} = require('../controllers/gateway-controller');

router.post(
  '/gateway',
  checkJwt('isAdmin'),
  body('name').not().isEmpty().isString().trim().escape().isLength({ min: 4, max: 255 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const bodyData = matchedData(req, { locations: ['body'] });
      if (isEmptyObject(bodyData)) throw new BadRequestError('No body');

      const userId = req.userId;
      const response = await createGateway(bodyData, userId);

      if (response) res.status(201).send(response);
      else res.status(400).send({ message: 'Gateway cannot be created' });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/gateway/:gatewayId',
  checkJwt(),
  param('gatewayId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { gatewayId } = req.params;

      const response = await getGateway(gatewayId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/gateways', checkJwt(), validateRequest, async (req, res, next) => {
  try {
    const response = await allGateways();

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/gateway/:gatewayId',
  checkJwt('isAdmin'),
  param('gatewayId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  body('name').not().isEmpty().isString().trim().escape().isLength({ min: 4, max: 255 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const { gatewayId } = req.params;
      const bodyData = matchedData(req, { locations: ['body'] });
      if (isEmptyObject(bodyData)) throw new BadRequestError('No body');

      const response = await updateGateway(gatewayId, bodyData);

      if (response) res.status(201).send({ message: 'Gateway successfully updated' });
      else res.status(400).send({ message: 'Gateway cannot be updated' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/gateway/:gatewayId',
  checkJwt('isAdmin'),
  param('gatewayId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { gatewayId } = req.params;

      const response = await deleteGateway(gatewayId);

      if (response) res.status(201).send({ message: `Gateway successfully deleted` });
      else res.status(400).send({ message: `Gateway cannot be deleted` });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  gatewayRoute: router,
};
