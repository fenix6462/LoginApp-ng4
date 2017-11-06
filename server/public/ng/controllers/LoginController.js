angular.module('loginapp').controller('LoginController', function($scope, $http, $location, $window) {

	$scope.user = {};
	$scope.isLoading = false;
	$scope.info = {};

	$scope.login = function() {
		if($scope.isLoading){
			return;
		}
		$scope.info = {};
		$scope.isLoading = true;
		$http.post('/api/auth/login', { email: $scope.email, password: $scope.password }).then(function(response){
			if (response.data.token) {
				// store email and token in local storage to keep user logged in between page refreshes
				localStorage.setItem('token', response.data.token);

				// add jwt token to auth header for all requests made by the $http service
				$http.defaults.headers.common.Authorization = response.data.token;

				// execute callback with true to indicate successful login
				$location.path('/');
			} else {
				$scope.info = {
					message: 'Wystąpił błąd podczas logowania',
					type: 'error'
				};
				$scope.isLoading = false;
			}
		}, function(response){
			$scope.info = {
				message: response.data.error,
				type: 'error'
			};
			$scope.isLoading = false;
		});
	};
});