# 2026-07-14 — Chantier `corrections-revue-guidee` (13 points, blocs A-E) : 6 décisions structurantes

### Décision ① — Silhouette anatomique tabac : mode hotspot générique réutilisé sans importer le wrapper diabète

**Décision**

`BeneficesArretModule.tsx` (module « Ce que l'arrêt répare ») passe la silhouette schématique + cercles
blancs en **silhouette anatomique en mode hotspot**, en consommant `SilhouetteCorps` (`src/components/`,
générique) via sa prop existante `bodyImage` — **sans jamais importer** `src/features/diabete/components/
Silhouette.tsx` (qui code en dur les zones diabète). L'asset anatomique est **copié** (pas référencé à
distance) vers un chemin **tabac dédié** : `public/illustrations/tabac/silhouette-corps.png` (copie de
`public/illustrations/diabete/silhouette.png`). Les 7 zones tabac récupèrent des ancres en **pourcentages**
(repère de l'image carrée), dans `benefices-arret/data.ts`.

**Contexte**

Point 2-4 de la revue guidée : narration temporelle conservée (frise, cf. Décision ⑥ ci-dessous) mais les
cercles blancs codés en dur devaient disparaître au profit d'une vraie silhouette anatomique — celle déjà
utilisée par le module diabète « Complications ».

**Raison du choix**

`SilhouetteCorps` savait déjà rendre ce mode (utilisé par le wrapper diabète) : aucune extension du
composant partagé nécessaire. Copier l'asset plutôt que pointer `illustrations/diabete/…` **découple** les
deux thèmes — le module tabac possède son propre fichier et ne casse pas si la silhouette diabète évolue ou
déménage, conforme à l'invariant 4 (multi-thèmes par conception, aucun thème en dur dans le moteur générique
ni de couplage inter-thèmes caché).

**Conséquences**

- Nouveau fichier `public/illustrations/tabac/silhouette-corps.png` (copie, ~26 Ko).
- `SilhouetteCorps.tsx` et le wrapper diabète restent strictement inchangés (retouche additive côté tabac
  uniquement).
- Ancres % calées à l'œil par Claude, `// à revalider (Thibault)` — validées visuellement le 2026-07-14,
  calage fin des organes laissé ouvert.

### Décision ② — Insuline rapide, temps ① : dose « habituelle » fixe, résultat = écart (dose − glucides)

**Décision**

La dose du temps ① « Couvrir le repas » n'est plus recalée sur la charge du repas
(`cran.params.charge * DOSE_FACTOR`) mais devient **fixe**, calibrée pour un repas moyen
(`DOSE_ADEQUATE * DOSE_FACTOR`), exactement comme le fait déjà le temps ③. Le résultat de la courbe suit
donc l'**écart (dose − glucides)** : Peu + Habituelle → hypo, Repas moyen + Habituelle → cible (seul cas
parfait), Beaucoup + Habituelle → reste haut (sans plonger). `messageCouvrir` devient une matrice à 9 cases
(repas × dose).

**Contexte**

Point 11 de la revue guidée : le modèle antérieur faisait toujours coïncider dose et repas — « Dose
habituelle » couvrait **parfaitement** n'importe quelle charge, ce qui est pédagogiquement faux (masque
l'intérêt même d'ajuster la dose au repas).

**Raison du choix**

Aligner le temps ① sur la logique déjà saine du temps ③ (qui dépend bien des deux axes) plutôt que
d'inventer un nouveau mécanisme — cohérence interne du module.

**Conséquences**

- `REPAS_CRANS` recalé (`peu` 0.3→0.2, `beaucoup` 0.8→1.0) pour un contraste net avec une dose fixe ;
  `DOSE_ADEQUATE` 0.5→0.40.
- Répercussion en cascade sur le temps ③ (réglages fins : `DEPART_OPTIONS.haute` 30→45, `basse` −10→−7) et
  le temps ④ (recorrections passent par `doseCorrection: DOSE_ADEQUATE` explicite).
- Toutes les constantes `// à revalider (Thibault)` — rendu et sens validés visuellement le 2026-07-14,
  valeurs cliniques non tranchées.

### Décision ③ — `excesGate` : l'excès de glycémie du temps ④ devient gaté post-pic, pas un décalage constant

**Décision**

Correctif de séance (au-delà du plan initial) : dans `src/features/diabete/lib/glycemieCurve.ts`, une
nouvelle fonction `excesGate(params, t)` remplace le décalage constant qui portait jusque-là l'excès de la
situation « reste haute » (temps ④, `BolusParams.exces`). L'excès est désormais **nul avant/au pic** puis
monte après le retour du repas — ce qui permet aux deux courbes de base « redescend seule » / « reste
haute » (option sans dose ajoutée) de **partir identiques** (même repas, même dose de repas
`REPAS_CUMUL`/`DOSE_BASE_CUMUL`, montée commune vers un pic marqué dans le rouge) et de ne **diverger
qu'après le pic**.

**Contexte**

Retour visuel de Thibault sur S5 : la situation « reste haute » démarrait avec un **creux artificiel** au
tout début (dû au décalage constant qui relevait uniformément la courbe), ce qui ne correspondait à aucune
réalité physiologique et cassait la comparaison pédagogique avec « redescend seule ».

**Alternatives envisagées**

- Garder le décalage constant et recaler seulement son amplitude → rejeté : ne peut pas produire un départ
  **plat et identique** aux deux situations tout en gardant une divergence après le pic (le décalage agit
  dès `t=0`).

**Raison du choix**

`exces` n'est consommé **que** par `sampleRepasAvecBolus` (temps ④ insuline rapide) — gater son application
dans le temps est un levier lib chirurgical, sans impact sur les 8 autres modules diabète ni sur les autres
usages de `glycemieCurve.ts`.

**Conséquences**

- `glycemieCurve.test.ts` : les 4 invariants existants du point 12 passent inchangés + **1 nouvel
  invariant** « excès nul avant le pic » (96/96 tests verts au global).
- Constantes du module recalées (`REPAS_CUMUL`, `DOSE_BASE_CUMUL`, `DOSE_RECORRECTION`,
  `EXCES_SITUATION_B`, `RECORR_DELAIS`), toutes `// à revalider (Thibault)`.
- Docs de `exces`/`sampleRepasAvecBolus` mises à jour dans la lib.

### Décision ④ — Plan d'arrêt : stratégie en mémoire, libellés seuls, aucun protocole inventé

**Décision**

Le sélecteur de stratégie « Arrêt complet / Réduction progressive » (point 9) n'adapte **que les libellés**
de la section « 1. Ma date » (titre + aide de la date). Le champ `strategie: 'complet' | 'progressive' |
null` vit dans `SelectionContext`, **en mémoire uniquement** (jamais localStorage), inclus dans le reset.
Aucune génération de protocole, palier chiffré ou calendrier de réduction — le livret (`buildLivretSections`)
reste inchangé en v1.

**Contexte**

Point 9 de la revue guidée : les deux stratégies sont « également valables » (Thibault) mais aucun contenu
clinique de protocole de réduction n'a été fourni ni sourcé — inventer des paliers chiffrés violerait
l'invariant 5 (exactitude médicale, signaler plutôt qu'inventer).

**Raison du choix**

Portée v1 délibérément minimale : donner au patient le choix de nommer sa stratégie sans que Claude
n'invente de contenu médical non sourcé. Le livret inchangé évite de propager un texte non revalidé dans un
document imprimé.

**Conséquences**

- Tout texte affiché par ce sélecteur est annoté `// à revalider (Thibault)`.
- Extension future (protocole de réduction réel) possible sans casser l'API : le champ `strategie` existe
  déjà dans le contexte partagé.

### Décision ⑤ — Les 4D activés un par un, la vague de l'envie visible par défaut

**Décision**

Correctif de séance : dans `VagueCraving.tsx` (Boîte à outils), l'état `activeDs: Set<DKey>` (plusieurs D
affichables simultanément) devient `activeD: DKey | null` (un seul D actif à la fois). Par défaut, aucun D
n'est actif — la **vague de l'envie** est dégagée, entourée de 4 pastilles compactes (titres seuls). Cliquer
une pastille affiche son contenu **superposé sur la vague** ; re-cliquer la même pastille revient à la vague
seule.

**Contexte**

Retour visuel de Thibault : les 4 D affichés en permanence encombraient l'écran et masquaient la vague, qui
est l'élément pédagogique central de l'outil (montrer que l'envie monte puis redescend seule).

**Raison du choix**

Activation exclusive = même geste (clic sur une pastille) mais hiérarchie visuelle clarifiée : la vague
reste la référence constante, chaque D est une aide consultée ponctuellement, pas un mur de texte permanent.

**Conséquences**

- Contenu (`D_INFO`, fiche « Ma carte anti-envie ») strictement inchangé — retouche d'état/présentation
  uniquement.
- Pattern réutilisable si un futur outil a besoin d'un « détail exclusif superposé sur un visuel de
  référence ».

### Décision ⑥ — Insuline basale en écran unique : abandon des onglets (remplace l'alignement prévu sur la rapide)

**Décision**

Correctif de séance, décision Thibault : au lieu d'aligner la navigation de l'insuline **basale** sur les
onglets de l'insuline **rapide** (point 10 du rapport, idée initiale), les onglets de la basale sont
**entièrement retirés**. `InsulineModule.tsx` perd sa machinerie `tablist`/`tab`/`tabpanel` ; le bloc
« Décider » (situations → réponse → résultat) est désormais **toujours visible**, en un seul écran continu.
`scenarios.ts` (logique métier) reste **intact** ; l'insuline **rapide** demeure le module de référence pour
la présentation par onglets (S6 de ce même chantier a justement aligné la rapide sur le **patron visuel**
`.situationCard` de la basale — décision indépendante, toujours valide).

**Contexte**

En observant le rendu de S6 (encadré `.situationCard` posé sur la rapide, inspiré de la basale), Thibault a
jugé que les 2 « temps » de la basale n'étaient qu'un **découpage artificiel** : la courbe de glycémie était
de toute façon déjà visible en permanence dans les deux onglets, l'onglet n'apportait donc aucune valeur de
navigation réelle.

**Alternatives envisagées**

- Aligner la nav de la basale sur les 4 onglets de la rapide (idée initiale du point 10) → écartée en
  cours de séance : aurait ajouté de la structure là où Thibault a jugé qu'il fallait au contraire en
  retirer.

**Raison du choix**

Simplifier au lieu de complexifier : un seul écran continu réduit le nombre de clics et rend la courbe +
le bloc « Décider » visibles simultanément sans bascule d'onglet.

**Conséquences**

- `InsulineModule.module.css` : CSS d'onglets nettoyé (classes `tablist`/`tab`/`tabpanel` retirées).
- Prop `nav` de `ModuleShell` non passée par ce module (retour au chemin par défaut du shell).
- Aucune régression de logique : `scenarios.ts`, `AJUSTEMENT_RESULT`, la matrice `DECIDER_MATRICE`
  restent inchangés — retouche strictement présentation/navigation.
- Documente pour les futurs chantiers : « aligner deux modules visuellement » n'implique pas de leur
  imposer la **même** structure de navigation si l'un des deux n'en a pas besoin.

