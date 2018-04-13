var express = require("express");
var myParser = require("body-parser");

var nodemailer = require('nodemailer');
const { WebClient } = require('@slack/client');
var configFile = "./config.json"
var config = require(configFile)

var fs = require("fs");
var jira = require('create-jira-ticket-api');

const web = new WebClient(config.slack.token);
var transporter = nodemailer.createTransport(config.email);

function alertAction(n, element) {
    switch (n) {
        case 1:
            config.mailOptions.subject = `${element.type} usage over ${config.alertValues[element.type]}`
            transporter.sendMail(config.mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            break;
        case 2:
            web.chat.postMessage({ channel: config.slack.conversationID, text: `${element.type} usage over ${config.alertValues[element.type]}`, as_user: "shubham" })
                .then((res) => {
                    // `res` contains information about the posted message
                    console.log('Message sent: ', res.ts);
                })
                .catch(console.error);
            break;
        case 3:
            jira.post(config.jiraOptions, function(response) {
                // 
            });
            break;
        default:
            console.log(`${element.type} has a wrong action set. Please check config.json for further details.`)
            break;
    }
}

var app = express();
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());


app.put("/events", function(request, response) {
    query = request.body
    console.log(query)
    query.forEach(element => {
        if (element.value >= config.alertValues[element.type]) {
            config.eventAction[element.type].forEach(act => {
                alertAction(config.action[act], element)
            })
        }

    });
    response.send("Done");
});


app.put("/changeActions", function(request, response) {
    query = request.body
    query.forEach(element => {
        config.eventAction[element.type] = element.action
    });
    fs.writeFile(configFile, JSON.stringify(config), function(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(config));
        console.log('writing to ' + configFile);
    });
    config = require(configFile);
    response.send("Done");

});

app.put("/changeAlertValues", function(request, response) {
    query = request.body
    console.log(query)
    query.forEach(element => {
        config.alertValues[element.type] = element.value
    });
    fs.writeFile(configFile, JSON.stringify(config), function(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(config));
        console.log('writing to ' + configFile);
    });
    config = require(configFile);
    response.send("Done");
});

app.listen(5000)