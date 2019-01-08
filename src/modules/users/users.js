const User = require('../../models/users/user');

const Api = require('../../lib/api');
const FeedbackMessages = require('../../lang/feedbackMessages');

/* 
    HELPERS
*/
// Get multiple users by filter
function _getUsersByFilter(filter, callback) {
    return User.find(filter, (err, usersFound) => {
        if (err) {
            return callback(Api.getError(FeedbackMessages.operationFailed('get users')));
        }

        const userCount = usersFound.length;
        const isOk = (userCount > 0);
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(usersFound, 'Users') : FeedbackMessages.itemNotFound('User');

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
            return Api.getError(FeedbackMessages.operationFailed('get user'));
        }
        console.log(userFound);
        const isOk = userFound ? true : false;
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(userFound, 'User') : FeedbackMessages.itemNotFound('User');

        return callback(
            Api.getResponse(isOk, message, {
                user: userFound
            }, statusCode)
        );
    });
}

/* 
    EXPORTS
*/
// Get all users
module.exports.getUsers = (filter, callback) => {
    filter = filter || {};
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