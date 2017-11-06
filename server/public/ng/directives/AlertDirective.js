angular.module('loginapp').directive('alert', function() {
    return {
        scope: {
            type: '@type',
            message: '@message'
        },
        template: '<div class="alert" ng-class="{\'alert-success\': type == \'success\', \'alert-danger\': type == \'error\'}" role="alert">{{ message }}</div>'
    };
});