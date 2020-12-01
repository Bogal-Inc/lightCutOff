import { writeFile } from 'fs';

declare var require: any;

// Load node modules
const colors = require('colors');
require('dotenv').config();

const environment = process.env.ENVIRONMENT;
// Configure Angular `environment.ts` file path
let targetPath = './src/environments/';
// `environment.ts` file structure
let envConfigFile;

if (environment === 'prod') {
  targetPath += 'environment.prod.ts';
} else if (environment === 'staging')  {
  targetPath += 'environment.staging.ts';
} else {
  targetPath += 'environment.ts';
}
envConfigFile = getEnvironment();

console.log(colors.magenta('The file environment will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));

writeFile(
  targetPath,
  envConfigFile,
  {
    flag: 'w+'
  },
  (err) => {
   if (err) {
       throw console.error(err);
   } else {
       console.log(colors.magenta(`Angular environment file generated correctly at ${targetPath} \n`));
   }
});

function getEnvironment() {
  const param = getParams();
  return  `export const environment = {
  production: ${param.production},
  environment: '${param.environment}',
  domain: '${param.domain}',
  googleMapsApiKey: '${param.googleMapsApiKey}',
  app: {
  modules: {
  ownerReport: true,
  mapMenu: true,
  mapFilter: true,
  mapSearch: true
  }
  },
  firebase: {
    apiKey: '${param.apiKey}',
    authDomain: '${param.authDomain}',
    databaseURL: '${param.databaseURL}',
    messagingSenderId: '${param.messagingSenderId}',
    appId: '${param.appId}',
    measurementId: '${param.measurementId}',
    projectId: '${param.projectId}',
    storageBucket: '${param.storageBucket}'
  }};

  `;
}

function getParams() {
  return {
    production: process.env.PRODUCTION,
    environment: process.env.ENVIRONMENT,
    domain: (environment === 'prod' || environment === 'staging') ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    apiKey: (environment === 'prod' || environment === 'staging') ? process.env.FIREBASE_API_KEY : process.env.FIREBASE_API_KEY_DEV,
    authDomain: (environment === 'prod' || environment === 'staging') ?
      process.env.FIREBASE_AUTH_DOMAIN : process.env.FIREBASE_AUTH_DOMAIN_DEV,
    databaseURL: (environment === 'prod' || environment === 'staging') ?
      process.env.FIREBASE_DATABASE_URL : process.env.FIREBASE_DATABASE_URL_DEV,
    messagingSenderId: (environment === 'prod' || environment === 'staging') ?
      process.env.FIREBASE_MESSAGING_SENDER_ID : process.env.FIREBASE_MESSAGING_SENDER_ID_DEV,
    appId: (environment === 'prod' || environment === 'staging') ?
      process.env.FIREBASE_APP_ID : process.env.FIREBASE_APP_ID_DEV,
    measurementId: (environment === 'prod' || environment === 'staging') ?
      process.env.FIREBASE_MEASUREMENT_ID : process.env.FIREBASE_MEASUREMENT_ID_DEV,
    projectId: (environment === 'prod' || environment === 'staging') ?
      process.env.FIREBASE_PROJECT_ID : process.env.FIREBASE_PROJECT_ID_DEV,
    storageBucket: (environment === 'prod' || environment === 'staging') ?
      process.env.FIREBASE_STORAGE_BUCKET : process.env.FIREBASE_STORAGE_BUCKET_DEV
  }
}
