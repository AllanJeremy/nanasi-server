// Send otp
module.exports.sendOtp = (otp, lang) => {
    const message = `Your Nanasi OTP is ${otp}`;

    //TODO: Possibly add translation
    return message;
};