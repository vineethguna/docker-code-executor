var express = require('express');
var helpers = require('../../../routes/helpers');

var app = express();

describe('Testing routes/helpers.js', function(){
    describe('Testing initializeRoutes function', function(){

        it('should be a function', function(){
            expect(helpers.initializeRoutes).toEqual(jasmine.any(Function));
        });

        it('should take two parameters', function(){

        });

        it('should call app.use function', function(){
            
        });

        it('should call app.use with specific parameters', function(){

        });
    })
});