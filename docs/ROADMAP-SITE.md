# ROADMAP — Site web njuka.app (prévisions fonctionnelles)

> Feuille de route des fonctionnalités du site, dérivée des documents de vision de l'app
> (`../lightcutoff_app/docs/VISION-horaire-delestage.md`, `VISION-fil-coupure.md`) et de
> l'état produit (CONTEXT app). Rédigée le 2026-08-10.
> Rôle du site : **vitrine + carte publique en lecture seule + porte d'entrée SEO vers l'app**.
> Le site ne crée jamais de données (signalement = app uniquement, décision actée).

---

## ✅ Déjà en place (rappel)

- Vitrine complète (hero communautaire, chiffres animés, pourquoi/app/distinctions, contact).
- Carte lecture seule : données njuka-prod temps réel, cercles d'impact (`impactRadiusM`),
  filtres identiques à l'app (Tout/Élec./Eau + statut + tri, panneau repliable), liste
  synchronisée au cadre visible, recherche Nominatim.
- Domaine njuka.app + SSL, pages légales intégrées, App Links/AASA (`/.well-known/`),
  pages de partage `/s/{id}` (rewrite → CF `renderReportShare`).
- Liens stores trackés (Play referrer `utm_source=website`, Apple `ct=website`).
- i18n FR/EN avec bascule dans le header. CI prête (secrets à créer).

---

## 🔴 P0 — Correctif requis avant la v1.3.0 de l'app

### 1. Filtrer `autoExpiredAt` (expiration silencieuse)
La v1.3.0 introduit le cycle de vie des signalements : expiration silencieuse à 48 h
d'inactivité (champ `autoExpiredAt`, cron `reportLifecycle` — déployé staging, prod à venir
avec la release app). **Le site doit exclure ces signalements de l'affichage « en cours »**
(carte, cercles, liste), sinon des coupures fantômes resteront visibles indéfiniment.
- Règle d'hygiène à graver pour toute stat future : **une durée ne se calcule QUE sur
  `resolvedAt`** — jamais sur `autoExpiredAt` (qui mesure le silence, pas la coupure).
- Effort : faible (un filtre dans `report.service.ts` + modèle). À livrer **avant** le
  déploiement prod du cron.

---

## 🥇 P1 — Acquisition (le cœur de la valeur du site)

### 2. Coupures programmées officielles (Eneo) sur la carte
Reproduire l'onglet **Signalements / Programmées** de l'app : lire `official_outages`
(ingérées quotidiennement par la CF `ingestEneoOutages`, lisibles par tout utilisateur
connecté — l'anonyme suffit) et les afficher sur la carte/liste (badge « Programmée »,
date + fenêtre horaire + quartier).
- Pourquoi : « programme coupure Eneo <ville> » est une recherche Google quotidienne —
  le site peut capter ce trafic organique et le convertir vers l'app.
- Effort : moyen (nouveau service + segment Signalements/Programmées + rendu par quartier
  — les entrées n'ont pas toujours de coordonnées : afficher en liste + zone si géocodable).

### 3. Smart app banner iOS
Meta `apple-itunes-app` (app-id 6794127922) : Safari iOS affiche une bannière d'installation
native sur toutes les pages. Effort : une ligne. Équivalent Android : couvert par App Links
+ badges (pas de bannière native Chrome sans PWA — assumé, la PWA a été retirée).

### 4. Pages de partage `/s/{id}` : conversion
La page (rendue par la CF côté app) est sobre. S'assurer qu'elle pousse l'installation :
badges stores avec tracking dédié (`utm_source=share` — distinct de `website`) pour mesurer
le canal viral WhatsApp. Effort : faible (coordonné avec le repo app, la CF y vit).

---

## 🥈 P2 — Préparer la feature héroïne (horaire du délestage)

### 5. Teaser « Bientôt » sur l'accueil
Une ligne/carte sur l'accueil : « Bientôt : l'heure probable de coupure et de retour, dans
ta zone. » Différencie NJUKA de l'app Eneo (qui n'annonce que les travaux planifiés) et
donne une raison d'installer avant même la feature. Effort : très faible (i18n + section).

### 6. Pages SEO « Délestage à <ville> » (quand `schedules/` existera)
Quand l'app livrera l'horaire agrégé (collection `schedules/{geohash}` ou équivalent),
créer des pages web par grande ville : « Délestage à Yaoundé aujourd'hui — heures typiques,
confiance, coupures en cours ». Machine SEO alignée sur LA question quotidienne
(« quand le courant part / revient »). Dépend entièrement du palier 1 de la vision app.
- ⚠️ Même honnêteté que l'app : afficher la confiance, jamais de prédiction survendue.

### 7. Stats publiques de zone (palier 0 web)
« Ta ville : X h de coupure ce mois » à partir des reports **résolus** (jamais expirés) :
page de statistiques publiques par ville — accountability citoyenne, matière presse/réseaux,
zéro risque de fausse promesse. Peut précéder la prédiction. Effort : moyen (agrégation
côté client ou petite CF dédiée + page).

---

## 🥉 P3 — Amplification

### 8. Vidéo de lancement sur l'accueil
Le script v8 est final, le montage (projet Remotion `../njuka-video/`) est en cours.
Dès le rendu : intégrer la vidéo (section app ou hero) en fichier local optimisé, pas
d'iframe YouTube lourde au premier chargement (poster + lazy).

### 9. Stats live de la plateforme sur l'accueil
Quand le volume le permettra : remplacer/compléter les chiffres macro de la section
« Le problème » par les chiffres NJUKA (« X coupures signalées ce mois », « Y % non
annoncées ») — la plateforme devient sa propre preuve. Dépend de la densité.

### 10. Divers en attente de décisions
- Comptes sociaux **Njuka** (footer + page contact — actuellement comptes LightCutOff).
- Provider token Apple (`pt=`) pour l'attribution App Store Connect.
- `www.njuka.app` (DNS + domaine Firebase si souhaité).
- Section **/admin** (lot 2d) : auth `role == 'admin'`, sélecteur staging/prod, modération
  reports, users, official_outages — chantier à part entière.

---

## ❌ Ce que le site NE fera PAS (décisions actées)

- **Pas de signalement depuis le web** — la lecture seule protège la qualité de la donnée ;
  signaler = l'app (ou le futur bot WhatsApp, hors périmètre site).
- **Pas de fil de coupure web** — vision V2 de l'app, mur UGC/modération (stores), et
  « une salle à 0 user est un monologue ».
- **Pas de gamification** — décision verrouillée côté produit : fiabilité only, jamais le
  volume, et pas avant la densité.
- **Pas de PWA/notifications web** — retirées volontairement ; le push vit dans l'app.

---

## Ordre d'exécution recommandé

```
P0.1 (filtre autoExpiredAt — avant le cron prod)
  → P1.3 (smart banner iOS, 5 min)
  → P1.2 (coupures programmées Eneo — vrai chantier)
  → P2.5 (teaser horaire)
  → P1.4 (conversion pages de partage, avec le repo app)
  → P2.7 (stats de zone) → P3 selon actualité (vidéo, stats live)
```
