# STATUS.md

État détaillé du développement à un instant T.

> **Dernière mise à jour :** 2026-06-28

## Phase actuelle

**Phase 1 — Squelette applicatif + 6 modules tabac : terminée (T1-T11, lot `PLAN_modules-tabac.md` clos le 2026-06-28).**
Les 6 modules du thème tabac sont implémentés et naviguables. Reste : passe de validation visuelle par Thibault, et contenu non bloquant à fournir (sources, bonnes pratiques substituts).

## Ce qui fonctionne

### Pages / écrans
- Scaffolding Vite + React + TS en place (T1).
- Navigation par état carte ↔ module (T2) : liste cliquable des 6 modules, retour à l'accueil. Liste non stylée (stylage prévu en T4).

### Composants / modules
- **Les 6 modules du thème tabac sont implémentés** (registre `src/features/registry.ts` entièrement câblé, plus aucun stub « À venir »).
- Module 1 — composantes de l'addiction (`src/features/addiction/AddictionModule.tsx`, T8) : 3 piliers cliquables (Physique, Psychologique, Comportementale). Chaque pilier affiche 2 onglets : « De quoi parle-t-on ? » (liste d'exemples) et « Outils & stratégies » (conseils courts + boutons de renvoi vers Modules 2, 3, 6 selon le pilier). Renvois fonctionnels via `onNavigate`.
- Module 2 — nicotine (`src/features/nicotine/NicotineModule.tsx`, T6) : bac à sable fonctionnel. Boutons cigarette/substitut ponctuel/vapoteuse (ajoutent un event à un créneau régulier), toggle patch, réinitialiser. Graphique SVG via `sampleCurve`/`toSvgPath` (T5) : 2 seuils pointillés (manque/tolérance), bande « zone confortable », mention « schéma illustratif », légende des messages clés.
- Module 3 — substituts & titration (`src/features/substituts/SubstitutsModule.tsx`, T9) : Partie A, sélecteur des 7 formes (patch 24h/16h, gomme, pastille, comprimé sublingual, inhaleur, spray buccal, vapoteuse) → panneaux « Bonnes pratiques » / « Erreurs fréquentes » (placeholders « à compléter », contenu détaillé à fournir par Thibault). Partie B, patch en 4 quarts manipulable : toggles « envie persiste » / « signes de surdosage », bouton « + ¼ (à J+2-3) » (actif si envie et pas de surdosage), bouton « surdosage → revenir en arrière », toggle Jour/Nuit affichant un second patch dont la dose est clampée ≤ dose de jour. Aucun dosage chiffré (que des quarts de patch). Message permanent « Expérimentez, fiez-vous à votre ressenti ».
- Module 4 — la nicotine n'est pas le toxique (`src/features/nicotine-toxique/NicotineToxiqueModule.tsx`, T10) : comparatif deux colonnes (fumée vs nicotine), bascule « ce qui crée la dépendance » / « ce qui rend malade » qui met en évidence le bon groupe, items cliquables détaillant leur rôle, renvois vers Modules 2 et 3.
- Module 5 — le piège du soulagement (`src/features/soulagement/SoulagementModule.tsx`, T7) : bascule Non-fumeur/Fumeur. Non-fumeur = ligne plate constante au milieu de la zone confortable ; Fumeur = `sampleCurve` avec 5 cigarettes (t=0.1…0.9, yo-yo sous le seuil de manque). Même rendu SVG (seuils, zone confortable, mention illustrative) que le Module 2. Légende dynamique (ton non culpabilisant) : le « plaisir » = soulagement du manque créé par la cigarette précédente.
- Module 6 — gérer le craving / 4D (`src/features/craving/CravingModule.tsx`, T11) : « La vague de l'envie » — courbe en cloche SVG asymétrique (montée rapide, descente lente) parcourue par un repère sur ~30 s via `requestAnimationFrame` (nettoyé à l'unmount) ; libellé de phase dynamique (ça monte → pic → ça redescend → c'est passé) ; bouton rejouer. 4 cartes D dépliables (Différer, Distraire, Décontracter, De l'eau) ; « Décontracter » propose une animation de respiration en boucle (cercle CSS, inspire 4 s / expire 6 s). Aparté discret « Tabac Info Service 39 89 ». Pas de persistance, pas de son.
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
- Les 6 modules sont tous implémentés ; plus aucun stub.
- Module 3 : contenu détaillé « bonnes pratiques / erreurs fréquentes » par forme = placeholders « à compléter » (non bloquant, cf. `docs/contenu-modules.md`).
- Sources exactes par module (HAS / Tabac Info Service) à compléter dans `registry.ts` (`sources?: string[]`) — affichage discret déjà fonctionnel (`Sources.tsx`), contenu à fournir par Thibault.
- Aucune validation visuelle/UX humaine effectuée encore sur les modules T6-T11 (cf. `VALIDATION.md`).

## Validation manuelle effectuée
- [ ] Desktop navigateur principal
- [ ] Mobile / tablette
- [x] Build production
- [ ] Déploiement

## Complexité technique actuelle
- Niveau global : faible à modérée (6 modules indépendants, logique pure isolée dans `nicotineCurve.ts`).
- Zones difficiles : aucune identifiée.
- Refactors à éviter : sans objet.

## Contexte IA
- `PROJECT_MAP.md` à jour : oui (arborescence réelle, post-lot T1-T11)
- Dernier export de contexte utile : —
- Zones à documenter davantage : **contenu des modules** (`docs/contenu-modules.md`) — sources exactes, contenu substituts

## Prochaines étapes immédiates
1. **Lot `PLAN_modules-tabac.md` (T1-T11) terminé.** Passe de validation visuelle/UX par Thibault (`npm run dev`, checklist `VALIDATION.md`).
2. Compléter le contenu non bloquant : références de sources par module, « bonnes pratiques / erreurs » par forme de substitut (Module 3-A).
3. Décider de la suite : itérations de contenu sur le thème tabac, ou cadrage d'un 2ᵉ thème (l'app est multi-thèmes par conception).

## Notes / décisions en attente
- Données cliniques **validées** (titration, vapoteuse, 4D, sources discrètes) — cf. `docs/contenu-modules.md`.
- Plan d'exécution prêt : `PLAN_modules-tabac.md` (squelette + 6 modules).
- Reste à fournir (non bloquant) : sources exactes ; contenu détaillé des formes de substituts.
- Frise des bénéfices de l'arrêt : repoussée hors du cadrage initial.
