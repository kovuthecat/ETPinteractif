# Chantier — Illustrations diabète (intégration illustration-driven)

> **Mode** : solo · **Créé** : 2026-07-10 · **Refonte complète** : 2026-07-11 (après une longue phase de prototypage visuel validée par Thibault).
> **Autorités** : ce fichier + `design/illustrations/prompts-illustrations-diabete.html` (prompts) · `docs/diabete/BRIEF_DESIGN_diabete.md` (intentions visuelles) · `PROJECT_BRIEF.md` · `DECISIONS.md`.
> **Sources images** : `C:\Users\kovu\Downloads\illustration ETP\` (+ quelques régénérations dans `Downloads\`). Hors repo — ne pas committer les sources.

## 1. Ce qui a été tranché (le grand virage)

Après analyse visuelle de ~70 images générées et une série de prototypes cliquables (voir §6), l'approche a changé du tout au tout par rapport à la v1 de ce plan :

1. **Pas de vectorisation.** Les illustrations restent des **PNG** ; on les affiche telles quelles. La vectorisation auto est lourde, sans zones, et inutile aux tailles d'affichage réelles (test fait : le SVG tracé de la silhouette pesait 2,1 Mo, sans zones exploitables).
2. **Approche « illustration + overlay interactif ».** L'illustration porte le sens ; l'interactivité vient de **hotspots HTML transparents** posés dessus (M4/M5/M7) ou d'une **animation CSS par états** (M1). Prouvé sur les 4 modules.
3. **Détourage transparent obligatoire.** Toutes les illustrations d'overlay passent par un **flood-fill des bords** (near-white → alpha, préserve l'intérieur clair). C'est l'outil-clé : sans lui, les fonds blancs font des cadres disgracieux. Script `make_transparent.py` validé.
4. **Petites icônes → lucide.** Les icônes affichées à 34-56 px (feux du M4, stations/organes du cadran M6) passent en **lucide-react**, pas en image (plus net à cette taille, thématisable — cohérent avec la décision tabac). Voir §4 pour les correspondances et le cas kidney/tooth.
5. **Silhouette partagée = `bodyImage`.** `SilhouetteCorps` (générique) reçoit une prop `bodyImage` : le corps codé reste le défaut (tabac), l'image devient l'alternative (diabète). Les pastilles opaques deviennent des **hotspots transparents à halo doux (sans cercle permanent)**. Ça met à niveau **M4, M5 et M7 d'un coup**.
6. **Objets réellement codés qui le restent** : `SignatureEvitable` (enveloppe un chiffre → ne peut pas être une image), centre du cadran M6, courbes (`CourbeGlycemie`, `glycemieCurve`), le `.muscleDot` CSS du M3, le formulaire d'ordonnance du M7. Les images correspondantes (signature, fil-rouge, marqueur muscles) sont **abandonnées** (réserve).

## 2. Pipeline d'assets (rodé, à industrialiser)

Script unique `design/illustrations/build_assets.py` (outil local, hors `package.json`). Pour chaque illustration retenue :

1. **Ré-encodage Pillow** → supprime le chunk C2PA `caBX` (sinon plante Inkscape ; inoffensif au runtime mais on nettoie).
2. **Recadrage** ciblé si besoin (ex. pancréas : garder la moitié « en forme »).
3. **Détourage flood-fill** (`make_transparent.py`, seuil ~42) depuis les 8 points de bord → fond transparent, intérieur clair préservé. **Vérifier chaque sortie** (relecture visuelle) : les objets à intérieur clair fermé (cellules) passent bien ; surveiller les objets ouverts.
4. **Redimensionnement** : vignettes de slot → 512×512 ; assets de scène (cellules, silhouette, plaque) → garder une définition confortable (≤ ~768 px) puis `optimize=True`. Cible : ≤ ~90 Ko/asset.
5. **Dépôt** dans `public/illustrations/diabete/<id>.png` (committé). Les sources restent dans Downloads.

⚠ La silhouette du corps (fond décoratif) n'a PAS besoin d'être transparente (c'est un fond) — juste optimisée à 512 px. Ce sont les **overlays** (plaque, organes, cellules, clés, jetons) qui doivent être transparents.

## 3. Décisions par module

| Module | Principe retenu | Assets illustration | Codé / lucide |
| --- | --- | --- | --- |
| **M1 Mécanisme** | Animation CSS par états, **4 modes** (sain / insulinopénie / insulinorésistance / mixte), contrôle **par cellule** | cellule fermée·ouverte·rouillée, clé, jeton, pancréas (en forme) | courbe éventuelle |
| **M4 Risque CV** | Silhouette `bodyImage` + **plaque en overlay** sur territoire (cou/cœur/jambes) ; onglet « L'artère » = **artère saine (image) + plaque codée qui grossit** (saine→encrassée→bouchée) | silhouette vasculaire, plaque, artère saine | **5 feux → lucide** |
| **M5 Complications** | Silhouette `bodyImage` + **hotspots organes** (halo, sans cercle) → panneau détail illustré | silhouette, œil, rein, nerf, planche pied | cœur/cerveau verrouillés |
| **M6 Suivi (cadran)** | Icônes de stations/organes 34-44 px | — | **tout → lucide** (voir §4) ; centre + cadran codés |
| **M7 Traitements** | **Même silhouette** `bodyImage` + halo sur zone protégée | silhouette (partagée) | ordonnance = formulaire live ; pictos/pastilles = lucide ; halo = overlay CSS |
| **M2 Alimentation** | Vignettes d'aliments dans slots `aliment-*` | ~28 vignettes (transparentes) | garde-manger/assiette = layout CSS |
| **M3 Activité** | Vignettes d'activités dans slots `activite-*` | vignettes gestes (+ jouer-enfants, chien) | motif/rayons = images OU lucide (à trancher) ; marqueur = `.muscleDot` CSS ; curseur = codé |
| **M8 Hypoglycémie** | Vignettes signes (100 px) + resucrages (44 px) dans slots | à générer | — |
| **M9 Insuline** | — | — | tout codé (courbes, matériel) |

## 4. Correspondances lucide (M4 + M6)

- **M4 feux** : sucre → `Droplet`, tension → `Gauge`, cholestérol → `Droplets` (ou goutte), tabac → `Cigarette`, sédentarité → `Armchair`.
- **M6 cadran** : consultation → `Stethoscope`, prise de sang → `TestTube`, yeux → `Eye`, défenses → `ShieldPlus`, vaccins → `Syringe`, HbA1c/vaisseaux → `Droplet`/`Activity`.
- ⚠ **lucide n'a pas d'icône rein ni dent.** Deux options à trancher en S6 : (a) réutiliser les illustrations **rein** et une **dent** dédiée en petit format (exception au « tout lucide »), ou (b) un pictogramme lucide de substitution (`Bean` pour le rein, `Smile`/`Sparkles` pour le dentiste). Recommandation : (a) pour le rein (on a déjà l'asset), à voir pour la dent.

## 5. Changements de code structurants

- **`src/components/SilhouetteCorps.tsx`** (générique, thème-agnostique) :
  - Nouvelle prop `bodyImage?: string`. Si fournie → rendre `<img src={bodyImage}>` en fond (aria-hidden) au lieu du corps SVG codé ; conteneur en `aspect-ratio: 1/1` (le PNG est carré, alors que le corps codé est 340×760).
  - Pastilles : nouveau mode **hotspot** (fond transparent, halo radial doux au survol/focus/actif, **aucun cercle permanent**). Garder le mode pastille actuel pour le tabac (rétro-compat).
  - Rétro-compat stricte : sans `bodyImage`, comportement inchangé (tabac).
- **`src/features/diabete/components/Silhouette.tsx`** : passe `bodyImage` (silhouette vasculaire) + **ancres recalibrées** sur l'image carrée (voir §7).
- Les modules consommateurs (M4/M5/M7) posent leurs overlays (plaque, halo) via `children` positionnés avec les ancres.

## 6. Prototypes de référence (validés visuellement, dans le scratchpad)

Ce sont des bancs jetables mais ils **font foi** pour le comportement/rendu attendu (rendus par capture headless Chrome, validés par Thibault) :

- `proto-m5-complications.html` — silhouette + hotspots organes + panneau illustré. **Validé.**
- `proto-m4-risque.html` — silhouette + plaque sur cou/cœur/jambes + texte. **Validé** (plaque à 26 px, `mix-blend-mode: multiply` ou transparence).
- `proto-m1-anim2.html` — **animation 4 modes**, contrôle par cellule, artère centrée sous les cellules, jetons gros, libellé sang tricolore. **Validé.**
- `anchor-over-png.html` — preuve « hotspots sans cercle sur PNG ». `diag-anchors.html` — grille de calage des ancres.
- Assets transparents de référence : `*-t.png` (cell-closed/open/rusty, key, sugar, plaque, pancreas-ok, silhouette).

## 7. Ancres silhouette (en % de l'image carrée, calées au diagnostic)

| Zone | x/y % | Usage |
| --- | --- | --- |
| cerveau | 50 / 7 | M5 (verrouillé), M4 (via cou) |
| yeux | 50 / 10 | M5 |
| cou | 50 / 16 | M4 (carotide) |
| cœur | 49 / 26 | M4 (coronaire), M5 (verrouillé), M7 |
| reins | 50 / 39 | M5, M7 |
| nerfs | 31 / 54 | M5 (**sur la main** — validé Thibault) |
| jambes | 46 / 63 | M4 (fémorale) |
| pied | 50 / 94 | M5 |

Plaque M4 par territoire : cou 50/17 (rot 90°), cœur 49/26 (rot 0°), jambes 46/63 (rot 90°), taille ~26 px.

## 8. Inventaire des assets

**Prêts (générés, déposés dans `public/illustrations/diabete/`, S1-S7)** : silhouette vasculaire ·
plaque · **artère saine** (encrassée/bouchée en réserve) · cellule fermée/ouverte/rouillée · clé ·
jeton · pancréas · œil · rein · nerf · planche pied auto-examen · **M2 : 33 vignettes aliments**
(toutes, y compris les 5 nouvelles pâtes-blanches/pâtes-complètes/couscous-complet/
banane-plantain/haricots-rouges) · **M3 : centre + 4 rayons + 13 activités** (12 initiales +
`sol`) · **M8 : 7 signes + 4 resucrages** · les stations M6 (générées mais → lucide, donc **non
utilisées**, cf. §4).

**Nouvelles données ajoutées en S7** (`// à revalider (Thibault)`, ordres de grandeur Ciqual/GI-GL) :
`alimentation/data.ts` — `pates-blanches`, `pates-completes`, `couscous-complet`,
`banane-plantain`, `haricots-rouges` (famille féculents) ; `activite/data.ts` — `sol` (« Se
relever du sol », 5 min, légère, bon pour les muscles).

**À générer encore** : rien d'identifié à ce stade — le lot M2/M3/M8 listé au lancement du
chantier est complet. S7 reste une session **récurrente** : à rouvrir dès qu'un nouveau slot de
donnée est ajouté (nouvel aliment, nouvelle activité, nouveau signe/resucrage) et nécessite sa
vignette.

**Abandonnés (réserve, non utilisés)** : signature évitable, fil rouge, marqueur muscles (composants codés) ; **artère encrassée/bouchée** (remplacées par la plaque codée croissante en S3) ; feux M4 + stations M6 (→ lucide, sauf rein cf. §4) ; miroir, pied nu, bonne chaussure, monofilament (sauf si on rouvre la fiche pied) ; ordonnance/pictos/pastilles/halo M7 ; matériel M9.

## 9. Sessions

| Session | Contenu | Dépend de | Statut |
| --- | --- | --- | --- |
| **S1** | Pipeline d'assets (`build_assets.py`) + **silhouette partagée** (`bodyImage` + hotspots) + dépôt des assets silhouette/organes | — | [x] fait 2026-07-10 |
| **S2** | **M5 Complications** : hotspots organes + panneaux illustrés (œil/rein/nerf/pied) | S1 | [x] fait 2026-07-10 |
| **S3** | **M4 Risque CV** : plaque en overlay sur territoires + onglet « L'artère » (3 états) + **feux → lucide** | S1 | [x] fait 2026-07-10 |
| **S4** | **M1 Mécanisme** : animation 4 modes (composant dédié) à partir de `proto-m1-anim2.html` | pipeline (cellules) | [x] fait 2026-07-10 |
| **S5** | **M7 Traitements** : silhouette `bodyImage` + halo zones protégées | S1 | [x] vérifié 2026-07-10 (aucun code à changer, déjà satisfait par S1) |
| **S6** | **M6 Suivi** : stations/organes → lucide (trancher rein/dent) | — | [x] fait 2026-07-10 |
| **S7** | Vignettes de slots **M2/M3/M8** au fil des générations (même pipeline) | pipeline | [x] lot complet livré 2026-07-10 (session récurrente, à rouvrir au besoin) |

Chaque session : build + typecheck + tests verts ; checklist visuelle dans `VALIDATION.md` ; `/fin-de-tache`. Voir les fichiers `S<n>.md`.

## 10. Garde-fous

- Invariants projet : aucune dépendance runtime ajoutée (Pillow/numpy = outillage local) ; zéro persistance ; le moteur générique (`src/components/`) ne connaît aucun thème → `bodyImage` reste une prop neutre.
- Rétro-compatibilité tabac : `SilhouetteCorps` sans `bodyImage` = comportement actuel intact.
- Validation visuelle : Thibault a **exceptionnellement** autorisé la capture headless Chrome pendant le prototypage ; pour l'app, revenir à la règle habituelle (build+typecheck+tests, visuel consigné dans `VALIDATION.md`) sauf autorisation explicite.
- Valeurs nutritionnelles / libellés cliniques : `à revalider (Thibault)`, ne pas inventer.
