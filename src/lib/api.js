module.exports.getResponse = (isOk, message, data) => {
    let response = {};
    response.ok = isOk;
    response.message = message;
    response.data = data;
    return response;
};

module.exports.getError = (message) => {
    return getResponse(false, message);
};