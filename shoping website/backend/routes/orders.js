const router = require('express').Router();
const { Order } = require('../models/Order');
const verifyToken = require('../utils/verifyToken');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

router.get('/myorders', verifyToken(['user']), async (req, res) => {
    const myOrders = await Order.find({ user: new ObjectId(req.user._id) })
        .populate({
            path: 'user',
            select: {
                _id: 1, username: 1, firstname: 1, lastname: 1, email: 1, role: 1,
            },
        })
        .populate({
            path: 'product',
            select: {
                _id: 1, name: 1, detail: 1, stock: 1, price: 1, productImg: 1,
            },
        }).select('-__v');

    return res.send(myOrders);
});

router.get('/getOrder/:id', verifyToken(['admin', 'user']), async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Malformed product id');
    }

    const order = await Order.findById(req.params.id)
        .populate({
            path: 'user',
            select: {
                _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, address: 1, phone: 1,
            },
        })
        .populate({
            path: 'product',
            select: {
                _id: 1, name: 1, detail: 1, stock: 1, price: 1, productImg: 1,
            },
        }).select('-__v');
    if (!order) {
        return res.status(400).send('order not found');
    }
    return res.send(order);
});

module.exports = router;