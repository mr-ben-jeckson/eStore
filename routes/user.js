const router = require('express').Router();
const controller = require('../controllers/user');
const { UserSchema } = require('../utils/schema');
const { validateBody, validateToken, validateRole } = require('../utils/validator');

/* Registration Route */
router.post('/register', [validateBody(UserSchema.register), controller.register]);
/* Login Route */
router.post('/login', [validateBody(UserSchema.login), controller.login]);
/* Add or Remove Roles of User */
router.post('/add-role', [validateToken(), validateRole('Super Admin'), validateBody(UserSchema.addRole), controller.addRole]);
router.post('/remove-role', [validateToken(), validateRole('Super Admin'), validateBody(UserSchema.addRole), controller.removeRole]);
/* Add or Remove Permissions of User */
router.post('/add-permission', [validateToken(), validateRole('Super Admin'), validateBody(UserSchema.addPermission), controller.addPermission]);
router.post('/remove-permission', [validateToken(), validateRole('Super Admin'), validateBody(UserSchema.addPermission), controller.removePermission]);
module.exports = router;