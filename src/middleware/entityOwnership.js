const Api = require('../lib/api');
const FeedbackMessages = require('../lang/feedbackMessages');

const Store = require('../models/store');
const Product = require('../models/products/product');
const ProductVariant = require('../models/products/variant');

/* 
    MERCHANT OWNERSHIP
*/
// Store belongs to merchant
module.exports.storeBelongsToMerchant = (req, res, next) => {
    const merchantId = req.userData.id;
    const storeId = req.body.store || req.params.storeId;

    console.log(storeId);
    next();
};

// Product belongs to merchant
module.exports.productBelongsToMerchant = (req, res, next) => {
    const merchantId = req.userData.id;
    const productId = req.body.data.product || req.params.productId;

    console.log(`Merchant id: ${merchantId} and Product id: ${productId}`);
    next();
};

// Product variant belongs to merchant
module.exports.productVariantBelongsToMerchant = (req, res, next) => {
    const merchantId = req.userData.id;
    const variantId = req.params.variantId || req.body.data.variant;

    console.log(`Merchant id: ${merchantId} and Variant id: ${variantId}`);
    next();
};

module.exports.orderBelongsToMerchant = (req, res, next) => {
    const merchantId = req.userData.id;
    const orderId = req.params.orderId || req.body.userId;

    console.log(`Checking if order belongs to merchant`);
    next();
};
/* 
    BUYER OWNERSHIP
*/
// Cart belongs to buyer
module.exports.cartBelongsToBuyer = (req, res, next) => {
    const buyerId = req.userData.id;
    const cartId = req.params.cartId || req.body.data.cart;

    console.log(`Merchant id: ${buyerId} and Variant id: ${cartId}`);
    next();
};

// Order belongs to buyer
module.exports.orderBelongsToBuyer = (req, res, next) => {
    const buyerId = req.userData.id;
    const orderId = req.params.orderId || req.body.userId;

    next();
};

/* 
    GENERAL OWNERSHIP
*/
// Review belongs to logged in user
module.exports.reviewBelongsToUser = (req, res, next) => {
    const userId = req.userData.id;
    const reviewId = req.params.reviewId || req.body.data.review;

    console.log(`Merchant id: ${userId} and Variant id: ${reviewId}`);
    next();
};

// Review reply belongs to logged in user
module.exports.reviewReplyBelongsToUser = (req, res, next) => {
    const userId = req.userData.id;
    const reviewReplyId = req.params.reviewReplyId || req.body.data.reviewReply;

    console.log(`Merchant id: ${userId} and Variant id: ${reviewReplyId}`);
    next();
};

// Account belongs to user ~ For when we are updating the account
module.exports.accountBelongsToUser = (req, res, next) => {
    const userId = req.userData.id;

    next();
};

// Billing information belongs to user
module.exports.billingInfoBelongsToUser = (req, res, next) => {
    const userId = req.userData.id;

    next();
};