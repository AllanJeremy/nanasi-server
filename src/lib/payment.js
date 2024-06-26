const {
    AfricasTalking,
    PAYMENT_PRODUCTS
} = require("../config/africasTalking");

const Payments = AfricasTalking.PAYMENTS;
const NanasiConfig = require("../config/nanasi");

// Checkout
module.exports.checkout = (phone, amount, meta, currencyCode, callback) => {
    currencyCode = currencyCode || "KES";

    const options = {
        productName: PAYMENT_PRODUCTS.APP,
        phoneNumber: phone,
        providerChannel: "Athena", //TODO: Remove in production
        currencyCode: currencyCode,
        amount: amount,
        metadata: meta
    };

    Payments.mobileCheckout(options)
        .then((response) => {
            console.log(response);
            callback(null, response);
        }).catch((err) => {
            console.error(err);
            callback(err);
        });
};

// Withdraw funds ~ Used by merchants
module.exports.withdraw = () => {
    //TODO: Add implementation
};

// Send nanasi cut & leave balance to merchant account
module.exports.sendNanasiRevenueFromCheckout = (cartItems, callback) => {
    let nanasiRevenue = 0;
    cartItems.map(cartItem => {
        nanasiRevenue = (cartItem.product.regularPrice * cartItem.quantity * NanasiConfig.rates.NANASI_PERCENTAGE);
    });

    // Send Nanasi revenue
    const paymentOptions = {
        productName: APP_PRODUCT_NAME,
        targetProductCode: NANASI_HOLDINGS_PRODUCT_NAME,
        currencyCode: "KES", //TODO: Make this dynamic
        amount: nanasiRevenue,
        metadata: {
            cartItems: cartItems,
            nanasiRevenue: nanasiRevenue
        }
    };
    Payments.walletTransfer(paymentOptions)
        .then((response) => {
            console.log(`Sent Nanasi revenue: ${nanasiRevenue} from ${cartItems}`);
            callback(null, response);
        }).catch((err) => {
            console.error(`Failed to send nanasi revenue`);
            callback(err, null);
        });
};