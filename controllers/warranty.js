const DB = require('../models/warranty');
const Helper = require('../utils/helper');
const { deleteFile } = require('../utils/upload');

const all = async(req, res) => {
    let warranties = await DB.find();
    Helper.fMsg(res, "All Warranties", warranties);
}

const get = async(req, res, next) => {
    let warranty = await DB.findById(req.params.id);
    if(warranty) {
        Helper.fMsg(res, "Single Warranty", warranty)
    } else {
        next(new Error(`Invalid ID : ${req.params.id}, You cannot get`));
    }
}

const add = async(req, res, next) => {
    let warranty = await DB.findOne({ name: req.body.name });
    if(warranty) {
        if(req.body.image) {
            deleteFile(req.body.image);
        }
        next(new Error(`${warranty.name} has been used in warranties`));
    } else {
        let newWarranty = await new DB(req.body).save();
        Helper.fMsg(res, "New warranty was added", newWarranty, 201);
    }
}

const put = async(req, res, next) => {
    let editWarranty = await DB.findById(req.params.id);
    if(editWarranty) {
        if(req.body.image) {
            deleteFile(editWarranty.image);
        } else {
            req.body['image'] = editWarranty.image;
        }
        if(!req.body.remark) {
            req.body['remark'] = editWarranty.remark;
        } 
        req.body['updated'] = Date.now();
        await DB.findByIdAndUpdate(editWarranty._id, req.body);
        let updateWarranty = await DB.findById(editWarranty._id);
        Helper.fMsg(res, "Warranty was updated", updateWarranty)
    } else {
        if(req.body.image){
            deleteFile(req.body.image);
        }
        next(new Error(`Invalid ID: ${req.params.id}, You cannot edit`));
    }
}

const drop = async(req, res, next) => {
    let delWarranty = await DB.findById(req.params.id);
    if(delWarranty) {
        deleteFile(delWarranty.image);
        let name = delWarranty.name;
        await DB.findByIdAndDelete(delWarranty._id);
        Helper.fMsg(res, `${name} was deleted from warranties`);
    } else {
        next(new Error(`Invalid ID: ${req.params.id}, You cannot delete`));
    }
}

module.exports = {
    all,
    add,
    get,
    put,
    drop
}