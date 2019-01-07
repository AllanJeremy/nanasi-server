// Packages
const Moment = require('moment');

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
    const expiry = Moment().add(OtpConfig.OTP_EXPIRY_TIME, 'seconds').unix();

    return expiry;
}

// Send otp ~ Returns ok = true & 
module.exports.sendOtp = (phone, otpType, callback) => {
    const otp = generateOtp();

    //TODO: Find a way of tracking last otp sent time by the current user
    //TODO: Consider using JWT

    // Send SMS
    const otpMessage = SmsTemplates.sendOtp(otp, otpType);
    Messaging.sendSms([phone], otpMessage, (smsResponse) => {
        const otpData = {
            phone: phone,
            messageSent: (smsResponse.SMSMessageData.Recipients[0].statusCode == Messaging.messageStatusCode.SENT),
            smsResponse: smsResponse,
            otp: {
                password: otp,
                otpType: otpType,
                expiry: _generateOtpExpirationTime()
            }
        };
        console.log(`Sending ${otpType} otp to ${phone}`);
        return callback(otpData);
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
module.exports.verifyOtp = (userId, otpToVerify, otpType, callback) => {
    User.findOne({
        _id: userId,
        "otp.password": otpToVerify,
        "otp.otpType": otpType
    }, (err, userFound) => {
        if (err) {
            const message = `An internal error occured while trying to save the user otp ${err.message}`;
            return callback(
                Api.getError(message, err)
            );
        }
        // Returns true if the otp was found & has not expired
        if (userFound) {
            const otpHasExpired = Moment(userFound.otp.expiry).isAfter(Date.now());
            const message = otpHasExpired ? FeedbackMessages.otpExpired() : FeedbackMessages.otpVerified();

            //TODO: Delete the OTP from the user once it has been verified
            return callback(
                Api.getResponse((!otpHasExpired), message)
            );
        } else {
            return callback(
                Api.getResponse(false, FeedbackMessages.otpFailedToVerify())
            );
        }

    }).catch(err => {
        return callback(
            Api.getError(err.message, err)
        );
    });
};