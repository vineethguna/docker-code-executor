var _ = require('lodash');
var async = require('async');
var tmp = require('tmp');
var fs = require('fs');
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


executor.prototype.execute = function(code, callback){
    if(code == undefined || !_.isString(code)){
        throw Error('Code parameter is not a string');
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
                tmp.file({keep: true, dir: config.tmpDir,
                    postfix: executorMapper[self.language]['extension']}, function(err, path, fd, cleanup){
                    if(err){
                        asyncCallback(err);
                    } else {
                        asyncCallback(null, {fd: fd, path: path, cleanup: cleanup});
                    }
                })
            },

            function(fileDetails, asyncCallback){
                fs.write(fileDetails.fd, code, function(err){
                    if(err){
                        asyncCallback(err);
                    } else {
                        asyncCallback(null, fileDetails);
                    }
                })
            },

            function(fileDetails, asyncCallback){
                fs.close(fileDetails.fd, function(err){
                    if(err){
                        asyncCallback(err);
                    } else {
                        asyncCallback(null, fileDetails);
                    }
                });
            },

            function(fileDetails, asyncCallback){
                executorObj.execute(fileDetails.path, function(err, stderr, stdout){
                    asyncCallback(err, stderr, stdout);
                    fileDetails.cleanup();
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