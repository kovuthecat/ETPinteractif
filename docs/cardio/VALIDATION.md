# docs/cardio/VALIDATION.md — jugement humain en attente (N2), thème cardio

> Ce fichier ne contient que du N2 (jugement humain — clinique, esthétique, UX). Ce qu'un
> navigateur constate seul relève du N1 (`/verif-visuelle`). Racine `VALIDATION.md` = tabac +
> transverse ; `docs/diabete/VALIDATION.md` = diabète.
> **Purge** : supprimer un bloc entièrement `[x]`. Un écran réécrit remplace ses anciens critères.

## Chantier theme-cardio-2026-07 (2026-07-22) — modules 4-12 restent à valider

Pilote (modules 1-3) validé par Thibault le 2026-07-22 (après recalage silhouette M3 380→560px).

- [ ] M4 Tension : pression sur l'artère baisse visiblement selon les leviers ; AMT < 135/85 au 2ᵉ
      niveau seulement, aucun « < 140/90 ».
- [ ] M5 Cholestérol : curseur LDL fait évoluer le dépôt ; aucune valeur en g/L à l'écran.
- [ ] M6 Tabac : bascule Fumeur/Arrêté cohérente avec la barre de risque ; renvoi vers le thème
      Tabac fonctionnel (repli visuel, pas une navigation cassée).
- [ ] M7 Bouger : jauge sans plafond, repère 150 min discret.
- [ ] M8 Manger : glisser-déposé + camembert 3 frontières cohérents ; aucun chiffre de sel ; accroche
      d'ouverture à juger (message proposé sans source explicite).
- [ ] M9 Autres leviers : alcool (icônes+fréquence), sommeil (orientation non diagnostique), stress
      (échelle qualitative, aucun RR chiffré).
- [ ] M10 Alerte (carte VITE) : 3 signes classiques + 4 formes atypiques, chacun sa propre
      illustration ; **aucune mention d'aspirine nulle part** (point de sûreté impératif) ; repère
      « > 5 min » en sous-texte permanent — à juger si convient pour une carte de survie ; formulation
      des signes à revalider cliniquement (Complément K OpenEvidence jamais obtenu).
- [ ] M11 Traitements : transcription d'ordonnance allume les bonnes zones ; aucune aspirine dans les
      classes proposées ; aucune suggestion de molécule.
- [ ] M12 Suivi : « mes 3 chiffres » (glycémie remplace tension/LDL/tour de taille) ; jamais de rouge ;
      fréquences de suivi à confirmer par Thibault auprès de l'HAS.
- [ ] Assets à générer (non bloquant) : pictos VITE, signes infarctus, artère/poumon tabac 2 états,
      brassard automesure.

## Refonte-audit-2026-07 (2026-07-24) — volet cardio

- [ ] S3 (M9 leviers stress + SAOS) : chaque levier ouvre un conseil (un seul à la fois) ; SAOS 1→2
      signes cochés déclenche puis renforce le message d'orientation, ton non diagnostique.
- [ ] S5 (M3 plaque-pivot) : clic sur un organe déplace visuellement la plaque partagée vers cet
      organe ; message « un seul ennemi, mêmes leviers » permanent ; mapping organe→accident et
      phrases de conséquence à revalider cliniquement.
- [ ] S6 (M6 mécanisme câblé) : curseur Fumeur→Arrêté à 5 repères manipulable, artère héros évolue
      visiblement à chaque étape ; validation clinique finale du mécanisme câblé (formulations déjà
      validées en discussion, jamais vues à l'écran).
- [ ] G-M10-nausées : onglet Infarctus n'affiche plus que 3 cartes « Parfois autrement », sans trou
      visuel desktop ni asymétrie mobile.

## Enrichissement-visuel-2026-07 (2026-07-23) — garde-manger + familles

- [ ] Garde-manger Manger (M8) : onglets par catégorie (6), défaut Légumes, ~49 aliments au total,
      aucun débordement mobile (~375px).
- [ ] Presets repas-types : sélectionner un preset remplit l'assiette + les 3 frontières du camembert,
      reste modifiable ensuite.
- [ ] **G-familles** (non exécutée) : approche « picto par repère » — à trancher avant tout code.
- [ ] **G-nutrition** (partagé diabète) : ordres de grandeur nutritionnels des aliments neufs à
      revalider culturellement/cliniquement.

## Repas-types (2026-07-24) — volet cardio

- [ ] Module Manger, onglet Assiette : charger chaque preset change visiblement le camembert (plus de
      parts égales systématiques) — composition à juger (réalisme culturel/portions).
