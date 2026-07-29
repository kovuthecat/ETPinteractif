# 2026-07-10 — Illustrations diabète S7 : 62 vignettes M2/M3/M8, chantier clos

### Décision

Déposer en une seule session les 62 vignettes M2 (33 aliments)/M3 (18 : centre + 4 rayons + 13
activités)/M8 (11 : 7 signes + 4 resucrages) — le lot de sources générées par Thibault en parallèle
des sessions S1-S6 s'est avéré quasi complet à l'ouverture de S7 (62/62 fichiers attendus déjà
présents, vérifiés un par un avant tout traitement). Ajout de 5 nouveaux aliments
(`alimentation/data.ts` : `pates-blanches`, `pates-completes`, `couscous-complet`,
`banane-plantain`, `haricots-rouges`) et d'une nouvelle activité (`activite/data.ts` : `sol`),
tous marqués `// à revalider (Thibault)`. Le chantier `plans/illustrations-diabete/` (S1-S7) est
déclaré **clos** à l'issue de cette session.

### Contexte

S7 est une session structurellement récurrente (« au fil des générations ») ; elle n'était censée
couvrir qu'un lot partiel au lancement du chantier. Le rythme réel de génération de Thibault ayant
dépassé celui des sessions de câblage, la quasi-totalité du travail restant (mentionné §8 de
l'index comme « à générer encore ») était déjà disponible au moment d'exécuter S7 — traité en une
seule passe plutôt qu'en plusieurs lots.

### Alternatives envisagées

- Ne traiter que le sous-ensemble explicitement listé dans le plan original (M2 : 16 aliments ;
  M3 : danse/laver-la-voiture ; M8 : 11) et laisser le reste pour une session future → écarté :
  toutes les sources étaient déjà là et vérifiées, aucune raison de fractionner artificiellement.
- Régénérer/retoucher le style des vignettes acceptées avec des écarts visuels (attiéké, igname,
  plantain) → écarté, conformément à la décision déjà actée dans le plan (« écarts de style
  tolérés »).

### Raison du choix

Minimiser le nombre de sessions pour un travail mécanique (même pipeline que S1, aucune nouvelle
décision de conception) une fois toutes les sources disponibles et vérifiées.

### Conséquences

- `public/illustrations/diabete/` passe de 13 à **75 fichiers**.
- `design/illustrations/build_assets.py` : table `ASSETS` étendue à 75 entrées, réutilisable telle
  quelle pour tout futur lot (ajouter des lignes).
- `alimentation/data.ts` (32 → 33 aliments) et `activite/data.ts` (12 → 13 activités) : les seuils
  du défi ② Alimentation (`PEAK_BAS_MAX`/`PEAK_HAUT_MIN`) restent inchangés — constantes
  indépendantes du nombre d'aliments, vérifié par les 78 tests existants restés verts.
- **Chantier `illustrations-diabete` clos** : S1 à S7 toutes exécutées. Reste ouvert : validation
  visuelle humaine de l'ensemble (`VALIDATION.md`), en particulier les deux points signalés comme
  jamais vérifiés à l'écran (plaque overlay M4, clés volantes M1).

### Impact IA

- Toute nouvelle vignette future (nouvel aliment, nouvelle activité, nouveau signe/resucrage) suit
  le même chemin : ajouter la donnée dans le `data.ts`/module concerné (`// à revalider`), ajouter
  la ligne correspondante à `ASSETS` dans `build_assets.py`, relancer le script.
