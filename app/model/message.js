var mongoose      = require('mongoose');  
var Schema        = mongoose.Schema,
    error         = _require('util/error'),
    security      = _require('util/security'),
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var MessageSchema = new Schema({
    //_id ('Number' autoIncremented)
    _sub: {type: Number, required: true},
    title: {type: String, required: true},
    type: {type: String, default: 'text'},
    data: String,
    arrival_time: {type: Date, required: true},

    // Todavía no
    type: String,
    deliver_time: Date,
    aler_time: Date,
    ack: Boolean
})

MessageSchema.statics.newMessage = function(message, subscriptionId){
    try{
        newmessage = new this();
        newmessage.data = message.data;
        newmessage.title = message.title;
        if(message.arrival_time) newmessage.arrival_time = new Date(message.arrival_time);
        if(message.deliver_time) newmessage.deliver_time = new Date(message.deliver_time);
        newmessage.ack = message.ack;
        newmessage._sub = subscriptionId;
        newmessage.arrival_time = Date.now();
        //console.log(newmessage._sub)
        return newmessage;
    }catch(e){
        throw new Error('error creating new message. ' + e.message);
    }
}

MessageSchema.plugin(autoIncrement.plugin, 'Message');
module.exports = mongoose.model('Message', MessageSchema)