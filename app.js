/* Configuration ENV */
require('dotenv').config();

/*  Declared Express */
const express = require('express');
app = express();

/* Declared File Upload */
const fileupload = require('express-fileupload');

/* Declared Mongoose and MongoDB Set Up */
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

/* APP uses Json */
app.use(express.json());
/* APP uses File Upload */
app.use(fileupload());

/* Permission Routes */
const permissionRoute = require('./routes/permission');
app.use('/permission', permissionRoute);

/* Role Routes */
const roleRoute = require('./routes/role');
const { validateRole } = require('./utils/validator');
app.use('/role', validateRole('Super Admin'), roleRoute);

/*  User Routes */
const userRoute = require('./routes/user');
app.use('/user', userRoute);

/* Category Routes */
const categoryRoute = require('./routes/category');
app.use('/category', categoryRoute);
/* Sub Category Routes */
const subCatRoute = require('./routes/subcategory');
app.use('/subcategory', subCatRoute);
/* Child Category Routes */
const childCatRoute = require('./routes/childcategory');
app.use('/childcategory', childCatRoute);


/* Run Functions  */
const defaultData = async () => {
    // let migration = require('./migrations/migrate');
    /* Migration To Tables */
    // await migration.migrateUser();
    // await migration.migrateRolePermission();
    // await migration.migrateRoleAdd();
    /* Table backs up to Json File */
    // await migration.backup(); 
}
// defaultData();

/* ERROR HANDLING */
app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({ con: false, msg: err.message });
});

/* APP DEV */
app.listen(process.env.PORT, console.log(`API Server Site is running on ${process.env.HOST}:${process.env.PORT}`));