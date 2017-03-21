var express = require('express'),
    router = express.Router(),
    authentication    = _require('/middleware/authentication'),
    destination    = _require('/middleware/destination');

/* Routes */
router.use('/registry', require('./registry'))

router.use(authentication.applicationAuthenticate)                                  // Application credentials
router.use(destination)                                  // Destination middleware

router.use('/sub', require('./sub'))
router.use('/msg', require('./msg'))

/* Logic  */
router.get('/', function(req, res, next) {
  res.status(200).send('/app');
});

/* Module settings */
module.exports = router;
