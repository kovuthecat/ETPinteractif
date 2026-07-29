# 2026-07-13 — Corrections audit Chrome tabac : état de sélection en mémoire, livret, cadrage app patient

### Décision

Chantier `plans/corrections-audit-tabac/` (S1-S13), traitant les 16 points d'un audit navigateur manuel de
Thibault sur le déployé (`rapport-bugs-etp-tabac.md` + `rapport-bugs-etp-diabete.md`). Au-delà des
retouches UI/a11y S1-S9 (quick-wins, chacune détaillée dans son `S<n>.md`), cinq décisions structurantes
tranchées par Thibault avant rédaction du plan :

1. **Persistance des sélections = EN MÉMOIRE, jamais `localStorage`.** Le rapport d'audit brut proposait
   `localStorage` pour que « Mon plan d'arrêt » retienne les choix faits dans les autres modules — proscrit
   (invariant « zéro donnée patient stockée », `CLAUDE.md`). Solution retenue (S10) : un **React Context
   monté dans `App.tsx`**, au-dessus du switcher de vues (`themes|home|module`), qui ne se démonte jamais
   tant que l'app tourne — il survit à la navigation inter-modules mais se réinitialise à un rechargement
   de page (comportement éphémère voulu, pas un défaut). Forme réelle de l'état par thème (`SelectionState`,
   `src/state/SelectionContext.tsx`) : `{ dateArret, situations (ids canoniques de situations.ts),
   situationsLibres (texte libre), substituts (FormeId), outilsFiche (ids d'outils), parades (4D + texte
   libre), raisons (libellés), gestesEcart (libellés + texte libre) }` — deux champs (`situationsLibres`,
   `parades`) s'ajoutent à la forme suggérée dans `S10.md` pour coller à ce que « Mon plan d'arrêt »
   affichait déjà (écart assumé, documenté dans le bilan de session).
2. **Marqueur « A » (courbe de glycémie, tous onglets Insuline) = injection d'insuline** (confirmé
   Thibault, pas « Action ») → icône Lucide `Syringe` ; « R » (repas) → `Utensils` (S7).
3. **Ordre des familles de l'accueil tabac** = **Se motiver → Comprendre → Agir** (confirmé, S9) ; thème
   diabète intact (Comprendre / Agir au quotidien / Se soigner, inchangé).
4. **Le livret d'accompagnement (S11) est livré comme une proposition non validée à l'écran** — Thibault a
   explicitement demandé de l'implémenter d'abord (« on ajustera après ») plutôt que d'attendre une revue
   visuelle intermédiaire avant de coder, à l'inverse de la règle habituelle « design fixé, ne pas
   reconcevoir » qui s'applique aux autres sessions du chantier.
5. **Module d'aide patient autonome (T16) sorti en chantier séparé cadré**, `plans/aide-patient/index.md` :
   ce n'est pas une correction mais une **nouvelle surface applicative** (2ᵉ entrée Vite, bundle qui
   n'importe jamais le registre ni un module de consultation), contenu **générique** (jamais les choix d'un
   patient), v1 = « Mes substituts » + « Agir face à une situation », **un seul QR** vers la racine de cette
   app (pas de deep-link par écran, donc pas de routeur côté patient non plus), contenu réutilisé + habillage
   patient proposé par Claude à revalider par Thibault. Hébergement de l'URL (2ᵉ projet Vercel ou vrai
   sous-domaine) différé au moment du déploiement.

### Contexte

Audit navigateur (Claude in Chrome) de Thibault sur `etp-interactif.vercel.app`, reconstruit et vérifié
fichier par fichier dans `rapport-bugs-etp-tabac.md` (16 points T1-T16, sélecteurs → fichiers vérifiés) et
`rapport-bugs-etp-diabete.md`. Passe par-dessus tout ce qui était déployé (`HEAD = origin/main`, dernier
commit avant chantier `9a6806d`, 2026-07-12 — reflète donc l'état post-`audit-diabete`/post-illustrations-
tabac). Points T6-T13/T15 = retouches UI/bugs quick-wins parallélisables (S1-S9) ; T11 = socle d'état
partagé (S10, bloquant, touche plusieurs modules + `App.tsx`) ; T14 = livret, qui **dépend** de S10 (S11) ;
T16 = nouvelle app patient, cadrée mais non exécutée dans ce chantier.

### Alternatives envisagées

- Persistance `localStorage` pour le state partagé (proposée telle quelle par le rapport d'audit brut) →
  écartée, contredit directement l'invariant « zéro donnée patient stockée » (`CLAUDE.md`).
- Remonter l'état de sélection au niveau de l'URL (querystring/routeur) → écarté : l'app n'a pas de routeur
  (navigation par état dans `App.tsx`) et une URL porteuse d'état introduirait une forme de persistance
  (historique navigateur, partage de lien possible) incompatible avec l'invariant.
- Module patient comme route masquée de l'app de consultation (`/patient`) plutôt que bundle Vite séparé →
  écarté par Thibault : « le patient n'accède jamais seul à l'outil soignant » doit se traduire par une
  **séparation physique du code** (2ᵉ point d'entrée, graphe d'import distinct), pas par une route cachée
  qui resterait techniquement atteignable depuis le même bundle.
- QR par écran (deep-link par slug d'URL) pour l'app patient → écarté : cohérent avec « pas de router » de
  l'app principale, et le périmètre v1 (2 écrans seulement) ne justifie pas d'introduire une navigation par
  URL côté patient ; un QR unique vers la racine, navigation interne par état, suffit.

### Raison du choix

Le Context en mémoire est le seul mécanisme qui satisfait simultanément « l'état doit survivre à la
navigation entre modules » (besoin fonctionnel exprimé par le plan d'arrêt, T11) et « zéro persistance »
(invariant produit non négociable) : il vit dans l'arbre React monté par `App.tsx`, jamais dans une API de
stockage navigateur ou réseau. Les arbitrages de contenu/mapping (marqueur A, ordre des familles tabac)
reflètent des décisions cliniques/pédagogiques de Thibault, tranchées avant rédaction pour ne pas les
laisser à l'appréciation de l'exécutant. Le chantier patient est cadré à part parce qu'il change
l'architecture de build (2 bundles Vite) et le périmètre produit (nouvelle audience — le patient seul, sans
soignant), ce qui en fait une nouvelle fonctionnalité et non une correction du produit existant.

### Conséquences

- Nouveau fichier `src/state/SelectionContext.tsx` (Provider générique indexé par `themeId` + hook
  `useSelection()`, aucune persistance) ; `App.tsx` monte le Provider au-dessus du rendu de module (ne se
  démonte jamais au changement de module). Câblage en écriture : `AddictionModule` (situations),
  `SubstitutsModule` (forme, via un nouveau toggle « Retenir pour mon plan »), `BoiteAOutilsModule` (outils
  « Dans ma fiche »), `MotivationModule` (raisons). `PlanArretModule` lit **et** écrit toutes ses sections
  (bidirectionnel) + `dateArret` + un nouveau bouton « Réinitialiser mon plan ».
- Nouveaux `src/components/PrintableLivret.tsx`/`.module.css` + `src/features/tabac/plan-arret/
  livretSections.tsx` (contrat `PrintableSection { id, eyebrow?, title, body, breakBefore? }` + builder
  `buildLivretSections(state)`). Le bouton « Imprimer mon plan » (ancienne fiche récap texte) est
  **remplacé** par « Imprimer mon livret complet » — il n'existe plus de fiche « plan » courte isolée
  (point ouvert à confirmer par Thibault, cf. `VALIDATION.md` §S11).
- Factorisation à l'occasion du livret, pour éviter de dupliquer du contenu clinique/présentation entre les
  modules et le livret : `FORMES_DATA`/`FormeId`/`FORMES_PONCTUELLES` extraits de `SubstitutsModule.tsx`
  vers `tabac/substituts/data.ts` ; `MOTIVATION_SEED`/`RAISON_ICONS`/`iconForRaison` extraits de
  `MotivationModule.tsx` vers `tabac/motivation/data.ts` (supprime au passage une duplication `RAISONS`
  préexistante dans `PlanArretModule.tsx`).
- Nouveau chantier cadré `plans/aide-patient/` (index.md complet, sessions P1-P6 « à écrire au lancement de
  l'exécution », non démarré) : à exécuter **après** commit/push du chantier `corrections-audit-tabac`
  stabilisé (P1 retouche substituts + boîte-à-outils, tout juste modifiés par S1/S3 — ne pas re-churner du
  code non commité).
- Gate finale du chantier : `npx tsc --noEmit` OK · `npm run build` OK · `npm test` 95/95 OK. Aucune
  dépendance runtime ajoutée (`lucide-react` déjà présent). **Aucune vérification navigateur côté Claude** —
  tout le visuel (S1-S11) reste à valider par Thibault via `npm run dev`, cf. `VALIDATION.md`.

### Impact IA

- Tout futur module tabac qui a besoin de retenir un choix entre modules doit passer par
  `useSelection(themeId)` (`src/state/SelectionContext.tsx`), jamais par un state local isolé ni par
  `localStorage`/`sessionStorage`/cookies — même règle pour l'app patient si elle en avait un jour besoin
  (non prévu en v1, qui n'a pas d'état partagé).
- Toute extension du livret (nouvelle section imprimable) doit passer par le contrat `PrintableSection` +
  `buildLivretSections` (`tabac/plan-arret/livretSections.tsx`), pas par une duplication de markup direct
  dans `PlanArretModule.tsx`.
- Avant de démarrer `plans/aide-patient/`, relire son cadrage complet (contenu générique, bundle séparé,
  couche `src/content/` comme source unique consommée par consultation **et** patient) — ne jamais dupliquer
  de contenu tabac entre les deux surfaces.
- Le livret (S11) est une proposition non revue à l'écran : ne pas la considérer comme un design validé tant
  que `VALIDATION.md` §S11 n'est pas coché par Thibault ; ne pas s'appuyer dessus comme référence de style
  pour d'autres sessions avant ce retour.

