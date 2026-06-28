# PROJECT_MAP.md

Carte synthétique du projet. Permet à ChatGPT et Claude Code de localiser vite les zones pertinentes.

> État : **lot `PLAN_modules-tabac.md` (T1-T11) terminé le 2026-06-28** — scaffolding + les 6 modules du thème tabac sont implémentés et naviguables. Cette carte décrit l'arborescence réelle.

---

## Vue d'ensemble

- Type : application web statique (Vite + React + TS), local-first, sans backend ni base.
- Grandes zones : une **carte de modules** (accueil, `Home.tsx`) + des **modules ETP** indépendants (`src/features/<slug>/`) + une **coquille de module** générique (`ModuleShell`) rendue par `App.tsx`.
- Navigation par état dans `App.tsx` (pas de router) : `view: 'home' | ModuleId`.
- Flux principal : le soignant ouvre l'app → carte des modules → clique un module → l'illustre avec le patient → revient à la carte. Aucune donnée n'est enregistrée.
- Contrainte structurante : multi-thèmes par conception (le registre `registry.ts` ne contient que les modules du thème tabac pour l'instant, mais le moteur — types, `ModuleShell`, `Sources`, `ModuleCard` — n'a rien de spécifique au tabac) ; zéro persistance.

---

## Arborescence réelle

```text
src/
  main.tsx                 # entrée, import des styles globaux
  App.tsx                  # navigation par état (home <-> module), rend ModuleShell
  styles/
    tokens.css              # variables CSS (couleurs, espacements, radius, font-size)
    global.css              # reset + import des tokens
  components/               # UI partagée, générique (pas de contenu tabac)
    Home.tsx / .module.css       # accueil : grille de ModuleCard
    ModuleShell.tsx / .module.css # en-tête (retour + titre + Sources) autour de chaque module
    Sources.tsx / .module.css     # pop-over discret des sources (placeholder si vide)
    ModuleCard.tsx / .module.css  # carte cliquable (icône + titre + résumé)
  features/
    types.ts                # ModuleId, ModuleProps, ModuleDef
    registry.ts              # MODULES: ModuleDef[] — les 6 modules tabac, titres/résumés/icônes
    addiction/AddictionModule.tsx              # Module 1 — composantes de l'addiction (T8, C6 : 3 cercles qui se chevauchent)
    nicotine/NicotineModule.tsx                # Module 2 — nicotine, bac à sable (T6)
    substituts/SubstitutsModule.tsx            # Module 3 — substituts & titration (T9)
    nicotine-toxique/NicotineToxiqueModule.tsx # Module 4 — nicotine ≠ toxique (T10)
    soulagement/SoulagementModule.tsx          # Module 5 — le piège du soulagement (T7)
    craving/CravingModule.tsx                  # Module 6 — gérer le craving / 4D (T11)
  lib/
    nicotineCurve.ts + .test.ts  # logique pure : sampleCurve/toSvgPath/sampleStress, partagée Modules 2 & 5
docs/
  architecture.md
  contenu-modules.md          # autorité du contenu médical par module
PLAN_modules-tabac.md         # plan d'exécution T1-T11 (clos)
STATUS.md / VALIDATION.md / PROJECT_MAP.md
```

---

## Features principales

### Feature 1 — Carte / menu central
Rôle : présenter les modules d'un thème, navigation libre non-linéaire.
Fichiers clés : `src/components/Home.tsx`, `src/components/ModuleCard.tsx`, `src/App.tsx`.
Points de vigilance : doit rester lisible à distance, gros éléments cliquables.

### Feature 2 — Coquille de module générique
Rôle : `App.tsx` rend `ModuleShell` (titre + retour + `Sources`) autour du module sélectionné ; les modules ne rendent QUE leur contenu interactif et reçoivent `onNavigate`.
Fichiers clés : `src/components/ModuleShell.tsx`, `src/components/Sources.tsx`, `src/features/types.ts`.
Points de vigilance : généricité = clé de la réutilisation multi-thèmes ; aucun module ne duplique son propre en-tête.

### Feature 3 — Modules du thème tabac
Rôle : le contenu interactif des 6 modules (addiction, nicotine, substituts, nicotine-toxique, soulagement, craving).
Fichiers clés : `src/features/<slug>/`, contenu source dans `docs/contenu-modules.md`.
Points de vigilance : exactitude médicale, sources affichables (via `registry.ts` → `sources?: string[]`), sobriété visuelle, aucun dosage chiffré pour les substituts.

---

## Fichiers transversaux importants
- Configuration : `vite.config.ts`, `tsconfig*.json`, `package.json` (scripts `dev`/`build`/`test`)
- Navigation : état local dans `src/App.tsx` (pas de router)
- État global : minimal, **éphémère uniquement** (pas de persistance ; pas de localStorage)
- API / persistance : **aucune** (décision structurante)
- UI partagée : `src/components/`
- Logique pure testée : `src/lib/nicotineCurve.ts` (Vitest)

---

## Zones à risque ou coûteuses en contexte IA
- Le moteur de module générique (impacte tous les modules) — à concevoir proprement une fois.

---

## Règles locales importantes
- **Jamais de persistance de données** (ni localStorage, ni cookies, ni envoi réseau).
- Contenu médical **sourcé** (HAS, Tabac Info Service) et affichable dans le module.
- Garder l'interactivité (≠ diaporama) et la sobriété visuelle.
- Préserver la généricité multi-thèmes (ne pas coder « en dur » pour le tabac dans le moteur).

---

## Comment choisir les fichiers à fournir à ChatGPT
- Produit / architecture : `PROJECT_BRIEF.md`, `STATUS.md`, `ROADMAP.md`, `PROJECT_MAP.md`
- Contenu d'un module : `docs/contenu-modules.md` + le dossier `features/tabac/<module>/`
- Bug : `STATUS.md`, `PROJECT_MAP.md`, logs, fichiers concernés
