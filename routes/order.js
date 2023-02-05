const router = require('express').Router();
const controller = require('../controllers/order');
const { OrderSchema } = require('../utils/schema');
const { validateToken, validateBody } = require('../utils/validator');

router.post('/',[validateToken(), validateBody(OrderSchema.addOrder), controller.add]);

module.exports = router;