var _ = require('lodash');
var format = require('util').format;

var initializeRoutes = function(app, apiVersion, specs){
    if(app == undefined || apiVersion == undefined || specs == undefined) {
        throw Error('Few parameters are undefined');
    }
    
    _.forEach(specs, function(enpointDetails, endpoint){
        app.use(format('/api/%s%s', apiVersion, endpoint), enpointDetails.routeModule);
    })
};

module.exports = {
    initializeRoutes: initializeRoutes
};