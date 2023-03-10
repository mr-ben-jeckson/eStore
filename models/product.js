const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true, unqiue: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    cat: { type: Schema.Types.ObjectId, 'ref': 'category' },
    subcat: { type: Schema.Types.ObjectId, 'ref': 'subcategory' },
    childcat: { type: Schema.Types.ObjectId, 'ref': 'childcategory' },
    tag: { type: Schema.Types.ObjectId, 'ref': 'tag' },
    discount: { type: Number, default: 0 },
    features: { type: Array, required: true },
    content: { type: String, required: true },
    detail: { type: String, required: true },
    status: { type: Boolean, required: true },
    colors: { type: Array, required: true },
    sizes: { type: Array, required: true },
    rating: { type: Number, default: 0 },
    delivery: [{ type: Schema.Types.ObjectId, 'ref': 'delivery' }],
    warranty: [{ type: Schema.Types.ObjectId, 'ref': 'delivery' }],
    images: { type: Array, required: true },
    user_id: { type: Schema.Types.ObjectId, 'ref': 'user' },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date },
    __v: { type: Number, select: false }
});

productSchema.pre('find', async function () {
    this.where({ isDeleted: false });
});

productSchema.pre('findOne', async function () {
    this.where({ isDeleted: false });
});

productSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = Date.now();
    return await this.save();
}

const product = mongoose.model('product', productSchema);
module.exports = product;
