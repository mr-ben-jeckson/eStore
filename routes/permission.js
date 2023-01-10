const router = require('express').Router();
const controller = require('../controllers/permission');

router.post('/', controller.add)

module.exports = router;