var cExecutor = function(){};

cExecutor.prototype.execute = function(){
    throw Error('File path is undefined');
};

module.exports = cExecutor;
