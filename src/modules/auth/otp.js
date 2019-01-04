const otpConfig = require('../../config/otp');
const utility = require('../../lib/utility');

// Generates and returns an otp
function generateOtp()
{
    const minVal = (Math.pow(10,(otpConfig.OTP_LENGTH-1)));
    const maxVal = (Math.pow(10,otpConfig.OTP_LENGTH))-1; // 999 in the case of OTP_LENGTH = 3

    //Otp of length
    let otp = utility.getRandomInt(minVal,maxVal).toString();
    return otp;
}

//TODO: Send otp
//TODO: Verify otp ~ Returns true if OTP was valid & false if otp was invalid
