'use strict';

const env = require('env-var');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');
const Role = require('../models/role-model');

const { getRole } = require('./role-controller');
const { login } = require('./auth-controller');

const { ConflictError, NotFoundError, NoContentError } = require('../utils/errors');
const { ROLE } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Register a new user. It is a public endpoint without Auth.
 * @param {Object} data
 * @returns Boolean
 */
const registerUser = async (data) => {
  const userExists = await User.exists({ email: data.email });
  if (userExists) {
    throw new ConflictError('User exists');
  }

  const role = await getRole(undefined, ROLE.user);
  data.roleId = role._id;

  const user = new User(data);

  return await user
    .save()
    .then(async (response) => {
      if (response) {
        await Role.findOneAndUpdate(
          { _id: role._id },
          {
            $push: { users: user },
          },
        );

        const token = await login({ email: response.email, password: response.password });
        return token;
      } else return false;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * Only admins can create a new user.
 * @param {Object} data
 * @returns {Boolean}
 */
const createUser = async (data) => {
  const userExists = await User.exists({ email: data.email });
  if (userExists) {
    throw new ConflictError('User exists');
  }

  const roleExists = await getRole(data.roleId, undefined);
  if (!roleExists) {
    throw new NotFoundError("Role doesn't exists");
  }

  const user = new User(data);

  return await user
    .save()
    .then(async () => {
      await Role.findOneAndUpdate(
        { _id: roleExists._id },
        {
          $push: { users: user },
        },
      );

      return true;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * Get one user by id
 * @param {String} userId
 * @returns {Object } user
 */
const getUser = async (userId) => {
  const user = await User.findOne({ _id: userId })
    .populate([{ path: 'role', select: { name: 1 } }])
    .populate([{ path: 'gateways', select: { name: 1 } }])
    .lean();

  if (!user) throw new NotFoundError("User doesn't exists");

  return user;
};

/**
 * Get user/s by full name
 * @param {String} name
 * @returns Array[Object]
 */
const getSearchUserByFullName = async (name) => {
  const users = await User.find();

  const matchedUsers = users.filter((item) => item.fullName.indexOf(name) !== -1);

  if (!matchedUsers) throw new NotFoundError("User/s with current name doesn't exists");
  return matchedUsers;
};

/**
 * Get current logged user
 * @param {String} token
 * @returns {Object} user
 */
const currentUser = async (token) => {
  const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
  const user = await getUser(decoded.id);

  if (user) return user;
  else return false;
};

/**
 *
 * @param {String} role
 * @returns Array[Objects]
 */
const allUsers = async (role) => {
  const query = {};

  if (role) {
    const roleData = await getRole(undefined, ROLE[role]);
    query.roleId = roleData._id;
  }

  const users = await User.find(query)
    .populate({ path: 'role' })
    .populate([{ path: 'gateways', select: { name: 1 } }])
    .lean();

  if (users?.length <= 0) throw new NoContentError('No users');
  return users;
};

/**
 * Update user, only admins or same user can do that
 * @param {String} userId
 * @param {Object} data
 * @param {Boolean} isAdmin
 * @returns Boolean
 */
const updateUser = async (userId, data, isAdmin) => {
  const checkUser = await User.findOne({ _id: userId }).lean();
  if (!checkUser) throw new NotFoundError("User doesn't exists");

  let newData;

  // Update role if admin
  if ((isAdmin && data?.roleId && checkUser.roleId !== data?.roleId) || (isAdmin && data?.roleName)) {
    let roleExists = null;
    if (data?.roleId) roleExists = await getRole(data.roleId, undefined);
    else roleExists = await getRole(undefined, data.roleName);

    if (!roleExists) {
      throw new NotFoundError("Role doesn't exists");
    }

    newData = {
      ...data,
      roleId: roleExists._id,
    };

    await Role.findOneAndUpdate(
      { _id: checkUser.roleId },
      {
        $pull: { users: checkUser._id },
      },
    );

    await Role.findOneAndUpdate(
      { _id: data.roleId },
      {
        $push: { users: checkUser._id },
      },
    );
  } else {
    delete data?.roleId;
    delete data?.roleName;
    newData = data;
  }

  const filter = { _id: userId };
  const update = newData;
  const opts = { new: false };

  const user = await User.findOneAndUpdate(filter, update, opts);

  if (user) return true;
  else return false;
};

/**
 * Only admins can delete everyone or the same user can delete yourself
 * @param {String} userId
 * @returns Boolean
 */
const deleteUser = async (userId) => {
  const user = await User.findOne({ _id: userId })
    .populate([{ path: 'role', select: { name: 1 } }])
    .lean();
  if (!user) throw new NotFoundError("User doesn't exists");

  const response = await User.deleteOne({ email: user.email });
  if (response) {
    await Role.findOneAndUpdate(
      { _id: user.roleId },
      {
        $pull: { users: user._id },
      },
    );

    return true;
  } else return false;
};

module.exports = {
  registerUser,
  createUser,
  getUser,
  getSearchUserByFullName,
  currentUser,
  allUsers,
  updateUser,
  deleteUser,
};
