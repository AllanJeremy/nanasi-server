const express = require("express");
const router = express.Router();

const billing = require("../modules/billing/billing");
const CheckAuth = require("../middleware/checkAuth");
const Ownership = require("../middleware/entityOwnership");

// Add billing information
//* Logged in user accessible
router.post('/', CheckAuth.userLoggedIn, (req, res, next) => {
    billing.addBillingInfo(req.userData.id, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update billing information
//* Logged in user accessible
router.patch('/', CheckAuth.userLoggedIn, Ownership.billingInfoBelongsToUser, (req, res, next) => {
    billing.updateBillingInfo(req.userData.id, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Get currently logged in user billing information
//* Logged in user accessible
router.get('/', CheckAuth.userLoggedIn, Ownership.billingInfoBelongsToUser, (req, res, next) => {
    billing.getUserBillingInfo(req.userData.id, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Get single billing information
//* Logged in user accessible
router.get('/:billingId', CheckAuth.userLoggedIn, Ownership.billingInfoBelongsToUser, (req, res, next) => {
    billing.getSingleBillingInfo(req.params.billingId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete billing information
router.delete('/:billingId', CheckAuth.userLoggedIn, Ownership.billingInfoBelongsToUser, (req, res, next) => {
    billing.deleteBillingInfo(req.params.billingId, response => {
        return res.status(response.statusCode).json(response);
    });
});

module.exports = router;