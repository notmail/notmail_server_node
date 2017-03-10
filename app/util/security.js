var crypto = require('crypto');

function genSharedKey(){
    return crypto.randomBytes(24).toString('hex')
}

module.exports = {
    genSharedKey: genSharedKey
}