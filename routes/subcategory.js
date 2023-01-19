const router = require('express').Router();
const controller = require('../controllers/subcategory');
const { CatSchema } = require('../utils/schema');
const { saveFile, patchFile } = require('../utils/upload');
const { validateBody } = require('../utils/validator');

/* Sub Category Routes */
router.post('/', [saveFile, validateBody(CatSchema.addSub), controller.add])
    .get('/', controller.all);
/* Sub Category Single routes with Id */
router.route('/:id')
    .patch([ patchFile, controller.patch])
    .delete(controller.drop)    

module.exports = router;