var Promise           = require('bluebird').Promise;
var usermsgs          = _require('/routes/user/usermsgs'),
    UserSchema        = _require('/model/user'),
    security          = _require('/util/security'),
    reqtools          = _require('/util/reqtools');
    error             = _require('/util/error'),
    appmsgs           = _require('/routes/app/appmsgs.js'),
    ApplicationSchema = _require('model/application');
    SessionSchema     = _require('model/session');

module.exports = {};

module.exports.applicationAuthenticate = function(req, res, then){

    Promise.resolve()
    .then(()       => {return appmsgs.checkAuthParams(req.query, true)})                // Validate request auth params       
    .then(()       => {return ApplicationSchema.authenticate(req.query, true)})         // Check authentication
    .then(app      => {if (reqtools.appCheckSecurity(req, app)) req.app = app.save();   // Check Security
                       else                                     req.app = app;
                       then();})
    .catch(e       => {reqtools.errorHandler(e, res);})                                 // Send error response      
        
}

module.exports.tokenAuthenticate = function(req, res, then){

    Promise.resolve()
    .then(()=>{return usermsgs.checkAuthParams(req.query) })
    .then((token)=>{
        return SessionSchema.findSession(token[0], token[1])
    })
    .then(session=>{
        req.session = session;
        then()
    })
    .catch(e => {                                                                   // Send error response      
        reqtools.errorHandler(e, res);
    })

}
