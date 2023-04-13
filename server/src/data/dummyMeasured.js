'use strict';

const Measured = require('../models/measured-model');
const { DUMMY_GATEWAY } = require('./dummyGateway');

const DUMMY_MEASURED = [
  new Measured({
    temperature: 36.1,
    humidity: 38.8,
    time: new Date(Date.now() - 300000 * 1),
    gatewayId: DUMMY_GATEWAY[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Measured({
    temperature: 36.1,
    humidity: 38.8,
    time: new Date(Date.now() - 300000 * 2),
    gatewayId: DUMMY_GATEWAY[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Measured({
    temperature: 36.1,
    humidity: 38.8,
    time: new Date(Date.now() - 300000 * 3),
    gatewayId: DUMMY_GATEWAY[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Measured({
    temperature: 37.1,
    humidity: 40.8,
    time: new Date(Date.now() - 300000 * 4),
    gatewayId: DUMMY_GATEWAY[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Measured({
    temperature: 37.1,
    humidity: 40.8,
    time: new Date(Date.now() - 300000 * 5),
    gatewayId: DUMMY_GATEWAY[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Measured({
    temperature: 34.1,
    humidity: 37.8,
    time: new Date('05.03.2023, 11:03:05'),
    gatewayId: DUMMY_GATEWAY[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Measured({
    temperature: 34.1,
    humidity: 37.8,
    time: new Date('05.03.2023, 11:08:05'),
    gatewayId: DUMMY_GATEWAY[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Measured({
    temperature: 36.1,
    humidity: 38.8,
    time: new Date('05.03.2023, 11:013:05'),
    gatewayId: DUMMY_GATEWAY[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Measured({
    temperature: 36.1,
    humidity: 38.8,
    time: new Date('05.03.2023, 11:16:05'),
    gatewayId: DUMMY_GATEWAY[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Measured({
    temperature: 38.1,
    humidity: 41.8,
    time: new Date('05.03.2023, 11:21:05'),
    gatewayId: DUMMY_GATEWAY[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_MEASURED,
};
