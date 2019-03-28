const cart = require("../cart/cart"); // Cart module
const user = require("../users/users"); // User module

const {
    AT_RESPONSES
} = require("../../config/africasTalking");

const PaymentLib = require("../../lib/payment"); // Payment library
const Api = require("../../lib/api");
const FeedbackMessages = require("../../lang/feedbackMessages");

// Checkout
module.exports.buyerCheckout = (userId, callback) => {
    cart.getCartTotal(userId, (cartResponse) => {
        // Something went wrong ~ we could not get the cart total
        if (!cartResponse.ok || !cartResponse.data.total) {
            return callback(cartResponse);
        }

        // Successfully retrieved cart total
        const cartTotal = cartResponse.data.total;
        const userId = cartResponse.data.userId;

        console.log(parseFloat(cartTotal));
        // Try getting the user before trying to make the payment
        user.getUserById(userId, (userResponse) => {
            // User could not be retrieved
            if (!userResponse.ok) {
                return callback(userResponse);
            }

            const userPhone = userResponse.data.phone;
            if (!userPhone) {
                return callback(
                    Api.getResponse(false, FeedbackMessages.operationFailed("complete payment. Phone number not found."), null, 400)
                );
            }

            // User found & phone found ~ proceed to make the payment
            PaymentLib.checkout(userPhone, cartTotal, {
                cart: cartResponse.data.cart
            }, null, (err, response) => {
                if (err) {
                    return callback(
                        Api.getError(FeedbackMessages.operationFailed("Checkout failed"), err)
                    );
                }

                // If the checkout failed
                if (response.status !== AT_RESPONSES.PAYMENTS.PENDING_CONFIRMATION) {
                    return callback(
                        Api.getResponse(false, response.description, response, 500)
                    );
                }

                //* Checkout succeeded ~ Clear cart & Send nanasi revenue
                /* cart.clearUserCart(userId, (response) => {
                    if (!response.ok) {
                        return callback(response);
                    }

                    // User cart successfully cleared 
                    //TODO: Re-enable this
                    // Send Nanasi cut & retain merchant cut as the balance
                    PaymentLib.sendNanasiRevenueFromCheckout(cartResponse.data.items, (err, response) => {
                        if (err) {
                            return callback(
                                Api.getError(err, err.message)
                            );
                        }
    
                        // Checkout was successful
                        return callback(
                            Api.getResponse(true, FeedbackMessages.operationSucceeded("completed checkout.", response), {
                                total: cartTotal,
                                userId: userId,
                            })
                        );
                    });
                }); */
            });
        });
    });
};