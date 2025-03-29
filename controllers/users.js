const User = require("../models/user");
const passport = require("passport");


module.exports.renderSignupForm =  (req, res) => {
    res.render("user/signup");
  };

module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      const registerdUser = await User.register(newUser, password);
      console.log(registerdUser);
      req.login(registerdUser,(err)=>{
          if (err) {

           return next(err)
          }
          req.flash("success", "welcome to Hostals")
          res.redirect("/listings")
      })
      
    } catch (e) {
      console.log(e);
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login");
  }


  module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Hostals");
    let redirectUrl =  res.locals.redirectUrl || `/listings`
    res.redirect(  redirectUrl);
  }

  module.exports.logout =(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "you are succesfully logged out");
        res.redirect("/listings")
    })
}