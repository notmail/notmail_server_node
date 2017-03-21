var mongoose           = require('mongoose');  
var Schema             = mongoose.Schema,
    error              = _require('util/error'),
    security           = _require('util/security'),
    SessionSchema      = require('./session'),
    SubscriptionSchema = require('./subscription'),
    MessageSchema      = require('./message'),
    security = _require('/util/security'),
    config = _require('/../config');

var UserSchema = new Schema({
    //_id
    notmail: { type: String, required: true, unique: true },
    pwd: { type: String, required: true},

    // embedded documents
    sessions: [SessionSchema.schema],
    subscriptions: [SubscriptionSchema.schema],
    messages: [MessageSchema.schema]
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
        self.findOne({ 'notmail': notmail }, 'pwd sessions').exec()
        .then(user=>{
            try{
                security.testPassword(password, user.pwd);
                resolve(user);

            }catch(e){
                reject(new error.AuthenticationFailure('Wrong password'))
            }
        })
        .catch(e=>{
            reject(new error.AuthenticationFailure('Not such user'))
        })
    })
}

UserSchema.statics.findUserByNotmail = function(notmail, fields){
    var self = this;
    return new Promise(function (resolve, reject) {
        self.findOne({ 'notmail': notmail }, fields).exec()
        .then(user=>{
            if(!user) reject(new error.Forbidden('Not such user'))
            resolve(user)
        })
        .catch(e=>{
            reject(new error.Forbidden('Not such user'))
        })
    })
}

// UserSchema.methods.retrieveSubscriptions = function(applicationId, status){
//     if(!this.subscriptions) throw new error.SubscriptionError('No subscriptions field.')
//     let subscriptions = this.subscriptions;

//     if(applicationId){
//         subscriptions = subscriptions.filter(sub=>{
//             return (sub._application && (String(sub._application) == String(applicationId))) 
//         })
//     }
//     if(status){
//         subscriptions = subscriptions.filter(sub=>{
//             return sub.status == status;
//         })
//     }
//     if(subscriptions.length==0) throw new error.SubscriptionError('No subscriptions matched.')
//     return subscriptions;
// }

UserSchema.methods.addSession = function(session){
    this.sessions.push(session);
}


UserSchema.statics.findSubscriptions = function(notmail, query, id){
    
    let match = {};
    if(query === 'app')
        match['subscriptions._id'] = id;
    else if(query === 'pending' || query === 'subscribed')
        match['subscriptions.status'] = query;

    return this.aggregate()
        .match({notmail: notmail})
        .project({subscriptions: 1})
        .unwind('subscriptions')
        .match(match)
        .group({"_id": "$_id", "subscriptions": { "$push": "$subscriptions" }} )
        .then(result=>{
            return this.populate(result, {
                path: 'subscriptions._application',
                select: '-_id title description url icon unsecured_source'
            })
        })

}

UserSchema.statics.findSessions = function(notmail, token, all){
    if(!all) match = { 'sessions.token': token };
    return this.aggregate()
        .match({notmail: notmail})
        .project({sessions: 1})
        .unwind('sessions')
        .match(match)
}


module.exports = mongoose.model('User', UserSchema)