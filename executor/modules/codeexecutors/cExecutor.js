var fs = require('fs');
var helpers = require('../helpers');

var cExecutor = function(){};

cExecutor.prototype.executeCommand = function(filePath, callback){

};

cExecutor.prototype.execute = function(filePath, callback){
    if(filePath == undefined || callback == undefined){
        throw Error('Few parameters are undefined');
    } else if(callback != undefined && typeof callback != 'function') {
        throw Error('The callback passed is not a function');
    } else if(!fs.statSync(filePath).isFile()) {
        callback(Error('The given file path is not valid'));
    }

    if(!helpers.isCommandInPath('gcc')){
        callback(Error('Gcc is not found in path'));
    }
    this.executeCommand(filePath, callback);
};

module.exports = cExecutor;
