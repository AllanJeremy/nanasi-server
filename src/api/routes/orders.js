const express = require('express');
const router = express.Router();

/* ORDER ENDPOINTS */
// Create order
//* Buyer accessible
router.post('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message:"Creating order"
    });
});

// View multiple orders
//* Merchant accessible
//* Buyer accessible
router.get('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message: `Viewing multiple orders`
    });
});

// View single order
//* Merchant accessible
//* Buyer accessible
router.get('/:orderId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const orderId = req.params.orderId;
    res.json({
        id: orderId,
        message: `Viewing single order with id of ${orderId}`
    });
});

// Decline order
//* Merchant accessible
router.patch('/decline/:orderId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const orderId = req.params.orderId;
    res.json({
        id: orderId,
        message: `Declining order with id of ${orderId}`
    });
});

// Fulfil/Complete order
//* Merchant accessible
router.patch('/complete/:orderId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const orderId = req.params.orderId;
    res.json({
        id: orderId,
        message: `Completing order with id of ${orderId}`
    });
});

// Update order
//* Buyer accessible
router.patch('/:orderId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const orderId = req.params.orderId;
    res.json({
        id: orderId,
        message: `Updating order with id of ${orderId}`
    });
});

// Cancel/Delete order
//* Buyer accessible
router.delete('/:orderId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const orderId = req.params.orderId;
    res.json({
        id: orderId,
        message: `Deleting order with id of ${orderId}`
    });
});

// Exports
module.exports = router;