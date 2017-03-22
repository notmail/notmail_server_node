var mongoose      = require('mongoose');  
var Schema        = mongoose.Schema,
    error         = _require('util/error'),
    security      = _require('util/security');
    //autoIncrement = require('mongoose-auto-increment');

//autoIncrement.initialize(mongoose.connection);

var MessageSchema = new Schema({
    //_id ('Number' )
    sub: {type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},


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

MessageSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            title: ret.title,
            data: ret.data,
            type: ret.type,
            arrival_time: ret.arrival_time,
            alert_time: ret.alert_time,
            sub: ret.sub
        }
    },
    virtuals: true
})

MessageSchema.statics.newMessage = function(message, subscriptionId, userId){
    try{
        newmessage = new this();
        newmessage.data = message.data;
        newmessage.title = message.title;
        if(message.arrival_time) newmessage.arrival_time = new Date(message.arrival_time);
        if(message.deliver_time) newmessage.deliver_time = new Date(message.deliver_time);
        newmessage.ack = message.ack;
        newmessage.sub = subscriptionId;
        newmessage.user = userId;
        newmessage.arrival_time = Date.now();
        //console.log(newmessage._sub)
        return newmessage;
    }catch(e){
        throw new Error('error creating new message. ' + e.message);
    }
}

MessageSchema.statics.getMessages = function(userId, query, sub, data, del){
    let match = { user: userId };
    if(query=='sub')
        match.sub = sub;
    let select = null;
    if(data) {select = { data: 1 }}
    return this.find(match, select)
}

MessageSchema.statics.delMessages = function(messages){
    let ids = [];
    if (messages.constructor === Array) messages.forEach(msg=>ids.push(msg._id))
    else ids.push(messages._id)

    console.log('a')
    console.log(messages.constructor === Array)
    console.log(ids)
    return this.remove({ _id: {$in: ids} })
}



//MessageSchema.plugin(autoIncrement.plugin, 'Message');
module.exports = mongoose.model('Message', MessageSchema)