# PROJECT_MAP.md

Carte synthétique du projet. Permet à ChatGPT et Claude Code de localiser vite les zones pertinentes.

> État : **lot `PLAN_modules-tabac.md` (T1-T11) terminé le 2026-06-28** — scaffolding + les 6 modules du thème tabac sont implémentés et naviguables. **`plans/PLAN_corrections-v2.md` (R1-R9) terminé le 2026-07-01** — dont R9 : ajout d'un 7ᵉ module transverse, `motivation/`. **Moteur multi-thèmes introduit le 2026-07-08** : le thème tabac a été déplacé sous `features/tabac/`, un écran de sélection de thème (`ThemeSelector`) a été ajouté, et un thème `diabete` est scaffoldé (sans contenu, en attente de cadrage). **Chantier `plans/extensions-tabac/` (X1-X7) clos le 2026-07-09** (brief `docs/BRIEF_TABAC.md`) : 8ᵉ module `plan-arret/`, 4 fiches imprimables via `FicheOverlay`, portes de fin de module via `ModuleFooterNav`, fil rouge du thème, composant `InfoHover` (créé, non câblé). **Chantier `plans/approfondissement-tabac/` (S1-S7) clos le 2026-07-10** : modèle `nicotineCurve.ts` réaliste, `SilhouetteCorps` générique, modules 9 (Ce que l'arrêt répare) et 10 (Vrai ou faux ?). **Chantier `plans/boite-a-outils/` (BO1-BO9) clos le 2026-07-10** : `craving/` remplacé par `boite-a-outils/` (14 outils filtrables, fiche « Ma boîte à outils »), refonte du module Composantes (sélection radiale de situations, `situations.ts` partagé), contexte de navigation générique (`unknown`) dans le moteur, vapoteuse réintégrée dans les Substituts, section « Si j'ai un écart » dans Plan d'arrêt, 6 nouvelles cartes Vrai/faux (21 au total), interrupteur « toniques uniquement » côté diabète/Activité. **Chantier `plans/corrections-audit-tabac/` (S1-S13) clos le 2026-07-13** : retouches UI/a11y sur 6 modules tabac + 1 composant diabète partagé (S1-S9), nouveau `src/state/SelectionContext.tsx` (état de sélection partagé **en mémoire**, S10), nouveau livret d'accompagnement imprimable `src/components/PrintableLivret.tsx` (S11, proposition livrée sans validation visuelle, à ajuster). Chantier séparé cadré `plans/aide-patient/` (T16, app patient autonome, 2ᵉ surface applicative) : cadrage produit complet, **non démarré**. **Chantier `plans/corrections-revue-guidee/` (S1-S6 + 3 correctifs de séance) validé visuellement par Thibault le 2026-07-14** (13 points d'une revue guidée, blocs A-E ; consolidation S7 en cours) : benefices-arret passe en nav par frise chronologique à hotspots + silhouette anatomique hotspot, plan-arret gagne un sélecteur de stratégie, insuline-rapide corrige son modèle « couvrir » (dose fixe) et gagne un encadré `.situationCard` + `excesGate` en lib, insuline basale perd ses onglets (écran unique), VagueCraving (Boîte à outils) passe les 4D en activation exclusive. **Chantier `plans/outils-interactifs-2026-07/` (S1-S8) clos le 2026-07-21** : 11 des 14 outils de « Stratégies & outils » rendus interactifs (registre `OUTILS_INTERACTIFS`, dossier `outils-interactifs/` ci-dessous) dans les deux bundles (consultation + patient), `outil-respiration` recâblé en consultation, persistance injectée (`outilsData` en mémoire côté consultation, `localStorage` côté patient via `usePatientStore`). **Chantier `plans/insuline-affinements-2026-07/` (S1-S6) clos le 2026-07-21** : nouveau doc d'autorité `docs/diabete/09-insuline-basale.md`, module basale enrichi (intro rôle de la lente + bloc régularité/horaire + pont vers la rapide), module rapide enrichi (slider timing ② à source de vérité unique + 5ᵉ onglet « Et si je ne mange pas ? » + pont vers la basale), garde-fou dans `glycemieCurve.ts` (`sampleRepasAvecBolus`, plus de creux sous baseline au cas adéquat). **Chantier `plans/revue-prod-2026-07/` (S1-S6) clos le 2026-07-21** (revue prod complète au navigateur in-app) : app patient — les outils interactifs se montent enfin (parité de schéma avec la consultation, `PatientSituations.tsx`) ; « Mon plan d'arrêt » réduit à l'écran aux sections date + écart (le livret reste complet, lit toujours l'état partagé) + « + autre » situation ajouté dans Composantes ; QR du livret reformulé (composant partagé `QRBlock.tsx`) ; 5 correctifs d'ergonomie consultation (Composantes, Motivation, Alimentation, Traitements, en-têtes à onglets multiples) ; silhouette de « Ce que l'arrêt répare » surligne désormais l'organe au repère sélectionné (aligné sur le mécanisme diabète). **Chantier `plans/theme-cardio-2026-07/` (S1-S14, 2026-07-22, non clos)** : **3ᵉ thème `cardio`** (« Prévention cardiovasculaire », primaire uniquement) câblé depuis un handoff Claude Design (`design/Mosule cardio ETP interactif-handoff.zip`) et le brief/evidence cliniques (`docs/cardio/`) — 12 modules, gate contenu **G1 validée par Thibault** (jamais de LDL/tension chiffrés à l'écran, AMT < 135/85, sel/alcool qualitatifs sourcés SPF, **aucune mention d'aspirine**, « mes 3 chiffres » retenu pour le suivi), lib pure testée `risqueCardio.ts` (cumul **multiplicatif** des facteurs, cœur pédagogique du thème), 4 composants cardio-owned réutilisant le moteur générique. Pilote M1-M3 **validé visuellement** (silhouette M3 recalée 380→560 px, alignée sur l'anatomie du module Risque CV diabète) ; **M4-M12 restent à valider à l'écran** — porte inter-thèmes réelle et généralisation des composants jugées hors v1 (gates tranchées avec Thibault). **Chantier `plans/enrichissement-visuel-2026-07/` (S1-S7, 2026-07-23, non clos)** : finition visuelle & garde-manger (issu de l'audit `rapport-audit-consultation-2026-07.md`) — 5 commits consolidés (S1-S4 + V0-bis) : enrichissement data garde-manger (légumes×12→brocoli+carotte, situations culturelles×7, cardio par copie assetss diabète) ; cardio Manger passé en onglets par catégorie (Légumes/Féculents/Protéines/Matières grasses/Fruits/Laitiers) ; presets partagés « repas-types » (5 presets, cardio+diabète) ; écran sélection de thème avec icônes+grille équilibrée ; nettoyage fichier prompts (71 retirés, 23+11 cardio+6 tabac conservés). Chantier non clos : S5 (pictos familles, bloqué G-familles) et S6 (câblage assets générés, bloqué génération PNG Thibault) pendantes ; validation visuelle humaine entièrement à faire — cf. `VALIDATION.md`. **Chantier `plans/refonte-audit-2026-07/` (S1-S9, 2026-07-24)** : suites de l'audit pédagogique des 3 thèmes — 6 sessions codées (layout diabète grand visuel, feedback insuline basale, leviers cardio M9 réactifs, 7 micro-fixes, cardio M3 plaque-pivot, rétro-port barre de risque diabète via nouveau composant partagé `src/components/RisqueBarre.tsx`) ; S6 (mécanisme CV tabac M6) bloquée gate contenu G-A8 (proposition sourcée écrite, code non fait) ; S8 (illustrations) hors vague, bloquée PNG Thibault. Validation visuelle humaine à faire — cf. `VALIDATION.md`. Cette carte décrit l'arborescence réelle.

---

## Vue d'ensemble

- Type : application web statique (Vite + React + TS), local-first, sans backend ni base.
- Grandes zones : un **écran de sélection de thème** (`ThemeSelector`, affiché seulement si ≥ 2 thèmes) → une **carte de modules** par thème (`Home.tsx`) → des **modules ETP** indépendants (`src/features/<theme>/<slug>/`) → une **coquille de module** générique (`ModuleShell`) rendue par `App.tsx`.
- Navigation par état dans `App.tsx` (pas de router) : `view: {type:'themes'} | {type:'home', themeId} | {type:'module', themeId, moduleId}`.
- Flux principal : le soignant ouvre l'app → (si plusieurs thèmes) choisit un thème → carte des modules du thème → clique un module → l'illustre avec le patient → revient à la carte. Aucune donnée n'est enregistrée.
- Contrainte structurante : multi-thèmes par conception. Le moteur (`src/features/types.ts`, `src/features/registry.ts`, tout `src/components/`) ne connaît **aucun thème par son nom** — `ModuleId`/`FamilleId` sont des `string` génériques, `hue` vit dans `ModuleDef`, les familles et l'eyebrow vivent dans `ThemeDef`. Chaque thème (`tabac`, `diabete`) est un dossier isolé sous `src/features/<theme>/` avec son propre `registry.ts`. Zéro persistance.

---

## Arborescence réelle

```text
src/
  main.tsx                 # entrée, import des styles globaux
  App.tsx                  # navigation par état (themes <-> home <-> module), rend ThemeSelector/Home/ModuleShell
  styles/
    tokens.css              # variables CSS (couleurs, espacements, radius, font-size)
    global.css              # reset + import des tokens
  components/               # UI partagée, générique (pas de contenu tabac/diabète)
    ThemeSelector.tsx / .module.css # accueil global : grille de cartes thème (masqué si un seul thème)
    Home.tsx / .module.css       # accueil d'un thème : grille de ModuleCard par famille + exergue (fil rouge, X6)
    ModuleShell.tsx / .module.css # en-tête (retour + titre + Sources) autour de chaque module
    Sources.tsx / .module.css     # pop-over discret des sources (placeholder si vide)
    ModuleCard.tsx / .module.css  # carte cliquable (icône + titre + résumé)
    FicheOverlay.tsx / .module.css    # fiche à emporter générique (aperçu A4 + impression, X1)
    ModuleFooterNav.tsx / .module.css # porte de fin de module générique « Continuer l'exploration » (X6)
    InfoHover.tsx / .module.css       # 2ᵉ niveau de lecture générique, survol/focus+clic verrouillant (X6, créé ; câblé diabète/alimentation)
    RisqueBarre.tsx / .module.css     # barre de risque qualitative « faible → élevé » générique (score 0-1,
                                       # aucun chiffre affiché), extraite du cockpit cardio M2 et rétro-portée
                                       # au cockpit diabète RCV (A10, refonte-audit-2026-07, S7, 2026-07-24)
    PrintableLivret.tsx / .module.css # livret d'accompagnement imprimable multi-pages A4 (couverture + sections
                                       # imprimables assemblées depuis SelectionContext ; consommé par le module
                                       # plan-arret tabac ; S11 corrections-audit-tabac, 2026-07-13, proposition
                                       # livrée sans validation visuelle)
  state/
    SelectionContext.tsx    # état de sélection partagé EN MÉMOIRE (jamais localStorage/sessionStorage/cookies),
                             # Provider générique indexé par themeId + hook useSelection() ; monté dans App.tsx
                             # au-dessus du switcher de vues (survit à la navigation inter-modules, se
                             # réinitialise au rechargement) ; S10 corrections-audit-tabac, 2026-07-13
  content/
    repas-types.ts          # presets « repas-types » partagés (5 repas : couscous-merguez, riz-poisson,
                             # poulet-plantain, lentilles-œuf, petit-déj méditerranéen), créé S3
                             # enrichissement-visuel-2026-07, consommé par MangerModule (cardio) +
                             # AlimentationModule (diabète) — aucune dépendance thème
  features/
    types.ts                # ModuleId/FamilleId (string génériques), Hue, ModuleDef, FamilleDef, ThemeDef (+ Icon: LucideIcon ajouté S4 enrichissement-visuel-2026-07), exergue?
    registry.ts              # THEMES: ThemeDef[] — registre des thèmes (tabac + diabete + cardio), avec icônes (tabac: CigaretteOff, diabete: Droplet, cardio: Heart)
    tabac/
      registry.ts            # MODULES: ModuleDef[] — les 10 modules tabac, titres/résumés/icônes/hue
      situations.ts          # SITUATIONS: 20 situations partagées (3 piliers) + parseSelectionSituations
                              # (contexte de navigation Addiction → Stratégies & outils, BO1, 2026-07-10)
      addiction/AddictionModule.tsx              # Module 1 — composantes de l'addiction (refonte BO3 2026-07-10 :
                                                  # sélection radiale de situations, sans description ni solution à l'écran) ;
                                                  # chantier revue-prod-2026-07 (2026-07-21) : clamp des positions de bulles
                                                  # (RP4a, débordement horizontal piliers Physique/Psychologique) + champ
                                                  # « + autre » saisie libre sous le venn (RP2b, pousse dans
                                                  # state.situationsLibres, même canal que le livret) + validation au blur
                                                  # de ce champ (RP3b)
      nicotine/NicotineModule.tsx                # Module 2 — nicotine, frise 24 h cliquable (S4, X6 : ModuleFooterNav)
      substituts/SubstitutsModule.tsx + data.ts  # Module 3 — substituts & titration, 6 formes dont vapoteuse
                                                  # (T9, X3 : fiche, X6 : ModuleFooterNav, BO5 2026-07-10 : vapoteuse) ;
                                                  # data.ts (FORMES_DATA/FormeId/FORMES_PONCTUELLES) extrait du
                                                  # module en S11 corrections-audit-tabac, réutilisé par le livret
      nicotine-toxique/NicotineToxiqueModule.tsx # Module 4 — nicotine ≠ toxique (T10, X6 : migré sur ModuleFooterNav)
      soulagement/SoulagementModule.tsx          # Module 5 — le piège du soulagement (S7, X6 : ModuleFooterNav)
      boite-a-outils/BoiteAOutilsModule.tsx      # Module 6 — Stratégies & outils, ex-Craving (BO1-BO2, 2026-07-10) :
                                                  # 14 outils filtrables par situation, VagueCraving.tsx (4D hérité ;
                                                  # activation exclusive d'un D à la fois depuis le correctif de
                                                  # séance corrections-revue-guidee, 2026-07-14 — la vague de
                                                  # l'envie est visible par défaut, le D actif se superpose dessus),
                                                  # fiche « Ma boîte à outils », X6 : ModuleFooterNav ; toggle grille
                                                  # « Dans ma fiche » retiré (S3 corrections-revue-guidee, reste en
                                                  # vue détail) ; les 2 renvois `outils.ts` vers plan-arret retirés ;
                                                  # depuis 2026-07-21 (chantier outils-interactifs-2026-07), monte
                                                  # les outils du registre `outils-interactifs/` (ci-dessous) via
                                                  # `useConsultationStore()` au lieu du seul cas `vague4d` en dur
        outils-interactifs/                      # Socle + composants des 11 outils rendus interactifs
                                                  # (chantier outils-interactifs-2026-07, S1-S7, 2026-07-21) :
          types.ts                                 # contrat `OutilStore` (get/setList) / `OutilContexte`
                                                    # (situationsActives?, raisons?, lecture seule) / `OutilInteractifProps`
          registry.ts                              # `OUTILS_INTERACTIFS: Partial<Record<interactif, Component>>` —
                                                    # remplace le test en dur `interactif === 'vague4d'` ; wrappers
                                                    # `VagueCraving`/`RespirationGuidee` + les 9 composants ci-dessous
          useConsultationStore.ts                  # adaptateur `OutilStore` sur `useSelection()` (SelectionContext,
                                                    # mémoire de session — invariant #1 consultation maintenu)
          PlansSiAlors.tsx / .module.css           # OI5 (S2) — constructeur de plans « SI… ALORS… »
          Tirelire.tsx / .module.css               # OI6 (S3) — calculette d'économies + récompense
          OutilChecklist.tsx / .module.css         # OI7 (S4) — générique : place-nette/mains-bouche/anti-ennui/routine
          MinuteurGuide.tsx / .module.css          # OI8 (S5) — générique : bouger 10 min / surfer sur l'envie
          PlanSecours.tsx / .module.css            # OI9 (S6) — plan de secours en cas d'écart
          PhraseRefus.tsx / .module.css            # OI10 (S6) — ma phrase de refus
          GabaritJournal.tsx / .module.css         # OI11 (S7) — renvoi carnet (patient) / gabarit imprimable (consultation)
          data/checklists.ts                       # données des 4 checklists (OI7), disjointes de `outils.ts`
          data/minuteurs.ts                        # étapes/durées des 2 minuteurs (OI8), disjointes de `outils.ts`
      motivation/MotivationModule.tsx + data.ts  # Module 7 — explorer ma motivation (S9 cadran Dial, X4 : fiche, X6) ;
                                                  # data.ts (MOTIVATION_SEED/RAISON_ICONS/iconForRaison) extrait du
                                                  # module en S11 corrections-audit-tabac, réutilisé par le livret
      plan-arret/PlanArretModule.tsx + livretSections.tsx  # Module 8 — mon plan d'arrêt (X5, ajouté 2026-07-09 ;
                                                  # section 7 « Si j'ai un écart » ajoutée BO6, 2026-07-10 ; famille
                                                  # agir ; lit ET écrit SelectionContext depuis S10 (bidirectionnel) ;
                                                  # section « 1. Ma date » gagne un sélecteur de stratégie « Arrêt
                                                  # complet / Réduction progressive » (S4 corrections-revue-guidee,
                                                  # 2026-07-14 — champ `strategie` en mémoire dans SelectionContext,
                                                  # libellés conditionnels seuls, livret inchangé) ;
                                                  # livretSections.tsx = contrat PrintableSection + builder
                                                  # buildLivretSections(state) consommé par PrintableLivret, S11) ;
                                                  # chantier revue-prod-2026-07 (2026-07-21, RP2a) : UI de
                                                  # PlanArretModule réduite aux seules sections 1 (stratégie+date) et
                                                  # « Si j'ai un écart » — les sections substituts/situations/parades/
                                                  # raisons/autour-de-moi retirées de l'écran uniquement (état/reducer
                                                  # intacts) ; livretSections.tsx **inchangé**, continue de lire
                                                  # l'état partagé en entier, le livret reste complet ; champ
                                                  # « + autre » de la section écart validé au blur en plus d'Entrée
                                                  # (RP3b)
      benefices-arret/BeneficesArretModule.tsx   # Module 9 — ce que l'arrêt répare (silhouette générique + frise
                                                  # 10 jalons, S5 approfondissement-tabac) ; nav par **frise
                                                  # chronologique à hotspots** (remplace chips + compteur « Étape
                                                  # X/N ») + silhouette en **mode hotspot anatomique** (bodyImage,
                                                  # asset copié public/illustrations/tabac/silhouette-corps.png,
                                                  # ancres % dans data.ts, sans importer le wrapper diabète) ;
                                                  # illustration de détail agrandie (S1 corrections-revue-guidee,
                                                  # 2026-07-14) ; chantier revue-prod-2026-07 (2026-07-21, RP6a,
                                                  # gate G-RP6 option a) : la silhouette **surligne désormais
                                                  # l'organe** du repère temporel sélectionné (allumage automatique
                                                  # de `jalonCourant.zones` quand aucun hotspot n'est cliqué
                                                  # explicitement), aligné sur le comportement diabète — réutilise
                                                  # tel quel le moteur de halo générique `SilhouetteCorps.tsx`,
                                                  # aucune duplication
      idees-recues/IdeesRecuesModule.tsx + data.ts  # Module 10 — Vrai ou faux ? (21 cartes, S6 approfondissement-tabac
                                                     # + BO4 2026-07-10 : 6 cartes poids/vapoteuse + reformulation faux-pas)
      lib/
        nicotineCurve.ts + .test.ts  # logique pure tabac : sampleCurve/toSvgPath/sampleStress, partagée Modules 2 & 5
    diabete/
      registry.ts             # MODULES: ModuleDef[] — 9 modules diabète, titres/résumés/icônes/hue/sources (S1)
      components/
        IllustrationSlot.tsx / .module.css   # composant placeholder pour illustrations (S1)
        Silhouette.tsx / .module.css         # corps humain SVG avec zones nommées + états (S3)
        CourbeGlycemie.tsx / .module.css     # rendu unique de courbe glycémie avec marqueurs (S3)
        PlaqueArtere.tsx / .module.css       # motif plaque d'athérome, variantes artère/pastille (S3)
        SignatureEvitable.tsx / .module.css  # badge « Évitable et dépistable » récurrent (S3)
      lib/
        glycemieCurve.ts / .test.ts  # logique pure diabète : paramsFromAssiette/sampleRepas/sampleActivite/sampleRecuperation/sampleJournee/tempsDansCible (S2, 50 tests) ;
                                      # S3 chantier insuline-affinements-2026-07 (2026-07-21) : garde-fou
                                      # local dans `sampleRepasAvecBolus` (l'effet bolus ne peut plus creuser
                                      # sous la baseline avant `LATENCE_REPAS` sans excès de glycémie
                                      # disponible) — API exportée inchangée, 106 tests (5 nouveaux invariants)
      mecanisme/MecanismeModule.tsx / .module.css  # Module 1 — C'est quoi le diabète (clé/serrure, 4 temps, S4)
      alimentation/AlimentationModule.tsx / .module.css / data.ts  # Module 2 — Alimentation (déroulé guidé, 4 défis + synthèse, fiche + 2ᵉ niveau, S5 + alimentation-v2 S1-S3 ; data enrichie S1 enrichissement-visuel-2026-07, légumes×10 + situations×7, toutes valeurs `// à revalider`)
      activite/ActiviteModule.tsx / .module.css / data.ts         # Module 3 — Activité physique (rayonnement, jauge, timing, S6 ;
                                                                    # interrupteur « toniques uniquement » BO8, 2026-07-10 — filtre la
                                                                    # réserve seule, ne retire jamais un choix déjà placé dans la jauge)
      risque-cardio/RisqueCardioModule.tsx / .module.css          # Module 4 — Risque cardiovasculaire (5 feux, artère, anatomie, fiche, S7)
      complications/ComplicationsModule.tsx / .module.css / data.ts  # Module 5 — Complications (silhouette, « évitable », fiche pied, S8)
      suivi/SuiviModule.tsx / .module.css / logic.ts              # Module 6 — Suivi (cadran année, fiche calendrier, S9)
      traitements/TraitementsModule.tsx / .module.css / data.ts   # Module 7 — Traitements (ordonnance ↔ silhouette, S10)
      hypoglycemie/HypoglycemieModule.tsx / .module.css           # Module 8 — Hypoglycémie (15/15, récupération/overshoot, carte, S11)
      insuline/InsulineModule.tsx / .module.css / scenarios.ts    # Module 9 — Insuline basale (traces capteur, TIR vivant, S12) ;
                                                                    # onglets retirés, **écran unique continu** (correctif de séance
                                                                    # corrections-revue-guidee, 2026-07-14 — remplace l'alignement prévu
                                                                    # sur les onglets de la rapide ; bloc « Décider » toujours visible ;
                                                                    # scenarios.ts intact, retouche présentation/nav uniquement) ; S4
                                                                    # chantier insuline-affinements-2026-07 (2026-07-21) : intro « à quoi
                                                                    # sert la lente » + carte régularité/horaire (générique, sans molécule)
                                                                    # + phrase-pont vers la rapide ajoutées en amont de la titration
                                                                    # (toujours le cœur de l'écran, inchangée) ; scenarios.ts non touché
      insuline-rapide/InsulineRapideModule.tsx / .module.css      # Module 10 — Insuline rapide pré-prandiale (4 temps : couvrir
                                                                    # le repas / bon moment / corriger / cumul → hypo ;
                                                                    # CVD3-S10, 2026-07-11 ; contenu : docs/diabete/10-insuline-rapide.md,
                                                                    # relecture finale Thibault encore attendue). S5-S6 + correctif
                                                                    # corrections-revue-guidee (2026-07-14) : temps ① dose « habituelle »
                                                                    # devenue fixe (résultat = écart dose−glucides, alignée sur temps ③) ;
                                                                    # réglages fins temps ③ ; temps ④ « redescend seule » redessinée +
                                                                    # correctif post-validation (2 courbes de base partent identiques,
                                                                    # divergent après le pic, via `excesGate` gaté post-pic dans
                                                                    # glycemieCurve.ts) ; encadré commun `.situationCard`
                                                                    # (situation→réponse→résultat) posé sur les temps ①③④, aligné sur
                                                                    # la présentation de l'insuline basale. Chantier
                                                                    # insuline-affinements-2026-07 (2026-07-21) : S2 — slider timing ②
                                                                    # refondu sur `timingPhase(delay)` (source de vérité unique, libellé
                                                                    # dynamique remplace les 4 étiquettes fixes) ; S5 — **5ᵉ temps**
                                                                    # `⑤ Et si je ne mange pas ?` (repas charge 0 + bolus → plonge,
                                                                    # renvoi module 8), positionnement après le ④ à revalider
    cardio/
      registry.ts             # MODULES: ModuleDef[] — 12 modules cardio, 3 familles comprendre/agir/soigner
                                # (theme-cardio-2026-07, 2026-07-22)
      lib/
        risqueCardio.ts / .test.ts  # logique pure cardio : plaqueGeom (dépôt/fissure/caillot/renforcée) +
                                      # cumulMultiplicatif (le cumul des facteurs se MULTIPLIE, ≠ addition —
                                      # cœur pédagogique du thème), 21 invariants testés
      components/
        ArtereCoupe.tsx / .module.css   # artère réversible riche (dépôt + rupture + espoir), consomme la lib
        CockpitFeux.tsx / .module.css   # tableau de feux modifiables, a11y couleur+bordure (jamais couleur seule)
        Silhouette.tsx                  # wrapper mince cardio sur `SilhouetteCorps` (zones cœur/cerveau/jambes/reins)
        IllustrationSlot.tsx / .module.css  # copie du composant diabète, chemin `illustrations/cardio/`
      artere/ArtereModule.tsx / .module.css        # Module 1 — L'artère qui s'encrasse (pilote, séquence 4 temps réversible)
      risque/RisqueModule.tsx / .module.css        # Module 2 — Mon risque global (cockpit + cumul multiplicatif + fiche)
      territoires/TerritoiresModule.tsx / .module.css  # Module 3 — Où l'accident frappe (silhouette 560px, 4 territoires)
      tension/TensionModule.tsx / .module.css      # Module 4 — La tension (artère sous pression + règle des 3 + fiche)
      cholesterol/CholesterolModule.tsx / .module.css  # Module 5 — Le cholestérol (curseur LDL qualitatif, jamais de g/L)
      tabac/TabacModule.tsx / .module.css          # Module 6 — Le tabac (réversibilité CV, repli visuel vers le thème Tabac)
      bouger/BougerModule.tsx / .module.css        # Module 7 — Bouger (volume sans plafond + régularité)
      manger/MangerModule.tsx / .module.css / data.ts  # Module 8 — Manger pour ses artères (familles + assiette + fiche ; S2 enrichissement-visuel-2026-07 : passé en onglets par catégorie, data enrichie légumes×10 + situations×7 + féculents diabète×6, toutes valeurs `// à revalider`, bouton « Charger un repas-type » vers src/content/repas-types.ts)
      leviers/LeviersModule.tsx / .module.css      # Module 9 — Les autres leviers (alcool/sommeil-SAOS/stress)
      alerte/AlerteModule.tsx / .module.css        # Module 10 — Reconnaître l'alerte (carte VITE, seul objet neuf du
                                                     # thème, + infarctus + bandeau 15 ; aucune mention d'aspirine, gate G1)
      traitements/TraitementsModule.tsx / .module.css / data.ts  # Module 11 — Mes traitements qui protègent
                                                     # (ordonnance ↔ silhouette protégée ; aspirine retirée de la table)
      suivi/SuiviModule.tsx / .module.css          # Module 12 — Mon suivi (« mes 3 chiffres » + grille de voyants,
                                                     # jamais de rouge — alternative allégée au cadran annuel diabète)
docs/
  architecture.md
  BRIEF_TABAC.md               # brief design & pédagogie tabac (Fable, 2026-07-09) — §2 fiches rétroactives des 7
                                # modules existants, §3 spécification normative des extensions X1-X7
  contenu-modules-tabac.md    # autorité du contenu médical, thème tabac (fichier unique)
  diabete/                    # autorité du contenu médical, thème diabète (cadrage en cours)
    00-global.md               # grammaire commune, vue d'ensemble des 8 modules, journal des décisions
    09-insuline-basale.md      # doc d'autorité module 9 (rôle de la lente + régularité/horaire),
                                # créé S1 chantier insuline-affinements-2026-07, validé Thibault (G1)
    10-insuline-rapide.md      # doc d'autorité module 10 ; section « rapide sans repas » (temps ⑤)
                                # ajoutée S1 chantier insuline-affinements-2026-07, validée Thibault (G1)
    module-1-cest-quoi-le-diabete.md
    module-2-alimentation.md
    module-3-activite-physique.md
    module-4-risque-cardiovasculaire.md
    modules-5-8-cadrage.md    # modules 5-8, cadrés mais pas encore détaillés écran par écran
  cardio/                     # autorité du contenu médical, thème cardio (prévention primaire)
    CONTENU_cardio.md          # contenu clinique des 12 modules — message écran/2ᵉ niveau/calibrage/pièges/
                                # sources par module, validé gate G1 (Thibault, 2026-07-22)
    BRIEF_DESIGN_cardio.md      # brief design écran par écran (le *quoi*) transmis à Claude Design
    evidence-cardio/            # rapports de synthèse OpenEvidence (le *pourquoi*, sources probantes brutes)
      2026-07-21-rapport-openevidence-cardio-socle.md
      2026-07-21-rapport-openevidence-cardio-complement.md
  evidence-diabete/           # rapports de synthèse OpenEvidence (sources probantes brutes, thème diabète)
  evidence-tabac/             # rapports de synthèse OpenEvidence (sources probantes brutes, thème tabac)
    2026-07-10-rapport-openevidence-sevrage.md  # stratégies comportementales du sevrage — autorité chiffrée
                                                 # du Module 6 (Stratégies & outils) ; chiffres jamais à l'écran
plans/
  enrichissement-visuel-2026-07/  # EN COURS (non clos) : finition visuelle & garde-manger (issu de l'audit 2026-07-23) — 5 commits consolidés S1-S4+V0-bis, 2 sessions bloquées (S5 G-familles, S6 PNG), validation visuelle Thibault à faire — cf. VALIDATION.md
  theme-cardio-2026-07/       # EN COURS (non clos) : 3ᵉ thème cardio, 12 modules câblés + gates auto vertes,
                                # validation visuelle Thibault des modules M4-M12 restant à faire (pilote
                                # M1-M3 déjà validé) — cf. VALIDATION.md
  # un dossier par chantier EN COURS (index.md + S<n>.md) ; le détail de chaque chantier clos
  # est synthétisé dans STATUS.md/TASKS.md puis le dossier est purgé (historique → git log,
  # cf. commit "chore: purge des dossiers plans/ des chantiers déjà clos", 2026-07-11)
  aide-patient/
    index.md    # cadrage complet (2026-07-13) de la future app patient autonome (2ᵉ surface applicative,
                # bundle Vite séparé, contenu générique, v1 « Mes substituts » + « Agir face à une
                # situation », QR unique) — sorti de corrections-audit-tabac (T16) ; chantier séparé,
                # sessions P1-P6 à écrire au lancement, non démarré
STATUS.md / VALIDATION.md / PROJECT_MAP.md
```

---

## Features principales

### Feature 1 — Sélection de thème + carte / menu central
Rôle : choisir un thème (si plusieurs existent) puis présenter les modules de ce thème, navigation libre non-linéaire.
Fichiers clés : `src/components/ThemeSelector.tsx`, `src/components/Home.tsx`, `src/components/ModuleCard.tsx`, `src/App.tsx`.
Points de vigilance : doit rester lisible à distance, gros éléments cliquables ; `ThemeSelector` ne s'affiche que si `THEMES.length > 1`.

### Feature 2 — Coquille de module générique
Rôle : `App.tsx` rend `ModuleShell` (titre + retour + `Sources`) autour du module sélectionné ; les modules ne rendent QUE leur contenu interactif et reçoivent `onNavigate`.
Fichiers clés : `src/components/ModuleShell.tsx`, `src/components/Sources.tsx`, `src/features/types.ts`.
Points de vigilance : généricité = clé de la réutilisation multi-thèmes ; aucun module ne duplique son propre en-tête.

### Feature 3 — Modules du thème tabac
Rôle : le contenu interactif des 10 modules (addiction, nicotine, substituts, nicotine-toxique,
soulagement, boite-a-outils, motivation, plan-arret, benefices-arret, idees-recues). `boite-a-outils`
remplace `craving` depuis le 2026-07-10 (chantier `plans/boite-a-outils/`, BO1-BO2) — le dossier
`craving/` a été supprimé après déplacement de son code (vague/4D) dans `boite-a-outils/VagueCraving.tsx`.
Fichiers clés : `src/features/tabac/<slug>/`, `src/features/tabac/situations.ts` (situations partagées
Addiction ↔ Stratégies & outils), contenu source dans `docs/contenu-modules-tabac.md` (mécaniques +
niveaux de preuve qualitatifs), `docs/evidence-tabac/` (rapports OpenEvidence, chiffres bruts jamais à
l'écran) et `docs/BRIEF_TABAC.md` (design/pédagogie + extensions X1-X7).
Points de vigilance : exactitude médicale, sources affichables (via `registry.ts` → `sources?: string[]`), sobriété visuelle, aucun dosage chiffré pour les substituts, aucun chiffre d'étude brut (OR/SMD/RR) côté patient.

### Feature 3bis — Fiches à emporter, portes de fin de module, fil rouge (extensions X1-X7 + BO2)
Rôle : `FicheOverlay` compose et imprime à la volée une feuille A4 (5 fiches : **Ma carte anti-envie**
— attachée à l'outil vague/4D de Stratégies & outils —, **Ma boîte à outils** — nouvelle, BO2 —, méthode
patch, mes raisons, mon plan d'arrêt), zéro persistance ; `ModuleFooterNav` câble des portes optionnelles
en pied de modules (dont Stratégies & outils → Plan d'arrêt/Motivation depuis BO2) ; le fil rouge du
thème (`ThemeDef.exergue`) s'affiche en exergue d'accueil et en clôture des 4 modules « Comprendre » ;
`InfoHover` généralise le tooltip de zone pour un 2ᵉ niveau de lecture, créé mais non câblé tant
qu'aucun contenu n'est validé par Thibault.
Fichiers clés : `src/components/FicheOverlay.tsx`, `src/components/ModuleFooterNav.tsx`,
`src/components/InfoHover.tsx`, `src/features/tabac/plan-arret/PlanArretModule.tsx`, `docs/BRIEF_TABAC.md`.
Points de vigilance : composants génériques, agnostiques du thème (aucun contenu en dur) ; les portes ne
sont jamais un enchaînement forcé ; ne pas câbler `InfoHover` sans validation Thibault (§5 du brief).

### Feature 3ter — État de sélection partagé + livret d'accompagnement (S10-S11, corrections-audit-tabac, 2026-07-13)
Rôle : les sélections faites dans les modules tabac (situations, forme de substitut, outils « Dans ma
fiche », raisons) survivent désormais à la navigation entre modules (perdues auparavant, chaque module
avait son state local isolé) via un état **en mémoire**, partagé et lu/écrit par « Mon plan d'arrêt » ; ces
mêmes sélections sont ensuite assemblées en un livret d'accompagnement imprimable multi-pages A4 (remplace
l'ancienne fiche récap texte de « Mon plan d'arrêt »).
Fichiers clés : `src/state/SelectionContext.tsx` (Provider générique par `themeId` + `useSelection()`,
monté dans `App.tsx`), `src/components/PrintableLivret.tsx`, `src/features/tabac/plan-arret/
livretSections.tsx` (contrat `PrintableSection` + `buildLivretSections`), `src/features/tabac/substituts/
data.ts` et `src/features/tabac/motivation/data.ts` (contenu factorisé, consommé par les modules **et** le
livret).
Points de vigilance : **zéro persistance** (Context React uniquement, jamais localStorage/sessionStorage/
cookies — se réinitialise à un rechargement de page, c'est voulu) ; le livret est une **proposition livrée
sans validation visuelle** (cf. `VALIDATION.md` §S11), à considérer comme un brouillon tant que Thibault ne
l'a pas revu à l'écran.

### Feature 4 — Thème diabète (scaffold, cadrage en cours)
Rôle : place réservée pour le 2e thème. `src/features/diabete/registry.ts` exporte `MODULES: []` ; le thème apparaît dans `ThemeSelector` avec un badge « Bientôt disponible » (non cliquable). Le cadrage clinique (4 modules sur 8 déjà spécifiés en détail) avance dans `docs/diabete/`, avant tout câblage.
Fichiers clés : `src/features/diabete/registry.ts`, `docs/diabete/00-global.md` (index + grammaire commune), `docs/diabete/module-*.md`, `docs/evidence-diabete/` (sources probantes brutes).
Points de vigilance : ne pas ajouter de module au registre avant le cadrage clinique complet avec Thibault (cf. `docs/diabete/00-global.md`, table de statut par module).

### Feature 4bis — App d'aide patient autonome (chantier aide-patient S1-S5, 2026-07-13, gates verts)
Rôle : 2ᵉ surface applicative, atteinte par un QR code posé sur les fiches/le livret, offrant au patient
**seul** (chez lui, sans soignant) « Mes substituts » (comment les utiliser) et « Agir face à une situation »
(situation → outils). Bundle Vite **séparé** de l'app de consultation (2ᵉ point d'entrée `patient.html`/
`src/patient/main.tsx`), contenu générique consommé via la couche `src/content/tabac/` partagée (source
unique, créée en S1), zéro donnée patient dans l'URL/le build/un serveur, zéro dépendance runtime ajoutée.
Fichiers clés (créés S1-S5) : `patient.html`, `src/patient/{main.tsx, PatientApp.tsx, Home.tsx,
substituts/PatientSubstituts.tsx, situations/PatientSituations.tsx}`, `src/content/patientAppUrl.ts`,
`public/qr/patient.png`, composant `QRBlock` réutilisé par fiches/livret, `vite.config.ts` (2ᵉ entrée via
`build.rollupOptions.input`). Depuis 2026-07-21 (chantier outils-interactifs-2026-07) :
`src/patient/situations/usePatientStore.ts` (adaptateur `OutilStore` sur `localStorage`, clés
`etp.tabac.<outil.id>`, miroir `useState` pour re-render) + câblage générique des outils interactifs dans
`PatientSituations.tsx` (bouton « Démarrer » dès qu'un outil a un `interactif` mappé dans le registre).
**Chantier revue-prod-2026-07 (2026-07-21)** : RP1 — `PatientSituations.tsx` corrigé, le bouton
« Démarrer » ne faisait rien pour tout outil hors overlay `position: fixed` (l'outil se montait sous la
liste, jamais visible) ; adopte désormais le schéma *early-return* de la consultation (l'outil actif
remplace la liste). RP3a — `QRBlock.tsx` reformulé (ne promet plus « mes substituts et mes parades »,
libellé sobre « Retrouvez l'application et ses outils chez vous »), seule source de vérité du texte
(fiches individuelles + livret).
Points de vigilance : le graphe d'import de l'entrée patient ne doit **jamais** atteindre un **module** de
consultation (séparation physique du code, vérifiée grep post-build) ; textes reformulés en « voix
patient » (comment faire, pas comment le proposer), marqués `// à revalider (Thibault)` ; **validation
VISUELLE** (Thibault, `npm run dev` sur les deux apps) toujours attendue avant push (cf. `VALIDATION.md`).
**Amendement 2026-07-21** (cf. `DECISIONS.md`) : l'interdiction stricte « jamais `src/features/**` depuis
le bundle patient » est assouplie pour le seul registre partagé des outils interactifs
(`src/features/tabac/boite-a-outils/outils-interactifs/registry.ts` + `types.ts`) — conséquence assumée
de la gate G1 (tous les outils interactifs exposés côté patient) et du registre unique consommé par les
deux bundles ; `PatientSituations.tsx`/`usePatientStore.ts` importent désormais ce sous-arbre précis,
mais jamais un module de consultation ni le moteur de navigation.

---

### Feature 5 — Thème cardio (« Prévention cardiovasculaire », theme-cardio-2026-07, non clos)
Rôle : 3ᵉ thème du moteur (après tabac, diabète), prévention **primaire** uniquement (secondaire hors v1).
12 modules en 3 familles (Comprendre : artère/risque/territoires · Agir : tension/cholestérol/tabac/bouger/
manger/leviers · Se soigner : alerte/traitements/suivi). 4 des 5 objets-héros du brief réutilisent la
grammaire diabète (artère/plaque, silhouette, feux, « mes 3 chiffres ») ; seul objet neuf : la carte-réflexe
**VITE** (module 10). Contenu clinique sourcé et **validé (gate G1, Thibault, 2026-07-22)** avant tout
câblage — 6 arbitrages structurants : jamais de cible LDL/tension chiffrée à l'écran (seuils modulés selon
le risque CV), AMT < 135/85 conservé, sel/alcool = messages qualitatifs sourcés (SPF), **aucune mention
d'aspirine** (modules 10/11, sûreté AVC hémorragique), « mes 3 chiffres » retenu pour le suivi (pas le
cadran annuel du diabète).
Fichiers clés : `src/features/cardio/registry.ts`, `src/features/cardio/lib/risqueCardio.ts` (cumul
**multiplicatif** des facteurs testé, 21 invariants), `src/features/cardio/components/` (`ArtereCoupe`,
`CockpitFeux`, `Silhouette`, `IllustrationSlot` — cardio-owned, découplés du diabète), `docs/cardio/`
(brief, evidence, `CONTENU_cardio.md`), `plans/theme-cardio-2026-07/`.
Points de vigilance : **chantier non clos** — pilote M1-M3 validé visuellement (silhouette M3 recalée à
560 px, alignée sur l'anatomie du Risque CV diabète), **M4-M12 restent à valider à l'écran** (cf.
`VALIDATION.md`) ; fréquences de suivi du module 12 à confirmer par Thibault auprès de l'HAS (non
bloquant) ; porte inter-thèmes réelle (M2→diabète, M6→tabac) et généralisation des composants cardio dans
`src/components/` jugées **hors v1** (repli visuel suffit, gates tranchées avec Thibault) ; assets neufs
(pictos VITE, signes infarctus, artère tabac 2 états, brassard) pas encore générés — placeholders natifs,
non bloquant.

---

## Fichiers transversaux importants
- Configuration : `vite.config.ts`, `tsconfig*.json`, `package.json` (scripts `dev`/`build`/`test`)
- Navigation : état local dans `src/App.tsx` (pas de router)
- État global : minimal, **éphémère uniquement** (pas de persistance ; pas de localStorage) — `src/state/SelectionContext.tsx` (thème tabac, Context React monté dans `App.tsx`, depuis S10 corrections-audit-tabac 2026-07-13). Depuis 2026-07-21 (outils-interactifs-2026-07) : champ `outilsData: Record<string, string[]>` (données perso des outils interactifs, clé = `outil.id`), exposé via `useSelection().setOutilData` et lu par `useConsultationStore()` (`src/features/tabac/boite-a-outils/outils-interactifs/useConsultationStore.ts`) — l'adaptateur `OutilStore` consommé par tout composant du registre `OUTILS_INTERACTIFS` côté consultation ; pendant patient : `usePatientStore()` (`src/patient/situations/usePatientStore.ts`) sur `localStorage`.
- API / persistance : **aucune** (décision structurante)
- UI partagée : `src/components/`
- Logique pure testée : `src/features/tabac/lib/nicotineCurve.ts` (Vitest) — spécifique au thème tabac, pas un utilitaire du moteur générique

---

## Zones à risque ou coûteuses en contexte IA
- Le moteur de module générique (impacte tous les modules et tous les thèmes) — à concevoir proprement une fois.

---

## Règles locales importantes
- **Jamais de persistance de données** (ni localStorage, ni cookies, ni envoi réseau).
- Contenu médical **sourcé** (HAS, Tabac Info Service et équivalents) et affichable dans le module.
- Garder l'interactivité (≠ diaporama) et la sobriété visuelle.
- Préserver la généricité multi-thèmes (ne pas coder « en dur » pour un thème dans le moteur : `src/components/`, `src/features/types.ts`, `src/features/registry.ts`).

---

## Comment choisir les fichiers à fournir à ChatGPT
- Produit / architecture : `PROJECT_BRIEF.md`, `STATUS.md`, `ROADMAP.md`, `PROJECT_MAP.md`
- Contenu d'un module : `docs/contenu-modules-<theme>.md` + le dossier `features/<theme>/<module>/`
- Bug : `STATUS.md`, `PROJECT_MAP.md`, logs, fichiers concernés
