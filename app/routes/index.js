var express = require('express'),
    router = express.Router();

/* Routes */
router.use('/app', require('./app/index'))
router.use('/user', require('./user/index'))

/* Logic  */
router.get('/', function(req, res, next) {
  res.status(200).json({route: 'ok'})
});

/* Module settings */
module.exports = router;
