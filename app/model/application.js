var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

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
    updated: { type: Date, default: Date.now }
})

ApplicationSchema.virtual('unique_id').get(function() {
    return this._id;
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

            newapp.shared_key = 'add'//validator.genSharedKey(); //*
            newapp.root_secret = 'asda'//validator.genSharedKey(); //*

            resolve(newapp);
        }catch(e){
            reject(new Error('error creating application'));
        }
    })
}

module.exports = mongoose.model('Application', ApplicationSchema)