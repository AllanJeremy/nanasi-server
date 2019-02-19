// Models
const Store = require("../../models/store");

// Lang files
const FeedbackMessages = require("../../lang/feedbackMessages");

// Libraries
const Api = require("../../lib/api");

/* 
    HELPERS
*/
// Get multiple stores by filter
function _getStoresByFilter(filter, callback) {
    filter = filter || {};
    return Store.find(filter).then((storesFound) => {
        const storeCount = storesFound.length;
        const isOk = (storeCount > 0);
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(storesFound, "Stores") : FeedbackMessages.itemNotFound("Stores");

        return callback(
            Api.getResponse(isOk, message, {
                count: storeCount,
                stores: storesFound
            }, statusCode)
        );
    }).catch((err) => {
        return callback(
            Api.getError(err.message, err)
        );
    });
}

// Get store by filter
function _getSingleStoreByFilter(filter, callback) {
    return Store.findOne(filter).then((storeFound) => {
        const isOk = storeFound ? true : false;
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFound("Store") : FeedbackMessages.itemNotFound("Store");

        return callback(
            Api.getResponse(isOk, message, {
                store: storeFound
            }, statusCode)
        );
    }).catch((err) => {
        return callback(
            Api.getError(err.message, err)
        );
    });
}

/* 
    EXPORTS
*/
// Create store
module.exports.createStore = (storeData, callback) => {
    const newStore = new Store(storeData);

    return newStore.save().then(createdStore => {
        return callback(
            Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully("Store"), createdStore)
        );
    }).catch((err) => {
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
        merchant: merchantId
    }, callback);
};

// Get stores by product type
module.exports.getStoresByProductType = (productTypeId, callback) => {
    return _getStoresByFilter({
        productType: productTypeId
    }, callback);
};

// Get store by storeId
module.exports.getStoreById = (storeId, callback) => {
    return _getSingleStoreByFilter({
        _id: storeId
    }, callback);
};

// Update store
module.exports.updateStore = (storeId, updateData, callback) => {
    return Store.findByIdAndUpdate(storeId, updateData).then((storeFound) => {
        // Check if store was found
        if (storeFound) {
            // No errors ~ Updated the store
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`store (${storeFound.name})`), {
                    id: storeId,
                    storeName: storeFound.name
                })
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound("Store"), null, 404)
            );
        }
    }).catch((err) => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed("update store"), err)
        );
    });
};

// Delete store
module.exports.deleteStore = (storeId, callback) => {
    return Store.findByIdAndDelete(storeId).then((storeDeleted) => {
        if (storeDeleted) {
            // No errors ~ Deleted the store
            return callback(
                Api.getResponse(true, FeedbackMessages.itemDeletedSuccessfully("store"), {
                    id: storeId,
                    storeName: storeDeleted.name
                })
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound("Store"), null, 404)
            );
        }
    }).catch((err) => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed("delete store"), err)
        );
    });
};