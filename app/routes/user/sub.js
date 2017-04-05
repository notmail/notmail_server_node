var express            = require('express'),
    router             = express.Router(),
    usermsgs           = require('./usermsgs'),
    UserSchema         = _require('/model/user'),
    SessionSchema      = _require('/model/session'),
    SubscriptionSchema = _require('/model/subscription'),
    MessageSchema      = _require('/model/message'),
    reqtools           = _require('/util/reqtools'),
    Promise            = require('bluebird').Promise;

/**
 * Routing
 */
// GET /user/sub (getSubscriptions)
router.get('/', function(req, res, next) {

    Promise.resolve()
    .then(()       => usermsgs.subGetCheck(req.query))                                          // Check request params
    .then(()       => {return SubscriptionSchema.getUserSubscriptions                           // Find subscriptions
                                (req.session.user._id, req.query.query, req.query.sub)})
    .then(data     => {return usermsgs.subGetResponse(data)})                                   // Generate output
    .then(response => {res.status(200).send(response)})                                         // Send correct response
    .catch(e       => {reqtools.errorHandler(e, res);})                                         // Send error response  
        
})

// PUT /user/sub (getSubscriptions)
router.put('/', function(req, res, next) {
    
    SubscriptionSchema.getSubUserSubscription(req.query.sub, req.session.user._id)
    .then(sub=>{
        if(!sub) new error.BadRequest('No such subscription')
        if(req.query.op == 'subscribe'){
            sub.status = 'subscribed';
            sub.validation = undefined;
            sub.save();
        }else if (req.query.op == 'unsubscribe'){
            sub.status = 'unsubscribed';
            sub.save();
        }else if (req.query.op == 'delete'){
            sub.remove();
            MessageSchema.remove({ sub: sub.sub })
        }
    })
    .then(() => {res.status(200).end()})                                            // Send correct response
    .catch(e => {                                                                   // Send error response      
        reqtools.errorHandler(e, res);
    })
    
})


/* Module settings */
module.exports = router;