const DB = require('../models/category');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

/* Retriving All categories */
const all = async (req, res) => {
    let cats = await DB.find();
    Helper.fMsg(res, "All Categories", cats);
}

/* Adding new category */
const add = async (req, res, next) => {
    let checkCat = await DB.findOne({ name: req.body.name });
    if (checkCat) {
        deleteFile(req.body.image);
        next(new Error(`${checkCat.name} has already been in the categories`));
    } else {
        let cat = await new DB(req.body).save();
        Helper.fMsg(res, "New Category Added", cat);
    }
}

/* Retriving Single category */
const get = async (req, res, next) => {
    let validCat = await DB.findById(req.params.id);
    if (validCat) {
        Helper.fMsg(res, "Single Category", validCat);
    } else {
        next(new Error("Category ID must be valided"));
    }
}

/* Patching category */
const patch = async (req, res, next) => {
    let validCat = await DB.findById(req.params.id);
    if (validCat) {
        if (req.body.image) {
            deleteFile(validCat.image);
            await DB.findByIdAndUpdate(validCat._id, req.body);
            let cat = await DB.findById(validCat._id);
            Helper.fMsg(res, "Category Updated", cat);
        } else {
            await DB.findByIdAndUpdate(validCat._id, req.body);
            let cat = await DB.findById(validCat._id);
            Helper.fMsg(res, "Category Updated", cat);
        }
    } else {
        deleteFile(req.body.image)
        next(new Error("Category ID must be valided to delete"));
    }
}

/* Deleting category */
const drop = async (req, res, next) => {
    let validCat = await DB.findById(req.params.id);
    if (validCat) {
        deleteFile(validCat.image);
        let name = validCat.name;
        await DB.findByIdAndDelete(validCat._id);
        Helper.fMsg(res, `${name} was removed from categories`);
    } else {
        next(new Error("Category ID must be valided to delete"));
    }
}


module.exports = {
    add,
    all,
    get,
    patch,
    drop
}