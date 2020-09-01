'use strict';

let CONSTANTS = {};

CONSTANTS.NORMAL_PROJECTION = { __v: 0, createdAt: 0, updatedAt: 0 };

CONSTANTS.DENOMINATIONS = {
  denominations: [2000, 500, 200, 100, 50, 20, 10],
  get getMinimumDenomination() { return this.denominations[this.denominations.length - 1] },
};

CONSTANTS.MAX_LIMIT = 20000;

CONSTANTS.MESSAGES = {
  SERVER_IS_WORKING_FINE: 'Server is working fine.',
  USER_REGISTERED_SUCCESSFULLY: 'User registered successfully.',
  SOMETHING_WENT_WRONG: 'Something went wrong.',
  UNAUTHORIZED: 'Unauthorized access!',
  NO_CASH_AVAILABLE: 'No cash available in machine.',
  INSUFIICIENT_BALANCE: 'Insufficient balance.',
  ENTER_THE_AMOUNT_MULTIPLE_OF_MINIMUM_DENOMINATION: `Enter the amount multiple of ${CONSTANTS.DENOMINATIONS.getMinimumDenomination}.`,
  TRASACTION_SUCCESSFULL: "Transaction successfull.",
  USER_NOT_FOUND: 'User not found.',
  ENTER_AMOUNT_LESS_THAN_MAX_LIMIT: `Enter amount less than ${CONSTANTS.MAX_LIMIT}.`
};

CONSTANTS.ERROR_TYPES = {
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  MONGO_EXCEPTION: 'MONGO_EXCEPTION',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SOCKET_ERROR: 'SOCKET_ERROR',
  INVALID_MOVE: 'invalidMove'
};

CONSTANTS.HTTP_REQUEST_STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
  DATA_NOT_FOUND: 404
};

module.exports = CONSTANTS;
