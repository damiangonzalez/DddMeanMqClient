'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Purchasing = mongoose.model('Purchasing'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, purchasing;

/**
 * Purchasing routes tests
 */
describe('Purchasing CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Purchasing
		user.save(function() {
			purchasing = {
				name: 'Purchasing Name'
			};

			done();
		});
	});

	it('should be able to save Purchasing instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Purchasing
				agent.post('/purchasings')
					.send(purchasing)
					.expect(200)
					.end(function(purchasingSaveErr, purchasingSaveRes) {
						// Handle Purchasing save error
						if (purchasingSaveErr) done(purchasingSaveErr);

						// Get a list of Purchasings
						agent.get('/purchasings')
							.end(function(purchasingsGetErr, purchasingsGetRes) {
								// Handle Purchasing save error
								if (purchasingsGetErr) done(purchasingsGetErr);

								// Get Purchasings list
								var purchasings = purchasingsGetRes.body;

								// Set assertions
								(purchasings[0].user._id).should.equal(userId);
								(purchasings[0].name).should.match('Purchasing Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Purchasing instance if not logged in', function(done) {
		agent.post('/purchasings')
			.send(purchasing)
			.expect(401)
			.end(function(purchasingSaveErr, purchasingSaveRes) {
				// Call the assertion callback
				done(purchasingSaveErr);
			});
	});

	it('should not be able to save Purchasing instance if no name is provided', function(done) {
		// Invalidate name field
		purchasing.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Purchasing
				agent.post('/purchasings')
					.send(purchasing)
					.expect(400)
					.end(function(purchasingSaveErr, purchasingSaveRes) {
						// Set message assertion
						(purchasingSaveRes.body.message).should.match('Please fill Purchasing name');
						
						// Handle Purchasing save error
						done(purchasingSaveErr);
					});
			});
	});

	it('should be able to update Purchasing instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Purchasing
				agent.post('/purchasings')
					.send(purchasing)
					.expect(200)
					.end(function(purchasingSaveErr, purchasingSaveRes) {
						// Handle Purchasing save error
						if (purchasingSaveErr) done(purchasingSaveErr);

						// Update Purchasing name
						purchasing.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Purchasing
						agent.put('/purchasings/' + purchasingSaveRes.body._id)
							.send(purchasing)
							.expect(200)
							.end(function(purchasingUpdateErr, purchasingUpdateRes) {
								// Handle Purchasing update error
								if (purchasingUpdateErr) done(purchasingUpdateErr);

								// Set assertions
								(purchasingUpdateRes.body._id).should.equal(purchasingSaveRes.body._id);
								(purchasingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Purchasings if not signed in', function(done) {
		// Create new Purchasing model instance
		var purchasingObj = new Purchasing(purchasing);

		// Save the Purchasing
		purchasingObj.save(function() {
			// Request Purchasings
			request(app).get('/purchasings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Purchasing if not signed in', function(done) {
		// Create new Purchasing model instance
		var purchasingObj = new Purchasing(purchasing);

		// Save the Purchasing
		purchasingObj.save(function() {
			request(app).get('/purchasings/' + purchasingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', purchasing.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Purchasing instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Purchasing
				agent.post('/purchasings')
					.send(purchasing)
					.expect(200)
					.end(function(purchasingSaveErr, purchasingSaveRes) {
						// Handle Purchasing save error
						if (purchasingSaveErr) done(purchasingSaveErr);

						// Delete existing Purchasing
						agent.delete('/purchasings/' + purchasingSaveRes.body._id)
							.send(purchasing)
							.expect(200)
							.end(function(purchasingDeleteErr, purchasingDeleteRes) {
								// Handle Purchasing error error
								if (purchasingDeleteErr) done(purchasingDeleteErr);

								// Set assertions
								(purchasingDeleteRes.body._id).should.equal(purchasingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Purchasing instance if not signed in', function(done) {
		// Set Purchasing user 
		purchasing.user = user;

		// Create new Purchasing model instance
		var purchasingObj = new Purchasing(purchasing);

		// Save the Purchasing
		purchasingObj.save(function() {
			// Try deleting Purchasing
			request(app).delete('/purchasings/' + purchasingObj._id)
			.expect(401)
			.end(function(purchasingDeleteErr, purchasingDeleteRes) {
				// Set message assertion
				(purchasingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Purchasing error error
				done(purchasingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Purchasing.remove().exec();
		done();
	});
});