const Api = require("../lib/api");
const OwnershipMessages = require("../lang/ownershipMessages");

const Store = require("../models/store");
const Product = require("../models/products/product");
const ProductVariant = require("../models/products/variant");

// Returns a JSON response - used when ownership authorization failed, takes the request response as the first parameter, along with a message
function _sendOwnershipAuthFailedResponse(res, message) {
    const statusCode = 401; //401 - Unauthorized status code

    return res.status(statusCode).json(
        Api.getResponse(false, message, undefined, statusCode)
    );
}

// Server error while trying to get ownership
function _serverErrorInOwnershipAuth(err) {
    return Api.getError(OwnershipMessages.serverError(err.message), err);
}

/* 
    MERCHANT OWNERSHIP
*/
// Store belongs to merchant
module.exports.storeBelongsToMerchant = (req, res, next) => {
    const merchantId = req.userData.id;
    const storeId = req.params.storeId;

    Store.find({
        _id: storeId,
        merchant: merchantId
    }).then((storeFound) => {
        if (!storeFound) {
            return _sendOwnershipAuthFailedResponse(res, OwnershipMessages.storeDoesNotBelongToMerchant());
        }

        // Store belongs to merchant ~ we can move to next middleware
        next();
    }).catch(err => {
        return _serverErrorInOwnershipAuth(err);
    });
};

// Product belongs to merchant
module.exports.productBelongsToMerchant = (req, res, next) => {
    const merchantId = req.userData.id;
    const productId = req.params.productId;

    Product.find({
        _id: productId,
        "store.merchant": merchantId
    }).populate({
        path: 'store',
        select: 'merchant'
    }).then((productFound) => {
        if (!productFound) {
            return _sendOwnershipAuthFailedResponse(res, OwnershipMessages.productDoesNotBelongToMerchant());
        }

        // Store belongs to merchant ~ we can move to next middleware
        next();
    }).catch(err => {
        return _serverErrorInOwnershipAuth(err);
    });
};

// Product variant belongs to merchant
module.exports.productVariantBelongsToMerchant = (req, res, next) => {
    const merchantId = req.userData.id;
    const variantId = req.params.variantId;

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
    const cartId = req.params.cartId;

    console.log(`Merchant id: ${buyerId} and Variant id: ${cartId}`);
    next();
};

// Order belongs to buyer
module.exports.orderBelongsToBuyer = (req, res, next) => {
    const buyerId = req.userData.id;
    const orderId = req.params.orderId;

    next();
};

/* 
    GENERAL OWNERSHIP
*/
// Review belongs to logged in user
module.exports.reviewBelongsToUser = (req, res, next) => {
    const userId = req.userData.id;
    const reviewId = req.params.reviewId;

    console.log(`Merchant id: ${userId} and Variant id: ${reviewId}`);
    next();
};

// Review reply belongs to logged in user
module.exports.reviewReplyBelongsToUser = (req, res, next) => {
    const userId = req.userData.id;
    const reviewReplyId = req.params.reviewReplyId;

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