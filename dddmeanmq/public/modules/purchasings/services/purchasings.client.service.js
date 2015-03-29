'use strict';

//Purchasings service used to communicate Purchasings REST endpoints
angular.module('purchasings').factory('Purchasings', ['$resource',
	function($resource) {
		return $resource('purchasings/:purchasingId', { purchasingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);