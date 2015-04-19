'use strict';

// Inventories controller
angular.module('inventories').controller('InventoriesController', ['$scope', '$http', '$state', '$stateParams', '$location', 'Authentication', 'Inventories',
    function ($scope, $http, $state, $stateParams, $location, Authentication, Inventories) {
        $scope.authentication = Authentication;

        // Create new Inventory
        $scope.create = function () {
            // Create new Inventory object
            var inventory = new Inventories({
                name: this.name
            });

            // Redirect after save
            inventory.$save(function (response) {
                $location.path('inventories/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Inventory
        $scope.remove = function (inventory) {
            if (inventory) {
                inventory.$remove();

                for (var i in $scope.inventories) {
                    if ($scope.inventories [i] === inventory) {
                        $scope.inventories.splice(i, 1);
                    }
                }
            } else {
                $scope.inventory.$remove(function () {
                    $location.path('inventories');
                });
            }
        };

        // Update existing Inventory
        $scope.update = function () {
            var inventory = $scope.inventory;

            inventory.$update(function () {
                $location.path('inventories/' + inventory._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Inventories
        $scope.find = function () {
            $scope.inventories = Inventories.query();
        };

        // Find existing Inventory
        $scope.findOne = function () {
            $scope.inventory = Inventories.get({
                inventoryId: $stateParams.inventoryId
            });
        };

        $scope.findNew = function () {
            // Todo need to use a resource here
            $http.get('http://damiango7xt1700:8080/api/values/ABC4321').
                success(function (data) {
                    console.log(data);
                    $scope.storageFacility = data;
                });
        };

        $scope.checkout = function () {
            // assemble item ids for checkout clear the cart
            $scope.selectedCartItemsList = [];
            angular.forEach($scope.storageFacility.Inventory.Items, function (x) {
                if (x.selected) {
                    $scope.selectedCartItemsList.push(x.cartItemId);
                }
            });
            $scope.cartItemsList = [];

            // call API to perform "CheckOut"
            var dataObj = {
                'EventType': 'InventoryDomainEventCheckoutItems',
                'SourceDomain': 'ClientApi',
                'TargetDomain': 'Inventory',
                'FacilityId': 'ABC4321',
                'ItemIdsToBeRemovedList': $scope.selectedCartItemsList
            };

            $http.post('http://damiango7xt1700:8080/api/values', dataObj)
                .success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log("post success");
                   $state.reload();
               })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("post fail");
                });
        };

        $scope.itemsAreSelected = function () {
            var result = false;
            if ($scope.storageFacility) {
                angular.forEach($scope.storageFacility.Inventory.Items, function (x) {
                    if (x.selected) {
                        console.log(x);
                        result = true;
                    }
                });
            }

            return result;
        }
    }
]);
