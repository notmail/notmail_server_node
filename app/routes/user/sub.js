var express = require('express'),
    router = express.Router(),
    usermsgs = require('./usermsgs'),
    UserSchema = _require('/model/user'),
    SessionSchema = _require('/model/session'),
    reqtools = _require('/util/reqtools');

/**
 * Routing
 */
// GET /user/sub (getSubscriptions)
router.get('/', function(req, res, next) {

    UserSchema.findSubscriptions(req.notmail, req.query.query)
    .then(data=>{return usermsgs.subGetResponse(data)})
    .then(response => {res.status(200).send(response)})                             // Send correct response
    .catch(e => {                                                                   // Send error response      
        reqtools.errorHandler(e, res);
    })
})


/* Module settings */
module.exports = router;