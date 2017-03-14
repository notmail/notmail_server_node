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
    let appref, subref, userref;
    Promise.resolve()
    .then(()      => appmsgs.msgPostCheck(req.body))                                // Validate request params       
    .then(()      => appmsgs.checkAuthParams(req.query, true))                      // Validate request auth params       
    .then(()      => ApplicationSchema.authenticate(req.query, true))               // Check authentication
    .then(app     => reqtools.appCheckSecurity(req, app))                           // Check connection checkSecurity
    .then(app     => app.save())                                                    // Save changes

    .then(app     => {appref = app;                                                 // Get user data with subscriptions
                      return UserSchema.findUserByNotmail(req.body.dest.user,'subscriptions messages')})
    .then(user    => {userref=user                                                  // Get associated subscription and check if subscribed
                     try{           subref = user.retrieveSubscriptions(appref._id)[0]
                                    if(subref.status != 'subscribed') throw new error.Forbidden('no subscription found')}
                     catch(e){      throw new error.Forbidden('no subscription found' +e.message)}})
    .then( ()=>{                                                                    // Create and save message
        let msg = MessageSchema.newMessage(req.body.msg, subref._id)
        userref.messages.push(msg)
        userref.markModified('messages')
        userref.save();
    })
    .then(response=> res.status(200).end())                                         // Send correct response   
    .catch(e      => {                                                              // Send error response      
        reqtools.errorHandler(e, res);
    })
})

/* Module settings */
module.exports = router;