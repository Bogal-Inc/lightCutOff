import { writeFile } from 'fs';

declare var require: any

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
// Load node modules
const colors = require('colors');
require('dotenv').config();

// `environment.ts` file structure
const envConfigFile = `export const environment = {
  production: '${process.env.PRODUCTION}',
  GOOGLE_MAPS_API_KEY: '${process.env.GOOGLE_MAPS_API_KEY}',
};
`;

console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));

writeFile(targetPath, envConfigFile, (err) => {
   if (err) {
       throw console.error(err);
   } else {
       console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
   }
});
