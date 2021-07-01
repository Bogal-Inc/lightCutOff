import { writeFile } from 'fs';
declare var require: any;

const { argv } = require('yargs');
require('dotenv').config();

// Load node modules
const colors = require('colors');

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const environmentPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

// `environment.ts` file structure
const messagingManifestFile = getMessagingManifestFile();
const swenv = getSwEnv();
let features = null;

if (isProduction) {
  features = {
    ownerReport: true,
    mapMenu: true,
    mapFilter: true,
    mapSearch: true,
    user: false,
    messaging: true,
    admin: false
  };
} else {
  features = {
    ownerReport: true,
    mapMenu: true,
    mapFilter: true,
    mapSearch: true,
    user: true,
    messaging: true,
    admin: true
  };

}

const envConfigFile = getEnvironment(features);

console.log(colors.red('Start files create \n'));
// if (!isProduction) {
console.log(colors.magenta('The file environment will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));
console.log(colors.magenta('The file messaging manifest will be written with the following content: \n'));
console.log(colors.grey(messagingManifestFile));
// }

// create environment file
createFile(environmentPath, envConfigFile);
// create messaging manifest file
createFile('./src/swenv.js', swenv);
createFile('./src/manifest.json', messagingManifestFile);

function getEnvironment(featuress) {
  return  `export const environment = {
  production: ${isProduction},
  environment: '${(isProduction) ? 'prod' : 'dev'}',
  domain: '${process.env.DOMAIN}',
  googleMapsApiKey: '${process.env.GOOGLE_MAPS_API_KEY}',
  vapidPublicKey: '${process.env.VAPID_PUBLIC_KEY}',
  app: {
  modules: {
  ownerReport: ${featuress.ownerReport},
  mapMenu: ${featuress.mapMenu},
  mapFilter: ${featuress.mapFilter},
  mapSearch: ${featuress.mapSearch},
  user: ${featuress.user},
  messaging: ${featuress.messaging},
  admin: ${featuress.admin}
  }
  },
  firebase: {
    apiKey: '${(isProduction) ? process.env.FIREBASE_API_KEY : process.env.DEV_FIREBASE_API_KEY}',
    authDomain: '${(isProduction) ? process.env.FIREBASE_AUTH_DOMAIN : process.env.DEV_FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${(isProduction) ? process.env.FIREBASE_DATABASE_URL : process.env.DEV_FIREBASE_DATABASE_URL}',
    messagingSenderId: '${(isProduction) ? process.env.FIREBASE_MESSAGING_SENDER_ID : process.env.DEV_FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${(isProduction) ? process.env.FIREBASE_APP_ID : process.env.DEV_FIREBASE_APP_ID}',
    measurementId: '${(isProduction) ? process.env.FIREBASE_MEASUREMENT_ID : process.env.DEV_FIREBASE_MEASUREMENT_ID}',
    projectId: '${(isProduction) ? process.env.FIREBASE_PROJECT_ID : process.env.DEV_FIREBASE_PROJECT_ID}',
    storageBucket: '${(isProduction) ? process.env.FIREBASE_STORAGE_BUCKET : process.env.DEV_FIREBASE_STORAGE_BUCKET}'
  }
  };
  `;
}

function getSwEnv() {
  return  `const firebase = {
    apiKey: '${(isProduction) ? process.env.FIREBASE_API_KEY : process.env.DEV_FIREBASE_API_KEY}',
    authDomain: '${(isProduction) ? process.env.FIREBASE_AUTH_DOMAIN : process.env.DEV_FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${(isProduction) ? process.env.FIREBASE_DATABASE_URL : process.env.DEV_FIREBASE_DATABASE_URL}',
    messagingSenderId: '${(isProduction) ? process.env.FIREBASE_MESSAGING_SENDER_ID : process.env.DEV_FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${(isProduction) ? process.env.FIREBASE_APP_ID : process.env.DEV_FIREBASE_APP_ID}',
    measurementId: '${(isProduction) ? process.env.FIREBASE_MEASUREMENT_ID : process.env.DEV_FIREBASE_MEASUREMENT_ID}',
    projectId: '${(isProduction) ? process.env.FIREBASE_PROJECT_ID : process.env.DEV_FIREBASE_PROJECT_ID}',
    storageBucket: '${(isProduction) ? process.env.FIREBASE_STORAGE_BUCKET : process.env.DEV_FIREBASE_STORAGE_BUCKET}'
  };
  `;
}

function getMessagingManifestFile() {
  return `{"gcm_sender_id": "${(isProduction) ? process.env.VAPID_PUBLIC_KEY : process.env.DEV_VAPID_PUBLIC_KEY}"}`;
}

function createFile(path, data) {
  writeFile(
    path,
    data,
    {
      flag: 'w+'
    },
    (err) => {
      if (err) {
        throw console.error(err);
      } else {
        console.log(colors.green(`file generated correctly at ${path} \n`));
      }
    });
}
