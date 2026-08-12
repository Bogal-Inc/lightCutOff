import * as admin from 'firebase-admin';

admin.initializeApp();

export * from './callable';
export { renderEneoProgram } from './pages/eneo-program';
