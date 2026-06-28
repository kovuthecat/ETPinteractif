# STATUS.md

État détaillé du développement à un instant T.

> **Dernière mise à jour :** 2026-06-28

## Phase actuelle

**Phase 1 — Squelette applicatif + 6 modules tabac : terminée (T1-T11, lot `PLAN_modules-tabac.md` clos le 2026-06-28).**
Les 6 modules du thème tabac sont implémentés et naviguables. Reste : passe de validation visuelle par Thibault, et contenu non bloquant à fournir (sources, bonnes pratiques substituts).

**Phase 2 - Corrections UX (audit du 28/06, `PLAN_corrections-ux.md`) : en cours.** C1-C9 faits. Reste C10 (bloqué sur contenu Thibault).

## Ce qui fonctionne

### Pages / écrans
- Scaffolding Vite + React + TS en place (T1).
- Navigation par état carte ↔ module (T2) : liste cliquable des 6 modules, retour à l'accueil. Liste non stylée (stylage prévu en T4).

### Composants / modules
- **Les 6 modules du thème tabac sont implémentés** (registre `src/features/registry.ts` entièrement câblé, plus aucun stub « À venir »).
- Module 1 — composantes de l'addiction (`src/features/addiction/AddictionModule.tsx`, T8, **C6**) : 3 cercles SVG **qui se chevauchent** (diagramme de Venn, pas concentriques) — Physique (ambre `--color-vigilance`), Psychologique (bleu `--color-nav`), Comportementale (vert `--color-confort`) —, chacun étiqueté + quelques mots-clés visibles au repos. Interaction via 3 boutons HTML transparents superposés aux cercles (accessibilité clavier/lecteur d'écran), `aria-pressed`. Clic sur un cercle : il grossit légèrement et passe au-dessus des autres (contour épaissi + ombre) ; ses exemples (contenu inchangé) apparaissent en bulles dans le coin du diagramme associé à sa position (haut-gauche/haut-droite/bas-centre). Message fixe au centre du diagramme « Ces dimensions s'alimentent entre elles ». Le panneau « Outils & stratégies » (conseils courts + renvois `onNavigate` vers Modules 2/3/6) s'affiche sous le diagramme, teinté de la couleur du pilier sélectionné ; les boutons de renvoi portent désormais une mention explicite « autre module » (icône flèche) pour signaler le changement de module. Re-cliquer le même cercle désélectionne. Contenu (libellés/exemples/outils) strictement identique à l'ancienne version à onglets.
- Module 2 — nicotine (`src/features/nicotine/NicotineModule.tsx`, T6, **C3**) : timeline animée. Curseur « maintenant » qui avance via `requestAnimationFrame` (nettoyé à l'unmount) ; contrôles lecture/pause, vitesse (×1/×2/×4 cyclable), réinitialiser. Boutons cigarette / substitut ponctuel / vapoteuse / **patch** (devenu un event ancré dans le temps, plus un toggle) ajoutent la prise **au temps courant**. Le segment déjà écoulé est coloré par zone (`classifyZone` — vert confort / rouge manque ou trop haut, toujours doublé d'un libellé « État actuel : … »), le reste de la courbe complète reste discret. Chaque prise laisse un pictogramme (icône lucide) sur l'axe du temps. Respecte `prefers-reduced-motion` (pas d'animation, courbe complète affichée d'emblée, doses ajoutées à des créneaux espacés faute de curseur).
- Module 3 — substituts & titration (`src/features/substituts/SubstitutsModule.tsx`, T9, **C2**) : Partie A, sélecteur des 7 formes (patch 24h/16h, gomme, pastille, comprimé sublingual, inhaleur, spray buccal, vapoteuse) → panneaux « Bonnes pratiques » / « Erreurs fréquentes » (placeholders « à compléter », contenu détaillé à fournir par Thibault). Partie B (C2), titration **sans plafond** en quarts (init = 4 = 1 patch) : chaque patch rendu en grille **2×2**, N patchs affichés (`Math.floor(quarts/4)` pleins + reste), double libellé « X patchs + 1/4 (N quarts) ». Toggles « envie persiste » / « signes de surdosage » ; bouton « + ¼ (à J+2-3) » (vert `--color-confort`, actif si envie et pas de surdosage, sans plafond) ; bouton « − ¼ » indépendant (toujours actif, min 0) ; bouton « Signes de surdosage → revenir en arrière » (rouge `--color-toxique`). Toggle Jour/Nuit affichant un second bloc multi-patchs dont la dose est clampée ≤ dose de jour. Aucun dosage chiffré (que des quarts de patch). Message permanent « Expérimentez, fiez-vous à votre ressenti ».
- Module 4 - la nicotine n'est pas le toxique (`src/features/nicotine-toxique/NicotineToxiqueModule.tsx`, T10, **C7**) : scène SVG recomposée avec cigarette et fumée centrales, quatre familles toxiques rouges et nicotine isolée en vert. Cinq hotspots ouvrent une bulle de détail ; deux filtres atténuent l'autre groupe. Couleur doublée par libellés, motifs et icônes ; variante tablette/mobile ; renvois vers Modules 2 et 3. Contenu médical à valider dans `VALIDATION.md`.
- Module 5 — le piège du soulagement (`src/features/soulagement/SoulagementModule.tsx`, T7, **C4**) : bascule Non-fumeur/Fumeur/« Comparer au non-fumeur ». Non-fumeur = **une seule courbe** (stress basal `sampleStress`, plate, verte) — **aucune courbe de nicotine**. Fumeur = courbe nicotine en pointillé secondaire (`sampleCurve`, 5 cigarettes t=0.1…0.9) **+** courbe stress principale (`sampleStress`) qui monte quand la nicotine redescend et chute brièvement à chaque cigarette (corrélation inverse), annotation « soulagement du manque » au creux. Toggle « Comparer au non-fumeur » superpose un repère pointillé stable pour rendre visible que le niveau moyen de tension du fumeur reste plus haut. Légende dynamique (ton non culpabilisant) conservée. Récit (amplitudes du modèle de stress) **proposé par Claude, à valider par Thibault** — cf. `VALIDATION.md`.
- Module 6 — gérer le craving / 4D (`src/features/craving/CravingModule.tsx`, T11, **C5**) : « La vague de l'envie » — courbe en cloche SVG asymétrique (montée rapide, descente lente) parcourue par un repère sur ~30 s via `requestAnimationFrame` (nettoyé à l'unmount) ; libellé de phase dynamique (ça monte → pic → ça redescend → c'est passé) ; bouton rejouer + nouveau bouton **« Passer 30 s »** (saute directement à l'état final, pour les démos courtes en consultation). Les 4 D (Différer, Distraire, Décontracter, De l'eau) sont désormais des **bascules** (`aria-pressed`, plusieurs actives simultanément) qui font apparaître des **overlays ancrés sur la zone du pic du graphe** (premier consommateur de `.activeDoubled`, couleur `--color-confort`), tandis que la courbe continue de se dessiner derrière : « Différer » affiche un compte à rebours dérivé de la progression de la vague ; « Distraire » atténue l'opacité de la courbe et anime une icône ; « Décontracter » embarque le cercle de respiration (inspire 4 s / expire 6 s) ; « De l'eau » propose une mini-séquence cliquable « gorgée 1/3 → 3/3 ». Aparté discret « Tabac Info Service 39 89 ». Pas de persistance, pas de son.
- Registre `src/features/registry.ts` (titre/résumé/icône/Component par module) et types `src/features/types.ts` (`ModuleId`, `ModuleProps`, `ModuleDef`).
- Coquille partagée (T3) : `src/components/ModuleShell.tsx` (en-tête + retour + sources), `src/components/Sources.tsx` (pop-over discret, placeholder « à compléter » si vide), `src/components/ModuleCard.tsx` (carte cliquable icône/titre/résumé). Pas encore consommés par `App.tsx` (intégration prévue en T4).

### API / backend
- Sans objet (projet sans backend par conception).

### Styles / accessibilité
- `src/styles/tokens.css` (C1) : palette sémantique ajoutée (`--color-confort` vert, `--color-toxique` rouge, `--color-vigilance` ambre, `--color-nav` bleu = `--color-accent`, + variantes `-soft`) ; `--color-bg` passé à un fond chaud clair. Tokens de lisibilité `--font-size-lead`/`--font-size-small`, `--target-min: 44px`. Anciens tokens conservés (non cassés).
- `src/styles/global.css` (C1) : cibles tactiles `min-height`/`min-width: var(--target-min)` sur `button`/contrôles ; classe utilitaire `.activeDoubled` (contour + ✓ + couleur via `--active-color`, jamais la couleur seule, consommée depuis C5 par les bascules 4D du Module 6) ; bloc `prefers-reduced-motion` neutralisant animations/transitions. Tokens sémantiques consommés depuis C2 (Module 3 : `--color-confort`/`--color-toxique`/`--color-nav`).

### Logique pure

- `src/lib/nicotineCurve.ts` (T5, **C3**, **C4**) : `sampleCurve` (composition cigarette/ponctuel/vapoteuse/patch — patch désormais aussi disponible comme event ancré `patchKernel(x, t0)`, valeurs relatives 0–1 clampées), `classifyZone(y)` (manque/confort/haut, frontières incluses dans confort), `toSvgPath`, et **`sampleStress(opts)`** (C4 : non-fumeur = palier bas constant `STRESS_BASAL_NON_FUMEUR` ; fumeur = `STRESS_BASAL_FUMEUR + STRESS_AMPLITUDE_MANQUE * (1 - nicotine)`, dérivé de `sampleCurve`, valeurs illustratives non cliniques). Couvert par tests Vitest (`nicotineCurve.test.ts`, 15 tests verts). Partagé par Module 2 (T6/C3, `sampleCurve`/`classifyZone`) et Module 5 (T7/C4, `sampleCurve` + `sampleStress`).

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
1. **Lot `PLAN_corrections-ux.md`.** C1-C9 faits. Reste C10 (bloqué sur contenu Thibault).
2. **Passe de validation visuelle/UX par Thibault** (`npm run dev`, checklist `VALIDATION.md` pour C8-C9).
3. C10 en attente : compléter le contenu non bloquant — références de sources par module, « bonnes pratiques / erreurs » par forme de substitut (Module 3-A).

## Notes / décisions en attente
- **C4 (soulagement)** : récit chiffré du modèle de stress codé par Claude à titre illustratif (amplitudes relatives, cf. `VALIDATION.md`) - **en attente de validation/ajustement par Thibault**.
- **C7 (nicotine vs toxiques)** : regroupements et formulations de la scène recomposée - **en attente de validation par Thibault**.
- Données cliniques **validées** (titration, vapoteuse, 4D, sources discrètes) — cf. `docs/contenu-modules.md`.
- Plan d'exécution prêt : `PLAN_modules-tabac.md` (squelette + 6 modules).
- Reste à fournir (non bloquant) : sources exactes ; contenu détaillé des formes de substituts.
- Frise des bénéfices de l'arrêt : repoussée hors du cadrage initial.
