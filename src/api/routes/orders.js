const express = require('express');
const router = express.Router();

/* ORDER ENDPOINTS */
// Create order
router.post('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message:"Creating order"
    });
});

// View multiple orders
router.get('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message: `Viewing multiple orders`
    });
});

// View single order
router.get('/:orderId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const orderId = req.params.orderId;
    res.json({
        id: orderId,
        message: `Viewing single order with id of ${orderId}`
    });
});

// Update order
router.patch('/:orderId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const orderId = req.params.orderId;
    res.json({
        id: orderId,
        message: `Updating order with id of ${orderId}`
    });
});

// Delete order
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