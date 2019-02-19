// Generic ownership authorization failed message ~ Used by the rest
function _entityDoesNotBelongToUser(entityName, userType) {
    const message = `Ownership authorization failed, ${entityName} does not belong to ${userType} provided and therefore is not authorized to access it.`;

    //TODO: Possibly translate
    return message;
}

module.exports.storeDoesNotBelongToMerchant = () => {
    return _entityDoesNotBelongToUser("store", "merchant");
};

module.exports.productDoesNotBelongToMerchant = () => {
    return _entityDoesNotBelongToUser("product", "merchant");
};

module.exports.productVariantDoesNotBelongToMerchant = () => {
    return _entityDoesNotBelongToUser("product variant", "merchant");
};

module.exports.orderDoesNotBelongToMerchant = () => {
    return _entityDoesNotBelongToUser("order", "merchant");
};

module.exports.cartDoesNotBelongToBuyer = () => {
    return _entityDoesNotBelongToUser("cart", "buyer");
};

module.exports.orderDoesNotBelongToBuyer = () => {
    return _entityDoesNotBelongToUser("order", "buyer");
};

module.exports.reviewDoesNotBelongToUser = () => {
    return _entityDoesNotBelongToUser("review", "user");
};

module.exports.reviewReplyDoesNotBelongToUser = () => {
    return _entityDoesNotBelongToUser("review reply", "user");
};

module.exports.accountDoesNotBelongToUser = () => {
    return _entityDoesNotBelongToUser("account", "user");
};

module.exports.billingInfoDoesNotBelongToUser = () => {
    return _entityDoesNotBelongToUser("billing information", "user");
};

module.exports.serverError = (errorMessage) => {
    const message = `A server error occured while trying to verify ownership:
    ${errorMessage}`;

    return message;
};