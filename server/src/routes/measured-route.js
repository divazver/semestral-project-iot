'use strict';

const express = require('express');
const router = express.Router();
const { body, matchedData } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkGatewayToken } = require('../middleware/gatewayAuthentication');

const { isEmptyObject } = require('../utils/helpers');
const { BadRequestError } = require('../utils/errors');

const { createMeasurement } = require('../controllers/measured-controller');

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

module.exports = {
  measuredRoute: router,
};
