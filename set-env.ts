import { writeFile } from 'fs';

declare var require: any;

// Configure Angular `environment.ts` file path
let targetPath = null;
// Load node modules
const colors = require('colors');
require('dotenv').config();

if (process.env.PRODUCTION === 'true') {
  targetPath = './src/environments/environment.prod.ts';
} else {
  targetPath = './src/environments/environment.ts';
}

// `environment.ts` file structure
const envConfigFile = `export const environment = {
  production: '${process.env.PRODUCTION}',
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

console.log(colors.magenta('The file `environment.prod.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));

writeFile(targetPath, envConfigFile, (err) => {
   if (err) {
       throw console.error(err);
   } else {
       console.log(colors.magenta(`Angular environment.prod.ts file generated correctly at ${targetPath} \n`));
   }
});
