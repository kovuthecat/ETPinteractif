# Plan P1 — Corrections de la revue d'usage (T-U1 à T-U9)   (rédigé par Opus)

Workflow : v0.61.0
Preuve N0 : requise

## Objectif d'ensemble
Corriger les 26 bloquants et 67 des 69 majeurs de la revue d'usage (c-4-58 et c-4-59 passent au plan B, courbes) du 2026-10-06 (`docs/revues/2026-10-06-usage.md`), dans le périmètre fixé par `docs/decisions/2026-10-08-suites-revues-usage-et-courbes.md` (section « Plan A »). À la fin :
- l'app s'utilise entièrement au clavier ;
- ses fenêtres (dialogs) gardent le focus ;
- chaque écran a son titre ;
- rien ne déborde à 320 px ;
- les défauts fonctionnels majeurs sont corrigés dans les trois thèmes et dans l'app patient.

Les mineurs restent dans le rapport, sauf ceux corrigés par le même geste qu'un défaut traité.

**Risques du plan** :
- (comportemental) Confiner le focus dans les dialogs pourrait gêner l'impression lancée depuis l'un d'eux (livret, fiches). Réfuté si l'aperçu et l'impression restent identiques en N1 (S2).
- Relever le contraste du texte secondaire change sa teinte partout. Jugement N2 de Thibault (S9), qui n'arrête pas le plan.

## Sessions
| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut | Message de commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T1-T3 | Navigation et titres | Sonnet | medium | — | — | `src/App.tsx` `src/components/Home.tsx` `src/components/Home.module.css` `src/components/ModuleShell.tsx` `src/patient/PatientApp.tsx` `src/patient/substituts/PatientSubstituts.tsx` `src/patient/situations/PatientSituations.tsx` `src/features/tabac/substituts/SubstitutsModule.tsx` | [ ] | — |
| [S2](S2.md) | T1-T2 | Dialogs : focus confiné | Sonnet | medium | — | S1 | `src/components/useModalFocus.ts` (créé) `src/components/FicheOverlay.tsx` + `.module.css` `src/components/PrintableLivret.tsx` + `.module.css` `src/components/RespirationGuidee.tsx` `src/features/diabete/suivi/SuiviModule.tsx` | [x] | — |
| [S3](S3.md) | T1-T3 | Contrôles au clavier | Sonnet | high | — | S2 | `src/features/tabac/{nicotine,soulagement,motivation}/` `src/features/diabete/{alimentation,activite}/` `src/features/cardio/manger/` | [x] | — |
| [S4](S4.md) | T1-T2 | Onglets et états exposés | Sonnet | medium | — | S3 | `src/components/useTabsKeyboard.ts` + test (créés) ; onglets : Motivation, InsulineRapide, Hypoglycemie, Alimentation, Activite, Suivi (diabète), Alerte, Leviers, Manger ; états : `SilhouetteCorps.tsx`, Silhouette diabète/cardio, BeneficesArret, RisqueCardio, Complications, Territoires, `CockpitFeux.tsx`, `CourbeGlycemie.tsx`, `PatientSituations.tsx`, `NicotineModule.tsx` | [x] 2026-10-08 | — |
| [S5](S5.md) | T1-T3 | Fonctionnel tabac | Sonnet | medium | — | S4 | `src/features/tabac/{nicotine,motivation,benefices-arret,plan-arret}/` `src/features/tabac/boite-a-outils/BoiteAOutilsModule.tsx` `src/components/PrintableLivret.tsx` `src/state/SelectionContext.tsx` `public/illustrations/cardio/aliment-pates-blanches.png` (créé) | [x]! | — |
| [S6](S6.md) | T1-T3 | Fonctionnel diabète et cardio | Sonnet | high | — | S5 | `src/features/diabete/{suivi,traitements,activite,components}/` `src/features/cardio/{traitements,bouger,lib,manger,alerte}/` | [x] 2026-10-08 | — |
| [S7](S7.md) | T1-T2 | App patient et tirelire | Sonnet | medium | — | S6 | `src/patient/lib/storage.ts` `src/patient/lib/storage.test.ts` `src/patient/situations/usePatientStore.ts` `src/patient/Home.tsx` `src/patient/Home.module.css` `src/patient/carnet/PatientCarnet.tsx` `src/patient/substituts/PatientSubstituts.tsx` `src/features/tabac/boite-a-outils/outils-interactifs/Tirelire.tsx` `src/features/tabac/boite-a-outils/outils-interactifs/Tirelire.module.css` `src/features/tabac/boite-a-outils/outils-interactifs/tirelireCalcul.ts (créé)` `src/features/tabac/boite-a-outils/outils-interactifs/tirelireCalcul.test.ts (créé)` `src/content/tabac/substituts.ts` | [x] 2026-10-08 | — |
| [S8](S8.md) | T1-T2 | Débordements (320 px, mots longs) | Sonnet | medium | — | S7 | `src/styles/global.css` ; mots longs : Addiction, Motivation, PlanArret, `PlansSiAlors`, `PhraseRefus` ; reflow : CSS de PlanArret, RisqueCardio, `ModuleShell`, Traitements (diabète), InsulineRapide, Tension, Territoires, Tabac (cardio), `InfoHover` | [ ] | — |
| [S9](S9.md) | T1-T3 | Focus visible, cibles, contraste | Sonnet | medium | — | S8 | `src/styles/tokens.css` `src/styles/global.css` ; CSS de Nicotine, Tirelire, OutilChecklist, Traitements, Activite, InsulineRapide, `CourbeGlycemie`, `InfoHover`, Bouger, Suivi (cardio et diabète), Leviers, Addiction (+ `AddictionModule.tsx`) | [ ] | — |

<!-- Statut : [ ] à faire · [x] fait, revue sans bloquant · [x]! fait, revue à bloquant non trié -->

## Ordonnancement
Une session par vague, en séquence : plusieurs fichiers sont partagés d'une session à l'autre (MotivationModule, NicotineModule, SuiviModule, TraitementsModule, `global.css`). Ordre : la structure d'abord, puis le fonctionnel, puis le CSS. Les passes CSS jugent ainsi le balisage final, y compris ce que S5 à S7 ajoutent.

- **Vague 1** : S1.
  *Pourquoi maintenant* : S1 pose la navigation (historique patient, retour au sélecteur) sur laquelle S2 et S7 s'appuient.
  - **S1** — Chaque écran porte son propre titre d'onglet, et un bouton ramène de la carte au choix du thème. Un module s'ouvre en haut de page. Dans l'app patient, « précédent » revient à l'écran d'avant au lieu de quitter l'app.
- **Vague 2** : S2.
  *Pourquoi maintenant* : les 8 bloquants des fenêtres sont le plus gros lot de niveau A. Ils passent avant les retouches de modules, qui ouvrent ces fenêtres.
  - **S2** — Dans le livret, les fiches, la respiration et les autres fenêtres, la touche Tab reste dans la fenêtre et Échap la ferme. La feuille d'aperçu défile au clavier.
- **Vague 3** : S3.
  *Pourquoi maintenant* : S3 et S4 touchent les mêmes modules (motivation, alimentation, nicotine). Le clavier passe d'abord.
  - **S3** — On peut poser une cigarette sur les frises, déplacer les poignées des assiettes, régler les steppers d'Activité et classer les raisons de motivation au clavier seul.
- **Vague 4** : S4.
  *Pourquoi maintenant* : S4 finit la passe accessibilité structurelle avant que les sessions fonctionnelles ne touchent les mêmes fichiers.
  - **S4** — Les flèches déplacent vraiment le focus d'un onglet à l'autre, dans les 9 modules à onglets. Les zones de silhouette, les puces à 3 niveaux et les segments d'insuline annoncent leur état au lecteur d'écran.
- **Vague 5** : S5.
  *Pourquoi maintenant* : c'est le premier des trois lots fonctionnels. Il passe dans l'ordre des thèmes.
  - **S5** — Tabac. Les pastilles de légende ne posent plus de patch par erreur. Les deux images manquantes ne donnent plus de 404. Un titre vide est refusé. Le plan d'arrêt montre un récapitulatif, et le livret reprend la stratégie. Les outils retirés de la fiche ne reviennent plus.
- **Vague 6** : S6.
  *Pourquoi maintenant* : S6 réécrit le modèle du Suivi diabète, qui dépend de la porte « Ce que ça garde » corrigée en S2.
  - **S6** — Le Suivi diabète affiche la vraie fréquence de chaque examen, et cocher un rendez-vous ne coche plus les autres. Une molécule tapée librement ne reçoit plus d'affirmation thérapeutique. Les résultats et la consigne « appelez le 15 » apparaissent sans défiler.
- **Vague 7** : S7.
  *Pourquoi maintenant* : S7 touche la tirelire, partagée entre consultation et patient, et clôt le fonctionnel avant les passes CSS.
  - **S7** — La tirelire n'arrondit plus 6,5 et ne perd plus « Ma récompense » à la réouverture. Un bouton efface toutes les données de l'app patient. Les boutons du carnet se distinguent, et le renvoi mort « cf. titration » disparaît.
- **Vague 8** : S8.
  *Pourquoi maintenant* : S8 et S9 écrivent tous deux dans `global.css`. Le reflow passe d'abord, parce qu'il change la taille des contrôles que S9 mesure.
  - **S8** — À 320 px de large, aucun des 8 écrans signalés ne déborde plus, et un mot très long saisi par le patient passe à la ligne au lieu de sortir du cadre.
- **Vague 9** : S9.
  *Pourquoi maintenant* : c'est la dernière passe, faite sur le balisage final.
  - **S9** — Chaque champ et chaque contrôle montre où est le focus. Les petites cibles atteignent 24 px. Le texte secondaire passe le contraste 4,5:1, ce qui le rend un peu plus foncé partout (à juger par Thibault).
- **Vague 10 — clôture** : contexte (`STATUS.md`, `TASKS.md`, `VALIDATION.md`) et push. Pas de commits de code à rattraper : chaque session a commité les siens.
