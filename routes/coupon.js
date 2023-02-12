const router = require('express').Router();
const controller = require('../controllers/coupon');
const { CouponScheam, AllSchema } = require('../utils/schema');
const { validateToken, hasRole, validateBody, validateQuery, validateParam } = require('../utils/validator');

router.post('/', [validateToken(), hasRole(['Admin']), validateBody(CouponScheam.addCoupon), controller.add])
    .get('/', [validateToken(), hasRole(['Admin']), validateQuery(CouponScheam.searchCoupon), controller.getCoupon])
    .post('/user-activate', [validateToken(), validateBody(CouponScheam.activateCoupon), controller.postPublic]);

router.route('/:id')
    .get([validateToken(), validateParam(AllSchema.id, 'id'), controller.get])
    .put([validateToken(), hasRole(['Admin']), validateParam(AllSchema.id, 'id'), validateBody(CouponScheam.addCoupon), controller.put])
    .delete([validateToken(), hasRole(['Admin']), validateParam(AllSchema.id, 'id'), controller.softDrop]);

module.exports = router;