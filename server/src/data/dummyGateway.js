'use strict';

const Gateway = require('../models/gateway-model');
const { DUMMY_USER } = require('./dummyUser');

const DUMMY_GATEWAY = [
  new Gateway({
    name: "Gateway 1 test",
    token: "iugsuguaig-aoguicdagsuguo45678",
    userId: DUMMY_USER[0],
    measurements: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Gateway({
    name: "Gateway 2 test",
    token: "iugsuguaig-aoguicdagsuguo45679",
    userId: DUMMY_USER[0],
    measurements: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_GATEWAY,
};
