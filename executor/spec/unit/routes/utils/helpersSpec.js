var helpers = require('../../../../routes/utils/helpers');
var _ = require('lodash');
var format = require('util').format;

describe('routes/helpers.js', function(){
    describe('initializeRoutes function', function(){
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

        it('should throw an error if it is not passed with suitable parameters', function(){
            expect(function(){helpers.initializeRoutes()}).toThrowError(Error, 'Few parameters are undefined');
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