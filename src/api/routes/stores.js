const express = require('express');
const router = express.Router();

/* STORE ENDPOINTS */
// Create store
router.post('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message:"Creating store"
    });
});

// View multiple store
router.get('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message: `Viewing multiple store`
    });
});

// View single store
router.get('/:storeId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const storeId = req.params.storeId;
    res.json({
        id: storeId,
        message: `Viewing single store with id of ${storeId}`
    });
});

// Update store
router.patch('/:storeId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const storeId = req.params.storeId;
    res.json({
        id: storeId,
        message: `Updating store with id of ${storeId}`
    });
});

// Delete store
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