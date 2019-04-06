module.exports.titleOrderReceived = () => {
    const message = "New order received";

    return message;
};

module.exports.orderReceivedMerchantNotification = (productName, productQuantity) => {
    const message = `An order for ${productQuantity} units of ${productName} has been placed`;

    //TODO: Probably translate
    return message;
};