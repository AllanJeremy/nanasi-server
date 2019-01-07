// When a login attempt fails
module.exports.loginFailed = () => {
    const message = `Login failed. Incorrect phone number or OTP`;

    //TODO: Possibly translate
    return message;
};

// When a login attempt succeeds
module.exports.loginSucceeded = () => {
    const message = `Login succeeded`;

    //TODO: Possibly translate
    return message;
};

//Confirm registration succeeded
module.exports.confirmRegistration = () => {
    const message = `Successfully confirmed registration`;

    //TODO: Possibly translate
    return message;
};
/* 
    OTP
*/
// OTP expired
module.exports.otpExpired = () => {
    const message = `The OTP you entered has expired`;

    //TODO: Probably translate
    return message;
};

// OTP Successfully verified
module.exports.otpVerified = () => {
    const message = `The OTP you entered has been verified`;

    //TODO: Probably translate
    return message;
};

// OTP failed to verify
module.exports.otpFailedToVerify = () => {
    const message = `Failed to verify OTP`;

    //TODO: Probably translate
    return message;
};