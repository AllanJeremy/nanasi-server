const express = require("express");
const router = express.Router();

const store = require("../modules/stores/stores");

const CheckAuth = require("../middleware/checkAuth");
const Ownership = require("../middleware/entityOwnership");

/* STORE ENDPOINTS */
// Create store
//* Merchant accessible
router.post("/", CheckAuth.merchantLoggedIn, (req, res, next) => {
    store.createStore(req.body.data, (response) => {
        return res.status(response.statusCode).json(response); //TODO: refactor this
    });
});

// View multiple stores
//* Globally accessible
router.get("/", (req, res, next) => {
    store.getStores(req.body.filters, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get logged in merchant stores
//* Globally accessible
router.get("/merchant", CheckAuth.merchantLoggedIn, (req, res, next) => {
    store.getMerchantStores(req.userData.id, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get stores by product type
//* Globally accessible
router.get("/productType/:productTypeId", (req, res, next) => {
    store.getStoresByProductType(req.params.productTypeId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// View single store
//* Globally accessible
router.get("/:storeId", (req, res, next) => {
    store.getStoreById(req.params.storeId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Update store
//* Merchant accessible
router.patch("/:storeId", CheckAuth.merchantLoggedIn, Ownership.storeBelongsToMerchant, (req, res, next) => { //TODO: Add db code
    store.updateStore(req.params.storeId, req.body.data, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete store
//* Merchant accessible
router.delete("/:storeId", CheckAuth.merchantLoggedIn, Ownership.storeBelongsToMerchant, (req, res, next) => { //TODO: Add db code
    store.deleteStore(req.params.storeId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;