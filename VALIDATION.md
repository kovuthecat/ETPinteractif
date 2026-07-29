# VALIDATION.md — jugement humain en attente (N2 uniquement)

> Ce fichier ne contient que du N2 : jugement esthétique/UX/clinique. Ce qu'un navigateur peut
> constater seul (rendu correct, élément présent/absent, comportement d'écran) est du **N1** —
> vérifié par Claude via `/verif-visuelle`, jamais consigné ici. Cf. `WORKFLOW.md` §6.
> Plafond racine : 120 lignes (appliqué par hook). Portée : transverse + thème **tabac**.
> Diabète → `docs/diabete/VALIDATION.md` · Cardio → `docs/cardio/VALIDATION.md`.
> **Purge** : supprimer un bloc entièrement `[x]`. Un écran réécrit remplace ses anciens critères.

## Purge du 2026-07-29 (migration workflow N0/N1/N2 + routage multi-thèmes)

~1900 lignes de checklists de chantiers clos (theme-diabete, boite-a-outils, alimentation-v2,
illustrations-diabete/tabac, corrections-visuelles-diabete v1/v2/v3, audit-diabete itération 2,
corrections-audit-tabac, aide-patient, corrections-revue-guidee) purgées — tous ces écrans ont été
réécrits au moins une fois depuis par un chantier plus récent (confirmé via `git log` et la fermeture
des dossiers `plans/` correspondants). Détail entier : `git log -- VALIDATION.md` +
`docs/decisions/`. Les checklists encore ouvertes des thèmes diabète/cardio sont routées vers
`docs/diabete/VALIDATION.md` / `docs/cardio/VALIDATION.md`.

## Revue-prod-2026-07 (2026-07-21) — tabac + app patient

- [ ] RP1 : dans `patient.html`, chaque archétype d'outil (SI-ALORS, tirelire, checklist, minuteur,
      plan de secours, phrase de refus, journal, 4D, respiration) s'affiche à la place de la liste
      (pas de scroll) et fonctionne ; mobile (~375px) sans casse de la barre de navigation.
- [ ] RP2 : « Mon plan d'arrêt » réduit à stratégie/date + « Si j'ai un écart » ; le livret complet
      imprimé reste entier (substituts/situations/raisons/4D/contacts) ; « + autre » dans
      Composantes repris dans le livret.
- [ ] RP3 : QR (livret + fiches) ne promet plus de reprise personnalisée ; champs « + autre »
      validés au blur sans perte de saisie.
- [ ] RP4 : Composantes sans débordement/scroll horizontal ; cadran Motivation insensible au simple
      tap ; libellé Alimentation cohérent avec l'interaction ; « Voir l'effet » Traitements déclenché
      dès la classe choisie ; en-têtes alignés à onglets multiples.
- [ ] RP6 : silhouette « Ce que l'arrêt répare » allume l'organe sans clic ; tableau « Mes raisons »
      perçu comme zone d'ajout ; titres longs de la boîte à outils non tronqués.

## Enrichissement-visuel-2026-07 (2026-07-23) — écran de sélection de thème (transverse)

- [ ] Grille de 3 cartes (tabac/diabète/cardio) équilibrée desktop/tablette/mobile, icône-signature
      par thème, alignée en haut de carte (pas centrée/bottom).

## Sélection de thème + accueil (cadre transverse)

- [ ] Lisible à ~1 m : typographies larges, contrastes élevés, cibles cliquables ≥ 44 px.
- [ ] Couleurs sémantiques cohérentes (vert confort / rouge toxique / ambre vigilance / bleu nav) ;
      `prefers-reduced-motion` respecté.
- [ ] Zéro persistance côté consultation : recharger la page ramène à l'accueil.
- [ ] Aucun débordement horizontal sur écran large, tablette, mobile.
