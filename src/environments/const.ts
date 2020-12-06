export const Const = {
  app: {
    title: 'LightCutOff',
    lang: {
      localstorage_title: 'lightCutOffXLanguage',
      defaultLanguage: 'fr',
      fr: 'fr',
      en: 'en'
    }
  },
  eneo: {
    url: 'https://xtrc.eneocameroon.cm/Programmes_coupures/',
    regions: {
      yaounde: 'x-1',
      douala: 'x-22',
      adamaoua: 1,
      centre: 2,
      est: 3,
      extreme_nord: 4,
      littoral: 5,
      ouest: 6,
      nord: 7,
      nord_ouest: 8,
      sud: 9,
      sud_ouest: 0
    }
  },
  user: {
    localstorage: 'lightCutOffUser'
  },
  sendMail: 'https://us-central1-lightcutoff.cloudfunctions.net/sendMail',
  collections: {
    users: 'users',
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
    support: 'willkoua@gmaill.com'
  },
  markerColor: {
    user: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    cut: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    cutUser: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    recovred: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    // user: '../assets/static/images/markers/marker_blue.svg',
    // cut: '../assets/static/images/markers/marker_red.svg',
    // cutUser: '../assets/static/images/markers/marker_orange.svg',
    // recovred: '../assets/static/images/markers/marker_green.svg'
  }
};
