var fs = require('fs');
var format = require('util').format;
var helpers = require('../helpers');

var rubyExecutor = function(){};

rubyExecutor.prototype.compileAndExecuteCode = function(filePath, callback){
    if(!helpers.isCommandInPath('ruby')){
        callback(Error('Ruby is not found in path'));
        return;
    }

    var executeCommand = format('ruby %s', filePath);

    helpers.executeCommandsInSeries([executeCommand], callback);
};

rubyExecutor.prototype.execute = function(filePath, callback){
    if(filePath == undefined || callback == undefined){
        throw Error('Few parameters are undefined');
    } else if(!fs.statSync(filePath).isFile()) {
        callback(Error('The given file path is not valid'));
    }

    this.compileAndExecuteCode(filePath, callback);
};

module.exports = rubyExecutor;
