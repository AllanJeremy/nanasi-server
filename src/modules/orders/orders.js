const Order = require('../../models/orders/orders');

/* 
    ORDER HELPERS
*/
// Get multiple orders by filter
function _getOrdersByFilter(filter, callback) {
    filter = filter || {};
    //TODO: Check if the orders belongs to the user that requested it: Possibly pass userId as part of filter

    return Order.find(filter)
        .populate({
            path: 'product',
            populate: {
                path: 'store',
                select: 'name _id'
            }
        })
        .then((err, ordersFound) => {
            if (err) {
                return callback(
                    Api.getError(FeedbackMessages.operationFailed('get orders'), err)
                );
            }

            const orderCount = ordersFound.length;
            const isOk = (orderCount > 0);
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFoundWithCount(ordersFound, 'Orders') : FeedbackMessages.itemNotFound('Orders');

            return callback(
                Api.getResponse(isOk, message, {
                    count: orderCount,
                    orders: ordersFound
                }, statusCode)
            );
        });
}

// Get order by filter
function _getSingleOrderByFilter(filter, callback) {
    //TODO: Check if the order belongs to the user that requested it

    return Order.findOne(filter)
        .populate({
            path: 'product',
            populate: {
                path: 'store',
                select: '_id name'
            }
        })
        .then((err, orderFound) => {
            if (err) {
                return callback(
                    Api.getError(FeedbackMessages.operationFailed('get order'), err)
                );
            }

            const isOk = orderFound ? true : false;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFound('Order') : FeedbackMessages.itemNotFound('Order');

            return callback(
                Api.getResponse(isOk, message, {
                    order: orderFound
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
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`update order`), err)
        );
    });
}

/* 
    EXPORTS
*/
// Create order
module.exports.createOrder = (orderData, callback) => {
    const newOrder = new Order(orderData);

    return newOrder.save().then(createdOrder => {
        return callback(
            Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully('Order'), createdOrder, 201)
        );
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`create order`), err)
        );
    });
};

// View buyer orders 
module.exports.getBuyerOrders = (buyerId, callback) => {
    return _getOrdersByFilter({
        userId: buyerId
    }, callback);
};

//TODO: View store orders ~ Get relationships
module.exports.getStoreOrders = (storeId, callback) => {
    return _getOrdersByFilter({
        "product.store._id": storeId
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