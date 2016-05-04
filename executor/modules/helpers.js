var child_process = require('child_process');
var format = require('util').format;

var isCommandInPath = function(command){
    if(command == undefined){
        throw Error('Command is undefined');
    }

    try {
        child_process.execSync(format('where %s', command));
        return true;
    } catch(e) {
        return false;
    }
};

module.exports = {
    isCommandInPath: isCommandInPath
};