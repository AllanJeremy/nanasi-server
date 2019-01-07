// Modules
const jwt = require('jsonwebtoken');

// Config
const OtpConfig = require('../../config/otp');

// Libraries
const Api = require('../../lib/api');

// Models
const User = require('../../models/users/user');

//Lang files
const FeedbackMessages = require('../../lang/feedbackMessages');
const AuthMessages = require('../../lang/authMessages');

// Modules
const Otp = require('../../modules/auth/otp');
const user = require('../../modules/users/users');


// Register new user
module.exports.register = (res, userData) => {
    // Check if the user exists or not
    User.find({
        phone: userData.phone
    }).exec().then(user => {
        // If we found a user by that phone
        if (user.length > 0) {
            const message = FeedbackMessages.itemWithAttributeExists('User', 'phone number');

            res.status(409).json(Api.getResponse(false, message));

        } else { // No user with that phone exists - proceed to create user
            //TODO: Check if it was a bot using Google Captcha

            // Try sending a OTP
            Otp.sendOtp(userData.phone, OtpConfig.OtpTypes.REGISTER, (otpResponse) => {
                if (!otpResponse.messageSent) {
                    console.log(`Failed to send OTP`);
                    return;
                }

                const newUser = new User(userData);

                // Add user to the database
                newUser.save().then(createdUser => {
                    const otpData = otpResponse.otp;


                    // Add OTP data to the database
                    Otp.addUserOtpToDb(createdUser._id, otpData, (response) => {
                        return res.status(201).json(Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully('user'), createdUser));
                    });
                });
            });

        }
    }).catch(err => {
        res.status(500).json(Api.getError(err));
    });

};

// TODO: Login
module.exports.login = (phone, otpInput, callback) => {
    // Verify the OTP then login
    return Otp.verifyOtp(phone, otpInput, OtpConfig.OtpTypes.LOGIN, response => {
        // If the OTP was invalid ~ Reject Login
        if (!response.ok) {
            return callback(Api.getResponse(false, AuthMessages.loginFailed()));
        }
        // Otp verified
        response.data.token = `JWT`;

        //TODO: Create JWT
        return callback(response);
    });
};

// TODO: Logout

// TODO: Get currently logged in user