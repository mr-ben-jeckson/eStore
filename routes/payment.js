const router = require('express').Router();
const controller = require('../controllers/payment');
const { AllSchema, PaySchema } = require('../utils/schema');
const { validateBody, validateParam, validateToken, hasRole } = require('../utils/validator');

router.get('/', [validateToken(), controller.getPayment]);
router.post('/', [validateToken(), hasRole(['Admin']), validateBody(PaySchema.addPay), controller.add]);

router.route('/:id')
    .get([validateToken(), hasRole(['Admin']), validateParam(AllSchema.id, 'id'), controller.get])
    .put([validateToken(), hasRole(['Admin']), validateParam(AllSchema.id, 'id'), validateBody(PaySchema.addPay), controller.put])
    .delete([validateToken(), hasRole(['Admin']), validateParam(AllSchema.id, 'id'), controller.softDrop])

module.exports = router;