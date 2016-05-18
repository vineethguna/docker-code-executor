var fs = require('fs');
var format = require('util').format;
var helpers = require('../helpers');

var pythonExecutor = function(){};

pythonExecutor.prototype.compileAndExecuteCode = function(filePath, callback){
    if(!helpers.isCommandInPath('python')){
        callback(Error('Python is not found in path'));
        return;
    }

    var executeCommand = format('python %s', filePath);

    helpers.executeCommandsInSeries([executeCommand], callback);
};

pythonExecutor.prototype.execute = function(filePath, callback){
    if(filePath == undefined || callback == undefined){
        throw Error('Few parameters are undefined');
    } else if(!fs.statSync(filePath).isFile()) {
        callback(Error('The given file path is not valid'));
    }

    this.compileAndExecuteCode(filePath, callback);
};

module.exports = pythonExecutor;
