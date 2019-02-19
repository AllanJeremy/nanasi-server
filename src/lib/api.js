module.exports.getResponse = (isOk, message, data, statusCode) => {
    let response = {};
    response.ok = isOk;
    response.statusCode = statusCode || 200;
    response.message = message;
    response.data = data || null;
    return response;
};

module.exports.getError = (message, error, statusCode) => {
    statusCode = statusCode || 500;
    let response = this.getResponse(false, message, null, statusCode);
    response.error = error;
    return response;
};