const cart = require('../cart/cart'); // Cart module
const user = require('../users/users'); // User module

const PaymentLib = require('../../lib/payment'); // Payment library
const Api = require('../../lib/api');
const FeedbackMessages = require('../../lang/feedbackMessages');

// Checkout
module.exports.buyerCheckout = (cartId, callback) => {
    cart.getCartTotal(cartId, (cartResponse) => {
        // Something went wrong ~ we could not get the cart total
        if (!cartResponse.ok || !cartResponse.data.total) {
            return callback(cartResponse);
        }

        // Successfully retrieved cart total
        const cartTotal = cartResponse.data.total;
        const userId = cartResponse.data.cart.userId;

        // Try getting the user before trying to make the payment
        user.getUserById(userId, (userResponse) => {
            // User could not be retrieved
            if (!userResponse.ok) {
                return callback(userResponse);
            }

            const userPhone = userResponse.data.user.phone;
            if (!userPhone) {
                return callback(
                    Api.getResponse(false, FeedbackMessages.operationFailed(`complete payment. Phone number not found.`), undefined, 400)
                );
            }

            // User found & phone found ~ proceed to make the payment
            PaymentLib.checkout(userPhone, cartTotal, {
                cart: cartResponse.data.cart
            }, null, (err, response) => {
                if (err) {
                    return callback(
                        Api.getError(FeedbackMessages.operationFailed(`Checkout failed`), err)
                    );
                }

                // Checkout was successful
                return callback(
                    Api.getResponse(true, FeedbackMessages.operationSucceeded(`completed checkout.`), {
                        total: cartTotal,
                        userId: userId
                    })
                );
            });
        });
    });
};