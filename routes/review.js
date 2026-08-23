const express = require('express');
const router = express.Router({mergeParams: true});
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');

const reviewController = require('../controllers/reviews.js');

// Review Route: Route to submit a review to a listing
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Route for Reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;