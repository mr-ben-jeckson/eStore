const DB = require('../models/user');
const roleDB = require('../models/role')
const Helper = require('../utils/helper');
const redis = require('../utils/redis');

/* User Registration and Unique Checking */
const register = async (req, res, next) => {
    let userEmail = await DB.findOne({ email: req.body.email })
    if (userEmail) {
        next(new Error(`${req.body.email} is already taken`));
        return;
    }
    let userPhone = await DB.findOne({ phone: req.body.phone })
    if (userPhone) {
        next(new Error(`${req.body.phone} is already taken`));
        return;
    }
    req.body.password = Helper.encode(req.body.password);
    let registerUser = await new DB(req.body).save();
    Helper.fMsg(res, "User Registration Success", registerUser);
}

/* User Authentication or Logging In */
const login = async (req, res, next) => {
    let validUser = await DB.findOne({ phone: req.body.phone }).populate('roles permissions').select('-__v');
    if (validUser) {
        if (Helper.comparePass(req.body.password, validUser.password)) {
            let user = validUser.toObject();
            delete user.password;
            user.token = Helper.makeToken(user);
            redis.set(user._id, user);
            Helper.fMsg(res, "Login Success", user);
        } else {
            next(new Error("Creditential does not match in our records"))
        }
    } else {
        next(new Error("Creditential does not match in our records"))
    }
}

/* User Adding Roles */
const addRole = async (req, res, next) => {
    let assignUser = await DB.findById(req.body.userId);
    let assignRole = await roleDB.findById(req.body.roleId);
    if (assignUser && assignRole) {
        let checkRole = assignUser.roles.find(ro => ro.equals(assignRole._id));
        if (checkRole) {
            next(new Error(`${assignUser.name} already has the role: ${assignRole.name}`));
        } else {
            await DB.findByIdAndUpdate(assignUser._id, { $push: { roles: assignRole._id } });
            let user = await DB.findById(assignUser._id).populate('roles').select('-__v -password');
            Helper.fMsg(res, `${assignUser.name} access the role: ${assignRole.name}`, user);
        }
    } else {
        next(new Error("User and Role ID must be valided"))
    }
}

/* Removing Role from Users */
const removeRole = async (req, res, next) => {
    let syncUser = await DB.findById(req.body.userId);
    let removeRole = await roleDB.findById(req.body.roleId);
    if (syncUser && removeRole) {
        let checkRole = syncUser.roles.find(ro => ro.equals(removeRole._id));
        if (checkRole) {
            await DB.findByIdAndUpdate(syncUser._id, { $pull: { roles: removeRole._id } });
            let user = await DB.findById(syncUser._id).populate('roles').select('-__v -password');
            Helper.fMsg(res, `the role: ${removeRole.name} was removed from ${syncUser.name}`, user);
        } else {
            next(new Error(`the role : ${removeRole.name} cannot be removed form ${syncUser.name}`));
        }
    } else {
        next(new Error("User and Role ID must be valided"))
    }
}

module.exports = {
    register,
    login,
    addRole,
    removeRole
}