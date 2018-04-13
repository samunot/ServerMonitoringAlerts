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

## Questions

### Design Considerations

I had to design the server in a way that it can modify alerts and actions dynamically. It wouldn't make sense to manually change the config file by logging into the server. Hence I exposed two API routes to achieve that. After changing the values or action it had to handled in a way that the server reads the modified changes. So after write to the config file, I read the file again so that if a request comes after the write, it can refer the new config file. Wrong actions were handled by printing a message on the console so that required action could be taken (this can be modified to a different kind of alert rather than outputting it to console)

### Configuration consideration

As I mentioned earlier, I chose this way to define my configuration because it makes the server dynamic and more responsive to change. Server doesn't have to be stopped plus you get the new changes. 

### Performance/Scalability bottlenecks

There would be bottlenecks when you get high amount of writes and reads. We would be writing config file and there is a chance that it will do a dirty read for /events api call. I would suggest to move this configuration to PostgreSQL where we can attain consistency and high level of concurreny control. To avoid bottle neck I would suggest to implement a heartbeat mechanism which will read the new changes
to the configuration after some interval (Say, 30 seconds) which will unblock bottlenecks.
Scalibility can be increased by creating a cluster of worker process, node provides a package [express-cluster]( https://www.npmjs.com/package/express-cluster) which creates N number of workers ( N is the number of cores the system has). In this way we can achieve lower latency and high scalability.

















