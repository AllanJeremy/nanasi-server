const Api = require("../../lib/api");
const FeedbackMessages = require("../../lang/feedbackMessages");

const Product = require("../../models/products/product");
const Order = require("../../models/orders/order");
const Cart = require("../../models/cart");

const NotificationConfig = require("../../config/notifications");
const notification = require("../../modules/notifications/notifications");

const NotificationMessages = require("../../lang/notificationMessages");
const NanasiConfig = require("../../config/nanasi");

/* 
    ORDER HELPERS
*/
function _getOrderDetails(ordersFound){
    let orderTotal = 0;
    let profit = 0;

    let finalOrders = ordersFound.map(order => {
        if (!order.product) return;

        let productPrice = order.product.salePrice || order.product.regularPrice;
        if (productPrice) {// Calculate the order total
            orderTotal += productPrice * order.quantity;
        }

        let productCost = order.product.cost;
        if(productCost){
            profit += _getProductProfit(productPrice,productCost,order.quantity);
        }

        productPrice = 0;
        return order.toObject();
    }).filter(val => val);

    // Set the values on the parent object
    finalOrders.profit = profit;
    finalOrders.total = orderTotal;

    return finalOrders;

}

// Get orders belonging to a particular store
//! Extremely inefficient, should be able to filter orders through single query
function _filterStoreOrders(ordersFound,storeId){
    return ordersFound.filter((order)=>{
        let product = order.product;
        if(!order.product) return false;
        if(!product.store) return false;

        let orderStoreId = order.product.store._id || order.product.store;
        orderStoreId = orderStoreId.toString();
        return orderStoreId === storeId;
    });
}

// Get sales belonging to a particular store
function _getStoreOrders(storeId,callback,onlyFulfilled){//? Highly inefficient ~ filtering should happen in database not server
    onlyFulfilled = (onlyFulfilled!== false) ? true : false;
    let filter = {
        // product: "5c5a1795fd8e01000538a5d4",
    };

    if(onlyFulfilled){
        filter.isFulfilled = true;
    }

    let productPopulate = {
        path: "product",
        select: "name cost regularPrice salePrice store user"
    };
    let userPopulate = {
        path: "user",
        select: "firstName lastName"
    };

    Order.find(filter)
    .populate(productPopulate)
    .populate(userPopulate)
    .then((ordersFound)=>{
        if (ordersFound.length < 1) {
            return callback(
                Api.getError(
                    FeedbackMessages.operationFailed("get orders. No orders found"),
                    ordersFound,
                    404
                )
            );
        }
        ordersFound = _filterStoreOrders(ordersFound,storeId);
        let finalOrders = _getOrderDetails(ordersFound);
        
        callback(finalOrders);
    }).catch(err => {
        return callback(Api.getError(err.message, err));
    });
}

// Get sales belonging to a certain store
function _getStoreSales(storeId,callback){
    _getStoreOrders(storeId,(finalOrders)=>{
        const isOk = finalOrders.length > 0;
        const statusCode = isOk ? 200 : 404;
        const message = isOk ?
            FeedbackMessages.itemsFoundWithCount(finalOrders, "Sales") :
            FeedbackMessages.itemNotFound("Sales");

        const responseData = {
            count: finalOrders.length,
            total: finalOrders.total,
            profit: finalOrders.profit
        };
            
        const apiResponse = Api.getResponse(isOk,message,responseData,statusCode);
        return callback(apiResponse);
    });
}

// Get multiple orders by filter
function _getOrdersByFilter(filter, callback) {
    filter = filter || {};

    return (
        Order.find(filter)
        .populate({
            path: "product",
            select: "id name images regularPrice salePrice",
            populate: {
                path: "store",
                select: "name id"
            }
        })
        .then(ordersFound => {
            if (ordersFound.length < 1) {
                return callback(
                    Api.getError(
                        FeedbackMessages.operationFailed("get orders. No orders found"),
                        ordersFound,
                        404
                    )
                );
            }

            let finalOrders = _getOrderDetails(ordersFound);

            // Response variables
            const orderCount = finalOrders.length;
            const isOk = orderCount > 0;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ?
                FeedbackMessages.itemsFoundWithCount(finalOrders, "Orders") :
                FeedbackMessages.itemNotFound("Orders");

            let responseData = {
                count: orderCount,
                orders: finalOrders,
                total: finalOrders.total
            };

            return callback(
                Api.getResponse(isOk, message, responseData, statusCode)
            );
        })
        .catch(err => {
            return callback(Api.getError(err.message, err));
        })
    );
}

// Get order by filter
function _getSingleOrderByFilter(filter, callback) {
    //TODO: Check if the order belongs to the user that requested it
    const productPopulate = {
        path: "product",
        select: "name images regularPrice salePrice user"
    };
    const userPopulate = {
        path: "user",
        select: "firstName lastName phone email"
    };
    const storePopulate = {
        path: "store",
        select: "name id"
    };

    return (
        Order.findOne(filter)
        .populate(productPopulate)
        .populate(storePopulate)
        .populate(userPopulate)
        .then((orderFound) => {
            if (!orderFound) {
                return callback(
                    Api.getError(FeedbackMessages.operationFailed("get order"), err)
                );
            }

            const isOk = orderFound ? true : false;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ?
                FeedbackMessages.itemsFound("Order") :
                FeedbackMessages.itemNotFound("Order");

            let productPrice =
                orderFound.product.salePrice || orderFound.product.regularPrice;
            let orderTotal = productPrice * orderFound.quantity;

            return callback(
                Api.getResponse(
                    isOk,
                    message, {
                        order: orderFound,
                        total: orderTotal
                    },
                    statusCode
                )
            );
        })
    );
}

function _getProductProfit(price,cost,quantity){
    quantity = quantity || 1;
    let total = price * quantity;
    let totalCost = cost * quantity;
    let nanasiCut = total * (NanasiConfig.rates.NANASI_PERCENTAGE/100);
    let profit = total - (nanasiCut + totalCost);

    return profit;
}

// Update order
function _updateOrder(orderId, updateData, callback) {
    Order.findByIdAndUpdate(orderId, updateData)
        .then(orderFound => {
            // Check if order was found
            if (orderFound) {
                // No errors ~ Updated the order
                return callback(
                    Api.getResponse(
                        true,
                        FeedbackMessages.itemUpdatedSuccessfully("order"), {
                            id: orderId
                        }
                    )
                );
            } else {
                return callback(
                    Api.getError(FeedbackMessages.itemNotFound("Order"), null, 404)
                );
            }
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed("update order"), err)
            );
        });
}

// Send order received notification to merchant
function sendOrderReceivedNotification(
    merchantId,
    productName,
    productQuantity
) {
    const notificationData = {
        title: NotificationMessages.titleOrderReceived,
        message: NotificationMessages.orderReceivedMerchantNotification,
        type: NotificationConfig.IMPORTANT
    };

    return notification.sendUserNotification(merchantId, notificationData);
}

// Get order data
function getOrderData(userId, deliveryAddress, productsToAdd) {
    //TODO: Get delivery address
    // Add userId to order data ~ Each order will have the appropriate userId now
    let orderData = productsToAdd.map(cartItem => {
        cartItem.user = userId;

        //! Send notification to the buyers
        //TODO: Find way to populate productsToAdd
        // sendOrderReceivedNotification(cartItem.store.merchant, cartItem.name, cartItem.quantity); //*TODO: Test

        // Order data ~
        return {
            user: userId,
            product: cartItem.product,
            quantity: cartItem.quantity,
            deliveryAddress: deliveryAddress
        };
    });

    return orderData;
}


// Adds multiple orders
function _addOrder(orderData, callback) {
    console.log(`Adding order data: ${JSON.stringify(orderData)}`);
    // If no order data was found ~ don't bother running query
    if (orderData.length === 0) {
        //? Optimization
        return callback(
            Api.getResponse(
                false,
                FeedbackMessages.itemNotFound("order data"),
                null,
                404
            )
        );
    }

    // Order data found ~ create order
    Order.insertMany(orderData)
        .then(ordersAdded => {
            return callback(
                Api.getResponse(
                    true,
                    FeedbackMessages.itemCreatedSuccessfully("Order"),
                    ordersAdded,
                    201
                )
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed("create order"), err)
            );
        });
}

/* 
    EXPORTS
*/
// Create order
module.exports.createOrder = (userId, deliveryAddress, callback) => {
    // const orderPopulate = {
    //     path: "items",
    //     select: "product name store images",
    //     populate: {
    //         path: "store",
    //         select: "name"
    //     }
    // };

    console.info("Creating order....");
    // If cart item found is a completed cart, don"t return it. Means order has already been created for it
    Cart.findOne({
            user: userId,
            orderIsCompleted: false
        })
        // .populate(orderPopulate)
        .then(cartItemFound => {
            console.info(`Cart items found`);
            console.debug(cartItemFound);
            console.info(`---`);
            // Cart items not found ~ Do not create order
            if (!cartItemFound || !cartItemFound.items) {
                return callback(
                    Api.getResponse(
                        false,
                        FeedbackMessages.itemNotFound("Cart"),
                        null,
                        404
                    )
                );
            }

            let productsToAdd = cartItemFound.items || [];
            // Products not found in the cart provided
            if (productsToAdd.length === 0 || !productsToAdd) {
                return callback(
                    Api.getResponse(
                        false,
                        FeedbackMessages.itemNotFound("Products in cart"),
                        null,
                        404
                    )
                );
            }

            const orderData = getOrderData(userId, deliveryAddress, productsToAdd);
            return _addOrder(orderData, callback);
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed("create order"), err)
            );
        });
};

// View buyer orders
module.exports.getBuyerOrders = (buyerId, callback) => {
    return _getOrdersByFilter({
            user: buyerId
        },
        callback
    );
};

// View store orders ~ Get relationships
module.exports.getStoreOrders = (storeId, callback) => {
    return _getStoreOrders(storeId,(finalOrders)=>{
        const orderCount = finalOrders.length;
        const isOk = orderCount > 0;
        const statusCode = isOk ? 200 : 404;
        const message = isOk ?
            FeedbackMessages.itemsFoundWithCount(finalOrders, "Orders") :
            FeedbackMessages.itemNotFound("Orders");

        const responseData = {
            count: orderCount,
            orders: finalOrders
        };

        const apiResponse = Api.getResponse(isOk,message,responseData,statusCode);
        return callback(apiResponse);
    },false);
};

// View store orders ~ Get relationships
//? Remove merchantId ~ using as a hack to fetch all merchant orders then filter by store
module.exports.getStoreSummary = (storeId, callback) => {
    return _getStoreSales(storeId,callback);
};

module.exports.getProductOrders = (productId, callback) => {
    return _getOrdersByFilter({
            product:productId
        },
        callback
    );
};

// View single order
module.exports.getOrderById = (orderId, callback) => {
    return _getSingleOrderByFilter({
            _id: orderId
        },
        callback
    );
};

// Update order
module.exports.updateOrder = (orderId, updateData, callback) => {
    return _updateOrder(orderId, updateData, callback);
};

// Fulfil order
module.exports.fulfilOrder = (orderId, callback) => {
    return _updateOrder(
        orderId, {
            isFulfilled: true
        },
        callback
    );
};

// Decline order
module.exports.declineOrder = (orderId, reason, callback) => {
    return _updateOrder(
        orderId, {
            isAccepted: false,
            "isAccepted.reason": reason
        },
        callback
    );
};

// Cancel order
module.exports.cancelOrder = (orderId, callback) => {
    return _updateOrder(
        orderId, {
            isCancelled: true
        },
        callback
    );
};