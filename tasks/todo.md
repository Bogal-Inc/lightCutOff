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

## Phases suivantes (après validation Phase 1)
- [ ] Phase 2 : rebranding LightCutOff → Njuka (~30 fichiers)
- [ ] Phase 3 : bascule Firebase vers écosystème Njuka + CI + réconciliation schéma de données
- [ ] Phase 4 : domaine + hosting (cohabitation avec pages légales de l'app)
