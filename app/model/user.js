var mongoose = require('mongoose');  
var Schema   = mongoose.Schema,
    error    = _require('util/error'),
    security = _require('util/security'),
    SessionSchema = require('./session.js');

var UserSchema = new Schema({
    // Main fields
    //_id <--> usr
    notmail: { type: String, required: true },
    pwd: { type: String, required: true},

    sessions: [SessionSchema]
    // sesions []
    // subscriptions []
    // messages []
})

UserSchema.virtual('usr').get(function() {
    return this._id;
});

UserSchema.statics.newUser = function(user){
    var self = this;
    return new Promise(function (resolve, reject) {
        try{
            newuser = new self();
            newuser.notmail = user.notmail;
            
            security.hashPassword(user.pwd)
            .then(pwd=>{
                newuser.pwd = pwd;
            })
            .catch(e=>{
                reject(e)
            })

            resolve(newuser);
        }catch(e){
            reject(new Error('error creating new user'));
        }
    })
}


UserSchema.methods.addSession = function(session){
    var self = this;
    return new Promise(function (resolve, reject) {
        try{
            self.sessions.push(session);
        }catch(e){
            reject(e);
        }
    })
}


module.exports = mongoose.model('Application', ApplicationSchema)