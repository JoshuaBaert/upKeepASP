/**
 * Created by Joshua Baert on 12/1/2016.
 */

angular.module('upKeep').controller('mainCtrl', function ($scope, mainSvc, $http, $state) {
	
	$scope.dummy = function () {
		$http.post('/dummy').then(res => {
			console.log('tried to go home');
			$state.go('user.home')
		})
	}
	
});