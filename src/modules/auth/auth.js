// Modules
const jwt = require("jsonwebtoken");

// Config
const OtpConfig = require("../../config/otp");
const JwtConfig = require("../../config/jwt");

// Libraries
const Api = require("../../lib/api");

// Models
const User = require("../../models/users/user");

//Lang files
const FeedbackMessages = require("../../lang/feedbackMessages");
const AuthMessages = require("../../lang/authMessages");

// Modules
const Otp = require("../../modules/auth/otp");
const user = require("../../modules/users/users");

function _getJwtData(userData) {
    let data = {
        id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        accountType: userData.accountType,
        phone: userData.phone
    };
    data.email = userData.email;
    data.isActive = userData.isActive;

    return data;
}

// Sign JWT
function _signJwt(data) {
    let isOk, message, responseData;

    const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: JwtConfig.EXPIRY_TIME
    });

    return token;
}

// Register new user
module.exports.register = (userData, callback) => {
    // Check if the user exists or not
    User.find({
        phone: userData.phone
    }).exec().then(user => {
        // If we found a user by that phone
        if (user.length > 0) {
            const message = FeedbackMessages.itemWithAttributeExists("User", "phone number");

            return callback(Api.getResponse(false, message, null, 409));

        } else { // No user with that phone exists - proceed to create user
            //TODO: Check if it was a bot using Google Captcha
            const newUser = new User(userData);

            // Add user to the database
            newUser.save().then(createdUser => {

                // Try sending a OTP
                Otp.sendOtp(createdUser.phone, OtpConfig.OtpTypes.REGISTER, (otpResponse) => {
                    let otpData = otpResponse.data.otp;
                    if (!otpResponse.ok) {
                        return callback(Api.getError(FeedbackMessages.operationFailed(`send otp`)));
                    } else { //OTP Sent successfully
                        // Add OTP data to the database
                        console.debug(`Adding otp to DB`);
                        Otp.addUserOtpToDb(createdUser._id, otpData, (response) => {
                            return callback(Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully("user"), createdUser, 201));
                        });
                    }
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
    Otp.verifyOtp(phone, otpInput, OtpConfig.OtpTypes.REGISTER, (response) => {
        // If the OTP was invalid ~ Reject Login
        if (!response.ok) {
            return callback(Api.getResponse(false, AuthMessages.otpFailedToVerify(), null, 401));
        }

        // Update the records in the database
        User.findOne({
            phone: phone,
            registrationConfirmed: false //Only update the records if the user has not been found
        }, (err, userFound) => {
            if (err) {
                return callback(Api.getError(err.message, err));
            }

            // If no users were found ~ reject otp verfication
            if (!userFound) {
                return callback(
                    Api.getError(FeedbackMessages.itemNotFound("User to update"), null, 404)
                );
            }
            userFound.otp = undefined; // Remove the OTP ~  We are done with it for now
            userFound.registrationConfirmed = true; // Confirm registration
            userFound.isActive = true; //Activate account

            userFound.save();

            const token = _signJwt(_getJwtData(userFound));
            return callback(
                Api.getResponse(true, AuthMessages.confirmRegistration(), {
                    user: userFound,
                    token: token
                })
            );
        }).catch(err => callback(Api.getError(err.message, err)));
    });

};

// Login
module.exports.login = (phone, otpInput, callback) => {
    // Verify the OTP then login
    return Otp.verifyOtp(phone, otpInput, OtpConfig.OtpTypes.LOGIN, (response) => {
        // If the OTP was invalid ~ Reject Login
        if (!response.ok) {
            return callback(Api.getResponse(false, AuthMessages.loginFailed(), undefined, 401));
        }
        // Otp verified
        const userData = response.data.user;
        response.data.token = _signJwt(_getJwtData(userData));
        return callback(
            Api.getResponse(true, AuthMessages.loginSucceeded(), response.data)
        );
    });
};

// TODO: Logout

// TODO: Get currently logged in user