module.exports = {
    'c': {
        executorModule: require('./cExecutor'),
        extension: '.c'
    },
    'python':{
        executorModule: require('./pythonExecutor'),
        extension: '.py'
    },
    'ruby': {
        executorModule: require('./rubyExecutor'),
        extension: '.rb'
    }
};