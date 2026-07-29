# 2026-07-13 — App d'aide patient autonome (chantier aide-patient, T16 du chantier corrections-audit-tabac)

### Décision

Créer une **2ᵉ surface applicative** (app patient autonome, sans soignant) à partir du **contenu existant du
sevrage tabagique**, avec un **périmètre v1 réduit** (deux écrans seulement) et une architecture de **bundle
Vite séparé** (jamais d'import du code de consultation).

Cinq choix structurants :

1. **Contenu générique** : le QR mène vers une **URL racine unique**, aucune donnée patient dans l'URL, le
   build ou une API — chaque patient voir le **même contenu**.
2. **Bundle physiquement séparé** : 2ᵉ point d'entrée Vite (`patient.html` + `src/patient/main.tsx`) dans le
   même repo ; le graphe d'import du bundle patient n'atteint **jamais** `src/features/*/registry.ts` ni un
   module de consultation (séparation stricte du code).
3. **Couche `src/content/tabac/`** comme **source unique** pour consultation **et** patient : tous les
   textes médical (situations, outils, substituts) vivent à cet endroit, les deux surfaces les
   réutilisent — aucune duplication.
4. **QR statique unique** : une image PNG (600×600, encodée hors-app) posée en `public/qr/patient.png`,
   régénérable si l'URL change. Pas de dépendance runtime (`qrcode` / `qrcode.react` interdits).
5. **Habillage patient proposé par Claude** : tout texte de cadrage au-portant (intro écran, libellés de
   section, bloc QR) est une proposition marquée `// à revalider (Thibault)` — ne jamais inventer de fait
   médical, juste reformuler en **voix patient** (« comment faire ») plutôt que soignant (« comment
   proposer »).

### Contexte

T16 du rapport d'audit navigateur (Claude in Chrome, 2026-07-13) : demande de complément patient autonome,
cadrée avec Thibault le même jour en session séparée (`plans/aide-patient/index.md`). Justification : le
soignant peut imprimer des fiches/le livret et y poser un QR → le patient rentre chez lui, scanne, retrouve
sur son téléphone « comment faire » sans données personnelles enregistrées.

### Alternatives envisagées

- Route masquée de l'app consultation (`/patient`) au lieu de bundle Vite séparé → rejeté : « séparation
  physique du code, jamais logique ».
- Deep-link par écran (QR vers `/patient/substituts?forme=patch`) → rejeté : incommode, introduit un
  routeur côté patient qui s'oppose à « pas de router » de la consultation ; QR unique vers la racine,
  navigation interne par état, suffit pour v1.
- Persistance `localStorage` des sélections patientes (substitut choisi, situation cochée) → rejeté :
  déroge à « zéro donnée patient ». Même si le patient ignore que ses clics ne persistent pas au-delà
  du rechargement, c'est cohérent avec le design philosophique de l'app (« éphémère, aucun enregistrement »).
- Maquette Claude Design avant S3/S4 → rejeté par défaut (v1-directe retenue : composer depuis les
  tokens/primitives/classes globales existantes, validation visuelle humaine sert de filet — même approche
  qu'extensions-tabac X1-X7).

### Raison du choix

- **Souveraineté de contenu** : une source unique `src/content/` facilite la maintenance (fix clinique appliqué
  aux deux surfaces en même temps).
- **Sécurité RGPD** : aucune donnée patient n'est jamais enregistrée, partagée ni transmise — l'app est
  **entièrement éphémère** et hors-ligne.
- **Simplicité** : un QR unique, pas de gestion de variantes d'URL ou de paramètres ; la navigation par état
  (React) suffit.
- **Réutilisabilité du code patient** : les composants `PatientApp`, `PatientSubstituts`, `PatientSituations`
  restent isolés dans `src/patient/`, ne contaminent jamais la consultation ; chaque surface réutilise
  `ModuleCard` (agnostique) pour les accueils.

### Conséquences

- **Refactor S1** : relocaliser `substituts/data.ts`, `situations.ts`, `boite-a-outils/data.ts` de
  `src/features/tabac/` vers `src/content/tabac/`, mettre à jour tous les importeurs (6 fichiers) —
  déplacement pur, aucune modification de logique (vérification Grep exhaustive).
- **Nouvelle coquille S2** : `patient.html` + `src/patient/main.tsx` + `src/patient/PatientApp.tsx` (état
  `view: 'home' | 'substituts' | 'situations'`) + `src/patient/Home.tsx` (2 cartes) + `vite.config.ts`
  (`build.rollupOptions.input: { main, patient }`).
- **Deux écrans S3-S4** (substituts/situations) : chacun un petit composant patient sans importer de module
  de consultation, une illustration locale (fallback sur `<img>` si nécessaire), une reformulation voix
  patient (`commentFaire()` pour outils).
- **QR S5** : `public/qr/patient.png` généré hors-app, constante `PATIENT_APP_URL` avec placeholder, bloc
  `QRBlock` réutilisé par `FicheOverlay` et `PrintableLivret`.
- **Aucune dépendance runtime ajoutée** : `package.json` inchangé ; `patient.html` réutilise les fonts/tokens
  globaux + `ModuleCard` agnostique.
- **Bundle séparation vérifiée post-build** : grep du bundle `dist/assets/patient-*.js` confirme aucune trace
  de `registry`, module consultation ou contenu soignant (la séparation des bundlesVite + l'absence
  d'import interdit = garde-fou physique).

### Impact IA

- Nouveau pattern pour « surfaces multiples d'une même app » : deux entrées Vite, contenu partagé dans
  `src/content/`, code surface-spécifique isolé par surface (`src/patient/` vs `src/features/`).
- Pas d'état partagé côté patient (v1) — si un jour elle en a besoin, utiliser la même `SelectionContext`
  générique que consultation (déjà en place), instancée avec `themeId = 'tabac'`.
- À chaque évolution du contenu (nouvelle situation, outil, substitut) : aucune duplication — modifier
  `src/content/tabac/`, les deux surfaces voient le changement.
- Avant futur déploiement patient : configurer la cible Vercel/sous-domaine pour servir `patient.html`
  comme racine (pas `/patient.html` sur le domaine consultation), régénérer `public/qr/patient.png` à
  l'URL définitive.

