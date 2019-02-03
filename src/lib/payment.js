const {
    AfricasTalking,
    APP_PRODUCT_NAME
} = require('../config/africasTalking');
const Payments = AfricasTalking.PAYMENTS;

// Checkout
module.exports.checkout = (phone, amount, meta, currencyCode, callback) => {
    currencyCode = currencyCode || 'KES';

    const options = {
        productName: APP_PRODUCT_NAME,
        phoneNumber: phone,
        providerChannel: 'Athena', //TODO: Remove in production
        currencyCode: currencyCode,
        amount: amount,
        metadata: meta
    };

    Payments.mobileCheckout(options)
        .then(response => {
            console.log(response)
            callback(null, response);
        }).catch(err => {
            console.log(err);
            callback(err);
        });
};

// Withdraw funds ~ Used by merchants
module.exports.withdraw = () => {
    //TODO: Add implementation
};