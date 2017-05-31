'use strict';

/**
 * Created by Joshua Baert on 12/1/2016.
 */

angular.module('upKeep', ['ui.router', 'ngMaterial']).config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/', '/home');
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: './views/login.html'
	}).state('user', {
		url: '/',
		templateUrl: './views/user.html'
	}).state('user.settings', {
		url: "settings",
		templateUrl: './views/settings.html'
	}).state('user.home', {
		url: "",
		templateUrl: './views/home.html'
	}).state('user.home.new', {
		url: "home",
		templateUrl: './views/side/newList.html'
	}).state('user.home.edit', {
		url: 'home/edit/:listIndex',
		templateUrl: './views/side/editList.html',
		reload: true
	}).state('user.list', {
		url: '',
		templateUrl: './views/list.html'
	}).state('user.list.new', {
		url: 'list/:listIndex',
		templateUrl: './views/side/newItem.html'
	}).state('user.list.edit', {
		url: 'list/:listIndex/:itemIndex',
		templateUrl: './views/side/editItem.html'
	});
	$urlRouterProvider.otherwise('/login');
});
'use strict';

/**
 * Created by Joshua Baert on 12/2/2016.
 */

var openSpeed = 500;
var openWidth = '100vw';

angular.module('upKeep').directive('getUser', function () {
	return {
		restrict: 'E',
		link: function link(scope, element, attrs) {
			scope.getUser();
		}
	};
}).directive('closeCreate', function () {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			$(element).on('click', function () {
				$('.side-panel').css('width', '0');
			});
		}
	};
}).directive('openCreate', function () {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			$(element).on('click', function () {
				setTimeout(function () {
					$('.side-panel').css('width', openWidth);
				}, openSpeed);
			});
		}
	};
}).directive('autoOpenCreate', function () {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			$(document).ready(function () {
				setTimeout(function () {
					$('.side-panel').css('width', openWidth);
				}, openSpeed);
			});
		}
	};
}).directive('getUser', function () {
	return {
		restrict: 'EA',
		link: function link(scope, element, attrs) {
			scope.getUser();
		}
	};
}).directive('datePicker', function () {
	$('.date-picker').datepicker({
		changeMonth: true,
		changeYear: true
	});
});
'use strict';

/**
 * Created by Joshua Baert on 12/3/2016.
 */

angular.module('upKeep').controller('listsCtrl', function ($scope, $stateParams, $state, mainSvc) {

	$scope.sizes = ["Home", "Car", "Female", "Truck"];

	$scope.newItem = {
		name: undefined,
		date: undefined,
		description: undefined
	};

	$scope.goHome = function () {
		setTimeout(function () {
			$state.go('user.home.new', { reload: true });
			$scope.getUser();
		}, 650);
	};

	$scope.goList = function () {
		setTimeout(function () {
			$state.go('user.list', { listIndex: $stateParams.listIndex }, { reload: true });
			$scope.getUser();
		}, 650);
	};

	$scope.getUser = function () {

		mainSvc.getUser().then(function (res) {
			$scope.user = res;

			$scope.list = $scope.user.lists[$stateParams.listIndex];
			if ($stateParams.itemIndex) {
				$scope.editItem = $scope.user.lists[$stateParams.listIndex].items[$stateParams.itemIndex];

				$scope.editItem.date = new Date($scope.editItem.date);
			}
		});
	};

	$scope.postItem = function () {
		if ($scope.newItem.name && $scope.newItem.date) {
			mainSvc.postItem($scope.list.id, $scope.newItem.name, $scope.newItem.date, $scope.newItem.description);
			$state.reload();
			swal({
				title: 'Added new Item',
				type: 'success',
				timer: 750,
				showConfirmButton: false
			});
		} else {
			swal({
				title: 'You need both Name and Date',
				type: 'error'
			});
		}
	};

	$scope.putList = function () {
		if ($scope.list.name && $scope.list.icon) {
			mainSvc.putList($scope.list.id, $scope.list.name, $scope.list.icon);
			$scope.goHome();
			swal({
				title: 'Updated list',
				type: 'success',
				timer: 750,
				showConfirmButton: false
			});
		} else {
			swal({
				title: 'You need both Name and Icon',
				type: 'error'
			});
		}
	};

	$scope.putItem = function () {
		if ($scope.editItem.name && $scope.editItem.date) {
			mainSvc.putItem($scope.editItem.id, $scope.editItem.name, $scope.editItem.date, $scope.editItem.description);
			$state.reload();
			swal({
				title: 'Updated item',
				type: 'success',
				timer: 750,
				showConfirmButton: false
			});
			$state.go('user.home.new');
		} else {
			swal({
				title: 'You need both Name and Date',
				type: 'error'
			});
		}
	};

	$scope.deleteList = function () {
		swal({
			title: 'Are you sure you wanna delete this List',
			text: 'You cannot come back form this!!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it.',
			closeOnConfirm: false
		}, function () {
			mainSvc.deleteList($scope.list.id);
			swal({
				title: 'Deleted List',
				type: 'success',
				timer: 750,
				showConfirmButton: false
			});
			setTimeout(function () {
				$scope.getUser();
				$state.go('user.home.new');
			}, 750);
		});
	};

	$scope.deleteItem = function () {
		swal({
			title: 'Are you sure you wanna delete this Item',
			text: 'You cannot come back form this!!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it.',
			closeOnConfirm: false
		}, function () {
			mainSvc.deleteItem($scope.editItem.id);
			swal({
				title: 'Deleted item',
				type: 'success',
				timer: 750,
				showConfirmButton: false
			});
			setTimeout(function () {
				$scope.getUser();
				$state.go('user.list.new', { listIndex: $stateParams.listIndex }, { reload: true });
			}, 750);
		});
	};

	$scope.getUser();

	$scope.listIndex = $stateParams.listIndex;
});
'use strict';

/**
 * Created by Joshua Baert on 12/1/2016.
 */

angular.module('upKeep').controller('mainCtrl', function ($scope, mainSvc, $http, $state) {

	$scope.dummy = function () {
		$http.post('/dummy').then(function (res) {
			console.log('tried to go home');
			$state.go('user.home');
		});
	};
});
'use strict';

/**
 * Created by Joshua Baert on 12/2/2016.
 */

angular.module('upKeep').controller('userCtrl', function ($scope, mainSvc, $stateParams, $state) {

	$scope.newList = {
		name: undefined,
		icon: undefined
	};

	$scope.icon = ["Home", "Car", "Female", "Truck"];

	$scope.goHome = function () {
		setTimeout(function () {
			$state.go('user.home.new', { reload: true });
			$scope.getUser();
		}, 650);
	};

	$scope.goHomeNow = function () {
		setTimeout(function () {
			$state.go('user.home.new', { reload: true });
			$scope.getUser();
		}, 100);
	};

	$scope.getUser = function () {

		mainSvc.getUser().then(function (res) {
			$scope.user = res;
		});
	};

	$scope.postList = function () {
		if ($scope.newList.name && $scope.newList.icon) {
			mainSvc.postList($scope.newList.name, $scope.newList.icon);
			$state.reload();
			swal({
				title: 'List Added',
				type: 'success',
				timer: 750,
				showConfirmButton: false
			});
		} else {
			swal({
				title: 'You need both Name and Icon',
				type: 'error'
			});
		}
	};

	$scope.putUser = function () {
		if (!$scope.user.phoneNumber) {
			$scope.user.allowText = false;
		}
		if ($scope.user.firstName && $scope.user.lastName && $scope.user.email) {

			mainSvc.putUser($scope.user.firstName, $scope.user.lastName, $scope.user.email, $scope.user.phoneNumber, $scope.user.allowEmail, $scope.user.allowText);
			swal({
				title: 'We have saved your Settings',
				type: 'success',
				timer: 750,
				showConfirmButton: false
			});
			$scope.goHome();
		} else {
			swal({
				title: 'You need to have First Name, Last Name & Email',
				type: 'error'
			});
		}
	};

	$scope.logout = function () {
		swal({
			title: 'Do you wanna logout?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Buh Bye',
			closeOnConfirm: false
		}, function () {
			mainSvc.logout();
		});
	};

	$scope.index = $stateParams.listIndex;

	$scope.getUser();
});
'use strict';

/**
 * Created by Joshua Baert on 12/1/2016.
 */

var user = {
	changed: true,
	logout: false
};

angular.module('upKeep').service('mainSvc', function ($http, $q, $state) {

	function getUser() {

		console.log('Getting user.');

		var gotUser = false;
		var gotLists = false;
		var gotItems = false;

		var ur;
		var ls;
		var it;

		var defer = $q.defer();

		function giveUser(ur, ls, it) {

			if (gotItems && gotLists && gotUser) {

				user.id = ur.id;
				user.firstName = ur.first_name;
				user.lastName = ur.last_name;
				user.allowEmail = ur.allow_emails;
				user.allowText = ur.allow_texts;
				user.phoneNumber = ur.phone;
				user.email = ur.email;
				user.lists = [];

				ls.forEach(function (e, i) {
					var items = [];

					it.forEach(function (ele, ind) {
						if (ele.list_id === e.id) {
							items.push({
								id: ele.id,
								name: ele.item_name,
								date: parseInt(ele.date),
								description: ele.description
							});
						}
					});

					user.lists.push({
						id: e.id,
						name: e.list_name,
						icon: e.icon,
						items: items
					});
				});

				defer.resolve(user);
			}
		}

		$http.get('/api/user').then(function (res) {
			if (typeof res.data === 'string' || user.logout) {
				console.log('Redirect thrown');
				$state.go('login');
			} else {
				ur = res.data;
				gotUser = true;
				giveUser(ur, ls, it);
			}
		});
		$http.get('/api/lists').then(function (res) {
			ls = res.data;
			gotLists = true;
			giveUser(ur, ls, it);
		});
		$http.get('/api/items').then(function (res) {
			it = res.data;
			gotItems = true;
			giveUser(ur, ls, it);
		});
		return defer.promise;
	}

	this.getUser = function () {

		var defer = $q.defer();

		if (user.changed) {
			user.changed = false;
			getUser().then(function (res) {
				defer.resolve(res);
			});
		} else {
			defer.resolve(user);
		}

		return defer.promise;
	};

	this.postList = function (name, icon) {
		user.changed = true;
		var list = {
			userId: user.id,
			name: name,
			icon: icon
		};

		$http.post('/api/lists', list);
	};

	this.postItem = function (listId, name, date, description) {
		user.changed = true;
		user.lists.forEach(function (e, i) {
			if (e.id = listId) {
				e.items.push({
					userId: user.id,
					listId: listId,
					name: name,
					date: date,
					description: description
				});
			}
		});
		$http.post('/api/item', {
			userId: user.id,
			listId: listId,
			name: name,
			date: date,
			description: description
		});
	};

	this.putUser = function (first, last, email, phone, aEmail, aText) {
		user.changed = true;
		$http.put('/api/user', {
			userId: user.id,
			firstName: first,
			lastName: last,
			email: email,
			phoneNumber: phone,
			allowEmail: aEmail,
			allowText: aText
		});
	};

	this.putList = function (listId, name, icon) {
		user.changed = true;
		$http.put('/api/list', {
			listId: listId,
			name: name,
			icon: icon
		});
	};

	this.putItem = function (itemId, name, date, description) {
		user.changed = true;
		$http.put('/api/item', {
			itemId: itemId,
			name: name,
			date: date,
			description: description
		});
	};

	this.deleteList = function (listId) {
		user.changed = true;
		user.lists.forEach(function (e, i) {
			if (e.id == listId) {
				user.lists.splice(i, 1);
			}
		});
		$http.delete('/api/list/' + listId);
	};

	this.deleteItem = function (itemId) {
		user.changed = true;
		console.log('hit Svc with ' + itemId);
		$http.delete('/api/item/' + itemId);
	};

	this.logout = function () {
		$http.get('/logout').then(function (res) {
			user.logout = true;
			if (typeof res.data === 'string') {
				swal({
					title: 'You are now logged out',
					type: 'success',
					timer: 2000,
					showConfirmButton: false
				});
				$state.go('login');
			}
		});
	};
});
'use strict';

/**
 * Created by Joshua Baert on 12/9/2016.
 */
/*
 * jQuery Dropdown: A simple dropdown plugin
 *
 * Contribute: https://github.com/claviska/jquery-dropdown
 *
 * @license: MIT license: http://opensource.org/licenses/MIT
 *
 */
if (jQuery) (function ($) {

	$.extend($.fn, {
		jqDropdown: function jqDropdown(method, data) {

			switch (method) {
				case 'show':
					show(null, $(this));
					return $(this);
				case 'hide':
					hide();
					return $(this);
				case 'attach':
					return $(this).attr('data-jq-dropdown', data);
				case 'detach':
					hide();
					return $(this).removeAttr('data-jq-dropdown');
				case 'disable':
					return $(this).addClass('jq-dropdown-disabled');
				case 'enable':
					hide();
					return $(this).removeClass('jq-dropdown-disabled');
			}
		}
	});

	function show(event, object) {

		var trigger = event ? $(this) : object,
		    jqDropdown = $(trigger.attr('data-jq-dropdown')),
		    isOpen = trigger.hasClass('jq-dropdown-open');

		// In some cases we don't want to show it
		if (event) {
			if ($(event.target).hasClass('jq-dropdown-ignore')) return;

			event.preventDefault();
			event.stopPropagation();
		} else {
			if (trigger !== object.target && $(object.target).hasClass('jq-dropdown-ignore')) return;
		}
		hide();

		if (isOpen || trigger.hasClass('jq-dropdown-disabled')) return;

		// Show it
		trigger.addClass('jq-dropdown-open');
		jqDropdown.data('jq-dropdown-trigger', trigger).show();

		// Position it
		position();

		// Trigger the show callback
		jqDropdown.trigger('show', {
			jqDropdown: jqDropdown,
			trigger: trigger
		});
	}

	function hide(event) {

		// In some cases we don't hide them
		var targetGroup = event ? $(event.target).parents().addBack() : null;

		// Are we clicking anywhere in a jq-dropdown?
		if (targetGroup && targetGroup.is('.jq-dropdown')) {
			// Is it a jq-dropdown menu?
			if (targetGroup.is('.jq-dropdown-menu')) {
				// Did we click on an option? If so close it.
				if (!targetGroup.is('A')) return;
			} else {
				// Nope, it's a panel. Leave it open.
				return;
			}
		}

		// Hide any jq-dropdown that may be showing
		$(document).find('.jq-dropdown:visible').each(function () {
			var jqDropdown = $(this);
			jqDropdown.hide().removeData('jq-dropdown-trigger').trigger('hide', { jqDropdown: jqDropdown });
		});

		// Remove all jq-dropdown-open classes
		$(document).find('.jq-dropdown-open').removeClass('jq-dropdown-open');
	}

	function position() {

		var jqDropdown = $('.jq-dropdown:visible').eq(0),
		    trigger = jqDropdown.data('jq-dropdown-trigger'),
		    hOffset = trigger ? parseInt(trigger.attr('data-horizontal-offset') || 0, 10) : null,
		    vOffset = trigger ? parseInt(trigger.attr('data-vertical-offset') || 0, 10) : null;

		if (jqDropdown.length === 0 || !trigger) return;

		// Position the jq-dropdown relative-to-parent...
		if (jqDropdown.hasClass('jq-dropdown-relative')) {
			jqDropdown.css({
				left: jqDropdown.hasClass('jq-dropdown-anchor-right') ? trigger.position().left - (jqDropdown.outerWidth(true) - trigger.outerWidth(true)) - parseInt(trigger.css('margin-right'), 10) + hOffset : trigger.position().left + parseInt(trigger.css('margin-left'), 10) + hOffset,
				top: trigger.position().top + trigger.outerHeight(true) - parseInt(trigger.css('margin-top'), 10) + vOffset
			});
		} else {
			// ...or relative to document
			jqDropdown.css({
				left: jqDropdown.hasClass('jq-dropdown-anchor-right') ? trigger.offset().left - (jqDropdown.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset,
				top: trigger.offset().top + trigger.outerHeight() + vOffset
			});
		}
	}

	$(document).on('click.jq-dropdown', '[data-jq-dropdown]', show);
	$(document).on('click.jq-dropdown', hide);
	$(window).on('resize', position);
})(jQuery);
//# sourceMappingURL=maps/bundle.js.map
