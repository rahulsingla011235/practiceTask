'use strict';

const swaggerUI = require('swagger-ui-express');
const SERVICES = require('../services');
const Joi = require('@hapi/joi');
let path = require('path')

const CONFIG = require('../../config');
const { MESSAGES, ERROR_TYPES} = require('./constants');
const HELPERS = require('../helpers');
const utils = require('./utils');


let routeUtils = {};

/**
 * function to create routes in the express.
 */
routeUtils.route = async (app, routes = []) => {
  routes.forEach(route => {
    let middlewares = [];
    middlewares.push(getValidatorMiddleware(route));
    app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route));
  });
  createSwaggerUIForRoutes(app, routes);
};

/**
 * function to check the error of all joi validations
 * @param {*} joiValidatedObject 
 */
let checkJoiValidationError = (joiValidatedObject) => {
  if (joiValidatedObject.error) throw joiValidatedObject.error;
}

/**
 * function to validate request body/params/query/headers with joi schema to validate a request is valid or not.
 * @param {*} route 
 */
let joiValidatorMethod = async (request, route) => {
  if (route.joiSchemaForSwagger.params && Object.keys(route.joiSchemaForSwagger.params).length) {
    request.params = await Joi.object(route.joiSchemaForSwagger.params).validate(request.params);
    checkJoiValidationError(request.params);
  }
  if (route.joiSchemaForSwagger.body && Object.keys(route.joiSchemaForSwagger.body).length) {
    request.body = await Joi.object(route.joiSchemaForSwagger.body).validate(request.body);
    checkJoiValidationError(request.body);
  }
  if (route.joiSchemaForSwagger.query && Object.keys(route.joiSchemaForSwagger.query).length) {
    request.query = await Joi.object(route.joiSchemaForSwagger.query).validate(request.query);
    checkJoiValidationError(request.query);
  }
  if (route.joiSchemaForSwagger.headers && Object.keys(route.joiSchemaForSwagger.headers).length) {
    let headersObject = await Joi.object(route.joiSchemaForSwagger.headers).validate(request.headers);
    checkJoiValidationError(headersObject);
    request.headers.authorization = ((headersObject || {}).value || {}).authorization;
  }
};


/**
 * middleware to validate request body/params/query/headers with JOI.
 * @param {*} route 
 */
let getValidatorMiddleware = (route) => {
  return (request, response, next) => {
    joiValidatorMethod(request, route).then((result) => {
      return next();
    }).catch((err) => {
      let error = utils.convertErrorIntoReadableForm(err);
      let responseObject = HELPERS.responseHelper.createErrorResponse(error.message.toString(), ERROR_TYPES.BAD_REQUEST);
      return response.status(responseObject.statusCode).json(responseObject);
    });
  };
}

/**
 * middleware
 * @param {*} handler 
 */
let getHandlerMethod = (route) => {
  let handler = route.handler
  return (request, response) => {
    let payload = {
      ...((request.body || {}).value || {}),
      ...((request.params || {}).value || {}),
      ...((request.query || {}).value || {}),
      file: (request.file || {}),
      user: (request.user ? request.user : {}),
    };
    //request handler/controller
    if (route.getExactRequest) {
      request.payload = payload;
      payload = request
    }
    handler(payload)
      .then((result) => {
        if (result.filePath) {
          let filePath = path.resolve(__dirname + '/../' + result.filePath)
          return response.status(result.statusCode).sendFile(filePath)
        } else if (result.redirectUrl) {
          return response.redirect(result.redirectUrl);
        }
        response.status(result.statusCode).json(result);
      })
      .catch((err) => {
        console.log('Error is ', err);
        if (!err.statusCode && !err.status) {
          err = HELPERS.responseHelper.createErrorResponse(MESSAGES.SOMETHING_WENT_WRONG, ERROR_TYPES.INTERNAL_SERVER_ERROR);
        }
        response.status(err.statusCode).json(err);
      });
  };
};

/**
 * function to create Swagger UI for the available routes of the application.
 * @param {*} app Express instance.
 * @param {*} routes Available routes.
 */
let createSwaggerUIForRoutes = (app, routes = []) => {
  const swaggerInfo = CONFIG.swagger.info;
  const swJson = SERVICES.swaggerService;
  swJson.swaggerDoc.createJsonDoc(swaggerInfo);
  routes.forEach(route => {
    swJson.swaggerDoc.addNewRoute(route.joiSchemaForSwagger, route.path, route.method.toLowerCase());
  });

  const swaggerDocument = require('../../swagger.json');
  app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
};

module.exports = routeUtils;
