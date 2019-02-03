const {
    AfricasTalking
} = require('../config/africasTalking');
const Sms = AfricasTalking.SMS;

const SENDER_ID = 'Nanasi.co';
module.exports.messageStatusCode = {
    PROCESSED: '100',
    SENT: '101',
    QUEUED: '102',
    RISK_HOLD: '401',
    INVALID_SENDER_ID: '402',
    INVALID_PHONE_NUMBER: '403',
    UNSUPPORTED_NUMBER_TYPE: '404',
    INSUFFICIENT_BALANCE: '405',
    USER_IN_BLACK_LIST: '406',
    COULD_NOT_ROUTE: '407',
    INTERNAL_SERVER_ERROR: '500',
    GATEWAY_ERROR: '501',
    REJECTED_BY_GATEWAY: '502'
};
// This allows us to send SMSes
module.exports.sendSms = (recipients, message, callback) => {
    const options = {
        to: recipients,
        message: message,
        //TODO: Add sender id once we have it
    };

    const sendMessage = Sms.send(options);

    sendMessage.then(response => {
        console.log(response);
        return callback(response);
    }).catch(err => {
        console.error(err);
        return err;
    });
};