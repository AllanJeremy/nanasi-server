const User = require("../../models/users/user");
const Address = require("../../models/users/address");

const Api = require("../../lib/api");
const FeedbackMessages = require("../../lang/feedbackMessages");

/* 
    HELPERS
*/
// Get multiple users by filter
function _getUsersByFilter(filter, callback) {
    filter = filter || {};
    return User.find(filter, (err, usersFound) => {
        if (err) {
            return callback(
                Api.getError(FeedbackMessages.operationFailed("get users"), err)
            );
        }

        const userCount = usersFound.length;
        const isOk = (userCount > 0);
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(usersFound, "Users") : FeedbackMessages.itemNotFound("Users");

        return callback(
            Api.getResponse(isOk, message, {
                count: userCount,
                users: usersFound
            }, statusCode)
        );
    });
}

// Get user by filter
function _getSingleUserByFilter(filter, callback) {
    return User.findOne(filter, (err, userFound) => {
        if (err) {
            return callback(
                Api.getError(FeedbackMessages.operationFailed("get user"), err)
            );
        }
        const isOk = userFound ? true : false;
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFound("User") : FeedbackMessages.itemNotFound("User");

        return callback(
            Api.getResponse(isOk, message, userFound, statusCode)
        );
    });
}

// Update user
function _updateUser(userId, updateData, callback) {
    User.findByIdAndUpdate(userId, updateData)
        .then(updatedUser => {
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`user`), updatedUser)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(err.message, err)
            );
        });
}

// Add address
function _addAddress(userId, addressInfo, callback) {
    // Add the address
    const address = new Address(addressInfo);

    address.save()
        .then(addressAdded => {
            //Add the address to the user table
            _updateUser(userId, {
                address: addressAdded.id
            }, (response) => {
                if (!response.ok) {
                    return callback(response);
                }

                // Address successfully added to user table
                return callback(
                    Api.getResponse(true, FeedbackMessages.operationSucceeded(`added address`))
                );
            });
        })
        .catch(err => {
            return callback(
                Api.getError(err.message, err)
            );
        });
}

// Get single address
function _getSingleAddressByFilter(filter, callback) {
    User.findOne(filter)
        .then(addressFound => {
            if (!addressFound) {
                return callback(
                    Api.getResponse(false, FeedbackMessages.itemNotFound(`Address`), null, 404)
                );
            }
            // Address found, return it
            return callback(
                Api.getResponse(true, FeedbackMessages.itemsFound(`Address`), addressFound)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(err.message, err)
            );
        });
}

// Update address
function _updateAddress(addressId, updateData, callback) {
    Address.findByIdAndUpdate(addressId, updateData)
        .then(updatedAddress => {
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`address`), updatedAddress)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(err.message, err)
            );
        });
}

// Delete address
function _deleteAddress(userId, addressId, callback) {
    Address.findByIdAndDelete(addressId)
        .then(deletedAddress => {
            // Remove the address from the users table
            _updateUser(userId, {
                address: null
            }, (response) => {
                if (!response.ok) {
                    return callback(response);
                }

                console.log(`Removed the address from user`);
                // Updated user, successfully removed the address  from the user collection
                return callback(
                    Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`address`), deletedAddress)
                );
            });

        })
        .catch(err => {
            return callback(
                Api.getError(err.message, err)
            );
        });
}

/* 
    EXPORTS
*/
/* USERS */
// Get all users
module.exports.getUsers = (filter, callback) => {
    return _getUsersByFilter(filter, callback);
};

// Get a single user by phone number
module.exports.getUserByPhone = (userPhone, callback) => {
    return _getSingleUserByFilter({
        phone: userPhone
    }, callback);
};

// Get a single user by userId
module.exports.getUserById = (userId, callback) => {
    return _getSingleUserByFilter({
        _id: userId
    }, callback);
};

// Update user
module.exports.updateUser = (userId, updateData, callback) => {
    return _updateUser(userId, updateData, callback);
};

// Disable user
module.exports.disableUserAccount = (userId, callback) => {
    return _updateUser(userId, {
        isActive: false
    }, callback);
};

// Enable user
module.exports.enableUserAccount = (userId, callback) => {
    return _updateUser(userId, {
        isActive: true
    }, callback);
};

/* ADDRESSES */
// Add address
module.exports.addAddress = (userId, addressData, callback) => {
    return _addAddress(userId, addressData, callback);
};

// Get single address by addressId
module.exports.getSingleAddress = (addressId, callback) => {
    return _getSingleAddressByFilter({
        _id: addressId
    }, callback);
};

// Update address
module.exports.updateAddress = (addressId, updateData, callback) => {
    return _updateAddress(addressId, updateData, callback);
};

// Delete address
module.exports.deleteAddress = (userId, addressId, callback) => {
    return _deleteAddress(userId, addressId, callback);
};