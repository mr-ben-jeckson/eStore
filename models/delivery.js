const mongoose = require('mongoose');
const { Schema } = mongoose;

const deliverySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true},
    remark: { type: Array, requried: true},
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const delivery = mongoose.model('delivery', deliverySchema);
module.exports = delivery;
