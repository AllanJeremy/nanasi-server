// Models
const Store = require('../../models/store');

// Lang files
const FeedbackMessages = require('../../lang/feedbackMessages');

// Libraries
const Api = require('../../lib/api');

/* 
    HELPERS
*/
// Get multiple stores by filter
function _getStoresByFilter(filter, callback) {
    filter = filter || {};
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
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get stores'))
            );
        }

        const isOk = storeFound ? true : false;
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFound('Store') : FeedbackMessages.itemNotFound('Store');

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
//TODO: Create store
module.exports.createStore = (storeData, callback) => {
    const newStore = new Store(storeData);

    return newStore.save().then(createdStore => {
        return callback(
            Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully('Store'), createdStore)
        );
    }).catch(err => {
        const message = FeedbackMessages.operationFailed(`create store\nError message: ${err.message}`);
        return callback(
            Api.getError(message, err)
        );
    });
};

// Get all stores
module.exports.getStores = (filter, callback) => {
    return _getStoresByFilter(filter, callback);
};

// Get stores by merchantId
module.exports.getMerchantStores = (merchantId, callback) => {
    return _getStoresByFilter({
        merchantId: merchantId
    }, callback);
};

// Get store by storeId
module.exports.getStoreById = (storeId, callback) => {
    return _getSingleStoreByFilter({
        _id: storeId
    }, callback);
};

//TODO: Update store
module.exports.updateStore = (storeId, callback) => {

    Store.findOne({
        _id: storeId
    }, (err, storeFound) => {

    });
};

//TODO: Delete store
module.exports.deleteStore = (storeId, callback) => {
    Store.findOne({
        _id: storeId
    }, (err, storeFound) => {

    });
};