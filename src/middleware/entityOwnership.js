const Api = require("../lib/api");
const OwnershipMessages = require("../lang/ownershipMessages");

const Store = require("../models/store");
const Product = require("../models/products/product");
const ProductVariant = require("../models/products/variant");
const Order = require("../models/orders/order");
const Cart = require("../models/cart");
const Review = require("../models/reviews/review");
const ReviewReply = require("../models/reviews/reply");
const Notification = require("../models/notification");


// Returns a JSON response - used when ownership authorization failed, takes the request response as the first parameter, along with a message
function _sendOwnershipAuthFailedResponse(res, message) {
    const statusCode = 401; //401 - Unauthorized status code

    return res.status(statusCode).json(
        Api.getResponse(false, message, null, statusCode)
    );
}

// Server error while trying to get ownership
function _serverErrorInOwnershipAuth(res, err) {
    return res.status(500).json(Api.getError(OwnershipMessages.serverError(err.message), err));
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
    }).catch((err) => {
        return _serverErrorInOwnershipAuth(res, err);
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
        path: "store",
        select: "merchant"
    }).then((variantFound) => {
        if (!variantFound) {
            return _sendOwnershipAuthFailedResponse(res, OwnershipMessages.productDoesNotBelongToMerchant());
        }

        // Product belongs to merchant ~ we can move to next middleware
        next();
    }).catch((err) => {
        return _serverErrorInOwnershipAuth(res, err);
    });
};

// Product variant belongs to merchant
module.exports.productVariantBelongsToMerchant = (req, res, next) => {
    const merchantId = req.userData.id;
    const variantId = req.params.variantId;

    ProductVariant.find({
        _id: variantId,
        "product.store.merchant": merchantId
    }).populate({
        path: "product",
        select: {
            path: "store",
            select: "merchant"
        }
    }).then((variantFound) => {
        if (!variantFound) {
            return _sendOwnershipAuthFailedResponse(res, OwnershipMessages.productVariantDoesNotBelongToMerchant());
        }

        // Store belongs to merchant ~ we can move to next middleware
        next();
    }).catch((err) => {
        return _serverErrorInOwnershipAuth(res, err);
    });
};

module.exports.orderBelongsToMerchant = (req, res, next) => {
    const merchantId = req.userData.id;
    const orderId = req.params.orderId || req.body.userId;

    Order.find({
        _id: orderId,
        "product.store.merchant": merchantId
    }).populate({
        path: "product",
        select: {
            path: "store",
            select: "merchant"
        }
    }).then((orderFound) => {
        if (!orderFound) {
            return _sendOwnershipAuthFailedResponse(res, OwnershipMessages.orderDoesNotBelongToMerchant());
        }

        // Store belongs to merchant ~ we can move to next middleware
        next();
    }).catch((err) => {
        return _serverErrorInOwnershipAuth(res, err);
    });
};
/* 
    BUYER OWNERSHIP
*/
// Cart belongs to buyer
module.exports.cartBelongsToBuyer = (req, res, next) => { //TOOD: Add implementation
    const buyerId = req.userData.id;
    const cartId = req.params.cartId;

    console.log(`Buyer id: ${buyerId} and Cart id: ${cartId}`);
    next();
};

// Cart item belongs to buyer
module.exports.cartItemBelongsToBuyer = (req, res, next) => { //TODO: Add implementation
    const buyerId = req.userData.id;
    const cartItemId = req.params.cartItemId;

    console.log(`Buyer id: ${buyerId} and Cart item id: ${cartItemId}`);
    next();
};

// Order belongs to buyer
module.exports.orderBelongsToBuyer = (req, res, next) => {
    const buyerId = req.userData.id;
    const orderId = req.params.orderId;

    Order.find({
        _id: orderId,
        user: buyerId
    }).then((orderFound) => {
        if (!orderFound) {
            return _sendOwnershipAuthFailedResponse(res, OwnershipMessages.orderDoesNotBelongToBuyer());
        }

        // Store belongs to merchant ~ we can move to next middleware
        next();
    }).catch((err) => {
        return _serverErrorInOwnershipAuth(res, err);
    });
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

// Notification belongs to user
module.exports.notificationBelongsToUser = (req, res, next) => {
    const userId = req.userData.id;
    const notificationId = req.params.notificationId;

    Notification.find({
        _id: notificationId,
        user: userId
    }).then((notificationFound) => {
        if (!notificationFound) {
            return _sendOwnershipAuthFailedResponse(res, OwnershipMessages.notificationDoesNotBelongToUser());
        }

        // Store belongs to merchant ~ we can move to next middleware
        next();
    }).catch((err) => {
        return _serverErrorInOwnershipAuth(res, err);
    });
};