const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

const item = mongoose.model('item', itemSchema);
module.exports = item;
