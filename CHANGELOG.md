# Changelog

## [2.0.0] - 2026-08-07 — Upgrade complet du stack (branche `feat/upgrade-angular20`)

### Framework & outillage
- **Angular 12.1 → 20.0** (big-bang, pas de migration incrémentale) ; builder
  `@angular/build:application` (esbuild), sortie `dist/lightcutoff/browser`.
- **Node 14 → 22** (`engines` : node >=22.12), npm >=10 ; TypeScript 4.2 → 5.8 ; rxjs 6.6 → 7.8.
- **Firebase SDK 8 → 11** via la couche **compat** de `@angular/fire` 20 (imports
  `@angular/fire/compat/*`, services inchangés). `@angular/fire` plafonne Angular à 20
  (Angular 22 existe, mais fire 20 est le plus récent publié).
- ESLint 9 **flat config** (`eslint.config.js`, angular-eslint 20) ; règles
  `prefer-standalone`/`prefer-inject` désactivées (migration standalone = chantier ultérieur).
- Protractor (e2e) supprimé ; Karma/Jasmine mis à jour.
- CI : workflows GitHub à mettre à jour manuellement (copies prêtes dans `tasks/ci/`).

### Dépendances remplacées
- `@agm/core` → service maison `GoogleMapsLoaderService` (l'app n'utilisait AGM que pour
  charger le script Maps ; tout le reste est l'API `google.maps` brute).
- `angular2-chartjs` → wrapper maison `ChartComponent` (`<app-chart>`) sur **chart.js 4**.
- `ng-pick-datetime` (mort) → fork maintenu `@danielmoncada/angular-datetime-picker` 20.
- Bootstrap 4 → **Bootstrap 5.3** + ng-bootstrap 19 (classes migrées : ms-/me-, mb-3,
  fw-bold, visually-hidden, data-bs-*, w-100, d-flex…) ; jQuery supprimé.
- ag-grid 25 → **34** (`ModuleRegistry` + thème CSS legacy `ag-theme-alpine`).
- ngx-translate 13 → 17 (loader par classe + `provideTranslateHttpLoader`).
- Supprimés : `angularfire2` v5, `firebaseui`, `ngx-bootstrap`, `ngx-cookieconsent`,
  `cookieconsent`, `jquery`, `messageformat` + compiler (i18n convertie en interpolation
  native `{{var}}`), `lodash` (usage unique remplacé par `Array.includes`),
  `firebase-tools`/`firebase-functions` retirés des deps racine.

### Cloud Functions (`functions/`)
- Node 14 → **22**, firebase-functions 3 → **6** (API **v2** `onRequest`, cors intégré),
  firebase-admin 9 → **13**, TypeScript 5.8 ; tslint supprimé.
- `functions.config()` (API supprimée par Firebase) → variables d'environnement
  (`GMAIL_EMAIL`, `GMAIL_PASSWORD` via `.env`/secrets).
- Dépendances mortes retirées : @sendgrid/mail, @sentry/node, cors, dotenv.

### Corrections induites
- `runInInjectionContext` dans `BaseService.col()/doc()` : les wrappers compat de
  @angular/fire v20 appellent `inject()` et échouent hors contexte d'injection (NG0203).
- `standalone: false` explicite sur les 48+ composants/pipes (défaut inversé depuis Angular 19).
- `main.ts` : bootstrap unique, import `environment` (au lieu de `environment.prod` en dur),
  résidu Cordova `deviceready` supprimé.
- `firebase-messaging-sw.js` : scripts compat 11.10.0.
- `firebase.json` : hosting → `dist/lightcutoff/browser`.

### Vérifications
- `npm run build` et `npm run build:prod` : OK (service worker ngsw généré).
- `npm test` : **67/67 verts**.
- `npm run lint` : 0 erreur (53 warnings hérités non bloquants).
- Smoke test `ng serve` : accueil, carte (modals, tuto, i18n FR) rendus ; seules erreurs
  console = clés Firebase factices du `.env` local (attendu sans secrets réels).

## [2.1.0] - 2026-08-07 — Lot 2a : purge (site vitrine, carte lecture seule)

### Supprimé
- **Couche PWA complète** : service worker ngsw, `manifest.webmanifest`/`manifest.json`,
  `firebase-messaging-sw.js`, notifications push web (FCM), modal « activer les notifications »,
  `MessagingService`, `DeviceService`, `AngularFireMessagingModule`, `AngularFireDatabaseModule`,
  génération `swenv.js`/manifest dans `set-env.ts`, clés VAPID (`.env.example` nettoyé).
- **Comptes publics** : module `user` entier (signup, signin, forgot-password, profile,
  own-report), guards `AuthGuard`/`ModuleUserGuard`, liens header (S'inscrire / Se connecter /
  Mes signalements), flags d'env `user`/`ownerReport`/`messaging`.
- **Création/clôture de signalements sur la carte** : composants marker-create-report,
  marker-recovred-report, map-tuto-modal, bouton « + », formulaire « courant revenu ? » —
  la carte est désormais **lecture seule** (détails de signalement uniquement).
- Bandeau « télécharger l'app » (download-app), modal tutoriel de l'accueil,
  script Google Sign-In (`platform.js`) et meta associée dans `index.html`.
- Dépendances retirées : `@angular/service-worker`, `@danielmoncada/angular-datetime-picker`.

### Modifié
- `ComponentService.createComponent` : `ViewContainerRef.createComponent` (l'API
  `ComponentFactoryResolver` était dépréciée) et typage générique.
- `map-view` réécrit lecture seule (marqueurs coupure/rétabli + popup détails, filtres,
  recherche, légende, historique conservés).

### Vérifications
- `ng build` + `build:prod` OK · `npm test` **52/52** · `lint` 0 erreur · smoke test navigateur
  (accueil épuré, carte sans UI d'écriture).

## [2.2.0] - 2026-08-07 — Lot 2b : vitrine + rebranding NJUKA

### Identité
- **LightCutOff → NJUKA** partout : `const.ts` (titre, clés localStorage, email support
  `support@bogal.ca`, URLs stores), i18n fr/en, `index.html` (SEO, Open Graph, favicon,
  `lang=fr`, theme-color charbon), alt/keywords des composants, copyright footer
  (« NJUKA · Bogal Consulting »).
- **Palette NJUKA** (`_site.scss`) : ambre `#F88E01`, charbon `#1A1A1A`, sky `#0EA5E9` +
  ré-définition des variables CSS héritées de Bootstrap 4 (`--white`, `--dark`, `--gray`,
  `--warning`) supprimées par Bootstrap 5 ; bouton de marque `.btn-njuka` ; navbar charbon.
- Assets copiés depuis l'app : icône/bulbe NJUKA (header, favicon, hero) + 3 captures d'écran.

### Contenu
- **Accueil** : nouveau hero (halo ambre, NJUKA, devise « Ensemble, on y voit plus clair. »,
  ⚡ Électricité · 💧 Eau, bouton **Google Play** + bouton carte) ; nouvelle section
  « L'application NJUKA » (captures + 4 features : signaler, confirmer/démentir, alertes,
  coupures planifiées Eneo) ; texte « à propos » réécrit (électricité **et eau**) ;
  section actualité Opleda (2020, périmée) supprimée.
- **Tutoriel** réécrit : guide de l'app en 4 étapes + note « site = consultation seule »
  (l'ancien tuto décrivait le signalement sur la carte web, supprimé au lot 2a).
- **FAQ** réécrite : disponibilité (élec Eneo + eau Camwater), signaler = via l'app,
  installer = Google Play (iOS bientôt) — remplace le guide « raccourci PWA » obsolète.

### Vérifications
- `ng build` + `build:prod` OK · `npm test` **52/52** · `lint` 0 erreur · vérification
  navigateur (hero, i18n, images, /tuto, /faq, /aboutus).

### Reste à décider (Willy)
- Liens sociaux du footer : pointent encore vers les comptes LightCutOff
  (facebook.com/lightcutoff.lco, twitter LightCutOff1, instagram lightcutoff).
- ~~Sitemaps XML encore au nom lightcutoff~~ → réglé le 2026-08-07 : domaine final **njuka.app**,
  nouveau `sitemap.xml` + `robots.txt` (routes vitrine, /admin exclu), Open Graph et
  `page_location` analytics sur https://njuka.app, `DOMAIN_PROD` corrigé dans set-env/CI
  (bug historique : set-env lisait `DOMAIN`, variable jamais définie).

## [2.3.0] - 2026-08-07 — Lot 2c : carte Leaflet + Stadia Maps (fin de Google Maps)

### Carte
- **Google Maps → Leaflet 1.9 + leaflet.markercluster**, tuiles **Stadia Maps**
  (`alidade_smooth`, clé `STADIA_API_KEY` via env) avec **repli OpenStreetMap** automatique
  (clé absente ou tuiles en erreur) — même stack cartographique que l'app mobile.
- Recherche de lieu : Google Places → **Nominatim** (`NominatimService.search`, restreint
  au Cameroun) ; autocomplete Google supprimé (recherche au submit).
- Marqueurs : pins **SVG locaux** (bleu position, rouge coupure, vert rétabli) au lieu des
  icônes Google hébergées ; popup de détails inchangée (composant Angular).
- Filtre « ma coupure » (orange) retiré — plus de notion de propriétaire sur le site.
- Fix affichage : hauteur explicite du conteneur + `invalidateSize()` après init.

### Supprimé
- `GoogleMapsLoaderService`, `map.model.ts` (Google), mock `google-api.js` (karma),
  script CDN MarkerClustererPlus, `@types/google.maps`, clé `GOOGLE_MAPS_API_KEY`
  (env, workflows CI → remplacée par `STADIA_API_KEY`).

### Vérifications
- `ng build` + `build:prod` OK · `npm test` 52/52 · `lint` 0 erreur · vérif navigateur :
  carte plein écran (repli OSM sans clé), marqueur position, filtres, recherche
  « Douala » → carte recentrée.

## [2.4.0] - 2026-08-07 — Données réelles Njuka (schéma aligné, lot 2e partie data)

### Modèle de données
- `Report` aligné sur le **schéma Njuka** (`SCHEMA.md` de l'app) : statuts `ongoing`/`resolved`
  (ex CUT/CUT_COMPLETED), `resolvedAt` (ex recovredAt), `serviceType` electricity/water
  (absent = électricité, même rétro-compat que l'app), `GeoArea`
  (country/countryCode/region/city/neighborhood), `archivedAt` (soft-delete),
  `description`, `authorUsername`, `confirmationCount`…
- `ReportService` en lecture seule : requête cloisonnée pays
  (`location.countryCode == 'CM'` + tri `reportedAt desc`, index composite déployé côté app),
  signalements archivés écartés, **attente de la session** avant toute requête
  (les règles exigent `isSignedIn()`).
- Session **anonyme-first** : connexion anonyme systématique à l'arrivée quand aucune
  session n'existe (l'ancien flux ne l'activait qu'après un premier passage).

### Carte
- Marqueurs par service, mêmes codes couleur que l'app : **ambre = électricité,
  sky = eau, vert = résolu** ; filtres et légende refaits (élec / eau / résolu).
- Popup de détail enrichie : service, description, confirmations, @pseudo (si non anonyme),
  région (ex-département).

### Config
- `.env` local branché sur **lightcutoff-dev** (dev) et **njuka-prod** (prod) + clé Stadia
  de l'app — la carte affiche les tuiles Stadia et les **signalements réels** du staging.

### Vérifications
- Build + prod OK · 52/52 tests · lint 0 erreur · navigateur : carte Stadia + données réelles
  lightcutoff-dev (6 signalements Yaoundé/Douala, popup eau Biyem-Assi avec description
  et 2 confirmations, historique daté correctement).

## [2.5.0] - 2026-08-07 — Accueil : badges stores, iOS disponible, contenu projet

- **App iOS publiée** : lien App Store réel (`apps.apple.com/app/njuka/id6794127922`,
  retrouvé via l'API iTunes Search) dans const, tutoriel et FAQ ; mention
  « Bientôt sur l'App Store » supprimée.
- **Badges stores officiels** (Google Play PNG + App Store SVG, FR/EN via i18n) à la place
  des boutons texte — hero, section app et nouveau bandeau CTA.
- **Sections équipe et partenaires supprimées** de l'accueil (+ nettoyage du code composant).
- **Nouveau contenu projet** :
  - section « Pourquoi NJUKA ? » (remplace les tuiles 2022) : coupures imprévisibles →
    information communautaire → données pour s'organiser ;
  - bandeau CTA final charbon (devise + badges de téléchargement).

Vérifié : build prod OK · 52/52 tests · lint 0 erreur · navigateur (badges FR et EN,
sections, CTA, absence équipe/partenaires).

## [2.5.1] - 2026-08-07 — Badges uniformisés + contenu « à propos » réécrit

- Badges Google Play rognés de leurs marges transparentes intégrées → **même taille
  visuelle** que le badge App Store (FR et EN).
- Contenu « à propos » entièrement réécrit (accueil + page /aboutus, FR/EN) :
  histoire (2020, LightCutOff → NJUKA, Bogal Consulting), mission (signaler/confirmer/
  alertes/coupures planifiées, Eneo + Camwater, devise), vision (des données aux
  prévisions de délestage, extension Afrique).
