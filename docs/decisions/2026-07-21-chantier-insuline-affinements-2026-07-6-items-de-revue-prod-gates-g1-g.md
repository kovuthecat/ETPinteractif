# 2026-07-21 — Chantier insuline-affinements-2026-07 : 6 items de revue prod, gates G1-G5

### Décision

Traiter 6 défauts/manques remontés en revue prod par Thibault sur les modules diabète Insuline
basale (9) et rapide (10), jugés solides mais avec quelques trous et un peu de polish restant. Cinq
gates tranchées le 2026-07-21, toutes en amont de l'implémentation (S1 solo → vagues S2‖S3 → S4‖S5) :

- **G1 — contenu neuf sourcé avant code.** `docs/diabete/09-insuline-basale.md` (créé) + section
  « rapide sans repas » du `10`, rédigés en S1 depuis les réponses OpenEvidence de Thibault
  (`PROMPT-OPENEVIDENCE.md`), puis validés par Thibault le jour même — débloque S4/S5.
- **G2 — item 1 (régularité/horaire) : message générique, sans molécule.** Pas de sélecteur de
  molécule ni de promesse de flexibilité (dangereuse pour la glargine U100) — cohérent avec le
  retrait antérieur du sélecteur de profil basale (S3, chantier `revue-chrome-2026-07`). Un renvoi
  « ça dépend de ton insuline → soignant » remplace la différenciation.
- **G3 — item 6 (slider timing) : slider continu + libellé dynamique.** Le contrôle segmenté a été
  écarté (préserve le geste « course », cohérent avec le slider du module 3 Activité). La valeur du
  slider devient la source de vérité unique via `timingPhase(delay)` : `timingHint` (message) et le
  libellé sous le curseur en dérivent tous deux — fin des 4 étiquettes fixes équiréparties qui ne
  correspondaient pas aux seuils réels.
- **G4 — item 5 (creux sous baseline) : retouche du modèle, pas de la dose.** `DOSE_ADEQUATE` avait
  déjà été abaissée une fois (0.5→0.40, chantier `corrections-revue-guidee`) sans régler le fond du
  problème (creux sous la *baseline*, pas seulement sous la *bande*). Cette fois, correction de
  l'alignement effet-bolus/montée-repas dans `sampleRepasAvecBolus` : un garde-fou local borne la
  soustraction de l'effet bolus par l'excès de glycémie réellement disponible tant que le repas n'a
  pas commencé à monter (piste (a) du plan, retenue car la moins invasive — la piste (b), ré-aligner
  la latence du bolus, aurait changé le comportement pour tous les cas). 5 nouveaux invariants de
  test, aucun invariant existant assoupli (dont « invariant 10 », dose unique vs cumul, resté intact).
- **G5 — item 2 (profondeur du scénario « sans repas ») : 5ᵉ onglet distinct.** `⑤ Et si je ne mange
  pas ?`, pas une variante du ④ (qui traite le cumul) — la sémantique est différente (repas sauté vs
  double dose). Positionnement (après le ④) laissé `// à revalider (Thibault)` — validation visuelle.

### Contexte

Revue produit de Thibault le 2026-07-21 sur les deux modules Insuline, déjà proches de l'idéal
(courbes justes, actionnables) mais avec des trous ponctuels : pas de dimension régularité/horaire
côté basale, pas de scénario « rapide sans repas » (cause d'hypo fréquente) côté rapide, un artefact
visuel (creux sous baseline) et une incohérence étiquette/message/marqueur sur le slider de timing.

### Alternatives envisagées

- Sélecteur de molécule pour l'item 1 (régularité) → écarté (G2) : risque de conseil dangereux si mal
  calibré par molécule (ex. flexibilité horaire de la glargine U100), alors qu'un message générique +
  renvoi soignant est sûr par construction.
- Contrôle segmenté pour le slider timing (item 6) → écarté (G3) : casse la grammaire déjà partagée
  avec le module 3 Activité et le geste « course » plus expressif qu'un choix à 4 valeurs discrètes.
- Réglage de dose (encore) pour le creux sous baseline (item 5) → écarté (G4) : déjà tenté une fois
  sans résoudre le problème de fond (artefact d'alignement temporel, pas de calibrage).
- Variante du temps ④ pour le scénario « sans repas » (item 2) → écarté (G5) : sémantiquement
  distinct du cumul (④), un onglet dédié évite de surcharger un mécanisme déjà chargé.

### Raison du choix

Corriger la cause structurelle plutôt que le symptôme dans chacun des deux cas techniques (slider :
double source de vérité → source unique ; courbe : mauvais alignement temporel → garde-fou algébrique
exact, pas un réglage empirique de plus) ; garder les messages cliniques sûrs par défaut (générique,
sans molécule) là où le risque d'erreur est le plus élevé (item 1).

### Conséquences

- `src/features/diabete/insuline-rapide/InsulineRapideModule.tsx`/`.module.css` : `timingPhase(delay)`
  (S2) + 5ᵉ onglet « Et si je ne mange pas ? » (S5) — mêmes fichiers touchés par les deux sessions,
  qui se sont enchaînées sans commit intermédiaire (mode vague parallèle, commits différés à S6) ;
  `git add -p` n'étant pas utilisable en environnement d'exécution non interactif, **les deux tâches
  (IA3 + IA6) ont été committées ensemble** sur ces deux fichiers, plutôt qu'un commit strictement par
  tâche — écart assumé au principe général « un commit par tâche » du fait de la contrainte technique,
  pas d'un choix de conception.
- `src/features/diabete/lib/glycemieCurve.ts`/`.test.ts` : garde-fou local dans
  `sampleRepasAvecBolus`, API exportée inchangée (signatures gelées respectées).
- `src/features/diabete/insuline/InsulineModule.tsx`/`.module.css` : 3 ajouts sobres (intro, carte
  régularité, phrase-pont) au-dessus du jeu de titration existant, qui reste inchangé.
- **Phrases-pont (item 8) non identiques.** S4 (basale) et S5 (rapide) ont chacune rédigé leur
  phrase-pont depuis le même doc source (S1), conceptuellement cohérentes (même paire journée
  entière/un repas) mais formulées différemment (verbes/ordre) — S5 a comparé les deux en fin de
  session (S4 ayant terminé en premier) sans les harmoniser mot pour mot, jugeant le ton propre à
  chaque module acceptable. **Point ouvert, arbitrage Thibault** : garder les deux formulations
  telles quelles ou les harmoniser (cf. `VALIDATION.md`).

### Points ouverts (à revalider Thibault)

- Bornes du slider timing (S2) : seuil `bien-avant` (≤-30), bascule `juste-avant`/`au-moment`.
- Tolérance visuelle exacte du garde-fou bolus (S3) — garantie algébrique, pas de seuil calibré à
  ajuster, mais la validation visuelle du rendu reste à faire.
- Micro-copie intro/régularité/pont du module basale (S4) — dérivée du doc validé G1 mais libellé
  final non figé.
- Positionnement du 5ᵉ onglet (après le ④), note post-prandiale (paraphrase), micro-copie pont (S5).
- Harmonisation ou non des deux phrases-pont (S4 vs S5, cf. Conséquences ci-dessus).

### Impact IA

- `glycemieCurve.ts` reste la lib d'autorité partagée (modules 2/3/8/9/10) : toute future retouche du
  modèle bolus doit revalider les 5 invariants `IA4 — garde-fou pré-repas` ajoutés ici, en plus des
  invariants préexistants (dont « invariant 10 »).
- Si Thibault tranche l'harmonisation des phrases-pont, ne modifier que les deux constantes
  `PONT_TEXTE` respectives (`InsulineModule.tsx`, `InsulineRapideModule.tsx`) — aucune reconception.
- `docs/diabete/09-insuline-basale.md` devient l'autorité de contenu du module basale (au même titre
  que le `10` pour la rapide) — à lire avant toute future modification du module 9.

