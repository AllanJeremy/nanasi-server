const AfricasTalking = require('../config/africasTalking');
const Payments = AfricasTalking.PAYMENTS;

// Checkout
module.exports.checkout = (phone, amount, storeId, currencyCode, meta) => {
    currencyCode = currencyCode || 'KES';

    const options = {
        productName: storeId,
        phoneNumber: phone,
        currencyCode: currencyCode,
        amount: amount,
        metadata: meta
    };

    Payments.mobileCheckout(options)
        .then(response => {
            console.log(response);
        }).catch(err => {
            console.log(err);
        });
};

// Withdraw funds ~ Used by merchants
module.exports.withdraw = () => {
    //TODO: Add implementation
};