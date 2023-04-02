'use strict';

const express = require('express');
const router = express.Router();
const { body, param, query, matchedData } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { ROLE } = require('../utils/constants');
const { isEmptyObject, isValidMongoId } = require('../utils/helpers');
const { BadRequestError } = require('../utils/errors');

const {
  registerUser,
  createUser,
  getUser,
  getSearchUserByFullName,
  currentUser,
  allUsers,
  updateUser,
  deleteUser,
} = require('../controllers/user-controller');

router.post(
  '/user/register',
  body('email').not().isEmpty().trim().escape().isEmail(),
  body('firstName').not().isEmpty().trim().escape().isLength({ min: 3, max: 255 }),
  body('lastName').not().isEmpty().trim().escape().isLength({ min: 3, max: 255 }),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const bodyData = matchedData(req, { locations: ['body'] });
      if (isEmptyObject(bodyData)) throw new BadRequestError('No body');

      const token = await registerUser(bodyData);

      if (token) res.status(201).send({ token });
      else res.status(400).send({ message: 'User cannot be registered' });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/user/create',
  checkJwt('isAdmin'),
  body('firstName').isString().trim().escape().isLength({ min: 4, max: 255 }),
  body('lastName').isString().trim().escape().isLength({ min: 4, max: 255 }),
  body('email').not().isEmpty().trim().escape().isEmail(),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  body('roleId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const bodyData = matchedData(req, { locations: ['body'] });
      if (isEmptyObject(bodyData)) throw new BadRequestError('No body');
      const response = await createUser(bodyData);

      if (response) res.status(201).send({ message: 'User successfully created' });
      else res.status(400).send({ message: 'User cannot be created' });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/user/:userId',
  checkJwt('isAdmin'),
  param('userId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      const response = await getUser(userId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/user',
  checkJwt('isAdmin'),
  query('name').not().isEmpty().isString().trim().escape(),
  validateRequest,
  async (req, res, next) => {
    try {
      const fullName = req.query.name;

      const response = await getSearchUserByFullName(fullName);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/current-user', checkJwt(), async (req, res, next) => {
  try {
    const token = req.token;

    const response = await currentUser(token);

    if (response) res.status(200).send(response);
    else res.status(404).send({ message: 'User not found' });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/users',
  checkJwt('isAdmin'),
  query('role').isString().trim().escape().optional({ nullable: true }).isIn([ROLE.admin, ROLE.user]),
  validateRequest,
  async (req, res, next) => {
    try {
      const { role } = req.query;
      const response = await allUsers(role);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/user/:userId',
  checkJwt('isOwnerOrAdmin'),
  param('userId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  body('firstName').isString().trim().escape().isLength({ min: 4, max: 255 }).optional({ nullable: true }),
  body('lastName').isString().trim().escape().isLength({ min: 4, max: 255 }).optional({ nullable: true }),
  body('email').trim().escape().isEmail().optional({ nullable: true }),
  body('password').isString().trim().escape().isLength({ min: 4 }).optional({ nullable: true }),
  body('roleId')
    .isString()
    .trim()
    .escape()
    .optional({ nullable: true })
    .custom((value) => isValidMongoId(value)),
  body('roleName').isString().trim().escape().optional({ nullable: true }).isIn([ROLE.admin, ROLE.user]),
  validateRequest,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const bodyData = matchedData(req, { locations: ['body'] });
      if (isEmptyObject(bodyData)) throw new BadRequestError('No body');

      const isAdmin = req.isAdmin;
      const response = await updateUser(userId, bodyData, isAdmin);

      if (response) res.status(201).send({ message: 'User successfully updated' });
      else res.status(400).send({ message: 'User cannot be updated' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/user/:userId',
  checkJwt('isOwnerOrAdmin'),
  param('userId')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      const response = await deleteUser(userId);

      if (response) res.status(201).send({ message: `User successfully deleted` });
      else res.status(400).send({ message: `User cannot be deleted` });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  userRoute: router,
};
