// Configuration ENV
require('dotenv').config();

// Declared Express
const express = require('express');
app = express();

// Declared Mongoose and MongoDB Set Up
const mongoose = require('mongoose');
const { insertMany } = require('./models/role');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

// APP uses Json
app.use(express.json());

// Permission Routes
const permissionRoute = require('./routes/permission');
app.use('/permission', permissionRoute);
// Role Routes
const roleRoute = require('./routes/role');
app.use('/role', roleRoute);
// User Routes
const userRoute = require('./routes/user');
app.use('/user', userRoute);


//Run Functions 
const defaultData = async() => {
    let migration = require('./migrations/migrate');
    //Migration To Table
    await migration.migrate();
    //Table backs up to Json File
    await migration.backup();
}
// defaultData();

// ERROR HANDLING
app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({ con: false, msg: err.message });
});

//APP DEPLOY
app.listen(process.env.PORT, console.log(`API Server Site is running on ${process.env.HOST}:${process.env.PORT}`));