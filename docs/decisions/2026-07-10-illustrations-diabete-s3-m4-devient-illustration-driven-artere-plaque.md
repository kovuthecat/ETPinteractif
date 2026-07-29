# 2026-07-10 — Illustrations diabète S3 : M4 devient illustration-driven (artère + plaque + feux lucide)

### Décision

1. **`PlaqueArtere.tsx` réduit à sa plus simple expression** : le composant ne dessine plus le
   vaisseau (paroi + lumière, rectangles codés) — seulement **le dépôt qui grossit** (une ellipse
   transparente, `viewBox 0 0 100 100`), destinée à être posée en overlay sur une illustration. La
   courbe de croissance (`pot = encrassement^0.75`) et les paliers de teinte (vigilance-soft →
   vigilance → toxique) sont conservés à l'identique. Nouvel export pur `plaquePassagePct(encrassement)`
   qui calcule le « % de lumière ouverte » indépendamment de tout tracé (formule reprise de l'ancien
   `wallFrac`), pour garder le texte « Passage du sang : X % » sans dépendre de la géométrie SVG.
2. **Vue « L'artère » (M4)** : `artere-saine.png` (S1) devient le fond de la scène ; `PlaqueArtere`
   (nouvelle forme) est posé en overlay absolu par-dessus, dimensionné et **pivoté (~-25°)** pour
   s'aligner sur l'axe long de l'illustration. L'angle a été mesuré par **analyse d'image** (PCA sur
   les pixels non transparents de `artere-saine.png` — script Python ponctuel, pas conservé dans le
   repo) plutôt qu'à l'œil, faute d'accès navigateur pendant le développement (règle projet).
3. **Vue « L'anatomie » (M4)** : les pastilles de plaque codées (ancienne variante `pastille` de
   `PlaqueArtere`, supprimée) sont remplacées par l'image `plaque.png` (S1), positionnée et pivotée
   par territoire via une nouvelle table locale `PLAQUE_OVERLAYS` (cou 50/17 rot 90°, cœur 49/26
   rot 0°, jambes 46/63 rot 90° — valeurs de `plans/illustrations-diabete/index.md` §7).
4. **5 feux → lucide** : `IllustrationSlot` (placeholders `risque-cardio-feu-*`, jamais générés)
   remplacé par `Droplet`/`Gauge`/`Droplets`/`Cigarette`/`Armchair` dans un cadre circulaire neutre
   (fond `--color-bg`, bordure `--color-line`, icône `--color-nav`). La couleur d'état (vert/ambre/
   rouge) reste portée uniquement par la carte (bordure + bouton), jamais par l'icône — conformément
   au garde-fou du plan S3.

### Contexte

Suite de S1 (pipeline + silhouette `bodyImage`) et S2 (M5). S3 est la première session qui recâble
réellement un module consommateur (M4) sur le virage illustration-driven décidé en amont du chantier
(index §1/§3) : « artère saine (image) + plaque codée qui grossit » et « plaque en overlay sur
territoire », feux abandonnés au profit de lucide (plus nets à 56-74 px, thématisables).

### Alternatives envisagées

- Garder `PlaqueArtere` capable de dessiner le vaisseau complet (variante `artere`) en plus du nouveau
  mode overlay → écarté : le vaisseau codé devient un doublon mort dès que l'illustration le remplace,
  et le projet proscrit le code mort (« si vous êtes certain que quelque chose est inutilisé, vous
  pouvez le supprimer complètement »).
- Deviner l'angle de rotation de `artere-saine.png` à l'œil → écarté au profit d'une mesure
  reproductible (PCA sur les pixels non transparents), documentée ici pour qu'un futur ajustement
  parte d'une valeur justifiée plutôt que d'un nouveau tâtonnement.
- Conserver la variante `pastille` de `PlaqueArtere` pour un usage futur hypothétique (M5 ?) → écartée :
  aucun consommateur actuel ni prévu dans le plan (M5 utilise ses propres illustrations d'organe
  depuis S2), donc code mort par anticipation — à recréer si un besoin réel apparaît.

### Raison du choix

Aligner M4 sur la décision de fond du chantier (illustration-driven) sans dupliquer de logique : la
seule partie qui reste « réellement codée » (index §1.6) est le dépôt qui grossit, pas le vaisseau —
exactement ce que `PlaqueArtere` fait désormais, et rien de plus.

### Conséquences

- `PlaqueArtere` n'a plus qu'une seule forme de rendu (l'overlay) ; toute réintroduction d'un vaisseau
  codé nécessiterait un nouveau composant, pas une variante de celui-ci.
- L'alignement visuel précis (angle, position) de la plaque sur `artere-saine.png` et de `plaque.png`
  sur la silhouette **n'a pas été vérifié à l'écran** par Claude (règle projet : pas de navigateur) —
  point de revalidation explicite dans `VALIDATION.md` §S3, avec un chemin de correction clair
  (constantes `.artereOverlay` en CSS, `PLAQUE_OVERLAYS` dans le module).
- Les ids `risque-cardio-feu-*` (jamais illustrés) disparaissent définitivement du code ; plus aucune
  référence dans `design/illustrations/prompts-illustrations-diabete.html` (déjà absents).

### Impact IA

- Si Thibault demande un recalage de la plaque (vue artère ou anatomie), modifier uniquement les
  constantes CSS (`.artereOverlay` : `left`/`top`/`width`/`height`/rotation) ou la table
  `PLAQUE_OVERLAYS` du module — aucune reconception de `PlaqueArtere.tsx` nécessaire, sauf si la forme
  du dépôt elle-même doit changer.
- `plaquePassagePct` est la seule source de vérité pour le texte « passage du sang » : si la formule
  de croissance change, l'ajuster une fois ici, pas dans le module consommateur.
