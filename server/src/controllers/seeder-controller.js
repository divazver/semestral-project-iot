'use strict';

const env = require('env-var');
const MongoClient = require('mongodb').MongoClient;

const { DUMMY_ROLE } = require('../data/dummyRole');
const { DUMMY_USER } = require('../data/dummyUser');
const { DUMMY_GATEWAY } = require('../data/dummyGateway');
const { DUMMY_MEASURED } = require('../data/dummyMeasured');

const Measured = require('../models/measured-model');

const seederUser = require('../services/seeder/seeder-user');
const seederRole = require('../services/seeder/seeder-role');
const seederGateway = require('../services/seeder/seeder-gateway');

const { getGateway } = require('../controllers/gateway-controller');

const logger = require('../utils/logger');

const { BadRequestError } = require('../utils/errors');
const { ROLE } = require('../utils/constants');

/**
 * Seed DB with dummy data
 * Beware of the order
 */
const createDummyData = async () => {
  const mongoUri = env.get('MONGO_URI_DOCKER_SEED').required().asUrlString();
  const mongoDbName = env.get('DB_NAME').required().asString();

  const client = new MongoClient(mongoUri);
  try {
    await client.connect();

    logger.info('Connected correctly to the Database.');

    // Create Collections
    const roleCollection = client.db(mongoDbName).collection('role');
    const userCollection = client.db(mongoDbName).collection('user');
    const gatewayCollection = client.db(mongoDbName).collection('gateway');
    const measuredCollection = client.db(mongoDbName).collection('measured');

    const collections = await client.db(mongoDbName).collections();

    // Drop Collections if exists
    if (collections.length > 0) {
      try {
        await Promise.all(
          Object.values(collections).map(async (collection) => {
            await collection.deleteMany({});
          }),
        );
      } catch (error) {
        logger.error(`Database dropping had problems: ${error}`);
        throw new BadRequestError('Database dropping had problems');
      }
    }

    // Seed DB
    await roleCollection.insertMany(DUMMY_ROLE);
    await userCollection.insertMany(DUMMY_USER);
    await gatewayCollection.insertMany(DUMMY_GATEWAY);
    await measuredCollection.insertMany(DUMMY_MEASURED);

    // Updates models with relation seeders
    await seederGateway(gatewayCollection, DUMMY_MEASURED);
    await seederUser(userCollection, DUMMY_GATEWAY);
    await seederRole(roleCollection, ROLE, DUMMY_USER);

    logger.info('Database has been seeded successfully.');
  } catch (err) {
    logger.error(`Database seeding has been unsuccessful: ${err}`);
    throw new BadRequestError('Database seeding has been unsuccessful');
  }
};

const createCleverData = async (dateFrom, gatewayId) => {
  const mongoUri = env.get('MONGO_URI_DOCKER').required().asUrlString();
  const mongoDbName = env.get('DB_NAME').required().asString();

  const client = new MongoClient(mongoUri);
  
  await client.connect();

  const measuredCollection = client.db(mongoDbName).collection('measured');


  dateFrom = new Date(dateFrom);

  // getting the last 5-min timestamp prev to NOW
  let dateTo = new Date();
  let roundedMinutesTo = Math.floor(dateTo.getMinutes() / 5) * 5;
  dateTo.setMinutes(roundedMinutesTo, 0, 0);
  
  // getting the first 5-min timesatmp past the parameter
  let roundedMinutesFrom = Math.ceil(dateFrom.getMinutes() / 5) * 5;
  dateFrom.setMinutes(roundedMinutesFrom, 0, 0);

  // conversion to timestamps for easier work
  let timestamp = dateFrom.getTime();
  let finalTimestamp = dateTo.getTime();

  // initial values for temperature and humidity
  let temp = 24;
  let hum = 55;

  let gatewayForSeed = await getGateway(gatewayId);

  while (timestamp <= finalTimestamp) {

    let randomTemp = Math.floor(Math.random() * (30 - 22 + 1)) + 22;
    let randomHum = Math.floor(Math.random() * (58 - 42 + 1)) + 42;

    if (Math.abs(randomTemp - temp) < 2) {
      temp += 0;
    } else if (randomTemp > temp) {
      temp += 0.1;
    } else {
      temp -= 0.1;
    }

    if (Math.abs(randomHum - hum) < 3) {
      hum += 0;
    } else if (randomHum > hum) {
      hum += 0.1;
    } else {
      hum -= 0.1;
    }

    await measuredCollection.insertOne(
      new Measured({
        temperature: temp.toFixed(2),
        humidity: hum.toFixed(2),
        time: new Date(timestamp),
        gatewayId: gatewayForSeed,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    // adding five minutes
    timestamp += 1000 * 60 * 5;
  }
}

module.exports = {
  createDummyData,
  createCleverData
};
