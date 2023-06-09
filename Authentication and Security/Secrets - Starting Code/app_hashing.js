// Using MD5 or bicrypt
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// Hashing
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// Use encryption

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = mongoose.Schema({
  email: String,
  password: String,
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
      .then((foundUser) => {
        // Here comparing the hash of user entered password
        // against the password saved in database

        // If using md5
        // if (foundUser.password === md5(req.body.password)) {
        //     res.render("secrets");
        //   } else {
        //     res.send("User not found");
        //   }

        // If using bcrypt
        bcrypt.compare(
          req.body.password, //plain password
          foundUser.password, //hash of password saved in database
          function (err, result) {
            if (result === true) {
              res.render("secrets");
            } else {
              res.send("User not found");
            }
          }
        );
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
    // If using bcrypt
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (!err) {
        const newUser = new User({
          email: req.body.username,
          // Hashing the password using bcrypt
          password: hash,
        });
        newUser
          .save()
          .then(() => {
            // We  are not proving any separate route for Secrets page like login
            // and Register. We are allowing the user to go to the Secret page
            // only after successful login/registration
            res.render("secrets");
          })
          .catch(() => {
            res.send(err);
          });
      } else {
        res.send(err);
      }
    });
  });

// //if use MD5
// .post((req, res) => {
//   const newUser = new User({
//     email: req.body.username,
//     //Password Hash using MD5
//     password: md5(req.body.password),
//   });
//   newUser
//     .save()
//     .then(() => {
//       // We  are not providing any separate route for Secrets page like login
//       // and Register. We are allowing the user to go to the Secret page
//       // only after successful login/registration
//       res.render("secrets");
//     })
//     .catch(() => {
//       res.send(err);
//     });
// });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
