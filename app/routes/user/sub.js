var express = require('express'),
    router = express.Router(),
    usermsgs = require('./usermsgs'),
    UserSchema = _require('/model/user'),
    SessionSchema = _require('/model/session'),
    SubscriptionSchema = _require('/model/subscription'),
    reqtools = _require('/util/reqtools');

/**
 * Routing
 */
// GET /user/sub (getSubscriptions)
router.get('/', function(req, res, next) {

    UserSchema.findSubscriptions(req.notmail, req.query.query, req.query.sub)
    .then(data=>{return usermsgs.subGetResponse(data)})
    .then(response => {res.status(200).send(response)})                             // Send correct response
    .catch(e => {                                                                   // Send error response      
        reqtools.errorHandler(e, res);
    })
})

// PUT /user/sub (getSubscriptions)
router.put('/', function(req, res, next) {

    //UserSchema.editSubscription(req.notmail, req.query.sub, req.query.op)
    SubscriptionSchema.updateSubscription(req.notmail, req.query.sub, req.query.op)
    .then(data=>{
        //data[0].subscriptions.status = 'pending';
        //data.save();
        console.log(data); return data})
    .then(response => {res.status(200).send(response)})                             // Send correct response
    .catch(e => {                                                                   // Send error response      
        reqtools.errorHandler(e, res);
    })
})


/* Module settings */
module.exports = router;