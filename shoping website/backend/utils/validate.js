const Joi = require('joi');

// Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
