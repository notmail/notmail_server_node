var express = require('express'),
    router = express.Router();

/* Routes */
router.use('/registry', require('./registry'))
router.use('/sub', require('./sub'))
router.use('/msg', require('./msg'))

/* Logic  */
router.get('/', function(req, res, next) {
  res.status(200).send('/app');
});

/* Module settings */
module.exports = router;
