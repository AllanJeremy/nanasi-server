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

/* 
    BUYER OWNERSHIP
*/
//TODO: Cart item belongs to buyer

/* 
    GENERAL OWNERSHIP
*/
//TODO: Review belongs to logged in user

//TODO: Review reply belongs to logged in user

// Account belongs to user ~ For when we are updating the account
module.exports.accountBelongsToUser = (req, res, next) => {
    const userId = req.userData.id;

    next();
};