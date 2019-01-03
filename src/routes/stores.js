const express = require('express');
const router = express.Router();

/* STORE ENDPOINTS */
// Create store
//* Merchant accessible
router.post('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message:"Creating store"
    });
});

// View multiple stores
//* Globally accessible
router.get('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message: `Viewing multiple stores`
    });
});

// View single store
//* Globally accessible
router.get('/:storeId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const storeId = req.params.storeId;
    res.json({
        id: storeId,
        message: `Viewing single store with id of ${storeId}`
    });
});

// Update store
//* Merchant accessible
router.patch('/:storeId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const storeId = req.params.storeId;
    res.json({
        id: storeId,
        message: `Updating store with id of ${storeId}`
    });
});

// Delete store
//* Merchant accessible
router.delete('/:storeId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const storeId = req.params.storeId;
    res.json({
        id: storeId,
        message: `Deleting store with id of ${storeId}`
    });
});

// Exports
module.exports = router;