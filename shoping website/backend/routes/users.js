const router = require('express').Router();
const { User } = require("../models/User");
const verifyToken = require('../utils/verifyToken');
const multer = require("multer");
const { ObjectId } = require("mongodb");
const { uuid } = require('../utils/Utils');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/img/profiles`);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `profile-${uuid()}-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const uploadProfile = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

router.get('/personal/me', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -__v');
        return res.send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.get('/logout', async (req, res) => {
    try {
        res.cookie('refreshToken', "", { maxAge: 1 });
        res.cookie('isLoggedIn', "", { maxAge: 1 });
        return res.status(200).send({ message: 'successfully logout' });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }
});

router.delete('/delete/:id', verifyToken(['admin', 'user']), async (req, res) => {
    await User.findOneAndUpdate({ _id: req.params.id }, { status: 'deleted' }, {
        new: true,
    });
    return res.send({ message: 'User successfully deleted!' });
});

router.put('/update/profile', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const updateValues = req.body;
        const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, updateValues, {
            new: true,
        }).select('-__v');

        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        return res.send({ updatedUser: updatedUser, message: 'User successfully updated' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ message: 'Duplicated Email, there is already an existing Email' });
        }
        return res.status(500).send({ message: error.message || 'An unexpected error occurred' });
    }
});

router.put('/upload/avatarFile', uploadProfile.single('avatarFile'), verifyToken(['admin', 'user']), async (req, res) => {
    const imageUri = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');
    const updateAvatar = await User.findOneAndUpdate({ _id: req.user._id }, { avatar: imageUri }, { new: true }).select('-password -__v');

    return res.send({ updateAvatar: updateAvatar })
});

module.exports = router;