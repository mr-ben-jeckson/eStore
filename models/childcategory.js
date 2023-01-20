const mongoose = require('mongoose');
const { Schema } = mongoose;

const childCatSchema = new Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true},
    subcatid: { type: Schema.Types.ObjectId, 'ref': 'subcategory'},
    created: { type: Date, default: Date.now }
});

const childCat = mongoose.model('childcategory', childCatSchema);
module.exports = childCat;
