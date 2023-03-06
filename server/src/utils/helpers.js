'use strict';

const mongoose = require('mongoose');

/**
 * Remove all duplicates values from Array of objects
 * @param {Array[Objects]} arr
 * @param {String} key
 * @returns Array[Objects]
 */
const arrayObjectUnique = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

/**
 * Check if all value in array are TRUE
 * @param {Array[Boolean]} arr
 * @returns Boolean
 */
const checkAllTrue = (array) => {
  return array.every((element) => element === true);
}

/**
 * Convert Dash string into CamelCase
 * @param {String} string
 * @returns String
 */
const dashToCamelCase = (string) => {
  return string.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};
/**
 * Check if string is hexColor base standard
 * @param {String} value
 * @returns Boolean
 */
const hexColorChecker = (value) => {
  const reg = /^#([0-9a-f]{3}){1,2}$/i;
  return reg.test(value);
};

/**
 * Check if object is empty
 * @param {Object} object
 * @returns Boolean
 */
const isEmptyObject = (object) => {
  for (const property in object) {
    return false;
  }
  return true;
};

/**
 * Check if MongoId ObjectId is valid
 * @param {String} value
 * @returns Boolean
 */
const isValidMongoId = (value) => {
  const isValid = mongoose.isValidObjectId(value);
  if (!isValid) return false;
  return true;
};

/**
 * Generate random string depends on custom length
 * @param {Number} length
 * @returns String
 */
const randomStringGenerator = (length) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = 0; i <= length; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(randomNumber, randomNumber + 1);
  }

  return randomString;
};
/**
 * Remove Google email alias
 * @param {String} email
 * @returns String
 */
const removeAliases = (email) => {
  return email.replace('+', '');
};

/**
 * Check if string is valid URL link
 */
/* eslint-disable */
const stringIsAValidUrl = (s, protocols) => {
  try {
    const url = new URL(s);
    return protocols
      ? url.protocol
        ? protocols.map((x) => `${x.toLowerCase()}:`).includes(url.protocol)
        : false
      : true;
  } catch (err) {
    return false;
  }
};
/* eslint-enable */

module.exports = {
  arrayObjectUnique,
  checkAllTrue,
  dashToCamelCase,
  hexColorChecker,
  isEmptyObject,
  isValidMongoId,
  randomStringGenerator,
  removeAliases,
  stringIsAValidUrl,
};
