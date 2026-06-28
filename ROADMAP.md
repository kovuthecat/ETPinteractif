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
- [ ] Modules cadrés (détail dans `docs/contenu-modules.md`), interactifs à manipulation libre :
  - [ ] Les composantes de l'addiction (carte d'orientation)
  - [ ] La nicotine : cinétique & seuils (bac à sable — preuve de concept)
  - [ ] Utilisation des substituts & titration du patch (toutes formes + vapoteuse)
  - [ ] La nicotine n'est pas le toxique
  - [ ] Le piège du soulagement
  - [ ] Gérer le craving (4D)
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
