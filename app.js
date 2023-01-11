// Configuration ENV
require('dotenv').config();

// Declared Express
const express = require('express');
app = express();

// Declared Mongoose and MongoDB Set Up
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

// APP uses Json
app.use(express.json());

//Permission Routes
const permissionRoute = require('./routes/permission');
app.use('/permission', permissionRoute);

// ERROR HANDLING
app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({ con: false, msg: err.message });
});

//APP DEPLOY
app.listen(process.env.PORT, console.log(`API Server Site is running on ${process.env.HOST}:${process.env.PORT}`));