# STATUS.md

État à l'instant T : ce qui marche, ce qui casse. Historique détaillé : `git log`.

> **Frontières** — STATUS : état actuel · `TASKS.md` : backlog + tâches · `plans/` : plan d'une tâche active · `VALIDATION.md` : checklist visuelle.
>
> **Dernière mise à jour :** 2026-07-11 (corrections-visuelles-diabete S1-S8 — chantier clos : silhouette, courbe, layouts, texte allégé)

## Phase actuelle

**Phase 9** (`plans/theme-diabete/`, câblage du thème diabète sur maquette Claude Design, 2026-07-09) : **plan S13 consolidation complet (D1-D13)**, puis **S14 — corrections de la revue visuelle de Thibault sur build local** (7 bugs, 5 modules + lib). Thème diabète opérationnel : 9 modules (Mécanisme/Alimentation/Activité physique/Risque cardiovasculaire/Complications/Suivi/Traitements/Hypoglycémie/Insuline) + lib `glycemieCurve` (modèle physiologique + tests 61/61 verts) + 4 composants transversaux (Silhouette/CourbeGlycemie/PlaqueArtere/SignatureEvitable). Gate finale : `npx tsc --noEmit` + `npm run build` + `npm test` tous verts.

**S14 (2026-07-09)** — évolutions notables :

- **Lib `glycemieCurve.ts`** : `paramsFromAssiette` dérive désormais la courbe de la **composition réelle approximative** du repas (charge glycémique, fibres, protéines, lipides — `AlimentRepas { cg, fibres, proteines, lipides }`) plutôt que d'heuristiques de familles + proximité à une assiette-modèle. `Famille` et les proportions sortent de la lib (ne vivent plus que côté `alimentation/data.ts` et modules). L'ordre du féculent devient gradué (`Assiette.ordreFeculent?: number`, 0→1) — l'ancien booléen `ordreFeculentDernier` disparaît, aucune compatibilité. Le scénario nocturne `ScenarioTrace = 'nuit_isolee'` est remplacé par `'descend_hypo_matinale'` ; le raccord nuit→jour de `sampleJournee` est désormais continu (plus de saut brutal au passage minuit).
- **`alimentation/data.ts`** : la table `FOODS` passe des CG relatives (échelle 0-100) aux **charges glycémiques réelles par portion usuelle** + nouveaux champs `fibres`/`proteines`/`lipides` (grammes réels) — seuils `cgTier` recalibrés (vert ≤10, orange 11-19, rouge ≥20). `// à revalider (Thibault)`.
- **Module 6 Suivi — inversion de la décision D9 n°2** : le cadran démarre désormais **vide** au montage (l'utilisateur le construit élément par élément), au lieu du pré-peuplement automatique posé en S9.
- Détail complet des 7 bugs (B1-B8) et invariants de tests dans `plans/theme-diabete/S14.md`.

Contexte resynchronisé (S13 puis S14) : `index.md` (S1-S14 cochées [x]), `TASKS.md` (D1-D14 [x] avec résumés de gate), `STATUS.md` (cette entrée), `DECISIONS.md`, `VALIDATION.md` (checklists visuelles mises à jour, statut « à valider par Thibault »). À compléter/revalider (Thibault) : **fréquences module 6** (ADA/HAS-SFD), **seuils module 4** (HbA1c/TA/LDL), **table CG/fibres/protéines/lipides module 2** (ordres de grandeur plausibles, révisée en S14), **phrases cliniques module 7** (8 classes, `// à revalider`), **illustrations diabete** (`design/illustrations/prompts-illustrations-diabete.html` → `public/illustrations/diabete/<id>.png`, convention d'ids dans `S1.md`).

## Phase actuelle (suite)

Phase 1 (squelette + 6 modules tabac) terminée. Phase 2 (corrections UX, `plans/PLAN_corrections-ux.md`) : C1-C9 faits, reste **C10** (bloqué sur contenu à fournir par Thibault). Phase 3 (`plans/PLAN_corrections-v2.md`, captures Thibault 2026-07-01) : R1-R9 faits. Phase 4 (`plans/corrections-v3/`) : V1-V8 faits. **Phase 5** (`plans/corrections-v4/`, audit Playwright 2026-07-01) : A1-A12 faits (12 correctifs UX). **Phase 6** (`plans/refonte-ui/`, refonte visuelle sur la maquette Claude Design, cf. `docs/DESIGN_REFONTE.md`) : S1-S10 + S2-S9 exécutés, T12 consolidation faite. Vague 1 (S1) : socle (fonts auto-hébergées, tokens oklch, primitives globales). Vague 2 (S10 + S2-S9 en parallèle) : restyle complète de tous les modules + réécriture logique des courbes (S4, S7). Résultat : palette crème/éditoriale, typographie Source Serif 4 / Work Sans, nouvelle grille de module 0–100 / 24 h. **Phase 7** (2026-07-08) : **introduction du moteur multi-thèmes**. Le thème tabac déménage sous `src/features/tabac/` (7 modules + `nicotineCurve.ts`, inchangés fonctionnellement), le moteur (`types.ts`, `registry.ts`, `src/components/`) devient générique (plus aucun id/nom de thème en dur), un écran `ThemeSelector` apparaît car un 2e thème `diabete` est scaffoldé (vide, `enConstruction: true`, badge « Bientôt disponible »). Le contenu clinique du diabète est en cours de cadrage avec Thibault (cf. `docs/diabete/00-global.md`) : 4 des 8 modules déjà spécifiés en détail (module, sources probantes brutes dans `docs/evidence-diabete/`), reste à finaliser avant transmission à Claude Design. **Phase 8** (`plans/extensions-tabac/`, brief Fable `docs/BRIEF_TABAC.md`) — **chantier initial clos le 2026-07-09
(X1-X7), complété le même jour par X8** (extension fiche patch demandée par Thibault hors brief initial)
: **X1** — socle générique `FicheOverlay` (aperçu A4 + impression) et CSS d'impression +
blocs typographiques de fiche, préalable bloquant aux 4 fiches concrètes (X2-X5) et au module « Mon plan
d'arrêt » (X5). **X2-X4** — les 3 fiches « Ma carte anti-envie » (Craving), « Ma méthode patch »
(Substituts), « Mes raisons » (Motivation), chacune via `FicheOverlay`. **X5** — nouveau module tabac
`plan-arret/` (8ᵉ module, famille Agir, `id: 'plan-arret'`) + sa fiche « Mon plan d'arrêt ». **X6** —
`ModuleFooterNav` générique (extrait de nicotine-toxique) câblé en pied de 6 modules (portes §3.3), fil
rouge « fumée / manque / ça se traite » posé en exergue d'accueil + clôture des 4 modules Comprendre +
pieds des 4 fiches (§3.4), composant `InfoHover` créé mais **non câblé** (aucune entrée du 2ᵉ niveau §3.5
validée par Thibault à ce stade, cf. §5 du brief — comportement attendu, confirmé encore vrai en X7).
**X7** — resynchronisation de `docs/contenu-modules-tabac.md`, `STATUS.md`, `PROJECT_MAP.md`, `TASKS.md`
sur l'état réel du code (aucun fichier `src/` modifié). X1-X6 codés mais **non commités** au moment de X7
(cf. `git status` — normal, contexte de session en cours). `tsc --noEmit` + `vite build` verts pour
l'ensemble ; `vitest run` (20 tests) vert.

## Phase actuelle (suite)

**Phase 9 (approfondissement-tabac)** — **Chantier multi-agents S1-S6 + consolidation S7 (2026-07-09/10)** :
Trois domaines d'amélioration du thème tabac lancés le 2026-07-09 pour approfondir la compréhension clinique :
1. **Courbes réalistes** (S3) : refonte du modèle `nicotineCurve.ts` pour refléter les ordres de grandeur
   pharmacologiques réels (demi-vie ≈ 2 h, pic cigarette < 10 min, patch 2-4 h, saturation/tolérance, tension
   du manque liée à la nicotinémie) tout en préservant la pédagogie des 3 zones. API gelée. 37 invariants testés
   → 78/78 tests verts (S3).
2. **Silhouette générique** (S2) : promotion du composant diabète en `src/components/SilhouetteCorps` générique
   (zones en données, états `actif`/`ouvert`/`allume`/`verrouille`/`masque`, motif vaisseaux optionnel) ; wrapper
   diabète en `src/features/diabete/components/Silhouette.tsx` iso-API (aucun module diabète ne change).
3. **Deux nouveaux modules tabac** (S1 socle, S5-S6 implémentation) :
   - **Module 9 — Ce que l'arrêt répare** (S5) : silhouette générique + frise de 10 jalons (20 min → 10-15 ans)
     rallumant le corps zone par zone — registre exclusivement positif (jamais l'organe malade). Famille Se motiver.
     Chiffres à revalider (source : Tabac Info Service / OMS).
   - **Module 10 — Vrai ou faux ?** (S6) : 15 cartes d'idées reçues, verdict factuel + nuancé + sourcé (livrées
     toutes actives, cartes 4/14/15 flaggées `// à revalider (Thibault)` pour revue clinique réelle avant
     usage en consultation). Famille Comprendre. Ton informatif, jamais culpabilisant.
4. **Prompts d'illustrations** (S4) : section « Tabac — bénéfices » (8 vignettes d'organes) + « Tabac — vrai/faux »
   (15 vignettes affirmations) dans `design/illustrations/prompts-illustrations-diabete.html` + nouveau style
   carré `tabacsq` (palette crème/kraft, format 1:1).

**Points à revalider par Thibault** (non bloquants pour S7, livrés avec la liasse de commits) :
- **Jalons S5** : chiffres et formulations (source Tabac Info Service / OMS, constantes commentées `// à revalider`).
- **Cartes sensibles S6** : vapoteuse (n° 14) et réduction (n° 15) — contenu marqué `// à revalider`, statut
  `actif: true` actuellement pour permettre revue réelle en usage. Retrait possible sans code change.
- **Carte S6 supplémentaire** : n° 4 « Quelques cigarettes » — marquée `// à revalider` sur la source, formulée
  sur Santé publique France (vérifier actualité).
- **Mention du graphe S3** : `NicotineModule.tsx` dispose d'une mention actualisée (« ordres de grandeur réels »)
  **derrière une constante avec `// à revalider (Thibault)`** ; l'ancienne mention reste par défaut.
- **Illustrations tabac** : PNG à générer selon les prompts S4 et déposer dans `public/illustrations/tabac/<id>.png`
  (piège C2PA/Inkscape : ré-encoder via Pillow ; convention d'ids dans `plans/approfondissement-tabac/S4.md`).

**Gate consolidation S7 (avant commit)** : `npx tsc --noEmit` ✓ · `npm run build` ✓ (1855 modules) ·
`npm test` ✓ (78/78 tests). Commits S1-S6 créés atomiquement (5 fichiers) + commit docs
(contenu-modules-tabac.md) + commit contexte (STATUS/TASKS/VALIDATION/PROJECT_MAP/DECISIONS/index.md).
Aucun push (attente validation orchestrateur).

## Phase actuelle (suite)

**Phase 10 (`plans/boite-a-outils/`)** — **Chantier vagues parallèles BO1-BO8 + consolidation BO9
(2026-07-10)**, issu du rapport OpenEvidence « stratégies comportementales du sevrage »
(`docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`) :

1. **Fusion Craving → Stratégies & outils** (BO1-BO2) : le module `craving` disparaît du registre ;
   `boite-a-outils` prend sa place (famille agir, hue vigilance). L'outil vague/4D est déplacé (pas
   réécrit) dans `boite-a-outils/VagueCraving.tsx` — mécanique et fiche « Ma carte anti-envie »
   inchangées — et devient un outil parmi **14**, filtrables par situation (union : transverse, ou
   intersection avec les chips actives). Fiche « Ma boîte à outils » (nouvelle) composée des outils
   cochés. `src/features/tabac/craving/**` supprimé après déplacement du code.
2. **Contexte de navigation générique** (BO1) : `ModuleProps` gagne `context?: unknown` (moteur agnostique
   de sa forme) ; `App.tsx` le transporte dans l'historique. Réutilisable par tout thème futur.
3. **Refonte du module Composantes** (BO3) : `AddictionModule.tsx` devient une page de repérage pur —
   situations de `situations.ts` (20 situations, 3 piliers, partagées avec Stratégies & outils) en
   **menu radial sélectionnable**, aucune description ni solution à l'écran (narration = soignant), CTA
   contextuel unique « Stratégies et outils (n) » vers `boite-a-outils` avec la sélection en contexte.
4. **Vrai/faux enrichi** (BO4) : 6 nouvelles cartes (poids ×3, vapoteuse ×3) + reformulation de la carte
   faux pas + retarget des renvois `craving` → `boite-a-outils` — **21 cartes** au total (contre 15).
5. **Vapoteuse réintégrée dans les Substituts** (BO5) : 6ᵉ forme, badge « Réduction des risques »,
   encart de statut « pas un médicament » — revient partiellement sur le retrait du 2026-07-08.
6. **Plan d'arrêt — section « Si j'ai un écart »** (BO6) : 7ᵉ section (3 gestes de secours) + reprise
   sur la fiche imprimée + « Vapoteuse » ajoutée aux chips substituts.
7. **Prompts d'illustrations** (BO7) : section « Tabac — Stratégies & outils » (14 outils + vapoteuse)
   dans `design/illustrations/prompts-illustrations-diabete.html`.
8. **Diabète/Activité — filtre « toniques uniquement »** (BO8) : interrupteur qui masque les activités
   légères de la **réserve** sans jamais retirer un choix déjà placé dans la jauge.

**Points à revalider par Thibault** (non bloquants, livrés avec la liasse de commits) :
- **Vapoteuse (Substituts, BO5)** : technique d'utilisation rédigée par Fable (HAS/HCSP + rapport OE).
- **11 des 21 cartes Vrai/faux** (BO4) : sources internationales (NEJM, Cochrane 2025, ACC, JAMA) ou
  Santé publique France, en attendant un équivalent HAS/Tabac Info Service.
- **Formulations patient des 14 outils** (BO2) : adaptées du rapport OE — à juger à l'usage.
- **Occurrences résiduelles du mot « craving »** hors zone de tout `S<k>.md` de ce chantier (non
  corrigées, signalées) : `src/features/registry.ts` (description libre du thème, signalé dès BO1),
  `nicotine/NicotineModule.tsx` (libellé texte, pas un id de navigation), `plan-arret/PlanArretModule.tsx`
  (commentaire de code référençant l'ancien chemin `craving/`, signalé dès BO2). Détail dans
  `DECISIONS.md` (2026-07-10, points ouverts).
- **Illustrations tabac (BO7)** : 15 PNG à générer (14 outils + vapoteuse) et déposer dans
  `public/illustrations/tabac/<id>.png`.

**Gate consolidation BO9 (avant commit)** : `npx tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓.
Commits BO1-BO8 créés atomiquement (par tâche) + commit contexte
(docs/STATUS/TASKS/VALIDATION/PROJECT_MAP/DECISIONS/index.md). Aucun push (attente validation Thibault).

## Phase actuelle (suite)

**Phase 11 (`plans/illustrations-diabete/`)** — **S1 : pipeline d'assets + silhouette partagée
`bodyImage`/hotspots (2026-07-10)**, premier virage « illustration-driven » du thème diabète
(abandon de la vectorisation, cf. `index.md` §1) :

1. **`design/illustrations/build_assets.py`** (outil local Pillow+numpy, hors `package.json`) :
   `build_opaque`/`build_transparent` — ré-encodage (élimine les chunks C2PA), recadrage optionnel,
   flood-fill de transparence (8 points de bord, seuil 42, préserve l'intérieur clair fermé),
   **palette adaptative 256 couleurs** (RGB seul pour les overlays, alpha préservé en pleine
   résolution) pour tenir sous ~90 Ko/asset — les illustrations sources étant en aplats, la perte est
   visuellement nulle (vérifié à l'œil sur chaque sortie).
2. **7 assets déposés** dans `public/illustrations/diabete/` : `silhouette.png` (26 Ko, opaque),
   `organe-yeux.png` (39 Ko), `organe-reins.png` (38 Ko), `organe-nerfs.png` (62 Ko),
   `pied-auto-examen.png` (50 Ko), `plaque.png` (36 Ko), `artere-saine.png` (73 Ko).
3. **`SilhouetteCorps.tsx`** (générique) : nouvelle prop `bodyImage?string` — si fournie, le
   conteneur passe en carré (1:1), rend `<img>` au lieu du corps SVG codé, et les zones basculent en
   **mode hotspot** (bouton transparent, halo radial doux au survol/actif — `--color-nav-soft` puis
   `--color-confort-soft` si ouvert/allumé —, **aucun cercle ni icône permanents**). Sans `bodyImage`,
   rendu strictement inchangé (corps SVG + pastilles pleines, tabac intact).
4. **Wrapper diabète (`Silhouette.tsx`)** : passe `bodyImage={silhouette.png}` ; `SILHOUETTE_ANCHORS`
   recalibrées en **pourcentages de l'image carrée** (repère différent du pixel `SILHOUETTE_VIEWBOX`
   340×760 utilisé par le corps codé tabac), valeurs de l'index §7 — le nerf est positionné sur la
   main (validé au prototypage). `RisqueCardioModule.tsx` (M4) ajusté en conséquence pour son overlay
   plaque existant (positionnement seulement — le recâblage complet de la plaque en illustration reste
   S3).

**Points à revalider par Thibault** (non bloquants) : alignement fin des hotspots sur les organes de
l'illustration (validation visuelle humaine, `npm run dev`, cf. `VALIDATION.md`) ; le recâblage réel
des modules M4/M5/M7 (overlays, panneaux) reste à faire en S2/S3/S5.

**Gate S1** : `npx tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78 tests, aucune régression).

**S2 (2026-07-10) — M5 Complications** : `ComplicationsModule.tsx` affiche désormais l'illustration de
l'organe (`organe-yeux/reins/nerfs.png` ou `pied-auto-examen.png`) en tête du panneau détail, à côté du
titre (104 px, cadre doux `--color-bg`/bordure fine — `.organeHead` dans le CSS module), pour les 4
organes explorables (yeux/reins/nerfs/pied) ; cœur/cerveau restent verrouillés, inchangés. Aucune
donnée texte modifiée (`complications/data.ts` intact) ; `SignatureEvitable` reste codé. Gate :
`tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).

**S3 (2026-07-10) — M4 Risque cardiovasculaire** :
- **`PlaqueArtere.tsx` réécrit** : ne dessine plus le vaisseau (paroi/lumière codées) mais **seulement
  le dépôt qui grossit** (une ellipse transparente, même courbe `pot = encrassement^0.75` et mêmes
  paliers de teinte qu'avant), destinée à être posée en overlay sur une illustration. Nouvel export pur
  `plaquePassagePct(encrassement)` (% de lumière ouverte, indépendant du tracé).
- **Vue ② « L'artère »** : le vaisseau codé est remplacé par `artere-saine.png` (S1) en fond, avec
  `PlaqueArtere` en overlay absolu (`.artereOverlay`, rotation ≈ -25° calée sur l'axe de l'illustration
  par analyse PCA des pixels non transparents) qui grossit par-dessus. Le texte « Passage du sang : X % »
  reste affiché sous l'image (`plaquePassagePct`).
- **Vue ③ « L'anatomie »** : les pastilles de plaque codées (variante `pastille` de `PlaqueArtere`,
  supprimée) sont remplacées par l'image `plaque.png` (26×26 px, transparente), positionnée et pivotée
  par territoire (`PLAQUE_OVERLAYS` : cou 50/17 rot 90°, cœur 49/26 rot 0°, jambes 46/63 rot 90° —
  index illustrations-diabete §7) directement sur la silhouette `bodyImage`.
- **5 feux → lucide** : `IllustrationSlot` remplacé par `Droplet`/`Gauge`/`Droplets`/`Cigarette`/
  `Armchair` dans un cadre circulaire neutre (`--color-bg`/bordure, icône `--color-nav`) — la
  sémantique vert/ambre/rouge de l'état reste portée par la carte (bordure + bouton d'état), jamais par
  l'icône elle-même, conformément au garde-fou du plan.

⚠️ Point à revalider visuellement (Thibault, `npm run dev`) : l'alignement précis de la plaque overlay
(vue ②, angle/position) et des pastilles `plaque.png` (vue ③) sur l'illustration — calculs faits par
analyse d'image hors navigateur, jamais vérifiés à l'écran par Claude (règle projet). Un ajustement de
coordonnées (`.artereOverlay` en %, `PLAQUE_OVERLAYS` en %) peut être nécessaire après cette revue.

Gate S3 : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).

**S4 (2026-07-10) — M1 Mécanisme** : `MecanismeModule.tsx` réécrit en intégralité (remplace le
wizard codé 4-temps/5-cellules par une **animation illustration-driven à 4 modes**, contrôle **par
cellule** — 3 cellules, pas 5), portée fidèlement du prototype validé `proto-m1-anim2.html` :
- **Sélecteur de mode** (Sans diabète / Insulinopénie / Insulinorésistance / Mixte) persistant, pas
  de navigation linéaire next/prev.
- **Boucle de 3 phases** (400 → 1600 → 2700 ms, relance à 4900 ms) : clés qui partent du pancréas
  vers les serrures → serrures qui réagissent (ouverte/fermée/rouillée, images crossfadées) →
  sucre qui se dépose ou se vide dans une artère codée sous les cellules (jetons `sugar.png`,
  8 max, libellé tricolore confort/vigilance/toxique).
- **6 nouveaux assets** (`design/illustrations/build_assets.py` étendu, table `ASSETS` avec
  support multi-dossier source `base=` pour les régénérations 2026-07-11 à la racine de
  Downloads) : `cell-closed/open/rusty.png`, `key.png`, `sugar.png`, `pancreas.png` (recadré
  moitié haute « en forme »).
- **`prefers-reduced-motion`** : un hook dédié (`usePrefersReducedMotion`) coupe la boucle de
  `setTimeout` et affiche directement l'état final du mode (clés insérées visibles, pas
  invisibles) — la neutralisation CSS globale seule ne suffisait pas ici (elle accélère les
  transitions mais la scène aurait continué à changer d'état toutes les ~1 s).
- **Option écartée** : l'artère sous les cellules reste la **barre codée** (comme le prototype
  validé), pas `artere-saine.png` étirée — l'idée (notée « à tester » dans le plan) n'a pas été
  retenue faute de pouvoir A/B tester visuellement (pas de navigateur côté Claude) ; l'illustration
  compacte du M4 risquait de se déformer sur une largeur ~4× plus grande que sa proportion native.

⚠️ Point à revalider visuellement (Thibault, `npm run dev`) : positions/rotations des clés
volantes et proportions de la scène (boîte de référence 1060×340 en %, jamais vérifiée à l'écran).

Gate S4 : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).

**S5 (2026-07-10) — M7 Traitements** : **vérification, aucun code modifié**. `TraitementsModule.tsx`
consommait déjà `Silhouette` sans coordonnées en dur ; depuis S1 le wrapper diabète passe
systématiquement `bodyImage`, donc M7 affichait déjà la silhouette-image + hotspots sans recâblage.
Confirmé : cœur/reins `allume` (halo confort) selon la ligne d'ordonnance sélectionnée, 6 autres
zones `masque`, halo « sucre » CSS existant compatible avec le conteneur carré, pictos déjà lucide.

**S6 (2026-07-10) — M6 Suivi** : les 9 icônes de station du cadran (`suivi-stethoscope`,
`suivi-prise-de-sang`, `suivi-organe-<protects>` ×7) passent d'`IllustrationSlot` (jamais générées)
à un composant local `StationIcon` — lucide dans un cadre circulaire/arrondi neutre (`--color-bg`/
bordure, icône `--color-nav`), aux 3 tailles déjà utilisées (34/38/44 px cadran+panneau, 160 px
porte « Ce que ça garde »). Mapping : stéthoscope/prise de sang/vaisseaux/cœur/yeux/défenses
(index §4) + **pied → `Footprints`** (non listé dans le plan, ajout évident) + **rein → reste
l'image `organe-reins.png`** (S1, seule exception « tout lucide », lucide n'a pas de rein) +
**dentiste (protège « bouche ») → `Smile`** (décidé). `IllustrationSlot` n'est plus importé dans
ce module ; le cadran, l'aiguille et le centre (motif fil rouge) restent codés (inchangés).

⚠️ Écart mineur au libellé du plan : « vaccins → Syringe » est repris tel quel pour la clé
`defenses` (le seul examen protégeant les « défenses immunitaires » est justement Vaccins dans le
code actuel — une seule icône, pas deux) — préféré à `ShieldPlus` (aussi suggéré) pour rester
littéral avec l'exam concret que voit le patient. Détail dans `DECISIONS.md`.

Gate S6 : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).

**S7 (2026-07-10) — Vignettes M2/M3/M8, chantier illustrations-diabete clos** : lot quasi complet
de sources retrouvé dans Downloads (généré côté Thibault en parallèle des sessions S1-S6) —
**62 nouvelles vignettes** déposées via `build_assets.py` (table étendue à 75 entrées au total) :
- **M2 Alimentation** (33) : les 28 aliments déjà en données + **5 nouveaux** ajoutés à
  `alimentation/data.ts` (`pates-blanches`, `pates-completes`, `couscous-complet`,
  `banane-plantain`, `haricots-rouges`, famille féculents, `// à revalider (Thibault)`) — seuils
  du défi ② (`PEAK_BAS_MAX`/`PEAK_HAUT_MIN`) non affectés (constantes indépendantes du nombre
  d'aliments, comme pour l'ajout oméga-3 C4).
- **M3 Activité physique** (18) : centre + 4 rayons + les 12 activités existantes + **`sol`**
  (« Se relever du sol », ajouté à `activite/data.ts`).
- **M8 Hypoglycémie** (11) : les 7 signes + 4 resucrages, aucune donnée à ajouter (ids déjà présents).

Échantillon relu à l'œil (légumineuses texturées lentilles/haricots rouges, huile d'olive, figure
activité, signe, resucrage) : flood-fill propre, aucune perte de détail, poids raisonnable (22-140
Ko, quelques assets riches en couleurs — pâtes complètes 131 Ko, couscous complet 140 Ko —
légèrement au-dessus de la cible ~90 Ko mais non bloquant). `public/illustrations/diabete/` compte
désormais **75 fichiers**. Session marquée récurrente dans l'index (§8) : à rouvrir à chaque futur
lot de vignettes.

Gate S7 : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78, y compris `glycemieCurve.test.ts`
inchangé malgré les 5 nouveaux aliments).

**Chantier `illustrations-diabete` (S1-S7) clos ce jour** — voir `plans/illustrations-diabete/`
pour le détail complet. Points ouverts non bloquants : alignement visuel de la plaque overlay (S3)
et des clés volantes (S4) jamais vérifié à l'écran par Claude ; toutes les valeurs nutritionnelles
`// à revalider (Thibault)`.

## Phase actuelle (suite)

**Phase 12 (`plans/corrections-visuelles-diabete/`)** — **Chantier de correction visuelle en cours
(2026-07-11)**, issu de la revue de Thibault sur le déployé (13 captures annotées → 5 causes-racines :
A silhouette trop petite/halo invisible, B courbe glycémie peu lisible, C mise en page petite/vide/
débordante, D trop de texte, E cercle blanc Activité). Mode solo (Sonnet), 8 sessions S1-S8, commits +
push groupés en fin de plan (cf. `index.md`).

- **S1 (2026-07-11) — Silhouette partagée** : mode hotspot (`bodyImage`) de `SilhouetteCorps` agrandi
  (`.wrapImage` 340→460px max-width), halo « allumé » franc (anneau plein `--color-confort` +
  `box-shadow` + `scale(1.05)`, `prefers-reduced-motion` neutralisé) + anneau pointillé discret au
  repos (découvrabilité). Zones `verrouille` restent cliquables en mode hotspot (ouvrent leur panneau
  « déjà vu ») — seul le mode pastille (tabac) garde `disabled`. Traitements/Complications/Risque
  cardio ③ : silhouette portée à ~400-420px, boutons/chips organe redondants retirés (sélection
  directe sur la silhouette). Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (78/78).
  Visuel → `VALIDATION.md` §Corrections visuelles diabète.

- **S2 (2026-07-11) — Courbe glycémie** : `glycemieCurve.ts` désaturé conjointement
  (`K_CHARGE` 60→20, `K_FREIN` 6→20, `K_RETARD` 5→14 — baisser `K_CHARGE` seul aurait laissé
  le frein cumulé rattraper le gain de charge) + effet d'ordre amplifié (`ORDRE_FREIN_BONUS`
  0.45→0.6, `ORDRE_RETARD_BONUS` 0.35→0.5) : un féculent seul culmine désormais ~80/100, trois
  cumulés ~90/100 (contre ~55/67 avant). `bandeToY` déplacé de `insuline/scenarios.ts` vers
  `CourbeGlycemie.tsx` (export générique `levelMax` par défaut 100) et câblé en bande-cible sur
  toutes les courbes du module 2. Défi ① : fantôme « féculents seuls » visible dès ≥1 féculent
  (sauf assiette 100% féculents). Défi ④ : nouvelle courbe fantôme « féculents seuls ». Défi ③ :
  libellés explicites premier/milieu/dernier. `PEAK_BAS_MAX`/`PEAK_HAUT_MIN` (défi ②)
  recalibrés (47/50 → 55/74) par ré-échantillonnage du garde-manger complet (33 aliments) — les
  4 duels du brief (baguette/pain complet, riz blanc/basmati, riz blanc/lentilles,
  dattes/pastèque) donnent désormais des tiers différenciés. 2 tests ajoutés (pic 3 féculents >
  1 seul ; delta ordre ≥ 15). Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80).
  Visuel → `VALIDATION.md` §Corrections visuelles diabète (amplitudes `// à revalider`).

- **S3 (2026-07-11) — Layout Alimentation** : passe purement dimensionnelle (aucune logique
  touchée) sur `AlimentationModule.module.css`/`.tsx` — assiette défi ① 300→400px, cartes défi
  ② 320→380px (réparties `space-around` au lieu de `center`), bouchées défi ③ 150→190px
  (`space-around`), camembert défi ④ 240→300px, vignettes garde-manger 92→104px, jetons
  synthèse 100→120px ; 5 tailles `size={}` d'`IllustrationSlot` relevées en proportion. Gate :
  `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80). Visuel → `VALIDATION.md`.

- **S4 (2026-07-11) — Suivi Parcours** : `.parcours` toujours empilé (fin du côte-à-côte
  `flex-direction: row` ≥860px, qui débordait à droite, capture #3) ; `consultRow`/`examRow`
  réduits à 4-5 zones lisibles (`icône+nom` · `un seul stepper de fréquence` · `statut` ·
  `Placer sur le cadran`), les groupes de chips de fréquences (3 puis 4 boutons) remplacés par
  un stepper `‹ valeur ›` (`cycleValue`) ; polices relevées ≥14px partout (`examProtects`
  10→14, `stepper span` 12→15, `examStatus` 12→15) ; bouton dédié « Ce que ça garde » retiré,
  son rôle repris par l'icône de ligne (devenue cliquable). Le réglage fin du mois de départ
  (steppers `STEP_CONSULT_START`/`STEP_EXAM_MONTH`) est retiré avec son UI — décision
  documentée dans `DECISIONS.md`. Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓
  (80/80). Visuel → `VALIDATION.md`.

- **S5 (2026-07-11) — Activité ① Rayonnement** : le nœud n'est plus un disque crème qui
  écrase l'image (capture #4) — `.node` devient un simple point d'ancrage (position +
  `aspect-ratio` carré, préservé pour ne pas décaler le centrage), `.nodeButton` porte
  l'anneau d'état (`overflow: hidden`, bordure repos/allumé/sucre) et l'image plein cadre
  (44→104px rayons, 56→128px centre) ; label/hint/suite regroupés dans un nouveau bloc
  `.nodeBelow` positionné sous le cercle (n'agrandit plus la boîte centrée). Nœud centre
  restructuré en `<div>` (ancrage) + `<button>` interne (clic), au lieu d'un seul élément
  combinant les deux. Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80).
  Visuel → `VALIDATION.md`.

- **S6 (2026-07-11) — Mécanisme, option B** : la boucle auto-relancée (relance à 4900ms,
  ~2,2s de tenue sur l'état final, capture #11) devient une séquence jouée **une fois**
  (500→2000→3400ms) puis figée sur l'état final indéfiniment ; bouton « Rejouer » sous la
  légende (masqué si `prefers-reduced-motion`), nouveau state `replayKey` pour permettre de
  relancer même en recliquant le mode déjà actif. Décision (option B vs A) documentée dans
  `DECISIONS.md`. Gate : `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80).
  Visuel → `VALIDATION.md`.

- **S7 (2026-07-11) — Plaque d'athérome en croissant** : `PlaqueArtere.tsx` remplace l'ellipse
  centrée (blob flottant, capture #13) par un dépôt en **croissant** collé à la paroi
  (`crescentPath`, Bézier quadratique plate aux extrémités, bombée au centre), 2ᵉ dépôt sur la
  paroi opposée à `encrassement > 0.5` (rétrécissement bilatéral). Même courbe de croissance
  (`pot = encrassement^0.75`), mêmes paliers de teinte, `plaquePassagePct` non modifiée (la
  profondeur du croissant dérive de la même formule pour rester cohérente avec le texte
  affiché). ⚠️ Alignement dans la lumière de `artere-saine.png` jamais vérifié à l'écran
  (`.artereOverlay` laissé inchangé, déjà calé en S3 illustrations-diabete). Gate :
  `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80). Visuel → `VALIDATION.md`.

- **S8 (2026-07-11) — Passe « moins de texte » agressive (9 modules)** : intros/consignes de
  tête de module, bandes de légende explicatives en bas d'écran et hints redondants retirés
  sur les 9 modules diabète, selon la règle de tri du plan (coupe l'ambiant, garde les
  eyebrows courts et tout texte sortie d'une interaction). Onglet ③ Insuline renommé
  `'③ Décider'` (était `'③ 2 situations'`, trompeur — la carte ① a 3 chips). Bundle JS réduit
  (459,9→455,0 kB) sans perte de fonctionnalité. Détail des 9 modules et des textes
  coupés/gardés dans `plans/corrections-visuelles-diabete/S8.md` et `DECISIONS.md`. Gate :
  `tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ (80/80). Visuel → `VALIDATION.md`.

**Chantier `corrections-visuelles-diabete` (S1-S8) clos ce jour** — voir
`plans/corrections-visuelles-diabete/` pour le détail complet. Points ouverts non bloquants
(validation visuelle humaine requise, `npm run dev`) : intensité du halo « allumé » de la
silhouette (S1), amplitudes de la courbe glycémie et seuils du défi ② (S2), alignement de la
plaque d'athérome dans la lumière de l'artère (S7).

## Ce qui fonctionne

- **Moteur multi-thèmes** (2026-07-08) : navigation à 3 niveaux (thèmes → accueil du thème → module,
  pile d'historique éphémère) ; `ThemeSelector` (nouveau) affiche une carte par thème, masqué si un
  seul thème existe ; `Home.tsx`, `ModuleCard.tsx` génériques (aucun id/nom de thème en dur).
- **Scaffolding** Vite + React + TS ; navigation carte ↔ module (pile d'historique éphémère) ; accueil grille familles (Comprendre / Agir / Se motiver, A3) responsive.
- **Coquille partagée** : `ModuleShell`, `Sources` (libellé « Sources » visible + focus clavier A4), `ModuleCard`. Registre + `famille` par module (A3).
- **Les 10 modules du thème tabac** implémentés (plus aucun stub) — descriptions resynchronisées sur le
  code en BO9 (2026-07-10) :
  1. **Composantes de l'addiction** (`addiction/`) — *refonte BO3, 2026-07-10* : diagramme de Venn à géométrie fixe, clic sur un pilier → ses situations (`situations.ts`) en **menu radial sélectionnable** (bouton-puce à bascule, double encodage), sélection persistante entre piliers, **aucune description ni solution à l'écran** ; CTA unique « Stratégies et outils (n) » → `boite-a-outils` avec la sélection en contexte de navigation ; plus de panneau latéral ni de navigation directe.
  2. **Nicotine** (`nicotine/`) — frise 24 h cliquable (modèle réécrit en S4, 2026-07-08) : 3 outils (Cigarette / Patch / Substitut), clic sur la frise = pose un événement à cet instant, clic sur un marqueur = le retire ; patch réglable en **quarts de dose ±¼** ; chip « Pic atteint : \<zone> » ; tooltips signes de manque/surdosage au survol/focus des libellés de zone ; `ModuleFooterNav` (X6) → Substituts, Soulagement.
  3. **Substituts & titration** (`substituts/`) — **6 formes** (patch, gomme, pastille, comprimé sublingual, spray buccal, **vapoteuse** — réintégrée BO5, 2026-07-10, badge « Réduction des risques » + encart de statut, `// à revalider`), toutes avec contenu médical (bonnes pratiques + erreurs) ; inhaleur reste retiré (2026-07-08) ; titration : bouton « + ¼ (tous les 3 jours) » + aide de condition + bannière surdosage détaillée ; aucun dosage chiffré ; fiche « Ma méthode patch » (X3) ; `ModuleFooterNav` (X6) → Plan d'arrêt, Nicotine.
  4. **Nicotine ≠ toxique** (`nicotine-toxique/`) — scène SVG, hotspots, filtres ; atténuation légère de l'autre groupe + double encodage non chromatique (icônes ⚠/🧠 + libellés de rôle) (A7) ; contenu médical (regroupements toxiques + formulation nicotine) validé par Thibault le 2026-07-08 ; bloc « Continuer l'exploration » migré sur `ModuleFooterNav` (X6) → Substituts, Nicotine, sans changement visuel.
  5. **Piège du soulagement** (`soulagement/`) — frise 24 h cliquable (modèle réécrit en S7, 2026-07-08) : clic = dépose une cigarette (chute puis remontée de la tension liée au manque), clic sur un repère = le retire, toggle « Comparer au non-fumeur » ; amplitudes du récit chiffré illustratif validées par Thibault le 2026-07-08 ; `ModuleFooterNav` (X6) → Substituts, Stratégies & outils.
  6. **Stratégies & outils** (`boite-a-outils/`, *ex-Craving, fusionné BO1-BO2, 2026-07-10*) — grille de **14 outils** filtrables par situation (union : transverse ou intersection avec les chips actives, pré-filtrée si arrivée depuis Composantes) ; panneau de détail (principe + « comment le proposer », mention de preuve qualitative, jamais de chiffre) ; outil `outil-vague-4d` → **compte à rebours réel de 3 min** (3:00 → 0:00, `CRAVING_DURATION = 180`, code hérité de l'ancien module Craving), 3 phases idle/active/done, 4 cartes D (Différer / Détourner l'attention / Se détendre — respirez / D'eau), fiche « Ma carte anti-envie » inchangée ; fiche « Ma boîte à outils » (nouvelle) composée des outils cochés ; `ModuleFooterNav` (X6) → Plan d'arrêt, Motivation.
  7. **Explorer ma motivation** (`motivation/`) — 2 onglets : « Où en êtes-vous ? » (flux de 2 questions au **cadran circulaire** `Dial` 0–10, Importance puis Confiance, relances EM, écran de synthèse) et « Mes raisons » (réserve de cartes seed → clic = ajout au tableau, **repositionnement au pointeur**, clic sans déplacement = édition, « + une raison ») ; cartes seed et libellés d'échelle validés par Thibault le 2026-07-08 ; fiche « Mes raisons » (X4) ; `ModuleFooterNav` (X6) → Plan d'arrêt.
  8. **Mon plan d'arrêt** (`plan-arret/`, ajouté X5, 2026-07-09) — famille Agir, **7 sections** (date, substituts — dont vapoteuse depuis BO6 —, situations à risque, parades, raisons, « autour de moi » fixe, **« Si j'ai un écart »** ajoutée BO6 2026-07-10) en chips multi-sélection + champs libres ; fiche « Mon plan d'arrêt » (bouton « Imprimer mon plan », actif dès qu'une section est renseignée) ; aucun `ModuleFooterNav` (volontairement — la fiche est la sortie du module).
  9. **Ce que l'arrêt répare** (`benefices-arret/`, ajouté S5 approfondissement-tabac, 2026-07-09-10) — famille Se motiver, silhouette générique + frise de 10 jalons (20 min → 10-15 ans), registre exclusivement positif ; chiffres à revalider (Tabac Info Service/OMS).
  10. **Vrai ou faux ?** (`idees-recues/`, ajouté S6 approfondissement-tabac + enrichi BO4, 2026-07-09-10) — famille Comprendre, **21 cartes** (15 initiales + 6 poids/vapoteuse ajoutées BO4), carte à la fois, verdict + explication + source + renvoi éventuel ; 11 cartes marquées `// à revalider (Thibault)` (sources internationales ou SPF).
- **Logique pure** : `src/features/tabac/lib/nicotineCurve.ts` (`sampleCurve`, `classifyZone`, `toSvgPath`, `sampleStress`), couverte par Vitest (`nicotineCurve.test.ts`, 20 tests verts — dont l'invariant R5 « creux fumeur > basal non-fumeur », la monotonie creux/rebond, et les 3 invariants de cumul V3).
- **Styles / accessibilité** : `tokens.css` (palette sémantique confort/toxique/vigilance/nav), `global.css` (cibles ≥ 44 px, `.activeDoubled`, `prefers-reduced-motion`).
- **Socle fiches à emporter** (X1, 2026-07-09) : `src/components/FicheOverlay.tsx` — composant générique
  (props `eyebrow`/`titre`/`footer`/`onClose`/`children`, zéro contenu en dur) rendu via `createPortal`
  sur `document.body` ; feuille A4 portrait (`fiche-sheet`), fond assombri cliquable + Échap pour fermer,
  focus initial sur « Fermer », en-tête eyebrow/titre serif/date du jour, pied mention fixe
  « rien n'est enregistré », barre d'actions hors feuille (Imprimer / Fermer, `data-no-print`).
  CSS d'impression (`@page A4`, `@media print` masque `#root` + `[data-no-print]`) et blocs
  typographiques réutilisables (`.fiche-titre-xl`, `.fiche-bloc`, `.fiche-signaletique` + pastilles
  numérotées, `.fiche-contact` bandeau 39 89) dans `src/styles/global.css` (section « Fiches »).
- **Les 5 fiches concrètes** (X2-X5 + BO2, 2026-07-09/10), chacune via `FicheOverlay` + `.fiche-filrouge`
  en pied : **Ma carte anti-envie** (attachée à l'outil `outil-vague-4d` de Stratégies & outils, bouton
  « Préparer ma carte », boucle signalétique 1-2-3 + 4D cochables + bandeau 39 89, contenu inchangé
  depuis l'ancien module Craving) ; **Ma boîte à outils** (nouvelle, BO2 2026-07-10 — bouton « Imprimer
  ma boîte à outils (n) », titre + consigne d'une ligne par outil coché) ; **Ma méthode patch**
  (Substituts, bouton « Imprimer ma méthode », les 3 règles + dose du moment en quarts jour/nuit —
  **étendue en X8**, 2026-07-09 : dose de jour en vert + marge de quarts vides coloriables au stylo
  (patch en cours complété + 1 patch), impression forcée des aplats (`print-color-adjust: exact`) ;
  bloc optionnel « Ma prise ponctuelle » via un sélecteur dédié à la fiche (gomme/pastille/sublingual/
  spray) affichant `TechniqueIllustration` (image-ready, placeholder tant qu'aucune image fournie) +
  bonnes pratiques de la forme) ; **Mes raisons** (Motivation, bouton « Imprimer mes raisons », cartes
  du tableau + échelles si renseignées) ; **Mon plan d'arrêt** (module `plan-arret`, bouton « Imprimer
  mon plan », les sections renseignées uniquement — dont la nouvelle section « Si j'ai un écart »).
- **Portes de fin de module + fil rouge + `InfoHover`** (X6, 2026-07-09 ; retargetées vers Stratégies &
  outils en BO1-BO2, 2026-07-10) :
  - `src/components/ModuleFooterNav.tsx` — bloc générique « Continuer l'exploration » (titre + boutons
    `{label →}`), extrait de nicotine-toxique (qui migre dessus sans changement visuel) ; câblé en pied
    de Nicotine, Soulagement, Stratégies & outils, Substituts, Motivation avec les libellés/ids verbatim
    du brief §3.3 (`craving` → `boite-a-outils` partout) — jamais un enchaînement forcé. Addiction et
    Plan d'arrêt n'ont volontairement aucune porte (Addiction a un CTA contextuel dédié, cf. Module 1).
  - Fil rouge « C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
    traite. » — champ générique `exergue?: string` sur `ThemeDef` (rendu par `Home.tsx` sous le titre),
    câblé sur le thème tabac uniquement ; classe globale `.filrouge` en clôture des 4 modules
    « Comprendre » (Addiction, Nicotine, Nicotine ≠ toxique — qui remplace son ancien « À retenir »,
    Soulagement) ; classe `.fiche-filrouge` en pied des 5 `FicheOverlay` (carte anti-envie, boîte à
    outils, substituts, motivation, plan-arret).
  - `src/components/InfoHover.tsx` — généralisation du pattern tooltip de zone du module Nicotine
    (survol + focus clavier), composant créé et fonctionnel mais **non câblé sur aucun contenu** :
    aucune des 3 entrées du 2ᵉ niveau de lecture (`docs/BRIEF_TABAC.md` §3.5 — substituts/nicotine/
    stratégies & outils) n'est marquée validée au §5 du brief à ce stade. C'est le comportement par
    défaut attendu, pas un point bloquant.

## Ce qui n'est pas fait / à compléter (non bloquant)

- **Thème diabète** : scaffold vide (`src/features/diabete/registry.ts`, `MODULES: []`) — cadrage du
  contenu clinique en cours avec Thibault (4/8 modules spécifiés en détail dans `docs/diabete/`,
  sources probantes brutes dans `docs/evidence-diabete/`), reste à finaliser les modules 5-8 puis
  transmettre à Claude Design avant tout développement.
- **Validation visuelle/UX humaine** des modules et de C8-C9 : pas encore faite (cf. `VALIDATION.md`).
- **C10 (partiel)** : sources exactes par module dans `registry.ts` — **seul point de contenu encore en attente** de Thibault (l'encart « Sources » affiche « à compléter » tant qu'elles manquent).
- **2ᵉ niveau de lecture (X6, `InfoHover`)** : contenu à câbler dès que Thibault valide tout ou partie
  des 3 entrées de `docs/BRIEF_TABAC.md` §3.5 (substituts, nicotine, Stratégies & outils) + leurs sources
  exactes (§5 du brief). Le composant générique est prêt ; il ne reste qu'à passer `content`/`children`
  dans les 3 modules concernés une fois validé.
- Dépouillement des questions de contenu le **2026-07-08** : regroupements toxiques + formulation nicotine (Module 4), amplitudes du soulagement (Module 5), cartes seed + libellés d'échelle motivation (Module 7) **validés par Thibault** ; inhaleur + vapoteuse **retirés** du Module 3 (vapoteuse réintégrée le 2026-07-10, cf. `DECISIONS.md`) ; enrichissement « outils & stratégies » Module 1 (R6) clos sans ajout. Il ne reste que les sources exactes (ci-dessus).
- **Occurrences résiduelles du mot « craving »** hors périmètre du chantier `boite-a-outils` (signalées,
  non corrigées — cf. `DECISIONS.md` 2026-07-10 « points ouverts ») : `src/features/registry.ts`
  (description libre du thème générique), `nicotine/NicotineModule.tsx` (libellé texte, pas un id de
  navigation), `plan-arret/PlanArretModule.tsx` (commentaire de code référençant l'ancien chemin).

## Dette technique / complexité

- Faible : 10 modules tabac indépendants (dont `boite-a-outils` et `idees-recues` partagent
  `situations.ts`/registres), logique pure isolée. Aucune zone difficile identifiée.
