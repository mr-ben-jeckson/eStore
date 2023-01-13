const router = require('express').Router();
const controller = require('../controllers/role');
const { RoleSchema, AllSchema } = require('../utils/schema');
const { validateBody, validateParam } = require('../utils/validator');

/* Role Routes */
router.post('/', [validateBody(RoleSchema.add), controller.add]);
router.get('/', controller.all);

/* Adding Permission to Role */
router.post('/add-permission', [validateBody(RoleSchema.addPermit), controller.addRolePermit]);
router.post('/remove-permission', [validateBody(RoleSchema.addPermit), controller.removeRolePermit]);

/* Role Single with Id routes */
router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .patch([validateParam(AllSchema.id, 'id'), validateBody(RoleSchema.add), controller.patch])
    .delete([validateParam(AllSchema.id, 'id'), controller.drop])
module.exports = router;