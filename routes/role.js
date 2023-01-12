const router = require('express').Router();
const controller = require('../controllers/role');
const { RoleSchema, AllSchema } = require('../utils/schema');
const { validateBody, validateParam } = require('../utils/validator');

//Role Routes
router.post('/',[ validateBody(RoleSchema.add), controller.add]);
router.get('/', controller.all);
//Role Single with Id routes
router.route('/:id')
    .get([validateParam(AllSchema.id, 'id') ,controller.get]);
module.exports = router;