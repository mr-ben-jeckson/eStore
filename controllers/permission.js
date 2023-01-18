const DB = require('../models/permission');
const Helper = require('../utils/helper');

/* Get Permissions */
const all = async (req, res, next) => {
    let permits = await DB.find();
    Helper.fMsg(res, "Permissions", permits);
}

/* Get Single Permission */
const get = async (req, res, next) => {
    let permit = await DB.findById(req.params.id);
    if (permit) {
        Helper.fMsg(res, "Single Permission", permit);
    } else {
        next(new Error(`Cannot retrive permission with that Id = ${req.params.id}`));
    }
}

/* Permission Unique Checking and Saving */ 
const add = async (req, res, next) => {
    let permit = await DB.findOne({ name: req.body.name });
    if (permit) {
        next(new Error(`${permit.name} is already used. Try Other`));
    } else {
        await new DB(req.body).save();
        let permit = await DB.findOne({ name: req.body.name});
        Helper.fMsg(res, "Permission Created", permit);
    }
}

/* Patching Permission */
const patch = async (req, res, next) => {
    let permit = await DB.findById(req.params.id);
    if (permit) {
        await DB.findByIdAndUpdate(permit._id, req.body);
        let updatePermit = await DB.findById(permit._id);
        Helper.fMsg(res, "Permission Updated", updatePermit);
    } else {
        next(new Error(`${req.params.id} is invalid. Try Other`));
    }
}

/* Dropping Single Permission */
const drop = async (req, res, next) => {
    let permit = await DB.findById(req.params.id);
    if (permit) {
        let dropPermit = permit.name;
        await DB.findByIdAndDelete(permit._id);
        Helper.fMsg(res, `Deleted Permission = ${dropPermit}`);
    } else {
        next(new Error(`Cannot delete invalid Id = ${req.params.id}`));
    }
}

module.exports = {
    add,
    get,
    patch,
    drop,
    all
}