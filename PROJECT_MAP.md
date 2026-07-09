# PROJECT_MAP.md

Carte synthétique du projet. Permet à ChatGPT et Claude Code de localiser vite les zones pertinentes.

> État : **lot `PLAN_modules-tabac.md` (T1-T11) terminé le 2026-06-28** — scaffolding + les 6 modules du thème tabac sont implémentés et naviguables. **`plans/PLAN_corrections-v2.md` (R1-R9) terminé le 2026-07-01** — dont R9 : ajout d'un 7ᵉ module transverse, `motivation/`. **Moteur multi-thèmes introduit le 2026-07-08** : le thème tabac a été déplacé sous `features/tabac/`, un écran de sélection de thème (`ThemeSelector`) a été ajouté, et un thème `diabete` est scaffoldé (sans contenu, en attente de cadrage). **Chantier `plans/extensions-tabac/` (X1-X7) clos le 2026-07-09** (brief `docs/BRIEF_TABAC.md`) : 8ᵉ module `plan-arret/`, 4 fiches imprimables via `FicheOverlay`, portes de fin de module via `ModuleFooterNav`, fil rouge du thème, composant `InfoHover` (créé, non câblé). Cette carte décrit l'arborescence réelle.

---

## Vue d'ensemble

- Type : application web statique (Vite + React + TS), local-first, sans backend ni base.
- Grandes zones : un **écran de sélection de thème** (`ThemeSelector`, affiché seulement si ≥ 2 thèmes) → une **carte de modules** par thème (`Home.tsx`) → des **modules ETP** indépendants (`src/features/<theme>/<slug>/`) → une **coquille de module** générique (`ModuleShell`) rendue par `App.tsx`.
- Navigation par état dans `App.tsx` (pas de router) : `view: {type:'themes'} | {type:'home', themeId} | {type:'module', themeId, moduleId}`.
- Flux principal : le soignant ouvre l'app → (si plusieurs thèmes) choisit un thème → carte des modules du thème → clique un module → l'illustre avec le patient → revient à la carte. Aucune donnée n'est enregistrée.
- Contrainte structurante : multi-thèmes par conception. Le moteur (`src/features/types.ts`, `src/features/registry.ts`, tout `src/components/`) ne connaît **aucun thème par son nom** — `ModuleId`/`FamilleId` sont des `string` génériques, `hue` vit dans `ModuleDef`, les familles et l'eyebrow vivent dans `ThemeDef`. Chaque thème (`tabac`, `diabete`) est un dossier isolé sous `src/features/<theme>/` avec son propre `registry.ts`. Zéro persistance.

---

## Arborescence réelle

```text
src/
  main.tsx                 # entrée, import des styles globaux
  App.tsx                  # navigation par état (themes <-> home <-> module), rend ThemeSelector/Home/ModuleShell
  styles/
    tokens.css              # variables CSS (couleurs, espacements, radius, font-size)
    global.css              # reset + import des tokens
  components/               # UI partagée, générique (pas de contenu tabac/diabète)
    ThemeSelector.tsx / .module.css # accueil global : grille de cartes thème (masqué si un seul thème)
    Home.tsx / .module.css       # accueil d'un thème : grille de ModuleCard par famille + exergue (fil rouge, X6)
    ModuleShell.tsx / .module.css # en-tête (retour + titre + Sources) autour de chaque module
    Sources.tsx / .module.css     # pop-over discret des sources (placeholder si vide)
    ModuleCard.tsx / .module.css  # carte cliquable (icône + titre + résumé)
    FicheOverlay.tsx / .module.css    # fiche à emporter générique (aperçu A4 + impression, X1)
    ModuleFooterNav.tsx / .module.css # porte de fin de module générique « Continuer l'exploration » (X6)
    InfoHover.tsx / .module.css       # 2ᵉ niveau de lecture générique, survol/focus (X6, créé non câblé)
  features/
    types.ts                # ModuleId/FamilleId (string génériques), Hue, ModuleDef, FamilleDef, ThemeDef, exergue?
    registry.ts              # THEMES: ThemeDef[] — registre des thèmes (tabac + diabete)
    tabac/
      registry.ts            # MODULES: ModuleDef[] — les 8 modules tabac, titres/résumés/icônes/hue
      addiction/AddictionModule.tsx              # Module 1 — composantes de l'addiction (T8, C6 : 3 cercles qui se chevauchent)
      nicotine/NicotineModule.tsx                # Module 2 — nicotine, frise 24 h cliquable (S4, X6 : ModuleFooterNav)
      substituts/SubstitutsModule.tsx            # Module 3 — substituts & titration (T9, X3 : fiche, X6 : ModuleFooterNav)
      nicotine-toxique/NicotineToxiqueModule.tsx # Module 4 — nicotine ≠ toxique (T10, X6 : migré sur ModuleFooterNav)
      soulagement/SoulagementModule.tsx          # Module 5 — le piège du soulagement (S7, X6 : ModuleFooterNav)
      craving/CravingModule.tsx                  # Module 6 — gérer le craving / 4D (T11, X2 : fiche, X6 : ModuleFooterNav)
      motivation/MotivationModule.tsx            # Module 7 — explorer ma motivation (S9 cadran Dial, X4 : fiche, X6)
      plan-arret/PlanArretModule.tsx             # Module 8 — mon plan d'arrêt (X5, ajouté 2026-07-09, famille agir)
      lib/
        nicotineCurve.ts + .test.ts  # logique pure tabac : sampleCurve/toSvgPath/sampleStress, partagée Modules 2 & 5
    diabete/
      registry.ts             # MODULES: ModuleDef[] — 9 modules diabète, titres/résumés/icônes/hue/sources (S1)
      components/
        IllustrationSlot.tsx / .module.css   # composant placeholder pour illustrations (S1)
        Silhouette.tsx / .module.css         # corps humain SVG avec zones nommées + états (S3)
        CourbeGlycemie.tsx / .module.css     # rendu unique de courbe glycémie avec marqueurs (S3)
        PlaqueArtere.tsx / .module.css       # motif plaque d'athérome, variantes artère/pastille (S3)
        SignatureEvitable.tsx / .module.css  # badge « Évitable et dépistable » récurrent (S3)
      lib/
        glycemieCurve.ts / .test.ts  # logique pure diabète : paramsFromAssiette/sampleRepas/sampleActivite/sampleRecuperation/sampleJournee/tempsDansCible (S2, 50 tests)
      mecanisme/MecanismeModule.tsx / .module.css  # Module 1 — C'est quoi le diabète (clé/serrure, 4 temps, S4)
      alimentation/AlimentationModule.tsx / .module.css / data.ts  # Module 2 — Alimentation (garde-manger, 4 défis + synthèse, fiche, S5)
      activite/ActiviteModule.tsx / .module.css / data.ts         # Module 3 — Activité physique (rayonnement, jauge, timing, S6)
      risque-cardio/RisqueCardioModule.tsx / .module.css          # Module 4 — Risque cardiovasculaire (5 feux, artère, anatomie, fiche, S7)
      complications/ComplicationsModule.tsx / .module.css / data.ts  # Module 5 — Complications (silhouette, « évitable », fiche pied, S8)
      suivi/SuiviModule.tsx / .module.css / logic.ts              # Module 6 — Suivi (cadran année, fiche calendrier, S9)
      traitements/TraitementsModule.tsx / .module.css / data.ts   # Module 7 — Traitements (ordonnance ↔ silhouette, S10)
      hypoglycemie/HypoglycemieModule.tsx / .module.css           # Module 8 — Hypoglycémie (15/15, récupération/overshoot, carte, S11)
      insuline/InsulineModule.tsx / .module.css / scenarios.ts    # Module 9 — Insuline (traces capteur, TIR vivant, S12)
docs/
  architecture.md
  BRIEF_TABAC.md               # brief design & pédagogie tabac (Fable, 2026-07-09) — §2 fiches rétroactives des 7
                                # modules existants, §3 spécification normative des extensions X1-X7
  contenu-modules-tabac.md    # autorité du contenu médical, thème tabac (fichier unique)
  diabete/                    # autorité du contenu médical, thème diabète (cadrage en cours)
    00-global.md               # grammaire commune, vue d'ensemble des 8 modules, journal des décisions
    module-1-cest-quoi-le-diabete.md
    module-2-alimentation.md
    module-3-activite-physique.md
    module-4-risque-cardiovasculaire.md
    modules-5-8-cadrage.md    # modules 5-8, cadrés mais pas encore détaillés écran par écran
  evidence-diabete/           # rapports de synthèse OpenEvidence (sources probantes brutes, thème diabète)
plans/
  extensions-tabac/           # X1-X7 : socle fiches, 3 fiches modules, module « Mon plan d'arrêt » + sa fiche,
                               # portes de fin de module + fil rouge + InfoHover, resync docs — chantier clos 2026-07-09
PLAN_modules-tabac.md         # plan d'exécution T1-T11 (clos)
STATUS.md / VALIDATION.md / PROJECT_MAP.md
```

---

## Features principales

### Feature 1 — Sélection de thème + carte / menu central
Rôle : choisir un thème (si plusieurs existent) puis présenter les modules de ce thème, navigation libre non-linéaire.
Fichiers clés : `src/components/ThemeSelector.tsx`, `src/components/Home.tsx`, `src/components/ModuleCard.tsx`, `src/App.tsx`.
Points de vigilance : doit rester lisible à distance, gros éléments cliquables ; `ThemeSelector` ne s'affiche que si `THEMES.length > 1`.

### Feature 2 — Coquille de module générique
Rôle : `App.tsx` rend `ModuleShell` (titre + retour + `Sources`) autour du module sélectionné ; les modules ne rendent QUE leur contenu interactif et reçoivent `onNavigate`.
Fichiers clés : `src/components/ModuleShell.tsx`, `src/components/Sources.tsx`, `src/features/types.ts`.
Points de vigilance : généricité = clé de la réutilisation multi-thèmes ; aucun module ne duplique son propre en-tête.

### Feature 3 — Modules du thème tabac
Rôle : le contenu interactif des 8 modules (addiction, nicotine, substituts, nicotine-toxique, soulagement, craving, motivation, plan-arret).
Fichiers clés : `src/features/tabac/<slug>/`, contenu source dans `docs/contenu-modules-tabac.md` (mécaniques) et `docs/BRIEF_TABAC.md` (design/pédagogie + extensions X1-X7).
Points de vigilance : exactitude médicale, sources affichables (via `registry.ts` → `sources?: string[]`), sobriété visuelle, aucun dosage chiffré pour les substituts.

### Feature 3bis — Fiches à emporter, portes de fin de module, fil rouge (extensions X1-X7)
Rôle : `FicheOverlay` compose et imprime à la volée une feuille A4 (4 fiches : anti-envie, méthode
patch, mes raisons, mon plan d'arrêt), zéro persistance ; `ModuleFooterNav` câble des portes optionnelles
en pied de 6 modules ; le fil rouge du thème (`ThemeDef.exergue`) s'affiche en exergue d'accueil et en
clôture des 4 modules « Comprendre » ; `InfoHover` généralise le tooltip de zone pour un 2ᵉ niveau de
lecture, créé mais non câblé tant qu'aucun contenu n'est validé par Thibault.
Fichiers clés : `src/components/FicheOverlay.tsx`, `src/components/ModuleFooterNav.tsx`,
`src/components/InfoHover.tsx`, `src/features/tabac/plan-arret/PlanArretModule.tsx`, `docs/BRIEF_TABAC.md`.
Points de vigilance : composants génériques, agnostiques du thème (aucun contenu en dur) ; les portes ne
sont jamais un enchaînement forcé ; ne pas câbler `InfoHover` sans validation Thibault (§5 du brief).

### Feature 4 — Thème diabète (scaffold, cadrage en cours)
Rôle : place réservée pour le 2e thème. `src/features/diabete/registry.ts` exporte `MODULES: []` ; le thème apparaît dans `ThemeSelector` avec un badge « Bientôt disponible » (non cliquable). Le cadrage clinique (4 modules sur 8 déjà spécifiés en détail) avance dans `docs/diabete/`, avant tout câblage.
Fichiers clés : `src/features/diabete/registry.ts`, `docs/diabete/00-global.md` (index + grammaire commune), `docs/diabete/module-*.md`, `docs/evidence-diabete/` (sources probantes brutes).
Points de vigilance : ne pas ajouter de module au registre avant le cadrage clinique complet avec Thibault (cf. `docs/diabete/00-global.md`, table de statut par module).

---

## Fichiers transversaux importants
- Configuration : `vite.config.ts`, `tsconfig*.json`, `package.json` (scripts `dev`/`build`/`test`)
- Navigation : état local dans `src/App.tsx` (pas de router)
- État global : minimal, **éphémère uniquement** (pas de persistance ; pas de localStorage)
- API / persistance : **aucune** (décision structurante)
- UI partagée : `src/components/`
- Logique pure testée : `src/features/tabac/lib/nicotineCurve.ts` (Vitest) — spécifique au thème tabac, pas un utilitaire du moteur générique

---

## Zones à risque ou coûteuses en contexte IA
- Le moteur de module générique (impacte tous les modules et tous les thèmes) — à concevoir proprement une fois.

---

## Règles locales importantes
- **Jamais de persistance de données** (ni localStorage, ni cookies, ni envoi réseau).
- Contenu médical **sourcé** (HAS, Tabac Info Service et équivalents) et affichable dans le module.
- Garder l'interactivité (≠ diaporama) et la sobriété visuelle.
- Préserver la généricité multi-thèmes (ne pas coder « en dur » pour un thème dans le moteur : `src/components/`, `src/features/types.ts`, `src/features/registry.ts`).

---

## Comment choisir les fichiers à fournir à ChatGPT
- Produit / architecture : `PROJECT_BRIEF.md`, `STATUS.md`, `ROADMAP.md`, `PROJECT_MAP.md`
- Contenu d'un module : `docs/contenu-modules-<theme>.md` + le dossier `features/<theme>/<module>/`
- Bug : `STATUS.md`, `PROJECT_MAP.md`, logs, fichiers concernés
