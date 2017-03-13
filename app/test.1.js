global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
}
global._require = function(file) {
    return require(abs_path('/' + file));
}

database = require('./model/database');
UserSchema = require('./model/user');
SubscriptionSchema = require('./model/subscription');
ApplicationSchema = require('./model/application');
var mongoose = require('mongoose')

/*
UserSchema.collection
.find({notmail:'jaime@ehu.es'},
 function(err,a){
     if (err)
        console.log(err)
     else{
         var a = a.toArray();
         console.log(a)
        // a.toArray()
        // .then(r=>{
        //     console.log(r[0].subscriptions[0])
        // })
        // .catch(e=>{
        //     console.log(e)
        // })
     }
 })
*/

UserSchema.collection
.aggregate([
    { '$match': {notmail: 'jaime@ehu.es'}}
    //{ '$match': {'_id': mongoose.Schema.Types.ObjectId('58c549ec1dd35c12283e31ac')}}
    ,
    { '$project': {
        list: {$filter: {
            input: '$subscriptions',
            as: 'list',
            cond: {$eq: ['$$list.validation', '123d4']}
        }}
    }}
], function(err,res){
    if(err) console.log('err:' + err)
    else{
        if(!res[0].list[0]) console.log('no result')
        else console.log(res[0].list[0])
    }
})
/*
UserSchema.collection
.aggregate([
    { '$match': {_id: mongoose.Schema.Types.ObjectId("58c549ec1dd35c12283e31ac")}}
    // { $project: {
    //     list: {$filter: {
    //         input: '$subscriptions',
    //         as: 'subscriptions',
    //         cond: {$gt: ['$$subscriptions.validation', '1234']}
    //     }}
    // }}
], function(err,res){
    console.log(err)
    console.log(res)
})
*/