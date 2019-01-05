// Set up app credentials
const credentials = {
    apiKey: 'a18019c7a164dfdd725a42402909e486c9503045487f80cc5ed8eaba8a85c6ef',
    username: 'sandbox'
};

// Initialize the SDK
const AfricasTalking = require('africastalking')(credentials);

module.exports = AfricasTalking;