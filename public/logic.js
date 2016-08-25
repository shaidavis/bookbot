//ISBNs to test:
//9781407017013 - no image
//9780785163374 - Ender's Game
//9780605039070 - Harry Potter Deathly Hollows
//978-0-3-4---5497420 - New York: A Novel with 'dirty' ISBN
//9788474104639 - James and the Giant Peach - Not English, no image

var request = require('request');


var convo = {}



function search(ISBN, recipientId) {
  console.log("ISBN is", ISBN)
  request({
    uri: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + ISBN,
    method: 'GET'
  }, function (error, response, body) {
    var parsedBody = JSON.parse(body)
    
    if (!error && response.statusCode == 200 && parsedBody.totalItems>0) {

    console.log("body", body)
    console.log("body type", typeof body)
    console.log("body is", parsedBody)
    // console.log("body is type", typeof parsedBody)
    var title = parsedBody.items[0].volumeInfo.title

    if (parsedBody.items[0].volumeInfo.authors !== undefined) {
      var author = " by " + parsedBody.items[0].volumeInfo.authors
    } 
    else { 
      var author = ""
    } 


    if (parsedBody.items[0].volumeInfo.description !== undefined) {
      
      if (parsedBody.items[0].volumeInfo.description.length <= 150) {
        var rawDescription = parsedBody.items[0].volumeInfo.description
        var description = "\n" + "Description:" + "\n" + rawDescription + "\n" + "\n"
      } else {
          var rawDescription = parsedBody.items[0].volumeInfo.description.substring(0,150)
          var description = "\n" + "Description:" + "\n" + rawDescription + "..." + "\n"  + "\n"
      } 
    } else {
        var description = "" + "\n"
    }

    if (parsedBody.items[0].volumeInfo.imageLinks !== undefined) {
      var imageURL = parsedBody.items[0].volumeInfo.imageLinks.smallThumbnail
      sendImage(recipientId, imageURL)
    } else {
      var imageURL = "no image found"
    }


    
    // var bookInfoReply = image 
    var bookInfoReply = "📖 The book you are looking for is " + "'" + title + "'" + author + "\n" + description + "Hit me with another!" 

    } else {
      bookInfoReply = "😞 Couldn't find that book. Please use a valid ISBN"
    }

    setTimeout(function (){sendTextMessage(recipientId, bookInfoReply)}, 500)
    


  });


}


function getReplyBasedOnMessage(senderID, message){
  if (convo.senderID) { //if the convo.senderID exists, it means this user has already begun a conversation with the bot
    console.log("conversation exists with ", senderID)
    convo.senderID.push(message)
    var lastMsg = convo.senderID[convo.senderID.length-1]
    lastMsg.toLowerCase()
    
    var ISBN = message
    ISBN = ISBN.replace(/-/g, "");


    // if (typeof(lastMsg)==='number' && lastMsg.length === 13){
    //  ISBN = lastMsg
    // }
    search(ISBN, senderID)

    


  } else { //there is no convo with this sender's ID
    console.log("new conversation started with " + senderID)
    convo.senderID = [message] //create a new convo object with this user, with the message as the first item in the array
    
    var sendISBN = "👋 Hey there! I'm BookBot. Give me the ISBN of a book!"
    sendTextMessage(senderID, sendISBN)
    
  }


}


function sendTextMessage(recipientId, messageText) {
  

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}


function sendImage(recipientId, imageURL) {
  console.log("HI from send image function")
  var imageMessageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: 
        {url: imageURL}
      }
    }
  }
  callSendAPI(imageMessageData);
}





function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: "EAAXOQ5dPZAmIBAHg0eyWNeZCTv7H7Nl3GQPMsdzkf6Ug3krztK9FosZBChZAvEWcxH9a8jAzGZCxXOxVYZA63QPnohDSVGKpXBdZC6hxrw3vqKRwajvKOUjkFkrsSCSqRxPsl1ZA9asZC2TT1lZA2vhYl0LNTfvkReusUZD" },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) { console.log("Successfully sent message");
    } else {console.error("Unable to send message.");console.error(response);console.error(error);}
  });  
}


module.exports = {
    getReplyBasedOnMessage: getReplyBasedOnMessage,
    sendTextMessage: sendTextMessage,
    callSendAPI: callSendAPI
}