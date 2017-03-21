/* Imports */
var mongoose = require('mongoose'),
    Promise = require('bluebird');
    //autoIncrement = require('mongoose-auto-increment');

/* Setup */
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/notmail');

/* Schemas */
require('./application');
require('./session');
require('./subscription');
require('./user');
require('./message');

/* Connection */
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('mongodb connected');
});