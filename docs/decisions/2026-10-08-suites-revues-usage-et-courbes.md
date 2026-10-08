## 2026-10-08 — Suites des revues d'usage et des courbes : deux plans, modèle illustratif assumé

Brief : Fonctionnalités MVP §5 (titration retirée de l'app patient) · Version 2 / idées futures (titration patient reportée)
Règles : invariant 1 : l'exemple « titration » des données patient persistées est retiré (aucune titration dans l'app patient)

### Ce que ça change

- **Deux plans, dans cet ordre.**
  - **Plan A — usage** : corrige T-U1 à T-U9 (`TASKS.md`), c'est-à-dire les 26 bloquants d'accessibilité et les 69 majeurs de la revue d'usage (`docs/revues/2026-10-06-usage.md`). Aucun contenu clinique à produire avant de commencer.
  - **Plan B — courbes** : recalibre T-C1 (`docs/revues/2026-10-06-courbes.md`) et règle les écarts texte/courbe des insulines. Il s'ouvre après le plan A et commence par la preuve G1 sur l'échelle du diabète.
- **Les courbes deviennent explicitement illustratives.** Le propos pédagogique arrêté avec Thibault le 2026-10-06 l'emporte sur la pharmacocinétique : un fumeur régulier fait le yo-yo jusqu'en Manque, n'atteint jamais le Surdosage, et la titration bascule nettement en Surdosage. La demi-vie, la saturation, les bornes de zones et les amplitudes deviennent des **réglages libres**. Les tests vérifient des **écarts visibles à l'écran**, pas des constantes de cinétique. La décision ③ du 2026-07-10 (« modèle nicotine réaliste ») est **remplacée**.
- **L'app patient n'aura pas de titration pour l'instant.** Le renvoi mort « cf. titration » de la fiche Patch est retiré. La promesse sort du brief et part en Version 2. Le patient garde sa dose sur le livret imprimé.

Ce que tu verras : d'abord une app utilisable au clavier et à 320 px, sans titres identiques ni dialog qui laisse fuir le focus. Ensuite, des courbes dont chaque variation annoncée se voit à ~1 m. En contrepartie, ces courbes ne prétendent plus suivre la cinétique réelle, et seule la mention « schéma illustratif » le dit.

### Plan A — usage (T-U1 à T-U9)

Le périmètre est celui des lignes T-U1 à T-U9 de `TASKS.md`, regroupées par cause. Trois ajustements :

- **c-4-58 et c-4-59** (textes des insulines) passent au plan B.
- **c-7-3** se règle en retirant le renvoi « cf. titration » de la fiche Patch, en voix patient (pas de nouvel écran).
- **Mineurs (197)** : hors périmètre. On ne corrige un mineur que s'il tombe sous la même modification qu'un majeur ou un bloquant traité. Les autres restent dans le rapport.

Règles par défaut, applicables sans nouvel arbitrage (réversibles en une édition, à contester au plan si besoin) :

- **Invariant 5, nom de molécule libre** (c-4-46 diabète, c-6-22 cardio) : aucune classe n'est présélectionnée. L'effet s'énonce **au nom de la classe choisie**, jamais accolé au texte libre saisi.
- **Suivi diabète** (c-4-40 à c-4-43) : chaque examen garde **sa propre fréquence en mois**, indépendante du rythme des consultations. Le statut « Fait » vaut **par rendez-vous**, pas par examen. Les valeurs de fréquence elles-mêmes restent `// à revalider (Thibault — ADA/HAS-SFD)` : ce n'est pas l'objet du plan.
- **Tirelire patient** (c-7-18) : la correction rend l'écriture sûre au montage (aucune écriture avant la restauration), que le défaut se reproduise ou non en build de production.

### Plan B — courbes (T-C1 + écarts insulines)

**Ordre imposé** : la preuve G1 d'abord (`/recherche-preuve-etp`) sur la bande cible à 180 mg/dL et sur des pics de repas plausibles. Tant qu'elle n'est pas validée, rien ne se code côté glycémie. Le côté nicotine/tension n'en dépend pas.

**Critère de netteté** (repris de l'audit) : un écart est **net** s'il fait ≥ 20 px à 1024 × 768, **visible de près** de 8 à 20 px, **imperceptible** sous 8 px. Les tests l'expriment en points du modèle, convertis avec la taille **finale** de chaque graphique (elle change si le graphique est agrandi).

**Cibles visibles** :

| Courbe | Cible |
| --- | --- |
| Nicotine, 10 cig/j (1 toutes les 1 h 30) | chaque creux entre deux cigarettes passe en zone Manque ; oscillation ≥ 20 px |
| Nicotine, 20 cig/j (1 toutes les 45 min) | jamais en Surdosage, marge ≥ 20 px sous le seuil |
| Nicotine, titration patch + cigarette | sous le seuil au premier patch ; à partir d'un palier > 1 patch, au-dessus du seuil de ≥ 20 px |
| Nicotine, événements isolés (1 cigarette, patch seul, substituts) | conservent leur verdict « sert, net » |
| Tension, 10 et 20 cig/j | un yo-yo à chaque cigarette, ≥ 20 px ; creux du fumeur toujours au-dessus du non-fumeur |
| Alimentation ① | chaque ajout (légume, protéine, matière grasse) baisse le pic de ≥ 20 px |
| Activité ③, marche | effet décroissant avec le délai, ≥ 20 px à +0 min, jamais nul (≥ 8 px) au bout du curseur |
| Activité ③, micro-coupures | cumul visible : chaque palier distinct, 6 coupures contre 1 ≥ 20 px |
| Insuline basale | « plusieurs nuits qui montent » + « laisser pareil » sort de la cible au réveil de ≥ 20 px ; « déjà haut, stable » est au-dessus de la cible la nuit ; nuit au premier plan, journée atténuée ; graphique agrandi |
| Échelle diabète | bande cible recalée sur 180 mg/dL, pics de repas plausibles, **après G1** |

Leviers admis : constantes et formes des modèles, bornes de zones, **taille et position des graphiques** (Alimentation sous la ligne de flottaison, basale trop petite). Les onglets Alimentation ② ④ et les doublons n'ont pas de cible : une amélioration obtenue au passage est bienvenue, mais pas exigée.

**Écarts texte/courbe des insulines** (règle « cas par cas » retenue) :

- **c-4-58** (« Dans la cible » × « Moins de dose ») : **la courbe se corrige**, le pic doit sortir de la cible comme le dit le texte.
- **c-4-59** (le bon moment) : **le texte se corrige**, il signale le creux sous la cible (risque d'hypo), comme l'onglet ① le fait déjà.
- **c-4-63, c-4-64, c-4-65** : textes réécrits **après** le recalibrage et la nouvelle bande, contre la courbe finale.
- Après le passage à 180 mg/dL, les 24 combinaisons texte/courbe de l'insuline rapide se recontrôlent : la bande élargie peut faire basculer des verdicts aujourd'hui conformes.

**Tests** : les invariants qui encodent la pharmacocinétique (demi-vie testée, `nicotineCurve.test.ts:220-232`, et apparentés) peuvent être supprimés ou réécrits en cibles visibles. L'API publique consommée par les modules reste stable autant que possible ; les exports réservés aux tests peuvent changer.

**Mention** : chaque courbe recalibrée affiche « schéma illustratif ». Elle existe en nicotine (`NicotineModule.tsx:520`) ; pour la tension, elle n'est que dans l'`aria-label`, et pour le diabète elle est à vérifier.

### Contexte

Deux audits datés du 2026-10-06. La revue d'usage (8 parcours, 31 tronçons) a trouvé 26 bloquants, 69 majeurs et 197 mineurs, regroupés par cause en T-U1 à T-U9. L'audit des courbes a calculé 17 courbes avec les fonctions du projet et les a mesurées à l'écran. Il conclut que les événements isolés fonctionnent, mais que les messages de **répétition** (journée du fumeur, ajouts successifs, micro-coupures) et de **seuil fin** (titration, dérive de nuit) ne se voient pas ou contredisent le propos. Cause principale : la saturation des modèles, la demi-vie de 2 h et des graphiques trop petits.

### Alternatives envisagées

- **Courbes d'abord**, ou **un seul plan** : écartés. Les bloquants de niveau A auraient attendu une preuve clinique, et un blocage G1 aurait figé des sessions mécaniques.
- **Garder le modèle réaliste** et amender le propos (le fumeur reste en Confort) : écarté. Cela revenait sur les réponses du 2026-10-06, et le yo-yo, message central du module, restait invisible.
- **Texte validé qui fait foi partout** (insulines) : écarté. c-4-59 serait resté muet sur un creux d'hypo visible.
- **Ajouter la titration à l'app patient** : reporté. C'est une fonctionnalité neuve, alors que le livret porte déjà la dose.

### Raison du choix

Un support de consultation sert d'abord le message que le soignant commente à ~1 m. L'audit montre que le réalisme de la décision ③ et ce message sont incompatibles sur la journée du fumeur. Entre les deux, le propos l'emporte, et le caractère illustratif est affiché. Séparer les plans isole le seul chantier à risque (modèles testés, gate clinique) des corrections mécaniques.

### Conséquences

- Décision ③ du 2026-07-10 archivée au registre, remplacée par celle-ci.
- `PROJECT_BRIEF.md` : MVP §5 sans titration, nouvelle ligne en Version 2. `CLAUDE.md` : exemple de l'invariant 1 ajusté.
- `TASKS.md` : T-U8 sans c-4-58/59, T-U9 avec c-7-3 réglé par retrait du renvoi, T-C1 enrichi des écarts insulines.
- Hors de ces deux plans, et inchangés : checklist manuelle du rapport (Thibault), cardio « Mon suivi » (M12 à revalider), page racine `/` vide, sources par module (backlog existant).

### Impact IA

`/nouveau-plan` lit cette décision pour le plan A, puis, à froid, de nouveau pour le plan B. Le plan B ne refait pas l'arbitrage réalisme/illustratif : il cherche les réglages qui atteignent les cibles du tableau. Si une cible se révèle inatteignable en même temps qu'une autre (par exemple Manque à 10 cig/j et patch seul en Confort stable), c'est un **STOP avec options**, pas un assouplissement silencieux du seuil.

### État final de la grille

- `OPEN` — **G1 bande 180 mg/dL et pics de repas** : `/recherche-preuve-etp`, validée par Thibault, première session du plan B.
- `OPEN` — **fréquences du Suivi diabète** (valeurs) : Thibault, hors plan A (seul le modèle est corrigé).
- `OPEN` — **checklist manuelle** du rapport d'usage (impression, QR, lecteur d'écran, tablette hors-ligne) : Thibault, à la main.
- `OPEN` — **règles par défaut du plan A** (invariant 5, Suivi) : tenues sauf contestation de Thibault à la relecture du plan.
