var Promise           = require('bluebird').Promise;
var usermsgs          = _require('/routes/user/usermsgs'),
    UserSchema        = _require('/model/user'),
    security          = _require('/util/security'),
    reqtools          = _require('/util/reqtools');


module.exports = {};

module.exports.tokenAuthenticate = function(req, res, then){
    req.notmail = req.query.token.split('_')[0];
    req.token = req.query.token.split('_')[1];

    Promise.resolve()
    .then(()=>usermsgs.checkAuthParams(req.query))
    .then(()=>{
        return UserSchema.findUserByNotmail(req.notmail, 'sessions messages');
    })
    .then((user)=>{
        let session = user.sessions.filter(session=>session.token == req.token)

        if(session.length != 1) throw new error.Unauthorized('Wrong Session');

        req.user = user;
        req.session = session;
        then();
    })
    .catch(e => {                                                                   // Send error response      
        errorHandler(e, res);
    })

}
