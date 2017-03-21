var exports = module.exports = {};
var error = _require('./util/error')

/**
 *      common
 */
exports.checkAuthParams = function(params){
    if(!params.token)
        throw new error.BadRequest('token missing');
}

/**
 *      /user/auth
 */
exports.authGetCheck = function(query){
    if(!query.notmail)
        throw new error.BadRequest('notmail missing');
    if(!query.pwd)
        throw new error.BadRequest('pwd missing');
    return query;
}

exports.authGetResponse = function(notmail, session){
    var response = {
        token: notmail + '_' + session.token,
        expiration: session.expiration,
        subs: session.subs,
        permissions: session.permissions
    }
    return response;
}

/**
 *      /user/sub
 */
exports.subGetCheck = function(query){
    if(!query.notmail)
        throw new error.BadRequest('notmail missing');
    if(!query.pwd)
        throw new error.BadRequest('pwd missing');
    return query;
}

exports.subGetResponse = function(result){
    var response = {
        subs: result[0].subscriptions
    }
    return response;
}