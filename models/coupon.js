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
    isDeleted: { type: Boolean, default: false, select: false },
    __v: { type: Number, select: false }
});

couponSchema.pre('find', async function () {
    this.where({ isDeleted: false });
});

couponSchema.pre('findOne', async function () {
    this.where({ isDeleted: false });
});

/* This function can use only for soft deleted document to restore or parmenet delete */
couponSchema.pre('updateOne', async function () {
    this.where({ isDeleted: true });
});

const coupon = mongoose.model('coupon', couponSchema);
module.exports = coupon;
