const DB = require('../models/subcategory');
const catDB = require('../models/category');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const all = async (req, res) => {
    let subCats = await DB.find();
    Helper.fMsg(res, "All Sub Categories", subCats);
}

const get = async (req, res, next) => {
    let subCat = await DB.find();
    if(subCat) {
        Helper.fMsg(res, "Single sub category", subCat);
    } else {
        next(new Error(`Invalid ID: ${req.params.id}, You cannot get`));
    }
}

const add = async (req, res, next) => {
    let existSub = await DB.findOne({ name: req.body.name });
    if (existSub) {
        deleteFile(req.body.image);
        next(new Error(`${existSub.name} exists in subcategory`));
    } else {
        let validCat = await catDB.findById(req.body.catid);
        if (validCat) {
            let newSub = await DB(req.body).save();
            await catDB.findByIdAndUpdate(validCat._id, { $push: { subcats: newSub.id } });
            Helper.fMsg(res, "Sub category was added", newSub);
        } else {
            deleteFile(req.body.image);
            next(new Error(`Invalid: ${req.body.catid} does not match category id`));
        }
    }
}

const patch = async (req, res, next) => {
    let editSub = await DB.findById(req.params.id);
    if (editSub) {
        let parentCat = await catDB.findById(editSub.catid);
        if (req.body.image) {
            deleteFile(editSub.image);
        }
        await DB.findByIdAndUpdate(editSub._id, req.body);
        let updateSub = await DB.findById(editSub._id);
        let sameParentCat = editSub.catid == updateSub.catid ? true : false;
        if (!sameParentCat && req.body.catid) {
            await catDB.findByIdAndUpdate(parentCat._id, { $pull: { subcats: editSub.id } });
            let updateParentCat = await catDB.findById(updateSub.catid);
            await catDB.findByIdAndUpdate(updateParentCat._id, { $push: { subcats: updateSub.id } });
        }
        Helper.fMsg(res, "Sub category was updated", updateSub);
    } else {
        if(req.body.image) {
            deleteFile(req.body.image);
        }
        next(new Error(`Invalid ID: ${req.params.id}, You cannot edit`));
    }
}

const drop = async (req, res, next) => {
    let delSub = await DB.findById(req.params.id);
    if (delSub) {
        let subName = delSub.name;
        await catDB.findByIdAndUpdate(delSub.catid, { $pull: { subcats: delSub.id } });
        deleteFile(delSub.image);
        await DB.findByIdAndDelete(delSub._id);
        Helper.fMsg(res, `${subName}: Sub category was deleted and removed from parent category`);
    } else {
        next(new Error(`Invalid ID : ${req.params.id}, You cannot delete`));
    }
}

module.exports = {
    all,
    get,
    add,
    patch,
    drop
}