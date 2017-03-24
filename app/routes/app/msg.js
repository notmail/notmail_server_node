var router             = require('express').Router(),
    mongoose           = require('mongoose'),
    Promise            = require('bluebird').Promise,
    ApplicationSchema  = _require('model/application'),
    reqtools           = _require('util/reqtools'),
    error              = _require('util/error'),
    appmsgs            = require('./appmsgs.js'),
    UserSchema         = _require('model/user');
    SubscriptionSchema = _require('model/subscription');
    MessageSchema      = _require('model/message');

// POST /app/msg (newMessage)
router.post('/', function(req, res, next) {

    Promise.resolve()
    .then(()    => appmsgs.msgPostCheck(req.body))                                                  // Check request data
    .then(()    => {return SubscriptionSchema.getAppUserSubscriptions(req.app._id, req.user._id)})  // Check if subscribed
    .then(sub   => {if(appmsgs.checkSubStatus(sub))                                                 // Check subscription status
                        MessageSchema.newMessage(req.body.msg, sub._id, req.user._id).save();})
    .then(()    => res.status(200).end())                                                           // Send correct response
    .catch(e    => {reqtools.errorHandler(e, res);})                                                // Send error response  

})

/* Module settings */
module.exports = router;