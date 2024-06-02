const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment configuration from .env file into process.env
dotenv.config();

// Initialize the Express application
const app = express();

// Define the port number on which the server will listen for requests
const PORT = process.env.PORT || 3005;

// Connect to the MongoDB database using the connection string provided in environment variables
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        // Log the successful database connection message
        console.log('👓 Connected to DB')
    })
    .catch((error) => {
        // Log any errors during database connection
        console.log('Connection Error => : ', error.message)
    });

// Import routes
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/orders');
const favoritesRoute = require('./routes/favorites');

// Use Body-Parser middleware to parse JSON request bodies with specific options
app.use(bodyParser.json({ limit: '50mb', extended: true }));
// Serve static assets (e.g., images, CSS, JavaScript) from the "public" directory
app.use(express.static(path.join(__dirname, '/public')));

// Set up CORS middleware configuration to handle cross-origin requests
app.use(
    cors({
        credentials: true, // Allow sending of cookies and HTTP authentication information with requests
        origin: [
            'http://localhost:9000' // List of allowed origin(s) for accessing the resources
        ],
    }),
);

// Use built-in middleware for parsing JSON
app.use(express.json());
// Use Cookie-Parser middleware to parse the client's cookies
app.use(cookieParser());

// Define the root route of the server which sends back a response message
app.get('/', (req, res) => {
    res.send('Shop API Server is running!');
});

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/products', productsRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/favorites', favoritesRoute);

// Start the server and begin listening on the specified port
app.listen(PORT, () => console.log(`🛺  API Server UP and Running at ${process.env.SERVER_URL}`));