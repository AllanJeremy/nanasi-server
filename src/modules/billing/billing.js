const BillingInfo = require("../../models/billingInfo");

// Libraries
const Api = require("../../lib/api");
const FeedbackMessages = require("../../lang/feedbackMessages");

/* 
    HELPERS
*/
// Add billing information
function _addBillingInfo(userId, billingInfo, callback) {
    billingInfo = billingInfo || {};
    billingInfo.user = userId;

    const billingInfoInstance = new BillingInfo(billingInfo);

    billingInfoInstance.save().then(billingInfoAdded => {
        return callback(
            Api.getResponse(true, FeedbackMessages.operationSucceeded("added billing information"), billingInfoAdded, 201)
        );
    }).catch((err) => {
        return callback(
            Api.getError(err.message, err)
        );
    });
}

// Get multiple billing information
function _getBillingInfo(filter, callback) {
    BillingInfo.find(filter)
        .then((billingInfoFound) => {
            const billingInfoCount = billingInfoFound.length;
            const isOk = (billingInfoCount > 0);
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFoundWithCount(billingInfoFound, "Billing information") : FeedbackMessages.itemNotFound("Billing information");

            return callback(
                Api.getResponse(isOk, message, billingInfoFound, statusCode)
            );

        })
        .catch((err) => {
            return callback(
                Api.getError(err.message, err)
            );
        });
}

// Get single billing information
function _getSingleBillingInfo(filter, callback) {
    BillingInfo.findOne(filter)
        .then(billingInfoFound => {
            if (!billingInfoFound) {
                return callback(
                    Api.getResponse(false, FeedbackMessages.itemNotFound("Billing information"), null, 404)
                );
            }

            // Billing information found, return it to the user
            return callback(
                Api.getResponse(true, FeedbackMessages.itemsFound("Billing information"), billingInfoFound)
            );
        })
        .catch((err) => {
            return callback(
                Api.getError(err.message, err)
            );
        });
}

// Update billing information
function _updateBillingInfo(filter, updateData, callback) {
    BillingInfo.findOneAndUpdate(filter, updateData)
        .then(billingInfoFound => {
            if (!billingInfoFound) {
                return callback(
                    Api.getResponse(false, FeedbackMessages.itemNotFound("Billing information"), null, 404)
                );
            }
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully("billing information"), billingInfoFound)
            );
        })
        .catch((err) => {
            return callback(
                Api.getError(err.message, err)
            );
        });
}

// Delete billing information
function _deleteBillingInfo(filter, callback) {
    BillingInfo.findOneAndDelete(filter)
        .then(billingInfoDeleted => {
            return callback(
                Api.getResponse(true, FeedbackMessages.itemDeletedSuccessfully("Billing information"), billingInfoDeleted)
            );
        })
        .catch((err) => {
            return callback(
                Api.getError(err.message, err)
            );
        });
}

/* 
    EXPORTS
*/
// Add billing information
module.exports.addBillingInfo = (userId, billingInfo, callback) => {
    _addBillingInfo(userId, billingInfo, callback);
};

// Update billing information
module.exports.updateBillingInfo = (billingId, updateData, callback) => {
    _updateBillingInfo({
        _id: billingId
    }, updateData, callback);
};

// Get user billing information
module.exports.getUserBillingInfo = (userId, callback) => {
    _getBillingInfo({
        user: userId
    }, callback);
};

// Get single billing information
module.exports.getSingleBillingInfo = (billingId, callback) => {
    _getSingleBillingInfo({
        _id: billingId
    }, callback);
};

// Delete billing information
module.exports.deleteBillingInfo = (billingId, callback) => {
    _deleteBillingInfo({
        _id: billingId
    }, callback);
};