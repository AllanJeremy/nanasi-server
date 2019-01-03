const express = require('express');
const router = express.Router();

/* PRODUCT VARIANTS 
Added here to avoid request param overlap with product/:attribute
*/
// Create product variant
router.post('/variants/:productId',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    
    const productId = req.params.productId;
    res.json({
        id: productId,
        message: `Creating product variant for product with id of ${productId}`
    });
});

// View multiple product variants belonging to a certain product
router.get('/variants/:productId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const productId = req.params.productId;
    res.json({
        id: productId,
        message: `Viewing multiple product variants for the product with id of ${productId}`
    });
});

// View single product variant
router.get('/single-variant/:variantId',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    
    const variantId = req.params.variantId;
    res.json({
        id: variantId,
        message: `Viewing single product variant with id of ${variantId}`
    });
});

// Update product variant
router.patch('/variants/:variantId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const variantId = req.params.variantId;
    res.json({
        id: variantId,
        message: `Update product variant with the id of ${variantId}`
    });
});

// Delete product variant
router.delete('/variants/:variantId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const variantId = req.params.variantId;
    res.json({
        id: variantId,
        message: `Delete product variant with id of ${variantId}`
    });
})

/* PRODUCTS */
// Create products
router.post('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message:"Creating products"
    });
});

// View multiple products
router.get('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message: `Viewing multiple products`
    });
});

// View single product
router.get('/:productId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const productId = req.params.productId;
    res.json({
        id: productId,
        message: `Viewing single product with id of ${productId}`
    });
});

// Update product
router.patch('/:productId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const productId = req.params.productId;
    res.json({
        id: productId,
        message: `Updating product with id of ${productId}`
    });
});

// Delete products
router.delete('/:productId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const productId = req.params.productId;
    res.json({
        id: productId,
        message: `Deleting product with id of ${productId}`
    });
});

// Exports
module.exports = router;