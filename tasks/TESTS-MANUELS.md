# Tests manuels — upgrade Angular 20 / Firebase 11 / Node 22

> Pré-requis : renseigner `.env` avec les **vraies** clés Firebase (+ STADIA_API_KEY optionnelle),
> puis `npm install` et `npm run start:dev` (http://localhost:4200).
> Sans vraies clés : erreurs console `installations/request-failed` normales, carte grise.

## Smoke test global
- [ ] `npm run build:prod` passe sans erreur
- [ ] `npm test` : 52/52 verts
- [ ] `npm run lint` : 0 erreur

## Accueil & navigation
- [ ] Menu de sections (points à droite, desktop) : clic = défilement fluide vers la section,
      point actif suit le scroll
- [ ] Ordre des sections : hero → à propos → chiffres → pourquoi → app → distinctions → CTA → contact
- [ ] Section « Le problème, en chiffres » (v2.12) : compteurs **34 % / 10,4 / 82 %**
      animés au scroll ; « 10,4 » s'affiche avec virgule en FR et « 10.4 » avec point en EN
      (pas de ligne de sources — retirée en v2.12.1, sources gardées dans le CHANGELOG)
- [ ] Espacement vertical identique entre toutes les sections
- [ ] Formulaire de contact : le message arrive sur support@njuka.app
      (⚠️ nécessite le redéploiement de la Cloud Function `contactus`)
- [ ] Page d'accueil : images de fond, header, footer
- [ ] Bascule FR/EN (footer) — textes avec variables (`{{year}}`, `{{projectTitle}}`) corrects
- [ ] Menus : Accueil / Carte / Statistiques (uniquement)
- [ ] Navbar responsive (burger) — collapse Bootstrap 5 fonctionne (data-bs-toggle)

## Carte (Leaflet — fonctionne SANS clé grâce au repli OpenStreetMap)
- [ ] La carte Leaflet se charge plein écran (tuiles Stadia si STADIA_API_KEY, sinon OSM)
- [ ] Géolocalisation demandée ; marqueur bleu de position
- [ ] Marqueurs signalements (rouge = coupure, vert = rétabli) + clusters, popup de détails
- [ ] Recherche de lieu (Nominatim) : « Douala » recentre la carte
- [ ] Filtres rouge/vert (plus de filtre orange « ma coupure »)

## Après lot 2a (purge vitrine) — comportements ATTENDUS
- [ ] Plus de modal « Activer les notifications » à l'arrivée sur le site
- [ ] Header sans « Mes signalements / S'inscrire / Se connecter »
- [ ] Carte : plus de bouton « + », plus de formulaire de signalement — popups de détail seulement
- [ ] /signin, /signup, /own-report, /profile → redirigent vers page-not-found
- [ ] Connexion anonyme au premier chargement (console : « signIn anonymously »)
- [ ] Formulaire contact (footer) → Cloud Function `contactus`
  (⚠️ nécessite `GMAIL_EMAIL`/`GMAIL_PASSWORD` dans l'env des functions)

## Admin (/admin, nécessite compte admin + env dev)
- [ ] Dashboard statistiques : graphiques bar + line (nouveau wrapper chart.js 4)
- [ ] Liste des rapports ag-grid, sélection de lignes

