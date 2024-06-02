const { Cart } = require('../models/Cart');
const { Order } = require('../models/Order');
const { Product } = require('../models/Product');
const verifyToken = require('../utils/verifyToken');
const { ObjectId } = require('mongodb');
const router = require('express').Router();

router.post('/create', verifyToken(['user']), async (req, res) => {
    const { product, quantity } = req.body;
    const userId = req.user._id;
    try {
        await Cart.create({
            product: product,
            user: userId,
            quantity: quantity
        });
        let productData = await Product.findById(new ObjectId(product));
        let changedStock = parseFloat(productData.stock) - parseFloat(quantity);
        if (changedStock <= 0) return res.status(400).send({ status: "error", message: "You can't cart the quantity, there is not enough." });
        await Product.findOneAndUpdate({ _id: new ObjectId(product) }, { stock: changedStock });
        return res.status(200).send({ status: "success", message: "The Cart data created successfully!" });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.get('/mycart', verifyToken(['admin', 'user']), async (req, res) => {
    const myCarts = await Cart.find({ user: new ObjectId(req.user._id), status: 'active' })
        .populate({
            path: 'user',
            select: {
                _id: 1, firstname: 1, lastname: 1, email: 1, role: 1,
            },
        })
        .populate({ 
            path: 'product',
            select: {
                _id: 1, name: 1, detail: 1, stock: 1, price: 1, productImg: 1,
            },
        }).select('-__v');

    return res.send(myCarts);
});

router.delete('/delete/:id', verifyToken(['user']), async (req, res) => {
    try {
        await Cart.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { status: 'deleted' }, { new: true });
        return res.send({ status: "success", message: "Cart data deleted successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
});

router.post('/checkout', verifyToken(['user']), async (req, res) => {
    const postCheckoutData = req.body;
    let cartIds = postCheckoutData.map(checkData => new ObjectId(checkData.cart));
    try {
        await Cart.updateMany({ _id: { $in: cartIds } }, { $set: { status: "deleted" } }, { new: true });
        for (let orderData of postCheckoutData) {
            const order = new Order(orderData);
            await order.save();
        }
        return res.send({ status: "success", message: "Checkout successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
});

module.exports = router;