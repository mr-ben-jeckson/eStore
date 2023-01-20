const e = require('express');
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
    let newChildCat = '93caaa7c178cdd0293a6c539';
    try {
        let subCat = await subDB.findById(req.body.subcatid);
        await DB.findByIdAndUpdate(subCat._id, {$push: {childcat: newChildCat}});
    } catch (err) {
        // console.log(err);
        next(new Error(`Invalid ID : ${req.body.subcatid}, You cannot add`));
        return;
    }
    Helper.fMsg(res, "New Child Category added", req.body)
    
    
}

const patch = async (req, res, next) => {

}

const drop = async (req, res, next) => {

}

module.exports = {
    all,
    get,
    add,
    patch,
    drop
}