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
- 5 stubs de modules restants (« À venir ») reliés au registre : `addiction`, `substituts`, `nicotine-toxique`, `soulagement`, `craving` (T2).
- Module 2 — nicotine (`src/features/nicotine/NicotineModule.tsx`, T6) : bac à sable fonctionnel. Boutons cigarette/substitut ponctuel/vapoteuse (ajoutent un event à un créneau régulier), toggle patch, réinitialiser. Graphique SVG via `sampleCurve`/`toSvgPath` (T5) : 2 seuils pointillés (manque/tolérance), bande « zone confortable », mention « schéma illustratif », légende des messages clés.
- Registre `src/features/registry.ts` (titre/résumé/icône/Component par module) et types `src/features/types.ts` (`ModuleId`, `ModuleProps`, `ModuleDef`).
- Coquille partagée (T3) : `src/components/ModuleShell.tsx` (en-tête + retour + sources), `src/components/Sources.tsx` (pop-over discret, placeholder « à compléter » si vide), `src/components/ModuleCard.tsx` (carte cliquable icône/titre/résumé). Pas encore consommés par `App.tsx` (intégration prévue en T4).

### API / backend
- Sans objet (projet sans backend par conception).

### Logique pure

- `src/lib/nicotineCurve.ts` (T5) : `sampleCurve` (composition cigarette/ponctuel/vapoteuse/patch, valeurs relatives 0–1 clampées) et `toSvgPath`. Couvert par tests Vitest (`nicotineCurve.test.ts`, 6 tests verts). Partagé par les futurs Module 2 (T6) et Module 5 (T7).

### Scripts / pipeline

- `npm run test` (Vitest) ajouté en devDependency, pour la logique pure uniquement (pas de jsdom configuré).

## Ce qui est prototypal ou instable
- (rien)

## Ce qui ne fonctionne pas / n'est pas testé
- Aucun contenu de module implémenté (stubs uniquement). Carte d'accueil stylée + intégration de `ModuleShell` dans `App.tsx` = T4, contenu des 6 modules = T5-T11.

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
1. T1–T5 faits (scaffolding, types/registre/navigation, coquille/sources/carte, carte centrale, utilitaire de courbe). Poursuivre `PLAN_modules-tabac.md` à partir de T6 (Module 2 — nicotine, bac à sable).
2. Compléter le contenu non bloquant : références de sources par module, « bonnes pratiques / erreurs » par forme de substitut (Module 3-A).

## Notes / décisions en attente
- Données cliniques **validées** (titration, vapoteuse, 4D, sources discrètes) — cf. `docs/contenu-modules.md`.
- Plan d'exécution prêt : `PLAN_modules-tabac.md` (squelette + 6 modules).
- Reste à fournir (non bloquant) : sources exactes ; contenu détaillé des formes de substituts.
- Frise des bénéfices de l'arrêt : repoussée hors du cadrage initial.
