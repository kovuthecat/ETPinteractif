# 2026-06-28 — C7 : recomposition libre de l'affiche nicotine / toxiques

### Décision

Ne pas importer ni reproduire l'affiche « Autopsie d'un meurtrier ». Le module 4 utilise une scène originale
en SVG/CSS inline : cigarette et fumée centrales, quatre familles toxiques rouges et nicotine isolée en vert.
Des hotspots ouvrent des bulles ; deux filtres atténuent le groupe non sélectionné.

### Contexte

Thibault a autorisé une recomposition libre, sous réserve de validation des formulations médicales et sans
réutilisation de l'affiche de La Ligue.

### Alternatives envisagées

- Reproduire l'affiche originale : écarté pour les droits et les formulations potentiellement datées.
- Afficher une longue liste de substances : écarté au profit de familles lisibles à distance.
- Ajouter une image bitmap : écarté pour préserver le fonctionnement local-first et hors-ligne.

### Raison du choix

La séparation rouge/vert transmet le message avant lecture du détail. La couleur reste doublée par des
libellés, pictogrammes et motifs.

### Conséquences

- Aucun nouvel asset ni dépendance runtime.
- Les formulations sont listées dans `VALIDATION.md` pour validation par Thibault.
- Les futures corrections de contenu restent localisées dans `HOTSPOTS`.

### Impact IA

- Complexité faible : état local limité au filtre et au hotspot actif.

