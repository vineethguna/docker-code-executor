angular.module('executor-ui.controllers').
    controller('mainCtrl', ['$scope', '$http', '$location', 'shareData',
    function($scope, $http, $location, shareData){
        var setDefaultLanguage = function(){
            if(!shareData.getLanguage()){
                shareData.setLanguage('clike');
            }
        };

        var setEditorHeight = function(){
            var editorHeight = window.innerHeight / 2;
            document.getElementById('code-editor').style.height = editorHeight + 'px';
            $scope.editor.setSize(null, editorHeight);
            $scope.editor.refresh();
        };

        $scope.editorOptions = {
            lineNumbers: true,
            theme: 'dracula'
        };

        $scope.codemirrorLoaded = function(editor){
            $scope.editor = editor;
            setEditorHeight();
            $scope.setMode();
        };

        $scope.setMode = function(){
            if($scope.editor){
                $scope.editor.setOption('mode', $scope.language);
                shareData.setLanguage($scope.language);
            }
        };

        $scope.executeCode = function(){
            $scope.loading.show = true;

            var code = $scope.code;
            shareData.setCode($scope.code);

            var language;
            if($scope.language == 'clike') {
                language = 'c'
            } else {
                language = $scope.language;
            }

            var reqParams = {
                method: 'POST',
                url: '/execute',
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
                }
            };

            $http(reqParams).then(function(response){
                if(response.data.error){
                    shareData.setErrorStatus(true);
                    shareData.setOutput(response.data.errorMsg);
                } else {
                    shareData.setErrorStatus(false);
                    shareData.setOutput(response.data.output);
                }
                $scope.loading.show = false;
                $location.path('/output');
            }, function(response){
                shareData.setErrorStatus(true);
                shareData.setOutput('Error occured while communuicating with server');
                $scope.loading.show = false;
                $location.path('/output');
            });
        };

        setDefaultLanguage();
        $scope.language = shareData.getLanguage();

        $scope.code = shareData.getCode();
        $scope.editor = null;

        $scope.loading = {show: false, text: null};
    }
]).
controller('outputCtrl', ['$scope', 'shareData',
    function($scope, shareData){
        $scope.editorOptions = {
            lineNumbers: false,
            theme: 'dracula',
            readOnly: 'nocursor'
        };

        var setEditorHeight = function(){
            var editorHeight = window.innerHeight / 3;
            document.getElementById('output-editor').style.height = editorHeight + 'px';
            $scope.editor.setSize(null, editorHeight + 'px');
            $scope.editor.refresh();
        };

        $scope.codemirrorLoaded = function(editor){
            $scope.editor = editor;
            setEditorHeight();
        };
        
        $scope.language = shareData.getLanguage();
        $scope.output = shareData.getOutput();
        $scope.isError = shareData.getErrorStatus();
        $scope.editor = null;
    }
]);