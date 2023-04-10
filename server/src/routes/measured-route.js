'use strict';

const express = require('express');
const router = express.Router();
const { body, matchedData, param, query } = require('express-validator');

const { checkJwt } = require('../middleware/authentication');
const { validateRequest } = require('../middleware/validate-request');
const { checkGatewayToken } = require('../middleware/gatewayAuthentication');

const { isEmptyObject, isValidMongoId } = require('../utils/helpers');
const { BadRequestError } = require('../utils/errors');

const { createMeasurement, getMeasurement } = require('../controllers/measured-controller');

router.post(
  '/measurement',
  checkGatewayToken(),
  body('temperature').not().isEmpty().isNumeric().trim().escape(),
  body('humidity').not().isEmpty().isNumeric().trim().escape(),
  body('time').not().isEmpty().isString().trim().escape(),
  validateRequest,
  async (req, res, next) => {
    try {
      const bodyData = matchedData(req, { locations: ['body'] });
      if (isEmptyObject(bodyData)) throw new BadRequestError('No body');

      const gateway = req.gateway;
      const response = await createMeasurement(bodyData, gateway);

      if (response) res.status(201).send({ message: 'Measurement successfully created' });
      else res.status(400).send({ message: 'Measurement cannot be created' });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/measurement/gateway/:gatewayId',
  checkJwt(),
  param('gatewayId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  query('dateTo').isString().trim().optional({ nullable: true }),
  query('dateFrom').isString().trim().optional({ nullable: true }),
  validateRequest,
  async (req, res, next) => {
    try {
      const { gatewayId } = req.params;
      const { dateTo, dateFrom } = req.query;

      const response = await getMeasurement(gatewayId, dateTo, dateFrom);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  measuredRoute: router,
};
