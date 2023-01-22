const DB = require('../models/childcategory');
const subDB = require('../models/subcategory');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const all = async (req, res) => {
    let childCats = await DB.find();
    Helper.fMsg(res, "All Child Categories", childCats);
}

const get = async (req, res, next) => {
    let childCat = await DB.findById(req.params.id);
    if (childCat) {
        Helper.fMsg(res, "Single Child Category", childCat);
    } else {
        next(new Error(`Invalid ID : ${req.params.id}, You cannot get`));
    }
}

const add = async (req, res, next) => {
    let existChildCat = await DB.findOne({ name: req.body.name });
    if (existChildCat) {
        deleteFile(req.body.image);
        next(new Error(`${existChildCat.name} is already used in child categories`));
    } else {
        let subCat = await subDB.findById(req.body.subcatid);
        if (subCat) {
            let newChildCat = await new DB(req.body).save();
            await subDB.findByIdAndUpdate(subCat._id, { $push: { childcat: newChildCat._id } });
            Helper.fMsg(res, "Child Category was added", newChildCat, 201);
        } else {
            deleteFile(req.body.image);
            next(new Error(`Invalid ID : ${req.body.subcatid} does not match sub category id`));
        }
    }
}

const patch = async (req, res, next) => {
    let editChildCat = await DB.findById(req.params.id);
    if (editChildCat) {
        if (req.body.subcatid) {
            try {
                await subDB.findById(req.body.subcatid);
            } catch (error) {
                delete req.body.subcatid;
            }
            await DB.findByIdAndUpdate(editChildCat._id, req.body);
            let updateChildCat = await DB.findById(editChildCat._id);
            let sameParentCat = editChildCat.subcatid == updateChildCat.subcatid ? true : false;
            if (!sameParentCat) {
                await subDB.findByIdAndUpdate(editChildCat.subcatid, { $pull: { childcat: editChildCat._id } });
                await subDB.findByIdAndUpdate(updateChildCat.subcatid, { $push: { childcat: updateChildCat._id } });
            }
            Helper.fMsg(res, "Child Category was updated", updateChildCat);
        }
    } else {
        deleteFile(req.body.image);
        next(new Error(`Invalid ID : ${req.params.id}, You cannot edit`));
    }
}

const drop = async (req, res, next) => {
    let delChildCat = await DB.findById(req.params.id);
    if(delChildCat) {
        deleteFile(delChildCat.image);
        await subDB.findByIdAndUpdate(delChildCat.subcatid, {$pull: { childcat: delChildCat._id }});
        let name = delChildCat.name;
        await DB.findByIdAndDelete(delChildCat._id);
        Helper.fMsg(res, `${name} : Child Category was deleted and removed from its sub category`);
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