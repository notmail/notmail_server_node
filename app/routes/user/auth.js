var express = require('express'),
    router = express.Router(),
    usermsgs = require('./usermsgs'),
    UserSchema = _require('/model/user'),
    SessionSchema = _require('/model/session'),
    reqtools = _require('/util/reqtools'),
    Promise            = require('bluebird').Promise;

/**
 * Routing
 */
// GET /user/auth (authenticateUser)
router.get('/', function(req, res, next) {
    var sessionref;
    Promise.resolve(req.query)
    .then(usermsgs.authGetCheck)                                                    // Check request params
    .then(()=>{return UserSchema.authenticate(req.query.notmail, req.query.pwd)})   // Authenticate user
    .then(user=>{                                                                   // Create new session and save it
        sessionref = SessionSchema.newSession(req.query);
        user.addSession(sessionref);
        user.markModified('sessions')
        return user.save()})
    .then(()=>{return usermsgs.authGetResponse(req.query.notmail, sessionref)})                        // Create response message
    .then(response => {res.status(200).send(response)})                             // Send correct response
    .catch(e => {                                                                   // Send error response      
        reqtools.errorHandler(e, res);
    })
})


/* Module settings */
module.exports = router;