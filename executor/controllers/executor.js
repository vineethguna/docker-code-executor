var executorMapper = require('../modules/codeexecutors/executorMapper');

var isValidLanguage = function(language){
    var validLanguages = ['c', 'python', 'ruby'];
    var index = validLanguages.indexOf(language);
    return index != -1
};


var chooseExecutor = function(language){
    if(language == undefined || !isValidLanguage(language)){
        throw Error('Language is undefined or not valid');
    }

    switch(language){
        case 'c':
            return new executorMapper['c'];
            break;
        case 'python':
            return new executorMapper['python'];
            break;
        case 'ruby':
            return new executorMapper['ruby'];
            break;
    }
};

module.exports = {
    chooseExecutor: chooseExecutor
};