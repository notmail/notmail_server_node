/*
function validateSecurity(request){
    return !(!request.connection.encrypted)
}

function genSharedKey(){
    return require('crypto').randomBytes(24).toString('hex')
}
module.exports = {
    validateSecurity: validateSecurity,
    genSharedKey: genSharedKey
}
*/

var error = require('./error'),
    ApplicationSchema = _require('model/application');

function checkSecurity(req){
    return !req.connection.encrypted
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

module.exports = {
    checkSecurity: checkSecurity,
    res_err: res_err
}