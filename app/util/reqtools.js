var error = require('./error'),
    ApplicationSchema = _require('model/application');


function checkSecurity(req){
    return !req.connection.encrypted
}

function appCheckSecurity(req, app){
    app.unsecured_source = checkSecurity(req);
    return app;
}

function res_err(res, status, code, msg){
    let err = {
        error: {}
    }
    err.error.status = status;
    err.error.code = code;
    err.error.msg = msg;
    res.status(status).send(err);
}


function errorHandler(e, res){
    try{                          
        if(e.name === 'Bad Request')
            res_err(res, 400, e.name, e.message)
        if(e.name === 'Unauthorized')
            res_err(res, 401, e.name, e.message)
        if(e.name === 'Forbidden')
            res_err(res, 403, e.name, e.message)
        else{
            res.status(500).end();
            console.log(e)
        }
    }catch(e) {
        console.log('fatal error:' + e)
        res.status(500).end();
    }
}

module.exports = {
    checkSecurity: checkSecurity,
    res_err: res_err,
    appCheckSecurity: appCheckSecurity,
    errorHandler: errorHandler
}