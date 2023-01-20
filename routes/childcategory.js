const router = require('express').Router();
const controller = require('../controllers/childcategory');
const { saveFile, patchFile } = require('../utils/upload');

router.get('/', controller.all)
    .post('/', controller.add);

router.route('/:id')
    .get(controller.get)
    .patch([patchFile, controller.patch])
    .delete(controller.drop);

module.exports = router;    