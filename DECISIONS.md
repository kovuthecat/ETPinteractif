# DECISIONS.md

Journal des décisions techniques et produit.

## Format recommandé

```md
## YYYY-MM-DD — Titre de la décision

### Décision
### Contexte
### Alternatives envisagées
### Raison du choix
### Conséquences
### Impact IA
```

---

## Décisions

## 2026-06-28 — Cadrage initial du projet ETP interactif (thème : sevrage tabagique)

### Décision

Créer une application web interactive d'éducation thérapeutique, multi-thèmes par conception,
dont le premier contenu est le **sevrage tabagique**. Quatre choix structurants ont été arrêtés :

1. **Contexte d'usage** : en consultation, soignant + patient sur un écran/tablette partagé.
2. **Navigation** : choix libre par centres d'intérêt (carte de modules non-linéaire), pas de questionnaire de profilage imposé.
3. **Données** : aucune persistance — toute interaction est éphémère.
4. **Stack** : Vite + React + TypeScript, local-first, sans backend.

### Contexte

Outil professionnel pour un soignant. Besoin d'un support visuel et interactif (pas un diaporama),
utilisable au cabinet, sur un poste potentiellement partagé.

### Alternatives envisagées

- Navigation : profilage Fagerström + Prochaska auto-adaptatif → écarté (rigidifie, alourdit ; le soignant
  pilote déjà l'entretien). Fagerström/Prochaska pourront exister comme **modules** visuels parmi d'autres.
- Données : sauvegarde locale (localStorage) ou fiche récap → écarté en v1 pour sécurité RGPD maximale
  sur poste partagé. Une **fiche imprimable éphémère** (générée puis non stockée) reste envisageable plus tard.
- Stack : Next.js → écarté (SSR/serveur superflu ici, plus lourd à maintenir).

### Raison du choix

Maximiser simplicité, sécurité des données patient et alignement avec les autres projets de Thibault
(même stack que recettes / FermentLab / cosme-diy).

### Conséquences

- Aucun backend, aucune base : déploiement statique trivial, hors-ligne possible.
- L'architecture doit prévoir un **moteur de modules générique** réutilisable pour de futurs thèmes.
- Le contenu médical devra être sourcé (HAS, Tabac Info Service).

### Impact IA

- Complexité : faible. Coût de maintenance IA : faible (modules isolés).
- Contexte nécessaire : faible si l'organisation feature-first par module est respectée.
- `PROJECT_MAP.md` : à créer/maintenir dès le scaffolding du code.

## 2026-06-28 — Cadrage des 6 premiers modules

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

## 2026-06-28 — Données cliniques + choix techniques d'implémentation

### Décision

- **Titration patch** : on illustre la **méthode**, pas de calcul de dose. ¼ de patch (sécables) tous les 2-3 jours
  tant que l'envie persiste sans surdosage ; pas de dose max (borne = ressenti) ; retour à la dose précédente si
  surdosage (nausées, écœurement, céphalées, palpitations, rêves intenses) ; nuance jour/nuit ; visée d'autonomisation.
- **Vapoteuse** : outil d'aide à l'arrêt à part entière ; dosage qualitatif.
- **Craving** : 4 D (Différer, Distraire, Décontracter, De l'eau) + Tabac Info Service 39 89 ; minuteur « vague ».
- **Sources** : affichage discret (icône → pop-over).
- **Pile technique** : Vite + React + TS ; **CSS Modules** ; **pas de router** (navigation par état) ;
  **pas de lib de graphes** (SVG pur) ; seule dépendance UI ajoutée : `lucide-react` (icônes).

### Contexte

Données fournies par Thibault. Rédaction du plan d'exécution `PLAN_modules-tabac.md` (T1–T11) pour Sonnet/Codex/Haiku.

### Alternatives envisagées

- React Router → écarté (kiosque sans URL, hors-ligne, zéro besoin).
- Lib de graphes (recharts…) → écarté (courbes simples en SVG, garder les dépendances minimales).
- Calculateur de dose → écarté (choix clinique : illustrer la méthode, autonomiser).

### Raison du choix

Simplicité, légèreté, hors-ligne, et fidélité à l'intention pédagogique (méthode > calcul).

### Conséquences

- Un utilitaire de courbe partagé (`src/lib/nicotineCurve.ts`) sert aux Modules 2 et 5.
- Le contrat « App rend ModuleShell, les modules ne rendent que leur contenu » fixe la navigation/sources.
- Contenu non bloquant restant : sources exactes + détail des formes de substituts.

### Impact IA

- Plan découpé en tâches atomiques taguées par modèle → faible coût d'exécution.
- Constantes/signatures figées dans le plan → pas de reconception par les exécutants.

## 2026-06-28 — C4 : récit illustratif du modèle de stress (soulagement)

### Décision

Pour la tâche C4 (`PLAN_corrections-ux.md`), en l'absence d'un récit chiffré fourni par Thibault, Claude a
codé une **proposition plausible** dans `sampleStress()` (`src/lib/nicotineCurve.ts`) :
- non-fumeur : stress basal constant `STRESS_BASAL_NON_FUMEUR = 0.25` (échelle relative 0–1), aucune nicotine.
- fumeur : stress dérivé de la nicotinémie (`STRESS_BASAL_FUMEUR + STRESS_AMPLITUDE_MANQUE * (1 - nicotine)`),
  avec `STRESS_BASAL_FUMEUR = 0.30` (plancher, juste après une cigarette) et `STRESS_AMPLITUDE_MANQUE = 0.35`
  (plafond ≈ 0.65 en l'absence de cigarette récente). La chute de stress est synchronisée exactement avec le
  pic de nicotine (même cinétique que `cigaretteKernel`).

### Contexte

Le PLAN marque C4 comme « proposition + validation Thibault » (pas de blocage) : Claude propose une forme
schématique marquée « illustrative », Thibault valide le récit après coup (cf. arbitrage du 28/06 dans
`PLAN_corrections-ux.md` §Arbitrages).

### Alternatives envisagées

- Attendre le contenu de Thibault avant de coder (comme C10) → écarté, le PLAN autorise explicitement une
  proposition illustrative pour C4.
- Modèle de stress indépendant de la courbe de nicotine (deux fonctions séparées) → écarté au profit d'une
  dérivation directe de `sampleCurve` (une seule source de vérité pour la cinétique, moins de duplication).

### Raison du choix

Débloquer la tâche sans inventer de chiffre clinique : les valeurs sont explicitement relatives/illustratives,
documentées en tête de `nicotineCurve.ts` et listées comme question d'arbitrage dans `VALIDATION.md`.

### Conséquences

- `sampleStress()` est **dérivée** de `sampleCurve()` : un seul kernel cigarette à ajuster si Thibault demande
  une cinétique différente.
- Question ouverte non bloquante : amplitudes (0.25 / 0.30 / 0.35) à valider ou ajuster par Thibault.

### Impact IA

- Si Thibault demande un ajustement, modifier uniquement les 3 constantes `STRESS_*` dans `nicotineCurve.ts`
  (pas de reconception du composant `SoulagementModule.tsx`).

## 2026-06-28 - C7 : recomposition libre de l'affiche nicotine / toxiques

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

## 2026-07-01 — R5 : soulagement en bac à sable temps réel (fin de la bascule d'onglets)

### Décision

Le module Soulagement (`SoulagementModule.tsx`) abandonne la bascule d'onglets « Non-fumeur / Fumeur » au
profit d'un **bac à sable temps réel calqué sur R4** : un balayage continu (façon oscilloscope) tourne dès
l'ouverture ; cliquer « Fumer une cigarette » insère la prise au temps courant et le stress chute
immédiatement, synchronisé au pic de nicotine, puis remonte. Le non-fumeur n'est plus un écran séparé mais un
**repère superposé sur la même courbe** via un bouton unique « Comparer au non-fumeur ».

### Contexte

Arbitrage de Thibault (2026-07-01, `PLAN_corrections-v2.md` R5) : la bascule d'onglets était jugée moins
pédagogique qu'un modèle temps réel montrant, sur un seul graphe, que le creux du fumeur reste toujours
au-dessus du niveau stable du non-fumeur.

### Alternatives envisagées

- Garder deux courbes indépendantes (fumeur vs non-fumeur) calculées séparément → écarté : `sampleStress()`
  dérive déjà les deux du même modèle (`STRESS_BASAL_*`), pas besoin de dupliquer la logique.
- Positionner dynamiquement le repère non-fumeur au ras du creux observé (calcul par render) → écarté : le
  repère est une **constante** (`STRESS_BASAL_NON_FUMEUR`), et l'invariant « toujours sous le creux fumeur »
  est déjà garanti *par construction* (le plancher structurel du stress fumeur = `STRESS_BASAL_FUMEUR`, même
  si la nicotine sature à 1), donc un calcul dynamique aurait été une complexité inutile.

### Raison du choix

Cohérence avec R4 (même mécanique de balayage, même vocabulaire visuel) et invariant pédagogique garanti sans
calcul additionnel : `STRESS_BASAL_FUMEUR (0.30) > STRESS_BASAL_NON_FUMEUR (0.25)` est vérifié pour toute
composition d'événements, y compris la saturation multi-cigarettes (couvert par 2 nouveaux tests Vitest dans
`nicotineCurve.test.ts`, 17 tests au total).

### Conséquences

- `nicotineCurve.ts` n'a **pas changé de formule** : seule sa consommation change (événements accumulés en
  continu au lieu d'une liste fixe de 5 cigarettes pour la démo statique).
- Les amplitudes (0.25 / 0.30 / 0.35, cf. décision C4 ci-dessus) restent des valeurs illustratives **non
  re-validées** dans ce nouveau contexte interactif — question toujours ouverte dans `VALIDATION.md` §R5.

### Impact IA

- Si Thibault ajuste les amplitudes, modifier uniquement les constantes `STRESS_*` dans `nicotineCurve.ts` ;
  aucun changement requis dans `SoulagementModule.tsx` (qui ne fait que consommer `sampleStress`).
- Une évolution médicale modifie le contenu, pas la structure de la scène.

## 2026-07-01 — R9 : module 7 « Explorer ma motivation », focus positif (pas de balance décisionnelle)

### Décision

Ajout d'un 7ᵉ module, **sans balance décisionnelle** (avantages/inconvénients du tabac), au profit de deux
outils centrés sur le positif : (A) échelles 0–10 importance/confiance avec relance non culpabilisante
(« pourquoi pas *n − 1* ? » / « qu'est-ce qui aiderait à passer à *n + 1* ? ») ; (C) un tableau blanc « Mes
raisons » (cartes déplaçables, éditables, création libre). Le drag & drop est implémenté avec des **pointer
events natifs** sur un `<button>` poignée (pas de librairie) : la même poignée gère aussi le déplacement au
**clavier** (flèches directionnelles), ce qui couvre l'accessibilité clavier sans bouton de secours séparé.
Les positions des cartes sont stockées en **pourcentages relatifs** du conteneur (pas en pixels), pour rester
stables au redimensionnement/tablette sans recalcul.

### Contexte

Arbitrage de Thibault (2026-07-01, `PLAN_corrections-v2.md` R9) : la balance décisionnelle classique était
jugée limitante pour ce public. `App.tsx` étant déjà générique (rendu par `MODULES.find`), aucune modification
n'a été nécessaire dans le moteur — seuls `types.ts` et `registry.ts` ont été touchés, conformément à
l'invariant 4 (rien de spécifique au tabac dans le moteur générique).

### Alternatives envisagées

- Positions en pixels absolus recalculées au resize → écarté : plus de code, plus fragile, alors que les
  pourcentages résolvent nativement le problème.
- Boutons de déplacement séparés (↑↓←→) en plus du drag → écarté : la poignée `<button>` gère déjà les deux
  modes (pointer + clavier) sur le même élément, un doublon aurait été une complexité inutile pour rien de
  plus accessible.

### Raison du choix

Minimise la surface de code, respecte l'invariant « zéro dépendance runtime ajoutée » et l'invariant
accessibilité (cibles ≥ 44 px via la règle globale `button`, clavier fonctionnel).

### Conséquences

- Contenu de départ du module (libellés des 2 échelles, 6 cartes seed) = **proposition non sourcée** de
  Claude, marquée comme telle dans `docs/contenu-modules.md` §Module 7 et dans `VALIDATION.md` §R9 — à
  valider/ajuster par Thibault, sans bloquer le reste du module.

### Impact IA

- Si Thibault change la liste de cartes seed ou les libellés d'échelle, modifier uniquement les constantes
  `SEED_CARTES` / les chaînes de labels dans `MotivationModule.tsx` — aucune reconception de la mécanique de
  drag ou des échelles n'est nécessaire.
