export const environment = {
  production: true,
  environment: 'prod',
  domain: 'undefined',
  googleMapsApiKey: 'GOOGLE_MAPS_API_KEY',
  vapidPublicKey: 'VAPID_PUBLIC_KEY',
  app: {
  modules: {
  ownerReport: true,
  mapMenu: true,
  mapFilter: true,
  mapSearch: true,
  user: false,
  messaging: true,
  admin: false
  }
  },
  firebase: {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    appId: 'FIREBASE_APP_ID',
    measurementId: 'FIREBASE_MEASUREMENT_ID',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET'
  }
  };
  