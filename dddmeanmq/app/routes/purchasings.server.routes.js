'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var purchasings = require('../../app/controllers/purchasings.server.controller');

	// Purchasings Routes
	app.route('/purchasings')
		.get(purchasings.list)
		.post(users.requiresLogin, purchasings.create);

	app.route('/purchasings/:purchasingId')
		.get(purchasings.read)
		.put(users.requiresLogin, purchasings.hasAuthorization, purchasings.update)
		.delete(users.requiresLogin, purchasings.hasAuthorization, purchasings.delete);

	// Finish by binding the Purchasing middleware
	app.param('purchasingId', purchasings.purchasingByID);
};
