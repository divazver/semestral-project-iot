'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('env-var');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

require('dotenv').config();

const errorHandler = require('./middleware/error-handler');

const logger = require('./utils/logger');
const { dashToCamelCase } = require('./utils/helpers');
const { NotFoundError } = require('./utils/errors');
const { connectDb } = require('./utils/connect-db');

const port = env.get('PORT').required().asString();

connectDb();

const app = express();

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'uuWetApp',
      description: 'Semestral project',
      servers: [`${env.get('ORIGIN_CLIENT').required().asString()}:${env.get('PORT').required().asString()}`],
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        jwt: {
          type: env.get('HTTP_TYPE').required().asString(),
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
  },
  apis: [`${__dirname}/routes/*.js`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * Set express configs
 */
app.use(helmet());

// Add a list of allowed origins.
const allowedOrigins = env.get('ALLOWED_ORIGINS').required().asArray();
const options = {
  origin: allowedOrigins,
};
// Then pass these options to cors:
app.use(cors(options));

app.use(morgan('combined'));
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
// Limit for files
app.use(
  express.json({
    limit: '100mb',
  }),
);

// Secure -> disable detect express
app.disable('x-powered-by');

// Router
const rootRouter = express.Router();

/**
 * Dynamic Routing
 * Adds all routes from routes folder and use it
 */
// eslint-disable-next-line node/prefer-promises/fs
fs.readdir('./src/routes', (err, files) => {
  if (err) logger.error(`Dynamic routing, ${err}`);

  files.forEach((file) => {
    const routeName = file.split('.')[0];
    let camelCaseName = dashToCamelCase(routeName);
    const routeNameCamelCase = dashToCamelCase(routeName);

    camelCaseName = require('./routes/' + routeName);
    // Use routes
    rootRouter.use(camelCaseName[routeNameCamelCase]);
  });
});

// Defined router prefix
app.use('/api/', rootRouter);

// Run only one Express instance at the same port
process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

// Global error handling
app.all('*', async (req, res, next) => {
  const error = new NotFoundError(`Route doesn't find`);
  logger.error('Global error handling: ', error);

  next(error);
});
app.use(errorHandler);

// Start Express server
app
  .listen(port, () => {
    logger.info(`Server 🚀 started on port ${port}`);
  })
  .on('error', (error) => {
    logger.error('An [error] has occurred. error is: %s and stack trace is: %s', error, error.stack);
  });
