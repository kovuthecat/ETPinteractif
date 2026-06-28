# ROADMAP.md

## Vision

Un **support d'ETP interactif et non-linéaire** pour la consultation, sobre et visuel, où le soignant
illustre ses explications module par module. Multi-thèmes à terme ; premier thème = sevrage tabagique.

## Phase 0 — Cadrage (en cours)

- [x] Décisions structurantes (usage, navigation, données, stack) — voir `DECISIONS.md`
- [x] Création des fichiers de contexte
- [ ] Cadrage précis du **contenu des modules** (voir `docs/contenu-modules.md`)
- [ ] Choix de l'identité visuelle / ton (sobre, clinique, rassurant)

## MVP (Phase 1)

- [ ] Scaffolding Vite + React + TS, organisation feature-first par module
- [ ] **Carte/menu central** des modules (non-linéaire, libre)
- [ ] **Moteur de module générique** (coquille réutilisable : titre, contenu interactif, retour à la carte)
- [ ] 3–4 modules cœur du sevrage tabagique, dont au moins un interactif avec saisie éphémère :
  - [ ] Les composantes de l'addiction (triple dépendance)
  - [ ] Le fonctionnement de la nicotine (récepteurs / dopamine / craving)
  - [ ] Les substituts nicotiniques (TNS)
  - [ ] Outils et stratégies validées d'aide au sevrage
- [ ] Build statique + test hors-ligne sur tablette

## Version 1

- [ ] Modules complémentaires (bénéfices de l'arrêt, gestion du craving, balance décisionnelle,
      économies, vapotage, rechute…) — cf. `docs/contenu-modules.md`
- [ ] Sources médicales affichables par module (références HAS / Tabac Info Service)
- [ ] Fiche récap **imprimable et éphémère** (non stockée) à remettre au patient (optionnel)

## Version 2 / idées futures

- [ ] **2e thème ETP** (à définir) validant la généricité du moteur de modules
- [ ] Mode plein écran / présentation
- [ ] Accessibilité renforcée (gros contrastes, taille de police réglable)

## Critères avant ajout de feature

- Complexité proportionnée, maintenance acceptable, contexte projet maîtrisé.
- Découpable en tâches Claude Code ciblées, documentable dans `PROJECT_MAP.md`.
- Ne casse pas la généricité multi-thèmes ni le principe « zéro donnée stockée ».

## À éviter pour l'instant

- Stockage de données patient, comptes, suivi longitudinal.
- Parcours auto-adaptatif / profilage imposé.
- Dépendances lourdes (frameworks d'animation complexes) tant que du CSS/SVG simple suffit.
