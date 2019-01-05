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