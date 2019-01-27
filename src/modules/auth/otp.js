// Packages
const moment = require('moment');

// Config
const OtpConfig = require('../../config/otp');

// Models
const User = require('../../models/users/user');

//Libraries - Can be used in multiple applications
const Api = require('../../lib/api');
const Utility = require('../../lib/utility');
const Messaging = require('../../lib/messaging');

// Message templates
const SmsTemplates = require('../../lang/smsTemplates');
const FeedbackMessages = require('../../lang/feedbackMessages');
const AuthMessages = require('../../lang/authMessages');

// Generates and returns an otp
function generateOtp() {
    const minVal = (Math.pow(10, (OtpConfig.OTP_LENGTH - 1)));
    const maxVal = (Math.pow(10, OtpConfig.OTP_LENGTH)) - 1; // 999 in the case of OTP_LENGTH = 3

    //Otp of length
    let otp = Utility.getRandomInt(minVal, maxVal).toString();
    return otp;
}

// Generates and returns otp expiration time
function _generateOtpExpirationTime() {
    const expiry = moment().add(OtpConfig.OTP_EXPIRY_TIME, 'seconds').unix();

    return expiry;
}

// Send otp ~ Returns ok = true & 
module.exports.sendOtp = (phone, otpType, callback) => {
    const otp = generateOtp();
    const otpExpiry = _generateOtpExpirationTime();

    const otpDbData = {
        otp: {
            password: otp,
            otpType: otpType,
            expiry: otpExpiry
        }
    };

    // Save the OTP to the database
    User.findOneAndUpdate({
            phone: phone
        }, otpDbData)
        .then(userFound => {
            // If the user was not found, try creating the
            if (!userFound) {
                return callback(
                    Api.getError(AuthMessages.otpSendFailed(), null, 403)
                );
            }

            //TODO: Find a way of tracking last otp sent time by the current user
            //TODO: Consider using JWT

            // Send SMS only if a user was found
            const otpMessage = SmsTemplates.sendOtp(otp, otpType);
            Messaging.sendSms([phone], otpMessage, (smsResponse) => {
                const otpData = {
                    phone: phone,
                    messageSent: (smsResponse.SMSMessageData.Recipients[0].statusCode == Messaging.messageStatusCode.SENT),
                    smsResponse: smsResponse,
                    otp: {
                        password: otp,
                        otpType: otpType,
                        expiry: otpExpiry
                    }
                };

                //TODO: Check if OTP was actually sent on Africa's talking side
                return callback(
                    Api.getResponse(true, AuthMessages.otpSendSuccessful, otpData)
                );
            });
        }).catch(err => {
            return callback(
                Api.getError(AuthMessages.otpSendFailed, err)
            );
        });

};

// Add user otp to database
module.exports.addUserOtpToDb = (userId, otpData, callback) => {
    const updateOptions = {
        new: true,
        runValidators: true,
        set: 'phone'
    };

    // 
    User.findById(userId, (err, userFound, callback) => {
        // If there was any error fetching the message, return it
        if (err) {
            const message = `An error occured while trying to save the user otp ${err.message}`;
            return Api.getError(message, err);
        }

        // Add the otp data to the user
        userFound.otp = otpData;
        userFound.save();
        const message = `Successfully saved user otp`;

        return Api.getResponse(true, message);
    }).catch(err => {
        return Api.getError(err.message, err);
    }).then(response => {
        return callback(response);
    });
};

// Verify otp ~ Returns true if OTP was valid & false if otp was invalid
module.exports.verifyOtp = (phone, otpToVerify, otpType, callback) => {
    const dataToCollect = '_id firstName lastName phone isActive'; //TODO: Move into config as "publicly" accessible user data

    return User.findOne({
            phone: phone,
            "otp.password": otpToVerify,
            "otp.otpType": otpType
        })
        .select(dataToCollect)
        .exec((err, userFound) => {
            if (err) {
                const message = `An internal error occured while trying to save the user otp ${err.message}`;
                return callback(
                    Api.getError(message, err)
                );
            }
            // Returns true if the otp was found & has not expired
            if (userFound) {
                const otpHasExpired = moment(userFound.otp.expiry).isAfter(Date.now());
                const message = otpHasExpired ? AuthMessages.otpExpired() : AuthMessages.otpVerified();

                //TODO: Delete the OTP from the user once it has been verified
                return callback(
                    Api.getResponse((!otpHasExpired), message, {
                        user: userFound
                    })
                );
            } else {
                return callback(
                    Api.getError(AuthMessages.otpFailedToVerify(), undefined, 403)
                );
            }

        });
};