angular.module('loginapp').factory('AuthenticationService', function($http, $window, $location) {
	
	return {
		getToken: getToken,
		isLoggedIn: isLoggedIn,
		currentUser: currentUser,
		Logout: Logout
	};

    function getToken() {
		return localStorage.getItem('token');
	};

	function isLoggedIn(){
		var token = getToken();
		var payload;

		if(token){
			payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	}

    function currentUser() {
		if(isLoggedIn()){
			var token = getToken();
			var payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);

			return {
				email : payload.email,
				name : payload.name
			};
		}
    };
	
	function Logout() {
		// remove user from local storage and clear http auth header
		localStorage.removeItem('token');
		$http.defaults.headers.common.Authorization = '';
		$location.path('/login');
	}
});