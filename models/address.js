const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    location: { type: String, coordinates: [Number], required: true },
    default: { type: Boolean, default: 0 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const address = mongoose.model('address', addressSchema);
module.exports = address;
