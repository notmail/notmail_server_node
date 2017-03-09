/* Imports */
var mongoose = require('mongoose'),
    Promise = require('bluebird');

/* Setup */
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/notmail');

/* Schemas */
require('./application');

/* Connection */
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('mongodb connected');
});