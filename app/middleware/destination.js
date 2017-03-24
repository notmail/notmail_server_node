var Promise           = require('bluebird').Promise,
    UserSchema        = _require('/model/user'),
    reqtools          = _require('/util/reqtools');
    error             = _require('/util/error'),
    appmsgs           = _require('/routes/app/appmsgs.js');

module.exports = function(req, res, then){

    Promise.resolve()
    .then(()     => {return appmsgs.checkDestination(req.query, req.body)})             // Validate request destination user    
    .then((user) => {return UserSchema.findUserByNotmail(user, '_id') })                // Try to find user
    .then(user   => {req.user  = user;
                     then();})
    .catch(e     => {reqtools.errorHandler(e, res);})                                   // Send error response      

}