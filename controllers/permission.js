const DB = require('../models/permission');
const Helper = require('../utils/helper');

let add = async (req, res, next) => {
    let permit = await DB.findOne({ name: req.body.name });
    if (permit) {
        next(new Error("Permission Name is already in use"));
    } else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res, "Permission Created", result);
    }
}

module.exports = {
    add
}