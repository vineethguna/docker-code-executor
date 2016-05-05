var helpers = require('../../../modules/helpers');
var child_process = require('child_process');
var format = require('util').format;

describe('modules/helpers.js', function(){
    describe('isCommandInPath function', function(){
        var existingCommand, nonExistingCommand;

        beforeAll(function(){
            existingCommand = 'command1';
            nonExistingCommand = 'command2';

            spyOn(child_process, 'execSync').and.callFake(function(command){
                if(command == format('which %s', existingCommand)){
                    return true;
                } else if(command == format('which %s', nonExistingCommand)){
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
            expect(child_process.execSync.calls.argsFor(0)).toEqual([format('which %s', existingCommand)]);
            expect(returnVal).toBe(true);
        });

        it('should return false if command is not found in path', function(){
            var returnVal = helpers.isCommandInPath(nonExistingCommand);
            expect(child_process.execSync.calls.argsFor(0)).toEqual([format('which %s', nonExistingCommand)]);
            expect(returnVal).toBe(false);
        });
    });

    describe('executeCommandsInSeries', function(){
        it('should throw an error if the commands parameter is not as expected', function(){
            expect(function(){helpers.executeCommandsInSeries('gcc')}).toThrowError(Error,
                'Parameters are either undefined or not expected');
            expect(function(){helpers.executeCommandsInSeries(1)}).toThrowError(Error,
                'Parameters are either undefined or not expected');
            expect(function(){helpers.executeCommandsInSeries({})}).toThrowError(Error,
                'Parameters are either undefined or not expected');
            expect(function(){helpers.executeCommandsInSeries()}).toThrowError(Error,
                'Parameters are either undefined or not expected');
        });

        it('should throw error if the callback passed is not a function', function(){
            expect(function(){helpers.executeCommandsInSeries(['gcc'], 'gcc')}).toThrowError(Error,
                'The callback passed is not a function');
            expect(function(){helpers.executeCommandsInSeries(['gcc'], 1)}).toThrowError(Error,
                'The callback passed is not a function');
            expect(function(){helpers.executeCommandsInSeries(['gcc'], {})}).toThrowError(Error,
                'The callback passed is not a function');
            expect(function(){helpers.executeCommandsInSeries(['gcc'])}).toThrowError(Error,
                'The callback passed is not a function');
        });

        it('should throw an error if the given array of commands is of length 1', function(){
            expect(function(){helpers.executeCommandsInSeries([], function(){})}).toThrowError(Error,
                'No commands given');
        });

        it('should not throw error if the parameters are correct', function(){
            expect(function(){helpers.executeCommandsInSeries(['gcc', 'ls'], function(){})}).not.toThrowError();
        });
        
        //TODO: Need to add test cases for closure
    });
});