const DB = require('../models/subcategory');
const catDB = require('../models/category');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const all = async (req, res) => {
    let subCats = await DB.find();
    Helper.fMsg(res, "All Sub Categories", subCats);
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

module.exports = {
    all,
    add
}