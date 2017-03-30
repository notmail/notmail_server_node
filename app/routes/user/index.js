var express        = require('express'),
    router         = express.Router(),
    authentication = _require('/middleware/authentication');

/* Routes */
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use('/auth', require('./auth'))          // Auth (get token)
router.use(authentication.tokenAuthenticate)    // TokenAuthentication Middleware
router.use('/sub', require('./sub'))            // Subscriptions
router.use('/msg', require('./msg'))            // Messages

/* Logic  */
router.get('/', function(req, res, next) {
  res.status(200).send('/user');
});

/* Module settings */
module.exports = router;
