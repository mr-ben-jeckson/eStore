const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    number: { type: String, required: true },
    item: [{ type: Schema.Types.ObjectId, 'ref': 'item' }],
    count: { type: String, required: true, default: 1},
    total: { type: Number, required: true},
    user: { type: Schema.Types.ObjectId, 'ref': 'user'},
    status: { type: String, enum: ["PENDING", "ACCEPT", "COMPLETED"], default: "PENDING"},
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const order = mongoose.model('order', orderSchema);
module.exports = order;
