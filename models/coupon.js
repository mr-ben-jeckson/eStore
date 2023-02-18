const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
    name: { type: String, required: true}, 
    code: { type: String, required: true},
    allow: { type: Number, default: 1},
    type: { type: String, enum: ["percentage", "cashback"], default: "cashback"},
    about: { type: String, required: true}, 
    status: { type: Boolean, default: 0 }, 
    discount: { type: Number, required: true },
    order: [{ type: Schema.Types.ObjectId, 'ref': 'order'}],
    expired: { type: Date, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    __v: { type: Number, select: false }
});

couponSchema.pre('find', async function () {
    this.where({ isDeleted: false });
});

couponSchema.pre('findOne', async function () {
    this.where({ isDeleted: false });
});

couponSchema.methods.softDelete = async function() {
    this.isDeleted = true;
    this.deletedAt = Date.now();
    return await this.save();
}

const coupon = mongoose.model('coupon', couponSchema);
module.exports = coupon;
