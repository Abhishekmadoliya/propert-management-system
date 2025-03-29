const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: Object,
    default: {
      filename: "default.jpg",
      url: "https://plus.unsplash.com/premium_photo-1686090449192-4ab1d00cb735?w=500&auto=format&fit=crop&q=60",
    },
  },
  price: Number,
  location: String,
  country: String,

  reviews: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    default: [], // Default to an empty array if no reviews are provided
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
