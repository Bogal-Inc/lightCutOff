export const environment = {
  production: true,
  environment: 'staging',
  googleMapsApiKey: 'googleMapsApiKey',
  domain: 'localhost',
  app: {
    modules: {
      ownerReport: true,
      mapMenu: true,
      mapFilter: false,
      mapSearch: true,
      user: true,
      messaging: true,
      admin: true
    },
    vapidPublicKey: 'vapidPublicKey',
  },
  firebase: {
    apiKey: 'apiKey',
    authDomain: 'authDomain',
    databaseURL: 'databaseURL',
    messagingSenderId: 'messagingSenderId',
    appId: 'appId',
    measurementId: 'measurementId',
    projectId: 'projectId',
    storageBucket: 'storageBucket'
  }
};
