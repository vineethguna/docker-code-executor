var executor = require('../../controllers/executor');

module.exports = {
    '/': {
        post: function(req, res){
            if(req.headers['content-type'] != 'application/x-www-form-urlencoded') {
                return res.status(400).end();
            } else if(req.body.code == null || req.body.language == null){
                return res.status(412).end();
            }

            var language = req.body.language;
            var code = req.body.code;
            var input = req.body.stdin;

            //TODO: Unit tests should be written for the below
            try {
                var executorObj = new executor(language);
                executorObj.execute(code, input, function(err, stderr, stdout){
                    if(err) {
                        res.status(200).json({
                            error: true,
                            errorMsg: err.message,
                            output: stderr
                        })
                    } else {
                        res.status(200).json({
                            error: false,
                            errorMsg: null,
                            output: stdout
                        })
                    }
                });
            } catch(e){
                res.status(200).json({
                    error: true,
                    errorMsg: e.message,
                    output: null
                })
            }
        }
    }
};