const functions = require('firebase-functions');
import * as admin from 'firebase-admin';

export const messaging = functions.https.onRequest(async (req: any, res: any) => {
  // These registration tokens come from the client FCM SDKs.
  const registrationTokens = [
    'doW8elK6Fi3qx1SIVWM9Hl:APA91bH2O8y2VPNdFa8eginCbEDT456yovJlyvNVFTiW73K09CZTjVUhcVQSPvD77hbiyo8nqKgx9iDJvBIWEPMbZds6FlzaaBxLq779NE3pTD4bdBkI9j2oP3pVHyWPWJJ_m4iuMlSd'
  ];

  // Subscribe the devices corresponding to the registration tokens to the
  // topic.
  admin.messaging().subscribeToTopic(registrationTokens, 'topic')
    .then(function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
    })
    .catch(function(error) {
      console.log('Error subscribing to topic:', error);
    });

  // The topic name can be optionally prefixed with "/topics/".
  const topic = 'topic';

  const message = {
    data: {
      score: '850',
      time: '2:45'
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
