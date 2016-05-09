var executeRoutes = require('../../../../routes/controllers/executor');
var executor = require('../../../../controllers/executor');

describe('routes/controllers/executor.js', function(){
    describe('post call for / endpoint', function(){
        beforeAll(function(){

        });

        it('should be a function and expects three parameters', function(){
            expect(typeof executeRoutes['/'].post).toBe('function');
            expect(executeRoutes['/'].post.length).toBe(3);
        });

        it('should send 412 response if the content type request header is not application/x-www-form-urlencoded',
            function(){

            }
        );

        it('should check whether language and code data is present in request body', function(){

        });
    })
});