const DB = require('../models/role');
const permitDB = require('../models/permission');
const Helper = require('../utils/helper');

// Adding A Role
const add = async (req, res, next) => {
    let role = await DB.findOne({ name: req.body.name });
    if (role) {
        next(new Error(`${role.name} is already taken. Try other`));
    } else {
        await new DB(req.body).save();
        let role = await DB.findOne({ name: req.body.name }).select('-__v');
        Helper.fMsg(res, "Role is added", role);
    }
}

//Getting Single Role
const get = async (req, res, next) => {
    let role = await DB.findById(req.params.id).select('-__v');
    if (role) {
        Helper.fMsg(res, "Single Role", role);
    } else {
        next(new Error(`${req.params.id} is invalid. Try other`));
    }
}

//Patching Role 
const patch = async (req, res, next) => {
    let role = await DB.findById(req.params.id);
    if (role) {
        await DB.findByIdAndUpdate(role._id, req.body);
        updateRole = await DB.findById(role._id).select('-__v');
        Helper.fMsg(res, "Role Updated", updateRole);
    } else {
        next(new Error(`${req.params.id} is invalid. Try Other`));
    }
}

//Dropping Role
const drop = async (req, res, next) => {
    let role = await DB.findById(req.params.id);
    if (role) {
        let dropRole = role.name;
        await DB.findByIdAndDelete(role._id);
        Helper.fMsg(res, `Role : ${dropRole} is deleted`);
    } else {
        next(new Error(`${req.params.id} is invalid. Try Other`));
    }
}

//Retriving All Roles
const all = async (req, res, next) => {
    let roles = await DB.find().populate('permissions', '-__v').select('-__v');
    Helper.fMsg(res, "All Roles", roles);
}

//Adding Permission to Roles
const addRolePermit = async (req, res, next) => {
    let role = await DB.findById(req.body.roleId);
    let permit = await permitDB.findById(req.body.permitId);
    if (role && permit) {
        await DB.findByIdAndUpdate(role._id, { $push: { permissions: permit._id } });
        let syncRole = await DB.findById(role._id).populate('permissions', '-__v').select('-__v');
        Helper.fMsg(res, `Permission : ${permit.name} is added to Role: ${role.name}`, syncRole);
    } else {
        next(new Error("Role and Permission Id must valid"));
    }
}

//Removing Permission from Roles
const removeRolePermit = async(req, res, next) => {
    let role = await DB.findById(req.body.roleId);
    let permit = await permitDB.findById(req.body.permitId);
    if (role && permit) {
        await DB.findByIdAndUpdate(role._id, { $pull: { permissions: permit._id } });
        let syncRole = await DB.findById(role._id).populate('permissions', '-__v').select('-__v');
        Helper.fMsg(res, `Permission : ${permit.name} is removed from Role: ${role.name}`, syncRole);
    } else {
        next(new Error("Role and Permission Id must valid"));
    }
}

module.exports = {
    add,
    get,
    patch,
    drop,
    addRolePermit,
    removeRolePermit,
    all
}