const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    subcats: [{ type: Schema.Types.ObjectId, 'ref': 'subcategory' }],
    created: { type: Date, default: Date.now },
    __v: { type: Number, select: false}
});

const category = mongoose.model('category', categorySchema);
module.exports = category;
