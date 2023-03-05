'use strict';

const express = require('express');
const { Error } = require('mongoose');
const router = express.Router();

const { checkJwt } = require('../middleware/authentication');

const healthCheckService = require('../controllers/healthCheck-controller');

const { InternalServerError } = require('../utils/errors');

router.post('/health-check', checkJwt('isAdmin'), async (req, res) => {
  try {
    const data = await healthCheckService();

    res.status(200).send({ data });
  } catch (error) {
    if (error instanceof Error) {
      throw new InternalServerError('Mongoose health check error');
    } else {
      throw new InternalServerError();
    }
  }
});

module.exports = {
  healthCheckRoute: router,
};
