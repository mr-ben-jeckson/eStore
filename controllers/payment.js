const DB = require('../models/payment');
const Helper = require('../utils/helper');

const add = async(req, res, next) => {
    let payment = await new DB(req.body).save();
    Helper.fMsg(res, "New Payment was added", payment, 201);
}

const get = async(req, res, next) => {
    let payment = await DB.find(req.params.id);
    if(payment) Helper.fMsg(res, "Payment Detail", payment);
    else new next(new Error(`Invalid ID: ${req.params.id}, You cannot get`));
}

const getPayment = async(req, res) => {
    let searchObj = {};
    if(req.query.type) searchObj['type'] = req.query.type;
    let payments = await DB.find(searchObj);
    Helper.fMsg(res, "Payments", payments);
}

const put = async(req, res, next) => {
    let payment = await DB.findOne({ _id: req.params.id },{ $ne: { type: "COD"} });
    if(payment) {
        await DB.findByIdAndUpdate(payment._id, req.body);
    } else {
        next(new Error("Invalid ID or COD type cannot be edit"));
    }
}

const softDrop = async(req, res, next) => {
    let payment = await DB.findOne({ _id: req.params.id },{ isDeleted: false });
    if(payment) {
        await DB.findByIdAndUpdate(payment._id, { isDeleted: true });
    } else {
        next(new Error("Invalid ID or Dropped ID, cannot be deleted"));
    }
}

module.exports = {
    add,
    get,
    put,
    getPayment,
    softDrop
}