![Deploy](https://github.com/willkoua/lightCutOff/workflows/Deploy%20to%20Firebase%20Hosting%20on%20merge/badge.svg?event=push)
![pull_request](https://github.com/willkoua/lightCutOff/workflows/lint%20and%20test%20on%20PR/badge.svg)

# Pre-requisites
- node: >= 22.12
- npm: >= 10
- Angular 20

# contribute
with `pull request`. Never in develop branch or master branch directly.

# Setup
copy and paste `.env.example` file and rename `.env`

## Google Maps
- Generate your Google Maps API key ([documentation](https://developers.google.com/maps/documentation/javascript/get-api-key)).
- Add your key in `.env`

## Firebase
- Create an account firebase
- Create project
- Add project account parameters to `.env` file
```dotenv
# Env prod (if you have information)
FIREBASE_API_KEY_DEV=FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN_DEV=FIREBASE_AUTH_DOMAIN
FIREBASE_DATABASE_URL_DEV=FIREBASE_DATABASE_URL
FIREBASE_MESSAGING_SENDER_ID_DEV=FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID_DEV=FIREBASE_APP_ID
FIREBASE_MEASUREMENT_ID_DEV=FIREBASE_MEASUREMENT_ID
FIREBASE_PROJECT_ID_DEV=FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET_DEV=FIREBASE_STORAGE_BUCKET

# Env dev (add your project parameters in your firebase)
DEV_FIREBASE_API_KEY_DEV=DEV_FIREBASE_API_KEY
DEV_FIREBASE_AUTH_DOMAIN_DEV=DEV_FIREBASE_AUTH_DOMAIN
DEV_FIREBASE_DATABASE_URL_DEV=DEV_FIREBASE_DATABASE_URL
DEV_FIREBASE_MESSAGING_SENDER_ID_DEV=DEV_FIREBASE_MESSAGING_SENDER_ID
DEV_FIREBASE_APP_ID_DEV=DEV_FIREBASE_APP_ID
DEV_FIREBASE_MEASUREMENT_ID_DEV=DEV_FIREBASE_MEASUREMENT_ID
DEV_FIREBASE_PROJECT_ID_DEV=DEV_FIREBASE_PROJECT_ID
DEV_FIREBASE_STORAGE_BUCKET_DEV=DEV_FIREBASE_STORAGE_BUCKET
```

# config firebase messaging in local project
and add messaging parameters to `.env` file. [documentation](https://firebase.google.com/docs/cloud-messaging/js/client#configure_web_credentials_with_fcm)
```dotenv
# env dev
DEV_VAPID_PUBLIC_KEY=DEV_VAPID_PUBLIC_KEY

# env prod
VAPID_PUBLIC_KEY=VAPID_PUBLIC_KEY
```
- Create `Cloud firestore` in your project

# Cloud Functions
The functions (`functions/`) run on **Node 22** / firebase-functions **v6** (API v2).
The old `functions.config()` is gone: provide `GMAIL_EMAIL` and `GMAIL_PASSWORD`
through a `functions/.env` file or Firebase secrets before deploying `contactus`.

# Run local server
```text
npm run start:dev
```
and go to the browser with `localhost:4200`

# Running unit tests
```text
npm run test
```
report coverage on in `coverage` directory. You can run `index.html` file for see coverage by file and repertory.

# Build local
 ```text
npm run build
```
When to build project, the build artifacts will be stored in the `dist/lightcutoff/browser`
directory (Firebase Hosting points there).

# Lint
```text
npm run lint
```
ESLint 9 flat config (`eslint.config.js`). The old Protractor e2e suite was removed with the
Angular 20 upgrade — see `CHANGELOG.md` for the full migration notes.
