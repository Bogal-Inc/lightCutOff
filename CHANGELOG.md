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

## [2.5.2] - 2026-08-07 — FAQ enrichie + section Distinctions restaurée

- **FAQ réécrite et étendue à 8 questions** (accordéon dynamique *ngFor, une seule ouverte
  à la fois) : disponibilité, gratuité, installation (Play/App Store), compte optionnel
  (anonyme-first), comment signaler, fiabilité (confirmations/démentis), alertes
  (proximité + coupures planifiées), position & données personnelles (liens politique de
  confidentialité / suppression de compte).
- **Section « Distinctions » restaurée** sur l'accueil (supprimée par erreur au lot 2b avec
  la section actualité) : 4e place du hackathon OPLEDA « Électricité pour tous en Afrique »
  (62 projets), avec logo et lien — placée avant le bandeau CTA.

## [2.5.3] - 2026-08-07 — Menu Statistiques désactivé

- Flag `admin: false` dans set-env (dev + prod) et environment.staging : le menu déroulant
  « Statistiques » disparaît du header en attendant la vraie section admin (lot 2d, qui
  réactivera le flag avec une authentification).

## [2.6.0] - 2026-08-07 — Section « Le problème, en chiffres » + cohérence des couleurs

### Contenu
- Nouvelle section accueil **« Le problème, en chiffres »** (bandeau charbon, entre
  « Pourquoi NJUKA ? » et la section app), chiffres vérifiés et sourcés :
  **72 %** d'accès à l'électricité (26 % en rural — Banque mondiale 2023), **≈ 8 coupures
  de courant/mois** pour les entreprises (World Bank Enterprise Surveys), **1 Camerounais
  sur 3** sans eau potable gérée en toute sécurité (OMS/UNICEF JMP). FR/EN + ligne sources.

### Cohérence des couleurs (palette ambre/charbon/sky partout)
- Nouvelle variable `--njuka-amber-dark` (#b96e00, lisible sur fond clair) ; liens du
  contenu et `.btn-link` (FAQ) en ambre foncé au lieu du bleu Bootstrap ; onglets
  (`.nav-tabs`, ex. Historique/Statistiques de la carte) actifs en ambre ; focus des
  champs de formulaire en ambre ; nouveau `.btn-outline-njuka`.
- Boutons publics alignés : « En savoir plus » (accueil), envoi du formulaire de contact,
  recherche de la carte, modal géolocalisation → styles de marque (fini les
  warning/info/primary/secondary génériques).

## [2.7.0] - 2026-08-07 — Chiffres Afrique, navigation par sections, espacement, support@njuka.app

- **Section chiffres déplacée avant « Pourquoi NJUKA ? »**, ligne de sources retirée, et
  chiffres élargis à l'**Afrique subsaharienne** (vérifiés) : **600 millions** de personnes
  sans électricité (IEA/Tracking SDG7 2023), **53 %** seulement d'accès à l'électricité
  (Banque mondiale 2023), **31 %** seulement avec une eau potable gérée en toute sécurité
  (OMS/UNICEF JMP 2022).
- **Espacement uniforme** entre toutes les sections de l'accueil (padding 4.5rem, plus de
  marges disparates 100/120 px) — hero plein écran inchangé.
- **Navigation par sections** : points fixes à droite (desktop), libellé au survol, point
  actif suivi au scroll, défilement fluide au clic (hero/à propos/chiffres/pourquoi/app/
  distinctions/contact).
- **Contact → support@njuka.app** : destinataire de la Cloud Function `contactus` et
  `Const.emailService.support` mis à jour. ⚠️ La CF doit être **redéployée** (elle tourne
  encore sur l'ancien projet avec l'ancien destinataire) — prévu au lot 2e.

## [2.8.0] - 2026-08-07 — Section carte, menu par sections, contact redesigné, identité visuelle

- **Bandeau final « Ensemble, on y voit plus clair » remplacé par « Notre carte »** :
  titre « Suivez les coupures en temps réel », texte descriptif et bouton
  « Explorer la carte » → /map (bandeau charbon).
- **Menu principal : un lien par section** de l'accueil (À propos, Le problème, Pourquoi
  NJUKA, L'application, Distinctions, Contact) via fragments d'ancrage
  (`anchorScrolling` activé + défilement fluide global), en plus d'Accueil et Carte.
- **Section contact redesignée** : kicker + titre + sous-titre centrés, formulaire dans
  une carte centrée (fond doux, liseré supérieur ambre, ombre portée).
- **Identité visuelle des sections** : « kicker » commun (libellé uppercase ambre +
  souligné) sur chaque section, fonds alternés blanc / gris doux (#f7f7f5) / charbon,
  point de navigation ajouté pour « Notre carte » (8 points).

## [2.9.0] - 2026-08-07 — Header collant + scrollspy, titres uniques, carte avant distinctions

- **Header toujours visible** (sticky, toutes pages) avec `scroll-padding-top` pour que les
  ancres s'arrêtent sous le menu.
- **Scrollspy dans le menu principal** : l'entrée correspondant à la section visible passe
  en ambre (service partagé `SectionSpyService` publié par l'accueil au scroll).
- **Section « Notre carte » déplacée avant « Distinctions »** (dots mis à jour).
- **Un seul titre par section** : les doublons noirs supprimés, les titres colorés
  soulignés (ex-kickers, promus en h2 ~1.6rem uppercase) conservés et tous centrés.

## [2.10.0] - 2026-08-07 — Stats recentrées sur la fiabilité + compteurs animés

- **Section chiffres recentrée sur le vrai problème de NJUKA** (la fiabilité et le manque
  d'information, pas l'accès à l'infrastructure) — chiffres vérifiés :
  **≈ 8** coupures/mois pour les entreprises camerounaises (Enterprise Surveys) ·
  **5 %** du CA perdu à cause des coupures (Afrique subsaharienne, Banque mondiale) ·
  **10×** le prix du réseau pour l'électricité au générateur privé ·
  **69 %** des habitants d'Afrique subsaharienne sans eau potable gérée en toute sécurité
  (OMS/UNICEF JMP).
- **Phrase-choc** en clôture : « aucune donnée publique ne mesure ce que ces coupures font
  vivre — NJUKA construit cette donnée. »
- **Animation** : compteurs 0 → cible (easeOutCubic ~1,6 s, hors zone Angular) déclenchés à
  l'apparition de la section (IntersectionObserver) + révélation des tuiles en cascade
  (fondu/translation avec délais échelonnés).

## [2.10.1] - 2026-08-07 — Stats « taux de coupure » Afrique subsaharienne

- Tuile électricité : **9** coupures/mois en moyenne en Afrique subsaharienne, 5,7 h
  chacune (Enterprise Surveys via Energy for Growth Hub) — remplace le ≈ 8 Cameroun.
- Tuile eau : **≈ 13 h** d'eau au robinet par jour en moyenne sur les réseaux
  subsahariens, coupée le reste du temps (littérature sur l'intermittence) — remplace
  le 69 % (stat d'accès).

## [2.10.2] - 2026-08-07 — 3 stats, menu « Notre carte » ancré à sa place

- Stat « 10× générateur » retirée — 3 tuiles (9 coupures/mois · 5 % du CA · ≈ 13 h d'eau/jour).
- L'entrée « Carte » du menu principal ne route plus vers /map : elle descend vers la
  **section « Notre carte »** de l'accueil (ancre #map) et est placée dans l'ordre des
  sections (entre L'application et Distinctions). La page /map reste accessible via le
  bouton « Explorer la carte » de la section.

## [2.10.3] - 2026-08-07 — Fix scrollspy (carte/contact) + lien contact du footer

- **Scrollspy corrigé** : l'algorithme prend désormais la dernière section dont le haut est
  passé sous le header (au lieu d'un point à 1/3 d'écran), avec un cas spécial bas de page
  (dernière section active) — « Notre carte » et « Contact » s'illuminent correctement,
  « Distinctions » ne monopolise plus l'état actif.
- **« Contactez-nous » du pied de page** : lien `href="#contactus"` remplacé par
  `routerLink="/" fragment="contactus"` — fonctionne depuis toutes les pages.

## [2.11.0] - 2026-08-07 — 🚀 Site déployé sur njuka-prod

- **Déployé sur https://njuka-prod.web.app** (`firebase deploy --only hosting`).
- **Pages légales de l'app fusionnées** dans le build du site (`src/legal/` → racine,
  `cleanUrls`) : /privacy, /cgu, /mentions-legales, /account-deletion, /support répondent
  200 — les liens des fiches Play Store/App Store restent valides.
- `firebase.json` réduit au **hosting seul** (les sections firestore/database/functions de
  2022 ne peuvent plus écraser les règles njuka-prod par accident) ; `.firebaserc` aligné
  sur l'app (default/staging = lightcutoff-dev, prod = njuka-prod).
- Vérifié en ligne : accueil NJUKA, routes SPA (/map, /faq) via rewrite, pages légales.
- ⚠️ Le repo de l'app (lightcutoff_app) ne doit **plus déployer le hosting** : sa section
  hosting servirait l'ancien public/ et écraserait le site.

## [2.18.0] - 2026-08-12 — Admin : page Statistiques (schéma Njuka)

- **/admin/stats** (gardée, entrée « Statistiques » dans la sidebar) : cartes d'état
  (total / en cours / rétablis / expirés — l'expiration prime sur l'archivage manuel),
  répartition ⚡/💧, compteurs mois/jour, **durée moyenne des seules coupures résolues**
  (règle d'hygiène P0 : jamais les expirées), top 5 des villes. Agrégation par helpers
  purs testés (`report-stats.ts`, 4 specs — 70 au total). Sans chart.js ni ag-grid.
- Repo app : `ct=share&mt=8` sur le lien App Store des pages de partage `/s/{id}`
  (P1.4 — commit 60eb2fe, déployé et vérifié en ligne).

## [2.17.0] - 2026-08-12 — Page SEO « Programme Eneo » + teaser horaire du délestage

- **`/programme-coupures-eneo`** : page **server-rendered** par la nouvelle CF
  `renderEneoProgram` (codebase website, rewrite hosting, cache CDN 30 min) — programme
  officiel des prochains jours groupé par jour (ville, quartier, fenêtre, motif) + CTA
  app/carte (`utm_source=seo_eneo`). Cible la recherche Google quotidienne « programme
  coupure Eneo <ville> », que l'onglet SPA ne peut pas capter. **Vérifiée en ligne**
  (contenu réel : 12–15 août). Lien dur dans le footer (« Programme Eneo »), entrée
  sitemap `daily` priorité 0.8.
- **Teaser P2.5** sur l'accueil (section L'application) : 5ᵉ feature « Bientôt —
  L'horaire du délestage » (badge ambre, liseré) : l'heure probable de coupure et de
  retour, construite à partir des signalements. FR/EN.

## [2.16.0] - 2026-08-12 — Formulaire de contact RÉPARÉ (Brevo) + admin layout fix

### Contact (le formulaire partait dans le vide depuis la migration)
- La CF `contactus` appelait Gmail avec des identifiants absents ET vivait encore sur
  l'ancien projet `lightcutoff` (URL codée en dur dans mail.service.ts). Réécrite :
  **envoi via Brevo** (secret `BREVO_API_KEY` du Secret Manager, déjà posé par le repo
  app) — expéditeur `noreply@njuka.app` (DMARC strict p=reject : jamais l'email du
  visiteur, qui passe en **reply-to**), destinataire support@njuka.app, HTML échappé
  (l'ancien code injectait le message brut), validation basique des entrées.
- **Déployée sur njuka-prod ET lightcutoff-dev** en codebase Functions séparée
  (`website` — ne peut pas marcher sur les 8 CFs de l'app, codebase default).
  `firebase.json` du site porte à nouveau une section functions (codebase only).
- `mail.service.ts` construit l'URL depuis `environment.firebase.projectId` (plus de
  hardcode vers l'ancien projet). **Testée bout en bout** : POST réel → « Sended » →
  email Brevo parti vers support@njuka.app.
- Purge : fonction `messaging` 2022 (web-push, vieux schéma `recovredAt`) supprimée,
  nodemailer retiré des dépendances, `databaseURL` de l'ancien projet retirée de l'init.

### Admin
- Fix layout (v2.15.1 de fait) : le padding compensait un header « fixe » qui ne l'est
  pas (input fixedTop mort) — bande fantôme supprimée, fond gris clair, table en carte
  blanche, footer épinglé. Rôle admin posé sur willkoua@gmail.com (prod ET staging).

## [2.15.0] - 2026-08-12 — Lot 2d v1 : section admin réelle en prod

### Accès
- **/admin/login** : connexion **Google uniquement** (signInWithPopup, remplace la
  session anonyme — pas de link) ; un compte sans droits est refusé proprement et la
  session anonyme du site est restaurée. **/admin** → redirige vers /admin/reports.
- **adminGuard** (CanActivateFn) : non-anonyme + `users/{uid}.role == 'admin'` — MÊME
  définition qu'`isAdmin()` dans les règles de l'app (pas de custom claims : réutilise
  le contrat déjà déployé). La garde n'est que de l'UX, la protection est serveur.
- `njuka.app` ajouté aux **domaines autorisés** Firebase Auth (le popup Google échouait
  sinon en auth/unauthorized-domain).

### Modération (/admin/reports)
- **Table Njuka neuve SANS ag-grid** : service ⚡💧, date, ville › quartier, état
  (En cours / Rétabli / **Expiré** / **Archivé** — l'expiration prime), confirmations,
  rayon d'impact, auteur ; filtres état + service ; pagination client (25 par tranche,
  requête plafonnée à 500).
- **Archiver / Restaurer** : `setArchivedByAdmin` (update direct limité aux champs
  autorisés par les règles ; restaurer efface AUSSI autoExpiredAt sinon le signalement
  resterait masqué). Toasts de confirmation. `getReports({includeHidden})` pour voir
  archivés + expirés (admin seulement — les règles côté serveur font foi).
- Layout admin rafraîchi : sidebar charbon (Signalements + Se déconnecter), visible
  seulement connecté-admin ; vieilles pages 2022 toujours débranchées.

### Côté app (repo lightcutoff_app, commit 111be88 sur dev)
- **Règles Firestore** : l'admin peut updater EXACTEMENT `archivedAt`/`autoExpiredAt`/
  `updatedAt` sur tout report (hasOnly) — 49 rules tests verts, **déployées sur
  njuka-prod ET lightcutoff-dev**.
- `setAdmin.cjs` paramétré par `PROJECT_ID`. ⚠️ Reste une étape à 2 mains : Willy se
  connecte une fois en Google sur /admin/login (crée le compte Auth), puis
  `PROJECT_ID=njuka-prod node functions/scripts/setAdmin.cjs willkoua willkoua@gmail.com`.

## [2.14.0] - 2026-08-11 — P1 roadmap : coupures programmées Eneo + smart banner iOS

### Coupures programmées officielles (P1.2)
- **Nouvel onglet « Programmées »** (badge compteur ambre) dans le menu de la carte :
  lecture de `official_outages` (programme Eneo ingéré quotidiennement par la CF de
  l'app) — même stratégie que l'app : requête mono-champ `country == CM` (aucun index),
  filtre date (≥ aujourd'hui) et tri côté client.
- Filtre **région** + **recherche quartier/ville**, cartes (badge « Programmée », date
  localisée FR/EN, fenêtre HH:MM–HH:MM, motif, source) alignées sur l'onglet Historique.
- Pas de coordonnées dans la donnée : **clic = recentrage Nominatim** « quartier, ville ».
- L'onglet n'apparaît que s'il y a des coupures à venir (masqué si la collection est vide).
- Nouveaux : `official-outage.model.ts` (helpers purs testés), `OfficialOutageService`,
  `MapMenuScheduledComponent`. 63 specs (8 nouvelles).

### Smart app banner iOS (P1.3)
- Meta `apple-itunes-app` (app-id 6794127922) dans index.html : Safari iOS propose
  l'installation de l'app sur toutes les pages du site.

## [2.13.1] - 2026-08-11 — P0 roadmap : filtre `autoExpiredAt` (expiration silencieuse v1.3.0)

- **Prédicat `isPubliclyVisible`** (report.service.ts, exporté et testé) : écarte
  `archivedAt` (soft-delete) ET `autoExpiredAt` (expiration silencieuse 48 h du cron
  `reportLifecycle` v1.3.0 de l'app) de la carte, des cercles et de la liste.
- Constat : le cron pose `archivedAt` en même temps qu'`autoExpiredAt` — le site était
  donc déjà couvert de facto. Le filtre explicite protège contre un découplage futur
  du contrat.
- `autoExpiredAt` ajouté au modèle `Report` avec la règle d'hygiène en commentaire :
  une durée ne se calcule QUE sur `resolvedAt`, jamais sur `autoExpiredAt`.
- 3 tests unitaires ajoutés (55 specs au total). **Le déploiement prod du cron v1.3.0
  côté app est débloqué** pour ce qui concerne le site.

## [2.13.0] - 2026-08-11 — Audit admin : −1,2 Mo sur le payload public, routes /admin débranchées

Suite de l'audit de la section admin (2026-08-11).

### Performance (site public)
- **ag-grid sorti du bundle initial** : `ModuleRegistry.registerModules` +
  `provideGlobalGridOptions` vivaient dans `main.ts` → le cœur ag-grid (chunk de ~978 Ko)
  était téléchargé par TOUS les visiteurs. Enregistrement déplacé dans le module lazy
  `ReportModule` (seul utilisateur de la grille).
- **CSS ag-grid retiré des styles globaux** (`angular.json`) : styles.css passe de
  **466 Ko à 251 Ko** (−215 Ko). À recâbler proprement au lot 2d (commentaire posé dans
  report.module.ts).
- Résultat build : ag-grid **absent de tous les chunks** ; initial total 1,56 Mo brut /
  363 Ko transférés.

### Sécurité (surface)
- **Routes `/admin/*` débranchées** (commentées dans `app-routing.module.ts`) : les vieilles
  pages 2022 (dashboard, reports ag-grid, statistics_numbers) étaient accessibles
  publiquement sans aucune garde. Pas de fuite (lecture seule des `reports` déjà publics
  via la carte), mais surface inutile. `/admin/*` → page-not-found. **À réactiver au
  lot 2d uniquement derrière `canActivate` + rôle admin (custom claims).**

### Constats d'audit restants (à traiter au lot 2d — voir tasks/todo.md)
- Bug `datestart: new Date(now.getFullYear())` (= epoch 1970, filtre inopérant) dans
  report-list ; requêtes plein-collection sans `limit` (dashboard, statistics-number) ;
  colonnes vieux schéma (location.department/neighborhood, pas de serviceType ni
  autoExpiredAt) ; page_view Analytics avec chemins codés en dur faux ; restes d'auth
  email/mdp sans UI (AuthService.login/createUser, rôle en localStorage) et écritures
  `users` mortes (UserService).

## [2.12.3] - 2026-08-10 — « Le problème » → « La réalité »

- Menu header/points : « Le problème » → **« La réalité »** ; titre de section :
  « Le problème, en chiffres » → **« La réalité, en chiffres »** (EN : "The reality" /
  "The reality, in numbers"). Choix validé par Willy parmi 4 propositions.

## [2.12.2] - 2026-08-10 — Retrait de la phrase-choc

- La phrase en italique « Et aucune donnée publique ne mesure… » est **retirée** (demande
  Willy) : la section se termine désormais sur les 3 compteurs. Clé i18n `figures.punch`
  supprimée (FR/EN).

## [2.12.1] - 2026-08-10 — Retrait de la ligne de sources visible

- La ligne « Sources : … » sous les compteurs est **retirée de la page** (demande Willy —
  allègement visuel). Les sources restent documentées dans l'entrée 2.12.0 ci-dessous,
  à ressortir si un média/partenaire les demande.

## [2.12.0] - 2026-08-10 — Chiffres camerounais sourcés (section « Le problème »)

- Les 3 compteurs passent des moyennes subsahariennes à des **chiffres camerounais récents** :
  **34 %** des Camerounais ont une électricité qui fonctionne la plupart du temps
  (Afrobarometer R9 2021/2023, dispatch AD793 avril 2024 — 84 % raccordés, −15 pts depuis
  2014) · **10,4** coupures/mois subies par une entreprise camerounaise, 93 % touchées
  (Banque mondiale, Enterprise Survey Cameroun 2024, 615 entreprises) · **82 %** ont manqué
  d'eau potable au moins une fois dans l'année, 40 % régulièrement (Afrobarometer AD784
  mars 2024 — 4ᵉ pire score sur 39 pays).
- **Ligne de sources discrète** sous les compteurs (liens cliquables vers les 3 rapports,
  ouverts dans un nouvel onglet) — cohérente avec le positionnement « NJUKA construit la
  donnée ».
- Compteurs : support des **décimales** (10,4 animé correctement, séparateur `,`/`.` selon
  la langue courante).
- Écarté (honnêteté des données) : « 5 % du CA perdu » — le chiffre officiel camerounais
  2024 est 2 % (peu parlant) ; l'estimation GICAM de 23 % circule sans source solide.

## [2.11.1] - 2026-08-07 — CI de déploiement vers l'écosystème Njuka

- **Workflow merge (master)** : lint + tests + build prod (config njuka-prod en clair,
  DOMAIN_PROD=njuka.app) → déploiement **live sur njuka-prod**.
- **Workflow PR** : build avec la config lightcutoff-dev → **canal de prévisualisation**
  Firebase (URL temporaire commentée sur la PR) ; désactivé pour les PR de forks.
- Secrets requis réduits à 3 (`FIREBASE_SERVICE_ACCOUNT_NJUKA_PROD`,
  `FIREBASE_SERVICE_ACCOUNT_LIGHTCUTOFF_DEV`, `STADIA_API_KEY`) — la config web Firebase
  n'est pas secrète et vit en clair dans les workflows. Guide : `docs/DEPLOY.md`.
