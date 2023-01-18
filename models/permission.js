const mongoose = require('mongoose');
const { Schema } = mongoose;

const permissionSchema = new Schema({
    name: { type: String, required: true, unique: true },
    __v: { type: Number, select: false}
});

const permission = mongoose.model('permission', permissionSchema);
module.exports = permission;
