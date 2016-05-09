var cExecutor = require('../../../../modules/codeexecutors/cExecutor');
var helpers = require('../../../../modules/helpers');
var fs = require('fs');

describe('modules/codeexecutors/cExecutor.js', function(){
    describe('cExecutor prototype', function(){
        it('should have execute method', function(){
            var cExecutorObj = new cExecutor();
            expect(typeof cExecutorObj.execute).toBe('function');
        });

        describe('execute method of prototype', function(){
            var fileExistsPath, fileNotExistsPath, cExecutorObj, validCallback;
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
                cExecutorObj = new cExecutor();
                validCallback = jasmine.createSpy('validCallback');
                spyOn(helpers, 'isCommandInPath').and.returnValue(true);
                spyOn(cExecutorObj, 'compileAndExecuteCode').and.returnValue(null);
            });
            
            it('should throw error if required parameters are not passed', function(){
                expect(function(){cExecutorObj.execute()}).toThrowError(Error, 'Few parameters are undefined');
                expect(function(){cExecutorObj.execute(fileExistsPath)}).toThrowError(Error,
                    'Few parameters are undefined')
            });

            it('should call callback with error if file is not found at the given file path', function(){
                cExecutorObj.execute(fileNotExistsPath, validCallback);
                expect(validCallback).toHaveBeenCalled();
                expect(validCallback.calls.argsFor(0)).toEqual([Error('The given file path is not valid')]);
            });

            it('should not throw error if the passed parameters are valid', function(){
                expect(function(){cExecutorObj.execute(fileExistsPath, validCallback)}).not.toThrowError();
            });

            it('should call compileAndExecuteCode function with the right parameters', function(){
                cExecutorObj.execute(fileExistsPath, validCallback);
                expect(cExecutorObj.compileAndExecuteCode).toHaveBeenCalled();
                expect(cExecutorObj.compileAndExecuteCode.calls.argsFor(0)).toEqual([fileExistsPath, validCallback]);
            });
        });
        
        describe('compileAndExecuteCode function', function(){
            var cExecutorObj, validCallback;

            beforeEach(function(){
                cExecutorObj = new cExecutor();
                validCallback = jasmine.createSpy('validCallback');
                spyOn(helpers, 'isCommandInPath').and.returnValue(true);
                spyOn(helpers, 'executeCommandsInSeries').and.returnValue(null);
            });

            it('should call isCommandInPath function', function(){
                cExecutorObj.compileAndExecuteCode('/home/test1.c', validCallback);
                expect(helpers.isCommandInPath).toHaveBeenCalled();
                expect(helpers.isCommandInPath.calls.argsFor(0)).toEqual(['gcc']);
            });

            it('should call callback with error if gcc is not in PATH and callback is not passed', function(){
                helpers.isCommandInPath.and.returnValue(false);
                cExecutorObj.compileAndExecuteCode('/home/test1.c', validCallback);
                expect(validCallback).toHaveBeenCalled();
                expect(validCallback.calls.argsFor(0)).toEqual([Error('Gcc is not found in path')]);
            });

            it('should call executeCommandInSeries to execute the command to compile', function(){
                cExecutorObj.compileAndExecuteCode('/home/test1.c', validCallback);
                expect(helpers.executeCommandsInSeries).toHaveBeenCalled();
                expect(helpers.executeCommandsInSeries.calls.argsFor(0)[0]).toEqual(['gcc -o /home/test1 /home/test1.c',
                    '/home/test1']);

                helpers.executeCommandsInSeries.calls.reset();

                cExecutorObj.compileAndExecuteCode('/home/abc/def/test1.c', validCallback);
                expect(helpers.executeCommandsInSeries).toHaveBeenCalled();
                expect(helpers.executeCommandsInSeries.calls.argsFor(0)[0]).
                toEqual(['gcc -o /home/abc/def/test1 /home/abc/def/test1.c', '/home/abc/def/test1']);
            });
        });
    });
});