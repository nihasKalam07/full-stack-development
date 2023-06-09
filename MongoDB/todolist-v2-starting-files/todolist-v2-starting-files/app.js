//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB running on local host.
// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
//   useNewUrlParser: true,
// });

// Connecting to database hosted on MongoDB Atlas cloud
mongoose.connect(
  "mongodb+srv://admin-nihas:Test123@cluster0.bzstltw.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);

const itemsSchema = mongoose.Schema({
  name: String,
});

// Remember the mongoose model would be nornally start with the capital letter.
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Learn web",
});

const item2 = new Item({
  name: "Learn DSA",
});

const item3 = new Item({
  name: "Learn Flutter",
});

const defaultItems = [item1, item2, item3];

const listSChema = mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = new mongoose.model("List", listSChema);

function insertDefaultItems() {}

app.get("/", function (req, res) {
  // mongoose find() returns a list of items
  Item.find({})
    .then((docs) => {
      if (docs.length === 0) {
        // insert multiple items using mongoose.
        Item.insertMany(defaultItems)
          .then((docs) => {
            console.log(docs, "SUCCESSfully saved the default items.");
          })
          .catch((err) => {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: docs });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  const listName = req.body.list;
  const item = new Item({ name: req.body.newItem });
  console.log(listName);
  if (listName === "Today") {
    // save items using mongoose.
    item.save();
    res.redirect("/");
  } else {
    // find one with a query.
    List.findOne({ name: listName })
      .then((foundList) => {
        if (foundList) {
          foundList.items.push(item);
          foundList.save();
        }
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    // delete an item by id using mongoose.
    Item.findByIdAndRemove({ _id: checkedItemId })
      .then((result) => {
        console.log(result, "deleted");
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  } else {
    List.findOneAndUpdate(
      // find the list with the name = listName
      { name: listName },
      // Then the next step is how are we going to update it. Here
      // The  $pull operator removes from an existing array all instances of
      // a value or values that match a specified condition. Here array name is
      // "items" and from the "items array", the items with the id = checkedItemId
      // will be removed and provide us the updated list. There is also a $pulls
      //  parameter also available.
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then((updatedList) => {
        console.log(updatedList);
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// Providing here the expresss route parameter.
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  console.log(customListName);

  // mongoose findOne method gives a single item object whereas find() returns a list of items
  List.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        const defaultList = new List({
          name: customListName,
          items: defaultItems,
        });
        defaultList.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
