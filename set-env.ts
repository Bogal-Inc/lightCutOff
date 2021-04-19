import { writeFile } from 'fs';

declare var require: any;
require('dotenv').config();

// Load node modules
const colors = require('colors');
const SRCPATH = './src/';

const environment = process.env.ENVIRONMENT;
// Configure Angular `environment.ts` file path
let environmentPath = `${SRCPATH}environments/`;
// `environment.ts` file structure
let envConfigFile;
const messagingManifestFile = getMessagingManifestFile();
const swenv = getSwEnv();

if (environment === 'prod') {
  const module = {
    ownerReport: true,
    mapMenu: true,
    mapFilter: true,
    mapSearch: true,
    user: false,
    messaging: false,
    admin: false
  };
  environmentPath += 'environment.prod.ts';
  envConfigFile = getEnvironment(module);
} else if (environment === 'staging')  {
  const module = {
    ownerReport: true,
    mapMenu: true,
    mapFilter: true,
    mapSearch: true,
    user: false,
    messaging: false,
    admin: true
  };
  environmentPath += 'environment.staging.ts';
  envConfigFile = getEnvironment(module);
} else {
  const module = {
    ownerReport: true,
    mapMenu: true,
    mapFilter: true,
    mapSearch: true,
    user: true,
    messaging: true,
    admin: true
  };
  environmentPath += 'environment.ts';
  envConfigFile = getEnvironment(module);
}

console.log(colors.red('Start files create \n'));
if (environment === 'dev') {
  console.log(colors.magenta('The file environment will be written with the following content: \n'));
  console.log(colors.grey(envConfigFile));
  console.log(colors.magenta('The file messaging manifest will be written with the following content: \n'));
  console.log(colors.grey(messagingManifestFile));
}

// create environment file
createFile(environmentPath, envConfigFile);
// create messaging manifest file
createFile(SRCPATH + 'swenv.js', swenv);
createFile(SRCPATH + 'manifest.json', messagingManifestFile);

function getEnvironment(modules) {

  return  `export const environment = {
  production: ${process.env.PRODUCTION},
  environment: '${process.env.ENVIRONMENT}',
  domain: '${process.env.DOMAIN}',
  googleMapsApiKey: '${process.env.GOOGLE_MAPS_API_KEY}',
  vapidPublicKey: '${process.env.VAPID_PUBLIC_KEY}',
  app: {
  modules: {
  ownerReport: ${modules.ownerReport},
  mapMenu: ${modules.mapMenu},
  mapFilter: ${modules.mapFilter},
  mapSearch: ${modules.mapSearch},
  user: ${modules.user},
  messaging: ${modules.messaging},
  admin: ${modules.admin}
  }
  },
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${process.env.FIREBASE_DATABASE_URL}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}'
  }
  };
  `;
}

function getSwEnv() {

  return  `const firebase = {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${process.env.FIREBASE_DATABASE_URL}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}'
  };
  `;
}

function getMessagingManifestFile() {
  return `{"gcm_sender_id": "${process.env.VAPID_PUBLIC_KEY}"}`;
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
