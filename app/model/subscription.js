var mongoose   = require('mongoose');  
var Schema     = mongoose.Schema,
    error      = _require('util/error'),
    security   = _require('util/security');
    UserSchema = require('./user');

var SubscriptionSchema = new Schema({
    //_id / sub                                                                             // *a (json)
    app:        {type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true}, // *a
    user:       {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:        true}, // *a
    status:     {type: String, default:                     'pending'},                     // a
    validation: {type: String, required:                    false},                         // *a
    created:    {type: Date, default: Date.now()}                                           // *a
})

SubscriptionSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            sub: ret._id,
            status: ret.status,
            validation: ret.validation
        }
    },
    virtuals: true
})

SubscriptionSchema.statics.newSubscription = function(appref, userref){
    try{
        newsubscription            = new this();
        newsubscription.status     = 'pending';
        newsubscription.validation = security.genRandomValidation();
        newsubscription.app        = appref;
        newsubscription.user       = userref;
        return newsubscription;
    }catch(e){
        throw new Error('error creating new subscription. ' + e.message);
    }
}

SubscriptionSchema.statics.getAppUserSubscriptions = function(appref, userref){
    return this.findOne({app: appref, user: userref})
    .catch(e=>{
        throw new error.BadRequest('bad subscription')
    })
}

SubscriptionSchema.statics.getSubUserSubscription = function(subref, userref){
    return this.findOne({_id: subref, user: userref})
    .catch(e=>{
        throw new error.BadRequest('bad subscription')
    })
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


SubscriptionSchema.statics.getUserSubscriptions = function(userId, query, sub){
    let match = { user: userId };
    //let select = {}//{ validation: 1, status: 1, sub: 1, _id: 0 }
    if(query === 'app')
        match._id = sub;
    else if(query === 'pending' || query === 'subscribed')
        match.status = query;

    return this.find(match)//, select)
}

//////////////////////////
// SubscriptionSchema.methods.getApplication = function(){
//     var self = this;
//     return new Promise(function (resolve, reject) {
//         this.populate('_application')
//         .exec()
//         .then(app=>{
//             resolve(app)
//         })
//         .catch(e=>{
//             reject(new error.Removed('Associated application got removed from the server.'))
//         })
//     })
// }




// SubscriptionSchema.statics.updateSubscription = function(notmail, sub, op){

//     //return //this.find({sub: '$2a$10$zqrxTLkdGNPVfBQlDKQGpetG3ssOQK7c4V197otsY1Ytbe6N66S0a'})
//     //return this.findById(mongoose.Types.ObjectId('58d1642dd31e5bc5d8810395'))
//     return

// }

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