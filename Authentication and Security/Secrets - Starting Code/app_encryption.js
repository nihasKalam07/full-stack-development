//Using mongoose-encryption
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// Use encryption
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = mongoose.Schema({
  email: String,
  password: String,
});

// Apply mongoose-encrypt before creating the model. Schemas are pluggable,
// that is, they allow for applying pre-packaged capabilities to extend their
//  functionality. This is a very powerful feature.
// You can also specify exactly which fields to encrypt with the
// encryptedFields option.
// Mongoose encrypts when they save and decrypts when they find.
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")

  .get((req, res) => {
    res.render("login");
  })

  .post((req, res) => {
    User.findOne({ email: req.body.username })
      // Here Mongoose find decrypted password in case if we use encryption
      .then((foundUser) => {
        if (foundUser.password === req.body.password) {
          res.render("secrets");
        } else {
          res.send("User not found");
        }
      })
      .catch((err) => {
        res.send("User not found");
      });
  });

app
  .route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser
      // Here Mongoose save encrypted password
      .save()
      .then(() => {
        // We  are not providing any separate route for Secrets page like login
        // and Register. We are allowing the user to go to the Secret page
        // only after successful login/registration
        res.render("secrets");
      })
      .catch(() => {
        res.send(err);
      });
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
