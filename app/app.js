global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
}
global._require = function(file) {
    return require(abs_path('/' + file));
}

/**
 * Imports
 */
var express    = require('express'),
    path       = require('path'),
    logger     = require('morgan'),
    bodyParser = require('body-parser'),
    config     = require('../config.json'),
    database   = require('./model/database');


/**
 * Server
 */

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(config.endpoint || '/notmail_api', require('./routes/index'));
if (config.json_prettify) app.set('json spaces', 20);


/**
 * Errors
 */

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (config.dev) {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('error: ' + err.message);
    });
}
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
