'use strict';

const { Joi } = require('../../utils/joiUtils');
//load controllers
const { userController } = require(`../../controllers`);
const { DENOMINATIONS } = require(`../../utils/constants`);

let routes = [
	{
		method: 'POST',
		path: '/v1/user/cashWithdraw',
		joiSchemaForSwagger: {
			body: {
				amount: Joi.number().min(1).required().description('Withdraw amount.'),
				preference: Joi.number().optional().valid(2000, 500, 200, 100, 20, 10).description('Prefrence of note.')
			},
			group: 'User',
			description: 'Route to withdraw cash.',
			model: 'CASH_WITHDRAW'
		},
		handler: userController.intiateTransaction
	}];

module.exports = routes;




