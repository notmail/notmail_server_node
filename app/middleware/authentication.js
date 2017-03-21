var Promise           = require('bluebird').Promise;
var usermsgs          = _require('/routes/user/usermsgs'),
    UserSchema        = _require('/model/user'),
    security          = _require('/util/security'),
    reqtools          = _require('/util/reqtools');
    error             = _require('/util/error'),
    appmsgs           = _require('/routes/app/appmsgs.js'),
    ApplicationSchema = _require('model/application');

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
    .then(()=>{
        let netToken = usermsgs.checkAuthParams(req.query);
        req.notmail = netToken[0];
        req.token = netToken[1];
    })
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
