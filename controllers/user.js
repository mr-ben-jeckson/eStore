const DB = require('../models/user');
const Helper = require('../utils/helper');

//User Registration and Unique Checking
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

//User Authentication or Logging In
const login = async(req, res, next) => {
    let validUser = await DB.findOne({ phone: req.body.phone }).populate('roles permissions').select('-__v');
    if(validUser) {
        if(Helper.comparePass(req.body.password, validUser.password)) {
            let user = validUser.toObject();
            delete user.password;
            Helper.fMsg(res, "Login Success", user);
        } else {
            next(new Error("Creditential does not match in our records"))
        }
    } else {
        next(new Error("Creditential does not match in our records"))
    }
}

module.exports = {
    register,
    login
}