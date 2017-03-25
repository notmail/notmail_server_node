var mongoose  = require('mongoose');  
var Schema    = mongoose.Schema,
    error     = _require('util/error'),
    security  = _require('util/security'),
    passwords = _require('../passwords.json');

var SessionSchema = new Schema({
    //token                                                                     // *a (virtual)
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},  // *a
    secret: { type: String, required: true },                                   // *a
    expiration: { type: String, required: true },                               // *am not_implemented 
    permissions: { type: Array },                                               // not_implemented
    subs: { type: Array },                                                      // not_implemented
})

SessionSchema.virtual('token').get(function() {
    return this._id + '_' + this.secret;
});

SessionSchema.statics.newSession = function(userid, params){
    try{
        newsession = new this();
        newsession.expiration = Date.now() + 1000*60*5; // Inventado (5 mins)
        newsession.user = userid;
        newsession.secret = security.genRandomKey();
        //newsession.permissions = params.permissions//['rdonly']
        //newsession.subs = params.subs//['ffsd']
        return newsession;
    }catch(e){
        throw new Error('error creating new user. ' + e.message);
    }
}

SessionSchema.statics.findSession = function(sessionId, secret){
    return this.findById(sessionId)
    .populate('user')
    .then(session=>{
        if (!session || session.secret != secret) throw new error.Unauthorized('bad token');
        if (session.expiration < Date.now()){
            session.remove()
            .then(()=>{})
            .catch(()=>{})
            throw new error.Unauthorized('token expired');
        }
        return session
    })
    .catch(e=>{
        if(e.name ==='Unauthorized') throw e
        throw new error.Unauthorized('bad token');
    })
}


module.exports = mongoose.model('Session', SessionSchema)