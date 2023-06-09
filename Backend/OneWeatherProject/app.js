const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    sendWeatherData(res, "London");
   
});

app.get("/searchByCity", function (req, res) {
   res.sendFile(__dirname + "/index.html");
});

app.post("/searchByCity", function (req, res) {
    const cityName = req.body.cityName
    sendWeatherData(res, cityName);
});

app.listen(3000, function () {
    console.log("Server running on port 3000");
});

function sendWeatherData(res, cityName ){
    const query = cityName;
    const apiKey = "YOUR ONE WEATHER API KEY";//7e89427ad299007d398e6298df36a407
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;
    https.get(url, function (response) {
        console.log(response.statusCode);
        //data is similar to the actual response body
        response.on("data", function (data) {
            // Parse Json from data. In Flutter the function 
            // equivalent to JSON.parse is jsonDecode(response.body)
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon
            const imageUrl = " http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h1>The temperature in " + cityName + " is " + temp + "</h1>");
            res.write("<p>The weather is currently " + description + "</p>");
            res.write("<img src=" + imageUrl + " ></img>");
            res.send();
        });
    });
}