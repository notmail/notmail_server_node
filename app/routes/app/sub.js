var router             = require('express').Router(),
    mongoose           = require('mongoose'),
    Promise            = require('bluebird').Promise,
    ApplicationSchema  = _require('model/application'),
    reqtools           = _require('util/reqtools'),
    error              = _require('util/error'),
    appmsgs            = require('./appmsgs.js'),
    UserSchema         = _require('model/user');
    SubscriptionSchema = _require('model/subscription');

// PUT /app/sub (subscriptionRequest)
router.put('/', function(req, res, next) {
    let appref;
    let subref;
    Promise.resolve()
    .then(()      => appmsgs.subPostCheck(req.body))                                // Validate request params       
    .then(()      => appmsgs.checkAuthParams(req.query, true))                      // Validate request auth params       
    .then(()      => ApplicationSchema.authenticate(req.query, true))               // Check authentication
    .then(app     => reqtools.appCheckSecurity(req, app))                           // Check connection checkSecurity
    .then(app     => app.save())                                                    // Save changes
    .then(app     => {appref = app;                                                 // Get user data with subscriptions
                      return UserSchema.findUserByNotmail(req.body.dest.user,'subscriptions')})
    .then(user    => {                                                              // Get associated subscription and create if not exist
                     try{           subref = user.retrieveSubscriptions(appref._id)[0].reset() }
                     catch(e){      subref = SubscriptionSchema.newSubscription(appref);
                                    user.subscriptions.push(subref) }
                     user.markModified('subscriptions')
                     return user.save();})
    .then(user => appmsgs.subPutResponse(subref))                                   // Prepare response
    .then(response=> res.status(200).send(response))                                // Send correct response   
    .catch(e      => {                                                              // Send error response      
        reqtools.errorHandler(e, res);
    })
})


// GET /app/sub (checkSubRequest)
router.get('/', function(req, res, next) {
    let appref;
    Promise.resolve()
    .then(()      => appmsgs.subGetCheck(req.query))                                // Validate request auth params       
    .then(()      => appmsgs.checkAuthParams(req.query, true))                      // Validate request auth params       
    .then(()      => ApplicationSchema.authenticate(req.query, true))               // Check authentication
    .then(app     => reqtools.appCheckSecurity(req, app))                           // Check connection checkSecurity
    .then(app     => app.save())                                                    // Save changes
    .then(app     => {appref = app;                                                 // Get user data with subscriptions
                      return UserSchema.findUserByNotmail(req.query.user,'subscriptions')})
    .then(user    => {                                                              // Get subscription related to application
                    try{ return user.retrieveSubscriptions(appref._id)[0] }
                    catch(e){throw new error.Forbidden('no subscription found' +e.message)}})
    .then(sub     => res.status(200).end())                                         // Send correct response   
    .catch(e      => {                                                              // Send error response      
        reqtools.errorHandler(e, res);
    })
})

/* Module settings */
module.exports = router;