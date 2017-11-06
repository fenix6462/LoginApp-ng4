angular.module('loginapp').controller('ForgotController', function($scope, $http, $location, $window) {

	$scope.user = {};
	$scope.isLoading = false;
	$scope.info = {};

	$scope.login = function() {
		if($scope.isLoading){
			return;
		}
		$scope.info = {};
		$scope.isLoading = true;
		$http.post('/api/auth/forgot', { email: $scope.email, password: $scope.password }).then(function(response){
			$scope.info = {
				message: 'Wiadomość została wysłana, sprawdź pocztę.',
				type: 'success'
			};
			$scope.isLoading = false;
		}, function(response){
			$scope.info = {
				message: response.data.error,
				type: 'error'
			};
			$scope.isLoading = false;
		});
	};
});