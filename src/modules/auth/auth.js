const api = require('../../lib/api');
const User = require('../../models/users/user');

// Register new user
module.exports.register = (res, userData) => {
    const user = new User(userData);

    user.save().then(createdUser => {
        console.log(createdUser);
        return res.status(201).json(api.getResponse(true, 'Successfully created user', createdUser));
    });
};

// TODO: Login

// TODO: Logout

// TODO: Get currently logged in user