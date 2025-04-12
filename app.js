
if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const expressError = require("./utils/expressErrors.js");

const ListingRoutes = require("./routes/listingRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const userRoutes = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const port = 4000;
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");





app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));

const sessionOption ={
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  }
}

app.get("/", (req, res) => {
  res.render("listings/homepage");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success= req.flash("success")  // success is an key for the message
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next();
})

// app.get("/demo", async(req,res)=>{
//   let fakeuser = new User({
//     email: "student@gmail.com",
//     username: "abhishek"
//   })
//   let registeredUser  =await User.register(fakeuser,"helloworld")
//   res.send(registeredUser);
// })



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Connect to MongoDb
async function main() {
  try {
    await mongoose
      .connect("mongodb+srv://abhishekmadoliya:1GIFYE5D3XJfN8oh@clusterone.x8pdifu.mongodb.net/hostals?retryWrites=true&w=majority&appName=ClusterOne")
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("Could not connect to MongoDB", err);
      });
  } catch (err) {
    console.error("Could not connect to MongoDB", err);
  }
}

main();


app.use("/listings", ListingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});
// Error handling middleware (move to bottom of file, before app.listen)
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { err });
});

// Start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
