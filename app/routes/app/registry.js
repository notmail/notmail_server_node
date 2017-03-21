var router            = require('express').Router(),
    mongoose          = require('mongoose'),
    Promise           = require('bluebird').Promise,
    ApplicationSchema = _require('model/application'),
    reqtools          = _require('util/reqtools'),
    error             = _require('util/error'),
    appmsgs           = require('./appmsgs.js'),
    authentication    = _require('/middleware/authentication');

/**
 * Routing
 */
// POST /app/registry (registerApp)
router.post('/', function(req, res, next) {
    Promise.resolve(req.body)
    .then(appmsgs.registryPostCheck)                                                // Validate Request
    .then(()       => {return ApplicationSchema.newApplication(req.body)})          // Create an application instance
    .then(newapp   => {reqtools.appCheckSecurity(req, newapp);                      // Check connection checkSecurity and save new instance
                       return newapp.save();})                                             
    .then(appmsgs.registryPostResponse)                                             // Create response from new data
    .then(response => {res.status(200).send(response)})                             // Send correct response                              
    .catch(e       => {reqtools.errorHandler(e, res);})                             // Send error response      
})

// Authentication Middleware
router.use(authentication.applicationAuthenticate)                                  // Application credentials

// GET /app/registry (infoApp)
router.get('/', function(req, res, next) {
    Promise.resolve(req.app)
    .then(appmsgs.registryGetResponse)                                               // Use data from DB to forge response
    .then(response => {res.status(200).send(response)})                              // Send correct response                              
    .catch(e       => {reqtools.errorHandler(e, res);})                              // Send error response      
})

// PUT /app/registry (registerApp)
router.put('/', function(req, res, next) {
    Promise.resolve()
    .then(()      => {appmsgs.checkAuthParams(req.query, false, true)                // Validate request auth params (root secret)
                      if(req.app.root_secret!=req.query.root_secret) throw new error.Forbidden('Wrong root_secret')})
    .then(app     => {return ApplicationSchema.updateApplication(req.app, req.body)})// Prepare updates        
    .then(updated => {return updated.save()})                                        // Save changes
    .then(appmsgs.registryPutResponse)                                               // Prepare response
    .then(data    => {res.status(200).send(data)})                                   // Send correct response   
    .catch(e      => {reqtools.errorHandler(e, res);})                               // Send error response      
})

// DEL /app/registry (deleteApp)
router.delete('/', function(req, res, next) {
    Promise.resolve()
    .then(()      => {appmsgs.checkAuthParams(req.query, false, true)                // Validate request auth params (root secret)
                      if(req.app.root_secret!=req.query.root_secret) throw new error.Forbidden('Wrong root_secret')})
    .then(app     => {return req.app.remove();})                                    // Save app changes
    .then(data    => {res.status(200).end()})                                       // Send correct response   
    .catch(e      => {reqtools.errorHandler(e, res);})                              // Send error response      
})

/* Module settings */
module.exports = router;