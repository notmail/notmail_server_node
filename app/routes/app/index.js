var express        = require('express'),
    router         = express.Router(),
    authentication = _require('/middleware/authentication'),
    destination    = _require('/middleware/destination');

/* Routes */
router.use('/registry', require('./registry'))           // Application registry
router.use(authentication.applicationAuthenticate)       // Application credentials middleware
router.use(destination)                                  // Destination middleware
router.use('/sub', require('./sub'))                     // Subscriptions
router.use('/msg', require('./msg'))                     // Messages

/* Logic  */
router.get('/', function(req, res, next) {
  res.status(200).send('/app');
});

/* Module settings */
module.exports = router;
