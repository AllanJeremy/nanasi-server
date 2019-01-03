// Modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./api/routes/auth');

const productRoutes = require('./api/routes/products');

const storeRoutes = require('./api/routes/stores');

const orderRoutes = require('./api/routes/orders');

const reviewRoutes = require('./api/routes/reviews');

const userRoutes = require('./api/routes/users');

const notificationRoutes = require('./api/routes/notifications');

const cartRoutes = require('./api/routes/cart');

// const billingRoutes = require('./api/routes/billing');

// const paymentRoutes = require('./api/routes/payments');

// Connect to the database
mongoose.connect('mongodb+srv://blue-dwarf:' + process.env.MONGO_ATLAS_PASSWORD + '@nanasi-v6ykk.mongodb.net/test?retryWrites=true');

// Check for errors and log database connection status
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>console.log('Database successfully connected'))

// Create an express app
const app = express();

// Default middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Prevent CORS
app.use((req, res, next) => {
    //TODO: Limit this to Nanasi
    res.header('Access-Control-Allow-Origin', '*');

    res.header('Access-Control-Allow-Headers', 'Origin, X-RequestedWith, Content-Type, Accept, Authorization');

    // Setup accepted API verbs
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
        return res.status(200).json({});
    }

    // Hand over functionality to next middleware if we are not returning anything
    next();
});

// API routes
/* 
    Api endpoints can have various levels of access
    //* Globally accessible
    //* Logged in user accessible
    //* Non-Logged in user accessible
    //* Merchant accessible
    //* Buyer accessible
    //* Admin accessible
*/

app.use('/auth', authRoutes);

app.use('/products', productRoutes);

app.use('/stores', storeRoutes);

app.use('/orders', orderRoutes);

app.use('/reviews', reviewRoutes);

app.use('/user', userRoutes);

app.use('/notifications', notificationRoutes);

app.use('/cart', cartRoutes);

// app.use('/billing',billingRoutes);

// app.use('/payments',paymentRoutes);

// Error handling
app.use((req, res, next) => { // 404
    const error = new Error("Endpoint not found. Invalid request");
    error.status = 404;

    next(error);
});

// Misc errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

// Exports
module.exports = app;