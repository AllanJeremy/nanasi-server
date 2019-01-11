const express = require('express');
const router = express.Router();

const cart = require('../modules/cart/cart');

/* CART ENDPOINTS */
// Add item to cart
//* Buyer accessible
router.post('/', (req, res, next) => {
    //TODO: Set the user id to the current user id, passed via middleware
    //req.body.data.user = req.userData._id;
    cart.addCartItem(req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View cart items for the current user
//* Buyer accessible
router.get('/', (req, res, next) => {
    //TODO: Set the user id to the current user id, passed via middleware
    cart.getUserCart(req.userData._id, response => {
        return res.status(response.statusCode).json(response);
    });
});


// Get single cart item
//* Buyer accessible
router.get('/:cartItemId', (req, res, next) => {
    //TODO: Set the user id to the current user id, passed via middleware
    //TODO: Check if the buyer owns this cart item before allowing updates
    cart.getCartItem(req.params.cartItemId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update cart item ~ Often used to update the item quantity in the cart
//* Buyer accessible
router.patch('/:cartItemId', (req, res, next) => {
    //TODO: Check if the buyer owns this cart item before allowing updates
    cart.updateCartItem(req.params.cartItemId, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete cart item ~ Remove item from cart
//* Buyer accessible
router.get('/:cartItemId', (req, res, next) => {
    //TODO: Check if the buyer owns this cart item before allowing delete
    cart.deleteCartItem(req.params.cartItemId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;