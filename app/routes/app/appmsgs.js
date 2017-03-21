var exports = module.exports = {};
var error = _require('./util/error')
/**
 *      common
 */
exports.checkAuthParams = function(params, shared_key, root_secret){
    if(!params.unique_id)
        throw new error.BadRequest('unique_id missing');
    if(shared_key && !params.shared_key)
        throw new error.BadRequest('shared_key missing');
    if(root_secret && !params.root_secret)
        throw new error.BadRequest('root_secret missing');
}

exports.checkDestination = function(query, body){
    let dest = null;
    if(body.dest && body.dest.user)
        dest = body.dest.user;
    else if(query.user)
        dest = query.user
    if(dest==null)
        throw new error.BadRequest('user missing');
    return dest;
}

/**
 *      /app/registry
 */
exports.registryPostCheck = function(body){
    if(!body.app)
        throw new error.BadRequest('app missing');
    if(!body.app.title)
        throw new error.BadRequest('title missing');
    return body
}

exports.registryPostResponse = function(created){
    let response = {
        auth:{
            root_secret: created.root_secret,
            shared_key: created.shared_key,
            unique_id: created.unique_id
        }
    }
    return response
}

exports.registryGetResponse = function(app){
    let response = {
        app:{
            title: app.title,
            description: app.description,
            unsecured_source: app.unsecured_source,
            url: app.url,
            icon: app.icon,
        }
    }
    return response;
}

exports.registryPutResponse = function(app){
    let response = {
        app:{
            shared_key: app.shared_key
        }
    }
    return response;
}

/**
 *      /app/sub
 */
// exports.subPutCheck = function(body){
//     if(!body.dest)
//         throw new error.BadRequest('dest missing');
//     if(!body.dest.user)
//         throw new error.BadRequest('user missing');
//     return body
// }

// exports.subGetCheck = function(params){
//     if(!params.user)
//         throw new error.BadRequest('user param missing');
// }

exports.subPutResponse = function(sub){
    let response = {
        info:{
            validation: sub.validation
        }
    }
    return response;
}

/**
 *      /app/sub
 */
exports.msgPostCheck = function(body){
    if(!body.dest)
        throw new error.BadRequest('dest missing');
    if(!body.dest.user)
        throw new error.BadRequest('user missing');

    if(!body.msg)
        throw new error.BadRequest('msg missing');
    if(!body.msg.data)
        throw new error.BadRequest('data missing');

    return body
}