// Config
const otpConfig = require('../../config/otp');

// Models
const User = require('../../models/users/user');

//Libraries - Can be used in multiple applications
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

// Send otp
module.exports.sendOtp = (res, userId, type) => {
    const otp = generateOtp();
    const message = smsTemplates.sendOtp(otp);
    let phone;
    let returnVal;

    const updateData = {
        otp: {
            password: otp,
            type: type
        }
    };

    const updateOptions = {
        new: true,
        runValidators: true,
        set: 'phone'
    };

    // Get the user with the id of userId
    User.findByIdAndUpdate(userId, updateData, updateOptions, (error, user) => {
        // If there was any error fetching the message, return it
        if (error) {

            //TODO: Handle errors
            console.error(`An error occured while trying to retrieve the user 
            ${error.message}`);

            return res.status(404).json(api);

        } else {
            res.status(500);
            phone = user.phone;
            console.log('User: ');
            console.log(user);

            // Send SMS if there were no errors
            messaging.sendSms([phone], message);
        }
    });
};

//TODO: Verify otp ~ Returns true if OTP was valid & false if otp was invalid