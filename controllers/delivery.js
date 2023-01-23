const DB = require('../models/delivery');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const all = async (req, res) => {
    let deli = await DB.find();
    Helper.fMsg(res, "All Deliveris", deli)
}

const get = async (req, res, next) => {
    let deli = await DB.findById(req.params.id);
    if (deli) {
        Helper.fMsg(res, "Single Delivery", deli)
    } else {
        next(new Error(`Invalid ID : ${req.params.id}, You cannot get`));
    }
}

const add = async (req, res) => {
    let deli = await DB.findOne({ name: req.body.name });
    if (deli) {

    } else {
        let newDeli = await new DB(req.body).save();
        Helper.fMsg(res, "New Delivery was added", newDeli, 201);
    }
}

const patch = async (req, res, next) => {
    let editDeli = await DB.findById(req.params.id)
    if (editDeli) {
        if (req.files && req.files.file) {
            deleteFile(editDeli.image);
        }
        req.body['updated'] = Date.now();
        await DB.findByIdAndUpdate(editDeli._id, req.body);
        let updateDeli = await DB.findById(editDeli._id);
        Helper.fMsg(res, 'Delivery was updated', updateDeli);
    } else {
        if (req.files && req.files.file) {
            deleteFile(req.body.image);
        }
        next(new Error(`Invalid ID: ${req.params.id}, You cannot edit`));
    }
}

const drop = async (req, res, next) => {
    let delDeli = await DB.findById(req.params.id);
    if (delDeli) {
        let name = delDeli.name;
        deleteFile(delDeli.image);
        Helper.fMsg(res, `${name} : Delivery was deleted`);
    } else {
        if (req.files && req.files.file) {
            deleteFile(req.body.image);
        }
        next(new Error(`Invalid ID : ${req.params.id}, You cannot delete`));
    }
}

module.exports = {
    add,
    all,
    get,
    patch,
    drop
}