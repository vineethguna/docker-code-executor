var _ = require('lodash');
var chooseExecutor = require('../../../controllers/executor').chooseExecutor;
var cExecutor = require('../../../modules/codeexecutors/cExecutor');
var pythonExecutor = require('../../../modules/codeexecutors/pythonExecutor');
var rubyExecutor = require('../../../modules/codeexecutors/rubyExecutor');

describe('Testing controllers/executor.js', function(){
    describe('Testing function chooseExecutor', function(){
        it('executor should be a function', function(){
            expect(typeof chooseExecutor).toBe('function');
        });

        it('should throw error if language is not passed', function(){
            expect(function(){ chooseExecutor(); }).toThrowError(Error, 'Language is undefined or not valid');
        });

        it('should throw error if language is other than c,python,ruby', function(){
            expect(function(){ chooseExecutor('randomLanguage'); }).toThrowError(Error,
                'Language is undefined or not valid');
        });

        it('should not throw an error if language is either c,python,ruby', function(){
            var allowedLanguages = ['c', 'python', 'ruby'];
            for(var i = 0; i < allowedLanguages.length; i++){
                (function(language){
                    expect(function(){ chooseExecutor(allowedLanguages[language]); }).not.toThrowError();
                })(i);
            }
        });

        it('should give an object of class cExecutor if language is C', function(){
            var cExecutorObj = chooseExecutor('c');
            expect(cExecutorObj instanceof cExecutor).toBe(true);
        });

        it('should give an object of class pythonExecutor if language is python', function(){
            var pythonExecutorObj = chooseExecutor('python');
            expect(pythonExecutorObj instanceof pythonExecutor).toBe(true);
        });

        it('should give an object of class rubyExecutor if language is ruby', function(){
            var rubyExecutorObj = chooseExecutor('ruby');
            expect(rubyExecutorObj instanceof rubyExecutor).toBe(true);
        });
    });
});