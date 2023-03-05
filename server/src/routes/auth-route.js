'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, matchedData } = require('express-validator');
const env = require('env-var');

const { generateJwtToken } = require('../utils/jwt-token');

const { checkJwt } = require('../middleware/authentication');
const { validateRequest } = require('../middleware/validate-request');

const { login } = require('../controllers/auth-controller');

/**
 * @swagger
 * /login:
 *  post:
 *    summary: Login of the user
 *    tags:
 *      - Login
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [email, password]
 *            properties:
 *              email:
 *                type: string
 *                default: admin@gmail.com
 *              password:
 *                type: string
 *                default: xxx
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: Token for authorized user
 *      '400':
 *        description: Incorrect locale information provided
 *      '401':
 *        description: Not Authorized
 *      '422':
 *        description: Invalid request parameters
 */
router.post(
  '/login',
  body('email').not().isEmpty().isEmail().trim().escape(),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const token = await login(matchedData(req, { locations: ['body'] }));

      res.status(200).send({ token });
      return;
    } catch (error) {
      next(error);
    }
  },
);

router.post('/logout', checkJwt(), async (req, res, next) => {
  try {
    req.session.destroy(() => {
      res.clearCookie('connect.sid').send('cleared cookie');
    });
  } catch (error) {
    next(error);
  }
});

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    // successRedirect: `http://localhost:3000/`,
    failureRedirect: `${env.get('ORIGIN_CLIENT').required().asString()}/login`,
  }),
  (req, res) => {
    try {
      let token = null;
      const user = req.user ?? null;

      if (user) {
        token = generateJwtToken(user._id, 'role', user.roleId, 'JWT_SECRET');
      }
      res.redirect(`${env.get('ORIGIN_CLIENT').required().asString()}/?token=${token}`);
    } catch (error) {
      console.error(error);
      res.redirect(`${env.get('ORIGIN_CLIENT').required().asString()}`);
    }
  },
);

module.exports = {
  authRoute: router,
};
