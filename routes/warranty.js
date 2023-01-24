const router = require('express').Router();
const controller = require('../controllers/warranty');
const { WarrantySchema, AllSchema } = require('../utils/schema');
const { saveFile, patchFile } = require('../utils/upload');
const { validateBody, validateParam } = require('../utils/validator');

router.post('/', [saveFile,validateBody(WarrantySchema.addWarranty), controller.add])
    .get('/', controller.all);

router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .put([validateParam(AllSchema.id, 'id'), patchFile, validateBody(WarrantySchema.editWarranty), controller.put])
    .delete([validateParam(AllSchema.id, 'id'), controller.drop]);

module.exports = router;