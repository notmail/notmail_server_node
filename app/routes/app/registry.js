var router            = require('express').Router(),
    mongoose          = require('mongoose'),
    Promise           = require('bluebird').Promise,
    ApplicationSchema = _require('model/application'),
    reqtools          = _require('util/reqtools'),
    error             = _require('util/error'),
    appmsgs           = require('./appmsgs.js');

/**
 * Routing
 */
// POST /app/registry (registerApp)
router.post('/', function(req, res, next) {
    Promise.resolve(req.body)
    .then(appmsgs.registryPostCheck)                                                // Validate Request
    .then(()       => {return ApplicationSchema.newApplication(req.body)})          // Create an application instance
    .then(newapp   => {return reqtools.appCheckSecurity(req, newapp)})              // Check connection checkSecurity
    .then(newapp   => {return newapp.save()})                                       // Save new instance
    .then(appmsgs.registryPostResponse)                                             // Create response from new data
    .then(response => {res.status(200).send(response)})                             // Send correct response                              
    .catch(e => {                                                                   // Send error response      
        reqtools.errorHandler(e, res);
    })
})
// GET /app/registry (infoApp)
router.get('/', function(req, res, next) {
    Promise.resolve()
    .then(()       => {return appmsgs.checkAuthParams(req.query, true)})             // Validate request auth params       
    .then(()       => {return ApplicationSchema.authenticate(req.query, true)})      // Check authentication
    .then(app      => {return reqtools.appCheckSecurity(req, app)})                  // Check connection checkSecurity
    .then(app      => {return app.save()})                                           // Save changes
    .then(appmsgs.registryGetResponse)                                               // Use data from DB to forge response
    .then(response => {res.status(200).send(response)})                              // Send correct response                              
    .catch(e       => {                                                              // Send error response      
        reqtools.errorHandler(e, res);
    })
})
// PUT /app/registry (registerApp)
router.put('/', function(req, res, next) {
    Promise.resolve()
    .then(()      => {return appmsgs.checkAuthParams(req.query, true, true)})       // Validate request auth params       
    .then(()      => {return ApplicationSchema.authenticate(req.query, true, true)})// Check authentication
    .then(app     => {return reqtools.appCheckSecurity(req, app)})                  // Check connection checkSecurity
    //.then(app   => {return app.save()})                                           // Save changes
    .then(app     => {return ApplicationSchema.updateApplication(app, req.body)})   // Prepare updates        
    .then(updated => {return updated.save()})                                       // Save changes
    .then(appmsgs.registryPutResponse)                                              // Prepare response
    .then(data    => {res.status(200).send(data)})                                  // Send correct response   
    .catch(e      => {                                                              // Send error response      
        reqtools.errorHandler(e, res);
    })
})
// DEL /app/registry (deleteApp)
router.delete('/', function(req, res, next) {
    Promise.resolve()
    .then(()      => {return appmsgs.checkAuthParams(req.query, true, true)})       // Validate request auth params       
    .then(()      => {return ApplicationSchema.authenticate(req.query, true, true)})// Check authentication
    .then(app     => {return app.remove();})                                        // Save app changes
    .then(data    => {res.status(200).end()})                                       // Send correct response   
    .catch(e      => {                                                              // Send error response      
        reqtools.errorHandler(e, res);
    })
})

/* Module settings */
module.exports = router;