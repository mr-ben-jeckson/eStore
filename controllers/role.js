const DB = require('../models/role');
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

//Retriving All Roles
const all = async (req, res, next) => {
    let roles = await DB.find().select('-__v');
    Helper.fMsg(res, "All Roles", roles);
}

module.exports = {
    add,
    get,
    all
}