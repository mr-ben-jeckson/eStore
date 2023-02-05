const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, 'ref': 'product', required: true },
    order: { type: Schema.Types.ObjectId, 'ref': 'order', required: true },
    name: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ["ACCEPT", "DELIVERY", "COMPLETED", "CANCELED"], default: "ACCEPT" },
    created: { type: Date, default: Date.now }
});

const item = mongoose.model('item', itemSchema);
module.exports = item;
