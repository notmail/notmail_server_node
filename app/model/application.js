var mongoose  = require('mongoose');  
var Schema    = mongoose.Schema,
    error     = _require('util/error'),
    security  = _require('util/security');
    
var ApplicationSchema = new Schema({
    //unique_id                                                 // *a (virtual)
    shared_key      : { type: String, required : true },        // *a
    root_secret     : { type: String, required : true },        // *a
    title           : { type: String, required : true },        // *m
    unsecured_source: { type: Boolean, required: true },        // *a
    description     : String,                                   // m
    url             : String,                                   // m
    icon            : String,                                   // m
    created         : { type: Date, default    : Date.now },    // *a
    //updated         : { type: Date, default    : Date.now }     // not_implemented
    //last_event      : { type: Date, default    : Date.now }     // not_implemented
})

ApplicationSchema.virtual('unique_id').get(function() {
    return this._id;
});

ApplicationSchema.statics.newApplication = function(body){
    try{
        newapp = new this();
        newapp.title = body.app.title; //#*
        newapp.description = body.app.description; //#
        newapp.unsecured_source = false;
        newapp.url = body.app.url; //#
        newapp.icon = body.app.icon; //#
        newapp.shared_key = security.genRandomKey(); //*
        newapp.root_secret = security.genRandomKey(); //*
        return newapp;
    }catch(e){
        throw new Error('error creating application. ' + e.message);
    }
}

ApplicationSchema.statics.authenticate = function(query, shared_key, root_secret){
    var self = this;
    return new Promise(function (resolve, reject) {
        try{
            self.findById(query.unique_id).exec()
            .then(app=>{
                if(shared_key && query.shared_key != app.shared_key)
                    reject(new error.Unauthorized('Wrong shared_key'));
                if(root_secret && query.root_secret != app.root_secret)
                    reject(new error.Forbidden('Wrong root_secret'));
                resolve(app)
            })
            .catch(e => {
                reject(new error.Unauthorized('Application does not exist'));
            })
        }catch(e){
            if (e.name == 'Security Error') reject(new error.Unauthorized('error during authentication'));
            reject(new error.Unknown('error during authentication'));
        }
    })
}

ApplicationSchema.statics.updateApplication = function(app, changes){
    if (changes.app) changes = changes.app;
    else             throw new error.BadRequest('Wrong update data');

    try{
        if(changes.url) app.url                 = changes.url;
        if(changes.icon) app.icon               = changes.icon;
        if(changes.description) app.description = changes.description;
        app.shared_key                          = security.genRandomKey();
        return app;
    }catch(e){
        console.log(e)
        reject(new error.BadRequest('Wrong update data.' + e.message));
    }
}

module.exports = mongoose.model('Application', ApplicationSchema)