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
        return SessionSchema.newSession(user._id, req.query).save()})
    .then((session)=>{return usermsgs.authGetResponse(req.query.notmail, session)})                        // Create response message
    .then(response => {res.status(200).send(response)})                             // Send correct response
    .catch(e       => {reqtools.errorHandler(e, res);})                             // Send error response      

})


/* Module settings */
module.exports = router;