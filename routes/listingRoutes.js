const express = require("express");
const Router = express.Router();

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressErrors.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
//controller
const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })


//index route and create route
Router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    
    isLoggedIn,
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );
  


//index route
// Router.get("/", wrapAsync(listingController.index));

//new route - should be before :id route
Router.get("/new", isLoggedIn, listingController.renderNewForm);

Router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
)

//show route - fix parameter format
// Router.get("/:id", wrapAsync(listingController.showListing));

// create route
// Router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

//show route and update route


//edit route

Router.get(
  "/:id/edit",

  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//update route
// Router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

//detele route

Router.delete(
  "/:id",
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.deleteListing)
);

module.exports = Router;
