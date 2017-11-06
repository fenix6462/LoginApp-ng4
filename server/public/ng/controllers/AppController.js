angular.module('loginapp').controller('AppController', function($scope, $rootScope, $location, $http, AuthenticationService, $state) {


	
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		$scope.currentUser = AuthenticationService.currentUser();
		$scope.isLoggedIn = AuthenticationService.isLoggedIn();
		
		if ($scope.currentUser) {
			$http.defaults.headers.common.Authorization = AuthenticationService.getToken();
		}

		var publicPages = ['/login', '/register', '/forgot', '/reset/:token', '/'];
		var authPages = ['/login', '/register', '/forgot', '/reset'];
		var restrictedPage = publicPages.indexOf(toState.url) === -1;
		var authPage = authPages.indexOf(toState.url) > -1;
		if (restrictedPage && !$scope.isLoggedIn) {
			$location.path('/login');
		} else if(authPage && $scope.isLoggedIn){
			$location.path('/');
		}
	  });
	$scope.logout = function(){
		$scope.isLoggedIn = false;
		$scope.currentUser = {};
		AuthenticationService.Logout();	
	}

});