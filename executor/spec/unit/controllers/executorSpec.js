var executor = require('../../../controllers/executor');
var cExecutor = require('../../../modules/codeexecutors/cExecutor');
var pythonExecutor = require('../../../modules/codeexecutors/pythonExecutor');
var rubyExecutor = require('../../../modules/codeexecutors/rubyExecutor');

describe('controllers/executor.js', function(){
    describe('Prototype executor', function(){
        describe('constructor function', function(){
            it('should set language property', function(){
                var executorObj = new executor('random');
                expect(executorObj.language).toBe('random');
            });
        });

        describe('chooseExecutor function', function(){

            it('executor should be a function', function(){
                var executorObj = new executor('random');
                expect(typeof executorObj.chooseExecutor).toBe('function');
            });

            it('should throw error if language is not passed', function(){
                var executorObj = new executor();
                expect(function(){ executorObj.chooseExecutor(); }).toThrowError(Error,
                    'Language is undefined or not valid');
            });

            it('should throw error if language is other than c,python,ruby', function(){
                var executorObj = new executor('random');
                expect(function(){ executorObj.chooseExecutor(); }).toThrowError(Error,
                    'Language is undefined or not valid');
            });

            it('should not throw an error if language is either c,python,ruby', function(){
                var allowedLanguages = ['c', 'python', 'ruby'];
                for(var i = 0; i < allowedLanguages.length; i++){
                    (function(language){
                        var executorObj = new executor(language);
                        expect(function(){ executorObj.chooseExecutor(); }).not.toThrowError();
                    })(allowedLanguages[i]);
                }
            });

            it('should give an object of class cExecutor if language is C', function(){
                var executorObj = new executor('c');
                var cExecutorObj = executorObj.chooseExecutor();
                expect(cExecutorObj instanceof cExecutor).toBe(true);
            });

            it('should give an object of class pythonExecutor if language is python', function(){
                var executorObj = new executor('python');
                var pythonExecutorObj = executorObj.chooseExecutor();
                expect(pythonExecutorObj instanceof pythonExecutor).toBe(true);
            });

            it('should give an object of class rubyExecutor if language is ruby', function(){
                var executorObj = new executor('ruby');
                var rubyExecutorObj = executorObj.chooseExecutor();
                expect(rubyExecutorObj instanceof rubyExecutor).toBe(true);
            });
        });

        describe('execute function', function(){
            var executorObjValid, executorObjInValid, validCallback;

            beforeEach(function(){
                executorObjValid = new executor('c');
                executorObjInValid = new executor('random');
                spyOn(executorObjValid, 'chooseExecutor').and.callThrough();
                spyOn(executorObjInValid, 'chooseExecutor').and.callThrough();
                validCallback = jasmine.createSpy('validCallback');
            });

            it('should throw error if code parameter is undefined', function(){
                expect(function(){executorObjValid.execute()}).toThrowError(Error, 'Code parameter is not a string');
                expect(function(){executorObjValid.execute(1)}).toThrowError(Error, 'Code parameter is not a string');
                expect(function(){executorObjValid.execute(function(){})}).toThrowError(Error,
                    'Code parameter is not a string');
                expect(function(){executorObjValid.execute({})}).toThrowError(Error, 'Code parameter is not a string');
            });

            it('should throw error if input parameter is not a string', function(){
                expect(function(){executorObjValid.execute('sample', 1)}).toThrowError(Error,
                    'Input parameter is not a string');
                expect(function(){executorObjValid.execute('sample', function(){})}).toThrowError(Error,
                    'Input parameter is not a string');
            });

            it('should throw error if callback is not a function', function(){
                expect(function(){executorObjValid.execute('sample', 'sample', 1)}).toThrowError(Error,
                    'The callback passed is not a function');
                expect(function(){executorObjValid.execute('sample', 'sample', 'sample')}).toThrowError(Error,
                    'The callback passed is not a function');
                expect(function(){executorObjValid.execute('sample', 'sample', {})}).toThrowError(Error,
                    'The callback passed is not a function');
            });

            it('should call chooseExecutor function', function(){
                executorObjValid.execute('sample', null, validCallback);
                expect(executorObjValid.chooseExecutor).toHaveBeenCalled();
                executorObjValid.execute('sample', 'sample', validCallback);
                expect(executorObjValid.chooseExecutor).toHaveBeenCalled();
                executorObjValid.execute('sample', undefined, validCallback);
                expect(executorObjValid.chooseExecutor).toHaveBeenCalled();
            });

            it('should call callback with error if the language is not supported', function(){
                executorObjInValid.execute('sample', 'sample', validCallback);
                expect(validCallback).toHaveBeenCalled();
                expect(validCallback.calls.argsFor(0)).toEqual([Error('Language is undefined or not valid')]);
            });
        });
    });
});
