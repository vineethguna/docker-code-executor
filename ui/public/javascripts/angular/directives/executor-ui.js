angular.module('executor-ui.directives')
    .directive('loadingBar', function(){
        function link(){
            componentHandler.upgradeAllRegistered();
        }

        return {
            templateUrl: '/javascripts/angular/directives/templates/loading.html',
            link: link,
            scope: {
                show: '=show',
                loadingText: '=loadingText'
            },
            restrict: 'E'
        }
    });
