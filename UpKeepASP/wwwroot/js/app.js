/**
 * Created by Joshua Baert on 12/1/2016.
 */

angular.module('upKeep', ['ui.router', 'ngMaterial'])
	.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.when('/', '/home');
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: './views/login.html'
			})
			.state('user', {
				url: '/',
				templateUrl: './views/user.html',
			})
			.state('user.settings', {
				url: "settings",
				templateUrl: './views/settings.html'
			})
			.state('user.home', {
				url: "",
				templateUrl: './views/home.html'
			})
				.state('user.home.new', {
					url: "home",
					templateUrl: './views/side/newList.html'
				})
				.state('user.home.edit', {
					url: 'home/edit/:listIndex',
					templateUrl: './views/side/editList.html',
					reload: true
				})
			.state('user.list', {
				url: '',
				templateUrl: './views/list.html'
			})
				.state('user.list.new', {
					url: 'list/:listIndex',
					templateUrl: './views/side/newItem.html'
				})
				.state('user.list.edit', {
					url: 'list/:listIndex/:itemIndex',
					templateUrl: './views/side/editItem.html'
				});
		$urlRouterProvider.otherwise('/login');
	});
