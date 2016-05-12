var express = require('express');
var request = require('request');
var format = require('util').format;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/execute', function(req, res, next){
    if(req.headers['content-type'] != 'application/x-www-form-urlencoded') {
        return res.status(400).end();
    } else if(req.body.code == null || req.body.language == null){
        return res.status(412).end();
    }

    var executorURL = format('http://%s:%s/api/v1/execute', process.env['EXECUTOR_SERVICE_HOST'],
        process.env['EXECUTOR_SERVICE_PORT']);
    request.post({url: executorURL, form: {code: encodeURIComponent(req.body.code), language: req.body.language}},
        function(err, response, body){
            if(!err && response.statusCode == 200){
                res.status(200).json(JSON.parse(body));
            } else {
                res.status(400).end();
            }
        }
    );
});

module.exports = router;
