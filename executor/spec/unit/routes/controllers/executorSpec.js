var executeRoutes = require('../../../../routes/controllers/executor');
var executor = require('../../../../controllers/executor');

describe('routes/controllers/executor.js', function(){
    describe('post call for / endpoint', function(){
        var reqWithRequiredParams, reqWithoutRequiredParams, res, executorObj;

        beforeAll(function(){
            reqWithRequiredParams = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },

                body: {
                    language: 'python',
                    code: 'print%20%22Hello%20world!!%22'
                }
            };

            reqWithoutRequiredParams = {
                headers: {
                    'content-type': 'application/json'
                },

                body: {
                    language: 'python'
                }
            };

            res = {
                status: function(){
                    return this;
                },

                json: function(){
                    return this
                },

                end: function(){
                    return this;
                }
            };

            executorObj = {
                execute: function(){
                    return null;
                }
            };

            spyOn(res, 'status').and.callThrough();
            spyOn(res, 'json').and.callThrough();
            spyOn(res, 'end').and.callThrough();
            spyOn(executorObj, 'execute').and.callThrough();
        });

        beforeEach(function(){
            res.status.calls.reset();
            res.end.calls.reset();
            res.json.calls.reset();
            executorObj.execute.calls.reset();
        });

        it('should be a function and expects three parameters', function(){
            expect(typeof executeRoutes['/'].post).toBe('function');
            expect(executeRoutes['/'].post.length).toBe(2);
        });

        it('should send 400 response if the content type request header is not application/x-www-form-urlencoded',
            function(){
                executeRoutes['/'].post(reqWithoutRequiredParams, res);
                expect(res.status).toHaveBeenCalled();
                expect(res.status.calls.argsFor(0)).toEqual([400]);
                expect(res.end).toHaveBeenCalled();
            }
        );

        it('should send 412 response if language is not present in request body', function(){
            var reqTemp = reqWithRequiredParams;
            reqTemp.body.language = null;
            executeRoutes['/'].post(reqTemp, res);
            expect(res.status).toHaveBeenCalled();
            expect(res.status.calls.argsFor(0)).toEqual([412]);
            expect(res.end).toHaveBeenCalled();
        });

        it('should send 412 response if code is not present in request body', function(){
            var reqTemp = reqWithRequiredParams;
            reqTemp.body.code = null;
            executeRoutes['/'].post(reqTemp, res);
            expect(res.status).toHaveBeenCalled();
            expect(res.status.calls.argsFor(0)).toEqual([412]);

        });
    })
});