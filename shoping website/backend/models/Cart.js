const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'deleted'],
            default: 'active',
        },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Cart } 