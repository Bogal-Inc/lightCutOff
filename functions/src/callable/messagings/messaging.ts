const functions = require('firebase-functions');
import * as admin from 'firebase-admin';

export const messaging = functions.https.onRequest(async (req: any, res: any) => {
  // These registration tokens come from the client FCM SDKs.
  const registrationTokens = [
    'doW8elK6Fi3qx1SIVWM9Hl:APA91bG-nErSQrf1eIdWy72ioaw_XmEvkRJvnerBux-9-dij53f6jZJBy4RalRXXMDKXyNlkcyA3ja3HhFoFAEQPblBb_DeehyP1m42FnmtGxjfCmb21z3KiNxHtDCQpXIDpWMyt9Eyy'
  ];
  // The topic name can be optionally prefixed with "/topics/".
  const topic = 'topic';

  // Subscribe the devices corresponding to the registration tokens to the
  // topic.
  admin.messaging().subscribeToTopic(registrationTokens, topic)
    .then(function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
    })
    .catch(function(error) {
      console.log('Error subscribing to topic:', error);
    });

  const message = {
    notification: {
      body : "First Notification",
      title: "ALT App Testing"
    },
    topic: topic
  };

  // Send a message to devices subscribed to the provided topic.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});
