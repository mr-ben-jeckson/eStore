const DB = require('../models/product');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const all = async (req, res) => {
    let products = await DB.find().populate('cat subcat childcat');
    Helper.fMsg(res, "All Products", products);
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
            req.body.images.forEach((img) => {
                deleteFile(img);
            });
        } else {
            req.body['images'] = editProduct.images;
        }
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
        if(restoreProduct) {
            Helper.fMsg(res, `${restoreProduct.name} was removed from products`, restoreProduct);
        } else {
            next(new Error(`Invalid ID : ${req.params.id}, You cannot restore`))
        }
    } else {
        next(new Error(`Non-Deleted ID : ${req.params.id} , You cannot restore`));
    }
}

module.exports = {
    all,
    add,
    get,
    put,
    drop,
    restore
}