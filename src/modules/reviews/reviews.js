const Review = require("../../models/reviews/review");
const ReviewReply = require("../../models/reviews/reply");

const Api = require("../../lib/api");
const FeedbackMessages = require("../../lang/feedbackMessages");

/* 
   REVIEW HELPERS
*/
function _getReviewsByFilter(filter, callback) {
    filter = filter || {};
    Review.find(filter)
        .populate("user", "firstName lastName")
        .then(reviewsFound => {
            const reviewCount = reviewsFound.length;
            const isOk = reviewCount > 0;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFoundWithCount(reviewsFound, `review`) : FeedbackMessages.itemNotFound(`Review`);

            return callback(
                Api.getResponse(isOk, message, {
                    count: reviewCount,
                    reviews: reviewsFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed(`get reviews`), err)
            );
        });
}

function _getSingleReviewByFilter(filter, callback) {
    filter = filter || {};
    Review.findOne(filter)
        .populate("user", "firstName lastName")
        .then(reviewFound => {
            const statusCode = reviewFound ? 200 : 404;
            const message = reviewFound ? FeedbackMessages.itemsFound(`Review`) : FeedbackMessages.itemNotFound(`Review`);

            return callback(
                Api.getResponse(isOk, message, reviewsFound, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed(`get reviews`), err)
            );
        });
}

/* 
    REVIEW REPLIES HELPER
*/
function _getReviewRepliesByFilter(filter, callback) {
    filter = filter || {};
    ReviewReply.find(filter)
        .populate("user", "firstName lastName")
        .then(reviewsFound => {
            const reviewCount = reviewsFound.length;
            const isOk = reviewCount > 0;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFoundWithCount(reviewsFound, `review`) : FeedbackMessages.itemNotFound(`Review`);

            return callback(
                Api.getResponse(isOk, message, {
                    count: reviewCount,
                    reviews: reviewsFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed(`get reviews`), err)
            );
        });
}

function _getSingleReviewReplyByFilter(filter, callback) {
    filter = filter || {};
    ReviewReply.findOne(filter)
        .populate("user", "firstName lastName")
        .then(reviewFound => {
            const statusCode = reviewFound ? 200 : 404;
            const message = reviewFound ? FeedbackMessages.itemsFound(`Review`) : FeedbackMessages.itemNotFound(`Review`);

            return callback(
                Api.getResponse(isOk, message, reviewsFound, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed(`get reviews`), err)
            );
        });
}

// Create review
module.exports.createReview = (userId, reviewData, callback) => {
    reviewData.user = userId;
    const review = new Review(reviewData);

    review.save().then(reviewCreated => {
        return callback(
            Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully(`Review`), reviewCreated)
        );
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`create review`), err)
        );
    });
};

// Get product reviews
module.exports.getProductReviews = (productId, callback) => {
    return _getReviewsByFilter({
        product: productId
    }, callback);
};

// Get single review
module.exports.getSingleReview = (reviewId, callback) => {
    return _getSingleReviewByFilter({
        _id: reviewId
    }, callback);
};

// Update review
module.exports.updateReview = (reviewId, updateData, callback) => {
    Review.findByIdAndUpdate(reviewId, updateData).then(reviewFound => {

        if (reviewFound) {
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`review`))
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Review`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`update review`), err)
        );
    });
};

// Delete review
module.exports.deleteReview = (reviewId, callback) => {
    return Review.findByIdAndDelete(reviewId).then((reviewDeleted) => {

        if (reviewDeleted) {
            return callback(
                Api.getResponse(true, FeedbackMessages.itemDeletedSuccessfully("review"))
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Review`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`delete review`), err)
        );
    });
};

// Create review reply
module.exports.createReviewReply = (userId, replyData, callback) => {
    replyData.user = userId;
    const reviewReply = new ReviewReply(replyData);

    reviewReply.save().then(replyCreated => {
        return callback(
            Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully(`Review reply`), replyCreated)
        );
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`create review reply`), err)
        );
    });
};

/* 
    REVIEW REPLIES
*/
// Get replies belonging to a specific review
module.exports.getReviewReplies = (reviewId, callback) => {
    return _getReviewRepliesByFilter({
        review: reviewId
    }, callback);
};

// Get review reply
module.exports.getSingleReviewReply = (replyId, callback) => {
    return _getSingleReviewReplyByFilter({
        _id: replyId
    }, callback);
};

// Update review reply
module.exports.updateReviewReply = (replyId, updateData, callback) => {
    ReviewReply.findByIdAndUpdate(replyId, updateData).then(replyFound => {

        if (replyFound) {
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`review reply`))
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Review reply`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`update review reply`), err)
        );
    });
};

// Delete review reply
module.exports.deleteReviewReply = (replyId, callback) => {
    return ReviewReply.findByIdAndDelete(replyId).then((replyDeleted) => {
        if (replyDeleted) {
            return callback(
                Api.getResponse(true, FeedbackMessages.itemDeletedSuccessfully("review reply"))
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Review reply`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`delete review reply`), err)
        );
    });
};