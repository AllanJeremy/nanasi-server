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
    cart.addCartItems(req.userData.id, req.body.items, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View cart items for the current user
//* Buyer accessible
router.get("/", CheckAuth.buyerLoggedIn, (req, res, next) => {
    cart.getUserCart(req.userData.id, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Get single cart
//* Buyer accessible
router.get("/:cartId", CheckAuth.buyerLoggedIn, (req, res, next) => {
    cart.getCart(req.params.cartId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update cart ~ Often used to update the item quantity in the cart
//* Buyer accessible
router.patch("/:cartId", CheckAuth.buyerLoggedIn, Ownership.cartBelongsToBuyer, (req, res, next) => {
    cart.updateCart(req.params.cartId, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Remove cart item ~ Remove item from cart
//* Buyer accessible
router.patch("/removeCartItem/:cartId", CheckAuth.buyerLoggedIn, Ownership.cartBelongsToBuyer, (req, res, next) => {
    cart.removeCartItem(req.params.cartId, req.body.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Deletes the entire cart with the id of cart
//* Buyer accessible
router.delete("/:cartId", CheckAuth.buyerLoggedIn, Ownership.cartBelongsToBuyer, (req, res, next) => {
    cart.deleteCart(req.params.cartId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;