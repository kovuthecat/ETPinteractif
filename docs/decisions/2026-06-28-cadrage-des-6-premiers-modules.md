# 2026-06-28 — Cadrage des 6 premiers modules

### Décision

Cadrage validé de 6 modules pour le thème tabac (détail dans `docs/contenu-modules.md`) :
1. Composantes de l'addiction · 2. Cinétique de la nicotine & seuils · 3. Substituts & titration ·
4. La nicotine n'est pas le toxique · 5. Le piège du soulagement · 6. Gérer le craving (4D).

Décisions de conception transverses :
- **Interaction : manipulation libre** (bacs à sable avec curseurs/boutons, rendu en direct).
- **Graphiques : qualitatif / relatif** (pas de valeurs chiffrées ; mention « schéma illustratif »).
- **Module 1 = carte d'orientation** (conseils courts + renvois, pas de duplication).
- **Public mixte** (ambivalents + engagés) → ton non injonctif, motivationnel optionnel.
- **Substituts : toutes les formes + la vapoteuse** (la vapoteuse apparaît aussi comme scénario dans le module 2).

### Contexte

Affinage du contenu des premiers modules avec Thibault (expert clinique du contenu).

### Alternatives envisagées

- Interaction guidée pas-à-pas → écartée au profit de la manipulation libre (plus marquant en consultation).
- Graphique chiffré (ng/mL, mg) → écarté (risque de fausse précision médicale).
- Module 1 auto-suffisant → écarté (duplication avec les modules dédiés).

### Raison du choix

Maximiser l'impact pédagogique en consultation tout en limitant le risque médical et la duplication.

### Conséquences

- Effort de dev plus élevé sur les modules 2, 3-B et 5 (interactivité libre + courbes).
- Modules 2/3/4/5 fortement liés (renvois) : soigner le moteur de module et la navigation croisée.
- **Données cliniques en attente** (titration patch, vapoteuse, liste 4D, affichage sources) — voir `docs/contenu-modules.md`.

### Impact IA

- Complexité : modérée (les bacs à sable interactifs concentrent la difficulté).
- Contexte : maîtrisé si chaque module reste une feature isolée.
- `PROJECT_MAP.md` : modules à refléter dès le scaffolding.

