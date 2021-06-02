![Deploy](https://github.com/willkoua/lightCutOff/workflows/Deploy%20to%20Firebase%20Hosting%20on%20merge/badge.svg?event=push)
![pull_request](https://github.com/willkoua/lightCutOff/workflows/lint%20and%20test%20on%20PR/badge.svg)
![npm](https://img.shields.io/npm/v/npm?label=npm)
![](https://img.shields.io/badge/node-green.svg)

# Pre-requisites
- node: 14.16.0
- npm 7.8.0
- Angular 12.0.0

# contribute
with `pull request`. Never in develop branch or master branch directly.

# Setup
copy and paste `.env.example` file and rename `.env`

## google MAp
- Generate your google map API key. [documentation](https://cloud.google.com/maps-platform/?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_460848633508-ADGP_Hybrid%20%7C%20AW%20SEM%20%7C%20BKWS%20~%20Google%20Maps%20API-KWID_43700033921822012-kwd-1952727095-userloc_9070075&utm_term=KW_google%20map%20api-ST_google%20map%20api&gclid=CjwKCAiAv4n9BRA9EiwA30WND59Wh7Bf38cxHwyMEodPmvkHX4PqlKb0VWKITlf3hPuV_11Y-47-9xoC9zoQAvD_BwE).
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
 When to build project, the build artifacts will be stored in the dist/ directory.

# Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via Protractor.
