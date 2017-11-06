angular.module('loginapp').controller('ResetController', function($scope, $http, $location, $state, $timeout) {

	$scope.user = {};
	$scope.isLoading = false;
	$scope.info = {};
	var token = $state.params.token;

	$scope.reset = function() {
		if($scope.isLoading){
			return;
		}
		$scope.info = {};
		$scope.isLoading = true;
		$http.post('/api/auth/reset/' + token, { password: $scope.user.newPassword }).then(function(response){
			$scope.info = {
				message: 'Hasło zostało zmienione. Teraz możesz się zalogować!',
				type: 'success'
			};
			$scope.isLoading = false;
			$timeout(function(){
				$location.path('/login');
			},5000);
		}, function(response){
			$scope.info = {
				message: response.data.error,
				type: 'error'
			};
			$scope.isLoading = false;
		});
	};
});