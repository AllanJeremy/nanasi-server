const User = require('../../models/users/user');

const api = require('../../lib/api');
const errorMessages = require('../../lang/errorMessages');
const successMessages = require('../../lang/successMessages');

// Get all users
module.exports.getUsers = (res) => {
    User.find((err, usersFound) => {
        if (err) {
            return res.status(500).json(
                api.getError(errorMessages.operationFailed('get users'))
            );
        }

        return res.status(200).json(
            api.getResponse(true, successMessages.itemsFoundWithCount(usersFound, 'Users'), {
                count: usersFound.length,
                users: usersFound
            })
        );
    });
};

// Get a single user by userId
module.exports.getSingleUser = (res, userId) => {

};