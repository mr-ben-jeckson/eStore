const { boolean } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    name: { type: String, required: true },
    account: { type: String },
    number: { type: String },
    type: { type: String, enum: ["MM", "MB", "COD"] }, // MM = Mobile Money like Kpay or Wave, MB = Mobile Banking, COD = Cash on Delivery Default
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, select: false, default: false },
    __v: { type: Number, select: false },
});

paymentSchema.pre('find', async function () {
    this.where({ isDeleted: false });
});

paymentSchema.pre('findOne', async function () {
    this.where({ isDeleted: false });
});

/* This function can use only for soft deleted document to restore or parmenet delete */
paymentSchema.pre('updateOne', async function () {
    this.where({ isDeleted: true });
});

const payment = mongoose.model('payment', paymentSchema);
module.exports = payment;
