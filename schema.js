// joi is a library that allows you to
//  create blueprints or schemas for
// JavaScript objects (an object that stores information) to ensure validation of key information. Joi is very useful for API validation as it allows you to ensure that you are receiving the right
//  data from the client side. Joi is also useful for validating data before saving it to a database. Joi is a very powerful tool that can be used to validate any kind of data.

// and joi is a library that allow
// TO validate the data that is coming
// from the client side. Joi is a library that allows you to create blueprints or schemas for JavaScript objects (an object that stores information) to ensure validation of key information. Joi is very useful
//  for API validation as it allows you to ensure that you are receiving the right data from the client side. Joi is also useful for validating data before saving it
//  to a database. Joi is a very powerful tool that can be used to validate any kind of data.
const joi = require("joi");
const review = require("./models/review");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      country: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.object({
        filename: joi.string().allow("").optional(),
        url: joi.string()
          .uri()
          .required()
          .messages({ "string.uri": "Invalid image URL." }),
      }).optional(),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});
