var mongoose = require('mongoose');  
var Schema   = mongoose.Schema,
    error    = _require('util/error'),
    security = _require('util/security'),
    passwords = _require('../passwords.json');

var SessionSchema = new Schema({
    //_id
    expiration: { type: String, required: true },
    permissions: { type: Array },
    subs: { type: Array },
    token: { type: String, required: true}
})

// SessionSchema.virtual('token').get(function() {
//     try{
//         //return security.encrypt(this._id, passwords.token_pwd)
//         return security.hashText(this._id)
//     }catch(e){
//         console.log(e);
//         return -1;
//     }
// });

SessionSchema.statics.newSession = function(user, params){
    try{
        newsession = new this();
        newsession.expiration = Date.now() + 1000*60*5; // Inventado (5 mins)
        newsession.token = security.hashText(newsession._id);
        //newsession.permissions = params.permissions//['rdonly']
        //newsession.subs = params.subs//['ffsd']
        return newsession;
    }catch(e){
        throw new Error('error creating new user. ' + e.message);
    }
}

module.exports = mongoose.model('Session', SessionSchema)