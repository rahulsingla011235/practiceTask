"use strict";
const HELPERS = require("../helpers");
const { MESSAGES, ERROR_TYPES, MAX_LIMIT, DENOMINATIONS } = require('../utils/constants');
const { userService } = require("../services");

/***************************
 ***** User controllers ***
 **************************/
let userController = {};

/**
 * Function to withdrawl cash.
 * @param {*} payload 
 */
userController.intiateTransaction = async (payload) => {
  let denominations = DENOMINATIONS.denominations;


  //Get user info from database.
  let userInfo = await userService.getUser({}, { balance: 1 }, { lean: false });

  //check is user occurs or not.
  if (!userInfo) {
    throw HELPERS.responseHelper.createErrorResponse(MESSAGES.USER_NOT_FOUND, ERROR_TYPES.BAD_REQUEST);
  }
  let response = await cashWithdraw(denominations, payload.amount, userInfo.balance, payload.preference);
  if (response.isError) {
    throw HELPERS.responseHelper.createErrorResponse(response.msg, response.responseType);
  }
  userInfo.balance = response.balance;
  //save the user balance in database.
  await userInfo.save();

  //return the api response.
  return Object.assign(HELPERS.responseHelper.createSuccessResponse(response.msg), { data: { balance: response.balance, notes: response.notes } });
};

/**
 * Function to cash with draw.
 * @param {*} denominations 
 * @param {*} amount 
 * @param {*} balance 
 * @param {*} preference 
 */
userController.cashWithdraw = (denominations, amount, balance, preference) => {
  let numberOfDenominations = denominations.length, notes = {};

  //Check if the amount is more than the maximum withdrwal imit of the Atm machine.
  if (amount > MAX_LIMIT) {
    return { isError: true, msg: MESSAGES.ENTER_AMOUNT_LESS_THAN_MAX_LIMIT, responseType: ERROR_TYPES.BAD_REQUEST };
  }

  //Check if amount is more than the user account balance.
  if (amount > balance) {
    return { isError: true, msg: MESSAGES.INSUFIICIENT_BALANCE, responseType: ERROR_TYPES.BAD_REQUEST };
  }

  //check if the minimum denomination note is proper divisible with the amount or not.
  if (amount % denominations[numberOfDenominations - 1] != 0) {
    return { isError: true, msg: MESSAGES.ENTER_THE_AMOUNT_MULTIPLE_OF_MINIMUM_DENOMINATION, responseType: ERROR_TYPES.BAD_REQUEST };
  }

  preference = preference || denominations[0];
  let tempAmount = amount;
  let currentDenomination;
  //Find maximum number of notes of each denomination untill balance become zero.
  for (let index = 0; index < denominations.length; index++) {
    currentDenomination = denominations[index];
    //If amount is more or equal to the current denomination and check the preference.
    if (tempAmount >= currentDenomination && preference >= currentDenomination) {
      //add the maximum possible number of notes of current denomination in notes object.
      notes[currentDenomination] = Math.floor(tempAmount / currentDenomination);
      //find the pending amount.
      tempAmount -= notes[currentDenomination] * currentDenomination;
    }
  }
  balance -= amount;
  return { isError: false, responseType: 'SUCCESS', msg: MESSAGES.TRASACTION_SUCCESSFULL, balance, notes };
}

/* export userController */
module.exports = userController;