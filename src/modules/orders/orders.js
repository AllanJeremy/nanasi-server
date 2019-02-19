const Order = require("../../models/orders/order");
const Cart = require("../../modules/cart/cart");

/* 
    ORDER HELPERS
*/
// Get multiple orders by filter
function _getOrdersByFilter(filter, callback) {
    filter = filter || {};


    return Order.find(filter)
        .populate({
            path: "product",
            select: "regularPrice salePrice",
            populate: {
                path: "store",
                select: "name _id"
            }
        })
        .then((err, ordersFound) => {
            if (err) {
                return callback(
                    Api.getError(FeedbackMessages.operationFailed("get orders"), err)
                );
            }

            const orderCount = ordersFound.length;
            const isOk = (orderCount > 0);
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFoundWithCount(ordersFound, "Orders") : FeedbackMessages.itemNotFound("Orders");

            // Calculate the order total
            let orderTotal = 0;
            let productPrice = 0;
            ordersFound.map(order => {
                productPrice = order.product.salePrice || order.product.regularPrice;
                if (productPrice) {
                    orderTotal += (productPrice * order.quantity);
                }

                productPrice = 0;
            });

            return callback(
                Api.getResponse(isOk, message, {
                    count: orderCount,
                    orders: ordersFound,
                    total: orderTotal
                }, statusCode)
            );
        });
}

// Get order by filter
function _getSingleOrderByFilter(filter, callback) {
    //TODO: Check if the order belongs to the user that requested it

    return Order.findOne(filter)
        .populate({
            path: "product",
            select: "regularPrice salePrice",
            populate: {
                path: "store",
                select: "name _id"
            }
        })
        .then((err, orderFound) => {
            if (err) {
                return callback(
                    Api.getError(FeedbackMessages.operationFailed("get order"), err)
                );
            }

            const isOk = orderFound ? true : false;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFound("Order") : FeedbackMessages.itemNotFound("Order");

            let productPrice = orderFound.product.salePrice || orderFound.product.regularPrice;
            let orderTotal = productPrice * orderFound.quantity;

            return callback(
                Api.getResponse(isOk, message, {
                    order: orderFound,
                    total: orderTotal
                }, statusCode)
            );
        });
}

// Update order
function _updateOrder(orderId, updateData, callback) {
    Order.findByIdAndUpdate(orderId, updateData).then((orderFound) => {
        // Check if order was found
        if (orderFound) {
            // No errors ~ Updated the order
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`order`), {
                    id: orderId,
                })
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Order`), null, 404)
            );
        }
    }).catch((err) => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`update order`), err)
        );
    });
}

/* 
    EXPORTS
*/
// Create order
module.exports.createOrder = (cartId, callback) => {
    // If cart item found is a completed cart, don"t return it. Means order has already been created for it
    Cart.find({
            _id: cartId,
            orderIsCompleted: false
        }).then(cartItemFound => {
            // Cart items not found ~ Do not create order
            if (!cartItemFound) {
                return callback(
                    Api.getResponse(false, FeedbackMessages.itemNotFound(`Cart`), null, 404)
                );
            }

            let productsToAdd = cartItemFound.items;
            const cartProductsCount = productsToAdd.length; //Number of products in this product

            // Products not found in the cart provided
            if (cartProductsCount < 1) {
                return callback(
                    Api.getResponse(false, FeedbackMessages.itemNotFound(`Products in cart`), null, 404)
                );
            }

            // Add userId to order data ~ Each order will have the appropriate userId now
            productsToAdd = productsToAdd.map((product) => {
                product.user = cartItemFound.user;
                return product;
            });

            // Products found ~ Create order
            Order.collection.insertMany(productsToAdd)
                .then(createdOrder => {
                    return callback(
                        Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully("Order"), createdOrder, 201)
                    );
                })
                .catch((err) => {
                    return callback(
                        Api.getError(FeedbackMessages.operationFailed(`create order`), err)
                    );
                });
        })
        .catch((err) => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed(`find cart items`), err)
            );
        });
};

// View buyer orders 
module.exports.getBuyerOrders = (buyerId, callback) => {
    return _getOrdersByFilter({
        userId: buyerId
    }, callback);
};

// View store orders ~ Get relationships
module.exports.getStoreOrders = (storeId, callback) => {
    return _getOrdersByFilter({
        "product.store.id": storeId,
        isFulfilled: false
    }, callback);
};

// View store orders ~ Get relationships
module.exports.getStoreSales = (storeId, callback) => {
    return _getOrdersByFilter({
        "product.store.id": storeId,
        isFulfilled: true
    }, callback);
};

module.exports.getProductOrders = (productId, callback) => {
    return _getOrdersByFilter({
        "product.id": productId
    }, callback);
};

// View single order 
module.exports.getOrderById = (orderId, callback) => {
    return _getSingleOrderByFilter({
        _id: orderId
    }, callback);
};

// Update order
module.exports.updateOrder = (orderId, updateData, callback) => {
    return _updateOrder(orderId, updateData, callback);
};

// Fulfil order
module.exports.fulfilOrder = (orderId, callback) => {
    return _updateOrder(orderId, {
        isFulfilled: true
    }, callback);
};

// Decline order
module.exports.declineOrder = (orderId, reason, callback) => {
    return _updateOrder(orderId, {
        isAccepted: false,
        "isAccepted.reason": reason
    }, callback);
};

// Cancel order
module.exports.cancelOrder = (orderId, callback) => {
    return _updateOrder(orderId, {
        isCancelled: true
    }, callback);
};