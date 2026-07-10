# STATUS.md

État à l'instant T : ce qui marche, ce qui casse. Historique détaillé : `git log`.

> **Frontières** — STATUS : état actuel · `TASKS.md` : backlog + tâches · `plans/` : plan d'une tâche active · `VALIDATION.md` : checklist visuelle.
>
> **Dernière mise à jour :** 2026-07-10 (boite-a-outils BO9 — consolidation BO1-BO8 : craving → Stratégies & outils, refonte Composantes, vapoteuse substituts, section « Si j'ai un écart », 6 cartes Vrai/faux, filtre diabète activité, contexte mis à jour)

## Phase actuelle

**Phase 9** (`plans/theme-diabete/`, câblage du thème diabète sur maquette Claude Design, 2026-07-09) : **plan S13 consolidation complet (D1-D13)**, puis **S14 — corrections de la revue visuelle de Thibault sur build local** (7 bugs, 5 modules + lib). Thème diabète opérationnel : 9 modules (Mécanisme/Alimentation/Activité physique/Risque cardiovasculaire/Complications/Suivi/Traitements/Hypoglycémie/Insuline) + lib `glycemieCurve` (modèle physiologique + tests 61/61 verts) + 4 composants transversaux (Silhouette/CourbeGlycemie/PlaqueArtere/SignatureEvitable). Gate finale : `npx tsc --noEmit` + `npm run build` + `npm test` tous verts.

**S14 (2026-07-09)** — évolutions notables :

- **Lib `glycemieCurve.ts`** : `paramsFromAssiette` dérive désormais la courbe de la **composition réelle approximative** du repas (charge glycémique, fibres, protéines, lipides — `AlimentRepas { cg, fibres, proteines, lipides }`) plutôt que d'heuristiques de familles + proximité à une assiette-modèle. `Famille` et les proportions sortent de la lib (ne vivent plus que côté `alimentation/data.ts` et modules). L'ordre du féculent devient gradué (`Assiette.ordreFeculent?: number`, 0→1) — l'ancien booléen `ordreFeculentDernier` disparaît, aucune compatibilité. Le scénario nocturne `ScenarioTrace = 'nuit_isolee'` est remplacé par `'descend_hypo_matinale'` ; le raccord nuit→jour de `sampleJournee` est désormais continu (plus de saut brutal au passage minuit).
- **`alimentation/data.ts`** : la table `FOODS` passe des CG relatives (échelle 0-100) aux **charges glycémiques réelles par portion usuelle** + nouveaux champs `fibres`/`proteines`/`lipides` (grammes réels) — seuils `cgTier` recalibrés (vert ≤10, orange 11-19, rouge ≥20). `// à revalider (Thibault)`.
- **Module 6 Suivi — inversion de la décision D9 n°2** : le cadran démarre désormais **vide** au montage (l'utilisateur le construit élément par élément), au lieu du pré-peuplement automatique posé en S9.
- Détail complet des 7 bugs (B1-B8) et invariants de tests dans `plans/theme-diabete/S14.md`.

Contexte resynchronisé (S13 puis S14) : `index.md` (S1-S14 cochées [x]), `TASKS.md` (D1-D14 [x] avec résumés de gate), `STATUS.md` (cette entrée), `DECISIONS.md`, `VALIDATION.md` (checklists visuelles mises à jour, statut « à valider par Thibault »). À compléter/revalider (Thibault) : **fréquences module 6** (ADA/HAS-SFD), **seuils module 4** (HbA1c/TA/LDL), **table CG/fibres/protéines/lipides module 2** (ordres de grandeur plausibles, révisée en S14), **phrases cliniques module 7** (8 classes, `// à revalider`), **illustrations diabete** (`design/illustrations/prompts-illustrations-diabete.html` → `public/illustrations/diabete/<id>.png`, convention d'ids dans `S1.md`).

## Phase actuelle (suite)

Phase 1 (squelette + 6 modules tabac) terminée. Phase 2 (corrections UX, `plans/PLAN_corrections-ux.md`) : C1-C9 faits, reste **C10** (bloqué sur contenu à fournir par Thibault). Phase 3 (`plans/PLAN_corrections-v2.md`, captures Thibault 2026-07-01) : R1-R9 faits. Phase 4 (`plans/corrections-v3/`) : V1-V8 faits. **Phase 5** (`plans/corrections-v4/`, audit Playwright 2026-07-01) : A1-A12 faits (12 correctifs UX). **Phase 6** (`plans/refonte-ui/`, refonte visuelle sur la maquette Claude Design, cf. `docs/DESIGN_REFONTE.md`) : S1-S10 + S2-S9 exécutés, T12 consolidation faite. Vague 1 (S1) : socle (fonts auto-hébergées, tokens oklch, primitives globales). Vague 2 (S10 + S2-S9 en parallèle) : restyle complète de tous les modules + réécriture logique des courbes (S4, S7). Résultat : palette crème/éditoriale, typographie Source Serif 4 / Work Sans, nouvelle grille de module 0–100 / 24 h. **Phase 7** (2026-07-08) : **introduction du moteur multi-thèmes**. Le thème tabac déménage sous `src/features/tabac/` (7 modules + `nicotineCurve.ts`, inchangés fonctionnellement), le moteur (`types.ts`, `registry.ts`, `src/components/`) devient générique (plus aucun id/nom de thème en dur), un écran `ThemeSelector` apparaît car un 2e thème `diabete` est scaffoldé (vide, `enConstruction: true`, badge « Bientôt disponible »). Le contenu clinique du diabète est en cours de cadrage avec Thibault (cf. `docs/diabete/00-global.md`) : 4 des 8 modules déjà spécifiés en détail (module, sources probantes brutes dans `docs/evidence-diabete/`), reste à finaliser avant transmission à Claude Design. **Phase 8** (`plans/extensions-tabac/`, brief Fable `docs/BRIEF_TABAC.md`) — **chantier initial clos le 2026-07-09
(X1-X7), complété le même jour par X8** (extension fiche patch demandée par Thibault hors brief initial)
: **X1** — socle générique `FicheOverlay` (aperçu A4 + impression) et CSS d'impression +
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

## Phase actuelle (suite)

**Phase 9 (approfondissement-tabac)** — **Chantier multi-agents S1-S6 + consolidation S7 (2026-07-09/10)** :
Trois domaines d'amélioration du thème tabac lancés le 2026-07-09 pour approfondir la compréhension clinique :
1. **Courbes réalistes** (S3) : refonte du modèle `nicotineCurve.ts` pour refléter les ordres de grandeur
   pharmacologiques réels (demi-vie ≈ 2 h, pic cigarette < 10 min, patch 2-4 h, saturation/tolérance, tension
   du manque liée à la nicotinémie) tout en préservant la pédagogie des 3 zones. API gelée. 37 invariants testés
   → 78/78 tests verts (S3).
2. **Silhouette générique** (S2) : promotion du composant diabète en `src/components/SilhouetteCorps` générique
   (zones en données, états `actif`/`ouvert`/`allume`/`verrouille`/`masque`, motif vaisseaux optionnel) ; wrapper
   diabète en `src/features/diabete/components/Silhouette.tsx` iso-API (aucun module diabète ne change).
3. **Deux nouveaux modules tabac** (S1 socle, S5-S6 implémentation) :
   - **Module 9 — Ce que l'arrêt répare** (S5) : silhouette générique + frise de 10 jalons (20 min → 10-15 ans)
     rallumant le corps zone par zone — registre exclusivement positif (jamais l'organe malade). Famille Se motiver.
     Chiffres à revalider (source : Tabac Info Service / OMS).
   - **Module 10 — Vrai ou faux ?** (S6) : 15 cartes d'idées reçues, verdict factuel + nuancé + sourcé (livrées
     toutes actives, cartes 4/14/15 flaggées `// à revalider (Thibault)` pour revue clinique réelle avant
     usage en consultation). Famille Comprendre. Ton informatif, jamais culpabilisant.
4. **Prompts d'illustrations** (S4) : section « Tabac — bénéfices » (8 vignettes d'organes) + « Tabac — vrai/faux »
   (15 vignettes affirmations) dans `design/illustrations/prompts-illustrations-diabete.html` + nouveau style
   carré `tabacsq` (palette crème/kraft, format 1:1).

**Points à revalider par Thibault** (non bloquants pour S7, livrés avec la liasse de commits) :
- **Jalons S5** : chiffres et formulations (source Tabac Info Service / OMS, constantes commentées `// à revalider`).
- **Cartes sensibles S6** : vapoteuse (n° 14) et réduction (n° 15) — contenu marqué `// à revalider`, statut
  `actif: true` actuellement pour permettre revue réelle en usage. Retrait possible sans code change.
- **Carte S6 supplémentaire** : n° 4 « Quelques cigarettes » — marquée `// à revalider` sur la source, formulée
  sur Santé publique France (vérifier actualité).
- **Mention du graphe S3** : `NicotineModule.tsx` dispose d'une mention actualisée (« ordres de grandeur réels »)
  **derrière une constante avec `// à revalider (Thibault)`** ; l'ancienne mention reste par défaut.
- **Illustrations tabac** : PNG à générer selon les prompts S4 et déposer dans `public/illustrations/tabac/<id>.png`
  (piège C2PA/Inkscape : ré-encoder via Pillow ; convention d'ids dans `plans/approfondissement-tabac/S4.md`).

**Gate consolidation S7 (avant commit)** : `npx tsc --noEmit` ✓ · `npm run build` ✓ (1855 modules) ·
`npm test` ✓ (78/78 tests). Commits S1-S6 créés atomiquement (5 fichiers) + commit docs
(contenu-modules-tabac.md) + commit contexte (STATUS/TASKS/VALIDATION/PROJECT_MAP/DECISIONS/index.md).
Aucun push (attente validation orchestrateur).

## Phase actuelle (suite)

**Phase 10 (`plans/boite-a-outils/`)** — **Chantier vagues parallèles BO1-BO8 + consolidation BO9
(2026-07-10)**, issu du rapport OpenEvidence « stratégies comportementales du sevrage »
(`docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`) :

1. **Fusion Craving → Stratégies & outils** (BO1-BO2) : le module `craving` disparaît du registre ;
   `boite-a-outils` prend sa place (famille agir, hue vigilance). L'outil vague/4D est déplacé (pas
   réécrit) dans `boite-a-outils/VagueCraving.tsx` — mécanique et fiche « Ma carte anti-envie »
   inchangées — et devient un outil parmi **14**, filtrables par situation (union : transverse, ou
   intersection avec les chips actives). Fiche « Ma boîte à outils » (nouvelle) composée des outils
   cochés. `src/features/tabac/craving/**` supprimé après déplacement du code.
2. **Contexte de navigation générique** (BO1) : `ModuleProps` gagne `context?: unknown` (moteur agnostique
   de sa forme) ; `App.tsx` le transporte dans l'historique. Réutilisable par tout thème futur.
3. **Refonte du module Composantes** (BO3) : `AddictionModule.tsx` devient une page de repérage pur —
   situations de `situations.ts` (20 situations, 3 piliers, partagées avec Stratégies & outils) en
   **menu radial sélectionnable**, aucune description ni solution à l'écran (narration = soignant), CTA
   contextuel unique « Stratégies et outils (n) » vers `boite-a-outils` avec la sélection en contexte.
4. **Vrai/faux enrichi** (BO4) : 6 nouvelles cartes (poids ×3, vapoteuse ×3) + reformulation de la carte
   faux pas + retarget des renvois `craving` → `boite-a-outils` — **21 cartes** au total (contre 15).
5. **Vapoteuse réintégrée dans les Substituts** (BO5) : 6ᵉ forme, badge « Réduction des risques »,
   encart de statut « pas un médicament » — revient partiellement sur le retrait du 2026-07-08.
6. **Plan d'arrêt — section « Si j'ai un écart »** (BO6) : 7ᵉ section (3 gestes de secours) + reprise
   sur la fiche imprimée + « Vapoteuse » ajoutée aux chips substituts.
7. **Prompts d'illustrations** (BO7) : section « Tabac — Stratégies & outils » (14 outils + vapoteuse)
   dans `design/illustrations/prompts-illustrations-diabete.html`.
8. **Diabète/Activité — filtre « toniques uniquement »** (BO8) : interrupteur qui masque les activités
   légères de la **réserve** sans jamais retirer un choix déjà placé dans la jauge.

**Points à revalider par Thibault** (non bloquants, livrés avec la liasse de commits) :
- **Vapoteuse (Substituts, BO5)** : technique d'utilisation rédigée par Fable (HAS/HCSP + rapport OE).
- **11 des 21 cartes Vrai/faux** (BO4) : sources internationales (NEJM, Cochrane 2025, ACC, JAMA) ou
  Santé publique France, en attendant un équivalent HAS/Tabac Info Service.
- **Formulations patient des 14 outils** (BO2) : adaptées du rapport OE — à juger à l'usage.
- **Occurrences résiduelles du mot « craving »** hors zone de tout `S<k>.md` de ce chantier (non
  corrigées, signalées) : `src/features/registry.ts` (description libre du thème, signalé dès BO1),
  `nicotine/NicotineModule.tsx` (libellé texte, pas un id de navigation), `plan-arret/PlanArretModule.tsx`
  (commentaire de code référençant l'ancien chemin `craving/`, signalé dès BO2). Détail dans
  `DECISIONS.md` (2026-07-10, points ouverts).
- **Illustrations tabac (BO7)** : 15 PNG à générer (14 outils + vapoteuse) et déposer dans
  `public/illustrations/tabac/<id>.png`.

**Gate consolidation BO9 (avant commit)** : `npx tsc --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓.
Commits BO1-BO8 créés atomiquement (par tâche) + commit contexte
(docs/STATUS/TASKS/VALIDATION/PROJECT_MAP/DECISIONS/index.md). Aucun push (attente validation Thibault).

## Ce qui fonctionne

- **Moteur multi-thèmes** (2026-07-08) : navigation à 3 niveaux (thèmes → accueil du thème → module,
  pile d'historique éphémère) ; `ThemeSelector` (nouveau) affiche une carte par thème, masqué si un
  seul thème existe ; `Home.tsx`, `ModuleCard.tsx` génériques (aucun id/nom de thème en dur).
- **Scaffolding** Vite + React + TS ; navigation carte ↔ module (pile d'historique éphémère) ; accueil grille familles (Comprendre / Agir / Se motiver, A3) responsive.
- **Coquille partagée** : `ModuleShell`, `Sources` (libellé « Sources » visible + focus clavier A4), `ModuleCard`. Registre + `famille` par module (A3).
- **Les 10 modules du thème tabac** implémentés (plus aucun stub) — descriptions resynchronisées sur le
  code en BO9 (2026-07-10) :
  1. **Composantes de l'addiction** (`addiction/`) — *refonte BO3, 2026-07-10* : diagramme de Venn à géométrie fixe, clic sur un pilier → ses situations (`situations.ts`) en **menu radial sélectionnable** (bouton-puce à bascule, double encodage), sélection persistante entre piliers, **aucune description ni solution à l'écran** ; CTA unique « Stratégies et outils (n) » → `boite-a-outils` avec la sélection en contexte de navigation ; plus de panneau latéral ni de navigation directe.
  2. **Nicotine** (`nicotine/`) — frise 24 h cliquable (modèle réécrit en S4, 2026-07-08) : 3 outils (Cigarette / Patch / Substitut), clic sur la frise = pose un événement à cet instant, clic sur un marqueur = le retire ; patch réglable en **quarts de dose ±¼** ; chip « Pic atteint : \<zone> » ; tooltips signes de manque/surdosage au survol/focus des libellés de zone ; `ModuleFooterNav` (X6) → Substituts, Soulagement.
  3. **Substituts & titration** (`substituts/`) — **6 formes** (patch, gomme, pastille, comprimé sublingual, spray buccal, **vapoteuse** — réintégrée BO5, 2026-07-10, badge « Réduction des risques » + encart de statut, `// à revalider`), toutes avec contenu médical (bonnes pratiques + erreurs) ; inhaleur reste retiré (2026-07-08) ; titration : bouton « + ¼ (tous les 3 jours) » + aide de condition + bannière surdosage détaillée ; aucun dosage chiffré ; fiche « Ma méthode patch » (X3) ; `ModuleFooterNav` (X6) → Plan d'arrêt, Nicotine.
  4. **Nicotine ≠ toxique** (`nicotine-toxique/`) — scène SVG, hotspots, filtres ; atténuation légère de l'autre groupe + double encodage non chromatique (icônes ⚠/🧠 + libellés de rôle) (A7) ; contenu médical (regroupements toxiques + formulation nicotine) validé par Thibault le 2026-07-08 ; bloc « Continuer l'exploration » migré sur `ModuleFooterNav` (X6) → Substituts, Nicotine, sans changement visuel.
  5. **Piège du soulagement** (`soulagement/`) — frise 24 h cliquable (modèle réécrit en S7, 2026-07-08) : clic = dépose une cigarette (chute puis remontée de la tension liée au manque), clic sur un repère = le retire, toggle « Comparer au non-fumeur » ; amplitudes du récit chiffré illustratif validées par Thibault le 2026-07-08 ; `ModuleFooterNav` (X6) → Substituts, Stratégies & outils.
  6. **Stratégies & outils** (`boite-a-outils/`, *ex-Craving, fusionné BO1-BO2, 2026-07-10*) — grille de **14 outils** filtrables par situation (union : transverse ou intersection avec les chips actives, pré-filtrée si arrivée depuis Composantes) ; panneau de détail (principe + « comment le proposer », mention de preuve qualitative, jamais de chiffre) ; outil `outil-vague-4d` → **compte à rebours réel de 3 min** (3:00 → 0:00, `CRAVING_DURATION = 180`, code hérité de l'ancien module Craving), 3 phases idle/active/done, 4 cartes D (Différer / Détourner l'attention / Se détendre — respirez / D'eau), fiche « Ma carte anti-envie » inchangée ; fiche « Ma boîte à outils » (nouvelle) composée des outils cochés ; `ModuleFooterNav` (X6) → Plan d'arrêt, Motivation.
  7. **Explorer ma motivation** (`motivation/`) — 2 onglets : « Où en êtes-vous ? » (flux de 2 questions au **cadran circulaire** `Dial` 0–10, Importance puis Confiance, relances EM, écran de synthèse) et « Mes raisons » (réserve de cartes seed → clic = ajout au tableau, **repositionnement au pointeur**, clic sans déplacement = édition, « + une raison ») ; cartes seed et libellés d'échelle validés par Thibault le 2026-07-08 ; fiche « Mes raisons » (X4) ; `ModuleFooterNav` (X6) → Plan d'arrêt.
  8. **Mon plan d'arrêt** (`plan-arret/`, ajouté X5, 2026-07-09) — famille Agir, **7 sections** (date, substituts — dont vapoteuse depuis BO6 —, situations à risque, parades, raisons, « autour de moi » fixe, **« Si j'ai un écart »** ajoutée BO6 2026-07-10) en chips multi-sélection + champs libres ; fiche « Mon plan d'arrêt » (bouton « Imprimer mon plan », actif dès qu'une section est renseignée) ; aucun `ModuleFooterNav` (volontairement — la fiche est la sortie du module).
  9. **Ce que l'arrêt répare** (`benefices-arret/`, ajouté S5 approfondissement-tabac, 2026-07-09-10) — famille Se motiver, silhouette générique + frise de 10 jalons (20 min → 10-15 ans), registre exclusivement positif ; chiffres à revalider (Tabac Info Service/OMS).
  10. **Vrai ou faux ?** (`idees-recues/`, ajouté S6 approfondissement-tabac + enrichi BO4, 2026-07-09-10) — famille Comprendre, **21 cartes** (15 initiales + 6 poids/vapoteuse ajoutées BO4), carte à la fois, verdict + explication + source + renvoi éventuel ; 11 cartes marquées `// à revalider (Thibault)` (sources internationales ou SPF).
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
- **Les 5 fiches concrètes** (X2-X5 + BO2, 2026-07-09/10), chacune via `FicheOverlay` + `.fiche-filrouge`
  en pied : **Ma carte anti-envie** (attachée à l'outil `outil-vague-4d` de Stratégies & outils, bouton
  « Préparer ma carte », boucle signalétique 1-2-3 + 4D cochables + bandeau 39 89, contenu inchangé
  depuis l'ancien module Craving) ; **Ma boîte à outils** (nouvelle, BO2 2026-07-10 — bouton « Imprimer
  ma boîte à outils (n) », titre + consigne d'une ligne par outil coché) ; **Ma méthode patch**
  (Substituts, bouton « Imprimer ma méthode », les 3 règles + dose du moment en quarts jour/nuit —
  **étendue en X8**, 2026-07-09 : dose de jour en vert + marge de quarts vides coloriables au stylo
  (patch en cours complété + 1 patch), impression forcée des aplats (`print-color-adjust: exact`) ;
  bloc optionnel « Ma prise ponctuelle » via un sélecteur dédié à la fiche (gomme/pastille/sublingual/
  spray) affichant `TechniqueIllustration` (image-ready, placeholder tant qu'aucune image fournie) +
  bonnes pratiques de la forme) ; **Mes raisons** (Motivation, bouton « Imprimer mes raisons », cartes
  du tableau + échelles si renseignées) ; **Mon plan d'arrêt** (module `plan-arret`, bouton « Imprimer
  mon plan », les sections renseignées uniquement — dont la nouvelle section « Si j'ai un écart »).
- **Portes de fin de module + fil rouge + `InfoHover`** (X6, 2026-07-09 ; retargetées vers Stratégies &
  outils en BO1-BO2, 2026-07-10) :
  - `src/components/ModuleFooterNav.tsx` — bloc générique « Continuer l'exploration » (titre + boutons
    `{label →}`), extrait de nicotine-toxique (qui migre dessus sans changement visuel) ; câblé en pied
    de Nicotine, Soulagement, Stratégies & outils, Substituts, Motivation avec les libellés/ids verbatim
    du brief §3.3 (`craving` → `boite-a-outils` partout) — jamais un enchaînement forcé. Addiction et
    Plan d'arrêt n'ont volontairement aucune porte (Addiction a un CTA contextuel dédié, cf. Module 1).
  - Fil rouge « C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
    traite. » — champ générique `exergue?: string` sur `ThemeDef` (rendu par `Home.tsx` sous le titre),
    câblé sur le thème tabac uniquement ; classe globale `.filrouge` en clôture des 4 modules
    « Comprendre » (Addiction, Nicotine, Nicotine ≠ toxique — qui remplace son ancien « À retenir »,
    Soulagement) ; classe `.fiche-filrouge` en pied des 5 `FicheOverlay` (carte anti-envie, boîte à
    outils, substituts, motivation, plan-arret).
  - `src/components/InfoHover.tsx` — généralisation du pattern tooltip de zone du module Nicotine
    (survol + focus clavier), composant créé et fonctionnel mais **non câblé sur aucun contenu** :
    aucune des 3 entrées du 2ᵉ niveau de lecture (`docs/BRIEF_TABAC.md` §3.5 — substituts/nicotine/
    stratégies & outils) n'est marquée validée au §5 du brief à ce stade. C'est le comportement par
    défaut attendu, pas un point bloquant.

## Ce qui n'est pas fait / à compléter (non bloquant)

- **Thème diabète** : scaffold vide (`src/features/diabete/registry.ts`, `MODULES: []`) — cadrage du
  contenu clinique en cours avec Thibault (4/8 modules spécifiés en détail dans `docs/diabete/`,
  sources probantes brutes dans `docs/evidence-diabete/`), reste à finaliser les modules 5-8 puis
  transmettre à Claude Design avant tout développement.
- **Validation visuelle/UX humaine** des modules et de C8-C9 : pas encore faite (cf. `VALIDATION.md`).
- **C10 (partiel)** : sources exactes par module dans `registry.ts` — **seul point de contenu encore en attente** de Thibault (l'encart « Sources » affiche « à compléter » tant qu'elles manquent).
- **2ᵉ niveau de lecture (X6, `InfoHover`)** : contenu à câbler dès que Thibault valide tout ou partie
  des 3 entrées de `docs/BRIEF_TABAC.md` §3.5 (substituts, nicotine, Stratégies & outils) + leurs sources
  exactes (§5 du brief). Le composant générique est prêt ; il ne reste qu'à passer `content`/`children`
  dans les 3 modules concernés une fois validé.
- Dépouillement des questions de contenu le **2026-07-08** : regroupements toxiques + formulation nicotine (Module 4), amplitudes du soulagement (Module 5), cartes seed + libellés d'échelle motivation (Module 7) **validés par Thibault** ; inhaleur + vapoteuse **retirés** du Module 3 (vapoteuse réintégrée le 2026-07-10, cf. `DECISIONS.md`) ; enrichissement « outils & stratégies » Module 1 (R6) clos sans ajout. Il ne reste que les sources exactes (ci-dessus).
- **Occurrences résiduelles du mot « craving »** hors périmètre du chantier `boite-a-outils` (signalées,
  non corrigées — cf. `DECISIONS.md` 2026-07-10 « points ouverts ») : `src/features/registry.ts`
  (description libre du thème générique), `nicotine/NicotineModule.tsx` (libellé texte, pas un id de
  navigation), `plan-arret/PlanArretModule.tsx` (commentaire de code référençant l'ancien chemin).

## Dette technique / complexité

- Faible : 10 modules tabac indépendants (dont `boite-a-outils` et `idees-recues` partagent
  `situations.ts`/registres), logique pure isolée. Aucune zone difficile identifiée.
