angular.module('loginapp').factory('AuthInterceptor', function($location, $injector, $q) {
    return {
        response: function(response) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                $location.path('/login');
                return $q.reject(response);
            }
            return response || $q.when(response);
        },

        responseError: function(rejection) {
            if (rejection.status === 401) {
                localStorage.removeItem('token');
                $location.path('/login');
                return $q.reject(rejection);
            }
            return $q.reject(rejection);
        }

    };
});
