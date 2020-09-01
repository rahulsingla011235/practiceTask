'use strict';
const { userModel } = require(`../models`);

let userService = {};

/**
 * Function to update user.
 */
userService.updateUser = async (criteria = {}, dataToUpdate = {}, options = {}) => {
  return await userModel.findOneAndUpdate(criteria, dataToUpdate, options);
};

/**
 * Function to get userinfo.
 */
userService.getUser = async (criteria = {}, projection = {}, options = {}) => {
  return await userModel.findOne(criteria, projection, options);
};

module.exports = userService;