# Leçons — LightCutOff / Njuka (site web)

(Format : [date] | ce qui a mal tourné | règle pour l'éviter)

- [2026-08-07] | `npm install` Angular 20 en `^20.0.0` échouait : `@angular/platform-browser-dynamic`
  n'est plus publié après 20.0.x alors que les autres paquets montent en 20.3.x (peer exact) |
  Épingler TOUS les paquets `@angular/*` en `~20.0.0` (même patch mineur) quand
  platform-browser-dynamic est requis (peer de @angular/fire).
- [2026-08-07] | @angular/fire est plafonné à Angular 20 (dernière release 20.0.1) alors
  qu'Angular 22 est sorti | Vérifier la matrice de compat de @angular/fire AVANT de choisir la
  version d'Angular cible ; la couche `compat` (`@angular/fire/compat/*`) permet de garder les
  classes AngularFireX sans réécrire les services.
- [2026-08-07] | Tests en échec NG0203 : les wrappers compat v20 (`AngularFirestoreCollection`)
  appellent `inject()` dans leurs initialiseurs de champs → crash hors contexte d'injection
  (runtime ET tests) | Canaliser la création de collections/docs par un point unique (BaseService)
  et l'entourer de `runInInjectionContext(injector, …)`.
- [2026-08-07] | Depuis Angular 19 le défaut est `standalone: true` : composants déclarés dans des
  NgModules → NG6004 en masse | Lors d'un big-bang <19 → ≥19, ajouter `standalone: false` à tous
  les @Component/@Pipe/@Directive (script), ou migrer standalone d'un coup.
- [2026-08-07] | Le sandbox interdit d'écrire dans `.github/workflows/` | Préparer les YAML dans
  `tasks/ci/` et demander un report manuel.
- [2026-08-07] | `lodash` était importé sans être déclaré dans package.json (résolu par
  transitivité — bombe à retardement) | Sur un vieux repo, vérifier les imports non déclarés
  (les warnings CommonJS du builder les révèlent).
- [2026-08-07] | `functions.config()` supprimé par Firebase (functions v6) : le code Node 14 ne
  pouvait plus se déployer tel quel | Migrer vers variables d'env/`defineSecret` en même temps que
  le runtime.
- [2026-08-07] | macOS a révoqué l'accès TCC au Bureau EN COURS de session (EPERM sur tout
  ~/Desktop, même en lecture) alors que les réglages montraient l'accès accordé | La permission
  ne s'applique qu'au redémarrage complet de l'app ; en cas d'EPERM soudain sur des fichiers
  valides : diagnostiquer TCC/redémarrer l'app avant de soupçonner le code ou le disque.
- [2026-08-07] | Carte vide « permission-denied » : le site ne déclenchait l'auth anonyme
  qu'aux visites suivantes, et les requêtes Firestore partaient avant la fin du sign-in |
  Modèle anonyme-first : signInAnonymously systématique si pas de session, et TOUTE requête
  Firestore gatée par `authState.pipe(first(u => !!u))` quand les règles exigent isSignedIn().
- [2026-08-07] | NG5002 « Unclosed block » : un `@` littéral dans un template Angular 17+
  (ex. `@{{pseudo}}`) est parsé comme un bloc de contrôle | Échapper avec `&#64;`.
