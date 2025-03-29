const Listing = require("../models/listing");

//index route
module.exports.index = async (req, res) => {
  const listing = await Listing.find({});
  res.render("listings/index", { listing });
};
//new route - should be before :id route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};
//show route - fix parameter format
module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listingid = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listingid) {
    req.flash("error", "Listing you requested for does not exits");
    res.redirect("/listings");
  }
  res.render("listings/show", { listingid });
};

module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..url and filename", filename);
    
    // const newListing = new Listing(req.body.listing);
    // newListing.owner = req.user._id;
    // await newListing.save();
    req.flash("success", "New listing created");
    // res.redirect(`/listings/${newListing._id}`);
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  try {
    const listings = await Listing.findById(id);
    if (!listings) {
      req.flash("error", "Listing you requested for does not exits");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated");
  res.redirect("/listings");
};

module.exports.deleteListing = async function (req, res) {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "listing Deleted");
  res.redirect("/listings");
};
