const express = require("express");
const Router = express.Router({ mergeParams: true }); // Add mergeParams
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressErrors.js");
const Listing = require("../models/listing.js");
const Review = require('../models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
//review controller
const reviews = require("../controllers/reviews.js");
// Validation middleware


// Review post route
Router.post("/",
    isLoggedIn,
     validateReview, 
    wrapAsync( reviews.createReview))
;

// Delete review route - ensure middleware order
Router.delete("/:review_id",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviews.deleteReview));

module.exports = Router;