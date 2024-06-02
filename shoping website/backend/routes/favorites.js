const { Favorite } = require('../models/Favorite');
const verifyToken = require('../utils/verifyToken');
const { ObjectId } = require('mongodb');
const router = require('express').Router();

router.get('/', verifyToken(['user']), async (req, res) => {
    try {
        const myFavorites = await Favorite.find({ user: new ObjectId(req.user._id) })
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

        return res.send(myFavorites);
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.delete('/delete/:id', verifyToken(['user']), async (req, res) => {
    try {
        await Favorite.deleteOne({ _id: req.params.id });
        return res.send({ message: 'Favorite successfully deleted!' });
    } catch (error) {
        // You could log the error and send a proper error response
        console.error(error);
        return res.status(500).send({ message: 'An error occurred while deleting the user.' });
    }
});

module.exports = router;