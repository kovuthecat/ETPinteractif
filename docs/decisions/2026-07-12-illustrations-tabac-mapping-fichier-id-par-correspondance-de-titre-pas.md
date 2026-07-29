# 2026-07-12 — Illustrations tabac : mapping fichier→id par correspondance de titre, pas par génération

### Décision

Intégrer le lot de sources tabac de `Downloads\illustration ETP\` (154 fichiers au total, partagés
avec le lot diabète) en mappant chaque fichier à l'id de slot existant **par correspondance de
libellé/titre/affirmation** (lecture des `data.ts` de `benefices-arret`, `boite-a-outils`,
`idees-recues`, `substituts`) plutôt que d'attendre une convention de nommage explicite côté
génération — aucune n'existait pour le tabac (contrairement au diabète, où `build_assets.py` gère
déjà cette table). Nouveau script dédié `design/illustrations/build_assets_tabac.py` (même pipeline
flood-fill que le diabète, dupliqué plutôt que factorisé — deux scripts autonomes de ~90 lignes ne
justifient pas un module partagé).

### Contexte

Le thème tabac a des slots `IllustrationSlot`/`TechniqueIllustration` câblés depuis plusieurs
chantiers (approfondissement-tabac S1, boite-a-outils BO1-BO2, X8) mais **aucune image** n'avait
jamais été fournie — contrairement au diabète, qui a son propre chantier `illustrations-diabete`
(S1-S7, clos) avec une table `ASSETS` explicite. Le dossier Downloads livré par Thibault mélange
des fichiers diabète (déjà tous couverts par `build_assets.py`, aucune action ici) et, pour la
première fois, un lot tabac complet — mais sans table de correspondance préexistante à suivre.

### Alternatives envisagées

- **Attendre une nomenclature explicite de Thibault** avant d'intégrer quoi que ce soit — écarté :
  les titres/affirmations des `data.ts` rendent la correspondance non ambiguë pour l'immense
  majorité des cas (36/42 fichiers ont un titre quasi identique au champ `affirmation`/`titre` du
  code), et le fallback `onError` d'`IllustrationSlot` rend une intégration partielle sans risque.
- **Forcer une image sur chaque id** (dupliquer une image existante sur plusieurs cartes proches,
  ex. les 4 cartes « poids ») — écarté : afficherait la même illustration sur 4 cartes différentes,
  ce qui laisse croire à une redondance de contenu inexistante. Préféré : une seule affectation au
  cas le plus central (`vf-poids`), les 3 autres restent en placeholder (états déjà gérés).
- **Réutiliser `IllustrationSlot`** (composant carré, `object-fit: cover`) pour les 6 scènes
  substituts — écarté après inspection visuelle des sources (`Patch — technique.png` = scène large
  16:7 en 3 panneaux) : un recadrage carré aurait coupé les panneaux latéraux. Gardé le composant
  `TechniqueIllustration` existant (déjà `width:100%; height:auto`, pas de crop forcé).

### Raison du choix

Les libellés du lot Downloads sont rédigés en français naturel et collent presque mot pour mot aux
champs `affirmation`/`titre`/`illustrationLabel` du code (ex. « Une semaine d'observation » =
titre exact de `outil-journal` ; « Ça commence en 20mn » = reformulation directe de l'affirmation
de `vf-20min`) — la correspondance est vérifiable par lecture, pas une supposition. Passer par une
recherche systématique (lister les 154 fichiers, croiser avec la table `ASSETS` diabète existante
pour isoler le résidu, puis croiser le résidu avec les `data.ts` tabac) donne un mapping complet et
traçable sans attendre un aller-retour supplémentaire avec Thibault.

### Conséquences

- **42/56 slots tabac couverts** (7 zones bénéfices + 14 outils + 15 idées reçues + 6 substituts) ;
  reste en placeholder (aucune image dédiée dans le lot, pas une erreur d'intégration) :
  `benef-horizon`, `vf-poids-coeur`, `vf-fumer-mince`, `vf-poids-regime`, `vf-vape-aide`,
  `vf-double-usage`, `vf-vapeur-eau`.
- **`vf-poids` a reçu le seul visuel « poids » du lot** (« Poids et arrêt.png ») au détriment de
  `vf-poids-coeur`/`vf-fumer-mince`/`vf-poids-regime` qui traitent aussi du poids — choix arbitré
  par Claude (carte la plus centrale/la plus probable à être lue en premier), **à confirmer par
  Thibault** (cf. `VALIDATION.md`) ; aucun changement de code nécessaire pour réaffecter, juste
  renommer le PNG.
- **`TechniqueIllustration.tsx` réécrit** : la table `ILLUSTRATIONS: Record<FormeId, string | null>`
  (toute à `null` depuis X8) disparaît, remplacée par un chargement direct
  `${BASE_URL}illustrations/tabac/substitut-${forme}.png` + état `errored` (même pattern que
  `IllustrationSlot`, dupliqué localement plutôt qu'importé — le composant a une contrainte de forme
  différente, cf. alternative écartée ci-dessus). `substitut-patch.png` existe mais n'est actuellement
  jamais rendu par l'UI (`showTechnique` exclut `patch`, `FORMES_PONCTUELLES` aussi) — comportement
  hérité de X8/BO5, non modifié ici, non bloquant.
- `public/illustrations/tabac/` créé (42 fichiers, 3,2 Mo), poids par asset 20-156 Ko (technique de
  prise, 900px, plus lourdes que les icônes 512px — cible ~90 Ko/asset du diabète non visée ici,
  jugée non pertinente pour des scènes 900px).

### Impact IA

- Si Thibault fournit les 7 illustrations manquantes plus tard, ajouter simplement une ligne à la
  table `ASSETS` de `build_assets_tabac.py` et relancer le script — aucun changement de composant.
- Avant toute réaffectation du mapping (notamment `vf-poids`), vérifier d'abord `VALIDATION.md`
  (section « Illustrations tabac ») pour le statut de validation Thibault en cours.
- Le pipeline `build_assets_tabac.py` est un outil local (hors `package.json`, Pillow/numpy) : ne
  jamais l'appeler depuis du code applicatif, seulement en session de génération d'assets.

