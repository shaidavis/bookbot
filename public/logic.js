var request = require('request');
// var bodyParser = require('body-parser');
// var google = require('googleapis');
// var bodyParser = require('body-parser');


var convo = {}

// books(v1).books.volumes.get(params, callback)



function search(ISBN, recipientId) {
//   request({
//     uri: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + ISBN,
//     method: 'GET',
    
//   }, function (error, response, body) {
//     console.log("this is my body(and I like it)" + JSON.parse(body))
//     if (!error && response.statusCode == 200) { 
//       var book = {
//         title: body.items[0].volumeInfo.title,
// //         // image: data.items.volumeInfo.imageLinks.thumbnail,
// //         // author: data.items.volumeInfo.authors,
// //         // pageNo: data.items.volumeInfo.pageCount,
// //         // description: data.items.volumeInfo.description,
// //         // language: data.items.volumeInfo.language,
// //         // category: data.items.volumeInfo.categories
//        }
//        console.log("Successfully found book" + body);
//        return "Your book title is " + book.title 

//     } else {console.error("Unable to send message.");console.error(response);console.error(error);}
//   }); 

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

    if (parsedBody.items[0].volumeInfo.authors !== null) {
      var author = parsedBody.items[0].volumeInfo.authors
    } else { 
      var author = "Unknown"
    } 


    if (parsedBody.items[0].volumeInfo.description !== undefined) {
      var description = parsedBody.items[0].volumeInfo.description
      if (description.length > 200) {
        var description = description.substring(0,200)
        };
    } else {
      var description = "Description unavailable"
    }

    var bookInfoReply = "The book you are looking for is " + title + " by " + author + "\n" + "\n" + "Description:" + "\n" + description + "\n" + "\n" + "Hit me with another!"
    
    } else {
      bookInfoReply = "Couldn't find that book. Please use a valid ISBN"
    }
   
    

    sendTextMessage(recipientId, bookInfoReply)
    if (!error && response.statusCode == 200) { 
      console.log("Successfully sent message"); 
      
    } else {
        console.error("Unable to send message.");
        console.error(response);
        // console.error(error);
  }
  });


}


function getReplyBasedOnMessage(senderID, message){
  if (convo.senderID) { //if the convo.senderID exists, it means this user has already begun a conversation with the bot
    console.log("conversation exists with ", senderID)
    convo.senderID.push(message)
    var lastMsg = convo.senderID[convo.senderID.length-1]
    lastMsg.toLowerCase()

    var ISBN = message;

    // if (typeof(lastMsg)==='number' && lastMsg.length === 13){
    //  ISBN = lastMsg
    // }
    search(ISBN, senderID)

    


  } else { //there is no convo with this sender's ID
    console.log("new conversation started with " + senderID)
    convo.senderID = [message] //create a new convo object with this user, with the message as the first item in the array
    
    var sendISBN = "Hey there! I'm BookBot. Give me the ISBN of a book!"
    sendTextMessage(senderID, sendISBN)
    // return "Hey there! I'm BookBot. Give me the ISBN of a book!"
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