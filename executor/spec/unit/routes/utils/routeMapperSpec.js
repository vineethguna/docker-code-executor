var _ = require('lodash');
var specs = require('../../../../routes/utils/routeMapper');


describe('routes/specs.js', function(){
    describe('Validating route specs data', function(){

        it('should have valid routes', function(){
            var validRoutes = ['/execute'];
            var routes = _.keys(specs);
            expect(routes).toEqual(validRoutes);
        });
    })
});