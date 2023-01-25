const router = require('express').Router();
const controller = require('../controllers/category');
const { AllSchema, CatSchema } = require('../utils/schema');
const { saveFile, patchFile } = require('../utils/upload');
const { validateParam, validateBody, validateToken, hasRole } = require('../utils/validator');

/* Adding and Retriving Category Routes*/
router.post('/', [validateToken(), hasRole(['Admin']), saveFile, validateBody(CatSchema.add), controller.add])
    .get('/', controller.all);

/* Retriving single category & Patching & Deleting Routes  */
router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .patch([validateToken(), hasRole(['Admin']), validateParam(AllSchema.id, 'id'), patchFile, controller.patch])
    .delete([validateToken(), hasRole(['Admin']), validateParam(AllSchema.id, 'id'), controller.drop]);
module.exports = router;