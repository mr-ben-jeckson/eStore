const mongoose = require('mongoose');
const { Schema } = mongoose;

const warrantySchema = new Schema({
    name: { type: String, required: true, unqiue: true },
    image: { type: String, required: true },
    remark: { type: Array },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    __v: { type: Number, select: false }
});

const warranty = mongoose.model('warranty', warrantySchema);
module.exports = warranty;
