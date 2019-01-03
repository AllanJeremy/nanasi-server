const express = require('express');
const morgan = require('morgan');

// const authRoutes = require('./api/routes/auth');

const productRoutes = require('./api/routes/products');

// const storeRoutes = require('./api/routes/stores');

// const orderRoutes = require('./api/routes/orders');

// const reviewRoutes = require('./api/routes/reviews');

// const userRoutes = require('./api/routes/users');

// const notificationRoutes = require('./api/routes/notifications');

// const cartRoutes = require('./api/routes/cart');

// const billingRoutes = require('./api/routes/billing');

// const paymentRoutes = require('./api/routes/payments');

// Express app
const app = express();

// Default logging route
app.use(morgan('dev'));

// API routes
app.use('/auth',authRoutes);

app.use('/products',productRoutes);

// app.use('/stores',storeRoutes);

// app.use('/orders',orderRoutes);

// app.use('/reviews',reviewRoutes);

// app.use('/user',userRoutes);

// app.use('/notifications',notificationRoutes);

// app.use('/cart',cartRoutes);

// app.use('/billing',billingRoutes);

// app.use('/payments',paymentRoutes);

// Error handling
app.use((req,res,next)=>{// 404
    const error = new Error("Endpoint not found. Invalid request");
    error.status = 404;

    next(error);
});

// Misc errors
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

// Exports
module.exports = app;