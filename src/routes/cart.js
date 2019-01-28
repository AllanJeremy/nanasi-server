const express = require("express");
const router = express.Router();

const cart = require("../modules/cart/cart");
const CheckAuth = require("../middleware/checkAuth");
const Ownership = require("../middleware/entityOwnership");

/* CART ENDPOINTS */
// TODO: Add abandoned cart item

// TODO: Get all abandoned carts

// TODO: Get abandoned carts by store

// TODO: Resolve abandoned carts

// Add item to cart
//* Buyer accessible
router.post("/", CheckAuth.buyerLoggedIn, (req, res, next) => {
    req.body.data.user = req.userData._id;
    cart.addCartItem(req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View cart items for the current user
//* Buyer accessible
router.get("/", CheckAuth.buyerLoggedIn, (req, res, next) => {
    cart.getUserCart(req.userData._id, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Get single cart item
//* Buyer accessible
router.get("/:cartItemId", CheckAuth.buyerLoggedIn, (req, res, next) => {
    cart.getCartItem(req.params.cartItemId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update cart item ~ Often used to update the item quantity in the cart
//* Buyer accessible
router.patch("/:cartItemId", CheckAuth.buyerLoggedIn, Ownership.cartItemBelongsToBuyer, (req, res, next) => {
    cart.updateCartItem(req.params.cartItemId, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete cart item ~ Remove item from cart
//* Buyer accessible
router.get("/:cartItemId", CheckAuth.buyerLoggedIn, Ownership.cartItemBelongsToBuyer, (req, res, next) => {
    cart.deleteCartItem(req.params.cartItemId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;