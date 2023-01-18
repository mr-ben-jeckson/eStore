const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: Schema.Types.ObjectId, 'ref': 'role' }],
    permissions: [{ type: Schema.Types.ObjectId, 'ref': 'permission' }],
    created: { type: Date, default: Date.now },
    __v: { type: Number, select: false}
});

const user = mongoose.model('user', userSchema);
module.exports = user;
