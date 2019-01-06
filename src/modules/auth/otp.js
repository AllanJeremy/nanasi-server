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
    const expiry = moment().add(otpConfig.OTP_EXPIRY_TIME, 'seconds');

    return expiry;
}

// Send otp ~ Returns ok = true & 
module.exports.sendOtp = (userId, type) => {
    const otp = generateOtp();
    let returnVal;

    const updateData = {
        otp: {
            password: otp,
            type: type,
            expiry: _generateOtpExpirationTime()
        }
    };

    const updateOptions = {
        new: true,
        runValidators: true,
        set: 'phone'
    };

    console.log(`User id provided: ${userId}`);

    // Get the user with the id of userId
    User.findByIdAndUpdate(userId, updateData, updateOptions, (err, userFound) => {
        // If there was any error fetching the message, return it
        if (err) { // Handle errors

            const message = `An error occured while trying to save the user otp ${err.message}`;
            console.error(message);

            return api.getError(message, err);
        } else {
            console.log(`Sending ${type} otp to ${userFound.phone}`);
            // Send SMS if there were no errors
            const otpMessage = smsTemplates.sendOtp(otp);
            messaging.sendSms([userFound.phone], otpMessage);

            const isOk = err ? false : true;
            const message = isOk ? `Successfully saved user otp` : `Failed to save user otp`;
            return api.getResponse(isOk, message);
        }
    }).catch(err => {
        return api.getError(err.message, err);
    });
};

//TODO: Verify otp ~ Returns true if OTP was valid & false if otp was invalid
module.exports.verifyOtp = (userId, otp, otpType) => {
    //TODO: Add implementation
};