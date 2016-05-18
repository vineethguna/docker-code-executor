angular.module('executor-ui.services')
    .factory('shareData', [
        function(){
            var code, language, isError, output;
            var service = {};

            service.setCode = function(codeVal){code = codeVal};
            service.setLanguage = function(languageVal){language = languageVal};
            service.setErrorStatus = function(errorStatus){isError = errorStatus};
            service.setOutput = function(outputVal){output = outputVal};

            service.getCode = function(){return code};
            service.getLanguage = function(){return language};
            service.getErrorStatus = function(){return isError};
            service.getOutput = function(){return output};
            
            return service;
        }
    ]);