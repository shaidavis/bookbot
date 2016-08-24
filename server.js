var express = require('express');
var app = express();
console.log("STATUS: you're running server.js. don't forget to restart the server if you make changes")



var bodyParser = require('body-parser');
var request = require('request');
var chat = require("./public/logic");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());





app.get('/webhook', function (req, res) {
  console.log("Hi you got me FB")
  if (req.query['hub.verify_token'] === 'my_verify_token_here'){
    res.send(req.query['hub.challenge']);
  }
  else{res.send('Wrong token bud')}
});

app.post('/webhook', function (req, res) {
  console.log("got the message from FB")
  var data = req.body.entry[0].messaging[0];
  // console.log("data is", data)
  var message = data.message;
  var senderID  = data.sender.id;

  if (message) {
    message = message.text;
    var reply = chat.getReplyBasedOnMessage(senderID, message)
    console.log("success")
    //chat.sendTextMessage(senderID, reply)
  }
  else{console.log("Something ain't right")}
  res.sendStatus(200); //required to send FB some response, else all fails.

})





app.listen(1337)