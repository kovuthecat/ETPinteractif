# PROJECT_MAP.md

Carte synthétique du projet. Permet à ChatGPT et Claude Code de localiser vite les zones pertinentes.

> État : **scaffolding fait (T1)**, modules pas encore implémentés (T2+). Cette carte décrit la cible.

---

## Vue d'ensemble

- Type : application web statique (Vite + React + TS), local-first, sans backend ni base.
- Grandes zones : une **carte de modules** (accueil) + des **modules ETP** indépendants + un **moteur de module** générique.
- Flux principal : le soignant ouvre l'app → carte des modules → clique un module → l'illustre avec le patient → revient à la carte. Aucune donnée n'est enregistrée.
- Contrainte structurante : multi-thèmes par conception (un thème = un ensemble de modules) ; zéro persistance.

---

## Arborescence utile (cible)

```text
src/
  app/            # entrée, routing/navigation, layout plein écran
  components/     # UI partagée (boutons, carte, conteneur de module)
  features/
    modules/      # le moteur générique de module (coquille réutilisable)
    tabac/        # le thème "sevrage tabagique" : ses modules
      addiction/
      nicotine/
      substituts/
      strategies/
  content/        # données de contenu des modules (textes, sources, structure)
  lib/            # utilitaires
  types/          # types partagés (définition d'un module, d'un thème)
docs/
  architecture.md
  contenu-modules.md
PROJECT_MAP.md
```

Adapter au repo réel dès le scaffolding.

---

## Features principales (cible)

### Feature 1 — Carte / menu central
Rôle : présenter les modules d'un thème, navigation libre non-linéaire.
Fichiers clés : `src/app/`, `src/components/` (carte).
Points de vigilance : doit rester lisible à distance, gros éléments cliquables.

### Feature 2 — Moteur de module générique
Rôle : coquille réutilisable (titre, zone interactive, sources, retour carte) pour tout module/thème.
Fichiers clés : `src/features/modules/`, `src/types/`.
Points de vigilance : généricité = clé de la réutilisation multi-thèmes ; ne pas coupler au tabac.

### Feature 3 — Modules du thème tabac
Rôle : le contenu interactif (addiction, nicotine, substituts, stratégies…).
Fichiers clés : `src/features/tabac/*`, `src/content/`.
Points de vigilance : exactitude médicale, sources affichables, sobriété visuelle.

---

## Fichiers transversaux importants
- Configuration : `vite.config.ts`, `tsconfig.json` (à venir)
- Routing / navigation : `src/app/`
- État global : minimal, **éphémère uniquement** (pas de persistance ; pas de localStorage)
- API / persistance : **aucune** (décision structurante)
- UI partagée : `src/components/`

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
