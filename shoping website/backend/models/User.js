// Import the Mongoose library to work with MongoDB
const mongoose = require('mongoose');

// Define a schema for the User model with required fields, validation, and default values
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,  // The firstname field is required
    },
    lastname: {
        type: String,
        required: true,  // The lastname field is required
    },
    email: {
        type: String,
        required: true,  // The email is required and must be a string between 6 and 255 characters
        min: 6,
        max: 255,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,  // The password is required and must be a string between 6 and 1024 characters
        max: 1024,
        min: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],  // The role can be either 'admin' or 'user'
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active',
    },
    avatar: {
        type: String,
        default: '',  // The default value for the avatar field if not provided
    },
    lastLogin: {
        type: Date,  // Stores the date of the last login
    },
}, {
    timestamps: {
        createdAt: 'createdAt',  // Automatically adds createdAt and updatedAt fields with indexes
        updatedAt: 'updatedAt',
    },
});

// Compile the schema into a model which gives us all essential methods and allows CRUD operations
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = { User };
