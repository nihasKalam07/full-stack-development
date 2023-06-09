const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const options = {
        method: "POST",
        auth: "YOUR MAIL CHIMB API KEY" // 8489f2eb25aa4b3208f66c4a0b039793-us13
    }

    const listId  = "YOUR MAIL CHIMB LIST ID" //afd54ed681
    const url = "https://us13.api.mailchimp.com/3.0/lists/" + listId;

    const request = https.request(url, options, function (response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            const result = JSON.parse(data);
            console.log(result);

        });

        response.on('end', () => {
            console.log('No more data in response.');
        });


    });

    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });


    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function (response) {
    console.log("Server is running on port 3000");
});