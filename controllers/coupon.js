const DB = require('../models/coupon');
const Helper = require('../utils/helper');

const add = async (req, res, next) => {
    let codeExist = await DB.findOne({ code: req.body.code });
    if (codeExist) {
        next(new Error("Promo Code has been used"));
    } else {
        let coupon = await new DB(req.body).save();
        Helper.fMsg(res, "Coupon was added", coupon);
    }
}

const getCoupon = async (req, res, next) => {
    let page = req.query.page || Number(process.env.DEFAULT_PAGE),
        limit = req.query.limit || Number(process.env.PAGE_LIMIT),
        showPage = page == 1 ? 0 : page - 1,
        skipCoupons = limit * showPage,
        searchObj = {};
    // Filter
    if (req.query.keywords) {
        const queryKeywords = new RegExp(req.query.keywords, 'i');
        searchObj['$or'] = [
            { name: { $regex: queryKeywords } },
            { code: { $regex: queryKeywords } },
            { about: { $regex: queryKeywords } }
        ];
    }
    if (req.query.expired) {
        if (req.query.expired == 0) searchObj['expired'] = { $gte: Date.now() };
        else searchObj['expired'] = { $lte: Date.now() };
    }
    if (req.query.type) searchObj['type'] = req.query.type;
    if (req.query.status) searchObj['status'] = req.query.status;
    // Date Range Filter
    if (req.query.startDate && req.query.endDate) searchObj['created'] = {
        $gte: new Date(new Date(req.query.startDate).setUTCHours(24, 0, 0, 0)).toISOString(),
        $lte: new Date(new Date(req.query.endDate).setUTCHours(47, 59, 59, 999)).toISOString()
    };
    // Sorting
    let sortBy = "-created";
    if (req.query.sorts) sortBy = req.query.sorts.split(",").join(" ");
    let coupons = await DB.find(searchObj).skip(skipCoupons).sort(sortBy).limit(limit);
    Helper.fMsg(res, `Paginated Coupons, Page = ${page}`, coupons);
}

const postPublic = async (req, res, next) => {
    let coupon = await DB.findOne({
        $and: [
            { code: req.body.code },
            { allow: { $gt: 0 } },
            { status: true },
            { expried: { $lt: Date.now() } }
        ]
    });
    if (coupon) Helper.fMsg(res, "Your Available Coupon", coupon);
    else next(new Error("Invalid Coupon or Expired Coupon"));
}

const get = async (req, res, next) => {
    let coupon = await DB.findById(req.params.id);
    if (coupon) Helper.fMsg(res, "Single Coupon", coupon);
    else next(new Error(`Invalid ID: ${req.params.id}, You cannot get`));
}

const put = async (req, res, next) => {
    let coupon = await DB.findById(req.params.id);
    if (coupon) {
        req.body.updated = Date.now();
        await DB.findByIdAndUpdate(coupon._id, req.body);
        let newCoupon = await DB.findById(coupon._id);
        Helper.fMsg(res, "coupon has been updated", newCoupon);
    } else {
        next(new Error(`Invalid ID: ${req.params.id}, You cannot edit`));
    }
}

const softDrop = async (req, res, next) => {
    let delCoupon = await DB.findById(req.params.id);
    if (delCoupon) {
        await delCoupon.softDelete();
        Helper.fMsg(res, "coupon was deleted");
    } else {
        next(new Error(`Invalid or Dropped ID : ${req.params.id}, You cannot delete`));
    }
}

module.exports = {
    add,
    get,
    getCoupon,
    postPublic,
    put,
    softDrop
}