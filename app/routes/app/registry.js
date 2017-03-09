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
    .then(()=>{                                                 // Create an application instance
        return ApplicationSchema.newApplication(req.body);
    })
    .then(newapp => {                                           // Check connection checkSecurity
        newapp.unsecured_source = reqtools.checkSecurity(req);
        return newapp.save();
    })
    .then(post_response)                                        // Create response from new data
    .then(response =>{
        res.status(200).send(response)                          // Send correct response                                   
    })
    .catch(e => {                                               // Send error response      
        try{                          
            if(e.name === 'BadRequest')
                reqtools.res_err(res, 400, e.name, e.message)
            else
                reqtools.res_err(res, 500, e.name, e.message)
        }catch(e) {
            console.log('fatal error:' + e)
            res.status(500).end();
        }
    })

})

//router.



/**
 * Validation
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



/* Module settings */
module.exports = router;