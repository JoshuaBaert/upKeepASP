/**
 * Created by Joshua Baert on 12/2/2016.
 */

angular.module('upKeep').controller('userCtrl', function ($scope, mainSvc, $stateParams, $state) {
	
	$scope.newList = {
		name: undefined,
		icon: undefined
	};
	
	$scope.icon = [
		"Home",
		"Car",
		"Female",
		"Truck"
	];
	
	$scope.goHome = () => {
		setTimeout(() => {
			$state.go('user.home.new',{reload: true});
			$scope.getUser();
		}, 650);
	};
	
	$scope.goHomeNow = () => {
		setTimeout(() => {
			$state.go('user.home.new',{reload: true});
			$scope.getUser();
		}, 100);
	};
	
	$scope.getUser = function () {
		
		mainSvc.getUser().then((res) => {
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
				showConfirmButton: false,
			});
		} else {
			swal({
				title: 'You need both Name and Icon',
				type: 'error',
			})
		}
	};
	
	
	$scope.putUser = function () {
		if(!$scope.user.phoneNumber) {
			$scope.user.allowText = false
		}
		if ($scope.user.firstName &&
				$scope.user.lastName &&
				$scope.user.email) {
			
			mainSvc.putUser(
				$scope.user.firstName,
				$scope.user.lastName,
				$scope.user.email,
				$scope.user.phoneNumber,
				$scope.user.allowEmail,
				$scope.user.allowText
			);
			swal({
				title: 'We have saved your Settings',
				type: 'success',
				timer: 750,
				showConfirmButton: false,
			});
			$scope.goHome();
		} else {
			swal({
				title: 'You need to have First Name, Last Name & Email',
				type: 'error',
			})
		}
		
	};
	
	
	$scope.logout = function () {
		swal({
			title: 'Do you wanna logout?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Buh Bye',
			closeOnConfirm: false,
		}, function () {
			mainSvc.logout();
		});
		
	};
	
	
	$scope.index = $stateParams.listIndex;
	
	$scope.getUser();
	
});
	