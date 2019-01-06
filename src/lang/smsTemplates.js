// Send otp
module.exports.sendOtp = (otp, otpType) => {
    const message = `Your Nanasi ${otpType} OTP is ${otp}`;

    //TODO: Possibly add translation
    return message;
};