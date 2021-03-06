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
    
    describe('stripFilePathFromMessage', function(){
        it('should take two parameters', function(){
            expect(helpers.stripFilePathFromMessage.length).toBe(2);
        });

        it('should return true for syntax error in python', function(){
            var message = "/home/sguna/myprojects/docker-code-executor/executor/tmp/tmp-22195hLha45GJzxh7.c:1:1: warning:" +
                " data definition has no type or storage class [enabled by default]\n parents, babies = 1, 1)\n" +
                " ^\n/home/sguna/myprojects/docker-code-executor/executor/tmp/tmp-22195hLha45GJzxh7.c:1:22: error: " +
                "expected identifier or ‘(’ before numeric constant\n parents, babies = 1, 1)\n" +
                "                      ^\n/home/sguna/myprojects/docker-code-executor/executor/tmp/tmp-22195hLha45GJzxh7" +
                ".c:3:11: warning: character constant too long for its type [enabled by default]" +
                "\n     print 'This generation has {0} babies'.format(babies)\n           ^\n";
            var expectedMessage = ":1:1: warning:" +
                " data definition has no type or storage class [enabled by default]\n parents, babies = 1, 1)\n" +
                " ^\n:1:22: error: " +
                "expected identifier or ‘(’ before numeric constant\n parents, babies = 1, 1)\n" +
                "                      ^\n" +
                ":3:11: warning: character constant too long for its type [enabled by default]" +
                "\n     print 'This generation has {0} babies'.format(babies)\n           ^\n";

            expect(helpers.stripFilePathFromMessage(
                '/home/sguna/myprojects/docker-code-executor/executor/tmp/tmp-22195hLha45GJzxh7.c', message)).toEqual(
                expectedMessage);
        });

        
    })
});