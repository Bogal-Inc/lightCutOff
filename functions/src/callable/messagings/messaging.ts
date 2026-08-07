import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { Message } from 'firebase-admin/messaging';

export const messaging = onRequest(async (req, res) => {
  const db = admin.firestore();
  const device$ = db.collection('devices').get();
  const report$ = db.collection('reports')
    .where('recovredAt', '==', null)
    .get();

  await Promise.all([
    device$,
    report$
  ]).then(
    (snapshots) => {
      const devices: any = [];
      const reports: any = [];
      const reportsNotif: any = [];
      const devicesNotif: any = [];

      snapshots.forEach(
        (snapshot) => {
          snapshot.forEach(
            (docSnapshot) => {
              const data = docSnapshot.data();
              if (data.position) {
                reports.push(data);
              } else {
                devices.push(data);
              }
            }
          );
        });

      reports.forEach(
        (report: any) => {
          devices.forEach(
            (device: any) => {
              if ((device._createdBy.id === report._createdBy.id)) {
                if (!report.recovredAt) {
                  reportsNotif.push(report);
                  devicesNotif.push(device);
                  const message: Message = {
                    notification: {
                      body: `Votre rapport en date du ${report.reportedAt.toDate().toLocaleString(
                        'fr-FR',
                        { timeZone: 'UTC' })} n'a pas été clos.`,
                      title: 'Est ce que la lumiere est déjà revenue?',
                      imageUrl: 'https://lightcutoff.com/assets/static/images/logo_header.png'
                    },
                    webpush: {
                      fcmOptions: {
                        link: `${process.env.DOMAIN}/map?reportId=${report.id}`
                      }
                    },
                    token: device.messagingToken
                  };

                  // Send a message to devices subscribed to the provided topic.
                  admin.messaging().send(message)
                    .then(() => {
                      console.log('Sending message:', message);
                    })
                    .catch((error) => {
                      console.log('Error sending message:', error);
                    });
                }
              }
            }
          );
        }
      );
      res.json({
        devicesNotif,
        reportsNotif
      });
    }
  );
});
