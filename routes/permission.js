const router = require('express').Router();
const controller = require('../controllers/permission');
const { PermitSchema, AllSchema } = require('../utils/schema');
const { validateBody, validateParam, validateToken } = require('../utils/validator');

/* Permission Routes */

router.get('/', controller.all);
router.post('/', [validateToken(), validateBody(PermitSchema.add), controller.add]);

/* Single Permission with Id routes */
router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .patch([validateParam(AllSchema.id, 'id'), controller.patch])
    .delete([validateParam(AllSchema.id, 'id'), controller.drop]);

module.exports = router;