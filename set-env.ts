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
  envConfigFile = `export const environment = {
    production: ${process.env.PRODUCTION},
    environment: '${process.env.ENVIRONMENT}',
    domain: '${process.env.DOMAIN_PROD}',
    googleMapsApiKey: '${process.env.GOOGLE_MAPS_API_KEY}',
    app: {
      modules: {
        mapMenu: false
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
} else if (environment === 'staging')  {
  targetPath += 'environment.staging.ts';
  envConfigFile = `export const environment = {
      production: ${process.env.PRODUCTION},
      environment: '${process.env.ENVIRONMENT}',
      domain: '${process.env.DOMAIN_PROD}',
      googleMapsApiKey: '${process.env.GOOGLE_MAPS_API_KEY}',
      app: {
        modules: {
          mapMenu: true
        }
      },
      firebase: {
        apiKey: '${process.env.FIREBASE_API_KEY_DEV}',
        authDomain: '${process.env.FIREBASE_AUTH_DOMAIN_DEV}',
        databaseURL: '${process.env.FIREBASE_DATABASE_URL_DEV}',
        messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID_DEV}',
        appId: '${process.env.FIREBASE_APP_ID_DEV}',
        measurementId: '${process.env.FIREBASE_MEASUREMENT_ID_DEV}',
        projectId: '${process.env.FIREBASE_PROJECT_ID_DEV}',
        storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET_DEV}'
      }
    };
  `;
} else {
  targetPath += 'environment.ts';
  envConfigFile = `export const environment = {
      production: ${process.env.PRODUCTION},
      environment: '${process.env.ENVIRONMENT}',
      domain: '${process.env.DOMAIN_DEV}',
      googleMapsApiKey: '${process.env.GOOGLE_MAPS_API_KEY}',
      app: {
        modules: {
          mapMenu: true
        }
      },
      firebase: {
        apiKey: '${process.env.FIREBASE_API_KEY_DEV}',
        authDomain: '${process.env.FIREBASE_AUTH_DOMAIN_DEV}',
        databaseURL: '${process.env.FIREBASE_DATABASE_URL_DEV}',
        messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID_DEV}',
        appId: '${process.env.FIREBASE_APP_ID_DEV}',
        measurementId: '${process.env.FIREBASE_MEASUREMENT_ID_DEV}',
        projectId: '${process.env.FIREBASE_PROJECT_ID_DEV}',
        storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET_DEV}'
      }
    };
  `;
}

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
