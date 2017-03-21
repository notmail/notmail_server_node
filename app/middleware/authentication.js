var Promise           = require('bluebird').Promise;
var usermsgs          = _require('/routes/user/usermsgs'),
    UserSchema        = _require('/model/user'),
    security          = _require('/util/security'),
    reqtools          = _require('/util/reqtools');
    error             = _require('/util/error');

module.exports = {};

module.exports.tokenAuthenticate = function(req, res, then){
    req.notmail = req.query.token.split('_')[0];
    req.token = req.query.token.split('_')[1];

    Promise.resolve()
    .then(()=>usermsgs.checkAuthParams(req.query))
    .then(()=>{return UserSchema.findSessions(req.notmail, req.token)})
    .then(session=>{
        if(session.length != 1) throw new error.Unauthorized('Wrong Session');
        req.session = session;
        then();
    })
    .catch(e => {                                                                   // Send error response      
        reqtools.errorHandler(e, res);
    })

}
