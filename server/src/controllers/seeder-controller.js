'use strict';

const env = require('env-var');
const MongoClient = require('mongodb').MongoClient;

const { DUMMY_ROLE } = require('../data/dummyRole');
const { DUMMY_USER } = require('../data/dummyUser');
const { DUMMY_GATEWAY } = require('../data/dummyGateway');
const { DUMMY_MEASURED } = require('../data/dummyMeasured');

const seederUser = require('../services/seeder/seeder-user');
const seederRole = require('../services/seeder/seeder-role');
const seederGateway = require('../services/seeder/seeder-gateway');

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

module.exports = createDummyData;
