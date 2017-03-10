var router            = require('express').Router(),
    mongoose          = require('mongoose'),
    ApplicationSchema = _require('model/application'),
    reqtools          = _require('util/reqtools'),
    error             = _require('util/error');

/**
 * Routing
 */
router.post('/', function(req, res, next) {
    
    post_check(req.body)                                        // Validate Request
    .then(() => {                                               // Create an application instance
        return ApplicationSchema.newApplication(req.body);
    })
    .then(newapp => {                                           // Check connection checkSecurity
        return reqtools.appCheckSecurity(req, newapp);
    })
    .then(newapp => {                                           // Save new instance
        return newapp.save();
    })
    .then(post_response)                                        // Create response from new data
    .then(response => {
        res.status(200).send(response)                          // Send correct response                                   
    })
    .catch(e => {                                               // Send error response      
        try{                          
            if(e.name === 'Bad Request')
                reqtools.res_err(res, 400, e.name, e.message)
            else
                reqtools.res_err(res, 500, e.name, e.message)
        }catch(e) {
            console.log('fatal error:' + e)
            res.status(500).end();
        }
    })

})

router.get('/', function(req, res, next) {

    reqtools.check_auth_params(req.query, true)                 // Check basic auth params
    .then(() => {                                               // Check authentication
        return ApplicationSchema.authenticate(req.query, true)
    })
    .then(app => {                                              // Check connection checkSecurity
        return reqtools.appCheckSecurity(req, app);
    })
    .then(app => {                                              // Save app changes
        return app.save();
    })
    .then(get_response)                                         // Use data from DB to forge response
    .then(response => {                                         // Send correct response   
        res.status(200).send(response)
    })
    .catch(e => {                                               // Send error response      
        try{                          
            if(e.name === 'Bad Request')
                reqtools.res_err(res, 400, e.name, e.message)
            else if(e.name === 'Unauthorized')
                reqtools.res_err(res, 401, e.name, e.message)
            else
                reqtools.res_err(res, 500, e.name, e.message)
        }catch(e) {
            console.log('fatal error:' + e)
            res.status(500).end();
        }
    })

})

router.put('/', function(req, res, next) {

    reqtools.check_auth_params(req.query, true, true)           // Check total auth params
    .then(() => {                                               // Check total authentication
        return ApplicationSchema.authenticate(req.query, true, true)
    })
    .then(app => {                                              // Check connection checkSecurity
        return reqtools.appCheckSecurity(req, app);
    })
    .then(app => {                                              // Save app changes
        return app.save();
    })
    .then(app => {                                              // Prepare updates
        return ApplicationSchema.update_application(app, req.body);
    })
    .then(updated => {                                          // Save changes
        return updated.save();
    })
    .then(saved => {                                            // Prepare response
        return put_response(saved);
    })
    .then(data => {                                             // Send correct response   
        res.status(200).send(data)
    })
    .catch(e => {                                               // Send error response      
        try{                          
            if(e.name === 'Bad Request')
                reqtools.res_err(res, 400, e.name, e.message)
            if(e.name === 'Unauthorized')
                reqtools.res_err(res, 401, e.name, e.message)
            if(e.name === 'Forbidden')
                reqtools.res_err(res, 403, e.name, e.message)
            else{
                reqtools.res_err(res, 500, e.name, e.message)
                console.log(e)
            }
        }catch(e) {
            console.log('fatal error:' + e)
            res.status(500).end();
        }
    })

})

router.delete('/', function(req, res, next) {

    reqtools.check_auth_params(req.query, true, true)           // Check total auth params
    .then(() => {                                               // Check total authentication
        return ApplicationSchema.authenticate(req.query, true, true)
    })
    .then(app => {                                              // Save app changes
        return app.remove();
    })
    .then(data => {                                             // Send correct response   
        res.status(200).end()
    })
    .catch(e => {                                               // Send error response      
        try{                          
            if(e.name === 'Bad Request')
                reqtools.res_err(res, 400, e.name, e.message)
            if(e.name === 'Unauthorized')
                reqtools.res_err(res, 401, e.name, e.message)
            if(e.name === 'Forbidden')
                reqtools.res_err(res, 403, e.name, e.message)
            else{
                reqtools.res_err(res, 500, e.name, e.message)
                console.log(e)
            }
        }catch(e) {
            console.log('fatal error:' + e)
            res.status(500).end();
        }
    })

})



/**
 * Utilities
 */
function post_check(body){
    return new Promise(function (resolve, reject) {
        if(!body.app)
            reject(new error.BadRequest('app missing'));
        if(!body.app.title)
            reject(new error.BadRequest('title missing'));
        resolve();
    })
}

function post_response(created){
    let response = {
        auth:{
            root_secret: created.root_secret,
            shared_key: created.shared_key,
            unique_id: created.unique_id
        }
    }
    return response
}

function get_response(app){
    let response = {
        app:{
            title: app.title,
            description: app.description,
            unsecured_source: app.unsecured_source,
            url: app.url,
            icon: app.icon,
        }
    }
    return response;
}

function put_response(app){
    let response = {
        app:{
            shared_key: app.shared_key
        }
    }
    return response;
}

/* Module settings */
module.exports = router;