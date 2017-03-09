/**
 * Imports
 */
// Config environment
var config = require('../config.json');
if(config.dev){
  process.env['NODE_ENV'] = 'development';
  if(!process.env['DEBUG'])
    process.env['DEBUG'] = 'notmail_server_node:*';
}else{
  process.env['NODE_ENV'] = 'production';
}

// Server imports
var app = require('../app/app'),
    http = require('http'),
    debug = require('debug')('notmail_server_node:server');


/**
 * Configure
 */

var port = normalizePort(config.port || '6060');
app.set('port', port);


/**
 * Initiate
 */

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Functions
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
