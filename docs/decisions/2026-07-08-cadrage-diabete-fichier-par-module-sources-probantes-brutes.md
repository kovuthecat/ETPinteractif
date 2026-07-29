# 2026-07-08 — Cadrage diabète : fichier par module + sources probantes brutes

### Décision

Le stub `docs/contenu-modules-diabete.md` est remplacé par un dossier `docs/diabete/` : un fichier
`00-global.md` (grammaire commune, vue d'ensemble des 8 modules, journal des décisions) + un fichier
par module (`module-1-cest-quoi-le-diabete.md`, `module-2-alimentation.md`,
`module-3-activite-physique.md`, `module-4-risque-cardiovasculaire.md`, et un fichier groupé
`modules-5-8-cadrage.md` pour les 4 modules encore juste cadrés). Les rapports de synthèse
OpenEvidence fournis par Thibault (traitement, suivi, complications, risque CV, activité physique,
alimentation) sont rangés dans `docs/evidence-diabete/` (noms en kebab-case).

### Contexte

Thibault a fourni un premier jet de spécification complète (`SPEC_outil_ETP_diabete.md`, 336 lignes)
couvrant l'intention, la grammaire commune et le détail de 4 des 8 modules diabète, plus 6 rapports de
sources probantes. Le thème diabète compte plus de modules que le tabac (8 vs 7) avec un niveau de
détail par module plus élevé (ex. module Alimentation à lui seul comparable en taille à tout
`contenu-modules-tabac.md`) — un fichier unique grossirait au point de devenir coûteux à charger en
contexte IA à mesure que les 8 modules seraient spécifiés puis codés.

### Alternatives envisagées

- Garder un fichier unique `docs/contenu-modules-diabete.md` comme pour le tabac → écarté : le tabac
  est un contenu **clos** (7 modules déjà codés), alors que le diabète est en cadrage **actif** et va
  continuer à grossir ; le fichier unique serait déjà le plus long du repo avant même d'avoir codé un
  seul module.
- Un fichier par module dès le départ, y compris pour les modules 5-8 encore sommaires → écarté pour
  l'instant : ces 4 modules n'ont que quelques lignes de cadrage chacun (pas encore de détail
  écran-par-écran) ; les regrouper dans `modules-5-8-cadrage.md` évite 4 fichiers quasi vides, à
  éclater plus tard quand chacun sera vraiment spécifié.

### Raison du choix

Le découpage par module est le même principe que le découpage `features/<theme>/<module>/` déjà en
place côté code : quand on travaille sur un module diabète (cadrage, design, câblage), on ne charge
que son fichier + `00-global.md`, jamais l'intégralité du contenu des 8 modules.

### Conséquences

- Toute référence à `docs/contenu-modules-diabete.md` dans le repo pointe maintenant vers
  `docs/diabete/00-global.md` (ou le fichier de module concerné) — mises à jour dans `PROJECT_MAP.md`,
  `CLAUDE.md`, `STATUS.md`, `ROADMAP.md`, `TASKS.md`.
- `registry.ts` du thème diabète reste `MODULES: []` — ce découpage ne change rien au statut « pas
  encore câblé » ; les 4 modules spécifiés (1, 2, 3, 4) sont prêts pour la maquette Claude Design, pas
  encore pour le code.

### Impact IA

- Pattern à réutiliser pour un futur thème volumineux : `docs/<theme>/00-global.md` + un fichier par
  module, plutôt qu'un fichier unique `docs/contenu-modules-<theme>.md` — à trancher au cas par cas
  selon le nombre de modules et leur profondeur attendue (le tabac, plus petit et clos, reste en
  fichier unique).

