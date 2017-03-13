var mongoose = require('mongoose');  
var Schema   = mongoose.Schema,
    error    = _require('util/error'),
    security = _require('util/security'),
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var MessageSchema = new Schema({
    //_id ('Number' autoIncremented)
    _subscription: {type: Number, ref: 'Subscription', required: true},
    title: {type: String, required: true},
    data: String,
    arrival_time: {type: Date, default: Date.now()},
    deliver_time: Date,
    aler_time: Date,
    ack: Boolean
})

MessageSchema.statics.newMessage = function(message, subscription){
    try{
        
        newmessage = new this();
        newmessage.data = message.data;
        newmessage.title = message.title;
        newmessage.arrival_time = new Date(message.arrival_time);
        newmessage.deliver_time = new Date(message.deliver_time);
        newmessage.ack = message.ack;
        newmessage.subscription = subscription;

        return message;
    }catch(e){
        throw new Error('error creating new message. ' + e.message);
    }
}

MessageSchema.plugin(autoIncrement.plugin, 'Message');
module.exports = mongoose.model('Message', MessageSchema)