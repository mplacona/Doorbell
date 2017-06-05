const express = require('express');
const twilio = require('twilio');

const PORT = process.env.PORT || 3000;

let app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.all('/greeting', (req, res) => {
    let twiml = new twilio.TwimlResponse();
    twiml.say("There's someone at the door", { voice: "alice" });
    res.type("text/xml");
    res.send(twiml.toString());
});

app.get('/call', (req, res) => {
    let client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    let greetingUrl = `${req.protocol}://${req.get('host')}/greeting`;
    console.log(greetingUrl)

    client.calls.create({
        url: greetingUrl,
        to: process.env.MY_NUMBER,
        from: "+37167859942"
    },(err, call) => {
        console.log(err);
        res.send(call.sid);
    });
});

app.listen(PORT, () => {
    console.log(`Doorbell listening on port ${PORT}`);
});
