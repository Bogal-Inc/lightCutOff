export const Const = {
  app: {
    title: 'NJUKA',
    tagline: {
      fr: 'Ensemble, on y voit plus clair.',
      en: 'Together, we see clearly.'
    },
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.njuka.app',
    // À renseigner quand l'app iOS sera publiée sur l'App Store
    appStoreUrl: null,
    lang: {
      localstorage_title: 'njukaXLanguage',
      defaultLanguage: 'fr',
      fr: 'fr',
      en: 'en'
    }
  },
  user: {
    localstorage: 'NJUKA_userLogged'
  },
  sendMail: 'https://us-central1-lightcutoff.cloudfunctions.net/sendMail',
  countryCode: 'CM',
  collections: {
    users: 'users',
    devices: 'devices',
    reports: 'reports'
  },
  coordsCameroon: {
    east: 16.1944081,
    north: 13.083335,
    south: 1.6559,
    west: 8.3936001
  },
  coordsDefault: {
    lng: 11.48022226405379,
    lat: 3.843249609352396
  },
  emailService: {
    support: 'support@bogal.ca'
  },
  markerColor: {
    user: 'assets/static/images/markers/marker_blue.svg',
    electricity: 'assets/static/images/markers/marker_amber.svg',
    water: 'assets/static/images/markers/marker_sky.svg',
    recovred: 'assets/static/images/markers/marker_green.svg'
  }
};
