const DB = require('../models/category');
const subDB = require('../models/subcategory');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const all = async(req, res) => {
    let cats = await DB.find();
    Helper.fMsg(res, "All Categories", cats);
}

const get = async(req, res, next) => {
    let cat = await DB.findById(req.params.id);
    if(cat) {
        Helper.fMsg(res, "Single Category", cat);
    } else {
        next(new Error(`Invalid ID: ${req.params.id}, You cannot get`));
    }
}

const add = async(req, res, next) => {
    let validCat = await DB.findOne({name: req.body.name});
    if(validCat) {
        deleteFile(req.body.image);
        next(new Error(`${validCat.name} already used in the categories`));
    } else {
        let addCat = await new DB(req.body).save();
        Helper.fMsg(res, "New Cateogry was added", addCat, 201);
    }
}

const patch = async(req, res, next) => {
    let editCat = await DB.findById(req.params.id)
    if(editCat) {
        await DB.findByIdAndUpdate(editCat._id, req.body);
    } else {
        if(req.body.image) {
            deleteFile(req.body.image);
        }
        next(new Error(`Invalid ID: ${req.params.id}, You cannot edit`));
    }
}

const drop = async(req, res, next) => {
    let delCat = await DB.findById(req.params.id);
    if(delCat) {
        let name = delCat.name;
        delCat.subcats.forEach( async(sub) => {
            let delSub = await subDB.findById(sub);
            deleteFile(delSub.image);
            await subDB.findByIdAndDelete(delSub._id);
        });
        deleteFile(delCat.image);
        await DB.findByIdAndDelete(delCat._id);
        Helper.fMsg(res, `${name} : Category was deleted and all the subcategories also was removed`)
    } else {       
        next(new Error(`Invalid ID: ${req.params.id}, You cannot delete`));
    }
}

module.exports = {
    all,
    get,
    add,
    patch,
    drop
}