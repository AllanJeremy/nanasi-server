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