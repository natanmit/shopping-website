const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        detail: { 
            type: String, 
            required: true 
        },
        stock: { 
            type: Number, 
            required: true 
        },
        price: { 
            type: Number, 
            required: true 
        },
        productImg: { 
            type: String, 
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

const Product = mongoose.model("Product", productSchema);

module.exports = { Product } 