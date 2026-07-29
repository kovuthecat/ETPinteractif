# 2026-07-10 — Chantier approfondissement-tabac (S1-S6) : 5 décisions structurantes

### Décision ① — Promotion SilhouetteCorps générique, wrapper diabète iso-API (S2)

**Décision**

Promouvoir le composant `src/features/diabete/components/Silhouette.tsx` en composant générique
`src/components/SilhouetteCorps.tsx` (API générique, zones et états en données) ; réécrire le
diabète en wrapper fin qui préserve son API entièrement inchangée.

**Contexte**

Le module 9 tabac « Ce que l'arrêt répare » réutilise une silhouette (corps humain + zones cliquables)
avec des zones différentes (7 zones tabac vs ~10 diabète). La silhouette diabète était jusqu'à présent
spécifique au diabète.

**Raison du choix**

Conformité à l'invariant multi-thèmes. Factoriser par copie générique plutôt que par héritage.

**Conséquences**

- `SilhouetteCorps` reçoit `zones: SilhouetteZone[]` (id, label, x, y, r, etat) ; `SILHOUETTE_VIEWBOX`
  reste partagé.
- `src/features/diabete/components/Silhouette.tsx` mappe ses zones + `SILHOUETTE_ANCHORS` vers le
  générique et ré-exporte son API strictement inchangée.
- 8 imports diabète (modules : complications, risque-cardio, suivi, traitements) continuent sans
  modification.

### Décision ② — Duplication assumée d'IllustrationSlot par thème (S1)

**Décision**

Dupliquer `src/features/tabac/components/IllustrationSlot.tsx` depuis le modèle diabète ; ne pas
généraliser.

**Contexte**

Chaque thème a besoin de son propre placeholder d'illustration (chemin différent). La tentation
générale existe mais toucherait le thème diabète dans le processus.

**Raison du choix**

Simplicité et respect du contrôle de parallélisme des sessions. La duplication (~50 lignes) est
acceptable et sans regret futur.

### Décision ③ — Modèle nicotine réaliste, API gelée, invariants testés (S3)

**Décision**

Refondre `nicotineCurve.ts` pour refléter les ordres de grandeur pharmacologiques réels (demi-vie
~2 h, pic cigarette <10 min, patch 2–4 h, saturation/tolérance, tension du manque liée à la
nicotinémie), tout en gelant l'API. Aucun consommateur n'a à changer. La qualité du modèle est
garantie par 37 invariants testés Vitest.

**Contexte**

Les modules 2 & 5 contiennent des messages pédagogiques fondamentaux. L'ancien modèle était
pédagogiquement juste mais pharmacocinétiquement approximatif. Les consommateurs dépendent d'une
API stable.

**Raison du choix**

Maximiser la plausibilité pharmacologique sans casser le code. Certifier le modèle par des tests.

**Conséquences**

- Exports publics inchangés : `TIME_MAX`, `LEVEL_MAX`, `BASELINE`, `ZONE_THRESHOLD_*`, `TENSION_*`,
  `NicotineEventType`, `sampleLevel`, `classifyZone`, `tensionLevelAt`, `toSvgPath`.
- Exports supplémentaires (constantes + fonctions pures pour tests) : `T_HALF`, `K_SAT`,
  `N_APAISEMENT`, `TENSION_EXPONENT`, `cigaretteContributionRaw`, `substitutContributionRaw`,
  `patchContributionRaw`, `tensionFromNiveau` — documentés, non utilisés en dehors des tests.
- 37 invariants Vitest couvrent : baseline, clamp, monotonie, cumulativité, élimination, pics
  temps, accumulation, saturation, tension, cohérence, scénario titration.

### Décision ④ — Cartes Vrai/faux sensibles, livrées actives, à revalider (S6)

**Décision**

Livrer les 15 cartes **toutes actives** (`actif: true`), y compris les 3 cartes sensibles (n°4
« Quelques cigarettes », n°14 « Vapoteuse », n°15 « Réduire »). Ces 3 cartes portent un commentaire
`// à revalider (Thibault)` et sont destinées à une revue clinique en conditions réelles d'usage.

**Contexte**

Le module 10 est une ressource de discussion (non un quiz). Les cartes 14-15 portent sur des sujets
où les données / recommandations HAS/OMS évoluent. Mettre en face du patient en vraie consultation
est pédagogiquement utile.

**Raison du choix**

Maximiser l'utilité clinique. Retrait simple : changement d'un seul champ `actif: false`.

**Conséquences**

- Cartes 4, 14, 15 apparaissent et sont navigables.
- Feedback de Thibault après usage peut être : validation, ajustement mineur, ou retrait.
- Le commentaire `// à revalider` sur les cartes 4 et 14 signale que leurs sources (Santé publique
  France) doivent être vérifiées régulièrement (différentes de HAS).

### Décision ⑤ — Correctif de cible tactile ≥44 px appliqué au module idées-recues (S6)

**Décision**

Les points de navigation du module 10 affichent visuellement en 20 px (discrétion) mais imposent une
cible tactile **réelle** ≥44 px (conformité invariant CLAUDE.md) via une zone invisible `:before` en
`inset: -12px`. Le correctif a été appliqué en **post-session par l'orchestrateur** avant S7.

**Contexte**

CLAUDE.md prescrit « cibles ≥44 px ». Les points de navigation étaient initialement au-dessus de ce
seuil. Correction requise pour l'accessibilité tactile sur tablette.

**Raison du choix**

Conformité à l'invariant sans compromettre l'esthétique du module.

**Conséquences**

- Aucune autre modification du module requise.
- Le pattern (cible invisible > affichage) devient réutilisable pour d'autres modules si besoin.
- `VALIDATION.md` doit noter : « cibles du module 10 testées ≥44 px ».
