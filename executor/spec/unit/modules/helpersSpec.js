var helpers = require('../../../modules/helpers');
var child_process = require('child_process');
var format = require('util').format;

describe('Testing modules/helpers.js', function(){
    describe('Testing isCommandInPath function', function(){
        var existingCommand, nonExistingCommand;

        beforeAll(function(){
            existingCommand = 'command1';
            nonExistingCommand = 'command2';

            spyOn(child_process, 'execSync').and.callFake(function(command){
                if(command == format('where %s', existingCommand)){
                    return true;
                } else if(command == format('where %s', nonExistingCommand)){
                    throw Error('Command not found');
                }
            })
        });

        beforeEach(function(){
            spyOn(helpers, 'isCommandInPath').and.callThrough();
        });

        afterEach(function(){
            child_process.execSync.calls.reset();
        });

        it('should throw error if command parameter is not passed', function(){
            expect(function(){helpers.isCommandInPath()}).toThrowError(Error, 'Command is undefined');
        });

        it('should return true if command is found in path', function(){
            var returnVal = helpers.isCommandInPath(existingCommand);
            expect(child_process.execSync.calls.argsFor(0)).toEqual([format('where %s', existingCommand)]);
            expect(returnVal).toBe(true);
        });

        it('should return false if command is not found in path', function(){
            var returnVal = helpers.isCommandInPath(nonExistingCommand);
            expect(child_process.execSync.calls.argsFor(0)).toEqual([format('where %s', nonExistingCommand)]);
            expect(returnVal).toBe(false);
        });
    });
});