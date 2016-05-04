var cExecutor = require('../../../../modules/codeexecutors/cExecutor');

describe('Testing modules/codeexecutors/cExecutor.js', function(){
    describe('Testing cExecutor prototype', function(){
        it('should have execute method', function(){
            var cExecutorObj = new cExecutor();
            expect(typeof cExecutorObj.execute).toBe('function');
        });

        describe('Testing execute method of prototype', function(){
            var fileExistsPath, fileNotExistsPath;
            beforeAll(function(){
                fileExistsPath = '/sample/exists';
                fileNotExistsPath = '/sample/notexists';
            });
            
            it('should throw error if required parameters are not passed', function(){
                var cExecutorObj = new cExecutor();
                expect(function(){cExecutorObj.execute()}).toThrowError(Error, 'File path is undefined');
            });

            it('should throw FileNotFound error if file is not found at the given file path', function(){

            });

            it('should throw error if callback passed is not undefined and is not a function', function(){
                
            });
        });
    });
});