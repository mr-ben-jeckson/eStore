const DB = require('../models/tag');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const all = async(req, res) => {
    let tags = await DB.find();
    Helper.fMsg(res, "All Tags", tags)
}

const add = async(req, res, next) => {
    let validTag = await DB.findOne({ name: req.body.name });
    if(validTag) {
        deleteFile(req.body.image);
        next(new Error(`${req.body.name} has been used in tag`));
    } else {
        let tag = await new DB(req.body).save();
        Helper.fMsg(res, "Tag was added", tag, 201);
    }
}

const get = async(req, res, next) => {
    let tag = await DB.findById(req.params.id);
    if(tag) {
        Helper.fMsg(res, "Single Tag", tag)
    } else {
        next(new Error(`Invalid ID: ${req.params.id}, You cannot get`));
    }
}

const patch = async(req, res, next) => {
    let editTag = await DB.findById(req.params.id);
    if(editTag) {
        if(req.body.image) {
            deleteFile(editTag.image);
        }
        await DB.findByIdAndUpdate(editTag._id, req.body);
        let updateTag = await DB.findById(editTag._id);
        Helper.fMsg(res, "Tag was updated", updateTag);
    } else {
        next(new Error(`Invalid ID: ${req.params.id}, You cannot edit`));
    }
}

const drop = async(req, res, next) => {
    let delTag = await DB.findById(req.params.id);
    if(delTag) {
        let name = delTag.name;
        deleteFile(delTag.image);
        await DB.findByIdAndDelete(delTag._id);
        Helper.fMsg(res, "Tag was deleted");
    } else {
        next(new Error(`Invalid ID : ${req.params.id}, You cannot delete`));
    }
}

module.exports = {
    all,
    add,
    get,
    patch,
    drop
}