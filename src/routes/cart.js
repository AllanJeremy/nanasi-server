const express = require('express');
const router = express.Router();

/* CART ENDPOINTS */
// Add item to cart
router.post('/',(req,res,next)=>{
    res.status(201);

    res.json({
        message: `Creating cart item`
    });
});

// View cart items for the current user
router.get('/',(req,res,next)=>{
    res.status(200);

    res.json({
        message: `Get cart items belonging to the current user`
    });
});


// Get single cart item
router.get('/:cartItemId',(req,res,next)=>{
    res.status(200);

    const cartItemId = req.params.cartItemId;
    res.json({
        id: cartItemId,
        message: `Get cart item with the id of ${cartItemId}`
    });
});

// Update cart item ~ Often used to update the item quantity in the cart
router.patch('/:cartItemId',(req,res,next)=>{
    res.status(200);

    const cartItemId = req.params.cartItemId;
    res.json({
        id: cartItemId,
        message: `Updating cart item with the id of ${cartItemId}`
    });
});

// Delete cart item ~ Remove item from cart
router.get('/:cartItemId',(req,res,next)=>{
    res.status(200);

    const cartItemId = req.params.cartItemId;
    res.json({
        id: cartItemId,
        message: `Get cart item with the id of ${cartItemId}`
    });
});

// Exports
module.exports = router;