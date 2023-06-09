const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const items = ["Buy Food", "Eat Food", "Cook Food"];
const workItems = [];

app.get("/", function (req, res) {
    res.render("list", { listTitle: date.getDate(), newListItems: items });
});

//Here the redirect function actually calls the app.get("/", function (req, res) {}
app.post("/", function (req, res) {
    console.log(req.body);
    const newItem = req.body.newItem;
    if (req.body.list === "Work") {
        workItems.push(newItem)
        res.redirect("/work");
    } else {
        items.push(newItem);
        res.redirect("/");
    }
   
});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });

});

app.get("/about", function(req, res){
 res.render("about");
});

app.post("/work", function (req, res) {
    console.log(req.body);
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});