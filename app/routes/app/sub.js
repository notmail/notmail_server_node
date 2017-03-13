var router            = require('express').Router(),
    mongoose          = require('mongoose'),
    Promise           = require('bluebird').Promise,
    ApplicationSchema = _require('model/application'),
    reqtools          = _require('util/reqtools'),
    error             = _require('util/error'),
    appmsgs           = require('./appmsgs.js'),
    userSchema = _require('model/user');

// PUT /app/sub (subscriptionRequest)
router.put('/', function(req, res, next) {
    Promise.all([
        Promise.resolve()
        .then(()      => {return appmsgs.checkAuthParams(req.query, true)})             // Validate request auth params       
        .then(()      => {return ApplicationSchema.authenticate(req.query, true)})      // Check authentication
        .then(app     => {return reqtools.appCheckSecurity(req, app)})                  // Check connection checkSecurity
        .then(app     => {return app.save()})                                           // Save changes
    ,
        Promise.resolve()
        .then(()      => {return appmsgs.subPostCheck(req.body)})
        .then(()=>{
                return
                userSchema.findOne({notmail:req.body.dest.user})
                .populate({
                    path: 'subscriptions'
                })
                .exec()
        })
        .then((a)=>{
            console.log(a)
        })
    ])
    .then((data)=>{
        
    })
    .then(data    => {res.status(200).send(data)})                                  // Send correct response   
    .catch(e      => {                                                              // Send error response      
        reqtools.errorHandler(e, res);
    })
})


// GET /app/sub (checkSubRequest)
router.get('/', function(req, res, next) {
    
    Promise.resolve()
    .then(()      => {return appmsgs.checkAuthParams(req.query, true)})             // Validate request auth params       
    .then(()      => {return ApplicationSchema.authenticate(req.query, true)})      // Check authentication
    .then(app     => {return reqtools.appCheckSecurity(req, app)})                  // Check connection checkSecurity
    .then(app     => {return app.save()})                                           // Save changes
    .then(app=>{
        UserSchema.connection.find(
        {
            subscriptions: {
                $elemMatch: {validation: '1234'}
            }
        })

    })

    .then(data    => {res.status(200).send(data)})                                  // Send correct response   
    .catch(e      => {                                                              // Send error response      
        reqtools.errorHandler(e, res);
    })
})

/* Module settings */
module.exports = router;