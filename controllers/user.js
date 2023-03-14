const DB = require('../models/user');
const roleDB = require('../models/role');
const permitDB = require('../models/permission');
const addressDB = require('../models/address');
const Helper = require('../utils/helper');
const redis = require('../utils/redis');
const jwt = require('jsonwebtoken');

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
    let findObj = {}
    if (req.body.phone) {
        findObj['phone'] = req.body.phone;
    } else {
        findObj['email'] = req.body.email;
    }
    let validUser = await DB.findOne(findObj).populate('roles permissions');
    if (validUser) {
        if (Helper.comparePass(req.body.password, validUser.password)) {
            let user = validUser.toObject();
            delete user.password;
            try {
                user.token = Helper.makeToken(user);
            } catch (err) {
                next(new Error(err.message));
                return;
            }
            redis.set(user._id, user);
            Helper.fMsg(res, "Login Success", user);
        } else {
            next(new Error("Creditential does not match in our records"))
        }
    } else {
        next(new Error("Creditential does not match in our records"))
    }
}

const currentUser = async (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    if(token) {
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(decoded) {
            let user = await redis.get(decoded._id);
            if(user) {
                let currentUser = user;
                Helper.fMsg(res, "Current User", currentUser);
            } else {
                next(new Error("Tokenization Error"));
            }
        } else {
            next(new Error("Token cannot be verified"));
        }
    } else {
        next(new Error("Tokenization Error"));
    }
}

const logout = async(req, res) => {
    redis.drop(req.user._id);
    Helper.fMsg(res, "Logged Out");
}

/* User Adding Roles */
const addRole = async (req, res, next) => {
    let assignUser = await DB.findById(req.body.userId);
    let assignRole = await roleDB.findById(req.body.roleId);
    if (assignUser && assignRole) {
        let checkRole = assignUser.roles.find(ro => ro.equals(assignRole._id));
        if (checkRole) {
            next(new Error(`${assignUser.name} has already the role: ${assignRole.name}`));
        } else {
            await DB.findByIdAndUpdate(assignUser._id, { $push: { roles: assignRole._id } });
            let user = await DB.findById(assignUser._id).populate('roles').select('-password');
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
            let user = await DB.findById(syncUser._id).populate('roles').select('-password');
            Helper.fMsg(res, `the role: ${removeRole.name} was removed from ${syncUser.name}`, user);
        } else {
            next(new Error(`the role : ${removeRole.name} cannot be removed form ${syncUser.name}`));
        }
    } else {
        next(new Error("User and Role ID must be valided"))
    }
}

/* Adding Permission to User */
const addPermission = async (req, res, next) => {
    let assignUser = await DB.findById(req.body.userId);
    let assignPermit = await permitDB.findById(req.body.permitId);
    if (assignUser && assignPermit) {
        let checkPermit = assignUser.permissions.find(pm => pm.equals(assignPermit._id));
        if (checkPermit) {
            next(new Error(`${assignUser.name} has already the permission: ${assignPermit.name}`));
        } else {
            await DB.findByIdAndUpdate(assignUser._id, { $push: { permissions: assignPermit._id } });
            let user = await DB.findById(assignUser._id).populate('permissions').select('-password');
            Helper.fMsg(res, `${assignUser.name} access the permission: ${assignPermit.name}`, user);
        }
    } else {
        next(new Error("User and Permission ID must be valided"))
    }
}

/* Removing Permission from Users */
const removePermission = async (req, res, next) => {
    let syncUser = await DB.findById(req.body.userId);
    let removePermit = await permitDB.findById(req.body.permitId);
    if (syncUser && removePermit) {
        let checkPermit = syncUser.permissions.find(pm => pm.equals(removePermit._id));
        if (checkPermit) {
            await DB.findByIdAndUpdate(syncUser._id, { $pull: { permissions: removePermit._id } });
            let user = await DB.findById(syncUser._id).populate('permissions').select('-password');
            Helper.fMsg(res, `the permission: ${removePermit.name} was removed from ${syncUser.name}`, user);
        } else {
            next(new Error(`the permission : ${removePermit.name} cannot be removed form ${syncUser.name}`));
        }
    } else {
        next(new Error("User and Permission ID must be valided"))
    }
}

/* Adding Address */
const addAddress = async (req, res, next) => {
    if (req.body.default === 1) {
        await addressDB.updateMany({
        $and: [
            { user: req.user._id },
            { default: true}
        ]},
            { default: false });
    }
    req.body['user'] = req.user._id;
    let newAddress = await new addressDB(req.body).save();
    Helper.fMsg(res, "Address has been added", newAddress, 201);
}

const getMyAddress = async (req, res) => {
    let address = await addressDB.find({ user: req.user._id });
    Helper.fMsg(res, "My Shipping Addresses", address);
}

const viewMyAddress = async(req, res, next) => {
    let address = await addressDB.findOne({
        $and: [
            { user: req.user._id },
            { _id: req.params.id }
        ]
    })
    if(address) {
        Helper.fMsg(res, "My Address", address);
    } else {
        next(new Error("Failed, You cannot view your address"));
    }
}

const editMyAddress = async (req, res, next) => {
    let myAddress = await addressDB.findOne({
        $and: [
            { user: req.user._id },
            { _id: req.params.id }
        ]
    });
    if(myAddress) {
        req.body['updated'] = Date.now();
        req.body['user'] = req.user._id;
        if (req.body.default === 1) {
            await addressDB.updateMany({
            $and: [
                { user: req.user._id },
                { default: true}
            ]},
                { default: false });
        }
        if (req.body.default === 0) {
            let oneAddress = await addressDB.find({ user: req.user._id }).count() === 1 ? true : false;
            if(oneAddress) {
                next(new Error("You have to set primary meanwhile you only have one address"));
                return;
            }
        }
        await addressDB.findByIdAndUpdate(myAddress._id, req.body);
        let updateAddress = await addressDB.findById(req.params.id);
        Helper.fMsg(res, "Shipping Address Updated", updateAddress);
    } else {
        next(new Error("Invalid ID or You cannot have access to edit"))
    }
}

const deleteMyAddress = async(req, res, next) => {
    let deleteAddress = await addressDB.findOne({
        $and: [
            { user: req.user._id },
            { _id: req.params.id },
            { default: false }
        ]
    })
    if(deleteAddress) {
        await addressDB.findByIdAndDelete(deleteAddress._id);
        Helper.fMsg(res, "Address was successfully removed");
    } else {
        next(new Error("Failed! You cannot delete"));
    }
}

module.exports = {
    register,
    login,
    currentUser,
    logout,
    addRole,
    removeRole,
    addPermission,
    removePermission,
    addAddress,
    getMyAddress,
    viewMyAddress,
    editMyAddress,
    deleteMyAddress
}