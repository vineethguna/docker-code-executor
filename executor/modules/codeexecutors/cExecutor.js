var fs = require('fs');
var format = require('util').format;
var path = require('path');
var helpers = require('../helpers');

var cExecutor = function(){};

cExecutor.prototype.compileAndExecuteCode = function(filePath, callback){
    if(!helpers.isCommandInPath('gcc')){
        callback(Error('Gcc is not found in path'));
        return;
    }

    var compileCommand = format('gcc -o %s %s', path.join(path.dirname(filePath), path.basename(filePath, '.c')),
        filePath);
    var executeCompiledFileCommand = path.join(path.dirname(filePath), path.basename(filePath, '.c'));
    var deleteCompiledFileCommand = format('rm -f %s', executeCompiledFileCommand);

    helpers.executeCommandsInSeries([compileCommand, executeCompiledFileCommand, deleteCompiledFileCommand], callback);
};

cExecutor.prototype.execute = function(filePath, callback){
    if(filePath == undefined || callback == undefined){
        throw Error('Few parameters are undefined');
    } else if(!fs.statSync(filePath).isFile()) {
        callback(Error('The given file path is not valid'));
        return;
    }

    this.compileAndExecuteCode(filePath, callback);
};

module.exports = cExecutor;
