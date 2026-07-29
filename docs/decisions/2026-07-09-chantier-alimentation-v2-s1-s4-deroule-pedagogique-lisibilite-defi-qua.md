# 2026-07-09 — Chantier alimentation-v2 (S1-S4) : déroulé pédagogique, lisibilité défi ② qualité, 2ᵉ niveau de lecture

### Décision

Amélioration du module 2 — Alimentation du thème diabète sur trois axes (validés 2026-07-09) :

1. **Déroulé pédagogique** : consigne remontée en haut de la scène, progression douce (coche par défi « joué » + CTA « Défi suivant → »), courbe fantôme « féculents seuls » au défi ①, duels suggérés (baguette/pain complet, riz blanc/basmati, riz blanc/lentilles, dattes/pastèque) au défi ②.

2. **Lisibilité des réponses du défi ② (Qualité / comparaison)** : identité visuelle par carte (A bleu nav, B prune, à poids égal), étiquettes directes (nom aliment) + marqueur de pic sur les courbes, badges de verdict francs (Pic bas/moyen/haut + ✓/✗ pictogramme), tracé animé au révèle.

3. **2ᵉ niveau de lecture** : données qualitatives d'affichage (portion, sel, qualité des graisses, oméga-3, fibres/protéines dérivées), câblage du composant générique `InfoHover` (survol **+ clic verrouillant**) sur le garde-manger et les cartes du défi ②, mention « vaisseaux » (pont fil rouge vers module Risque cardio). **+ C4** : 3 aliments oméga-3 (sardine, saumon, noix).

### Contexte

Suite à la maquette Claude Design handoff diabète, le module Alimentation (M2) doit servir de démonstrateur des capacités du 2ᵉ niveau de lecture générique (`InfoHover`) — préfiguration du cahier des charges pour les futurs modules diabète.

### Alternatives envisagées

- Consigne en bas de la scène (maquette d'origine) → écartée : déplacement en haut crée un contexte plus explicite du défi actif.
- Palette de couleurs consacrée pour A/B (confort/vigilance) → écartée : prune locale définie dans `CourbeGlycemie.module.css` (pas un token global) ; le désambiguïsement repose sur l'étiquette nominative, pas la couleur seule (double encodage).
- InfoHover générique non câblé sur diabète → écartée : l'intérêt du composant générique est sa réutilisation ; le câblage diabète valide l'architecture multi-thèmes.

### Raison du choix

Maximiser la pédagogie (clarté du défi, progression visible) et la réutilisabilité (moteur `InfoHover` générique, testable sur diabète en v1).

### Conséquences

- **S1** (`data.ts`) : ajout de champs qualitatifs à `Food` (portion, sel, graisses, omega3, atout) ; paliers dérivés pour fibres/protéines (constantes `// à revalider (Thibault)`) ; +3 aliments oméga-3 (sardine, saumon, noix, CG ~nulle).
- **S2** (`InfoHover`, `CourbeGlycemie`) : survol+clic verrouillant, variantes duo (duoA/duoB), marqueur de pic, étiquettes directes, tracé animé (props optionnelles, aucun impact sur les usages existants).
- **S3** (`AlimentationModule`) : caption repositionnée, coche+CTA progression, courbe fantôme ①, chips duels ②, verdicts badges ②, panneau `FoodDetail` au survol/clic des noms.
- **S4** (contexte) : `VALIDATION.md` checklist visuelle + table revalidation ; `DECISIONS.md` décisions transverses ; `PROJECT_MAP.md` ligne `alimentation/` mise à jour ; commits S1/S2/S3/contexte.

### Points ouverts (à revalider Thibault)

- **Valeurs qualitatives sel/graisses/oméga-3** (~27 aliments) : ordres de grandeur Ciqual/GI-GL, marqués `// à revalider`, table en entier dans `VALIDATION.md` S4.
- **Bande « moyen » du défi ②** (pics 47→50) : étroite, inchangée ici ; recalibrage ultérieur si les duels suggérés révèlent des verdicts contre-intuitifs.
- **Illustrations des 3 nouveaux aliments** : placeholders `IllustrationSlot` en attente des PNG (`public/illustrations/diabete/aliment-<id>.png`).

### Impact IA

- `InfoHover` devient un composant clé du moteur multi-thèmes — toute modification du pattern survol+clic doit être testée sur diabète (alimentation) + tabac (futur 2ᵉ niveau si câblé).
- `glycemieCurve.ts` inchangé (S14 gel de l'API) ; aucune dépendance ajoutée (CSS pur).
- Nouvelles constantes `// à revalider` dans `data.ts` et paliers — à valider avant clôture du chantier.

