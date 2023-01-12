const fs = require('fs');
const DB = require('../models/user');
const Helper = require('../utils/helper');

// Migrate Function for Users
const migrate = () => {
    let data = fs.readFileSync('./migrations/user.json');
    let users = JSON.parse(data);
    users.forEach(async(user) => {
        user.password = Helper.encode(user.password);
        let migartion = await new DB(user).save();
        console.log(migartion);
    });
}

// Backup Users to Json File
const backup = async() => {
    let users = await DB.find();
    fs.writeFileSync('./migrations/backup/user.json', JSON.stringify(users));
    console.log("Back up Success!");
}

module.exports = {
    migrate,
    backup
}