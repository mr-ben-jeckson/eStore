const DB = require('../models/permission');
const Helper = require('../utils/helper');

//Get Permissions
const all = async (req, res, next) => {
    let permits = await DB.find();
    Helper.fMsg(res, "Permissions", permits);
}

//Get Single Permission
const get = async (req, res, next) => {
    let permit = await DB.findById(req.params.id);
    if (permit) {
        Helper.fMsg(res, "Single Permission", permit);
    } else {
        next(new Error(`Cannot retrive permission with that Id = ${req.params.id}`));
    }
}

//Permission Unique Checking and Saving 
const add = async (req, res, next) => {
    let permit = await DB.findOne({ name: req.body.name });
    if (permit) {
        next(new Error(`${permit.name} is already used. Try Other`));
    } else {
        let permit = await new DB(req.body).save();
        Helper.fMsg(res, "Permission Created", permit);
    }
}

module.exports = {
    add,
    get,
    all
}