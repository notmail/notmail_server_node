var WebSocket = require('ws');

var wss;

var regex = {
    token: /token=(.+)/
}

function authenticate(ws, token){
    
    if(!token)
        throw Error('token missing');
    let netToken = token.split('_');
    if(netToken.length != 2)
        throw Error('bad token');

    return SessionSchema.findSession(netToken[0], netToken[1])                         

}


function init(){
    console.log('starting ws')
    wss.on('connection', function connection(ws) {
        // Init connection
        ws.session      = {};
        ws.notmail      = "";
        ws.connected    = false;

        ws.on('message', function incoming(message) {
            var match;
            // Authentication
            if ( match = message.match(regex.token) ){
                authenticate(ws, match[1])
                .then( session => {
                    console.log('correct ws auth')
                    ws.session = session;
                    ws.notmail = session.notmail;
                })
                .catch(err => {
                    console.log('error in ws auth')
                    ws.close(1, "Wrong token")
                })
            }
        });

    });
}


module.exports = {
    connect: function(websocket){ 
        wss = websocket;
        init();
     },
     wss: function(){ return wss }
}