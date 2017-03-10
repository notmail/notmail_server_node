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


function check_auth_params(params, shared_key, root_secret){
    return new Promise(function (resolve, reject) {
        if(!params.unique_id)
            reject(new error.BadRequest('unique_id missing'));
        if(shared_key && !params.shared_key)
            reject(new error.BadRequest('shared_key missing'));
        if(root_secret && !params.root_secret)
            reject(new error.BadRequest('root_secret missing'));
        resolve();
    })
}

module.exports = {
    checkSecurity: checkSecurity,
    res_err: res_err,
    appCheckSecurity: appCheckSecurity,
    check_auth_params: check_auth_params
}