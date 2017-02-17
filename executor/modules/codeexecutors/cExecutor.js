var fs = require('fs');
var format = require('util').format;
var path = require('path');
var helpers = require('../helpers');

var cExecutor = function(){};

cExecutor.prototype.compileAndExecuteCode = function(codePath, inputPath, callback){
    if(!helpers.isCommandInPath('gcc')){
        callback(Error('Gcc is not found in path'));
        return;
    }
    var executablePath = path.join(path.dirname(codePath), path.basename(codePath, '.c'));
    var compileCommand = format('gcc %s -o %s', codePath, executablePath);
    var executeCompiledFileCommand = helpers.addInputRedirectionToCommand(executablePath, inputPath);

    // TODO: Unit Testing function containing callback function
    helpers.executeCommandsInSeries([compileCommand, executeCompiledFileCommand],
        function(err, stderr, stdout){
            fs.unlink(executablePath, function(err){
                if(err && err.code == 'ENOENT') { console.log('File not found. So Skipping Delete'); }
            });
            callback(err, stderr, stdout);
        }
    );
};

cExecutor.prototype.execute = function(codePath, inputPath, callback){
    if(codePath == undefined || callback == undefined){
        throw Error('Few parameters are undefined');
    } else if(!fs.statSync(codePath).isFile()) {
        callback(Error('The given file path is not valid'));
        return;
    } else if(inputPath && !fs.statSync(inputPath).isFile()){
        callback(Error('The given input path is not valid'));
    }

    this.compileAndExecuteCode(codePath, inputPath, callback);
};

module.exports = cExecutor;
