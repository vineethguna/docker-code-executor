var helpers = require('../../../routes/helpers');
var _ = require('lodash');
var format = require('util').format;

describe('Testing routes/helpers.js', function(){
    describe('Testing initializeRoutes function', function(){
        var specs, app;

        beforeAll(function(){
            specs = {
                '/dummy': {
                    routeModule: {}
                },

                '/dummy1': {
                    routeModule: {}
                }
            };

            app = {
                use: jasmine.createSpy('use')
            };
        });

        it('should be a function', function(){
            expect(helpers.initializeRoutes).toEqual(jasmine.any(Function));
        });

        it('should take three parameters', function(){
            spyOn(helpers, 'initializeRoutes');
            helpers.initializeRoutes(app, 'v1', specs);
            expect(helpers.initializeRoutes.calls.argsFor(0).length).toEqual(3);
            helpers.initializeRoutes.calls.reset();
        });

        it('should throw an error if any of the parameters is undefined', function(){
            expect(function(){helpers.initializeRoutes(app)}).toThrowError(Error, 'Few parameters are undefined');
            expect(function(){helpers.initializeRoutes(app, 'v1')}).toThrowError(Error, 'Few parameters are undefined');
            expect(function(){helpers.initializeRoutes(app, 'v1', specs)})
                .not.toThrowError(Error, 'Few parameters are undefined');
            app.use.calls.reset();
            spyOn(helpers, 'initializeRoutes');
            helpers.initializeRoutes.calls.reset();
        });

        it('should call app.use function', function(){
            helpers.initializeRoutes(app, 'v1', specs);
            expect(app.use).toHaveBeenCalled();
            expect(app.use).toHaveBeenCalledTimes(_.keys(specs).length);
            app.use.calls.reset();
            spyOn(helpers, 'initializeRoutes');
            helpers.initializeRoutes.calls.reset();
        });

        it('should call app.use with specific parameters', function(){
            helpers.initializeRoutes(app, 'v1', specs);
            _.forEach(specs, function(value, key){
                expect(app.use).toHaveBeenCalledWith(format('/api/v1%s', key), value.routeModule);
            });
            spyOn(helpers, 'initializeRoutes');
            helpers.initializeRoutes.calls.reset();
        });
    })
});