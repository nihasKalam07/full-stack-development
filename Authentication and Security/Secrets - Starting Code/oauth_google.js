// OAuth using Google and Passport
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
// passport-local package needs to be used by the passport-local-mongoose package
// passportLocalMongoose hash and salt passwords automatically.
const passportLocalMongoose = require("passport-local-mongoose");
// Google Auth
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// It's the implementation of ModelName.findOrCreate method
var findOrCreate = require("mongoose-findorcreate");

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
  googleId: String,
});

// set passportLocalMongoose to Use Schema. passportLocalMongoose hash and salt
// passwords automatically.
// and save it to database.
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

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
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Google Auth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // The callback URL should be the same redirect uri that we put in the google
      // applications credential page.
      callbackURL: "http://localhost:3000/auth/google/secrets",
      // Since Google+ api is deprcated, getting data from userinfo api
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      // This findOrCreate is not a mongoose function. It'a a placeholder
      // put by the passport. We have to write methods to find or create the user
      // with the google profileId by our own. Fortunately someone already created
      // it and published it as an npm package. If the user already exists, it finds
      // from the database, else it will create a new user.
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        console.log(profile);
        return cb(err, user);
      });
    }
  )
);

app.get("/", (req, res) => {
  res.render("home");
});

// Here strategy defined as google for authentication.
// Scope  = profile includes the emaila and userId of user.
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  // This URL should be the same redirect uri that we put in the google
  // applications credential page.
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  }
);

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
