var crypto = require('crypto'),
    bcrypt = require('bcryptjs'),
    error = require('./error');

var algorithm = 'aes-256-ctr';


/*
    ## Cypher data ##
    - to use in APPLIATION API:     _id (application.js) <-> unique_id
    - to use in USER API:           _id (user.js) + '___' + _id (session.js) <-> token
*/
function encrypt(text, pwd){
    console.log(text)
    try{
        var cipher = crypto.createCipher(algorithm, pwd)
        var crypted = cipher.update(String(text),'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }catch (e){
        console.log(e)
        throw new error.SecurityError('Failed to encrypt')
    }
}
 
function decrypt(text, pwd){
    try{
        var decipher = crypto.createDecipher(algorithm, pwd)
        var dec = decipher.update(String(text),'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }catch (e){
        throw new error.SecurityError('Failed to deecrypt')
    }
}


/*
    ## Random Values ##
    - For shared_key and root_secret
*/
function genRandomKey(){
    return crypto.randomBytes(32).toString('hex')
}


/*
    ## Hasing password ## 
    - For user password storage and check
*/
function hashPassword(pwd){
    return new Promise(function (resolve, reject) {
        try{
            if(pwd.length < 8) reject(new error.AuthenticationFailure('Password too short'))
            let _ = bcrypt.hashSync(pwd, 10);
            resolve(_)
        }catch (e){
            reject(new error.AuthenticationFailure('Failed to create password hash'))
        }
    })
}

function testPassword(pwd, hashed){
    return new Promise(function (resolve, reject) {
        try{
            let _ = bcrypt.compareSync(pws, hashed)
            if(_)   resolve(p)
            else    reject(new error.AuthenticationFailure('Wrong Password'))
        }catch (e){
            reject(new error.AuthenticationFailure('Failed to check password hash'))
        }
    })
}


module.exports = {
    genRandomKey: genRandomKey,
    hashPassword: hashPassword,
    testPassword: testPassword,
    encrypt: encrypt,
    decrypt: decrypt
}