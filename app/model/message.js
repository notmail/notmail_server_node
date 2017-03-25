var mongoose      = require('mongoose');  
var Schema        = mongoose.Schema,
    error         = _require('util/error'),
    security      = _require('util/security');


var MessageSchema = new Schema({
    //_id                                                                               // not_implemented (reference for delete, ack)
    sub: {type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true},   // *a
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},          // *a
    title: {type: String},                                                              // m
    type: {type: String, default: 'text'},                                              // *ma
    data: {type: String, required: true},                                               // *m
    arrival_time: {type: Date, required: true},                                         // *a
    deliver_time: Date,                                                                 // m not_implemented
    aler_time: Date,                                                                    // m not_implemented
    ack: Boolean                                                                        // m not_implemented
})

MessageSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            title: ret.title,
            data: ret.data,
            type: ret.type || 'text',
            arrival_time: ret.deliver_time || ret.arrival_time,
            alert_time: ret.alert_time,
            sub: ret.sub
        }
    },
    virtuals: true
})

MessageSchema.statics.newMessage = function(message, subscriptionId, userId){
    try{
        newmessage                                       = new this();
        newmessage.data                                  = message.data;
        newmessage.title                                 = message.title;
        newmessage.arrival_time                          = Date.now();
        if(message.deliver_time) newmessage.deliver_time = new Date(message.deliver_time);
        newmessage.ack                                   = message.ack;
        newmessage.sub                                   = subscriptionId;
        newmessage.user                                  = userId;
        newmessage.arrival_time                          = Date.now();
        return newmessage;
    }catch(e){
        throw new Error('error creating new message. ' + e.message);
    }
}

MessageSchema.statics.getMessages = function(userId, query, sub, data, id){
    let match = { user: userId };
    if(query=='sub')
        match.sub = sub;
    if(query=='id')
        match._id = id;
    let select = null;
    if(data) {select = { data: 1 }}
    return this.find(match, select)
}

MessageSchema.statics.delMessages = function(messages){
    let ids = [];
    if (messages.constructor === Array) messages.forEach(msg=>ids.push(msg._id))
    else ids.push(messages._id)
    console.log(ids)
    return this.remove({ _id: {$in: ids} })
}



//MessageSchema.plugin(autoIncrement.plugin, 'Message');
module.exports = mongoose.model('Message', MessageSchema)