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
    let subref;
    console.log('a')
    Promise.resolve()
    //.then(()    =>appmsgs.subPutCheck(req.body))
    .then(()    =>{return SubscriptionSchema.getAppUserSubscriptions(req.app._id, req.user._id)})
    .then(sub   =>{
                   if (sub)   subref = sub.reset();
                   else       subref = SubscriptionSchema.newSubscription(req.app._id, req.user._id);
                   return subref.save();})
    .then(sub => appmsgs.subPutResponse(sub))                                   // Prepare response
    .then(response=> res.status(200).send(response))                                // Send correct response
    .catch(e       => {reqtools.errorHandler(e, res);})                             // Send error response      
})

// GET /app/sub (checkSubRequest)
router.get('/', function(req, res, next) {
    let subref;
    Promise.resolve()
    //.then(()    =>appmsgs.subPutCheck(req.body))
    .then(()    =>{return SubscriptionSchema.getAppUserSubscriptions(req.app._id, req.user._id)})
    .then(sub   =>{
                   if (!sub)                                throw new error.Forbidden('no subscription found')
                   else if(sub && sub.status == 'pending')  throw new error.Forbidden('subscription pending')})
    .then(()=> res.status(200).end())                                // Send correct response
    .catch(e       => {reqtools.errorHandler(e, res);})                             // Send error response      
})

/* Module settings */
module.exports = router;