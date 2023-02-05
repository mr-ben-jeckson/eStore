const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    name: { type: String, required: true },
    account: { type: String },
    number: { type: String },
    type: { type: String, enum: ["Kpay", "Wave", "MPU", "COD", "MB"]},
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const payment = mongoose.model('payment', paymentSchema);
module.exports = payment;
