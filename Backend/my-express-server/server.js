const express = require('express');
const { send } = require('express/lib/response');
const app = express();

// when we type localhost:3000 in browser, a GET request is being sent 
// to the root route of  our website(our home page) which is represented by "/".
// when that GET request happens , we can trigger a callback function which will have
// two parameters req and res. The res is the request sent by the browser and
// res is response that we are supposed to sent back.
// Parameters: Home route, callback function.
app.get("/", function (req, res) {
    res.send("<h1>Hello</h1>");
});

app.get("/contact", function (req, res) {
    res.send("COntact me at nihasna@gmail.com");
});

app.get("/about", function (req, res) {
    res.send("<div><h2>Nihas N A</h2><p>I am an IT Professional<p></div>");
});

app.get("/hobbies", function (req, res) {
    res.send("<div><h2>Hobbies</h2><ul><li>Football</li><li>Eating</li><li>Coding</li></ul></div>");
});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
