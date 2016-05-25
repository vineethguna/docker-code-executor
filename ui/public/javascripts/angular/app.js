angular.module('executor-ui', ['ngRoute', 'ui.codemirror', 'executor-ui.controllers', 'executor-ui.directives'])
    .config(['$routeProvider',
        function($routeProvider){
            $routeProvider.
            when('/', {
                templateUrl: 'partials/main.html',
                controller: 'mainCtrl'
            }).
            when('/output', {
                templateUrl: 'partials/output.html',
                controller: 'outputCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
        }

    ]);

// controllers
angular.module('executor-ui.controllers', ['executor-ui.services']);

//services
angular.module('executor-ui.services', []);

//directives
angular.module('executor-ui.directives', []);