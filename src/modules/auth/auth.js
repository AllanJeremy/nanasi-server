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
module.exports.login = (userId, otpInput) => {

    const verifyOtp = Otp.verifyOtp(userId, otpInput, OtpConfig.OtpTypes.LOGIN);

    // If the OTP was valid ~ Login
    if (verifyOtp.ok) {
        //TODO: Add login logic
    } else {
        return Api.getResponse(false, AuthMessages.loginFailed);
    }
};

// TODO: Logout

// TODO: Get currently logged in user