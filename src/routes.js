const express = require("express");
const router = express.Router();

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const storeRoutes = require("./routes/stores");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const billingRoutes = require("./routes/billing");
const notificationRoutes = require("./routes/notifications");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payments");
// const billingRoutes = require("./routes/billing");

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

router.use("/auth", authRoutes);

router.use("/products", productRoutes);

router.use("/categories", categoryRoutes);

router.use("/stores", storeRoutes);

router.use("/orders", orderRoutes);

router.use("/reviews", reviewRoutes);

router.use("/users", userRoutes);

router.use("/billing", billingRoutes);

router.use("/notifications", notificationRoutes);

router.use("/cart", cartRoutes);

// router.use("/billing",billingRoutes);

router.use("/payments", paymentRoutes);

//Exports
module.exports = router;
