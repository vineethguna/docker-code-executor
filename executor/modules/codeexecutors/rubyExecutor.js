var fs = require('fs');
var format = require('util').format;
var helpers = require('../helpers');

var rubyExecutor = function(){};

rubyExecutor.prototype.compileAndExecuteCode = function(codePath, inputPath, callback){
    if(!helpers.isCommandInPath('ruby')){
        callback(Error('Ruby is not found in path'));
        return;
    }
    var executeCommand = format('ruby %s', codePath);
    executeCommand = helpers.addInputRedirectionToCommand(executeCommand, inputPath);

    helpers.executeCommandsInSeries([executeCommand], callback);
};

rubyExecutor.prototype.execute = function(codePath, inputPath, callback){
    if(codePath == undefined || callback == undefined){
        throw Error('Few parameters are undefined');
    } else if(!fs.statSync(codePath).isFile()) {
        callback(Error('The given file path is not valid'));
    } else if(inputPath && !fs.statSync(inputPath).isFile()){
        callback(Error('The given input path is not valid'));
    }

    this.compileAndExecuteCode(codePath, inputPath, callback);
};

module.exports = rubyExecutor;
