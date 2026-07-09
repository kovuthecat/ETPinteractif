# STATUS.md

État à l'instant T : ce qui marche, ce qui casse. Historique détaillé : `git log`.

> **Frontières** — STATUS : état actuel · `TASKS.md` : backlog + tâches · `plans/` : plan d'une tâche active · `VALIDATION.md` : checklist visuelle.
>
> **Dernière mise à jour :** 2026-07-09 (X7 — resynchronisation des docs sur le code, clôture du chantier extensions-tabac)

## Phase actuelle

Phase 1 (squelette + 6 modules tabac) terminée. Phase 2 (corrections UX, `plans/PLAN_corrections-ux.md`) : C1-C9 faits, reste **C10** (bloqué sur contenu à fournir par Thibault). Phase 3 (`plans/PLAN_corrections-v2.md`, captures Thibault 2026-07-01) : R1-R9 faits. Phase 4 (`plans/corrections-v3/`) : V1-V8 faits. **Phase 5** (`plans/corrections-v4/`, audit Playwright 2026-07-01) : A1-A12 faits (12 correctifs UX). **Phase 6** (`plans/refonte-ui/`, refonte visuelle sur la maquette Claude Design, cf. `docs/DESIGN_REFONTE.md`) : S1-S10 + S2-S9 exécutés, T12 consolidation faite. Vague 1 (S1) : socle (fonts auto-hébergées, tokens oklch, primitives globales). Vague 2 (S10 + S2-S9 en parallèle) : restyle complète de tous les modules + réécriture logique des courbes (S4, S7). Résultat : palette crème/éditoriale, typographie Source Serif 4 / Work Sans, nouvelle grille de module 0–100 / 24 h. **Phase 7** (2026-07-08) : **introduction du moteur multi-thèmes**. Le thème tabac déménage sous `src/features/tabac/` (7 modules + `nicotineCurve.ts`, inchangés fonctionnellement), le moteur (`types.ts`, `registry.ts`, `src/components/`) devient générique (plus aucun id/nom de thème en dur), un écran `ThemeSelector` apparaît car un 2e thème `diabete` est scaffoldé (vide, `enConstruction: true`, badge « Bientôt disponible »). Le contenu clinique du diabète est en cours de cadrage avec Thibault (cf. `docs/diabete/00-global.md`) : 4 des 8 modules déjà spécifiés en détail (module, sources probantes brutes dans `docs/evidence-diabete/`), reste à finaliser avant transmission à Claude Design. **Phase 8** (`plans/extensions-tabac/`, brief Fable `docs/BRIEF_TABAC.md`) — **chantier clos le 2026-07-09
(X1-X7 faits)** : **X1** — socle générique `FicheOverlay` (aperçu A4 + impression) et CSS d'impression +
blocs typographiques de fiche, préalable bloquant aux 4 fiches concrètes (X2-X5) et au module « Mon plan
d'arrêt » (X5). **X2-X4** — les 3 fiches « Ma carte anti-envie » (Craving), « Ma méthode patch »
(Substituts), « Mes raisons » (Motivation), chacune via `FicheOverlay`. **X5** — nouveau module tabac
`plan-arret/` (8ᵉ module, famille Agir, `id: 'plan-arret'`) + sa fiche « Mon plan d'arrêt ». **X6** —
`ModuleFooterNav` générique (extrait de nicotine-toxique) câblé en pied de 6 modules (portes §3.3), fil
rouge « fumée / manque / ça se traite » posé en exergue d'accueil + clôture des 4 modules Comprendre +
pieds des 4 fiches (§3.4), composant `InfoHover` créé mais **non câblé** (aucune entrée du 2ᵉ niveau §3.5
validée par Thibault à ce stade, cf. §5 du brief — comportement attendu, confirmé encore vrai en X7).
**X7** — resynchronisation de `docs/contenu-modules-tabac.md`, `STATUS.md`, `PROJECT_MAP.md`, `TASKS.md`
sur l'état réel du code (aucun fichier `src/` modifié). X1-X6 codés mais **non commités** au moment de X7
(cf. `git status` — normal, contexte de session en cours). `tsc --noEmit` + `vite build` verts pour
l'ensemble ; `vitest run` (20 tests) vert.

## Ce qui fonctionne

- **Moteur multi-thèmes** (2026-07-08) : navigation à 3 niveaux (thèmes → accueil du thème → module,
  pile d'historique éphémère) ; `ThemeSelector` (nouveau) affiche une carte par thème, masqué si un
  seul thème existe ; `Home.tsx`, `ModuleCard.tsx` génériques (aucun id/nom de thème en dur).
- **Scaffolding** Vite + React + TS ; navigation carte ↔ module (pile d'historique éphémère) ; accueil grille familles (Comprendre / Agir / Se motiver, A3) responsive.
- **Coquille partagée** : `ModuleShell`, `Sources` (libellé « Sources » visible + focus clavier A4), `ModuleCard`. Registre + `famille` par module (A3).
- **Les 8 modules du thème tabac** implémentés (plus aucun stub) — descriptions resynchronisées sur le
  code en X7 (2026-07-09) :
  1. **Addiction** (`addiction/`) — diagramme de Venn à géométrie fixe, sélection par contour/opacité/échelle légère + panneau latéral unique signes/pistes et renvois (B1) ; message central toujours visible ; portes contextuelles dans le panneau (pas de `ModuleFooterNav`, volontairement).
  2. **Nicotine** (`nicotine/`) — frise 24 h cliquable (modèle réécrit en S4, 2026-07-08) : 3 outils (Cigarette / Patch / Substitut), clic sur la frise = pose un événement à cet instant, clic sur un marqueur = le retire ; patch réglable en **quarts de dose ±¼** ; chip « Pic atteint : \<zone> » ; tooltips signes de manque/surdosage au survol/focus des libellés de zone ; `ModuleFooterNav` (X6) → Substituts, Soulagement.
  3. **Substituts & titration** (`substituts/`) — **5 formes** (patch, gomme, pastille, comprimé sublingual, spray buccal), toutes avec contenu médical validé (bonnes pratiques + erreurs) ; inhaleur et vapoteuse retirés le 2026-07-08 (cf. `DECISIONS.md`, mécanisme `enRedaction` supprimé) ; titration : bouton « + ¼ (tous les 3 jours) » + aide de condition + bannière surdosage détaillée ; aucun dosage chiffré ; fiche « Ma méthode patch » (X3) ; `ModuleFooterNav` (X6) → Plan d'arrêt, Nicotine.
  4. **Nicotine ≠ toxique** (`nicotine-toxique/`) — scène SVG, hotspots, filtres ; atténuation légère de l'autre groupe + double encodage non chromatique (icônes ⚠/🧠 + libellés de rôle) (A7) ; contenu médical (regroupements toxiques + formulation nicotine) validé par Thibault le 2026-07-08 ; bloc « Continuer l'exploration » migré sur `ModuleFooterNav` (X6) → Substituts, Nicotine, sans changement visuel.
  5. **Piège du soulagement** (`soulagement/`) — frise 24 h cliquable (modèle réécrit en S7, 2026-07-08) : clic = dépose une cigarette (chute puis remontée de la tension liée au manque), clic sur un repère = le retire, toggle « Comparer au non-fumeur » ; amplitudes du récit chiffré illustratif validées par Thibault le 2026-07-08 ; `ModuleFooterNav` (X6) → Substituts, Craving.
  6. **Craving / 4D** (`craving/`) — **compte à rebours réel de 3 min** (3:00 → 0:00, `CRAVING_DURATION = 180`), 3 phases idle/active/done, marqueur parcourant une vague Bézier ; 4 cartes D en bascules, libellés exacts : Différer / Détourner l'attention / Se détendre — respirez (avec animation de respiration) / D'eau ; « C'est passé » réservé à la fin réelle du décompte ; fiche « Ma carte anti-envie » (X2) ; `ModuleFooterNav` (X6) → Motivation, Plan d'arrêt.
  7. **Explorer ma motivation** (`motivation/`) — 2 onglets : « Où en êtes-vous ? » (flux de 2 questions au **cadran circulaire** `Dial` 0–10, Importance puis Confiance, relances EM, écran de synthèse) et « Mes raisons » (réserve de cartes seed → clic = ajout au tableau, **repositionnement au pointeur**, clic sans déplacement = édition, « + une raison ») ; cartes seed et libellés d'échelle validés par Thibault le 2026-07-08 ; fiche « Mes raisons » (X4) ; `ModuleFooterNav` (X6) → Plan d'arrêt.
  8. **Mon plan d'arrêt** (`plan-arret/`, ajouté X5, 2026-07-09) — famille Agir, 6 sections (date, substituts, situations à risque, parades, raisons, « autour de moi » fixe) en chips multi-sélection + champs libres ; fiche « Mon plan d'arrêt » (bouton « Imprimer mon plan », actif dès qu'une section est renseignée) ; aucun `ModuleFooterNav` (volontairement — la fiche est la sortie du module).
- **Logique pure** : `src/features/tabac/lib/nicotineCurve.ts` (`sampleCurve`, `classifyZone`, `toSvgPath`, `sampleStress`), couverte par Vitest (`nicotineCurve.test.ts`, 20 tests verts — dont l'invariant R5 « creux fumeur > basal non-fumeur », la monotonie creux/rebond, et les 3 invariants de cumul V3).
- **Styles / accessibilité** : `tokens.css` (palette sémantique confort/toxique/vigilance/nav), `global.css` (cibles ≥ 44 px, `.activeDoubled`, `prefers-reduced-motion`).
- **Socle fiches à emporter** (X1, 2026-07-09) : `src/components/FicheOverlay.tsx` — composant générique
  (props `eyebrow`/`titre`/`footer`/`onClose`/`children`, zéro contenu en dur) rendu via `createPortal`
  sur `document.body` ; feuille A4 portrait (`fiche-sheet`), fond assombri cliquable + Échap pour fermer,
  focus initial sur « Fermer », en-tête eyebrow/titre serif/date du jour, pied mention fixe
  « rien n'est enregistré », barre d'actions hors feuille (Imprimer / Fermer, `data-no-print`).
  CSS d'impression (`@page A4`, `@media print` masque `#root` + `[data-no-print]`) et blocs
  typographiques réutilisables (`.fiche-titre-xl`, `.fiche-bloc`, `.fiche-signaletique` + pastilles
  numérotées, `.fiche-contact` bandeau 39 89) dans `src/styles/global.css` (section « Fiches »).
- **Les 4 fiches concrètes** (X2-X5, 2026-07-09), chacune via `FicheOverlay` + `.fiche-filrouge` en
  pied : **Ma carte anti-envie** (Craving, bouton « Préparer ma carte », boucle signalétique 1-2-3 + 4D
  cochables + bandeau 39 89) ; **Ma méthode patch** (Substituts, bouton « Imprimer ma méthode », les 3
  règles + dose du moment en quarts jour/nuit) ; **Mes raisons** (Motivation, bouton « Imprimer mes
  raisons », cartes du tableau + échelles si renseignées) ; **Mon plan d'arrêt** (module `plan-arret`,
  bouton « Imprimer mon plan », les sections renseignées uniquement).
- **Portes de fin de module + fil rouge + `InfoHover`** (X6, 2026-07-09) :
  - `src/components/ModuleFooterNav.tsx` — bloc générique « Continuer l'exploration » (titre + boutons
    `{label →}`), extrait de nicotine-toxique (qui migre dessus sans changement visuel) ; câblé en pied
    de Nicotine, Soulagement, Craving, Substituts, Motivation avec les libellés/ids verbatim du brief
    §3.3 — jamais un enchaînement forcé. Addiction et Plan d'arrêt n'ont volontairement aucune porte.
  - Fil rouge « C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
    traite. » — champ générique `exergue?: string` sur `ThemeDef` (rendu par `Home.tsx` sous le titre),
    câblé sur le thème tabac uniquement ; classe globale `.filrouge` en clôture des 4 modules
    « Comprendre » (Addiction, Nicotine, Nicotine ≠ toxique — qui remplace son ancien « À retenir »,
    Soulagement) ; classe `.fiche-filrouge` en pied des 4 `FicheOverlay` (craving, substituts,
    motivation, plan-arret).
  - `src/components/InfoHover.tsx` — généralisation du pattern tooltip de zone du module Nicotine
    (survol + focus clavier), composant créé et fonctionnel mais **non câblé sur aucun contenu** :
    aucune des 3 entrées du 2ᵉ niveau de lecture (`docs/BRIEF_TABAC.md` §3.5 — substituts/nicotine/
    craving) n'est marquée validée au §5 du brief à ce stade. C'est le comportement par défaut attendu,
    pas un point bloquant.

## Ce qui n'est pas fait / à compléter (non bloquant)

- **Thème diabète** : scaffold vide (`src/features/diabete/registry.ts`, `MODULES: []`) — cadrage du
  contenu clinique en cours avec Thibault (4/8 modules spécifiés en détail dans `docs/diabete/`,
  sources probantes brutes dans `docs/evidence-diabete/`), reste à finaliser les modules 5-8 puis
  transmettre à Claude Design avant tout développement.
- **Validation visuelle/UX humaine** des modules et de C8-C9 : pas encore faite (cf. `VALIDATION.md`).
- **C10 (partiel)** : sources exactes par module dans `registry.ts` — **seul point de contenu encore en attente** de Thibault (l'encart « Sources » affiche « à compléter » tant qu'elles manquent).
- **2ᵉ niveau de lecture (X6, `InfoHover`)** : contenu à câbler dès que Thibault valide tout ou partie
  des 3 entrées de `docs/BRIEF_TABAC.md` §3.5 (substituts, nicotine, craving) + leurs sources exactes
  (§5 du brief). Le composant générique est prêt ; il ne reste qu'à passer `content`/`children` dans
  les 3 modules concernés une fois validé.
- Dépouillement des questions de contenu le **2026-07-08** : regroupements toxiques + formulation nicotine (Module 4), amplitudes du soulagement (Module 5), cartes seed + libellés d'échelle motivation (Module 7) **validés par Thibault** ; inhaleur + vapoteuse **retirés** du Module 3 ; enrichissement « outils & stratégies » Module 1 (R6) clos sans ajout. Il ne reste que les sources exactes (ci-dessus).

## Dette technique / complexité

- Faible : 8 modules indépendants, logique pure isolée. Aucune zone difficile identifiée.
