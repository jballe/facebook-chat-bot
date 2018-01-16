/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
module.exports = function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log(
    "Received message for user %d and page %d at %d with message:",
    senderID,
    recipientID,
    timeOfMessage
  );
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log(
      "Received echo for message %s and app %d with metadata %s",
      messageId,
      appId,
      metadata
    );
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log(
      "Quick reply for message %s with payload %s",
      messageId,
      quickReplyPayload
    );

    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }

  if (messageText) {
    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText
      .replace(/[^\w\s]/gi, "")
      .trim()
      .toLowerCase()) {
      case "hello":
      case "hi":
        sendHiMessage(senderID);
        break;

      case "image":
        requiresServerURL(sendImageMessage, [senderID]);
        break;

      case "gif":
        requiresServerURL(sendGifMessage, [senderID]);
        break;

      case "audio":
        requiresServerURL(sendAudioMessage, [senderID]);
        break;

      case "video":
        requiresServerURL(sendVideoMessage, [senderID]);
        break;

      case "file":
        requiresServerURL(sendFileMessage, [senderID]);
        break;

      case "button":
        sendButtonMessage(senderID);
        break;

      case "generic":
        requiresServerURL(sendGenericMessage, [senderID]);
        break;

      case "receipt":
        requiresServerURL(sendReceiptMessage, [senderID]);
        break;

      case "quick reply":
        sendQuickReply(senderID);
        break;

      case "read receipt":
        sendReadReceipt(senderID);
        break;

      case "typing on":
        sendTypingOn(senderID);
        break;

      case "typing off":
        sendTypingOff(senderID);
        break;

      case "account linking":
        requiresServerURL(sendAccountLinking, [senderID]);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
};

/*
 * If users came here through testdrive, they need to configure the server URL
 * in default.json before they can access local resources likes images/videos.
 */
function requiresServerURL(next, [recipientId, ...args]) {
  if (SERVER_URL === "to_be_set_manually") {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: `
  We have static resources like images and videos available to test, but you need to update the code you downloaded earlier to tell us your current server url.
  1. Stop your node server by typing ctrl-c
  2. Paste the result you got from running "lt —port 5000" into your config/default.json file as the "serverURL".
  3. Re-run "node app.js"
  Once you've finished these steps, try typing “video” or “image”.
          `
      }
    };

    callSendAPI(messageData);
  } else {
    next.apply(this, [recipientId, ...args]);
  }
}

function sendHiMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: `
  Congrats on setting up your Messenger Bot!
  
  Right now, your bot can only respond to a few words. Try out "quick reply", "typing on", "button", or "image" to see how they work. You'll find a complete list of these commands in the "app.js" file. Anything else you type will just be mirrored until you create additional commands.
  
  For more details on how to create commands, go to https://developers.facebook.com/docs/messenger-platform/reference/send-api.
        `
    }
  };

  callSendAPI(messageData);
}

/*
   * Send an image using the Send API.
   *
   */
function sendImageMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + "/assets/rift.png"
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
   * Send a Gif using the Send API.
   *
   */
function sendGifMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + "/assets/instagram_logo.gif"
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
   * Send audio using the Send API.
   *
   */
function sendAudioMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "audio",
        payload: {
          url: SERVER_URL + "/assets/sample.mp3"
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
   * Send a video using the Send API.
   *
   */
function sendVideoMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "video",
        payload: {
          url: SERVER_URL + "/assets/allofus480.mov"
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
   * Send a file using the Send API.
   *
   */
function sendFileMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "file",
        payload: {
          url: SERVER_URL + "/assets/test.txt"
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
   * Send a text message using the Send API.
   *
   */
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData);
}

/*
   * Send a button message using the Send API.
   *
   */
function sendButtonMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "This is test text",
          buttons: [
            {
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            },
            {
              type: "postback",
              title: "Trigger Postback",
              payload: "DEVELOPER_DEFINED_PAYLOAD"
            },
            {
              type: "phone_number",
              title: "Call Phone Number",
              payload: "+16505551234"
            }
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
   * Send a Structured Message (Generic Message type) using the Send API.
   *
   */
function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "rift",
              subtitle: "Next-generation virtual reality",
              item_url: "https://www.oculus.com/en-us/rift/",
              image_url: SERVER_URL + "/assets/rift.png",
              buttons: [
                {
                  type: "web_url",
                  url: "https://www.oculus.com/en-us/rift/",
                  title: "Open Web URL"
                },
                {
                  type: "postback",
                  title: "Call Postback",
                  payload: "Payload for first bubble"
                }
              ]
            },
            {
              title: "touch",
              subtitle: "Your Hands, Now in VR",
              item_url: "https://www.oculus.com/en-us/touch/",
              image_url: SERVER_URL + "/assets/touch.png",
              buttons: [
                {
                  type: "web_url",
                  url: "https://www.oculus.com/en-us/touch/",
                  title: "Open Web URL"
                },
                {
                  type: "postback",
                  title: "Call Postback",
                  payload: "Payload for second bubble"
                }
              ]
            }
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
   * Send a receipt message using the Send API.
   *
   */
function sendReceiptMessage(recipientId) {
  // Generate a random receipt ID as the API requires a unique ID
  var receiptId = "order" + Math.floor(Math.random() * 1000);

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name: "Peter Chang",
          order_number: receiptId,
          currency: "USD",
          payment_method: "Visa 1234",
          timestamp: "1428444852",
          elements: [
            {
              title: "Oculus Rift",
              subtitle: "Includes: headset, sensor, remote",
              quantity: 1,
              price: 599.0,
              currency: "USD",
              image_url: SERVER_URL + "/assets/riftsq.png"
            },
            {
              title: "Samsung Gear VR",
              subtitle: "Frost White",
              quantity: 1,
              price: 99.99,
              currency: "USD",
              image_url: SERVER_URL + "/assets/gearvrsq.png"
            }
          ],
          address: {
            street_1: "1 Hacker Way",
            street_2: "",
            city: "Menlo Park",
            postal_code: "94025",
            state: "CA",
            country: "US"
          },
          summary: {
            subtotal: 698.99,
            shipping_cost: 20.0,
            total_tax: 57.67,
            total_cost: 626.66
          },
          adjustments: [
            {
              name: "New Customer Discount",
              amount: -50
            },
            {
              name: "$100 Off Coupon",
              amount: -100
            }
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
   * Send a message with Quick Reply buttons.
   *
   */
function sendQuickReply(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "What's your favorite movie genre?",
      quick_replies: [
        {
          content_type: "text",
          title: "Action",
          payload: "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
        },
        {
          content_type: "text",
          title: "Comedy",
          payload: "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
        },
        {
          content_type: "text",
          title: "Drama",
          payload: "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        }
      ]
    }
  };

  callSendAPI(messageData);
}

/*
   * Send a read receipt to indicate the message has been read
   *
   */
function sendReadReceipt(recipientId) {
  console.log("Sending a read receipt to mark message as seen");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  };

  callSendAPI(messageData);
}

/*
   * Turn typing indicator on
   *
   */
function sendTypingOn(recipientId) {
  console.log("Turning typing indicator on");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  callSendAPI(messageData);
}

/*
   * Turn typing indicator off
   *
   */
function sendTypingOff(recipientId) {
  console.log("Turning typing indicator off");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  callSendAPI(messageData);
}

/*
   * Send a message with the account linking call-to-action
   *
   */
function sendAccountLinking(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Welcome. Link your account.",
          buttons: [
            {
              type: "account_link",
              url: SERVER_URL + "/authorize"
            }
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  require("../utils/api")(messageData);
}
