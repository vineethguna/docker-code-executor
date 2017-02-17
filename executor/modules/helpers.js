var child_process = require('child_process');
var _ = require('lodash');
var format = require('util').format;
var config = require('../config');

var isCommandInPath = function(command){
    if(command == undefined){
        throw Error('Command is undefined');
    }

    try {
        child_process.execSync(format('which %s', command));
        return true;
    } catch(e) {
        return false;
    }
};

var executeCommandsInSeries = function(commands, callback){
    var stdoutData = '', stderrData = '';

    if(commands == undefined || !_.isArray(commands)) {
        throw Error('Parameters are either undefined or not expected');
    } else if(!_.isFunction(callback)){
        throw Error('The callback passed is not a function');
    }
    else if(commands.length == 0) {
        throw Error('No commands given');
    }

    //TODO: The below code should be tested
    var series = function(commands, callback){
        if(commands.length == 0){
            callback(null, stderrData, stdoutData);
        } else {
            var command = commands.shift();
            child_process.exec(command, {timeout: config.timeout}, function(error, stdout, stderr){
                stderrData += stderr || '';
                stdoutData += stdout || '';
                if(error){
                    callback(error, stderrData);
                } else {
                    series(commands, callback);
                }
            });
        }
    };
    series(commands, callback);
};

function addInputRedirectionToCommand(command, inputFilePath){
    if (inputFilePath){
        return command + ' < ' + inputFilePath + ' ';
    } else{
        return command;
    }
}


var stripFilePathFromMessage = function(filePath, message){
    if(filePath && message){
        return message.replace(new RegExp(filePath, 'g'), '');
    }
    return message;
};

module.exports = {
    isCommandInPath: isCommandInPath,
    executeCommandsInSeries: executeCommandsInSeries,
    stripFilePathFromMessage: stripFilePathFromMessage,
    addInputRedirectionToCommand: addInputRedirectionToCommand
};
