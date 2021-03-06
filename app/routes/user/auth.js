var express       = require('express'),
    router        = express.Router(),
    usermsgs      = require('./usermsgs'),
    UserSchema    = _require('/model/user'),
    SessionSchema = _require('/model/session'),
    reqtools      = _require('/util/reqtools'),
    Promise       = require('bluebird').Promise,
    authentication = _require('/middleware/authentication');


/**
 * Routing
 */
// GET /user/auth (authenticateUser)
router.get('/', function(req, res, next) {

    Promise.resolve(req.query)
    .then(usermsgs.authGetCheck)                                                                // Check request params
    .then(()        => {return UserSchema.authenticate(req.query.notmail, req.query.pwd)})      // Authenticate user
    .then(user      => {return SessionSchema.newSession(user._id, req.query).save()})           // Create new session and save it
    .then((session) => {return {session: usermsgs.authGetResponse(req.query.notmail, session)}})// Create response message
    .then(response  => {res.status(200).send(response)})                                        // Send correct response
    .catch(e        => {reqtools.errorHandler(e, res);})                                        // Send error response      

})

router.use(authentication.tokenAuthenticate)    // TokenAuthentication Middleware

// GET /user/auth (authenticateUser)
router.get('/info', function(req, res, next) {

    Promise.resolve(req.query)
    .then((session) => {return {session: usermsgs.authGetResponse(false, req.session)}})        // Create response message
    .then(response  => {res.status(200).send(response)})                                        // Send correct response
    .catch(e        => {reqtools.errorHandler(e, res);})                                        // Send error response      

})

/* Module settings */
module.exports = router;