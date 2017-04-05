var router             = require('express').Router(),
    mongoose           = require('mongoose'),
    Promise            = require('bluebird').Promise,
    ApplicationSchema  = _require('model/application'),
    reqtools           = _require('util/reqtools'),
    error              = _require('util/error'),
    usermsgs           = require('./usermsgs.js'),
    UserSchema         = _require('model/user');
    SubscriptionSchema = _require('model/subscription');
    MessageSchema      = _require('model/message');

// GET /usr/msg (getMessages)
router.get('/', function(req, res, next) {
    let msgref;

    Promise.resolve()
    .then(()    => {return MessageSchema.getMessages(req.session.user._id,
                     req.query.query, req.query.sub, req.query.data, req.query.id)})
    .then((data)=> {msgref = data;
                    if(req.query.data)
                        data = data.reduce((r,msg)=>{return r+msg.data+req.query.data[0].charAt(0)},'')
                    return {msgs:data}})
    .then((data)=> {res.status(200).send(data) })                               // Send correct response
    .then(()    => {if(req.query.delete == 1) return MessageSchema.delMessages(msgref)})
    .then((res) => {})
    .catch(e    => {reqtools.errorHandler(e, res);})                             // Send error response      
    
})

// DELETE /usr/msg (deleteMessages)
router.delete('/', function(req, res, next) {

    Promise.resolve()
    .then(()    => {return usermsgs.msgDelCheck(req.query)})
    .then(()    => {return MessageSchema.getMessages(req.session.user._id,
                            req.query.query, req.query.sub, false, req.query.id)})
    .then((data)=> {return MessageSchema.delMessages(data)})
    .then((data)=> {res.status(200).send({ result: data.result.n})})                // Send correct response
    .catch(e    => {reqtools.errorHandler(e, res);})                                // Send error response      
    
})

// PUT /usr/msg (deleteMessages)
router.put('/', function(req, res, next) {

    Promise.resolve()
    .then(()    => {return usermsgs.msgDelCheck(req.query)})
    .then((data)=> {if( ['markasread', 'markasnotread'].indexOf(req.query.op) != -1) 
                        return MessageSchema.editMessages(data)})
    .then((data)=> {console.log(data);res.status(200).send({ result: data.n})})         // Send correct response
    .catch(e    => {reqtools.errorHandler(e, res);})                                    // Send error response      
    
})


/* Module settings */
module.exports = router;