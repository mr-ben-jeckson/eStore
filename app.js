/* Configuration ENV */
require('dotenv').config();

/*  Declared Express */
const express = require('express');
app = express();

/* Declared File Upload */
const fileupload = require('express-fileupload');
/* APP uses Json */
app.use(express.json());
/* APP uses File Upload */
app.use(fileupload());

/* APP use CORS & Helmet */
const cors = require('cors');
const helmet = require('helmet');
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
/* Socket IO Set up */
const http = require('http'),
    server = http.createServer(app),
    io = require('socket.io')(server);
/* For Public Storage */
const path = require("path");
app.use('/storage', express.static(path.join(__dirname, 'storage')));

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
/* Tag Routes */
const tagRoute = require('./routes/tag');
app.use('/tag', tagRoute);
/* Delivery Routes */
const deliRoute = require('./routes/delivery');
app.use('/delivery', deliRoute);
/* Warranty Routes */
const warrantyRoute = require('./routes/warranty');
app.use('/warranty', warrantyRoute);
/* Product Routes */
const productRoute = require('./routes/product');
app.use('/product', productRoute);
/* Order Routes */
const orderRoute = require('./routes/order');
app.use('/order', orderRoute);
/* Payment Routes */
const paymentRoute = require('./routes/payment');
app.use('/payment', paymentRoute);
/* Coupon Routes */
const couponRoute = require('./routes/coupon');
app.use('/coupon', couponRoute);
/* Test Application */
const testRoute = require('./routes/test');
app.use('/test', testRoute);

/* Run Functions for migration  */
// const defaultData = async () => {
//     let migration = require('./migrations/migrate');
//     const { sleep } = require('./utils/helper'); 
/* Migration To Tables */
    // migration.migrateUser();
    // migration.migrateRolePermission();
    // await sleep(5000);
    // await migration.migrateRoleAdd();
/* Table backs up to Json File */
// await migration.backup(); 
// }
// defaultData();

const chatController = require('./controllers/chat');
/* Chat */
io.of('chat').use(chatController.chatToken).on('connection', socket => chatController.initialize(io, socket));

/* TASK SCHEDULING */
const appController = require('./controllers/app');
appController.jobs;

/* ERROR HANDLING */
app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({ con: false, msg: err.message });
});

/* APP DEV */
/* Declared Mongoose and MongoDB Set Up */
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    server.listen(PORT, () => console.log(`REST API server is running on ${process.env.HOST}:${PORT}`));
}).catch((error) => console.log(`${error} : Did not connect`));