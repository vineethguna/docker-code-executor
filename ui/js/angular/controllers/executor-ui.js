angular.module('executor-ui.controllers').
    controller('rootCtrl', ['$scope', '$http',
    function($scope, $http){
        $scope.editorOptions = {
            lineNumbers: true,
            theme: 'dracula'
        };

        $scope.setMode = function(){
            $scope.editorOptions.mode = $scope.language;
        };

        $scope.executeCode = function(){
            var code = $scope.code;
            var language;
            if($scope.language == 'clike') {
                language = 'c'
            } else {
                language = $scope.language;
            }

            var reqParams = {
                method: 'POST',
                url: 'http://localhost:3000/api/v1/execute',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        if(obj.hasOwnProperty(p)){
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                    return str.join("&");
                },
                data: {
                    code: code,
                    language: language
                },
                crossDomain: true
            };

            $http(reqParams).then(function(response){
                if(response.data.error){
                    $scope.isError = true;
                    $scope.errorMsg = response.data.errorMsg;
                } else {
                    $scope.isError = false;
                    $scope.output = response.data.output;
                }
                $scope.$watch();
            }, function(response){
                $scope.isError = true;
                $scope.errorMsg = 'Error occured while communuicating with server';
                $scope.$watch();
            });
        };

        $scope.language = 'clike';
        $scope.code = null;
        $scope.isError = false;
        $scope.errorMsg = null;
        $scope.output = null;
        $scope.setMode();
    }
]);