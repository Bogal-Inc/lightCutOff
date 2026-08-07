# TODO — Migration site web LightCutOff → Njuka

## Contexte
Site web Angular 12 + Firebase (projet `lightcutoff`, abandonné) à mettre à jour et transférer
vers l'écosystème Firebase de **Njuka** (`lightcutoff-dev` staging / `njuka-prod` prod).
Contexte produit complet : `../lightcutoff_app/CONTEXT.md` (app Flutter, la vraie source de vérité).

## État des lieux (2026-08-07)
- [x] État des lieux réalisé (voir résumé de session)

Constats clés :
- L'app Flutter Njuka est le produit vivant ; le site Angular est un web-app 2022 qui duplique
  les fonctionnalités de l'app (carte, signalements, comptes) sur un ancien modèle de données.
- Le hosting `njuka-prod` est DÉJÀ occupé par les pages légales (`lightcutoff_app/public/` :
  privacy, cgu, mentions-legales, account-deletion, support) — obligations Play Store/ASC.
  Toute migration du site doit préserver ces URLs.
- Le schéma Firestore de Njuka (SCHEMA.md app) ≠ modèle du site Angular (users/devices/reports
  ancienne forme) — le site ne peut PAS se brancher tel quel sur njuka-prod sans réécriture data.
- Stack site : Angular 12 / Node 14 / Firebase SDK v8 / Protractor — tout est EOL.

## Décision (2026-08-07)
Willy a choisi : **upgrade technique complet d'abord** (Angular 12→20, Firebase SDK v8→moderne,
Node 14→22). Rebranding Njuka + bascule projet Firebase = phases suivantes.

## PLAN — Phase 1 : upgrade stack (branche feat/upgrade-angular20) — ✅ TERMINÉE (2026-08-07)

Vérifié : build:prod OK · 67/67 tests · lint 0 erreur · functions tsc OK · smoke test navigateur OK.
Reste un report manuel : copier `tasks/ci/*.yml` vers `.github/workflows/` (sandbox bloqué).
Brief de reprise complet : `CONTEXT.md` (local, gitignoré).

Stratégie : big-bang sur branche (pas de ng update ×8 — les deps tierces mortes bloquent chaque
palier). Couche Firebase via API **compat** de @angular/fire v20 (mêmes classes AngularFireX →
changement d'imports mécanique, services intacts).

- [x] 1. Branche `feat/upgrade-angular20` + .env local depuis .env.example
- [x] 2. package.json : Angular 20, @angular/fire 20 + firebase 11 (compat), ng-bootstrap 19 +
       Bootstrap 5, ag-grid 34 (thème legacy), ngx-toastr, @ngx-translate 17, TS 5.8, rxjs 7,
       @danielmoncada/angular-datetime-picker (remplace ng-pick-datetime), chart.js 4 (wrapper
       maison remplace angular2-chartjs), @types/google.maps
       SUPPRIMÉS : @agm/core, angularfire2 v5 (mort), firebaseui (non utilisé), ngx-bootstrap
       (non utilisé), ngx-cookieconsent + cookieconsent (commenté), jquery, messageformat +
       compiler (i18n convertie en interpolation native), protractor, firebase-tools/functions
       en dépendances racine
- [x] 3. angular.json : builder `application`, output dist → firebase.json à ajuster
- [x] 4. Code : imports @angular/fire/compat/*, loader Google Maps maison (remplace
       MapsAPILoader), wrapper ChartComponent, datetime-picker fork, entryComponents supprimés,
       i18n {var} → {{var}}
- [x] 5. Templates : migration Bootstrap 4 → 5 (ml-/mr- → ms-/me-, form-group, etc.)
- [x] 6. ESLint 9 flat config (angular-eslint 20) ; e2e Protractor supprimé
- [x] 7. firebase-messaging-sw.js → scripts compat v11
- [x] 8. functions/ : Node 22, firebase-functions v6, firebase-admin 13, tslint → eslint
- [x] 9. Vérif : `npm run build:prod` OK, `npm test` OK, `ng serve` fumée
- [x] 10. CHANGELOG.md + README + tasks/TESTS-MANUELS.md

## Décision produit (2026-08-07, validée par Willy)
Le site devient **vitrine Njuka + carte publique en LECTURE SEULE + section admin des données** :
- Vitrine rebrandée Njuka (ambre #F88E01 / charbon #1A1A1A / sky #0EA5E9, devise, liens stores)
  — rebranding fusionné avec la refonte (pas de double passage).
- Carte interactive conservée mais **lecture seule** pour le public (plus d'ajout/suppression),
  et **remplacée par la stack carto de l'app Njuka** : tuiles **Stadia Maps** (repli OSM)
  → côté web : Leaflet + leaflet.markercluster, clé via env `STADIA_API_KEY`.
  Recherche de lieu via Nominatim (service déjà présent) au lieu de Google Places.
- **Section /admin** : administration des données **njuka-prod + lightcutoff-dev**
  (sélecteur d'environnement). Admin = users/{uid}.role == 'admin' (règles de l'app vérifiées :
  reports lisibles par tout utilisateur connecté, auth anonyme incluse → lecture publique OK).
- **PWA supprimée** : ngsw, manifest d'installation, firebase-messaging-sw.js, notifications
  push web, modal « activer les notifications ».
- Comptes publics (signup/signin) et signalements web supprimés ; l'auth ne sert plus qu'à
  l'admin (+ anonyme technique pour lire Firestore).

## PLAN — Phase 2 : vitrine Njuka + carte lecture seule + admin (À VALIDER puis exécuter)

Lots dans l'ordre :
- [x] 2a. **Purge** (✅ 2026-08-07, commit sur feat/upgrade-angular20) : PWA (ngsw, manifests, FCM/messaging, device.service), création/clôture de
       signalements côté public, signup/signin publics, own-report, modals messaging/geolocation.
- [x] 2b. **Rebranding + vitrine Njuka** (✅ 2026-08-07 ; reste : liens sociaux footer à trancher, sitemap au domaine final) : const.ts, i18n fr/en, index.html (SEO), sitemap,
       palette/styles, accueil (devise, features app, boutons Play Store/App Store), à propos,
       FAQ, tuto orienté app, contact (CF contactus conservée).
- [ ] 2c. **Carte lecture seule** : Google Maps → Leaflet + Stadia (+ markercluster),
       lecture des reports Njuka (élec ⚡ / eau 💧, statuts), Nominatim pour la recherche,
       suppression GoogleMapsLoaderService/@types/google.maps/clé GMaps.
- [ ] 2d. **Admin** : auth email/Google, garde role=='admin', sélecteur lightcutoff-dev/njuka-prod,
       vues reports (modération), users, official_outages, stats (vérifier droits d'écriture
       admin dans les règles de l'app ; sinon passer par des callables).
- [ ] 2e. Bascule config Firebase du site → lightcutoff-dev (dev) / njuka-prod (prod), CI,
       secrets GitHub, firebase.json ; cohabitation avec les pages légales de l'app à trancher
       (multi-sites vs fusion).
- [ ] 2f. Domaine final + suppression du projet Firebase `lightcutoff` (après migration).
