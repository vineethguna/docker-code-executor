var express = require('express');
var routeController = require('./controllers/executor');

var router = express.Router();

router.post('/', routeController['/'].post);

module.exports = router;