const router = require('express').Router();
const controller = require('../controllers/childcategory');
const { saveFile, patchFile } = require('../utils/upload');
const { validateBody, validateParam } = require('../utils/validator');
const { CatSchema, AllSchema } = require('../utils/schema');

router.get('/', controller.all)
    .post('/', [saveFile, validateBody(CatSchema.addChild), controller.add]);

router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .patch([patchFile, controller.patch])
    .delete([validateParam(AllSchema.id, 'id'), controller.drop]);

module.exports = router;    