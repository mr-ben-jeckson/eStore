const DB = require('../models/product');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const all = async(req, res) => {
    let products = await DB.find();
    Helper.fMsg(res, "All Products", products);    
}

const get = async(req, res, next) => {
    let product = await DB.findById(req.params.id);
    if(product) {
        Helper.fMsg(res, "Single Products", product);
    } else {
        next(new Error(`Invalid ID : ${req.params.id}, You cannot get`));
    }
}

const add = async(req, res, next) => {
    let validProduct = await DB.findOne({ name: req.body.name });
    if(validProduct) {
        req.body.images.forEach((img) => {
            deleteFile(img);
        });
        next(new Error(`${req.body.name} has been used in products`));
    } else {
        let product = await new DB(req.body).save();
        Helper.fMsg(res, "Product was added", product, 201);
    }
}

const put = async(req, res, next) => {
    let editProduct = await DB.findById(req.params.id);
    if(editProduct) {
        if(req.body.images) {
            req.body.images.forEach((img) => {
                deleteFile(img);
            });
        } else {
            req.body['images'] = editProduct.images;
        }
        await DB.findByIdAndUpdate(editProduct._id,  req.body);
        let updateProduct = await DB.findById(editProduct._id);
        Helper.fMsg(res, "Product was updated", updateProduct)
    } else {
        if(req.body.images) {
            req.body.images.forEach((img) => {
                deleteFile(img);
            });
        }
        next(new Error(`Invalid ID : ${req.params.id}, You cannot edit`));
    }
}

const drop = async(req, res, next) => {
    let delProduct = await DB.findById(req.params.id);
    if(delProduct) {
        let name = delProduct.name;    
        delProduct.images.forEach((img) => {
            deleteFile(img);
        });
        await DB.findByIdAndDelete(delProduct._id);
        Helper.fMsg(res, `${name} was deleted from products`);
    } else {
        next(new Error(`Invalid ID : ${req.params.id}, You cannot delete`))
    }
}

module.exports = {
    all,
    add,
    get,
    put,
    drop
}