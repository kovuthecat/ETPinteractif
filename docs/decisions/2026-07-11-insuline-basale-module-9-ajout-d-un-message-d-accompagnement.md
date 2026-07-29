# 2026-07-11 — Insuline basale (module 9) : ajout d'un message d'accompagnement

**Contexte** — Interrogation OpenEvidence sur l'insuline basale DT2 (rapport archivé
`Downloads/Rapport OE insuline basale.txt`). Le rapport **valide fortement** la conception
existante du module 9 (bande individualisée jeune/âgé, pente sur 3 nuits, hypo prioritaire, hypo
nocturne invisible via capteur, cadence ~3 jours) — aucune correction de fond nécessaire.

**Décision Thibault** — Parmi 3 pistes d'enrichissement, deux (concept de surbasalisation ;
visualisation du croisement nocturne BeAM) **écartées** : elles supposent un niveau d'autonomie
que la patientèle de Thibault atteint rarement. Retenue : la 3ᵉ, un simple **message
d'accompagnement**. Formulation validée par Thibault (choix parmi 3 propositions) :
« Régler la lente, c'est un travail d'équipe avec votre soignant — pas une décision à prendre
seul. »

**Justification par les données** — L'auto-titration guidée est au moins aussi efficace que la
titration médicale, mais **uniquement avec accompagnement humain** (« l'application seule ne
suffit pas », méta-analyse Boonpattharatthiti 2025 ; l'éducation structurée réduit les hypos
sévères ~75 %, OR 0,25). Le message insiste donc sur l'accompagnement (« jamais seul »), ce qui
est à la fois honnête cliniquement et adapté à une patientèle peu autonome — plutôt qu'un message
d'autonomie qui serait en tension avec la réalité de terrain.

**Implémentation** — Une phrase en note discrète (`.accompagnement`, `--font-size-small`,
`--color-text-soft`) sous le refrain de sécurité existant (`.filrouge`, dominant), regroupés dans
un `.piedRefrain`. `InsulineModule.tsx` + `.module.css`. Aucun chiffre, aucun nouvel écran, aucune
régression (gates verts, 86 tests). Hors périmètre du chantier v3 (S1-S10) : enrichissement
ponctuel du module 9.
