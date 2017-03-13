var mongoose = require('mongoose');  
var Schema   = mongoose.Schema,
    error    = _require('util/error'),
    security = _require('util/security'),
    autoIncrement = require('mongoose-auto-increment');

//autoIncrement.initialize(mongoose.connection);

var SubscriptionSchema = new Schema({
    //_id ('Number' autoIncremented)
    _application: {type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true},
    status: {type: String, default: 'pending'},
    validation: {type: String, required: true},
    created: {type: Date, default: Date.now()}
})

SubscriptionSchema.methods.getApplication = function(){
    var self = this;
    return new Promise(function (resolve, reject) {
        this.populate('_application')
        .exec()
        .then(app=>{
            resolve(app)
        })
        .catch(e=>{
            reject(new error.Removed('Associated application got removed from the server.'))
        })
    })
}

SubscriptionSchema.statics.newSession = function(user, params){
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

/*
SubscriptionSchema.statics.requestFindSubscription = function(user, appid){
    var self = this;
    return new Promise(function (resolve, reject) {
        UserSchema.collection
        .aggregate([
        { '$match': {notmail: 'jaime@ehu.es'}},
        //{ '$match': {'_id': mongoose.Schema.Types.ObjectId('58c549ec1dd35c12283e31ac')}},
        { '$project': {
            list: {$filter: {
                input: '$subscriptions',
                as: 'list',
                cond: {$eq: ['$$list.validation', '1234']}
            }}
        }}
        ], function(err,res){
            if(err) reject(err)
            else    resolve(res)
            if(!res[0].list[0]) console.log('no result')
            else console.log(res[0].list[0])
        })
    })
}
*/

//SubscriptionSchema.plugin(autoIncrement.plugin, 'Subscription');
module.exports = mongoose.model('Subscription', SubscriptionSchema)