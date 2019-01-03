const express = require('express');
const router = express.Router();

/* REVIEW REPLY ENDPOINTS 
Added here to avoid request param overlap with review/:attribute
*/
// Create review reply ~ reply to a review
router.post('/replies',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message:"Creating reply"
    });
});

// View multiple review replies
router.get('/replies',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message: `Viewing multiple review replies`
    });
});

// View single reply
router.get('/replies/:replyId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const replyId = req.params.replyId;
    res.json({
        id: replyId,
        message: `Viewing single reply with id of ${replyId}`
    });
});

// Update reply
router.patch('/replies/:replyId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const replyId = req.params.replyId;
    res.json({
        id: replyId,
        message: `Updating reply with id of ${replyId}`
    });
});

// Delete reply
router.delete('/replies/:replyId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const replyId = req.params.replyId;
    res.json({
        id: replyId,
        message: `Deleting reply with id of ${replyId}`
    });
});

/* REVIEW ENDPOINTS */
// Create review
router.post('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message:"Creating review"
    });
});

// View multiple reviews
router.get('/',(req,res,next)=>{//TODO: Add db code
    res.status(200);
    res.json({
        message: `Viewing multiple reviews`
    });
});

// View single review
router.get('/:reviewId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const reviewId = req.params.reviewId;
    res.json({
        id: reviewId,
        message: `Viewing single review with id of ${reviewId}`
    });
});

// Update review
router.patch('/:reviewId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const reviewId = req.params.reviewId;
    res.json({
        id: reviewId,
        message: `Updating review with id of ${reviewId}`
    });
});

// Delete review
router.delete('/:reviewId',(req,res,next)=>{//TODO: Add db code
    res.status(200);

    const reviewId = req.params.reviewId;
    res.json({
        id: reviewId,
        message: `Deleting review with id of ${reviewId}`
    });
});

// Exports
module.exports = router;