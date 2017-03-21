var mongoose = require('mongoose');  
var Schema   = mongoose.Schema,
    error    = _require('util/error'),
    security = _require('util/security');
    //autoIncrement = require('mongoose-auto-increment');

//autoIncrement.initialize(mongoose.connection);

var SubscriptionSchema = new Schema({
    //_id ('Number' )
    app: {type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, unique: true, sparse: true},
    status: {type: String, default: 'pending'},
    validation: {type: String, required: true},
    created: {type: Date, default: Date.now()},
    
    sub: {type: String, required: true},
})

// SubscriptionSchema.virtual('id').get(function() {
//     return this._id;
// });

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

SubscriptionSchema.statics.newSubscription = function(application){
    try{
        newsubscription = new this();
        newsubscription.status = 'pending';
        newsubscription.validation = security.genRandomValidation();
        
        newsubscription._application = application;
        newsubscription.sub = security.hashText(this._id)
        return newsubscription;
    }catch(e){
        throw new Error('error creating new subscription. ' + e.message);
    }
}
SubscriptionSchema.methods.reset = function(){
    try{
        this.status = 'pending',
        this.validation = security.genRandomValidation()
        this.created = Date.now();
        return this;
    }catch(e){
        throw new Error('error reseting subscription. ' + e.message);
    }
}

SubscriptionSchema.statics.updateSubscription = function(notmail, sub, op){

    //return //this.find({sub: '$2a$10$zqrxTLkdGNPVfBQlDKQGpetG3ssOQK7c4V197otsY1Ytbe6N66S0a'})
    //return this.findById(mongoose.Types.ObjectId('58d1642dd31e5bc5d8810395'))
    return

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