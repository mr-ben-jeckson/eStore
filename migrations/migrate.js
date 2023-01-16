const fs = require('fs');
const UserDB = require('../models/user');
const RoleDB = require('../models/role');
const PermitDB = require('../models/permission');
const Helper = require('../utils/helper');

/* Migrate Function for Users */
const migrateUser = () => {
    let data = fs.readFileSync('./migrations/user.json');
    let users = JSON.parse(data);
    users.forEach(async (user) => {
        user.password = Helper.encode(user.password);
        let migartion = await new UserDB(user).save();
        console.log(migartion);
    });
}

/* Migrate Function for Roles and Permissions */
const migrateRolePermission = () => {
    let data = fs.readFileSync('./migrations/role-permission.json');
    let rolePermit = JSON.parse(data);
    rolePermit.roles.forEach(async role => {
        let migration = await new RoleDB(role).save();
        console.log(migration);
    });
    rolePermit.permissions.forEach(async permission => {
        let migration = await new PermitDB(permission).save();
        console.log(migration);
    });
}

/* Adding role to super admin */
const migrateRoleAdd = async () => {
    let user = await UserDB.findOne({ email: "superadmin@gmail.com" });
    let role = await RoleDB.findOne({ name: "Super Admin" });
    await UserDB.findByIdAndUpdate(user._id, { $push: { roles: role._id } });
    console.log("Adding Role Success");
}

/* Backup Users to Json File */
const backup = async () => {
    let users = await UserDB.find();
    fs.writeFileSync('./migrations/backup/user.json', JSON.stringify(users));
    console.log("Back up Success!");
}

module.exports = {
    migrateUser,
    migrateRolePermission,
    migrateRoleAdd,
    backup
}