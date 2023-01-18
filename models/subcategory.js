const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubCategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    catid: { type: Schema.Types.ObjectId, 'ref': 'category' },
    childcat: [{ type: Schema.Types.ObjectId, 'ref': 'childcategory' }],
    created: { type: Date, default: Date.now },
    __v: { type: Number, select: false}
});

const SubCategory = mongoose.model('subcategory', SubCategorySchema);
module.exports = SubCategory;
