// Packages
const moment = require('moment');

// Config
const otpConfig = require('../../config/otp');

// Models
const User = require('../../models/users/user');

//Libraries - Can be used in multiple applications
const api = require('../../lib/api');
const utility = require('../../lib/utility');
const messaging = require('../../lib/messaging');

// Message templates
const smsTemplates = require('../../lang/smsTemplates');

// Generates and returns an otp
function generateOtp() {
    const minVal = (Math.pow(10, (otpConfig.OTP_LENGTH - 1)));
    const maxVal = (Math.pow(10, otpConfig.OTP_LENGTH)) - 1; // 999 in the case of OTP_LENGTH = 3

    //Otp of length
    let otp = utility.getRandomInt(minVal, maxVal).toString();
    return otp;
}

// Generates and returns otp expiration time
function _generateOtpExpirationTime() {
    const expiry = moment().add(otpConfig.OTP_EXPIRY_TIME, 'seconds').unix();

    return expiry;
}

// Send otp ~ Returns ok = true & 
module.exports.sendOtp = (phone, otpType, callback) => {
    const otp = generateOtp();

    //TODO: Find a way of tracking last otp sent time by the current user
    //TODO: Consider using JWT

    // Send SMS
    const otpMessage = smsTemplates.sendOtp(otp, otpType);
    messaging.sendSms([phone], otpMessage, (smsResponse) => {
        const otpData = {
            phone: phone,
            messageSent: (smsResponse.SMSMessageData.Recipients[0].statusCode == messaging.messageStatusCode.SENT),
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
            return api.getError(message, err);
        }

        userFound.otp = otpData;
        userFound.save();
        const message = `Successfully saved user otp`;

        return api.getResponse(true, message);
    }).catch(err => {
        return api.getError(err.message, err);
    }).then(response => {
        callback(response);
    });
};

//TODO: Verify otp ~ Returns true if OTP was valid & false if otp was invalid
module.exports.verifyOtp = (userId, otp, otpType) => {
    //TODO: Add implementation
};