var cExecutor = require('../../../../modules/codeexecutors/cExecutor');
var helpers = require('../../../../modules/helpers');
var fs = require('fs');

describe('Testing modules/codeexecutors/cExecutor.js', function(){
    describe('Testing cExecutor prototype', function(){
        it('should have execute method', function(){
            var cExecutorObj = new cExecutor();
            expect(typeof cExecutorObj.execute).toBe('function');
        });

        describe('Testing execute method of prototype', function(){
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
                spyOn(cExecutorObj, 'executeCommand').and.returnValue(null);
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

            it('should throw error if callback passed is not undefined and is not a function', function(){
                expect(function(){cExecutorObj.execute(fileExistsPath, 1)}).toThrowError(Error,
                    'The callback passed is not a function');
                expect(function(){cExecutorObj.execute(fileExistsPath, 'sample')}).toThrowError(Error,
                    'The callback passed is not a function');
                expect(function(){cExecutorObj.execute(fileExistsPath, {})}).toThrowError(Error,
                    'The callback passed is not a function');
            });

            it('should not throw error if the passed parameters are valid', function(){
                expect(function(){cExecutorObj.execute(fileExistsPath, validCallback)}).not.toThrowError();
            });

            it('should call isCommandInPath function', function(){
                cExecutorObj.execute(fileExistsPath, validCallback);
                expect(helpers.isCommandInPath).toHaveBeenCalled();
                expect(helpers.isCommandInPath.calls.argsFor(0)).toEqual(['gcc']);
            });

            it('should call callback with error if gcc is not in PATH and callback is not passed', function(){
                helpers.isCommandInPath.and.returnValue(false);
                cExecutorObj.execute(fileExistsPath, validCallback);
                expect(validCallback).toHaveBeenCalled();
                expect(validCallback.calls.argsFor(0)).toEqual([Error('Gcc is not found in path')]);
            });

            it('should call executeCommand function with the right parameters', function(){
                cExecutorObj.execute(fileExistsPath, validCallback);
                expect(cExecutorObj.executeCommand).toHaveBeenCalled();
                expect(cExecutorObj.executeCommand.calls.argsFor(0)).toEqual([fileExistsPath, validCallback]);
            });
        });
    });
});