# STATUS.md

État détaillé du développement à un instant T.

> **Dernière mise à jour :** 2026-06-28

## Phase actuelle

**Phase 1 — Squelette applicatif.**
Objectif : construire le socle technique (T1-T4) avant les modules de contenu (T5+).

## Ce qui fonctionne

### Pages / écrans
- Scaffolding Vite + React + TS en place (T1).
- Navigation par état carte ↔ module (T2) : liste cliquable des 6 modules, retour à l'accueil. Liste non stylée (stylage prévu en T4).

### Composants / modules
- 6 stubs de modules (« À venir ») reliés au registre : `addiction`, `nicotine`, `substituts`, `nicotine-toxique`, `soulagement`, `craving` (T2).
- Registre `src/features/registry.ts` (titre/résumé/icône/Component par module) et types `src/features/types.ts` (`ModuleId`, `ModuleProps`, `ModuleDef`).

### API / backend
- Sans objet (projet sans backend par conception).

### Scripts / pipeline
- (aucun)

## Ce qui est prototypal ou instable
- (rien)

## Ce qui ne fonctionne pas / n'est pas testé
- Aucun contenu de module implémenté (stubs uniquement). Coquille partagée (`ModuleShell`/`Sources`/`ModuleCard`) = T3, carte stylée = T4, contenu des 6 modules = T5-T11.

## Validation manuelle effectuée
- [ ] Desktop navigateur principal
- [ ] Mobile / tablette
- [x] Build production
- [ ] Déploiement

## Complexité technique actuelle
- Niveau global : très faible (phase conception).
- Zones difficiles : aucune pour l'instant.
- Refactors à éviter : sans objet.

## Contexte IA
- `PROJECT_MAP.md` à jour : oui (état conception, pas encore de code)
- Dernier export de contexte utile : —
- Zones à documenter davantage : **contenu des modules** (`docs/contenu-modules.md`)

## Prochaines étapes immédiates
1. T1 fait (scaffolding). Poursuivre `PLAN_modules-tabac.md` à partir de T2 (types, registre, navigation).
2. Compléter le contenu non bloquant : références de sources par module, « bonnes pratiques / erreurs » par forme de substitut (Module 3-A).

## Notes / décisions en attente
- Données cliniques **validées** (titration, vapoteuse, 4D, sources discrètes) — cf. `docs/contenu-modules.md`.
- Plan d'exécution prêt : `PLAN_modules-tabac.md` (squelette + 6 modules).
- Reste à fournir (non bloquant) : sources exactes ; contenu détaillé des formes de substituts.
- Frise des bénéfices de l'arrêt : repoussée hors du cadrage initial.
