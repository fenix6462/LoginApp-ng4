angular.module('loginapp').controller('ProfileController', function($scope, $http) {

	$scope.user = {};
	$scope.isLoading = true;
	$scope.info = {
		message: '',
		type: ''
	}

	$http.get('/api/profile').then(function(response){
		$scope.user = response.data;
		$scope.isLoading = false;
	}, function(){
		$scope.info = {
			message: 'Wystąpił błąd podczas ładowania informacji o profilu',
			type: 'error'
		}
		console.error('Get profile error');
		$scope.isLoading = false;
	})

	$scope.edit = function(){
		if($scope.isLoading){
			return;
		}
		$scope.info = {};
		$scope.isLoading = true;
		$http.put('/api/profile', $scope.user).then(function(response){
			$scope.user = response.data;
			$scope.isLoading = false;
			$scope.info = {
				message: 'Profil został zaktualizowany',
				type: 'success'
			}
		}, function(){
			$scope.info = {
				message: 'Wystąpił błąd podczas aktualizacji profilu',
				type: 'error'
			}
			console.error('Edit profile error');
			$scope.isLoading = false;
		})
	}

});