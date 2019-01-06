/* 
    ERROR MESSAGES
*/
// Displayed when an item was not found
module.exports.itemNotFound = (itemName) => {
    const message = `${itemName} not found`;

    //TODO: Possibly add translation
    return message;
};

// Displayed when an operation could not be completed due to an error
module.exports.operationFailed = (operationName) => {
    const message = `Error: Failed to ${operationName}`;

    //TODO: Possibly add translation
    return message;
};

module.exports.itemWithAttributeExists = (itemName, attributeName) => {
    const message = `${itemName} with ${attributeName} already exists`;

    //TODO: Possibly add translation
    return message;
}
/* 
    SUCCESS MESSAGES
*/
module.exports.itemsFound = (itemName) => {
    const message = `Found ${item}`;

    //TODO: Probably translate
    return message;
};

//Item found with count
module.exports.itemsFoundWithCount = (items, itemName) => {
    const message = `${itemName} found: ${items.length}`;

    //TODO: Probably translate
    return message;
};

// Item created successfully
module.exports.itemCreatedSuccessfully = (itemName) => {
    const message = `Successfully created ${itemName}`;

    //TODO: Probably translate
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