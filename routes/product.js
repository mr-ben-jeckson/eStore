const router = require('express').Router();
const controller = require('../controllers/product');
const { AllSchema } = require('../utils/schema');
const { validateBody, validateParam } = require('../utils/validator');

router.post('/', [controller.add])
    .get('/', controller.get)

router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), va])