# STATUS.md

État à l'instant T : ce qui marche, ce qui casse. Historique détaillé : `git log`.

> **Frontières** — STATUS : état actuel · `TASKS.md` : backlog + tâches · `plans/` : plan d'une tâche active · `VALIDATION.md` : checklist visuelle.
>
> **Dernière mise à jour :** 2026-07-01

## Phase actuelle

Phase 1 (squelette + 6 modules tabac) terminée. Phase 2 (corrections UX, `plans/PLAN_corrections-ux.md`) : C1-C9 faits, reste **C10** (bloqué sur contenu à fournir par Thibault). Phase 3 (`plans/PLAN_corrections-v2.md`, captures Thibault 2026-07-01) : **R1** fait (débordement systémique : `.content` borné à 960px, graphiques SVG bornés en hauteur/largeur dans Nicotine/Soulagement/Craving/Addiction). **R2** fait (Nicotine-toxique : hotspots/étiquettes/pop-up dérivés d'un point unique en coordonnées viewBox ; `.scene` suit le ratio du viewBox `1000/620` — supprime le décalage lié au letterboxing du SVG sur les breakpoints mobiles ; pop-up ancré près du point cliqué au lieu d'un coin fixe). **R3** fait (Craving : `.overlayZone` bornée par `inset`/`max-height`/`overflow` tant qu'≤1 outil actif ; dès 2+ outils actifs les cartes basculent sous le graphe en grille responsive — plus aucun débordement quand les 4 outils sont actifs). **R4** fait (Nicotine : le balayage temporel démarre automatiquement à l'ouverture et boucle en continu façon oscilloscope — supprime la dépendance au bouton « Lecture » ; un clic sur un geste insère la prise au temps courant et dessine sa cinétique immédiatement ; Pause/Vitesse relégués en contrôles secondaires, Réinitialiser en tertiaire/alerte ; ajout d'un dégradé sous la courbe déjà parcourue et d'un chip « État actuel » avec icône, mieux intégré ; `nicotineCurve.ts` non touché, partagé avec R5). `npm`/`node` ne sont pas sur le `PATH` de cet environnement, mais `node.exe` existe sous `/c/Program Files/nodejs/` : `tsc -b`, `vite build` et `vitest run` ont pu être exécutés directement via `node_modules/.bin` pour R4 (tous verts) — les exécutants suivants devraient tenter cette voie avant de déclarer l'auto-validation indisponible. Reste globalement : passe de validation visuelle par Thibault + contenu non bloquant (sources, bonnes pratiques substituts) + suite du Lot C/D/E de `PLAN_corrections-v2.md` (R5-R9).

## Ce qui fonctionne

- **Scaffolding** Vite + React + TS ; navigation carte ↔ module (pile d'historique éphémère) ; accueil grille 3×2 responsive.
- **Coquille partagée** : `ModuleShell`, `Sources` (pop-over discret), `ModuleCard`. Registre `src/features/registry.ts` + types `src/features/types.ts`.
- **Les 6 modules du thème tabac** implémentés (plus aucun stub) :
  1. **Addiction** (`addiction/`) — diagramme de Venn 3 cercles (physique / psycho / comportemental), sélection + outils + renvois.
  2. **Nicotine** (`nicotine/`) — balayage temporel continu (démarre seul, façon oscilloscope), prises au temps courant, coloration par zone, respecte `prefers-reduced-motion`.
  3. **Substituts & titration** (`substituts/`) — 7 formes ; titration sans plafond en quarts de patch (grille 2×2), toggles envie/surdosage, jour/nuit ; aucun dosage chiffré.
  4. **Nicotine ≠ toxique** (`nicotine-toxique/`) — scène SVG, hotspots, filtres ; contenu médical à valider.
  5. **Piège du soulagement** (`soulagement/`) — courbes stress/nicotine, comparaison non-fumeur ; récit chiffré illustratif à valider.
  6. **Craving / 4D** (`craving/`) — vague de l'envie (~30 s), 4D en bascules avec overlays bornés (bascule en grille sous le graphe dès 2+ outils actifs), respiration.
- **Logique pure** : `src/lib/nicotineCurve.ts` (`sampleCurve`, `classifyZone`, `sampleStress`, `toSvgPath`), couverte par Vitest (`nicotineCurve.test.ts`, 15 tests verts).
- **Styles / accessibilité** : `tokens.css` (palette sémantique confort/toxique/vigilance/nav), `global.css` (cibles ≥ 44 px, `.activeDoubled`, `prefers-reduced-motion`).

## Ce qui n'est pas fait / à compléter (non bloquant)

- **Validation visuelle/UX humaine** des modules et de C8-C9 : pas encore faite (cf. `VALIDATION.md`).
- **C10** : sources exactes par module (HAS / Tabac Info Service) dans `registry.ts` ; contenu détaillé « bonnes pratiques / erreurs fréquentes » par forme de substitut (Module 3-A, placeholders).
- Contenus **en attente de validation Thibault** : récit chiffré du stress (C4), regroupements toxiques (C7) — cf. `VALIDATION.md`.

## Dette technique / complexité

- Faible : 6 modules indépendants, logique pure isolée. Aucune zone difficile identifiée.
