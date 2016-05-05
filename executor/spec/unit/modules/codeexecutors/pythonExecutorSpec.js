var pythonExecutor = require('../../../../modules/codeexecutors/pythonExecutor');
var helpers = require('../../../../modules/helpers');
var fs = require('fs');

describe('modules/codeexecutors/pythonExecutor.js', function(){
    describe('pythonExecutor prototype', function(){
        it('should have execute method', function(){
            var pythonExecutorObj = new pythonExecutor();
            expect(typeof pythonExecutorObj.execute).toBe('function');
        });

        describe('execute method of prototype', function(){
            var fileExistsPath, fileNotExistsPath, pythonExecutorObj, validCallback;
            beforeAll(function(){
                fileExistsPath = '/sample/exists';
                fileNotExistsPath = '/sample/notexists';

                spyOn(fs, 'statSync').and.callFake(function(filePath){
                    if(filePath == fileExistsPath){
                        return {
                            isFile: function(){return true}
                        }
                    } else {
                        return {
                            isFile: function(){return false}
                        }
                    }
                });

            });

            beforeEach(function(){
                pythonExecutorObj = new pythonExecutor();
                validCallback = jasmine.createSpy('validCallback');
                spyOn(helpers, 'isCommandInPath').and.returnValue(true);
                spyOn(pythonExecutorObj, 'compileAndExecuteCode').and.returnValue(null);
            });

            it('should throw error if required parameters are not passed', function(){
                expect(function(){pythonExecutorObj.execute()}).toThrowError(Error, 'Few parameters are undefined');
                expect(function(){pythonExecutorObj.execute(fileExistsPath)}).toThrowError(Error,
                    'Few parameters are undefined')
            });

            it('should call callback with error if file is not found at the given file path', function(){
                pythonExecutorObj.execute(fileNotExistsPath, validCallback);
                expect(validCallback).toHaveBeenCalled();
                expect(validCallback.calls.argsFor(0)).toEqual([Error('The given file path is not valid')]);
            });

            it('should not throw error if the passed parameters are valid', function(){
                expect(function(){pythonExecutorObj.execute(fileExistsPath, validCallback)}).not.toThrowError();
            });

            it('should call compileAndExecuteCode function with the right parameters', function(){
                pythonExecutorObj.execute(fileExistsPath, validCallback);
                expect(pythonExecutorObj.compileAndExecuteCode).toHaveBeenCalled();
                expect(pythonExecutorObj.compileAndExecuteCode.calls.argsFor(0)).toEqual([fileExistsPath, validCallback]);
            });
        });

        describe('compileAndExecuteCode function', function(){
            var pythonExecutorObj, validCallback;

            beforeEach(function(){
                pythonExecutorObj = new pythonExecutor();
                validCallback = jasmine.createSpy('validCallback');
                spyOn(helpers, 'isCommandInPath').and.returnValue(true);
                spyOn(helpers, 'executeCommandsInSeries').and.returnValue(null);
            });

            it('should call isCommandInPath function', function(){
                pythonExecutorObj.compileAndExecuteCode('/home/test1.c', validCallback);
                expect(helpers.isCommandInPath).toHaveBeenCalled();
                expect(helpers.isCommandInPath.calls.argsFor(0)).toEqual(['python']);
            });

            it('should call callback with error if python is not in PATH and callback is not passed', function(){
                helpers.isCommandInPath.and.returnValue(false);
                pythonExecutorObj.compileAndExecuteCode('/home/test1.py', validCallback);
                expect(validCallback).toHaveBeenCalled();
                expect(validCallback.calls.argsFor(0)).toEqual([Error('Python is not found in path')]);
            });

            it('should call executeCommandInSeries to execute the command to compile', function(){
                pythonExecutorObj.compileAndExecuteCode('/home/test1.py', validCallback);
                expect(helpers.executeCommandsInSeries).toHaveBeenCalled();
                expect(helpers.executeCommandsInSeries.calls.argsFor(0)).toEqual([['python /home/test1.py'],
                    validCallback]);

                helpers.executeCommandsInSeries.calls.reset();

                pythonExecutorObj.compileAndExecuteCode('/home/abc/def/test1.py', validCallback);
                expect(helpers.executeCommandsInSeries).toHaveBeenCalled();
                expect(helpers.executeCommandsInSeries.calls.argsFor(0)).toEqual([['python /home/abc/def/test1.py'], 
                    validCallback]);
            });
        });
    });
});