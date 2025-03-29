const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const Router = express.Router();
const userController = require("../controllers/users");


Router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// sign-up form
// Router.get("/signup", userController.renderSignupForm);
// // sign-up

// Router.post(
//   "/signup",
//   wrapAsync(userController.signup)
// );

// log-in form


Router.route("/login")
  .get(userController.renderLoginForm)
  .post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }), userController.login);



// Router.get("/login", userController.renderLoginForm);

// // log-in

// Router.post(
//   "/login",
//   saveRedirectUrl, 
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

// logout

Router.get("/logout", userController.logout);
module.exports = Router;
