# Plan refonte-audit-2026-07 — Suites de l'audit pédagogique des 3 thèmes   (rédigé par Opus)

## Objectif d'ensemble

Traiter les constats de l'**audit pédagogique critique** mené au navigateur in-app sur la prod
(`etp-interactif.vercel.app`) le 2026-07-23, consigné en deux rapports :
`Audit/audit-pedagogique-2026-07.md` (Tabac 10/10, Diabète 9/9, Cardio M1-M6+M11) et
`Audit/audit-pedagogique-2026-07-partie2.md` (Cardio M7-M12 + Insuline rapide diabète).

**Verdict de l'audit** : socle pédagogique solide, **aucun trou conceptuel majeur**, problèmes
concentrés et **majoritairement de forme ou de régression** — le meilleur scénario (peu de refontes
lourdes, beaucoup de correctifs rentables). Deux thèmes seulement appellent une **refonte pédagogique
ciblée** : Cardio M3 (objet trop pauvre) et Cardio M6 (ré-enrichir le mécanisme CV du tabac, décision
Thibault 2026-07-23).

Traçabilité : ids `A<n>` (findings d'audit). Source : audit bi-agents Opus + relecture/vérif code Opus,
2026-07-23.

## Réconciliation avec l'existant (vérifs code faites — à NE PAS refaire à l'aveugle)

Deux constats de l'audit ont été **vérifiés dans le code** avant planification, pour ne pas ouvrir un
chantier sur un faux positif :

| Constat audit | Vérif code | Décision |
| --- | --- | --- |
| Défi Qualité (Alimentation) : « aucune courbe tracée à la révélation » | **FAUX POSITIF** — `AlimentationModule.tsx:1037` rend bien `CourbeSection` (2 courbes) après `d2Revealed`, mais **sous** le bouton d'action → hors écran. La « zone vide » vue par l'auditeur = les courbes hors du pli. | Pas de bug de courbes. **Absorbé par A1** (layout). |
| Suivi : cases « Fait » pré-cochées sur les mois passés | **CONFIRMÉ, par conception** — `suivi/logic.ts:160` `statusForMonth()` renvoie `'fait'` pour tout `month < currentMonth`. La fiche pré-coche donc janvier/mai. | Question **produit** (G-Suivi), pas un bug. Voir §Gates. |

## Décisions structurantes (à consigner dans `DECISIONS.md` à la consolidation)

- **A1 — layout des modules à grand visuel (diabète).** Sur Complications, Suivi, Insuline basale, le
  visuel principal est *sticky*/pleine hauteur : il laisse une bande vide en haut et repousse les
  contrôles (détail organe, rangées d'examens, décisions de titration, bouton « Voir la fiche »,
  courbes du défi Qualité) sous le pli. **Correctif de forme, pas de contenu** : le visuel ne doit plus
  monopoliser la hauteur d'écran ; les contrôles restent atteignables sans chasse au scroll. Patron
  cible = colonne visuel + colonne contrôles côte à côte au desktop, empilé au mobile **avec les
  contrôles visibles sous le visuel dans le premier écran**. Aucun composant métier modifié.
- **A2/A3 — dette d'illustration (bloquée sur génération PNG Thibault).** M10 « Reconnaître l'alerte »
  est **100 % placeholders** (module de survie — le pire endroit) ; le garde-manger (partagé Cardio M8
  **et** Diabète Alimentation) a ~14 tuiles-texte à côté d'une minorité de vrais PNG. Les **prompts
  existent déjà** (`design/illustrations/prompts-illustrations-diabete.html` : pictos VITE/infarctus +
  17 aliments garde-manger, cf. STATUS S6). Le **câblage** (mapping id→PNG) est trivial une fois les
  PNG générés ; **ce chantier ne génère pas d'image** — il prépare le câblage (S8) et le laisse **en
  attente de Thibault**, comme l'actuelle S6 de `enrichissement-visuel-2026-07`.
- **A4 — Insuline basale, feedback des décisions.** Cliquer Baisser/Laisser/Monter la lente ne renvoie
  rien aujourd'hui : interaction morte au **cœur sécuritaire** du module. Ajouter (a) un état
  sélectionné visible, (b) une conséquence sur la courbe (ou un message de lecture), (c) le refrain
  **« on attend ~3 jours avant de rejuger »** + « dans le doute, on ne monte pas ». Contenu déjà cadré
  (`docs/diabete/09-insuline-basale.md`), aucun chiffre de dose.
- **A5 — Cardio M9, interactions décoratives.** Les 3 leviers « stress » (Activité/Relaxation/Lien
  social) et la check-list SAOS se cliquent sans rien révéler. Leur donner un **payoff réactif**
  (au moins une phrase-conseil par levier stress ; un message d'orientation quand ≥1 case SAOS cochée),
  **ou** les dégrader en simple affichage non-cliquable. Défaut : payoff réactif (sourcé `docs/cardio`).
- **A7 — Cardio M3 « Où l'accident frappe » (refonte partielle).** Aujourd'hui : un mot par organe
  (« Infarctus. »), aucun 2ᵉ niveau. En faire le **pivot** du thème : la **plaque partagée voyage** vers
  l'organe cliqué (réutilise le moteur d'artère/silhouette existant), une ligne de conséquence
  apparaît, et surtout le **message clé absent** — *« un seul ennemi, plusieurs adresses → les mêmes
  leviers protègent partout »* — avec renvoi vers la famille Agir (M4-M9). Pas de nouveau contenu
  clinique, réagencement + message.
- **A8 — Cardio M6 « Le tabac » (ré-enrichir — décision Thibault 2026-07-23).** Depuis le retrait de la
  frise (2026-07-23), le module n'est qu'une bascule 2 états. Le ré-enrichir avec un **objet
  démonstratif du mécanisme** par lequel le tabac abîme l'artère : agression de la paroi,
  vasoconstriction/spasme, accélération de la plaque, sur-risque de thrombose — **manipulable**
  (avant/après arrêt sur l'artère héros partagée), pas la frise retirée. **Contenu clinique à sourcer
  d'abord** (gate G-A8, mini-G1 sur `docs/cardio/CONTENU_cardio.md` + evidence) — ne pas inventer le
  mécanisme.
- **A10 — rétro-port de la barre de risque.** La barre « Risque faible → élevé » du cockpit Cardio M2
  rend la **multiplication** des facteurs plus lisible que le cockpit Diabète M4 (RCV). La rétro-porter
  côté diabète pour unifier par le haut, en réutilisant le composant cardio si possible (invariant 4 :
  le générique ne connaît pas le thème ; un composant partagé vit dans `src/components/`).

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | A1 | Layout des modules à grand visuel (Complications/Suivi/Insuline basale) | Sonnet | high | — | `diabete/complications`, `diabete/suivi`, `diabete/insuline` (+ css), éventuel patron partagé | [x] |
| [S2](S2.md) | A4 | Insuline basale : feedback des décisions + refrain « ~3 jours » | Sonnet | high | S1 (partage `diabete/insuline`) | `diabete/insuline` (+ css) | [x] |
| [S3](S3.md) | A5 | Cardio M9 : leviers stress + check-list SAOS réactifs | Sonnet | medium | — | `cardio/leviers` (+ css) | [x] |
| [S4](S4.md) | A6 | Micro-fixes groupés (tooltip feu, fiche M10, metformine, débordements, cadran, cibles) | Sonnet | medium | — | `diabete/risque-cardio`, `cardio/alerte`, `diabete/traitements`, `diabete/alimentation`, `diabete/suivi`, `diabete/activite`, `cardio/bouger` | [x] |
| [S5](S5.md) | A7 | Cardio M3 « Où l'accident frappe » : refonte partielle (plaque-pivot) | Opus | high | — | `cardio/territoires` (+ css) | [x] |
| [S6](S6.md) | A8 | Cardio M6 « Le tabac » : ré-enrichir le mécanisme CV (contenu d'abord) | Opus | high | — | `docs/cardio/CONTENU_cardio.md`, `cardio/tabac` (+ css) | [!] bloqué gate G-A8 (proposition contenu livrée, code non fait) |
| [S7](S7.md) | A10 | Rétro-port barre « Risque faible → élevé » vers cockpit diabète (RCV) | Sonnet | medium | — | `diabete/risque-cardio`, éventuel composant partagé `src/components/` | [x] |
| [S8](S8.md) | A2, A3 | Câblage illustrations M10 VITE + garde-manger (**bloqué : PNG Thibault**) | Sonnet | medium | PNG générés | `cardio/alerte`, `cardio/manger`/`diabete/alimentation` (mapping), `public/illustrations/` | [ ] BLOQUÉ |
| [S9](S9.md) | — | Consolidation (commits, statuts, contexte, push, redeploy) | Haiku | minimal | toutes | `STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP/index` | [x] |

## Ordonnancement

- **Vague 1 — parallélisable** (zones disjointes) : **S1** (complications/suivi + amorce insuline),
  **S3** (cardio leviers), **S4** (micro-fixes multi-modules), **S5** (cardio territoires),
  **S6** (cardio tabac), **S7** (diabète RCV). Attention aux deux chevauchements :
  - **S1 ↔ S2** partagent `diabete/insuline` → **séquencer S1 → S2** (S1 pose le layout, S2 ajoute le
    feedback dans le même module).
  - **S4 ↔ S7** touchent tous deux `diabete/risque-cardio` (S4 = tooltip « Objectif : », S7 = barre de
    risque) → **séquencer S4 → S7** (ou commit S4 sur le tooltip d'abord).
  - **S1 ↔ S4** touchent tous deux `diabete/suivi` (S1 = layout, S4 = cadran pâle) → zones CSS proches,
    **séquencer S1 → S4** sur ce fichier.
- **S8 reste hors vague** tant que les PNG ne sont pas générés par Thibault (comme l'actuelle S6 de
  `enrichissement-visuel-2026-07`). Le mapping id→asset peut être **écrit** mais laissé inerte
  (placeholders conservés) jusqu'à livraison des images.
- **Vague finale — consolidation** : **S9** (§4d WORKFLOW du template : commits tâche par tâche, staging
  explicite, statuts `index.md`/`TASKS.md`, `STATUS.md`/`VALIDATION.md`, entrées `DECISIONS.md`, un seul
  push ; **vérifier le redeploy Vercel** après push).

## Gates / décisions à valider (Thibault)

Les gates ne bloquent pas la Vague 1 : chaque session code le **défaut sobre** indiqué et marque les
points `// à revalider (Thibault)`. La consolidation (S9) fige les réponses.

- **G-A1 — patron de layout.** Défaut : colonne visuel + colonne contrôles au desktop, empilé au mobile
  avec contrôles dans le premier écran. Alternative : visuel réduit en flux normal (page qui scrolle
  proprement). À trancher sur rendu.
- **G-A4 — nature du feedback de titration.** Défaut : état sélectionné + correction de courbe (ou
  message de lecture si la courbe n'est pas pilotable) + refrain « on attend ~3 jours ». Le module
  doit-il *animer* la courbe corrigée ou se contenter d'un message ? À trancher sur rendu.
- **G-A5 — leviers stress / SAOS.** Défaut : payoff réactif (phrase-conseil par levier ; message
  d'orientation SAOS dès 1 case). Alternative : les dégrader en affichage non-cliquable.
- **G-A6a — libellé tooltip de feu (diabète RCV).** Défaut : préfixer la cible par « Objectif : … »
  (ex. « Objectif : 0 cigarette / jour ») pour qu'elle ne se lise pas comme la valeur actuelle.
- **G-A7 — ampleur de la refonte M3.** Défaut : enrichir en place (plaque-pivot + message). Alternative
  discutée dans l'audit : **fusionner M3 avec un autre module**. À trancher (défaut = garder M3 enrichi).
- **G-A8 — mécanisme CV du tabac à montrer (mini-G1).** Le contenu clinique (quels mécanismes, dans
  quel ordre, quelle réversibilité) doit être **validé avant tout code** sur `docs/cardio` + evidence.
  Aucun mécanisme inventé.
- **G-Suivi — pré-cochage des mois passés.** Aujourd'hui `statusForMonth()` marque `'fait'` tout mois
  antérieur au mois courant → la fiche pré-coche janvier/mai. Cela contredit-il « couverture, pas
  bilan » (ne pas présumer ce que le patient a fait) ? **Défaut proposé : repartir d'un état neutre**
  (mois passés = « à programmer » plutôt que « fait ») pour la fiche. À trancher — **hors périmètre code
  tant que non tranché** (capturé, pas planifié).
- **G-M10-nausées (clinique).** « Nausées isolées, sans autre signe » comme signe d'infarctus : arbitrage
  sensibilité/spécificité (risque de fausses alertes). Déjà `// à revalider` au doc — décision clinique
  Thibault, hors code.
- **G-M7-taille (cohérence).** « Poids / tour de taille » listé comme bénéfice de l'activité (M7) — à
  vérifier qu'il ne réintroduit pas le « tour de taille » retiré de M2 (décision cardio 2026-07-23).
  Correctif de libellé possible en S4 si tranché ; défaut = laissé tel quel, noté.

## Roadmap / hors périmètre (capturé, non planifié ici)

- **A9 — Cardio M1 « L'artère qui s'encrasse »** : diaporama narré (0 manipulation patient). Acceptable
  si assumé ; une micro-interaction (le patient fait avancer/reculer la plaque lui-même) l'alignerait
  sur la grammaire interactive du thème. **Optionnel**, non planifié.
- **Nicotine ≠ toxique / Vrai-faux (tabac)** : modules surtout narratifs, **assumés** — pas d'action.
- **Diabète M12 (Suivi) « 3 chiffres » cliquables** : les 3 chiffres sont un en-tête statique renvoyant
  aux 5 stations interactives ; les rendre eux-mêmes cliquables serait un plus, non prioritaire.

## Clôture

**Chantier consolidé le 2026-07-24.** 6 sessions sur 7 exécutées et codées : S1, S2, S3, S4, S5, S7 —
gate finale sur l'arbre cumulé vert (`tsc --noEmit` ✓, `npm run build` ✓, `npm test` 127/127 ✓). **S6
bloquée sur la gate contenu G-A8** : le doc `docs/cardio/CONTENU_cardio.md` §M6 ne couvrait que 2 des 5
étapes du mécanisme CV en registre patient — une proposition sourcée (OpenEvidence Socle §E.1/E.2) a été
écrite dans le doc, marquée `// à revalider (Thibault)`, mais l'objet interactif n'a **pas** été codé
(conforme à la consigne « ne pas inventer de mécanisme »). **S8 reste BLOQUÉE** (PNG non générés par
Thibault). Détail complet, gates tranchées/en attente et validation visuelle → `STATUS.md`/
`VALIDATION.md`/`DECISIONS.md`. 7 commits atomiques + 1 push effectués (cf. `git log`).
