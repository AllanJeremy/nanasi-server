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
};
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

// Item updated successfully
module.exports.itemUpdatedSuccessfully = (itemName) => {
    const message = `Successfully updated ${itemName}`;

    //TODO: Probably translate
    return message;
};

// Item deleted successfully
module.exports.itemDeletedSuccessfully = (itemName) => {
    const message = `Successfully deleted ${itemName}`;

    //TODO: Probably translate
    return message;
};

// Failed to sign JWT
module.exports.failedToSignJWT = () => {
    const message = `Failed to sign JWT`;

    //TODO: Probably translate
    return message;
};