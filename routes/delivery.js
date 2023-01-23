const router = require('express').Router();
const controller = require('../controllers/delivery');
const { DeliSchema, AllSchema } = require('../utils/schema');
const { saveFile, patchFile } = require('../utils/upload');
const { validateBody, validateParam } = require('../utils/validator');

router.post('/', [saveFile, validateBody(DeliSchema.addDeli), controller.add])
    .get('/', controller.all);

router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .patch([validateParam(AllSchema.id, 'id'), patchFile, controller.patch])
    .delete([validateParam(AllSchema.id, 'id'), controller.drop]);

module.exports = router;