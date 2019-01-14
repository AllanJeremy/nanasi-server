const jwt = require('jwt');

const AccountTypes = require('../config/accountTypes');
const User = require('../models/users/user');

const Api = require('../lib/api');

const AuthMessages = require('../lang/authMessages');

function _getLoggedIn(req) {
    try {
        const token = (req.headers.authorization.split(' '))[0];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        return decoded;
    } catch (err) {
        return false;
    }
}

//Return auth not allowed message
function _getTokenAuthFailedResponse(res) {
    return res.status(401).json(Api.getError(AuthMessages.tokenAuthFailed(), undefined, 401));
}

// Checks if any user type is logged in
module.exports.userLoggedIn = (req, res, next) => {
    const userData = _getLoggedIn(req);
    if (userData) {
        req.userData = userData;
        next();
    } else {
        return _getTokenAuthFailedResponse(res);
    }
};

// Checks if a buyer is logged in
module.exports.buyerLoggedIn = (req, res, next) => {
    const userData = _getLoggedIn(req);
    if (userData) {
        User.find({
                _id: userData._id,
                accountType: AccountTypes.BUYER
            })
            .then(userFound => {
                if (userFound) {
                    req.userData = userData;
                    next();
                }
            }).catch(err => {
                const response = Api.getError(err.message, err);
                return res.status(response.statusCode).json(response);
            });
    } else {
        return _getTokenAuthFailedResponse(res);
    }
};

// Checks if a merchant is logged in
module.exports.merchantLoggedIn = (req, res, next) => {
    const userData = _getLoggedIn(req);
    if (userData) {
        // Check to see if there is a merchant that has that id
        User.find({
                _id: userData._id,
                accountType: AccountTypes.MERCHANT
            })
            .then(userFound => {
                if (userFound) {
                    req.userData = userData;
                    next();
                }
            }).catch(err => {
                const response = Api.getError(err.message, err);
                return res.status(response.statusCode).json(response);
            });
    } else {
        return _getTokenAuthFailedResponse(res);
    }
};

// Checks if a admin is logged in
module.exports.adminLoggedIn = (req, res, next) => {
    const userData = _getLoggedIn(req);
    if (userData) {
        // Find admins by that id
        User.find({
                _id: userData._id,
                accountType: AccountTypes.ADMIN
            })
            .then(userFound => {
                if (userFound) {
                    req.userData = userData;
                    next();
                }
            }).catch(err => {
                const response = Api.getError(err.message, err);
                return res.status(response.statusCode).json(response);
            });
    } else {
        return _getTokenAuthFailedResponse(res);
    }
};