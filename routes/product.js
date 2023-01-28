const router = require('express').Router();
const controller = require('../controllers/product');
const { AllSchema, ProductSchema } = require('../utils/schema');
const { saveFiles, editFiles } = require('../utils/upload');
const { validateBody, validateParam, hasRole, validateToken, validateQuery } = require('../utils/validator');

router.post('/', [validateToken(), hasRole(['Admin']), validateParam(AllSchema.id, 'id'), saveFiles, validateBody(ProductSchema.addProduct), controller.add])
    .get('/collections/:page', [validateParam(AllSchema.page, 'page'), controller.paginate])
    .get('/collections/search/filter/:page', [validateParam(AllSchema.page, 'page'), validateQuery(ProductSchema.searchProduct), controller.search])

router.route('/:id')
    .get([validateParam(AllSchema.id, 'id')], controller.get)
    .put([validateToken(), hasRole(['Admin']), validateParam(AllSchema.id, 'id'), editFiles, validateBody(ProductSchema.editProduct), controller.put])
    .delete([validateParam(AllSchema.id, 'id'), controller.drop]);

router.route('/restore/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.restore])

module.exports = router;    