import { writeFile } from 'fs';

declare var require: any;

// Load node modules
const colors = require('colors');
require('dotenv').config();

const environment = process.env.ENVIRONMENT;
// Configure Angular `environment.ts` file path
let targetPath = './src/environments/';

if (environment === 'prod') {
  targetPath += 'environment.prod.ts';
} else if (environment === 'staging')  {
  targetPath += 'environment.staging.ts';
} else {
  targetPath += 'environment.ts';
}

// `environment.ts` file structure
const envConfigFile = `export const environment = {
  production: ${process.env.PRODUCTION},
  environment: '${process.env.ENVIRONMENT}',
  googleMapsApiKey: '${process.env.GOOGLE_MAPS_API_KEY}',
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
