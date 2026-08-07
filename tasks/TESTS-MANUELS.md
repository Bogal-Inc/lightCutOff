# Tests manuels — upgrade Angular 20 / Firebase 11 / Node 22

> Pré-requis : renseigner `.env` avec les **vraies** clés (Firebase + Google Maps),
> puis `npm install` et `npm run start:dev` (http://localhost:4200).
> Sans vraies clés : erreurs console `installations/request-failed` normales, carte grise.

## Smoke test global
- [ ] `npm run build:prod` passe sans erreur
- [ ] `npm test` : 52/52 verts
- [ ] `npm run lint` : 0 erreur

## Accueil & navigation
- [ ] Page d'accueil : images de fond, header, footer, modal « Activer les notifications »
- [ ] Bascule FR/EN (footer) — textes avec variables (`{{year}}`, `{{projectTitle}}`) corrects
- [ ] Menus : Accueil / Carte / Statistiques / Mes signalements / S'inscrire / Se connecter
- [ ] Navbar responsive (burger) — collapse Bootstrap 5 fonctionne (data-bs-toggle)

## Carte (nécessite clé Google Maps valide)
- [ ] La carte Google se charge (loader maison remplace @agm/core)
- [ ] Géolocalisation demandée ; marqueurs de signalements visibles + clustering
- [ ] Recherche de lieu (autocomplete Google Places)
- [ ] Filtres de marqueurs

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

