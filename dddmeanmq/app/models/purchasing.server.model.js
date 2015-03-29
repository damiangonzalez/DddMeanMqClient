'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Purchasing Schema
 */
var PurchasingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Purchasing name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Purchasing', PurchasingSchema);