const DB = require('../models/product');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const products = async (req, res) => {
    let page = req.query.page || Number(process.env.DEFAULT_PAGE),
        limit = req.query.limit || Number(process.env.PAGE_LIMIT),
        showPage = page == 1 ? 0 : page - 1,
        skipProducts = limit * showPage,
        searchObj = {};

    // Search Filter     
    if (req.query.keywords) {
        const queryKeywords = new RegExp(req.query.keywords, 'i');
        searchObj['$or'] = [
            { name: { $regex: queryKeywords } },
            { title: { $regex: queryKeywords } },
            { brand: { $regex: queryKeywords } },
            { content: { $regex: queryKeywords } },
            { detail: { $regex: queryKeywords } }
        ]
    }
    if (Number(req.query.min) && Number(req.query.max) && req.query.max > req.query.min)
        searchObj['price'] = { $gte: `${req.query.min}`, $lte: `${req.query.max}` };
    if (req.query.cat) searchObj['cat'] = req.query.cat;
    if (req.query.subcat) searchObj['subcat'] = req.query.subcat;
    if (req.query.childcat) searchObj['childcat'] = req.query.childcat;
    if (req.query.tag) searchObj['tag'] = req.query.tag;
    if (req.query.color) searchObj['colors'] = { $in: [req.query.color] };
    if (req.query.rating) searchObj['rating'] = req.query.rating;

    // Month and Year Option Query
    // if (req.query.year) searchObj['$expr'] = { '$eq': [{ '$year': '$created' }, req.query.year] };
    // if (req.query.month) searchObj['$expr'] = { '$eq': [{ '$month': '$created' }, req.query.month] };

    // Date Range Filter
    if (req.query.startDate && req.query.endDate) searchObj['created'] = {
        $gte: new Date(new Date(req.query.startDate).setUTCHours(24, 0, 0, 0)).toISOString(),
        $lte: new Date(new Date(req.query.endDate).setUTCHours(47, 59, 59, 999)).toISOString()
    };
    // Sorting
    let sortBy = "-created";
    if (req.query.sorts) sortBy = req.query.sorts.split(",").join(" ");
    let products = await DB.find(searchObj).skip(skipProducts).sort(sortBy).limit(limit);
    Helper.fMsg(res, `Paginated Products, Page = ${page}`, products);
}

const get = async (req, res, next) => {
    let product = await DB.findById(req.params.id);
    if (product) {
        Helper.fMsg(res, "Single Products", product);
    } else {
        next(new Error(`Invalid ID : ${req.params.id}, You cannot get`));
    }
}

const add = async (req, res, next) => {
    let validProduct = await DB.findOne({ name: req.body.name });
    if (validProduct) {
        req.body.images.forEach((img) => {
            deleteFile(img);
        });
        next(new Error(`${req.body.name} has been used in products`));
    } else {
        req.body['user_id'] = req.user._id;
        let product = await new DB(req.body).save();
        Helper.fMsg(res, "Product was added", product, 201);
    }
}

const put = async (req, res, next) => {
    let editProduct = await DB.findById(req.params.id);
    if (editProduct) {
        if (req.body.images) {
            editProduct.images.forEach((img) => {
                deleteFile(img);
            });
        } else {
            req.body.images = editProduct.images;
        }
        req.body.updated = Date.now();
        await DB.findByIdAndUpdate(editProduct._id, req.body);
        let updateProduct = await DB.findById(editProduct._id);
        Helper.fMsg(res, "Product was updated", updateProduct)
    } else {
        if (req.body.images) {
            req.body.images.forEach((img) => {
                deleteFile(img);
            });
        }
        next(new Error(`Invalid ID : ${req.params.id}, You cannot edit`));
    }
}

const drop = async (req, res, next) => {
    let delProduct = await DB.findById(req.params.id);
    if (delProduct) {
        await DB.findByIdAndUpdate(delProduct._id, {
            isDeleted: true
        });
        Helper.fMsg(res, `${delProduct.name} was removed from products`);
    } else {
        next(new Error(`Invalid ID : ${req.params.id}, You cannot delete`))
    }
}

const restore = async (req, res, next) => {
    let existProduct = await DB.findById(req.params.id);
    if (!existProduct) {
        try {
            await DB.updateOne(
                { _id: req.params.id },
                { isDeleted: false }
            );

        } catch (e) {
            throw e;
        }
        let restoreProduct = await DB.findById(req.params.id);
        if (restoreProduct) {
            Helper.fMsg(res, `${restoreProduct.name} was removed from products`, restoreProduct);
        } else {
            next(new Error(`Invalid ID : ${req.params.id}, You cannot restore`))
        }
    } else {
        next(new Error(`Non-Deleted ID : ${req.params.id} , You cannot restore`));
    }
}

module.exports = {
    products,
    add,
    get,
    put,
    drop,
    restore
}