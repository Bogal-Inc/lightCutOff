# Déploiement du site NJUKA

## Environnements

| Env | Projet Firebase | URL | Déclencheur |
|---|---|---|---|
| Prod | `njuka-prod` | https://njuka-prod.web.app (→ https://njuka.app) | push sur `master` |
| Preview | `lightcutoff-dev` | canal temporaire (URL commentée sur la PR) | ouverture/màj d'une PR |

Le hosting `njuka-prod` sert **le site + les pages légales de l'app** (`src/legal/` copiées à
la racine du build : /privacy, /cgu, /mentions-legales, /account-deletion, /support).
⚠️ Le repo de l'app (`lightcutoff_app`) ne doit plus déployer de hosting.

## Secrets GitHub à créer (une seule fois)

Repo GitHub → **Settings → Secrets and variables → Actions → New repository secret** :

1. **`FIREBASE_SERVICE_ACCOUNT_NJUKA_PROD`**
   - Console Firebase → projet **njuka-prod** → ⚙️ Paramètres du projet → **Comptes de service**
     → « Générer une nouvelle clé privée » → coller **tout le JSON** comme valeur du secret.
2. **`FIREBASE_SERVICE_ACCOUNT_LIGHTCUTOFF_DEV`**
   - Même manipulation sur le projet **lightcutoff-dev**.
3. **`STADIA_API_KEY`**
   - La clé Stadia Maps (la même que l'app). Sans elle, la carte retombe sur OpenStreetMap.

La config web Firebase (apiKey, appId…) n'est **pas** secrète — elle est embarquée dans le
bundle servi au navigateur — elle est donc en clair dans les workflows.

## Déploiement manuel (secours)

```bash
npm run build:prod && firebase deploy --only hosting --project njuka-prod
```

## Domaine njuka.app

Console Firebase → **njuka-prod → Hosting → Ajouter un domaine personnalisé** → `njuka.app`
(+ `www.njuka.app` en redirection), puis créer chez le registrar les enregistrements DNS
(A/TXT) affichés par Firebase. Certificat SSL automatique (peut prendre ~24 h).
Coût : 0 — seul le renouvellement annuel du domaine chez le registrar est payant.

## Reste à faire (functions)

Le formulaire de contact appelle encore la Cloud Function `contactus` de l'ANCIEN projet
(`us-central1-lightcutoff`). À migrer :
1. `functions/.env` (ou secrets) : `GMAIL_EMAIL`, `GMAIL_PASSWORD` (mot de passe d'application).
2. `firebase deploy --only functions --project njuka-prod` (remettre une section `functions`
   dans firebase.json au moment voulu).
3. Mettre à jour l'URL dans `mail.service.ts` (→ `us-central1-njuka-prod.cloudfunctions.net/contactus`).
