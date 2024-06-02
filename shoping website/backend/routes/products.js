const router = require('express').Router();
const { Product } = require('../models/Product');
const { uuid } = require('../utils/Utils');
const verifyToken = require('../utils/verifyToken');
const multer = require("multer");
const mongoose = require('mongoose');
const { Favorite } = require('../models/Favorite');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/img/products`);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `product-${uuid()}-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const uploadProduct = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

router.get('/', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const totalCount = await Product.countDocuments({});
        const products = await Product.find();
        return res.send({
            totalCount,
            products,
            filteredCount: products.length,
        })
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.post('/search', async (req, res) => {
    try {
        const searchQuery = typeof req.body.searchItem !== 'undefined' ? req.body.searchItem : '';
        const filterParams = {
            $and: [
                {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { detail: { $regex: searchQuery, $options: 'i' } },
                    ],
                },
            ],
        };
        const products = await Product.find(filterParams);
        return res.send(products)
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.get('/getHome', async (req, res) => {
    try {
        const totalCount = await Product.countDocuments({});
        const products = await Product.find();
        return res.send({
            totalCount,
            products,
            filteredCount: products.length,
        })
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.post('/create', verifyToken(['admin']), async (req, res) => {
    const productData = {
        name: req.body.name,
        detail: req.body.detail,
        stock: req.body.stock,
        price: req.body.price,
        productImg: req.body.productImg,
    }

    try {
        await Product.create(productData);
        return res.status(200).send({ status: "success", message: "Product created successfully!" });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.put('/update/:id', verifyToken(['admin']), async (req, res) => {
    const updateValues = req.body;

    try {
        const updatedProduct = await Product.findOneAndUpdate({ _id: req.params.id }, updateValues, {
            new: true,
            runValidators: true,
        }).select('-__v');

        if (!updatedProduct) {
            return res.status(404).send({ status: "error", message: "Product not found." });
        }

        return res.status(200).send({ status: "success", message: "Product updated successfully!", data: updatedProduct });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).send({ status: "error", message: error.message });
        }
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.get('/getProduct/:id', verifyToken(['admin', 'user']), async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Malformed product id');
    }
    try {
        const product = await Product.findById(req.params.id).select('-__v');
        if (!product) {
            return res.status(400).send('product not found');
        }

        // Check if the product is favorited by the current user
        const favorite = await Favorite.findOne({ user: req.user._id, product: req.params.id });
        const isFavorited = !!favorite;

        return res.send({
            ...product.toObject(),
            isFavorited
        });
    } catch (error) {
        console.error('Error fetching product with favorite status:', error);
        res.status(500).send('Internal Server Error');
    }

});

router.delete('/delete/:id', verifyToken(['admin']), async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.params.id });
        return res.send({ message: 'Product successfully deleted!' });
    } catch (error) {
        // You could log the error and send a proper error response
        console.error(error);
        return res.status(500).send({ message: 'An error occurred while deleting the user.' });
    }
});

router.post('/favorite', verifyToken(['user']), async (req, res) => {
    const userId = req.user._id; // assuming you have user in request after authentication
    const productId = req.body.productId;

    try {
        // Check if already favorited
        let favorite = await Favorite.findOne({ user: userId, product: productId });

        if (favorite) {
            // It's already a favorite, so unfavorite it (remove)
            await Favorite.deleteOne({ _id: favorite._id });
            res.status(200).send({ message: "Product unfavorited" });
        } else {
            // It's not a favorite yet, so favorite it (add)
            const newFavorite = new Favorite({ user: userId, product: productId });
            await newFavorite.save();
            res.status(200).send({ message: "Product favorited" });
        }
    } catch (error) {
        res.status(500).send({ message: "Error toggling favorite status", error });
    }
});

router.post('/upload/productImg', uploadProduct.single('productImg'), verifyToken(['admin']), async (req, res) => {
    const imageUri = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');
    return res.send({ imageUri: imageUri })
});

module.exports = router;