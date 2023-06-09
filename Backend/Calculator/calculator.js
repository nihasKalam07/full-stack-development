const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var result = num1 + num2;
    res.send("The result of the calculation is " + result);
});


app.get("/bmicalculator", function (req, res) {
    res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmicalculator", function (req, res) {
    var height =Number(req.body.height / 100);
    var weight = Number(req.body.weight);
    var bmi = weight / Math.pow(height, 2);

    res.send("Your BMI is " + Math.round(bmi));
});

app.listen(3000, function () {
    console.log("server started on port 3000");
});