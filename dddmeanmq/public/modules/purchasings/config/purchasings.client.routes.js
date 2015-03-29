'use strict';

//Setting up route
angular.module('purchasings').config(['$stateProvider',
	function($stateProvider) {
		// Purchasings state routing
		$stateProvider.
		state('listPurchasings', {
			url: '/purchasings',
			templateUrl: 'modules/purchasings/views/list-purchasings.client.view.html'
		}).
		state('createPurchasing', {
			url: '/purchasings/create',
			templateUrl: 'modules/purchasings/views/create-purchasing.client.view.html'
		}).
		state('viewPurchasing', {
			url: '/purchasings/:purchasingId',
			templateUrl: 'modules/purchasings/views/view-purchasing.client.view.html'
		}).
		state('editPurchasing', {
			url: '/purchasings/:purchasingId/edit',
			templateUrl: 'modules/purchasings/views/edit-purchasing.client.view.html'
		});
	}
]);