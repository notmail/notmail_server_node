var mongoose = require('mongoose');  
var Schema   = mongoose.Schema,
    error    = _require('util/error'),
    security = _require('util/security');

var SessionSchema = new Schema({
    //_id
    expiration: { type: String, required: true },
    permissions: { type: Array },
    subs: { type: Array }
})

SessionSchema.statics.newSession = function(user, params){
    try{
        newsession = new this();
        newsession.expiration = Date.now() + 1000*60; // Inventado (1 min)
        //newsession.permissions = params.permissions//['rdonly']
        newsession.subs = params.subs//['ffsd']
        return newsession;
    }catch(e){
        throw new Error('error creating new user. ' + e.message);
    }
}

module.exports = mongoose.model('Session', SessionSchema)