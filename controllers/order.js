const crypto = require('crypto');
const DB = require('../models/order');
const productDB = require('../models/product');
const itemDB = require('../models/item');
const Helper = require('../utils/helper');

const add = async (req, res, next) => {
    const user = req.user,
        items = req.body.items;

    let saveOrder = new DB(),
        itemsObj = [],
        grandTotal = 0;

    for await (let item of items) {
        let product = await productDB.findById(item.id);
        let itemObj = {
            order: saveOrder._id,
            product: product._id,
            name: product.name,
            price: product.price,
            size: item.size,
            color: item.color,
            count: item.quantity,
            total: item.quantity * product.price
        }
        itemsObj.push(itemObj);
        grandTotal += item.quantity * product.price;
    }

    let saveItems = await itemDB.insertMany(itemsObj),
        saveItemIds = saveItems.map(item => item._id);

    saveOrder.number = crypto.randomBytes(4).toString('hex').toUpperCase(); // Generate Ramdom Number 
    saveOrder.item = saveItemIds;
    saveOrder.count = items.length;
    saveOrder.total = grandTotal;
    saveOrder.user = user._id;
    let newOrder = await saveOrder.save();
    Helper.fMsg(res, "Order Accepted", newOrder, 201);
}

module.exports = {
    add
}