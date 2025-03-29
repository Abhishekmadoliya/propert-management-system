const Listing = require("./models/listing");
const Review = require("./models/review");
const expressError = require("./utils/expressErrors.js");
const { listingSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
         req.session.redirectUrl = req.originalUrl
        req.flash("error","you must be logged in to Create listing");
        return res.redirect("/login")
      }
      next()
}


module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;

  }
  next()
}

module.exports.isOwner= async (req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "Only the owner of this listing can make changes. You do not have permission to edit it."
);
    return res.redirect(`/listings/${id}`);
  }
  next()
}


module.exports.validateListing = (req, res, next) => {
  try {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(",");
      throw new expressError(400, message);
    }
    next();
  } catch (err) {
    next(err);
  }
};


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
      const message = error.details.map((el) => el.message).join(",");
      throw new expressError(400, message);
  }
  next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { id, review_id } = req.params;
    const review = await Review.findById(review_id);
    
    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
    }
    
    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You don't have permission to delete this review");
      return res.redirect(`/listings/${id}`);
    }
    
    next();
  } catch (err) {
    next(err);
  }
};