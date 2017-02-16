var _ = require('lodash');
var async = require('async');
var tmp = require('tmp');
var fs = require('fs');
var stripFilePathFromMessage = require('../modules/helpers').stripFilePathFromMessage;
var executorMapper = require('../modules/codeexecutors/executorMapper');
var config = require('../config');

// Private functions
var isValidLanguage = function(language){
    var validLanguages = ['c', 'python', 'ruby'];
    var index = validLanguages.indexOf(language);
    return index != -1
};

// Prototype definitions
var executor = function(language){
    this.language = language;
};

executor.prototype.constructor = executor;

executor.prototype.chooseExecutor = function(){
    if(this.language == undefined || !isValidLanguage(this.language)){
        throw Error('Language is undefined or not valid');
    }

    switch(this.language){
        case 'c':
            return new executorMapper['c']['executorModule'];
            break;
        case 'python':
            return new executorMapper['python']['executorModule'];
            break;
        case 'ruby':
            return new executorMapper['ruby']['executorModule'];
            break;
    }
};

function createFileAndWrite(data, fileOptions, asyncCallback){
    tmp.file(fileOptions,
    function(err, path, fd, cleanup){
        if (err) {
            asyncCallback(err);
            return;
        }
        fs.write(fd, data, function(err){
            if (err){
                asyncCallback(err);
                return;
            }
            fs.close(fd, function(err){
                if (err){
                    asyncCallback(err);
                } else{
                    asyncCallback(null, {path: path, cleanup: cleanup});
                }
            });
        });
    });
}

executor.prototype.execute = function(code, input, callback){
    if(code == undefined || !_.isString(code)){
        throw Error('Code parameter is not a string');
    }

    if(input && !_.isString(input)){
        throw Error('Input parameter is not a string');
    }

    if(!_.isFunction(callback)){
        throw Error('The callback passed is not a function');
    }

    //TODO: Need to write unit tests for the below function
    try {
        var executorObj = this.chooseExecutor();
        var self = this;
        async.waterfall([
            function(asyncCallback){
                async.parallel({
                    codeFileDetails: function(callback){
                        var fileOptions = {keep: true, dir: config.tmpDir,
                            postfix: executorMapper[self.language]['extension']};
                        createFileAndWrite(code, fileOptions, callback);
                    },
                    inputFileDetails: function(callback){
                        if (input){
                            createFileAndWrite(input, {keep: true, dir: config.tmpDir}, callback);
                            return;
                        }
                        callback(null, null);
                    }
                }, function(err, files) {
                    if (err){
                        asyncCallback(err);
                        return;
                    }
                    asyncCallback(null, files);
                });
            },
            function(files, asyncCallback){
                var inputPath = files.inputFileDetails == undefined ? null : files.inputFileDetails.path;
                executorObj.execute(files.codeFileDetails.path, inputPath,
                function(err, stderr, stdout){
                    if(err){
                        if(err.signal == 'SIGTERM'){
                            err = new Error('Timeout Exceeded');
                        }
                        err.message = stripFilePathFromMessage(files.codeFileDetails.path, err.message);
                    }
                    stderr = stripFilePathFromMessage(files.codeFileDetails.path, stderr);
                    stdout = stripFilePathFromMessage(files.codeFileDetails.path, stdout);
                    asyncCallback(err, stderr, stdout);
                    files.codeFileDetails.cleanup();
                    if(files.inputFileDetails != undefined){
                        files.inputFileDetails.cleanup();
                    }
                });
            }
        ], function(err, stderr, stdout){
            callback(err, stderr, stdout);
        });

    } catch(e) {
        tmp.setGracefulCleanup();
        callback(e);
    }
};

module.exports = executor;