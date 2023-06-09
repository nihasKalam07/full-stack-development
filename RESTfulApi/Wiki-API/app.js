const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

//the model name should always start with the capital letter. Mongoose will
// convert this into lowercase and plural.
const Article = mongoose.model("Article", articleSchema);

// app.get("/articles", function (req, res) {
//   Article.find({})
//     .then((articles) => {
//       // send data to browser
//       res.send(articles);
//     })
//     .catch((err) => {
//       res.send(err);
//     });
// });

// app.post("/articles", function (req, res) {
//   const article = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });
//   article
//     .save()
//     .then((article) => {
//       // send data to browser
//       res.send("Successfully saved the article.");
//     })
//     .catch((err) => {
//       res.send(err);
//     });
// });

// app.delete("/articles", function (req, res) {
//   Article.deleteMany({})
//     .then((article) => {
//       res.send("Successfully deleted all the article.");
//     })
//     .catch((err) => {
//       res.send(err);
//     });
// });

///////////////Request targeting all articles////////////////

// Using express routes.
// You can create chainable route handlers for a route path by using app.route().
// Because the path is specified at a single location,
// creating modular routes is helpful, as is reducing redundancy and typos
app
  .route("/articles")

  .get(function (req, res) {
    Article.find({})
      .then((articles) => {
        // send data to browser
        res.send(articles);
      })
      .catch((err) => {
        res.send(err);
      });
  })

  .post(function (req, res) {
    const article = new Article({
      title: _.capitalize(req.body.title),
      content: req.body.content,
    });
    article
      .save()
      .then((article) => {
        // send data to browser
        res.send("Successfully saved the article.");
      })
      .catch((err) => {
        res.send(err);
      });
  })

  .delete(function (req, res) {
    Article.deleteMany({})
      .then((article) => {
        res.send("Successfully deleted all the article.");
      })
      .catch((err) => {
        res.send(err);
      });
  });

////////Request targeting a specific article////////////////
app
  .route("/articles/:articleTitle")

  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle })
      .then((article) => {
        if (article) {
          res.send(article);
        } else {
          res.send("No article matching that title was found");
        }
      })
      .catch((err) => {
        res.send("No article matching that title was found");
      });
  })

  // PUT get the req params to find the document and req body to get the updates
  .put((req, res) => {
    Article.replaceOne(
      // condtions
      { title: req.params.articleTitle },
      // Updates
      { title: req.body.title, content: req.body.content },
      // overwrite
      // If we update the document using MongoDB then the {overwrite: true} is
      // already enabled. It will overwrite things if you don't
      // include all of the fields in your {update}. But by using Mongoose, it deems
      // it necessary to prevent this overwriting. So, by default, Mongoose will
      // prevent properties being overwritten and deleted.
      // However overwrite when set to true, replaces the whole document
      // by the info provided.
      // If we miss to provide a field in the model, that field will become empty
      // since the put method replaces the entire object with the available fields.
      { overwrite: true }
    )
      .then((article) => {
        if (article) {
          res.send("Successfully updated the article.");
        } else {
          res.send("No article matching that title was found");
        }
      })
      .catch((err) => {
        res.send("No article matching that title was found");
      });
  })

  // $set flag which tells MongoDB only update the fields that we have provided
  // updates for. Also we no longer have the overwrite property set to true.
  .patch((req, res) => {
    Article.findOneAndUpdate(
      // condtions
      { title: req.params.articleTitle },
      // Updates. We don't have to provide separate fields. Instead req.body is
      // enough. findOneAndUpdate method will update only the available updates.
      { $set: req.body }
    )
      .then((article) => {
        if (article) {
          res.send("Successfully updated the article.");
        } else {
          res.send("No article matching that title was found");
        }
      })
      .catch((err) => {
        res.send("No article matching that title was found");
      });
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle })
      .then((count) => {
        if (count) {
          res.send("Successfully deleted the article.");
        } else {
          res.send("No article matching that title was found");
        }
      })
      .catch((err) => {
        res.send("No article matching that title was found");
      });
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
