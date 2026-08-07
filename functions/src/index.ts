import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://lightcutoff.firebaseio.com'
});

export * from './callable';
