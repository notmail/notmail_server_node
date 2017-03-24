/* Imports */
var mongoose        = require('mongoose'),
    Promise         = require('bluebird'),
    config          = _require('/../config');

/* Setup */
mongoose.Promise = Promise;
mongoose.connect(config.db_url);

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