const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/checkAuth");
const Ownership = require("../middleware/entityOwnership");
const review = require("../modules/reviews/reviews");

/* REVIEW REPLY ENDPOINTS 
Added here to avoid request param overlap with review/:attribute
*/
// Create review reply ~ reply to a review
//* Logged in user accessible
router.post("/replies", CheckAuth.userLoggedIn, (req, res, next) => {
    review.createdReviewReply(req.userData.id, req.body.data, (response => {
        return res.status(response.statusCode).json(response);
    }));
});

// View multiple review replies
//* Globally accessible
router.get("/review-replies/:reviewId", (req, res, next) => {
    review.getReviewReplies(req.params.reviewId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View single reply
//* Globally accessible
router.get("/replies/:replyId", (req, res, next) => {
    review.getSingleReviewReply(req.params.replyId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update reply
//* Logged in user accessible
router.patch("/replies/:replyId", CheckAuth.userLoggedIn, Ownership.reviewReplyBelongsToUser, (req, res, next) => {
    review.updateReviewReply(req.params.replyId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete reply
//* Logged in user accessible
router.delete("/replies/:replyId", CheckAuth.userLoggedIn, Ownership.reviewReplyBelongsToUser, (req, res, next) => {
    review.deleteReviewReply(req.params.replyId, response => {
        return res.status(response.statusCode).json(response);
    });
});

/* REVIEW ENDPOINTS */
// Create review
//* Logged in user accessible
router.post("/", CheckAuth.userLoggedIn, (req, res, next) => {
    review.createReview(req.userData.id, req.body.data, (response => {
        return res.status(response.statusCode).json(response);
    }));
});

// View product reviews
//* Globally accessible
router.get("/product/:productId", (req, res, next) => {
    review.getProductReviews(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View single review
//* Globally accessible
router.get("/:reviewId", (req, res, next) => {
    review.getSingleReview(req.params.reviewId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update review
//* Logged in user accessible
router.patch("/:reviewId", CheckAuth.userLoggedIn, Ownership.reviewBelongsToUser, (req, res, next) => {
    review.updateReview(req.params.reviewId, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete review
//* Logged in user accessible
router.delete("/:reviewId", CheckAuth.userLoggedIn, Ownership.reviewBelongsToUser, (req, res, next) => {
    review.deleteReview(req.params.reviewId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;