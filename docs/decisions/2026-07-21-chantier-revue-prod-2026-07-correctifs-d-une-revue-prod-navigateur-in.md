# 2026-07-21 — Chantier revue-prod-2026-07 : correctifs d'une revue prod navigateur in-app

### Décision

Six correctifs/décisions issus d'une revue prod complète (Thibault + Opus, `etp-interactif.vercel.app`) :

- **RP1 — parité de montage patient ↔ consultation.** `PatientSituations.tsx` montait l'outil interactif
  actif **après** la liste des cartes, sans overlay ni scroll — régression silencieuse de la promesse du
  chantier `outils-interactifs-2026-07` (le câblage patient existait mais n'était jamais visible, sauf
  pour l'unique outil déjà en overlay `position: fixed`). Adopté : le même schéma *early-return* que
  `BoiteAOutilsModule.tsx` (consultation) — l'outil actif remplace la liste au lieu de se monter en
  dessous. Aucun composant d'outil modifié, seul le point de montage change.
- **RP2 — le plan d'arrêt devient un plan « bornes ».** Sur demande explicite de Thibault, l'UI de
  « Mon plan d'arrêt » est réduite aux sections 1 (stratégie + date) et « Si j'ai un écart » (ex-section
  7) ; les sections substituts/situations/parades/raisons/autour-de-moi disparaissent de l'**écran**
  seulement — le livret imprimé (`livretSections.tsx`, non touché) continue de lire l'état partagé
  (`SelectionState`) en entier, rien n'est perdu côté livret. **Gate G-RP2 tranchée : oui** pour
  l'ajout d'un « + autre » dans Composantes (`AddictionModule.tsx`) — la seule saisie de situation
  personnalisée disparaissait avec la section 3 du plan ; le nouveau champ réutilise le canal existant
  `state.situationsLibres` (déjà lu par le livret, bucket « Autres »), aucun changement de reducer.
  Les parades (section 4) restent retirées sans remplacement (aucun module amont ne les alimente, le
  livret imprime déjà les 4D fixes) — statu quo assumé.
- **RP3 — le QR du livret ne doit pas sur-promettre.** Le libellé du QR (« retrouvez mes substituts et
  mes parades ») promettait une reprise personnalisée inexistante (zéro persistance + QR statique vers
  l'app patient générique). **Gate G-RP3 tranchée : (a) reformulation** (« Retrouvez l'application et
  ses outils chez vous »), pas de génération dynamique du QR. Correctif posé dans le composant partagé
  `src/components/QRBlock.tsx` (pas dans `livretSections.tsx` comme supposé initialement — c'est la
  seule source de vérité du texte, réutilisée aussi par les fiches individuelles). Les champs « + autre »
  restants valident désormais l'entrée au blur en plus d'Entrée, pour ne pas perdre une saisie tapée
  juste avant d'imprimer.
- **RP4 — vérifier avant de corriger.** Les 5 points d'ergonomie consultation relevés (débordement
  Composantes, cadran de motivation trop sensible, libellé « Glissez » d'Alimentation, gate « Voir
  l'effet » de Traitements par le nom de molécule, en-têtes à onglets multiples) ont tous été reproduits
  sur le code à jour (aucun déjà corrigé par un chantier antérieur) puis corrigés ciblés, sans refonte.
- **RP6 — cohérence & finitions tabac.** **Gate G-RP6 tranchée : (a)** la silhouette de « Ce que l'arrêt
  répare » porte désormais le surlignage d'organe (réutilise tel quel le moteur de halo déjà partagé avec
  le diabète, `SilhouetteCorps.tsx` — pas de duplication, juste l'ajout de l'allumage automatique au
  changement de repère). **Gate G-RP6 tranchée : (b)** le quiz « Vrai ou faux ? » reste volontairement
  **non-évaluatif** (aucun retour juste/faux à l'utilisateur) — posture ETP sans jugement assumée,
  aucune modification de code.

### Contexte

Revue prod menée par Thibault + Opus au navigateur in-app sur le déployé, reconstruite dans
`plans/revue-prod-2026-07/index.md`. Exécutée en vague parallèle (S1/S2/S4/S5 concurrentes sur zones
disjointes, S3 après S2 pour partage de `PlanArretModule.tsx`) + consolidation S6.

### Alternatives envisagées

- RP1 : encapsuler l'outil actif dans le conteneur existant sans early-return complet (fallback prévu si
  la barre de retour posait problème) → non nécessaire, l'early-return direct a suffi sans régression.
- RP2 : créer une source amont dédiée aux parades pour permettre leur personnalisation → écarté, hors
  périmètre de ce chantier (nécessiterait un nouveau module ou une extension d'un module existant).
- RP3 : (b) encoder l'état (substituts/situations/raisons) dans un QR généré dynamiquement → écarté par
  défaut (nécessiterait une dépendance runtime + une reprise d'état côté app patient), reste une option
  future si Thibault la demande explicitement.

### Raison du choix

Corriger une régression fonctionnelle bloquante (RP1) sans reconception ; simplifier l'écran du plan
d'arrêt sans perte de contenu au livret (RP2) ; ne pas sur-promettre au patient (RP3) ; ne corriger que
les bugs d'ergonomie réellement présents pour ne pas défaire un correctif déjà en place (RP4) ; aligner
la cohérence visuelle entre thèmes sans dupliquer de mécanisme (RP6a) tout en assumant un choix
pédagogique déjà fait (RP6c).

### Conséquences

- `PlanArretModule.tsx` et `AddictionModule.tsx` ont chacun reçu des contributions de plusieurs sessions
  du même chantier (S2+S3 et S2+S3+S4 respectivement) — commits groupés par fichier en consolidation,
  messages composés en conséquence (cf. `git log`, 2026-07-21).
- Aucune dépendance runtime ajoutée. Gate finale : `npx tsc --noEmit` ✓ · `npm run build` ✓ (2 entrées)
  · `npm test` ✓ 106/106.
- Validation visuelle humaine entièrement à faire (cf. `VALIDATION.md`).

### Impact IA

- RP1 : `PatientSituations.tsx` est désormais la référence patient du schéma early-return ; toute
  extension future des outils interactifs doit vérifier la parité patient ↔ consultation dès la
  conception, pas après coup (c'est exactement l'angle mort qui a produit RP1).
- RP2 : si un futur chantier personnalise les parades (section 4), il faudra d'abord créer une source
  amont (aucune n'existe aujourd'hui) avant d'envisager de les remettre dans l'UI du plan.
- RP3 : le libellé du QR vit dans `QRBlock.tsx`, pas dans chaque appelant — toute future évolution du
  texte QR (y compris un passage à l'option (b) encodée) se fait à un seul endroit.
- RP6a : le halo de silhouette est un mécanisme déjà générique (`SilhouetteCorps.tsx`) ; un futur thème
  qui a besoin d'un surlignage similaire n'a rien à extraire, juste à consommer la même prop.
