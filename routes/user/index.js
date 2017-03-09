var express = require('express'),
    router = express.Router();

/* Routes */
router.use('/auth', require('./auth'))
router.use('/sub', require('./sub'))
router.use('/msg', require('./msg'))

/* Logic  */
router.get('/', function(req, res, next) {
  res.status(200).send('/user');
});

/* Module settings */
module.exports = router;
