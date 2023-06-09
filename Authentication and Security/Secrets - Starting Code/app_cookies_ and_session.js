require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// passport-local package needs to be used by the passport-local-mongoose package
// passportLocalMongoose hash and salt passwords automatically.

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//Tell the app to use session package
app.use(
  session({
    secret: "My little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
// initialize passport and use it to manage our session
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = mongoose.Schema({
  email: String,
  password: String,
});

// set passportLocalMongoose to Use Schema. passportLocalMongoose hash and salt
// passwords automatically.
// and save it to database.
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
// Passport use local login strategy
passport.use(User.createStrategy());
// use static serialize and deserialize of model for passport session support.
// In a typical web application, the credentials used to authenticate a user will
// only be transmitted during the login request. If authentication succeeds,
// a session will be established and maintained via a cookie set in the
// user's browser. Each subsequent request will not contain credentials,
// but rather the unique cookie that identifies the session. In order to
// support login sessions, Passport will serialize and deserialize user instances
//  to and from the session. That is, serialize  allows the passport to stuff
// the user identification details into the cookie and deserialize allows the
//  passport to crumble the cookie and discover the user identification details.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/secrets", (req, res) => {
  // Passport session check for logined user
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  // Passport session logout
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app
  .route("/login")

  .get((req, res) => {
    res.render("login");
  })

  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      passport: req.body.passport,
    });

    // Passport-Local Mongoose user login
    req.login(user, (err) => {
      if (err) {
        console.log(err);
      } else {
        // Here strategy defined as local and authenticate. This sends a cookie
        // to the browser and say to it that hold on to this cookie and
        // use it to authenticate the user. The cookie will contain the user
        // identification details.
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    });
  });

app
  .route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    // Passport-Local Mongoose user registration
    User.register(
      { username: req.body.username }, //username
      req.body.password, //password
      (err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          // Here strategy defined as local and authenticate. This sends a cookie
          // to the browser and say to it that hold on to this cookie and
          // use it to authenticate the user. The cookie will contain the user
          // identification details.
          passport.authenticate("local")(req, res, () => {
            res.redirect("/secrets");
          });
        }
      }
    );
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
