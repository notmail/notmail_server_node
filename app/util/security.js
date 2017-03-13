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
    try{
        var cipher = crypto.createCipher(algorithm, pwd)
        var crypted = cipher.update(String(text),'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }catch (e){
        throw new error.SecurityError('Failed to encrypt. ' + e.message)
    }
}
 
function decrypt(text, pwd){
    try{
        var decipher = crypto.createDecipher(algorithm, pwd)
        var dec = decipher.update(String(text),'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }catch (e){
        throw new error.SecurityError('Failed to decrypt. ' + e.message)
    }
}


/*
    ## Random Values ##
    - For shared_key and root_secret
    - For validation
*/
function genRandomKey(){
    try{
        return crypto.randomBytes(32).toString('hex')
    } catch(e){
        throw new error.SecurityError('Failed to create randomkey. ' + e.message)
    }
}

function genRandomValidation(){
    try{
        return crypto.randomBytes(4).toString('hex')
    } catch(e){
        throw new error.SecurityError('Failed to create randomkey validation. ' + e.message)
    }
}


/*
    ## Hasing password ## 
    - For user password storage and check
*/
function hashPassword(pwd){
    try{
        if(pwd.length < 8) throw new Error('Password too short')
        return bcrypt.hashSync(pwd, 10);
    }catch (e){
        throw new error.AuthenticationFailure('Failed to create password hash.' + e.message)
    }
}

function testPassword(pwd, hashed){
    try{
        if(!bcrypt.compareSync(pws, hashed)) throw new Error('Wrong Password')
    }catch (e){
        throw new error.AuthenticationFailure('Failed to test password. ' + e.message)
    }
}


module.exports = {
    genRandomKey: genRandomKey,
    hashPassword: hashPassword,
    testPassword: testPassword,
    encrypt: encrypt,
    decrypt: decrypt,
    genRandomValidation: genRandomValidation
}