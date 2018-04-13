# Server Performance Monitoring and Alerts

## Steps to run the server

1. Install node.js if not installed already.

`./install-nodejs.sh`

2. Install npm packages required.

`npm install`

3. Start the server.

`node server.js`

## Config file

This file contains all the necessary conditions and paramters to run the server. Email, Slack, JiraOptions can be set here. I have added
an insecure dummy email account just to try out and a dummy slack acount with a channel 'critical-alerts' (Ideally token should not be
present in the config file but for assignment purposes I have kept in that way). I can add you to that slack for testing purposes.

The config file also has eventAction which is actions defined if that event surpasses the alert value. I have set that as an array of 
actions. It also has alertValues which are values set for an event if surpassed an action is taken.

## API

1. /events:

This API takes an array of events and alert if any event has surpassed the alertValue.

2. /changeActions:

This API takes an array of JSON objects (event and action) where each event might have multiple actions. It will then modify the config
file and new actions would be triggered henceforth.

3. /changeAlertValues:

This API takes an array of JSON objects (event and alert value) where each event has a new alert value. It will then modify the config 
file with these values and actions would be triggered if event passes these new values.


