const User = require('../../models/users/user');

const Api = require('../../lib/api');
const FeedbackMessages = require('../../lang/feedbackMessages');

// Get all users
module.exports.getUsers = () => {
    return User.find((err, usersFound) => {
        if (err) {
            return Api.getError(FeedbackMessages.operationFailed('get users'));
        }

        return Api.getResponse(true, FeedbackMessages.itemsFoundWithCount(usersFound, 'Users'), {
            count: usersFound.length,
            users: usersFound
        });
    });
};

// Get user by filter
function _getUserByFilter(filter) {
    return User.findOne(filter, (err, usersFound) => {
        if (err) {
            return Api.getError(FeedbackMessages.operationFailed('get users'));
        }

        const userCount = usersFound.length;
        const isOk = (userCount > 0);
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(usersFound, 'Users') : FeedbackMessages.itemNotFound('User');

        return Api.getResponse(isOk, message, {
            count: userCount,
            users: usersFound
        });
    });
}

// Get a single user by phone number
module.exports.getUserByPhone = (userPhone) => {
    return _getUserByFilter({
        phone: userPhone
    });
};

// Get a single user by userId
module.exports.getUserById = (userId) => {
    return _getUserByFilter({
        id: userId
    });
};