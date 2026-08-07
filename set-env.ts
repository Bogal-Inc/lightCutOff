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
let features = null;

// Site vitrine : carte publique en lecture seule + section admin.
if (isProduction) {
  features = {
    mapMenu: true,
    mapFilter: true,
    mapSearch: true,
    admin: false
  };
} else {
  features = {
    mapMenu: true,
    mapFilter: true,
    mapSearch: true,
    admin: false
  };
}

const envConfigFile = getEnvironment(features);

console.log(colors.red('Start files create \n'));
// if (!isProduction) {
console.log(colors.magenta('The file environment will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));
// }

// create environment file
createFile(environmentPath, envConfigFile);

function getEnvironment(featuress) {
  return  `export const environment = {
  production: ${isProduction},
  environment: '${(isProduction) ? 'prod' : 'dev'}',
  domain: '${(isProduction) ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV}',
  stadiaApiKey: '${process.env.STADIA_API_KEY || ''}',
  app: {
  modules: {
  mapMenu: ${featuress.mapMenu},
  mapFilter: ${featuress.mapFilter},
  mapSearch: ${featuress.mapSearch},
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
