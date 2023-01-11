const router = require('express').Router();
const controller = require('../controllers/permission');
const { PermitSchema, AllSchema } = require('../utils/schema');
const { validateBody, validateParam } = require('../utils/validator');

//Permission Routes

router.get('/', controller.all);
router.post('/', [validateBody(PermitSchema.add), controller.add]);

//Single Permission with Id routes
router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get]);

module.exports = router;