require('dotenv').config();
const express = require('express');
app = express();
mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});
app.listen(process.env.PORT, console.log(`Server is running at the port ${process.env.PORT}`));