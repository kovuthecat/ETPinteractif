# DECISIONS.md — registre

**Une décision = une ligne ici, le détail dans `docs/decisions/`.** Ce registre est relu à chaque
cadrage : il doit tenir sous 150 lignes (plafond appliqué par hook). Le raisonnement complet n'a
aucune raison d'être en contexte tant que la décision n'est pas remise en jeu.

- **Racine = transverse.** Les décisions propres à un sous-domaine (tabac, diabète, cardio) vont
  dans `docs/<theme>/` quand elles sont assez volumineuses pour y avoir leur propre fichier ; sinon
  elles restent ici, comme c'est le cas historique de la plupart des entrées ci-dessous.
- Un plan pointe vers **le fichier de détail**, jamais vers « `DECISIONS.md` » en bloc.

## Format d'un fichier de détail (`docs/decisions/YYYY-MM-DD-<slug>.md`)

```md
## YYYY-MM-DD — Titre de la décision

### Décision
### Contexte
### Alternatives envisagées
### Raison du choix
### Conséquences
### Impact IA
```

---

## Décisions

- 2026-06-28 — **Cadrage initial du projet ETP interactif** (thème sevrage tabagique) → [détail](docs/decisions/2026-06-28-cadrage-initial-du-projet-etp-interactif-theme-sevrage-tabagique.md)
- 2026-06-28 — **Cadrage des 6 premiers modules** → [détail](docs/decisions/2026-06-28-cadrage-des-6-premiers-modules.md)
- 2026-06-28 — **Données cliniques + choix techniques d'implémentation** → [détail](docs/decisions/2026-06-28-donnees-cliniques-choix-techniques-d-implementation.md)
- 2026-06-28 — **C4 : récit illustratif du modèle de stress** (soulagement) → [détail](docs/decisions/2026-06-28-c4-recit-illustratif-du-modele-de-stress-soulagement.md)
- 2026-06-28 — **C7 : recomposition libre de l'affiche nicotine/toxiques** → [détail](docs/decisions/2026-06-28-c7-recomposition-libre-de-l-affiche-nicotine-toxiques.md)
- 2026-07-01 — **R5 : soulagement en bac à sable temps réel** (fin de la bascule d'onglets) → [détail](docs/decisions/2026-07-01-r5-soulagement-en-bac-a-sable-temps-reel-fin-de-la-bascule-d-onglets.md)
- 2026-07-01 — **R9 : module 7 « Explorer ma motivation »** — focus positif, pas de balance décisionnelle → [détail](docs/decisions/2026-07-01-r9-module-7-explorer-ma-motivation-focus-positif-pas-de-balance-decisi.md)
- 2026-07-08 — **Refonte visuelle complète** — système de design Claude Design + nouveau modèle de courbes → [détail](docs/decisions/2026-07-08-refonte-visuelle-complete-systeme-de-design-claude-design-nouveau-mode.md)
- 2026-07-08 — **Introduction du moteur multi-thèmes** + scaffold du thème diabète → [détail](docs/decisions/2026-07-08-introduction-du-moteur-multi-themes-scaffold-du-theme-diabete.md)
- 2026-07-08 — **Cadrage diabète** — fichier par module + sources probantes brutes → [détail](docs/decisions/2026-07-08-cadrage-diabete-fichier-par-module-sources-probantes-brutes.md)
- 2026-07-08 — **Substituts** — retrait de l'inhaleur et de la vapoteuse (5 formes) → [détail](docs/decisions/2026-07-08-substituts-retrait-de-l-inhaleur-et-de-la-vapoteuse-5-formes.md)
- 2026-07-09 — **Extensions tabac au niveau du brief diabète**, en v1 directe sans maquette → [détail](docs/decisions/2026-07-09-extensions-tabac-au-niveau-du-brief-diabete-en-v1-directe-sans-maquett.md)
- 2026-07-09 — **Câblage du thème diabète** (plan theme-diabete, S1-S13) → [détail](docs/decisions/2026-07-09-cablage-du-theme-diabete-plan-theme-diabete-s1-s13.md)
- 2026-07-09 — **Chantier alimentation-v2** (S1-S4) — déroulé pédagogique, lisibilité défi ② qualité → [détail](docs/decisions/2026-07-09-chantier-alimentation-v2-s1-s4-deroule-pedagogique-lisibilite-defi-qua.md)
- 2026-07-09 — **S14 : corrections revue visuelle** — modèle repas par composition réelle + inversion D9 n°2 → [détail](docs/decisions/2026-07-09-s14-corrections-revue-visuelle-modele-repas-par-composition-reelle-inv.md)
- 2026-07-10 — **Chantier approfondissement-tabac** (S1-S6) — 5 décisions structurantes → [détail](docs/decisions/2026-07-10-chantier-approfondissement-tabac-s1-s6-5-decisions-structurantes.md)
- 2026-07-10 — **Chantier `boite-a-outils`** (BO1-BO9) — fusion Craving → Stratégies & outils + 5 décisions → [détail](docs/decisions/2026-07-10-chantier-boite-a-outils-bo1-bo9-fusion-craving-strategies-outils-5-dec.md)
- 2026-07-10 — **Illustrations diabète S1** — pipeline d'assets + silhouette `bodyImage`/hotspot → [détail](docs/decisions/2026-07-10-illustrations-diabete-s1-pipeline-d-assets-silhouette-bodyimage-hotspo.md)
- 2026-07-10 — **Illustrations diabète S3** — M4 devient illustration-driven (artère + plaque + feux) → [détail](docs/decisions/2026-07-10-illustrations-diabete-s3-m4-devient-illustration-driven-artere-plaque.md)
- 2026-07-10 — **Illustrations diabète S4** — M1 devient une animation illustration-driven à 4 modes → [détail](docs/decisions/2026-07-10-illustrations-diabete-s4-m1-devient-une-animation-illustration-driven.md)
- 2026-07-10 — **Illustrations diabète S6** — M6 stations/organes du cadran → lucide → [détail](docs/decisions/2026-07-10-illustrations-diabete-s6-m6-stations-organes-du-cadran-lucide.md)
- 2026-07-10 — **Illustrations diabète S7** — 62 vignettes M2/M3/M8, chantier clos → [détail](docs/decisions/2026-07-10-illustrations-diabete-s7-62-vignettes-m2-m3-m8-chantier-clos.md)
- 2026-07-11 — **Corrections visuelles diabète** (revue Thibault, 13 captures → 5 causes-racines) → [détail](docs/decisions/2026-07-11-corrections-visuelles-diabete-revue-thibault-13-captures-5-causes-raci.md)
- 2026-07-11 — **Corrections visuelles diabète, tour 2** (insuffisant sur les tailles → 6 causes-racines) → [détail](docs/decisions/2026-07-11-corrections-visuelles-diabete-tour-2-revue-thibault-insuffisant-sur-le.md)
- 2026-07-11 — **Corrections visuelles diabète, tour 3 — S1** (audit Chrome) : chrome élargi via délégation du rendu du shell → [détail](docs/decisions/2026-07-11-corrections-visuelles-diabete-tour-3-audit-chrome-sur-le-deploye-s1-ch.md)
- 2026-07-11 — **Corrections visuelles diabète, tour 3 — S3** : bug Bézier de la plaque d'artère corrigé → [détail](docs/decisions/2026-07-11-corrections-visuelles-diabete-tour-3-s3-bug-bezier-de-la-plaque-d-arte.md)
- 2026-07-11 — **Corrections visuelles diabète, tour 3 — S6** : breakpoint Suivi remonté 860→1200px → [détail](docs/decisions/2026-07-11-corrections-visuelles-diabete-tour-3-s6-breakpoint-suivi-remonte-860-1.md)
- 2026-07-11 — **Corrections visuelles diabète, tour 3 — S7** : axe clé/serrure ajouté à `data.ts` → [détail](docs/decisions/2026-07-11-corrections-visuelles-diabete-tour-3-s7-axe-cle-serrure-ajoute-a-data.md)
- 2026-07-11 — **S10 : nouveau module « Insuline rapide »** (pré-prandial), implémenté sur feu vert avant relecture finale → [détail](docs/decisions/2026-07-11-s10-nouveau-module-insuline-rapide-pre-prandial-implemente-sur-feu-ver.md)
- 2026-07-11 — **Insuline basale (module 9)** : ajout d'un message d'accompagnement → [détail](docs/decisions/2026-07-11-insuline-basale-module-9-ajout-d-un-message-d-accompagnement.md)
- 2026-07-12 — **Chantier audit-diabete** (S1-S6) — 12 corrections + modèle de cumul insuline (excès persistant/IOB) → [détail](docs/decisions/2026-07-12-chantier-audit-diabete-s1-s6-12-corrections-modele-de-cumul-insuline-e.md)
- 2026-07-12 — **Illustrations tabac** — mapping fichier→id par correspondance de titre, pas par génération → [détail](docs/decisions/2026-07-12-illustrations-tabac-mapping-fichier-id-par-correspondance-de-titre-pas.md)
- 2026-07-13 — **Corrections audit Chrome tabac** — état de sélection en mémoire, livret, cadrage app patient → [détail](docs/decisions/2026-07-13-corrections-audit-chrome-tabac-etat-de-selection-en-memoire-livret-cad.md)
- 2026-07-13 — **App d'aide patient autonome** (chantier aide-patient, T16) → [détail](docs/decisions/2026-07-13-app-d-aide-patient-autonome-chantier-aide-patient-t16-du-chantier-corr.md)
- 2026-07-14 — **Chantier `corrections-revue-guidee`** (13 points, blocs A-E) — 6 décisions structurantes → [détail](docs/decisions/2026-07-14-chantier-corrections-revue-guidee-13-points-blocs-a-e-6-decisions-stru.md)
- 2026-07-15 — **Scopage de la persistance par contexte** (consultation vs app patient) → [détail](docs/decisions/2026-07-15-scopage-de-la-persistance-par-contexte-consultation-vs-app-patient.md)
- 2026-07-15 — **TitrationPatch partagé, A5 partout**, priorisation outils, situations par pilier, respiration et carnet patient → [détail](docs/decisions/2026-07-15-composant-titrationpatch-partage-a5-partout-priorisation-outils-situat.md)
- 2026-07-21 — **Chantier outils-interactifs-2026-07** — registre d'outils interactifs, persistance injectée, gates G1-G5 → [détail](docs/decisions/2026-07-21-chantier-outils-interactifs-2026-07-registre-d-outils-interactifs-pers.md)
- 2026-07-21 — **Chantier insuline-affinements-2026-07** — 6 items de revue prod, gates G1-G5 → [détail](docs/decisions/2026-07-21-chantier-insuline-affinements-2026-07-6-items-de-revue-prod-gates-g1-g.md)
- 2026-07-21 — **Chantier revue-prod-2026-07** — correctifs d'une revue prod navigateur in-app → [détail](docs/decisions/2026-07-21-chantier-revue-prod-2026-07-correctifs-d-une-revue-prod-navigateur-in.md)
- 2026-07-22 — **Nouveau thème `cardio`** (Prévention cardiovasculaire) — composants cardio-owned, porte inter-thèmes en repli, gate contenu G1 → [détail](docs/decisions/2026-07-22-nouveau-theme-cardio-prevention-cardiovasculaire-composants-cardio-own.md)
- 2026-07-23 — **Chantier enrichissement-visuel-2026-07** — finition visuelle & garde-manger → [détail](docs/decisions/2026-07-23-chantier-enrichissement-visuel-2026-07-finition-visuelle-garde-manger.md)
- 2026-07-23 — **Revue prod cardio (1re passe)** — sédentarité remplace poids, tabac binaire, camembert à 3 frontières généralisé au diabète → [détail](docs/decisions/2026-07-23-revue-prod-cardio-1-passe-sedentarite-remplace-poids-tabac-binaire-cam.md)
- 2026-07-24 — **Chantier refonte-audit-2026-07** — suites de l'audit pédagogique des 3 thèmes → [détail](docs/decisions/2026-07-24-chantier-refonte-audit-2026-07-suites-de-l-audit-pedagogique-des-3-the.md)
- 2026-07-24 — **Gates du chantier refonte-audit-2026-07 tranchées avec Thibault** (2e passe) → [détail](docs/decisions/2026-07-24-gates-du-chantier-refonte-audit-2026-07-tranchees-avec-thibault-2-pass.md)
- 2026-07-24 — **Repas-types** — moteur de proportions + enrichissement de la base (14 plats) → [détail](docs/decisions/2026-07-24-repas-types-moteur-de-proportions-enrichissement-de-la-base-14-plats.md)
- 2026-08-06 — **Clôture enrichissement-visuel-2026-07 (S5-S8)** — dépôt de 41 illustrations + G-familles tranchée (icônes Lucide, pas de nouvel asset) → [détail](docs/decisions/2026-08-06-cloture-enrichissement-visuel-2026-07-s5-s8-depot-illustrations-g-famil.md)
- 2026-08-06 — **Chantier recette-outils-2026-08 clos (8/8)** — 6 gates tranchées, fiche auto + analyse croisée cardio + synthèse carnet + app patient en tuile → [détail](docs/decisions/2026-08-06-chantier-recette-outils-2026-08-clos-6-gates-tranchees-fiche-auto-analy.md)

---

## Archives

> Une ligne par décision caduque : `YYYY-MM-DD — Titre — remplacée par <décision/date>`.
