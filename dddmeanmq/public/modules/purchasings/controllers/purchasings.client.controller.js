'use strict';

// Purchasings controller
angular.module('purchasings').controller('PurchasingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Purchasings',
	function($scope, $stateParams, $location, Authentication, Purchasings) {
		$scope.authentication = Authentication;

		// Create new Purchasing
		$scope.create = function() {
			// Create new Purchasing object
			var purchasing = new Purchasings ({
				name: this.name
			});

			// Redirect after save
			purchasing.$save(function(response) {
				$location.path('purchasings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Purchasing
		$scope.remove = function(purchasing) {
			if ( purchasing ) { 
				purchasing.$remove();

				for (var i in $scope.purchasings) {
					if ($scope.purchasings [i] === purchasing) {
						$scope.purchasings.splice(i, 1);
					}
				}
			} else {
				$scope.purchasing.$remove(function() {
					$location.path('purchasings');
				});
			}
		};

		// Update existing Purchasing
		$scope.update = function() {
			var purchasing = $scope.purchasing;

			purchasing.$update(function() {
				$location.path('purchasings/' + purchasing._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Purchasings
		$scope.find = function() {
			$scope.purchasings = Purchasings.query();
		};

		// Find existing Purchasing
		$scope.findOne = function() {
			$scope.purchasing = Purchasings.get({ 
				purchasingId: $stateParams.purchasingId
			});
		};
	}
]);