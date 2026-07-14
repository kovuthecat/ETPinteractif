# Plan — Corrections revue guidée (Tabac A-D + Diabète E, 2026-07-13)   (rédigé par Opus)

> **Origine** : revue interactive de `etp-interactif.vercel.app` guidée par Thibault (auteur de l'app),
> reconstruite dans [`rapport-ameliorations-etp-interactif.md`](../../rapport-ameliorations-etp-interactif.md)
> (13 points, blocs A-E, valeurs de courbe mesurées sur les `d` des `<path>`). Passe **par-dessus** tout ce
> qui est déjà déployé : `HEAD = origin/main`, working tree **propre**, dernier commit `88b2574` (consolidation
> S6 du chantier `aide-patient`, 2026-07-13). L'audit reflète donc l'état **post-`corrections-audit-tabac`** et
> **post-`aide-patient`** (couche partagée `src/content/tabac/` en place).
> **Autorités** : ce fichier · le rapport · `PROJECT_BRIEF.md` · `DECISIONS.md` · `CLAUDE.md` (invariants) ·
> `docs/contenu-modules-tabac.md` (clinique tabac) · `docs/diabete/10-insuline-rapide.md` (clinique insuline
> rapide, autorité du bloc E) · `../Templates/WORKFLOW.md` (format des plans).
> **Exécutant** : **Sonnet** par défaut ; **Opus** pour S1 (refonte d'interaction), S4 (feature + contenu) et
> S5 (refonte du modèle pédagogique). Un lot = une session.
> **Règle de validation** : **jamais** de navigateur/Playwright côté Claude. Chaque session =
> `npx tsc --noEmit` + `npm run build` + `npm test` verts + checklist **visuelle** consignée dans son propre
> `S<n>.md` + `VALIDATION.md` (validée par Thibault à l'écran, `npm run dev`). Cf. `[[feedback_validation_visuelle]]`.

## Objectif d'ensemble

Traiter les 13 points de la revue guidée. Quatre natures de travail : **refonte d'interaction** d'un module
tabac (A — « Ce que l'arrêt répare », nav par silhouette), **retouches UX/visibilité** (B, C, point 13-bug),
une **feature de contenu** (D — stratégie d'arrêt), et surtout la **cohérence pédagogique des courbes
d'insuline rapide** (E — le modèle actuel ne dépend que de la dose, jamais de la charge du repas). Les courbes
diabète sont **générées** par `src/features/diabete/lib/glycemieCurve.ts` (pas de `d` codés en dur) : les
corrections E portent sur le **modèle**, pas sur du SVG figé.

## Décisions de Thibault (tranchées — reprises du rapport)

1. **A / double navigation temps + organes (points 2-4, tranché 2026-07-14).** « Ce que l'arrêt répare » **garde
   la narration temporelle** mais remplace la barre de **chips** + flèches + compteur « Étape X/N » par une **frise
   chronologique visuelle à hotspots** (axe 20 min → 10-15 ans, chaque jalon = un point cliquable). Cliquer un
   jalon pilote l'allumage des organes (comme aujourd'hui) ; cliquer un **organe** ouvre son détail (bénéfices
   datés). Les **cercles blancs** disparaissent : la silhouette passe en **mode hotspot** avec le PNG **anatomique**
   (celui du module Diabète « Complications »). On conserve donc `jalonIndex` + le panneau par défaut, on ne change
   que l'**UI de la frise** (chips → frise à hotspots) et le **rendu de la silhouette** (pastilles → hotspots).
2. **Réutilisation propre de la silhouette (technique, point 4 tranché 2026-07-14).** `SilhouetteCorps`
   (`src/components/`, générique) sait **déjà** rendre une image de fond en **mode hotspot** (prop `bodyImage` →
   boutons transparents + halo, **aucun cercle permanent**) — c'est le mode qu'utilise le wrapper diabète. Le point
   4 se règle en passant à benefices-arret le **PNG anatomique** + ses **propres ancres tabac**, **sans importer**
   le wrapper diabète (qui code en dur les zones diabète) ni casser la généricité multi-thèmes (invariant 4).
   **Option la plus stable retenue** : **copier** l'asset dans un chemin **tabac dédié**
   (`public/illustrations/tabac/silhouette-corps.png`) plutôt que pointer `illustrations/diabete/…` — le module
   tabac **possède** son asset et ne casse pas si la silhouette diabète évolue/déménage (découplage inter-thèmes).
3. **E / modèle « dose habituelle » (point 11).** « Dose habituelle » = dose **fixe calibrée pour un repas
   moyen**, jamais recalée sur la charge. Le résultat devient fonction de l'écart **(dose − glucides)** et non de
   l'index de dose seul. Cible : Peu+Habituelle → **hypo** ; Beaucoup+Habituelle → **reste haut**.
4. **Zéro persistance, zéro dépendance runtime** (invariants 1-3) inchangés : aucune correction n'introduit de
   stockage ni de librairie. Le point 9 (stratégie d'arrêt) reste **en mémoire** (`SelectionContext`, jamais
   localStorage).
5. **Contenu clinique modifié → `// à revalider (Thibault)`.** Concerne les messages/courbes E (S5) et le libellé
   de plan selon la stratégie (S4). Le contenu du module 10 attend encore une **relecture finale** de Thibault
   (`PROJECT_MAP` → `docs/diabete/10-insuline-rapide.md`).

## État git / déploiement (2026-07-13, vérifié)

`HEAD = origin/main`, **working tree propre**, **0 commit non pushé**. Le chantier `aide-patient` (S1-S6) est
**committé et déployé** (dont `e8f24a4` : couche partagée `src/content/tabac/` — que touche S3/point 8). Déployé =
code committé actuel.

## Mapping rapport → sessions

| Point(s) | Bloc / écran | Session |
| --- | --- | --- |
| 1, 2, 3, 4, 5 | A — « Ce que l'arrêt répare » : retrait étape/chips/cercles, silhouette anatomique, illustration détail | **S1** |
| 6 | B — Substituts : technique de prise vapoteuse visible sans scroller | **S2** |
| 7, 8 | C — Stratégies & outils : retrait toggle grille + lien « inscrire dans mon plan » redondant | **S3** |
| 9 | D — Mon plan d'arrêt : choix « Arrêt complet / Réduction progressive » | **S4** |
| 11, 12, 13 | E — Insuline rapide : cohérence pédagogique des courbes (couvrir / corriger / cumul) + visibilité | **S5** |
| 10 | E — Insuline rapide : harmonisation de présentation (encadré situation→réponse→résultat) | **S6** |
| — | Consolidation (contexte + commits) | **S7** |

## Sessions

| Session | Points | Titre | Modèle | Effort | Dépend de | Zone modifiée (« Modifier ») | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | 1-5 | « Ce que l'arrêt répare » : nav par silhouette (hotspot) + illustration détail | Opus | xhigh | — | `tabac/benefices-arret/**` (+ éventuellement `components/SilhouetteCorps.*`, `public/illustrations/`) | [x] |
| [S2](S2.md) | 6 | Substituts : technique de prise vapoteuse visible sans scroller | Sonnet | medium | — | `tabac/substituts/SubstitutsModule.tsx` (+ `.module.css`, `TechniqueIllustration.tsx`) | [x] |
| [S3](S3.md) | 7, 8 | Boîte à outils : retrait toggle grille + lien plan redondant | Sonnet | low | — | `tabac/boite-a-outils/BoiteAOutilsModule.tsx` (+ `.module.css`), `src/content/tabac/outils.ts` | [x] |
| [S4](S4.md) | 9 | Plan d'arrêt : sélecteur de stratégie (arrêt complet / réduction) | Opus | high | — | `tabac/plan-arret/**` (+ éventuellement `state/SelectionContext.tsx`) | [x] |
| [S5](S5.md) | 11, 12, 13 | Insuline rapide : cohérence pédagogique des courbes + visibilité | Opus | xhigh | — | `diabete/insuline-rapide/**`, `diabete/lib/glycemieCurve.ts` (+ `.test.ts`) | [x] |
| [S6](S6.md) | 10 | Insuline rapide : harmonisation de présentation (encadré) | Sonnet | medium | S5 | `diabete/insuline-rapide/InsulineRapideModule.tsx` (+ `.module.css`) | [x] |
| [S7](S7.md) | — | Consolidation : contexte + commits tâche par tâche + push | Haiku | minimal | tout | STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP/index | [x] |

## Ordonnancement

- **Vague 1 — parallélisable (5 agents, zones disjointes)** : **S1 · S2 · S3 · S4 · S5**. Chaque session touche
  un module/dossier distinct → aucune collision. S3 touche `src/content/tabac/outils.ts` et S4 peut toucher
  `src/state/SelectionContext.tsx`, mais **aucune autre session** ne touche ces fichiers partagés → toujours
  disjoint.
- **Vague 2 — solo** : **S6**. **Dépend de S5** car elle re-touche le **même fichier** (`InsulineRapideModule.tsx`) :
  harmoniser l'encadré après que la logique des courbes est stabilisée.
- **Vague 3 — consolidation** : **S7** (commits tâche par tâche, contexte, un seul push).

```
V1: S1 S2 S3 S4 S5   (parallèle, zones disjointes)
V2: S6               (solo, après S5 — même fichier InsulineRapideModule.tsx)
V3: S7               (consolidation)
```

## Gates humaines (bloquantes)

- **Après chaque session** : validation visuelle Thibault (`npm run dev`, checklist dans le `S<n>.md` +
  `VALIDATION.md`). Les px/tailles/valeurs de courbe donnés sont des **points de départ à caler à l'œil**.
- **Avant S1** : design retenu (tranché 2026-07-14) = **frise chronologique à hotspots** (temps conservé) +
  silhouette anatomique hotspot ; v1-directe (précédent `aide-patient` §Maquette : composition depuis le design
  system existant, la validation visuelle sert de filet). Thibault peut demander une **maquette Claude Design**
  avant S1 s'il veut cadrer le **visuel de la frise** d'abord.
- **Pendant S4** : le contenu du plan selon la stratégie « Réduction progressive » est une **proposition
  clinique** → `// à revalider (Thibault)` ; ne rien affirmer de médical sans source (invariant 5).
- **Pendant S5** : les nouvelles valeurs de courbe/messages sont `// à revalider` ; c'est la validation visuelle
  qui tranche (creux dans le vert, etc.), pas Claude.

## Garde-fous (toutes sessions)

- **Zéro persistance** (point 9 = `SelectionContext` en mémoire, jamais localStorage/cookies/réseau). **Zéro
  dépendance runtime ajoutée** — `lucide-react` déjà présent. Aucune correction n'ajoute de librairie.
- **Moteur thème-agnostique** (`src/components/`, `features/types.ts`, `features/registry.ts`) : S1 réutilise
  `SilhouetteCorps` via sa prop générique `bodyImage`, **sans** coder un thème en dur ni importer le wrapper
  diabète ; ne pas régresser la généricité (le composant sert les 2 thèmes).
- **`src/content/tabac/` = source unique** (consommée par consultation **ET** app patient) : S3/point 8 modifie
  `outils.ts` → **vérifier** que l'écran patient « Agir face à une situation » ne dépend pas du `renvoi` retiré.
- **Courbes E = modèle, jamais `d` figé** : passer par `glycemieCurve.ts` / les paramètres du module, ne pas
  bricoler des `path` en dur. Aucun chiffre (dose/minutes/glycémie) à l'écran — paliers qualitatifs only.
- **Contenu médical** ajouté/refondu → `// à revalider (Thibault)`. Cibles interactives ≥ 44 px.
- **Validation visuelle = humaine.** Ne jamais prétendre avoir vu le rendu.

## Décisions complémentaires (tranchées avec Thibault, 2026-07-14)

- **Point 2 — narration temporelle conservée.** On **garde** la dimension temporelle, mais la barre de chips
  devient une **frise chronologique visuelle à hotspots** (voir §Décision 1). → S1 · T2-A réécrite en ce sens.
- **Point 4 — asset le plus stable = copie tabac.** L'asset anatomique est **copié** vers
  `public/illustrations/tabac/silhouette-corps.png` (module tabac propriétaire, aucun couplage au diabète). → S1 · T3-A.
- **Point 8 — retirer les DEUX renvois vers le plan** (`outils.ts` L58 « Les inscrire… » **et** L194 « Le
  préparer… »). → S3 · T2-C.
- **Point 9 — libellés seuls.** Le sélecteur de stratégie n'adapte **que les libellés** ; aucune génération de
  protocole/paliers, aucun changement de contenu du livret. → S4 · T1-D.

## Statut du chantier

[x] **Terminé et validé (2026-07-14).** Vague 1 (S1·S2·S3·S4·S5) et Vague 2 (S6) exécutées en parallèle
multi-agent, `tsc`+`build`+`test` (96/96) verts, **validées visuellement par Thibault** (`npm run dev`). Trois
correctifs de séance intégrés (courbes temps ④ « pic marqué + départ commun » via `excesGate` en lib ; les 4D
activés un par un ; **Insuline basale en écran unique** — abandon des onglets, rapide restant la référence).
Consolidation S7 (contexte + commits par zone + push) exécutée par l'orchestrateur. Constantes de courbe/stratégie
`// à revalider (Thibault)` restant à valider cliniquement (cf. `DECISIONS.md` 2026-07-14).
