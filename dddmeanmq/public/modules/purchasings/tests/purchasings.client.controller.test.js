'use strict';

(function() {
	// Purchasings Controller Spec
	describe('Purchasings Controller Tests', function() {
		// Initialize global variables
		var PurchasingsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Purchasings controller.
			PurchasingsController = $controller('PurchasingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Purchasing object fetched from XHR', inject(function(Purchasings) {
			// Create sample Purchasing using the Purchasings service
			var samplePurchasing = new Purchasings({
				name: 'New Purchasing'
			});

			// Create a sample Purchasings array that includes the new Purchasing
			var samplePurchasings = [samplePurchasing];

			// Set GET response
			$httpBackend.expectGET('purchasings').respond(samplePurchasings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.purchasings).toEqualData(samplePurchasings);
		}));

		it('$scope.findOne() should create an array with one Purchasing object fetched from XHR using a purchasingId URL parameter', inject(function(Purchasings) {
			// Define a sample Purchasing object
			var samplePurchasing = new Purchasings({
				name: 'New Purchasing'
			});

			// Set the URL parameter
			$stateParams.purchasingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/purchasings\/([0-9a-fA-F]{24})$/).respond(samplePurchasing);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.purchasing).toEqualData(samplePurchasing);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Purchasings) {
			// Create a sample Purchasing object
			var samplePurchasingPostData = new Purchasings({
				name: 'New Purchasing'
			});

			// Create a sample Purchasing response
			var samplePurchasingResponse = new Purchasings({
				_id: '525cf20451979dea2c000001',
				name: 'New Purchasing'
			});

			// Fixture mock form input values
			scope.name = 'New Purchasing';

			// Set POST response
			$httpBackend.expectPOST('purchasings', samplePurchasingPostData).respond(samplePurchasingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Purchasing was created
			expect($location.path()).toBe('/purchasings/' + samplePurchasingResponse._id);
		}));

		it('$scope.update() should update a valid Purchasing', inject(function(Purchasings) {
			// Define a sample Purchasing put data
			var samplePurchasingPutData = new Purchasings({
				_id: '525cf20451979dea2c000001',
				name: 'New Purchasing'
			});

			// Mock Purchasing in scope
			scope.purchasing = samplePurchasingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/purchasings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/purchasings/' + samplePurchasingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid purchasingId and remove the Purchasing from the scope', inject(function(Purchasings) {
			// Create new Purchasing object
			var samplePurchasing = new Purchasings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Purchasings array and include the Purchasing
			scope.purchasings = [samplePurchasing];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/purchasings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePurchasing);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.purchasings.length).toBe(0);
		}));
	});
}());