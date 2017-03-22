var router             = require('express').Router(),
    mongoose           = require('mongoose'),
    Promise            = require('bluebird').Promise,
    ApplicationSchema  = _require('model/application'),
    reqtools           = _require('util/reqtools'),
    error              = _require('util/error'),
    appmsgs            = require('./appmsgs.js'),
    UserSchema         = _require('model/user');
    SubscriptionSchema = _require('model/subscription');
    MessageSchema = _require('model/message');

// POST /app/msg (newMessage)
router.post('/', function(req, res, next) {
    let subref;
    Promise.resolve()
    .then(()    =>appmsgs.msgPostCheck(req.body))
    .then(()    =>{return SubscriptionSchema.getAppUserSubscriptions(req.app._id, req.user._id)})
    .then(sub   =>{if (!sub)
                        throw new error.Forbidden('no subscription found')
                   else if(sub.status == 'pending' || sub.status == 'unsubscribed')
                        throw new error.Forbidden('subscription '+ sub.status)
                   else if(sub.status == 'subscribed') 
                        return MessageSchema.newMessage(req.body.msg, sub._id, req.user._id).save();})
    .then(()=> res.status(200).end())                                // Send correct response
    .catch(e       => {reqtools.errorHandler(e, res);})                             // Send error response      
})

/* Module settings */
module.exports = router;