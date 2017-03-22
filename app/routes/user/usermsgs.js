var exports = module.exports = {};
var error = _require('./util/error')

/**
 *      common
 */
exports.checkAuthParams = function(params){
    if(!params.token)
        throw new error.BadRequest('token missing');
    let netToken = params.token.split('_');
    if(netToken.length != 2)
        throw new error.BadRequest('bad token');
    return netToken;
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
        token: session.token,
        expiration: session.expiration,
        subs: session.subs,
        permissions: session.permissions
    }
    return response;
}

/**
 *      /user/sub
 */
exports.subGetCheck = function(query){          // HAY QUE METER ESTO
    if(query.query && ['all, pending, subscribed, app'])
        throw new error.BadRequest('query error');
    if(query.query && query.query == 'app' && !query.sub)
        throw new error.BadRequest('no sub specified');

    return query;
}

exports.subGetResponse = function(result){
    var response = {
        subs: result//(result.length>0)? result[0].subscriptions : []
    }
    return response;
}