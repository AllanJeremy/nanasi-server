const Store = require('../../models/store');
const FeedbackMessages = require('../../lang/feedbackMessages');

/* 
    HELPERS
*/
// Get multiple stores by filter
function _getStoresByFilter(filter, callback) {
    return Store.find(filter, (err, storesFound) => {
        if (err) {
            return callback(Api.getError(FeedbackMessages.operationFailed('get stores')));
        }

        const storeCount = storesFound.length;
        const isOk = (storeCount > 0);
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(storesFound, 'Stores') : FeedbackMessages.itemNotFound('Store');

        return callback(
            Api.getResponse(isOk, message, {
                count: storeCount,
                stores: storesFound
            }, statusCode)
        );
    });
}

// Get store by filter
function _getSingleStoreByFilter(filter, callback) {
    return Store.findOne(filter, (err, storeFound) => {
        if (err) {
            return Api.getError(FeedbackMessages.operationFailed('get stores'));
        }

        const isOk = storeFound ? true : false;
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(storeFound, 'Store') : FeedbackMessages.itemNotFound('Store');

        return callback(
            Api.getResponse(isOk, message, {
                store: storeFound
            }, statusCode)
        );
    });
}

/* 
    EXPORTS
*/
// Create store

// Get all stores

// Get stores by merchantId

// Get store by id

// Get store by storeId