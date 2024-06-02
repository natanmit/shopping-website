const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require("../models/User");
const { loginValidation, registerValidation } = require("../utils/validate");

const saltLength = 10;
let refreshTokens = [];

const authConfig = {
    expireTime: '1d',
    refreshTokenExpireTime: '1d',
};

router.post('/register', async (req, res) => {
    // validate request
    const { error } = registerValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    // check for unique user
    const emailExists = await User.findOne({ email: req.body.username });
    if (emailExists) { return res.status(400).send('Email already exists'); }

    // hash the password
    const salt = await bcrypt.genSalt(saltLength);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: hashPassword,
        role: 'user',
    });

    // create an access token
    const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: authConfig.expireTime });

    try {
        const savedUser = await user.save();

        // remove password
        delete savedUser._doc.password;

        return res.send({ user: savedUser, accessToken, message: 'User successfully registered' });
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    // validate request
    const { error } = loginValidation(req.body);
    if (error) { return res.status(400).send(error.details[0].message); }

    const user = await User.findOneAndUpdate({ email: req.body.email }, { lastLogin: new Date() }).select('-__v');
    if (!user) { return res.status(400).send({ message: 'Email provided is not a registered account' }); }
    if (user && user.status == 'deleted') { return res.status(400).send({ message: 'Your Account was closed.' }); }
    if (user.role == 'admin') {
        return res.status(400).send({ message: 'User role is not allowed' });
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ message: 'Email or password not found!' });

    // validation passed, create tokens
    const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: authConfig.expireTime });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: authConfig.refreshTokenExpireTime });
    refreshTokens.push(refreshToken);

    // remove password
    delete user._doc.password;

    const userData = user;
    const response = {
        userData,
        accessToken,
        refreshToken,
        status: 'success'
    };
    res.cookie('refreshToken', refreshToken, {
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
        httpOnly: false,
    });
    res.cookie('isLoggedIn', true, {
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
        httpOnly: false,
    });
    return res.send(response);
});

router.post('/admin/login', async (req, res) => {
    // validate request
    const { error } = loginValidation(req.body);
    if (error) { return res.status(400).send(error.details[0].message); }

    const user = await User.findOneAndUpdate({ email: req.body.email }, { lastLogin: new Date() }).select('-__v');
    if (!user) { return res.status(400).send({ message: 'Email provided is not a registered account' }); }
    if (user.role == 'user') {
        return res.status(400).send({ message: 'User role is not allowed' });
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ message: 'Email or password not found!' });

    // validation passed, create tokens
    const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: authConfig.expireTime });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: authConfig.refreshTokenExpireTime });
    refreshTokens.push(refreshToken);

    // remove password
    delete user._doc.password;

    const userData = user;
    const response = {
        userData,
        accessToken,
        status: 'success'
    };
    res.cookie('refreshToken', refreshToken, {
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
        httpOnly: false,
    });
    res.cookie('isLoggedIn', true, {
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
        httpOnly: false,
    });
    return res.send(response);
});

router.get('/refreshToken', async (req, res) => {
    const { refreshToken } = req.cookies;
    try {
        const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // get user
        const userData = await User.findById(_id).select('-__v -password');
        if (!userData) { return res.status(400).send('Refreshing token, user not found'); }

        const newAccessToken = jwt.sign({ _id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: authConfig.expireTime });
        const newRefreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: authConfig.refreshTokenExpireTime });

        //   delete userData.password;
        const response = {
            userData,
            accessToken: newAccessToken,
        };
        res.cookie('refreshToken', newRefreshToken, {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
            httpOnly: false,
        });
        res.cookie('isLoggedIn', true, {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
            httpOnly: false,
        });
        return res.send(response);
    } catch (e) {
        return res.status(401).send(e);
    }
});

module.exports = router;