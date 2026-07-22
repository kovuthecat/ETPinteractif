# Plan theme-cardio-2026-07 — Nouveau thème « Prévention cardiovasculaire » (12 modules)   (rédigé par Opus)

## Objectif d'ensemble

Câbler dans l'outil ETP un **3ᵉ thème `cardio`** (prévention **primaire** cardiovasculaire),
à partir de la maquette Claude Design (`design/Mosule cardio ETP interactif-handoff.zip`, prototype
`ETP Cardio - Prototype.dc.html`) et de l'autorité clinique (`docs/cardio/BRIEF_DESIGN_cardio.md`
+ `docs/cardio/evidence-cardio/`). 12 modules répartis en 3 familles (**Comprendre** 1-3 · **Agir**
4-9 · **Se soigner** 10-12), rendus dans le bundle **consultation uniquement** (comme diabète).

Le thème **réutilise la grammaire existante** (4 des 5 objets-héros viennent du diabète : artère/plaque,
silhouette, feux, cadran) ; **un seul objet neuf** : la carte-réflexe **VITE** (module 10). L'enjeu
n'est pas d'inventer, c'est d'**instancier proprement le moteur multi-thèmes** sans casser tabac/diabète.

Traçabilité : ids `C<n>` (Cardio). Source : maquette handoff 2026-07-22 + brief design + rapports
OpenEvidence socle/complément (2026-07-21).

## Périmètre & hypothèses

- **Bundle consultation uniquement.** Prévention primaire, pilotée soignant, **zéro persistance**
  (invariant #1) — aucune donnée patient stockée, fiches générées à la volée. Aucun fichier cardio sous
  `src/patient/` (le bundle patient reste tabac-only). `// à confirmer (Thibault)` si un jour cardio y passe.
- **Prévention PRIMAIRE.** Adultes à risque CV, **non spécifiquement diabétiques**. Le diabète est *un
  facteur parmi d'autres* (« robinet sucre » du M2 → renvoi thème diabète). Prévention **secondaire**
  (post-infarctus/AVC : réadaptation, DAPT, LDL très bas) = **hors v1**.
- **Aucun chiffre médical à l'écran** (invariant transverse tabac/diabète). Seuils/cibles/durées = **paliers
  qualitatifs** ; les valeurs sourcées ne servent qu'au calibrage et au **2ᵉ niveau au survol** (`InfoHover`).
  **Jamais de score de risque calculé affiché** (le M2 allume les feux « pour voir », pas un bulletin).
- **Aucune dépendance runtime ajoutée** (invariant #3). Vite + React + TS. DevDependencies de test OK si
  listées (ici : aucune nouvelle — `risqueCardio.test.ts` sur Vitest déjà présent).
- **Généricité multi-thèmes préservée** (invariant #4). Le moteur (`src/components/`, `src/features/types.ts`,
  `src/features/registry.ts`) ne connaît aucun thème par son nom : cardio n'ajoute **qu'une entrée** dans
  `THEMES` + un dossier `src/features/cardio/` isolé. Voir la carte d'architecture en §Références.
- **Le design est fixé.** On câble sur la maquette, on ne redessine pas en codant.

## Décisions structurantes (à consigner dans `DECISIONS.md` à la consolidation)

**D1 — Réutiliser le générique, posséder le spécifique** (précédent : « duplication assumée par thème »,
`DECISIONS.md` §IllustrationSlot). Recommandation :
- **Réutilisés tels quels** (aucune copie) : `ModuleShell`, `Sources`, `Home`/`ModuleCard`, `ThemeSelector`,
  `FicheOverlay` (+`QRBlock`), **`SilhouetteCorps`** (moteur générique), `InfoHover`.
- **Possédés par cardio** (`src/features/cardio/components/`) :
  - **`ArtereCoupe.tsx`** — l'artère **réversible** riche (dépôt, 2 parois, **fissure / caillot / renforcée**,
    cumul). ⚠️ **Ne PAS** réutiliser `diabete/components/PlaqueArtere.tsx` : il ne dessine que le dépôt
    (`encrassement` 0→1), sans réversibilité ni rupture. Le prototype fournit la géométrie complète
    (`plaqueGeom`, lignes 611-628) — à porter dans la lib (D3), le composant l'affiche.
  - **`CockpitFeux.tsx`** — tableau de feux + **cumul multiplicatif**. Il n'existe **aucun composant feux
    partagé** (le pattern vit inline dans `diabete/risque-cardio/RisqueCardioModule.tsx`) : on le
    ré-instancie ici, enrichi du cumul multiplicatif, en **tokens** (jamais oklch brut, cf. D6).
  - **`Silhouette.tsx`** — wrapper mince sur `SilhouetteCorps` (zones cœur/cerveau/jambes/reins, `bodyImage`
    cardio), sur le modèle de `diabete/components/Silhouette.tsx`.
  - **`IllustrationSlot.tsx`** — copie de la version diabète, chemin `illustrations/cardio/` (le fallback
    placeholder natif couvre les assets non encore générés → aucune régression).
- Gate **G-composants** : Thibault peut préférer *généraliser* `ArtereCoupe`/`CockpitFeux` dans
  `src/components/` plus tard. On code d'abord cardio-owned (dé-couplé), promotion différable.

**D2 — Logique pure testée : `src/features/cardio/lib/risqueCardio.ts` (+ `.test.ts`).** Miroir de
`diabete/lib/glycemieCurve.ts` et `tabac/lib/nicotineCurve.ts`. Porte, quasi verbatim du prototype :
`plaqueGeom(e, opts)` (lignes 611-628), le cumul **multiplicatif** `FEU_MULT`/`score` (lignes 603-608,
724-734) et les transitions d'état (`NEXT_ETAT`). C'est le **cœur pédagogique** (« multiplication ≠
addition ») ⇒ il mérite des invariants testés (ex. « 2 rouges encrassent plus vite que la somme »).

**D3 — Assets : `public/illustrations/cardio/`.** Réutilisés (copiés depuis `diabete/`) : `artere-saine.png`,
`silhouette.png`, `activite-*.png` (13), `aliment-*.png` (~26). Le handoff les embarque déjà. **Nouveaux à
générer** (prompts → pipeline Pillow, précédent `design/illustrations/`) : pictos **VITE** (4), signes
**infarctus** (3), artère/poumon **tabac** 2 états (M6), **brassard** automesure (M4). Non bloquants
(placeholder natif).

**D4 — Module 12 : « Mes 3 chiffres » (grille de suivi léger), pas le cadran dense.** Le brief §2-M12
recommande l'alternative allégée (prévention primaire = réévaluation 3-5 ans, un cadran annuel paraîtrait
vide) ; le prototype l'a **déjà** implémentée en grille de 6 voyants cyclables (`fait`/`à programmer`/
`espacé`), **jamais de rouge**. On suit le prototype. ✅ **G-M12 tranché (2026-07-22)** : « Mes 3 chiffres ».

**D5 — Portes inter-thèmes (M6→tabac, M2→diabète) : repli d'abord, capacité moteur ensuite (gate).** La nav
actuelle est **strictement intra-thème** (`onNavigate` réutilise le `themeId` courant ; seul chemin
inter-thèmes = revenir au `ThemeSelector`). Donc :
- **v1 (dans les modules M2/M6)** : renvoi visuel inline « → Voir le thème Tabac / Diabète » qui **ramène au
  `ThemeSelector`** (repli, comme le prototype M6 qui appelle `goHome`).
- ✅ **G-porte tranché (2026-07-22) : repli en v1.** L'extension **générique** du moteur (`App.tsx` : nav
  inter-thèmes agnostique, ex. `onNavigate` acceptant `{themeId, moduleId}`) est **hors v1** (ex-S15) — trop
  sensible pour le gain (touche le moteur partagé tabac+diabète) ; réactivable plus tard.

**D6 — Palette : tokens globaux, jamais oklch brut.** Le prototype code des `oklch(...)` en dur ; le portage
utilise les variables de `src/styles/tokens.css` (`--color-confort/vigilance/toxique/nav`, `--color-bg`,
`--color-ink`, `--color-line`). Les oklch du prototype **correspondent déjà** aux tokens
(vert=`confort`, ambre=`vigilance`, rouge=`toxique`, bleu=`nav`) ⇒ correspondance directe, harmonisation
stricte avec tabac/diabète.

**D7 — `rendersOwnShell: true` pour les 12 modules** (convention diabète). Plusieurs modules injectent une
**barre d'onglets** dans le slot `nav` du `ModuleShell` : M7 (Volume/Régularité), M8 (Familles/Assiette),
M9 (Alcool/Sommeil/Stress), M10 (VITE/Infarctus).

**D8 — Contenu clinique sourcé AVANT code (invariant #5, gate G1).** Vague 0 : distiller
`evidence-cardio/` (socle+complément) + le brief en un doc **`docs/cardio/CONTENU_cardio.md`** (message écran,
2ᵉ niveau, pièges, par module), **validé par Thibault (soignant)** avant toute implémentation de module.
Les modules ne réécrivent jamais le contenu : ils lisent ce doc.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | C1 | Contenu clinique — `CONTENU_cardio.md` (12 modules, gate G1) | Opus | high | evidence-cardio | `docs/cardio/CONTENU_cardio.md` (créé) | [x] fait 2026-07-22 · **G1 à valider** |
| [S2](S2.md) | C2, C3, C4 | Socle : thème + registre + lib `risqueCardio` + composants cardio | Sonnet | high | — | `features/registry.ts`, `features/cardio/**` (registry, lib, components) | [x] fait 2026-07-22 (gates verts) |
| [S3](S3.md) | C5, C6 | Assets : copie PNG réutilisés + prompts nouveaux assets | Haiku | low | — | `public/illustrations/cardio/**`, `design/illustrations/` | [x] fait 2026-07-22 |
| [S4](S4.md) | C7 | **Pilote** M1 — L'artère qui s'encrasse (moule de référence) | Sonnet | high | S1/G1, S2 | `features/cardio/artere/**` | [x] fait 2026-07-22 · **G-moule à valider** |
| [S5](S5.md) | C8 | **Pilote** M2 — Mon risque global (cockpit + cumul + fiche + robinet) | Sonnet | high | S1/G1, S2 | `features/cardio/risque/**` | [x] fait 2026-07-22 · **G-moule à valider** |
| [S6](S6.md) | C9 | **Pilote** M3 — Où l'accident frappe (silhouette + zones) | Sonnet | medium | S1/G1, S2 | `features/cardio/territoires/**` | [x] fait 2026-07-22 · **G-moule à valider** |
| [S7](S7.md) | C10 | M4 — La tension (artère sous pression + règle des 3 + fiche) | Sonnet | high | pilote OK | `features/cardio/tension/**` | [x] fait 2026-07-22 |
| [S8](S8.md) | C11, C12 | M5 Cholestérol (slider LDL) + M6 Tabac (frise + repli porte) | Sonnet | medium | pilote OK | `features/cardio/cholesterol/**`, `features/cardio/tabac/**` | [x] fait 2026-07-22 |
| [S9](S9.md) | C13 | M7 — Bouger (2 onglets : grille activités + calendrier) | Sonnet | high | pilote OK | `features/cardio/bouger/**` | [x] fait 2026-07-22 (refait après stall infra) |
| [S10](S10.md) | C14 | M8 — Manger (2 onglets : familles + assiette + fiche) | Sonnet | high | pilote OK | `features/cardio/manger/**` | [x] fait 2026-07-22 (refait après stall infra) |
| [S11](S11.md) | C15 | M9 — Autres leviers (alcool / sommeil / stress) | Sonnet | medium | pilote OK | `features/cardio/leviers/**` | [x] fait 2026-07-22 |
| [S12](S12.md) | C16 | M10 — Reconnaître l'alerte (**carte VITE neuve** + fiche) | Sonnet | high | pilote OK | `features/cardio/alerte/**` | [x] fait 2026-07-22 |
| [S13](S13.md) | C17 | M11 — Mes traitements (ordonnance ↔ silhouette protégée) | Sonnet | high | pilote OK | `features/cardio/traitements/**` | [x] fait 2026-07-22 |
| [S14](S14.md) | C18 | M12 — Mon suivi (« mes 3 chiffres », grille voyants + fiche) | Sonnet | medium | pilote OK | `features/cardio/suivi/**` | [x] fait 2026-07-22 (CSS complété par l'orchestrateur après stall) |
| ~~S15~~ | ~~C19~~ | ~~Porte inter-thèmes générique~~ — **hors v1** (G-porte tranché : repli, cf. §Gates) ; le renvoi vers le `ThemeSelector` est câblé dans M2/M6 (S5/S8) | — | — | — | — | (hors v1) |
| S16 | — | Consolidation (commits par tâche, statuts, contexte, push) | Haiku | minimal | toutes | `STATUS/TASKS/DECISIONS/PROJECT_MAP/VALIDATION/index` | [ ] |

> Les fichiers `S5.md`–`S16.md` se rédigent **à partir du moule S4** (même squelette : lire `CONTENU_cardio.md`
> + la section du prototype + les composants du socle → porter l'interaction → câbler fiche/renvoi → gates
> `tsc`/`build`/`test`). Ils sont **cadrés ici** (colonnes ci-dessus + §Spécification par module) et
> **développés une fois le pilote validé** (gate G-moule) et **G1** franchie — inutile d'écrire 12 fichiers
> de détail avant que le moule ne soit confirmé à l'écran.

## Ordonnancement

- **Vague 0 — contenu (gate G1, solo)** : **S1**. Verrou dur : aucune implémentation de module avant la
  validation clinique de `CONTENU_cardio.md` par Thibault. Débloque S4-S14.
- **Vague 1 — socle (parallélisable, indépendant du contenu)** : **S2 · S3** (zones disjointes : S2 =
  `features/`, S3 = `public/` + `design/`). Démarrent immédiatement, sans attendre G1. Bloque les modules.
- **Vague 2 — PILOTE (gate visuelle G-moule)** : **S4 (M1) · S5 (M2) · S6 (M3)** — valident les **3 objets-héros
  réutilisés partout** (artère/lib, feux/cumul, silhouette). Sérialisés ou parallèles (dossiers disjoints,
  mais tous consomment le socle S2). **Arrêt et validation visuelle Thibault** avant la Vague 3 : c'est ici
  qu'on corrige le moule, pas après 12 modules.
- **Vague 3 — Agir (parallèle)** : **S7 · S8 · S9 · S10 · S11** (dossiers module disjoints). Après G-moule.
- **Vague 4 — Se soigner (parallèle)** : **S12 · S13 · S14**. Après G-moule.
- **Vague 5 — porte inter-thèmes : hors v1** (G-porte tranché → repli). Le renvoi visuel vers le
  `ThemeSelector` est câblé directement dans M2/M6 (S5/S8) ; l'extension moteur (ex-S15) est réactivable
  plus tard si Thibault le souhaite.
- **Vague 6 — consolidation** : **S16** (§4d WORKFLOW : commits tâche par tâche, staging explicite, statuts
  `index.md`/`TASKS.md`, `STATUS.md`/`VALIDATION.md`/`PROJECT_MAP.md`, entrées `DECISIONS.md`, **un seul push**).

## Spécification par module (résumé pour rédiger S5-S14 depuis le moule S4)

Objets/interactions à porter du prototype (`ETP Cardio - Prototype.dc.html`) — le n° de section HTML est
indiqué. Chaque module : `rendersOwnShell: true`, tokens (D6), pas de chiffre à l'écran, 2ᵉ niveau via
`InfoHover` si le contenu (S1) le fournit.

- **M1 `artere`** (proto §MODULE 1, lignes 57-71 + `Module 1 - Artere.dc.html`) : séquence 4 temps
  saine→encrassement→rupture→espoir, `ArtereCoupe` + frise du temps ; narré (pas de manip). **Fiche : aucune.**
  Renvoi inline **1→2**.
- **M2 `risque`** (§MODULE 2, 74-98) : `CockpitFeux` (5 feux tabac/tension/cholestérol/sucre/poids) +
  `ArtereCoupe` qui réagit + barre de risque **multiplicative** + cadrage non-modifiables (âge/sexe/hérédité,
  à part) + **robinet sucre → repli porte diabète** (D5). **Fiche photographie** (ses feux + leviers).
- **M3 `territoires`** (§MODULE 3, 101-122) : `Silhouette` (cœur/cerveau/jambes/reins) → texte sobre par zone ;
  cœur/cerveau → **renvoi inline M10**. Contemplatif, choix libre. **Fiche : aucune.**
- **M4 `tension`** (§MODULE 4, 125-162) : `ArtereCoupe` « sous pression » + leviers (chips) + **règle des 3**.
  **Fiche outil** : « Ma règle des 3 » + relevé d'automesure vierge (`FicheOverlay`). Renvois 4→8, 4→(M11).
- **M5 `cholesterol`** (§MODULE 5, 165-179) : slider LDL → `ArtereCoupe` (plus bas + longtemps = régresse).
  Message anti-culpabilisant (hépatique/génétique). **Fiche : aucune.** Renvois 5→8, 5→(M11).
- **M6 `tabac`** (§MODULE 6, 182-198) : bascule Fumeur/A arrêté → frise de réversibilité + **repli porte
  thème Tabac** (D5). Court, motivant, ne duplique pas le thème Tabac. **Fiche : aucune.**
- **M7 `bouger`** (§MODULE 7, 201-281) : onglets **Volume** (grille d'activités `activite-*.png`, +/− minutes,
  jauge **sans plafond**) et **Régularité** (calendrier semaine + barres de protection). Motivant. **Fiche : aucune.**
- **M8 `manger`** (§MODULE 8, 284-375) : onglets **Familles** (amis/à limiter, détail au clic) et **Assiette**
  (garde-manger `aliment-*.png` → assiette conique ½-¼-¼, sel/gras). **Fiche photographie** (l'assiette du patient).
- **M9 `leviers`** (§MODULE 9, 378-442) : onglets **Alcool** (slider verres, courbe en J enterrée) / **Sommeil**
  (barres en U + signes SAOS → orienter) / **Stress** (slider + leviers). **Fiche : aucune.**
- **M10 `alerte`** (§MODULE 10, 445-492) : **objet NEUF** — carte-réflexe **VITE** (4 pictos) + volet infarctus
  (formes **atypiques** femmes/diabétiques/âgés) + bandeau **15**. Panneau signalétique, lisible sous stress.
  **Fiche référence** : carte VITE + 15. ⚠️ **Sécurité aspirine** (pas d'auto-prise par défaut).
- **M11 `traitements`** (§MODULE 11, 495-541) : ordonnance transcrite ligne par ligne (classe/rôle, molécule =
  étiquette) → clic ligne → zones **protégées** s'allument sur `Silhouette` (halo positif). **Verrou
  anti-auto-prescription** (on transcrit/explique, on ne compare pas). **Aspirine** = 2ᵉ niveau seulement.
  **Fiche : aucune.**
- **M12 `suivi`** (§MODULE 12, 544-558) : grille « mes 3 chiffres » (D4), voyants cyclables `fait`/`à
  programmer`/`espacé`, **jamais de rouge**. **Fiche photographie/outil** (check-list frigo).

## Gates / décisions à valider (Thibault)

**Gates de contenu/visuel (ouvertes — validations futures) :**

- **G1 — validation clinique de `CONTENU_cardio.md` (S1).** ⛔ **Verrou dur** de la Vague 2. Le contenu neuf
  (messages écran, 2ᵉ niveau, pièges) est rédigé depuis `evidence-cardio/` et **validé soignant** avant tout code.
- **G-moule — validation visuelle du pilote (M1-M3, Vagues 2).** Thibault valide à l'écran (`npm run dev`)
  l'artère réversible, le cockpit multiplicatif et la silhouette **avant** de câbler les 9 autres modules.

**Gates de conception (tranchées avec Thibault le 2026-07-22) :**

- **G-M12 — Module 12. ✅ TRANCHÉ : « Mes 3 chiffres ».** Grille de voyants légère (tension / LDL / tour de
  taille), états `fait` / `à programmer` / `espacé`, **jamais de rouge**. Pas de cadran annuel dense (D4).
- **G-porte — portes inter-thèmes. ✅ TRANCHÉ : repli visuel en v1.** M2/M6 renvoient au `ThemeSelector`
  (« → Voir le thème Tabac / Diabète »), aucune modif du moteur partagé. **S15 = hors v1** (extension moteur
  non entreprise ; réactivable plus tard si besoin) (D5).
- **G-composants — ArtereCoupe / CockpitFeux. ✅ TRANCHÉ : possédés par cardio.** Vivent dans
  `src/features/cardio/components/`, découplés du diabète ; promotion vers `src/components/` différable (D1).
- **G-VITE / aspirine (M10). ✅ TRANCHÉ : pas d'auto-prise d'aspirine à l'écran.** Au plus « suivez les
  consignes du 15 » (sûreté : aspirine contre-indiquée si AVC hémorragique). Reste dans G1 la relecture
  soignant de la formulation de la carte VITE + signes atypiques.

## Références (lecture d'Opus au cadrage, ne pas recopier dans les sessions)

- Autorité clinique : `docs/cardio/BRIEF_DESIGN_cardio.md` (le *quoi*/à quoi ça ressemble) +
  `docs/cardio/evidence-cardio/2026-07-21-rapport-openevidence-cardio-{socle,complement}.md` (le *pourquoi*).
- Maquette : `design/Mosule cardio ETP interactif-handoff.zip` → `ETP Cardio - Prototype.dc.html` (12 modules,
  logique JS portable) + `Module 1 - Artere.dc.html` (chrome ModuleShell précis du M1).
- Moteur : `src/features/types.ts` (`ModuleDef`/`ThemeDef`/`ModuleProps`), `src/features/registry.ts`
  (`THEMES`), `src/features/diabete/registry.ts` (patron d'un `registry.ts` de thème),
  `src/features/diabete/risque-cardio/RisqueCardioModule.tsx` (patron feux + onglets + fiche + silhouette),
  `src/components/{SilhouetteCorps,FicheOverlay,ModuleShell}.tsx`, `src/features/diabete/components/{PlaqueArtere,Silhouette,IllustrationSlot}.tsx`.

## Clôture (S16)

> À remplir à la consolidation : sessions exécutées, gates auto (`tsc --noEmit` · `npm run build` 2 entrées ·
> `npm test`), points `// à revalider (Thibault)`, commits, push. Validation visuelle humaine → `VALIDATION.md`.
