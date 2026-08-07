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
