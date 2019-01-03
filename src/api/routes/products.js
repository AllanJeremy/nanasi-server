const express = require('express');
const router = express.Router();

/* PRODUCT VARIANTS 
Added here to avoid request param overlap with product/:attribute
*/
// Create product variant
//* Merchant accessible
router.post('/variants/:productId',(req,res,next)=>{//TODO: Add db code
    res.status(201);
    
    const productId = req.params.productId;
    res.json({
        id: productId,
        message: `Creating product variant for product with id of ${productId}`
    });
});

// View multiple product variants belonging to a certain product
//* Globally accessible
router.get('/variants/:productId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const productId = req.params.productId;
    res.json({
        id: productId,
        message: `Viewing multiple product variants for the product with id of ${productId}`
    });
});

// View single product variant
//* Globally accessible
router.get('/single-variant/:variantId',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    
    const variantId = req.params.variantId;
    res.json({
        id: variantId,
        message: `Viewing single product variant with id of ${variantId}`
    });
});

// Update product variant
//* Merchant accessible
router.patch('/variants/:variantId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const variantId = req.params.variantId;
    res.json({
        id: variantId,
        message: `Update product variant with the id of ${variantId}`
    });
});

// Delete product variant
//* Merchant accessible
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
//* Merchant accessible
router.post('/',(req,res,next)=>{//TODO: Add db code
    res.status(201);
    res.json({
        message:"Creating products"
    });
});

// View multiple products
//* Globally accessible
router.get('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message: `Viewing multiple products`
    });
});

// View single product
//* Globally accessible
router.get('/:productId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const productId = req.params.productId;
    res.json({
        id: productId,
        message: `Viewing single product with id of ${productId}`
    });
});

// Update product
//* Merchant accessible
router.patch('/:productId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const productId = req.params.productId;
    res.json({
        id: productId,
        message: `Updating product with id of ${productId}`
    });
});

// Delete products
//* Merchant accessible
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