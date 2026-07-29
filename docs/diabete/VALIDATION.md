# docs/diabete/VALIDATION.md — jugement humain en attente (N2), thème diabète

> Ce fichier ne contient que du N2 (jugement humain — clinique, esthétique, UX). Ce qu'un
> navigateur constate seul relève du N1 (`/verif-visuelle`). Racine `VALIDATION.md` = tabac +
> transverse ; `docs/cardio/VALIDATION.md` = cardio.
> **Purge** : supprimer un bloc entièrement `[x]`. Un écran réécrit remplace ses anciens critères.
>
> **2026-07-29** : contenu de l'ancien chantier `audit-diabete` (2026-07-12) purgé — les modules
> concernés (Suivi, Insuline basale, ancien module « Risque cardiovasculaire ») ont depuis été
> refondus par `refonte-audit-2026-07` et remplacés par le thème cardio autonome. Historique
> complet : `git log` + `docs/decisions/`.

## Insuline-affinements-2026-07 (2026-07-21)

- [ ] S2 (module rapide, slider timing) : libellé dynamique cohérent avec la position du marqueur
      Injection sur la courbe à chaque position ; bornes du seuil à confirmer/amender.
- [ ] S3 (creux sous baseline) : plus de plongée sous baseline aux temps ①③ ; sur-dosage/cumul
      toujours net (inchangé) ; aucune déformation des courbes des modules 2/3/8/9.
- [ ] S4 (module basale, intro + régularité) : sobre, sans chiffre ni molécule ; titration nocturne
      toujours le cœur de l'écran, aucune régression ; conforme à `docs/diabete/09-insuline-basale.md`.
- [ ] S5 (module rapide, 5e onglet) : courbe nette « avec »/plate « sans » ; positionnement du 5e
      onglet à juger si la barre serre trop à ~1 m ; conforme à `docs/diabete/10-insuline-rapide.md` §3.
- [ ] S4+S5 — cohérence du pont inter-modules : 2 formulations proches mais pas identiques — garder
      ou harmoniser (arbitrage Thibault).

## Refonte-audit-2026-07 (2026-07-24) — volet diabète

- [ ] S1 (layout grand visuel) : Complications/Suivi/Insuline basale sans bande vide ni scroll
      acrobatique aux 3 largeurs testées.
- [ ] S2 (insuline basale, feedback décisions) : chaque décision (Baisser/Laisser/Monter) cohérente
      avec la courbe + message ; refrain de sécurité toujours affiché ; aucun chiffre de dose visible.
- [ ] S7 (barre de risque RCV) : barre qualitative cohérente avec le cumul des feux, aucun chiffre,
      cohérence de grammaire visuelle avec Cardio M2.
- [ ] G-Suivi : les mois passés s'affichent « à programmer » par défaut (pas « fait ») au premier
      chargement, le clic bascule toujours correctement.

## Enrichissement-visuel-2026-07 (2026-07-23) — garde-manger diabète

- [ ] Garde-manger Alimentation : 10 légumes + 7 aliments-situations visibles, placeholders propres,
      courbe glycémie réactive aux nouveaux aliments, aucune régression (défis, InfoHover, fiche).
- [ ] **G-nutrition** : valeurs nutritionnelles des aliments neufs à revalider (partagé avec cardio,
      cf. `docs/cardio/VALIDATION.md`).

## Repas-types (2026-07-24) — volet diabète

- [ ] Module Alimentation, défi « Repas complet » : la courbe glycémique change visiblement selon le
      plat chargé (plat féculent-dominant vs protéine-dominant) ; aucune régression sur les 5 plats
      déjà existants ; composition/proportions des 14 plats à juger.
