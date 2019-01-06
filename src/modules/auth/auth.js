// Config
const otpConfig = require('../../config/otp');

// Libraries
const api = require('../../lib/api');

// Models
const User = require('../../models/users/user');

//Lang files
const feedbackMessages = require('../../lang/feedbackMessages');

// Modules
const otp = require('../../modules/auth/otp');


// Register new user
module.exports.register = (res, userData) => {
    // Check if the user exists or not
    User.find({
        phone: userData.phone
    }).exec().then(user => {
        // If we found a user by that phone
        if (user.length > 0) {
            const message = feedbackMessages.itemWithAttributeExists('User', 'phone number');

            res.status(409).json(api.getResponse(false, message));

        } else { // No user with that phone exists - proceed to create user
            //TODO: Check if it was a bot using Google Captcha

            const newUser = new User(userData);

            // Add user to the database
            newUser.save().then(createdUser => {
                // Send OTP to the user & save it to the database
                let otpStatus = otp.sendOtp(res, createdUser.id, otpConfig.OtpTypes.REGISTER);
                console.log(otpStatus);
                // if (otpStatus.ok) {
                //     return res.status(201).json(api.getResponse(true, feedbackMessages.itemCreatedSuccessfully('user'), createdUser));
                // } else {
                //     return res.status(500).json(otpStatus);
                // }

            });
        }
    }).catch(err => {
        res.status(500).json(api.getError(err));
    });

};

// TODO: Login

// TODO: Logout

// TODO: Get currently logged in user