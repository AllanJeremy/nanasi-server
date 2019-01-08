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
module.exports.register = (userData, callback) => {
    // Check if the user exists or not
    User.find({
        phone: userData.phone
    }).exec().then(user => {
        // If we found a user by that phone
        if (user.length > 0) {
            const message = FeedbackMessages.itemWithAttributeExists('User', 'phone number');

            return callback(Api.getResponse(false, message, null, 409));

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
                        return callback(Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully('user'), createdUser, 201));
                    });
                });
            });

        }
    }).catch(err => {
        callback(Api.getError(err.message, err, 500));
    });
};

// Confirm registered user
module.exports.confirmRegistration = (phone, otpInput, callback) => {
    // Confirm the OTP
    Otp.verifyOtp(phone, otpInput, OtpConfig.OtpTypes.REGISTER, response => {
        // If the OTP was invalid ~ Reject Login
        if (!response.ok) {
            return callback(Api.getResponse(false, AuthMessages.loginFailed(),null,401));
        }

        // Update the records in the database
        User.findOne({
            phone: phone,
            registrationConfirmed: false //Only update the records if the user has not been found
        }, (err, userFound) => {
            if (err) {
                return callback(Api.getError(err.message, err));
            }

            // If no users were found
            if (!userFound) {
                return callback(
                    Api.getError(FeedbackMessages.itemNotFound('User to update'),null,404)
                );
            }
            userFound.otp = undefined; // Remove the OTP ~  We are done with it for now
            userFound.registrationConfirmed = true; // Confirm registration
            userFound.isActive = true; //Activate account

            userFound.save();

            return callback(
                Api.getResponse(true, AuthMessages.confirmRegistration(), {
                    user: userFound
                })
            );
        }).catch(err => callback(Api.getError(err.message, err)));
    });

};

// Login
module.exports.login = (phone, otpInput, callback) => {
    // Verify the OTP then login
    return Otp.verifyOtp(phone, otpInput, OtpConfig.OtpTypes.LOGIN, response => {
        // If the OTP was invalid ~ Reject Login
        if (!response.ok) {
            return callback(Api.getResponse(false, AuthMessages.loginFailed()));
        }
        // Otp verified
        const userData = response.data.user;
        jwt.sign({
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h' //TODO: Move into config
        }, (err, token) => {

            // If there was an error creating the JWT
            if (err) {
                // Set error message
                response.ok = false;
                response.message = FeedbackMessages.failedToSignJWT();
                response.error = err.message;

                // Remove the data that had been set
                response.data = undefined;

            } else {

                //Successfully created JWT - Return token generated
                response.message = AuthMessages.loginSucceeded();
                response.data.token = token;
            }

            // Call the callback with the JSON response we generated
            return callback(response);
        });
    });
};

// TODO: Logout

// TODO: Get currently logged in user