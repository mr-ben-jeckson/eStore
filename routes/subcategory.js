const router = require('express').Router();
const controller = require('../controllers/subcategory');
const { CatSchema } = require('../utils/schema');
const { saveFile } = require('../utils/upload');
const { validateBody } = require('../utils/validator');

/* Sub Category Routes */
router.post('/', [saveFile, validateBody(CatSchema.addSub), controller.add])
    .get('/', controller.all);

module.exports = router;