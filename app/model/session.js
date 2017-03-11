var mongoose = require('mongoose');  
var Schema   = mongoose.Schema,
    error    = _require('util/error'),
    security = _require('util/security');

var SessionSchema = new Schema({
    expiration: { type: String, required: true },
    permissions: { type: Array },
    subs: { type: Array }
})

SessionSchema.virtual('usr').get(function() {
    return this._id;
});

SessionSchema.statics.newSession = function(user, params){
    var self = this;
    return new Promise(function (resolve, reject) {
        try{
            newsession = new self();
            newsession.expiration = Date.now() + 1000; // Inventado
            //newsession.permissions = ['rdonly']
            //newsession.subs = ['ffsd']
            resolve(newsession);
        }catch(e){
            reject(new Error('error creating new user'));
        }
    })
}

module.exports = mongoose.model('Session', SessionSchema)