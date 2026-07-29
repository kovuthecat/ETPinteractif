# 2026-07-10 — Illustrations diabète S1 : pipeline d'assets + silhouette `bodyImage`/hotspot

### Décision

1. **Pipeline `design/illustrations/build_assets.py`** (Pillow + numpy, outil local, hors
   `package.json`) : `build_opaque` (fonds décoratifs) et `build_transparent` (overlays) partagent un
   ré-encodage Pillow (élimine implicitement les chunks C2PA `caBX`), un flood-fill de transparence
   depuis les 8 points de bord (seuil 42, préserve l'intérieur clair fermé — cellules/organes), puis
   une **palette adaptative 256 couleurs** : RGB complet pour les fonds opaques, **RGB quantifié +
   canal alpha préservé en pleine résolution** pour les overlays (l'indexation PNG ne supporte pas un
   alpha en dégradé, nécessaire pour des bords de détourage nets). Les illustrations sources étant en
   aplats (peu de couleurs), la perte est visuellement nulle (vérifiée à l'œil sur chaque sortie) pour
   un gain de 60-85 % de poids (silhouette : 193 Ko -> 26 Ko).
2. **`SilhouetteCorps.tsx`** (générique) : nouvelle prop `bodyImage?: string`. Si fournie, le
   conteneur passe en carré (`aspect-ratio: 1/1`), un `<img>` remplace le corps SVG codé, et les
   zones basculent en **mode hotspot** (bouton transparent, halo radial doux — `--color-nav-soft` au
   survol/focus, `--color-confort-soft` persistant si `ouvert`/`allume`, rien si `verrouille` —
   **aucun cercle ni icône permanents**, contrairement au mode pastille). Sans `bodyImage`, le rendu
   (SVG codé + pastilles pleines + icônes Lock/CheckCircle2/ShieldCheck) reste **strictement
   inchangé** — non-régression tabac garantie par construction (branche de code distincte).
3. **Wrapper diabète (`Silhouette.tsx`)** : passe `bodyImage` vers `silhouette.png` et recalibre
   `SILHOUETTE_ANCHORS` en **pourcentages de l'image carrée** (repère différent du pixel
   `SILHOUETTE_VIEWBOX` 340×760, propre au corps SVG codé tabac), valeurs de
   `plans/illustrations-diabete/index.md` §7 — le nerf est positionné sur la main (validé au
   prototypage, pas sur le flanc comme l'ancien repère pixel le suggérait).
4. **`RisqueCardioModule.tsx`** (M4) : son overlay de plaque existant (pastille codée `PlaqueArtere`
   posée près de chaque organe) calculait sa position en divisant les anciennes ancres pixel par
   `SILHOUETTE_VIEWBOX` — recalé pour lire directement les nouvelles ancres en %. Seul le calcul de
   position est touché ; le recâblage complet de cet overlay en illustration (plaque en image, cf.
   index §3) reste S3.

### Contexte

Suite du chantier `plans/illustrations-diabete/` : après analyse de ~70 images générées et une série
de prototypes cliquables validés visuellement par Thibault (silhouette + hotspots sans cercle,
plaque en overlay, animation M1 à 4 modes — cf. index §6), le virage « illustration + overlay
interactif » remplace la vectorisation initialement prévue. S1 industrialise le pipeline et donne à
la silhouette partagée sa capacité `bodyImage`/hotspot, **sans encore recâbler** les modules
consommateurs M4/M5/M7 (overlays fins, panneaux détail — S2/S3/S5).

### Alternatives envisagées

- Vectorisation SVG des illustrations → écartée (déjà tranché avant S1, cf. index §1 : testé, 2,1 Mo
  pour la silhouette seule, sans zones exploitables, inutile aux tailles d'affichage réelles).
- Garder les ancres diabète en repère pixel `SILHOUETTE_VIEWBOX` et les convertir à la volée dans le
  composant générique → écarté : le conteneur `bodyImage` est carré (1:1) alors que
  `SILHOUETTE_VIEWBOX` reflète les proportions du corps codé tabac (340×760) ; exprimer les ancres
  directement en % est la représentation la plus simple, sans changer l'API des modules consommateurs
  (toujours des `ZoneId`, jamais des coordonnées).
- Quantifier aussi le canal alpha des overlays (palette RGBA indexée) → écarté : casserait les bords
  anti-aliasés du flood-fill (contour visiblement crénelé) ; seul le RGB est quantifié, l'alpha reste
  en pleine résolution.

### Raison du choix

Minimiser le poids des assets sans dépendance runtime nouvelle (Pillow/numpy = outillage local) ni
perte visuelle perceptible, tout en gardant `SilhouetteCorps` strictement rétro-compatible tabac —
la prop `bodyImage` reste neutre (aucun nom de thème dans `src/components/`), conformément à
l'invariant multi-thèmes.

### Conséquences

- `public/illustrations/diabete/` : 7 PNG committés (silhouette 26 Ko · organe-yeux 39 Ko ·
  organe-reins 38 Ko · organe-nerfs 62 Ko · pied-auto-examen 50 Ko · plaque 36 Ko · artere-saine
  73 Ko) — tous sous ou proches de la cible ~90 Ko/asset (index §2).
- `SILHOUETTE_ANCHORS` (diabète) change définitivement de repère (pixel → % de l'image carrée) :
  toute évolution future des ancres diabète doit rester en %, ne pas revenir au pixel
  `SILHOUETTE_VIEWBOX`.
- `SILHOUETTE_VIEWBOX` reste inchangé et utilisé tel quel par la branche SVG codée (tabac).
- `build_assets.py` est réutilisable tel quel pour les prochains lots (S2/S3/S7) : ajouter des lignes
  à la table `ASSETS` en tête de fichier.

### Impact IA

- S2 (M5 Complications), S3 (M4 Risque CV), S5 (M7 Traitements) consomment `bodyImage` déjà câblé :
  n'ont qu'à poser leurs overlays/panneaux via `children` + `SILHOUETTE_ANCHORS` (%), pas à retoucher
  `SilhouetteCorps` ni le wrapper diabète, sauf besoin réel non anticipé (à documenter ici si ça arrive).
- Si Thibault ajuste une ancre (§7 de l'index), modifier uniquement `SILHOUETTE_ANCHORS` dans
  `src/features/diabete/components/Silhouette.tsx` — aucune reconception du composant générique.
