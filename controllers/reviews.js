const Review = require("../models/review.js");
const expressError = require("../utils/expressErrors.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  //   if (!listing) {
  //     throw new expressError(404, "Listing not found");
  //   }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created");

  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  try {
    const { id, review_id } = req.params;

    // First check if listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });

    // Delete the review
    await Review.findByIdAndDelete(review_id);

    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    req.flash("error", "Error deleting review");
    res.redirect(`/listings/${id}`);
  }
};
