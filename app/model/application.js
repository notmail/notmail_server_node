var mongoose = require('mongoose');  
var Schema   = mongoose.Schema,
    error    = _require('util/error'),
    security = _require('util/security'),
    passwords = _require('../passwords.json');

var ApplicationSchema = new Schema({
    // Main fields
    shared_key: { type: String, required: true },
    root_secret: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    url: String,
    icon: String,
    unsecured_source: { type: Boolean, required: true },

    // Auto
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    last_event: { type: Date, default: Date.now }
})

ApplicationSchema.virtual('unique_id').get(function() {
    try{
        unique_id = security.encrypt(this._id, passwords.application_pwd)
    }catch(e){
        console.log(e)
        unique_id = -1;
    }
    return unique_id;
});

ApplicationSchema.statics.newApplication = function(body){
    var self = this;
    return new Promise(function (resolve, reject) {
        try{
            newapp = new self();
            newapp.title = body.app.title; //#*
            newapp.description = body.app.description; //#
            newapp.url = body.app.url; //#
            newapp.icon = body.app.icon; //#

            newapp.shared_key = security.genRandomKey(); //*
            newapp.root_secret = security.genRandomKey(); //*

            resolve(newapp);
        }catch(e){
            reject(new Error('error creating application'));
        }
    })
}

ApplicationSchema.statics.authenticate = function(query, shared_key, root_secret){
    var self = this;
    return new Promise(function (resolve, reject) {
        try{
            var id;
            id = security.decrypt(query.unique_id, passwords.application_pwd)
            if (id == -1) reject(new error.SecurityError('-1 while decoding id'))
            
            self.findById(id).exec()
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
            console.log(e)
            reject(new error.Unknown('error during authentication'));
        }
    })
}

ApplicationSchema.statics.update_application = function(app, changes){
    var self = this;
    if (changes.app) changes = changes.app;
    else             throw new error.BadRequest('Wrong update data');
    return new Promise(function (resolve, reject) {
        try{
            if(changes.url) app.url = changes.url;
            if(changes.icon) app.icon = changes.icon;
            if(changes.description) app.description = changes.description;
            app.shared_key = security.genRandomKey();
            resolve(app);
        }catch(e){
            console.log(e)
            reject(new error.BadRequest('Wrong update data'));
        }
    })
}

module.exports = mongoose.model('Application', ApplicationSchema)