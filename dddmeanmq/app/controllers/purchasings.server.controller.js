'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Purchasing = mongoose.model('Purchasing'),
	_ = require('lodash');

/**
 * Create a Purchasing
 */
exports.create = function(req, res) {
	var purchasing = new Purchasing(req.body);
	purchasing.user = req.user;

	purchasing.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(purchasing);
		}
	});
};

/**
 * Show the current Purchasing
 */
exports.read = function(req, res) {
	res.jsonp(req.purchasing);
};

/**
 * Update a Purchasing
 */
exports.update = function(req, res) {
	var purchasing = req.purchasing ;

	purchasing = _.extend(purchasing , req.body);

	purchasing.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(purchasing);
		}
	});
};

/**
 * Delete an Purchasing
 */
exports.delete = function(req, res) {
	var purchasing = req.purchasing ;

	purchasing.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(purchasing);
		}
	});
};

/**
 * List of Purchasings
 */
exports.list = function(req, res) { 
	Purchasing.find().sort('-created').populate('user', 'displayName').exec(function(err, purchasings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(purchasings);
		}
	});
};

/**
 * Purchasing middleware
 */
exports.purchasingByID = function(req, res, next, id) { 
	Purchasing.findById(id).populate('user', 'displayName').exec(function(err, purchasing) {
		if (err) return next(err);
		if (! purchasing) return next(new Error('Failed to load Purchasing ' + id));
		req.purchasing = purchasing ;
		next();
	});
};

/**
 * Purchasing authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.purchasing.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
