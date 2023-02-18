const crypto = require('crypto');
const DB = require('../models/order');
const productDB = require('../models/product');
const addressDB = require('../models/address');
const payDB = require('../models/payment');
const couponDB = require('../models/coupon');
const itemDB = require('../models/item');
const Helper = require('../utils/helper');

const add = async (req, res, next) => {
    let address = await addressDB.findOne({
        $and: [
            { _id: req.body.address_id },
            { user: req.user._id }
        ]
    });
    if (!address) {
        next(new Error("Our record does not match with your shipping address"));
        return;
    }
    let payment = await payDB.findById(req.body.pay_id);
    if (!payment) {
        next(new Error("Our record does not match with your payment options"));
        return;
    }
    let hasPromo = null;
    if (req.body.coupon_id) {
        hasPromo = await couponDB.findOne({
            $and: [
                { _id: req.body.coupon_id },
                { allow: { $gt: 0 } },
                { status: true },
                { expried: { $lt: Date.now() } }
            ]
        });
        if (!hasPromo) {
            next(new Error("Coupon does not valid right now"));
            return;
        }
    }
    const user = req.user,
        items = req.body.items;

    let saveOrder = new DB(),
        itemsObj = [],
        grandTotal = 0;

    for await (let item of items) {
        let product = await productDB.findById(item.id);
        if (product) {
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
        } else {
            next(new Error("Our record does not match item id in products"));
            return;
        }
    }

    let saveItems = await itemDB.insertMany(itemsObj),
        saveItemIds = saveItems.map(item => item._id);

    saveOrder.number = crypto.randomBytes(4).toString('hex').toUpperCase(); // Generate Ramdom Number 
    saveOrder.item = saveItemIds;
    saveOrder.count = items.length;
    if (hasPromo) {
        saveOrder.coupon = hasPromo._id;
        hasPromo.type === 'percentage' ? saveOrder.total = grandTotal * ((100 - hasPromo.discount) / 100) :
            saveOrder.total = grandTotal - hasPromo.discount;
        saveOrder.discounted = grandTotal - saveOrder.total;
        await couponDB.findByIdAndUpdate(hasPromo._id, {
            allow: hasPromo.allow - 1
        });
    } else {
        saveOrder.total = grandTotal;
    }
    saveOrder.user = user._id;
    saveOrder.address = address._id;
    saveOrder.payment = payment._id;
    let newOrder = await saveOrder.save();
    Helper.fMsg(res, "Order Accepted", newOrder, 201);
}

module.exports = {
    add
}