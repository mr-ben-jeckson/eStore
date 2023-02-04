const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    name: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

const order = mongoose.model('order', orderSchema);
module.exports = order;
