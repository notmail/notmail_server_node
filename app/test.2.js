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


ApplicationSchema.findById("58c2ee1cc6c80150a2967cdc")
.then(app=>{
    UserSchema.findOne({notmail: 'jaime@ehu.es'})
    .then(user=>{
        
        // sub = SubscriptionSchema.create({
        //     //status: 'pending'
        //     validation: "1234",
        //     _application: app
        // })
        // user.subscriptions.push(sub)
        
        // user.subscriptions.push({
        //     //status: 'pending'
        //     validation: "1234",
        //     _application: app
        // })

        user.subscriptions.push({
            //status: 'pending'
            validation: "1234",
            _application: app
        })
        user.markModified('subscriptions')
        user.save()
        .then(user=>console.log(user))
        .catch(e=>console.log(e))
    })
    .catch(e=>console.log(e))
})
.catch(e=>console.log(e))

/*
user = UserSchema.newUser({
    notmail: 'jaime@ehu.es',
    pwd: '123412341234'
})
user.save()
.then(user=>{console.log('created! ' + JSON.stringify(user))})
.catch(e=>console.log(e))
*/


// function mypromise(test) {
//     return new Promise(

//         function (resolve, reject) {
//             setTimeout(()=>{
//                 if(!test) reject('adios')
//                 resolve('hola');
//             },1000)
//         });
// }

// var mydata = '1';

// mypromise(true)
// .then(data => {
//     mydata += data;
//     console.log(data)
//     throw new Error('a');
// })
// .catch(e => {
//     console.log(e)
// })
// console.log('promise end')

// try{
//     throw new Error('errrrrror');
// }catch(e){
//     console.log('catched:' , e)
// }