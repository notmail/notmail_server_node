var WebSocket = require('ws');
var websockets = _require('ws/ws');

function notifyUserMessage(userId){
    websockets.wss().clients.forEach(con => {
        if (con.readyState == WebSocket.OPEN && String(con.session.user._id) == String(userId)) {
            con.send('m');
        }
    })
}
function notifyUserSub(userId){
    websockets.wss().clients.forEach(con => {
        if (con.readyState == WebSocket.OPEN && String(con.session.user._id) == String(userId)) {
            con.send('s');
        }
    })
}

module.exports = {
    notifyUserMessage: notifyUserMessage,
    notifyUserSub: notifyUserSub
}