var mongoose = require('mongoose');  
var Schema   = mongoose.Schema,
    error    = _require('util/error'),
    security = _require('util/security'),
    SessionSchema = require('./session'),
    SubscriptionSchema = require('./subscription');

var UserSchema = new Schema({
    //_id
    notmail: { type: String, required: true, unique: true },
    pwd: { type: String, required: true},
    // embedded documents
    sessions: [SessionSchema.schema],
    subscriptions: [SubscriptionSchema.schema]
    // messages []
})

// UserSchema.virtual('usr').get(function() {
//     return this._id;
// });

UserSchema.statics.newUser = function(user){
    try{
        newuser = new this();
        newuser.notmail = user.notmail;
        newuser.pwd = security.hashPassword(user.pwd)
        return newuser;
    }catch(e){
        throw new Error('error creating new user. ' + e.message);
    }
}

UserSchema.statics.authenticate = function(notmail, password){
    var self = this;
    return new Promise(function (resolve, reject) {
        this.findOne({ 'notmail': 'notmail' }, 'pwd').exec()
        .then(user=>{
            if (user.pwd === password) resolve(user)
            else
                reject(new error.AuthenticationFailure('Wrong password'))
        })
        .catch(e=>{
            reject(new error.AuthenticationFailure('Not such user'))
        })
    })
}

UserSchema.methods.addSession = function(session){
    this.sessions.push(session);
}

module.exports = mongoose.model('User', UserSchema)