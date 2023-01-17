const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    subcats: [{ type: Schema.Types.ObjectId, ref: 'subcat' }],
    created: { type: Date, default: Date.now }
});

const category = mongoose.model('category', categorySchema);
module.exports = category;
