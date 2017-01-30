const express = require('express');
const twilio = require('twilio');

let app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.all('/message', (req, res) => {
    let twiml = new twilio.TwimlResponse();
    twiml.say("There's someone at the door", { voice: "alice" });
    res.type("text/xml");
    res.send(twiml.toString());
});

app.get('/call', (req, res) => {
    let client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    let messageUrl = `${req.protocol}://${req.get('host')}/message`;
    console.log(messageUrl)

    client.calls.create({
        url: messageUrl,
        to: process.env.MY_NUMBER,
        from: process.env.TWILIO_NUMBER
    }, function(err, call) {
        console.log(call.sid);
        res.send(call.sid);
    });
});

app.listen(3000, () => {
    console.log('Doorbell listening on port 3000!');
});