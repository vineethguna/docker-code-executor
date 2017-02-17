var rubyExecutor = require('../../../../modules/codeexecutors/rubyExecutor');
var helpers = require('../../../../modules/helpers');
var fs = require('fs');

describe('modules/codeexecutors/rubyExecutor.js', function(){
    describe('rubyExecutor prototype', function(){
        it('should have execute method', function(){
            var rubyExecutorObj = new rubyExecutor();
            expect(typeof rubyExecutorObj.execute).toBe('function');
        });

        describe('execute method of prototype', function(){
            var fileExistsPath, fileNotExistsPath, rubyExecutorObj, validCallback;
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
                rubyExecutorObj = new rubyExecutor();
                validCallback = jasmine.createSpy('validCallback');
                spyOn(helpers, 'isCommandInPath').and.returnValue(true);
                spyOn(rubyExecutorObj, 'compileAndExecuteCode').and.returnValue(null);
            });

            it('should throw error if required parameters are not passed', function(){
                expect(function(){rubyExecutorObj.execute()}).toThrowError(Error, 'Few parameters are undefined');
                expect(function(){rubyExecutorObj.execute(fileExistsPath)}).toThrowError(Error,
                    'Few parameters are undefined');
                expect(function(){rubyExecutorObj.execute(fileExistsPath, fileExistsPath)}).toThrowError(Error,
                    'Few parameters are undefined')
            });

            it('should call callback with error if file is not found at the given file path', function(){
                rubyExecutorObj.execute(fileNotExistsPath, fileExistsPath, validCallback);
                expect(validCallback).toHaveBeenCalled();
                expect(validCallback.calls.argsFor(0)).toEqual([Error('The given file path is not valid')]);

                rubyExecutorObj.execute(fileExistsPath, fileNotExistsPath, validCallback);
                expect(validCallback).toHaveBeenCalled();
                expect(validCallback.calls.argsFor(1)).toEqual([Error('The given input path is not valid')]);
            });

            it('should not throw error if the passed parameters are valid', function(){
                expect(function(){rubyExecutorObj.execute(fileExistsPath, null, validCallback)}).not.toThrowError();
                expect(function(){rubyExecutorObj.execute(fileExistsPath, fileExistsPath, validCallback)}).not.toThrowError();
                expect(function(){rubyExecutorObj.execute(fileExistsPath, undefined, validCallback)}).not.toThrowError();
            });

            it('should call compileAndExecuteCode function with the right parameters', function(){
                rubyExecutorObj.execute(fileExistsPath, null, validCallback);
                expect(rubyExecutorObj.compileAndExecuteCode).toHaveBeenCalled();
                expect(rubyExecutorObj.compileAndExecuteCode.calls.argsFor(0)).toEqual([fileExistsPath, null, validCallback]);

                rubyExecutorObj.execute(fileExistsPath, fileExistsPath, validCallback);
                expect(rubyExecutorObj.compileAndExecuteCode).toHaveBeenCalled();
                expect(rubyExecutorObj.compileAndExecuteCode.calls.argsFor(1)).toEqual([fileExistsPath, fileExistsPath, validCallback]);

                rubyExecutorObj.execute(fileExistsPath, undefined, validCallback);
                expect(rubyExecutorObj.compileAndExecuteCode).toHaveBeenCalled();
                expect(rubyExecutorObj.compileAndExecuteCode.calls.argsFor(2)).toEqual([fileExistsPath, undefined, validCallback]);
            });
        });

        describe('compileAndExecuteCode function', function(){
            var rubyExecutorObj, validCallback;

            beforeEach(function(){
                rubyExecutorObj = new rubyExecutor();
                validCallback = jasmine.createSpy('validCallback');
                spyOn(helpers, 'isCommandInPath').and.returnValue(true);
                spyOn(helpers, 'executeCommandsInSeries').and.returnValue(null);
            });

            it('should call isCommandInPath function', function(){
                rubyExecutorObj.compileAndExecuteCode('/home/test1.c', null, validCallback);
                expect(helpers.isCommandInPath).toHaveBeenCalled();
                expect(helpers.isCommandInPath.calls.argsFor(0)).toEqual(['ruby']);
            });

            it('should call callback with error if ruby is not in PATH and callback is not passed', function(){
                helpers.isCommandInPath.and.returnValue(false);
                rubyExecutorObj.compileAndExecuteCode('/home/test1.py', null, validCallback);
                expect(validCallback).toHaveBeenCalled();
                expect(validCallback.calls.argsFor(0)).toEqual([Error('Ruby is not found in path')]);
            });

            it('should call executeCommandInSeries to execute the command to compile', function(){
                rubyExecutorObj.compileAndExecuteCode('/home/test1.rb', null, validCallback);
                expect(helpers.executeCommandsInSeries).toHaveBeenCalled();
                expect(helpers.executeCommandsInSeries.calls.argsFor(0)).toEqual([['ruby /home/test1.rb'],
                    validCallback]);

                helpers.executeCommandsInSeries.calls.reset();

                rubyExecutorObj.compileAndExecuteCode('/home/test1.rb', '/home/input', validCallback);
                expect(helpers.executeCommandsInSeries).toHaveBeenCalled();
                expect(helpers.executeCommandsInSeries.calls.argsFor(0)).toEqual([['ruby /home/test1.rb < /home/input '],
                    validCallback]);

                helpers.executeCommandsInSeries.calls.reset();

                rubyExecutorObj.compileAndExecuteCode('/home/abc/def/test1.rb', undefined, validCallback);
                expect(helpers.executeCommandsInSeries).toHaveBeenCalled();
                expect(helpers.executeCommandsInSeries.calls.argsFor(0)).toEqual([['ruby /home/abc/def/test1.rb'],
                    validCallback]);
            });
        });
    });
});