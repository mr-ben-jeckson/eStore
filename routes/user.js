const router = require('express').Router();
const controller = require('../controllers/user');
const { UserSchema } = require('../utils/schema');
const { validateBody } = require('../utils/validator');

// Registration Route
router.post('/register', [validateBody(UserSchema.register), controller.register]);
// Login Route
router.post('/login', [validateBody(UserSchema.login), controller.login]);

module.exports = router;