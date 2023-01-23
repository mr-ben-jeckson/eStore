const router = require('express').Router();
const controller = require('../controllers/test');

router.post('/', controller.test);

module.exports = router;