const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        unitPrice: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

orderSchema.plugin(AutoIncrement, { inc_field: 'orderNumber', start_seq: 1000 });

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order } 