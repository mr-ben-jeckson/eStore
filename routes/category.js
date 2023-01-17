const router = require('express').Router();
const controller = require('../controllers/category');
const { AllSchema } = require('../utils/schema');
const { saveFile, patchFile } = require('../utils/upload');
const { validateParam } = require('../utils/validator');

/* Adding and Retriving Category Routes*/
router.post('/', [saveFile, controller.add])
    .get('/', controller.all);

/* Retriving single category & Patching & Deleting Routes  */
router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .patch([validateParam(AllSchema.id, 'id'), patchFile, controller.patch])
    .delete([validateParam(AllSchema.id, 'id'), controller.drop]);
module.exports = router;