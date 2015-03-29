'use strict';

// Configuring the Articles module
angular.module('purchasings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Purchasings', 'purchasings', 'dropdown', '/purchasings(/create)?');
		Menus.addSubMenuItem('topbar', 'purchasings', 'List Purchasings', 'purchasings');
		Menus.addSubMenuItem('topbar', 'purchasings', 'New Purchasing', 'purchasings/create');
	}
]);