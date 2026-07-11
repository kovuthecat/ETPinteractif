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

## 2026-07-08 — Refonte visuelle complète : système de design Claude Design + nouveau modèle de courbes (S1-S10 + S2-S9)

### Décision

Refonte complète de l'UI de l'ETP interactif basée sur la maquette Claude Design (`maquettes/ETP Tabac - Standalone.html`),
exécutée en **deux vagues parallèles** :

**Vague 1 (S1, socle bloquant) :**
1. **Polices** : auto-hébergement de Source Serif 4 (titres) + Work Sans (corps) en `public/fonts/` (`@font-face` dans
   `global.css`, préchargement dans `index.html`) — fin du chargement CDN Google Fonts, fonctionnement garanti hors-ligne.
2. **Tokens CSS** : remplacement complet de la palette hex par tokens `oklch` sémantiques — fonds crème, texte brun éditoriale,
   séries confort/toxique/vigilance/nav, alpha soft (ex. `--zone-confort: oklch(70% 0.05 120)`), rayons `sm/·/lg/pill`,
   ombres brunes 1/2/3. Noms historiques (`--color-accent`, `--color-warn`) conservés pour compatibilité.
3. **Primitives globales** dans `global.css` : `.eyebrow`, `.btn` (4 variantes : primary/ghost/tertiary/danger),
   `.chip`, `.card`, `.panel`, `.callout`, `.alert`, classes d'annotation `.zone-fill--*` / `.zone-label--*` pour
   codification de zones de graphe (confort/toxique/vigilance).

**Vague 2 (S10 + S2-S9 en parallèle, 8 agents) :**
- **S10** : réécriture de `src/lib/nicotineCurve.ts` + tests — nouveau modèle 0–100 / 24 h transcrit du handoff
  (vs. ancien modèle 0–10 / heures arbitraires). Affects Module 2 (Nicotine) et Module 5 (Soulagement).
- **S2-S9** : restyle de tous les modules (accueil, coquille, Addiction, Nicotine, Substituts, Nicotine-toxique,
  Soulagement, Craving) + réécriture Motivation (cadran circulaire + interaction simplifiée). Toutes les zones
  consomment les primitives S1, aucun override local de `tokens.css`/`global.css`.

### Contexte

Maquette Claude Design fournie par Thibault (2026-07-06), validée pour capturer le système de design complet (typo,
couleurs, composants, interactions). Objectif : réaliser fidèlement le design visuel et interactif du handoff, débranchant
l'ancienne palette ad-hoc et l'ergonomie piecemeal des phases antérieures (R1-R9, V1-V8, A1-A12).

### Alternatives envisagées

- Rester sur la palette hex + bootstrap-like : écartée (rupture avec la direction du design Thibault, pas de cohérence
  sémantique, plus coûteux à maintenir).
- Implémenter la refonte par modules (par exemple S2 une semaine, puis S3 la semaine d'après) : écartée au profit de
  l'exécution parallèle vague 2 (accélère le time-to-delivery, zones disjointes = pas de conflits merge).

### Raison du choix

Maximiser la fidélité au design tout en minimisant la refonte incrementale coûteuse. Un socle S1 figé permet à S2-S9
de progresser en parallèle sans débordement de tokens ou de composants. Le nouveau modèle de courbes S10 est nécessaire
pour que S4/S7 implémentent fidèlement le handoff (grille 0–100/24h vs. ancien schéma arbitraire).

### Conséquences

- **Tous les modules** sont redessinés ; aucune dépendance visuelle sur l'ancienne palette.
- `src/lib/nicotineCurve.ts` rebasé sur la grille handoff ; interfaces Modules 2/5 restent stables (mêmes props),
  logique interne transformée. Tests Vitest couvrent les invariants (monotonie, cumul, stress-basal).
- `npm run dev` + `npm run build` et `npm run test` doivent passer après chaque session ; validation visuelle déléguée
  à Thibault (passe de review de la maquette vs. rendu produit).
- Pas d'ajout de dépendances runtime (animation, router, libs de design). Primitives générées manuellement en CSS.

### Impact IA

- Contexts complexe mais bien scopé par design (`docs/DESIGN_REFONTE.md` + `maquettes/handoff/` autorités primaires).
- Zones disjointes → travail parallèle à bas risque de merge conflict.
- Validation gate (`tsc -b`, `vite build`, `vitest run`) automatique ; validation visuelle humaine non bloquante
  pour commit mais signalée dans `VALIDATION.md`.
- Si correction ultérieure : localiser le `.module.css` du module impacté dans `src/features/<slug>/` ou la règle
  dans `global.css` (primitives) / `tokens.css` (variables). Modifications de `nicotineCurve.ts` affectent S4/S7 seulement.

## 2026-07-08 — Introduction du moteur multi-thèmes + scaffold du thème diabète

### Décision

Généraliser le moteur, jusqu'ici implicitement câblé pour le tabac, pour qu'il accueille plusieurs
thèmes ETP, et scaffolder un 2e thème `diabete` (sans contenu) pour valider le moteur de bout en bout :

1. **Déplacement** : les 7 modules tabac + `registry.ts` + `src/lib/nicotineCurve.ts` déménagent sous
   `src/features/tabac/` (via `git mv`, historique préservé). `src/features/registry.ts` devient le
   registre des **thèmes** (`THEMES: ThemeDef[]`), chaque thème import son propre `registry.ts`
   (`tabac/registry.ts`, `diabete/registry.ts`).
2. **Types généralisés** (`src/features/types.ts`) : `ModuleId`/`FamilleId` passent d'unions littérales
   tabac-spécifiques à `string` ; `Hue` (déplacé depuis `ModuleCard.tsx`) rejoint `ModuleDef.hue` ;
   nouveaux types `FamilleDef` et `ThemeDef { id, titre, eyebrow, description, familles, modules,
   enConstruction? }`.
3. **Navigation à 3 niveaux** dans `App.tsx` : `{type:'themes'} | {type:'home', themeId} |
   {type:'module', themeId, moduleId}`. L'écran de sélection de thème (`ThemeSelector`, nouveau
   composant) ne s'affiche que si `THEMES.length > 1` — avec un seul thème, on saute directement à
   l'accueil (zéro friction ajoutée pour l'usage tabac actuel).
4. **`Home.tsx` reçoit `theme: ThemeDef` en prop** au lieu d'importer `MODULES` directement ; les
   tables locales `HUES` et `FAMILLES` (codées en dur avec les ids de modules tabac) sont supprimées —
   remplacées par `m.hue` et `theme.familles`.
5. **Thème `diabete` scaffoldé vide** : `src/features/diabete/registry.ts` exporte `MODULES: []`,
   `THEMES` le référence avec `enConstruction: true`. `ThemeSelector` l'affiche non cliquable avec un
   badge « Bientôt disponible ». Le cadrage clinique (modules, contenu, sources) est explicitement
   hors scope de cette tâche — stub créé dans `docs/contenu-modules-diabete.md`.
6. **`docs/contenu-modules.md` renommé `docs/contenu-modules-tabac.md`** (contenu inchangé) pour
   préparer un fichier d'autorité par thème.

### Contexte

Thibault veut concevoir un module diabète. Le moteur était prêt en théorie (`docs/architecture.md`
anticipait déjà un type `Theme = { id, titre, modules }` dès le cadrage initial du 2026-06-28) mais
pas en pratique : `Home.tsx` avait un header « Programme ETP · Sevrage tabagique » en dur et des
tables (`HUES`, `FAMILLES`) indexées par les ids littéraux des 7 modules tabac — exactement le
couplage que l'invariant projet #4 interdit. Avant de cadrer le contenu diabète, il fallait que ce
couplage disparaisse.

### Alternatives envisagées

- Préfixer les ids de modules par thème (`tabac-addiction`, `diabete-alimentation`) pour garder
  `ModuleId` comme union littérale globale → écarté : la recherche de module est désormais scopée au
  thème courant (`theme.modules.find(...)`), donc l'unicité n'est requise qu'au sein d'un thème ; un
  préfixage aurait été de la complexité sans bénéfice.
- Ajouter directement du contenu diabète dans cette tâche → écarté : le cadrage clinique (comme celui
  fait pour le tabac le 2026-06-28) n'a pas encore eu lieu ; coder des modules sans cadrage validé
  risquerait une erreur médicale. Le scaffold vide prouve le moteur sans inventer de contenu.
- Garder `src/lib/nicotineCurve.ts` à la racine (utilitaire « partagé ») → écarté : c'est un modèle
  pharmacocinétique du tabac (nicotinémie/tension), consommé uniquement par 2 modules tabac ; il n'a
  rien de générique au moteur, donc il suit les modules sous `features/tabac/lib/`.

### Raison du choix

Respecter l'invariant #4 (généricité multi-thèmes) sans reconception lourde : le moteur (`types.ts`,
`registry.ts`, `src/components/`) ne connaît plus aucun nom de thème ni d'id de module en dur. Le
scaffold vide permet de valider l'architecture (build, tests, navigation) avant d'investir dans le
cadrage clinique du diabète.

### Conséquences

- Le contenu tabac est identique visuellement et fonctionnellement — pure réorganisation + généralisation.
- `docs/contenu-modules-diabete.md` (stub) et le backlog `TASKS.md` portent la prochaine étape :
  cadrage du contenu diabète avec Thibault, sur le modèle des décisions 2026-06-28 pour le tabac.
- Toute future addition de thème suit le même schéma : dossier `src/features/<theme>/registry.ts` +
  entrée dans `THEMES` (`src/features/registry.ts`) + fichier `docs/contenu-modules-<theme>.md`.

### Impact IA

- Si Thibault ajoute des modules diabète : uniquement toucher `src/features/diabete/` (nouveaux
  dossiers de module + `registry.ts`) et `docs/contenu-modules-diabete.md` — aucune modification du
  moteur générique nécessaire, sauf besoin réel non anticipé (à documenter ici si ça arrive).
- `PROJECT_MAP.md` mis à jour avec la nouvelle arborescence.

## 2026-07-08 — Cadrage diabète : fichier par module + sources probantes brutes

### Décision

Le stub `docs/contenu-modules-diabete.md` est remplacé par un dossier `docs/diabete/` : un fichier
`00-global.md` (grammaire commune, vue d'ensemble des 8 modules, journal des décisions) + un fichier
par module (`module-1-cest-quoi-le-diabete.md`, `module-2-alimentation.md`,
`module-3-activite-physique.md`, `module-4-risque-cardiovasculaire.md`, et un fichier groupé
`modules-5-8-cadrage.md` pour les 4 modules encore juste cadrés). Les rapports de synthèse
OpenEvidence fournis par Thibault (traitement, suivi, complications, risque CV, activité physique,
alimentation) sont rangés dans `docs/evidence-diabete/` (noms en kebab-case).

### Contexte

Thibault a fourni un premier jet de spécification complète (`SPEC_outil_ETP_diabete.md`, 336 lignes)
couvrant l'intention, la grammaire commune et le détail de 4 des 8 modules diabète, plus 6 rapports de
sources probantes. Le thème diabète compte plus de modules que le tabac (8 vs 7) avec un niveau de
détail par module plus élevé (ex. module Alimentation à lui seul comparable en taille à tout
`contenu-modules-tabac.md`) — un fichier unique grossirait au point de devenir coûteux à charger en
contexte IA à mesure que les 8 modules seraient spécifiés puis codés.

### Alternatives envisagées

- Garder un fichier unique `docs/contenu-modules-diabete.md` comme pour le tabac → écarté : le tabac
  est un contenu **clos** (7 modules déjà codés), alors que le diabète est en cadrage **actif** et va
  continuer à grossir ; le fichier unique serait déjà le plus long du repo avant même d'avoir codé un
  seul module.
- Un fichier par module dès le départ, y compris pour les modules 5-8 encore sommaires → écarté pour
  l'instant : ces 4 modules n'ont que quelques lignes de cadrage chacun (pas encore de détail
  écran-par-écran) ; les regrouper dans `modules-5-8-cadrage.md` évite 4 fichiers quasi vides, à
  éclater plus tard quand chacun sera vraiment spécifié.

### Raison du choix

Le découpage par module est le même principe que le découpage `features/<theme>/<module>/` déjà en
place côté code : quand on travaille sur un module diabète (cadrage, design, câblage), on ne charge
que son fichier + `00-global.md`, jamais l'intégralité du contenu des 8 modules.

### Conséquences

- Toute référence à `docs/contenu-modules-diabete.md` dans le repo pointe maintenant vers
  `docs/diabete/00-global.md` (ou le fichier de module concerné) — mises à jour dans `PROJECT_MAP.md`,
  `CLAUDE.md`, `STATUS.md`, `ROADMAP.md`, `TASKS.md`.
- `registry.ts` du thème diabète reste `MODULES: []` — ce découpage ne change rien au statut « pas
  encore câblé » ; les 4 modules spécifiés (1, 2, 3, 4) sont prêts pour la maquette Claude Design, pas
  encore pour le code.

### Impact IA

- Pattern à réutiliser pour un futur thème volumineux : `docs/<theme>/00-global.md` + un fichier par
  module, plutôt qu'un fichier unique `docs/contenu-modules-<theme>.md` — à trancher au cas par cas
  selon le nombre de modules et leur profondeur attendue (le tabac, plus petit et clos, reste en
  fichier unique).

## 2026-07-08 — Substituts : retrait de l'inhaleur et de la vapoteuse (5 formes)

### Décision

Le Module 3 (substituts & titration) ne propose plus que **5 formes** : patch, gomme, pastille,
comprimé sublingual, spray buccal. **Inhaleur** et **vapoteuse** sont retirés du sélecteur de formes.

### Contexte

Ces deux formes étaient les seules restées sans contenu validé (affichées « Fiche en cours de
rédaction — à voir avec votre soignant », état `enRedaction`). Plutôt que de rédiger leur contenu,
Thibault (autorité clinique) a tranché pour leur retrait lors du dépouillement des questions ouvertes
de `VALIDATION.md` (2026-07-08).

### Alternatives envisagées

- Rédiger le contenu bonnes pratiques / erreurs pour l'inhaleur et la vapoteuse → écarté par Thibault.
- Garder le repli « en rédaction » indéfiniment → écarté : laisse deux formes vides dans le sélecteur.

### Raison du choix

Un module qui ne présente que des formes à contenu validé ; suppression du mécanisme `enRedaction`
devenu inutile (code mort). Décision de l'expert clinique.

### Conséquences

- **Revient sur une décision antérieure du 2026-06-28** (« Substituts : toutes les formes + la
  vapoteuse ») pour le périmètre du Module 3. La vapoteuse **reste** un outil d'aide à l'arrêt à part
  entière et **demeure présente comme geste du bac à sable Nicotine (Module 2)** — seule sa présence
  comme « forme de substitut » du Module 3 est retirée.
- `SubstitutsModule.tsx` : type `FormeId` réduit à 5, `FORMES_DATA` idem, suppression du type
  `enRedaction`, de sa branche de rendu (`panelRedaction`) et des classes CSS associées
  (`formeCardMuted`, `panelRedaction`). `tsc -b` + `vite build` verts.
- `docs/contenu-modules-tabac.md` mis à jour (décision transverse, Module 3, données cliniques,
  « reste à fournir »).

### Impact IA

- `docs/contenu-modules-tabac.md` reste l'autorité : le Module 3 = 5 formes. Ne pas réintroduire
  inhaleur/vapoteuse comme formes sans une nouvelle décision de Thibault.
- **Question laissée ouverte** (signalée à Thibault) : faut-il aussi retirer la vapoteuse du bac à
  sable Nicotine (Module 2) et des renvois du Module 4, ou la démonstration de cinétique la garde-t-elle ?

## 2026-07-09 — Extensions tabac au niveau du brief diabète, en v1 directe sans maquette

### Décision

Suite à l'analyse comparative code tabac ↔ brief diabète (session Fable du 2026-07-09), lancer
5 chantiers d'extension du thème tabac, **sans passage par Claude Design** (v1 directe composée
depuis le design system existant) :

1. **Fiches à emporter imprimables** (4 : carte anti-envie, méthode patch, mes raisons, plan
   d'arrêt) via un composant générique `FicheOverlay` — impression à la volée, zéro persistance.
2. **Nouveau module « Mon plan d'arrêt »** (famille Agir) — le module d'application qui clôt
   l'arc, fiche « frigo » à ROI maximal.
3. **Généralisation des portes de fin de module** (`ModuleFooterNav`, extrait de nicotine-toxique)
   et du **2ᵉ niveau de lecture** (`InfoHover`, extrait des tooltips de zones de nicotine).
4. **Fil rouge** du thème : « C'est la fumée qui rend malade. C'est le manque qui fait fumer.
   Et le manque, ça se traite. » (exergue accueil + clôtures Comprendre + pieds de fiches).
5. **`docs/BRIEF_TABAC.md`** : nouveau référentiel design/pédagogie du thème (rédigé par Fable,
   le code faisant foi pour l'existant) + resynchronisation des docs dépassées.

### Contexte

Le brief diabète (`docs/diabete/BRIEF_DESIGN_diabete.md`) a posé une barre de conception
(fiches à emporter, personnalisation, fil rouge, ponts scénarisés, 2ᵉ niveau au survol) que le
thème tabac — construit avant — n'atteint pas, alors que le code tabac contient déjà des embryons
de ces mécanismes (portes de nicotine-toxique, tooltips de zones de nicotine). Constat clé :
le thème tabac est 100 % démonstration/exploration, sans module d'application ni artefact emporté.

### Alternatives envisagées

- **Maquette Claude Design d'abord** (pipeline Templates habituel pour toute UI nouvelle) —
  écartée pour cette v1 : le module Plan d'arrêt est compositionnel (réutilise chips, quarts de
  patch, 4D, cartes raisons déjà dessinés) et le design system est documenté (`DESIGN_REFONTE.md`).
  Recours possible : repasser par Claude Design si la validation visuelle humaine déçoit.
- Import automatique des raisons (module Motivation → Plan d'arrêt) — écarté : zéro persistance
  inter-modules ; la re-sélection par chips se fait en parlant.

### Raison du choix

Coût d'essai faible (validation visuelle humaine = filet existant), vitesse, et cohérence garantie
par la composition de primitives déjà maquettées.

### Conséquences

- Plans exécutables Sonnet : `plans/extensions-tabac/X1..X7` (vagues : X1 → X2-X5 parallèles → X6 → X7).
- Nouveau référentiel `docs/BRIEF_TABAC.md` ; `contenu-modules-tabac.md` et `STATUS.md` seront
  resynchronisés en X7 (des dérives doc/code y sont recensées).
- Validations Thibault en attente listées dans `BRIEF_TABAC.md §5` (libellé fil rouge, contenus
  2ᵉ niveau + sources, libellés plan d'arrêt) — le 2ᵉ niveau n'est câblé qu'après validation.

### Impact IA

- Pour toute modification du thème tabac : lire `docs/BRIEF_TABAC.md` (design/pédagogie) en plus
  de `contenu-modules-tabac.md` (contenu médical). **Le code reste la source de vérité de
  l'existant** tant que X7 n'a pas resynchronisé les docs.
- `FicheOverlay`, `ModuleFooterNav`, `InfoHover` sont des composants **moteur** (génériques,
  multi-thèmes) : ne jamais y coder de contenu tabac en dur — le thème diabète les réutilisera.

## 2026-07-09 — Câblage du thème diabète (plan theme-diabete, S1-S13)

### Décision

Implémenter les **9 modules du thème diabète** fidèlement à la maquette Claude Design (handoff
2026-07-09) et à la SPEC pédagogique (`docs/diabete/SPEC_outil_ETP_diabete.md`). Cinq décisions
transverses :

1. **Modèle glycémie paramétrique testé** (remplace le score linéaire de la maquette) : lib
   `glycemieCurve.ts` (S2, 50 tests Vitest) modèle temporel physiologiquement plausible,
   temps réel en abscisse (minutes), niveau 0–100 (relative), avec invariants testés
   (repas mixte → pic adouci & retardé ; activité précoce → pic écrêté ; récupération 15 g
   → latence ~5 min ; overshoot à 2ᵉ prise ; TIR vivant avec bande du profil). Chaque module
   (2 Alimentation, 3 Activité, 8 Hypoglycémie, 9 Insuline) **consomme cette lib sans la
   modifier** — une seule identité courbe, rendue par `CourbeGlycemie` (S3).

2. **Silhouette SVG dessinée à la main** (pas d'image) : `Silhouette.tsx` (S3) corps humain
   stylisé, sobre, digne (pas de mannequin médical), avec ancres nommées (cerveau, yeux, cœur,
   cou, reins, nerfs, jambes, pied) + motif vaisseaux discret. États visuels (actif, ouvert,
   verrouillé, allumé, masqué) utilisés par modules 4 Risque cardiovasculaire, 5 Complications,
   7 Traitements, 6 Suivi.

3. **Convention IllustrationSlot + illustrations-diabete** : composant `IllustrationSlot` (S1)
   props `id` → `<img src="/illustrations/diabete/{id}.png">` + placeholder sobre
   (tuile crème, label gris). Convention d'ids slugifiés ASCII (`aliment-pomme`,
   `signe-tremblements`, `resucrage-jus`, etc.) dans `S1.md` ; illustrations générées par
   Claude Design → dépôt en `public/illustrations/diabete/` (zéro blocage si manquantes,
   placeholder affiché).

4. **Familles diabète** (définies dans `registry.ts`) : 3 familles (reprennent le pattern
   tabac Comprendre/Agir/Se motiver) — **Comprendre** (M1 Mécanisme, M4 Risque cardiovasculaire,
   M5 Complications), **Agir au quotidien** (M2 Alimentation, M3 Activité physique),
   **Se soigner** (M6 Suivi, M7 Traitements, M8 Hypoglycémie, M9 Insuline). Hues manuels par
   module (`nav`, `confort`, `toxique`, `vigilance`).

5. **Pas de police Caveat** (« effet manuscrit ») : remplacée par **Source Serif 4 italique**
   (cf. M7 Traitements champ molécule — l'italique serif substitue le manuscrit, déjà dans
   `tokens.css` et `global.css`). Aucune nouvelle police externe (constraint hors-ligne).

### Conséquences

- Lib `glycemieCurve.ts` spécifique au thème diabète, isolée dans `src/features/diabete/lib/`.
- 4 composants transversaux (S3) génériques diabète — s'ajoutent au moteur.
- Illustrations : convention d'ids fixée, génération en parallèle, rendu jamais bloqué.
- Vague 2 (S4-S12) : 9 agents parallèles, chacun seul écrivain de son module.

### Points ouverts (à revalider Thibault)

- Fréquences module 6 (ADA/HAS-SFD), seuils module 4, CG aliments module 2, phrases cliniques module 7.

### Impact IA

- Lire `docs/diabete/SPEC_outil_ETP_diabete.md` (autorité pédagogique) + `BRIEF_DESIGN_diabete.md`.
- `glycemieCurve.ts` : lib testée, jamais modifier sans revalider tests.
- Silhouette/CourbeGlycemie/PlaqueArtere/SignatureEvitable : composants moteur diabète, réutilisables.

## 2026-07-09 — Chantier alimentation-v2 (S1-S4) : déroulé pédagogique, lisibilité défi ② qualité, 2ᵉ niveau de lecture

### Décision

Amélioration du module 2 — Alimentation du thème diabète sur trois axes (validés 2026-07-09) :

1. **Déroulé pédagogique** : consigne remontée en haut de la scène, progression douce (coche par défi « joué » + CTA « Défi suivant → »), courbe fantôme « féculents seuls » au défi ①, duels suggérés (baguette/pain complet, riz blanc/basmati, riz blanc/lentilles, dattes/pastèque) au défi ②.

2. **Lisibilité des réponses du défi ② (Qualité / comparaison)** : identité visuelle par carte (A bleu nav, B prune, à poids égal), étiquettes directes (nom aliment) + marqueur de pic sur les courbes, badges de verdict francs (Pic bas/moyen/haut + ✓/✗ pictogramme), tracé animé au révèle.

3. **2ᵉ niveau de lecture** : données qualitatives d'affichage (portion, sel, qualité des graisses, oméga-3, fibres/protéines dérivées), câblage du composant générique `InfoHover` (survol **+ clic verrouillant**) sur le garde-manger et les cartes du défi ②, mention « vaisseaux » (pont fil rouge vers module Risque cardio). **+ C4** : 3 aliments oméga-3 (sardine, saumon, noix).

### Contexte

Suite à la maquette Claude Design handoff diabète, le module Alimentation (M2) doit servir de démonstrateur des capacités du 2ᵉ niveau de lecture générique (`InfoHover`) — préfiguration du cahier des charges pour les futurs modules diabète.

### Alternatives envisagées

- Consigne en bas de la scène (maquette d'origine) → écartée : déplacement en haut crée un contexte plus explicite du défi actif.
- Palette de couleurs consacrée pour A/B (confort/vigilance) → écartée : prune locale définie dans `CourbeGlycemie.module.css` (pas un token global) ; le désambiguïsement repose sur l'étiquette nominative, pas la couleur seule (double encodage).
- InfoHover générique non câblé sur diabète → écartée : l'intérêt du composant générique est sa réutilisation ; le câblage diabète valide l'architecture multi-thèmes.

### Raison du choix

Maximiser la pédagogie (clarté du défi, progression visible) et la réutilisabilité (moteur `InfoHover` générique, testable sur diabète en v1).

### Conséquences

- **S1** (`data.ts`) : ajout de champs qualitatifs à `Food` (portion, sel, graisses, omega3, atout) ; paliers dérivés pour fibres/protéines (constantes `// à revalider (Thibault)`) ; +3 aliments oméga-3 (sardine, saumon, noix, CG ~nulle).
- **S2** (`InfoHover`, `CourbeGlycemie`) : survol+clic verrouillant, variantes duo (duoA/duoB), marqueur de pic, étiquettes directes, tracé animé (props optionnelles, aucun impact sur les usages existants).
- **S3** (`AlimentationModule`) : caption repositionnée, coche+CTA progression, courbe fantôme ①, chips duels ②, verdicts badges ②, panneau `FoodDetail` au survol/clic des noms.
- **S4** (contexte) : `VALIDATION.md` checklist visuelle + table revalidation ; `DECISIONS.md` décisions transverses ; `PROJECT_MAP.md` ligne `alimentation/` mise à jour ; commits S1/S2/S3/contexte.

### Points ouverts (à revalider Thibault)

- **Valeurs qualitatives sel/graisses/oméga-3** (~27 aliments) : ordres de grandeur Ciqual/GI-GL, marqués `// à revalider`, table en entier dans `VALIDATION.md` S4.
- **Bande « moyen » du défi ②** (pics 47→50) : étroite, inchangée ici ; recalibrage ultérieur si les duels suggérés révèlent des verdicts contre-intuitifs.
- **Illustrations des 3 nouveaux aliments** : placeholders `IllustrationSlot` en attente des PNG (`public/illustrations/diabete/aliment-<id>.png`).

### Impact IA

- `InfoHover` devient un composant clé du moteur multi-thèmes — toute modification du pattern survol+clic doit être testée sur diabète (alimentation) + tabac (futur 2ᵉ niveau si câblé).
- `glycemieCurve.ts` inchangé (S14 gel de l'API) ; aucune dépendance ajoutée (CSS pur).
- Nouvelles constantes `// à revalider` dans `data.ts` et paliers — à valider avant clôture du chantier.

## 2026-07-09 — S14 : corrections revue visuelle — modèle repas par composition réelle + inversion D9 n°2

### Décision

Suite à la revue visuelle de Thibault sur build local (7 captures d'écran, 7 bugs), deux évolutions
structurantes en plus des correctifs ponctuels (`plans/theme-diabete/S14.md`) :

1. **Lib `glycemieCurve.ts` — modèle repas par composition réelle** (remplace le modèle S2/S5) :
   `paramsFromAssiette` ne dérive plus la courbe d'heuristiques de familles (« aliment-frein »
   comptés) + proximité à une assiette-modèle (½·¼·¼), mais de la **composition approximative
   réelle** de chaque aliment — `AlimentRepas { cg, fibres, proteines, lipides }` (grammes/charge
   réels par portion usuelle, plus l'échelle relative 0-100 d'avant). `Famille` et le paramètre
   `proportions` sortent entièrement de la lib : les familles ne vivent plus que côté modules
   (captions, pastilles, comparaisons UI), la lib ne les connaît plus. L'ordre du féculent devient
   gradué (`Assiette.ordreFeculent?: number`, 0 = en premier → 1 = en dernier) — le booléen
   `ordreFeculentDernier` disparaît sans compatibilité. Le scénario nocturne `'nuit_isolee'`
   (jugé trompeur : une nuit déviante rendue comme trace principale se lisait « la courbe
   plonge », pas « une nuit s'écarte ») est remplacé par `'descend_hypo_matinale'` (descente
   nocturne progressive → hypo au petit matin, le cas d'école du cran de moins sur la lente).
   Le raccord nuit→jour de `sampleJournee` devient continu (la portion jour repart du niveau de
   fin de nuit et revient vers `BASELINE` en ~90 min, au lieu d'un saut brutal à minuit).
2. **Inversion de la décision D9 n°2** (module 6 Suivi, posée en S9) : le cadran de l'année ne se
   pré-peuple plus automatiquement au montage (rythme standard + 7 examens visibles d'emblée) —
   il démarre **vide**, comme dans la maquette d'origine, et l'utilisateur le construit élément
   par élément (« Placer sur le cadran »). `initRevealedPrepeuple` est supprimée.

### Contexte

Thibault a testé le build local et fourni 7 captures d'écran commentées. Deux bugs (composition
défi 1, proportion défi 4) et une demande explicite (« la courbe augmente quand j'augmente les
protéines au détriment des féculents ») ont révélé que le modèle heuristique (comptage de familles
et distance à une assiette-modèle) ne collait pas à l'intuition physiologique attendue dans tous
les cas — la demande explicite du 2026-07-09 a été de refonder le calcul sur la composition réelle.
Le pré-peuplement du cadran (D9 n°2) a été jugé, à l'usage, contraire au geste pédagogique visé
(construire, pas contempler un cadran déjà rempli).

### Alternatives envisagées

- Corriger uniquement les symptômes (B1/B3) en gardant le modèle heuristique par familles → écarté :
  Thibault a explicitement demandé la refonte vers la composition réelle (§0.c du plan), le
  correctif ponctuel n'aurait pas réglé le défaut structurel (courbe insensible aux vraies
  portions).
- Garder `ordreFeculentDernier` en plus du nouveau champ gradué (compatibilité) → écarté par
  consigne du plan (« le booléen disparaît, pas de compat ») : un seul champ, migration complète
  des appelants dans la même session.

### Raison du choix

Aligner la lib sur l'intention pédagogique réelle (« proche de la réalité physiologique, même si
approximatif ») sans multiplier les paramètres ad hoc (proportions, comptage de familles) qui
avaient produit les bugs. Le cadran vide restaure le geste de construction voulu dès la conception
initiale de la maquette.

### Conséquences

- `alimentation/data.ts` : table `FOODS` réécrite avec CG/fibres/protéines/lipides réels par
  portion (26 aliments), seuils `cgTier` recalibrés (10/19 au lieu de 25/65) — quelques pastilles
  bougent par rapport à la maquette d'origine (pita, galette de riz → orange ; couscous → rouge),
  marquées `// à revalider (Thibault)`.
- `alimentation/AlimentationModule.tsx` : défi 1 devient une assiette libre (B1), défi 3 accepte le
  remplacement d'aliments + ordre gradué (B2), défi 4 construit l'assiette avec les portions
  réelles répétées (B3). Seuils `classifyPeak` (défi 2) recalibrés sur le nouveau modèle.
- `insuline/scenarios.ts` : `SituationId` perd `'bruit'`, gagne `'descend'` ; `SUB_SITUATIONS`
  réordonné (monte · descend · haut stable) ; l'enseignement « une seule nuit qui dévie = bruit »
  est reporté dans la description du chip `tendance`.
- `glycemieCurve.test.ts` intégralement réécrit (61 tests, dont les nouveaux invariants §0.c.4 —
  baguette/pain complet, riz blanc/basmati/complet, lentilles, galette de riz, pastèque,
  B3 émergent, assiette-modèle émergente — et §0.d — descente nocturne, raccord nuit→jour continu).

### Impact IA

- **API de `glycemieCurve.ts` à nouveau gelée après S14** : `AlimentRepas { cg, fibres, proteines,
  lipides }`, `Assiette { aliments, ordreFeculent? }`, `ScenarioTrace` sans `'nuit_isolee'` avec
  `'descend_hypo_matinale'`. Toute évolution future doit passer par une nouvelle décision documentée
  ici, pas une modification silencieuse.
- Si Thibault ajuste la table nutritionnelle (`alimentation/data.ts`, marquée `// à revalider`),
  aucune modification de la lib n'est nécessaire — seules les constantes de la table changent.
- Le module 6 (Suivi) ne doit plus jamais pré-peupler le cadran au montage sans une nouvelle
  décision explicite de Thibault (D9 n°2 a déjà été inversée une fois).

---

## 2026-07-10 — Chantier approfondissement-tabac (S1-S6) : 5 décisions structurantes

### Décision ① — Promotion SilhouetteCorps générique, wrapper diabète iso-API (S2)

**Décision**

Promouvoir le composant `src/features/diabete/components/Silhouette.tsx` en composant générique
`src/components/SilhouetteCorps.tsx` (API générique, zones et états en données) ; réécrire le
diabète en wrapper fin qui préserve son API entièrement inchangée.

**Contexte**

Le module 9 tabac « Ce que l'arrêt répare » réutilise une silhouette (corps humain + zones cliquables)
avec des zones différentes (7 zones tabac vs ~10 diabète). La silhouette diabète était jusqu'à présent
spécifique au diabète.

**Raison du choix**

Conformité à l'invariant multi-thèmes. Factoriser par copie générique plutôt que par héritage.

**Conséquences**

- `SilhouetteCorps` reçoit `zones: SilhouetteZone[]` (id, label, x, y, r, etat) ; `SILHOUETTE_VIEWBOX`
  reste partagé.
- `src/features/diabete/components/Silhouette.tsx` mappe ses zones + `SILHOUETTE_ANCHORS` vers le
  générique et ré-exporte son API strictement inchangée.
- 8 imports diabète (modules : complications, risque-cardio, suivi, traitements) continuent sans
  modification.

### Décision ② — Duplication assumée d'IllustrationSlot par thème (S1)

**Décision**

Dupliquer `src/features/tabac/components/IllustrationSlot.tsx` depuis le modèle diabète ; ne pas
généraliser.

**Contexte**

Chaque thème a besoin de son propre placeholder d'illustration (chemin différent). La tentation
générale existe mais toucherait le thème diabète dans le processus.

**Raison du choix**

Simplicité et respect du contrôle de parallélisme des sessions. La duplication (~50 lignes) est
acceptable et sans regret futur.

### Décision ③ — Modèle nicotine réaliste, API gelée, invariants testés (S3)

**Décision**

Refondre `nicotineCurve.ts` pour refléter les ordres de grandeur pharmacologiques réels (demi-vie
~2 h, pic cigarette <10 min, patch 2–4 h, saturation/tolérance, tension du manque liée à la
nicotinémie), tout en gelant l'API. Aucun consommateur n'a à changer. La qualité du modèle est
garantie par 37 invariants testés Vitest.

**Contexte**

Les modules 2 & 5 contiennent des messages pédagogiques fondamentaux. L'ancien modèle était
pédagogiquement juste mais pharmacocinétiquement approximatif. Les consommateurs dépendent d'une
API stable.

**Raison du choix**

Maximiser la plausibilité pharmacologique sans casser le code. Certifier le modèle par des tests.

**Conséquences**

- Exports publics inchangés : `TIME_MAX`, `LEVEL_MAX`, `BASELINE`, `ZONE_THRESHOLD_*`, `TENSION_*`,
  `NicotineEventType`, `sampleLevel`, `classifyZone`, `tensionLevelAt`, `toSvgPath`.
- Exports supplémentaires (constantes + fonctions pures pour tests) : `T_HALF`, `K_SAT`,
  `N_APAISEMENT`, `TENSION_EXPONENT`, `cigaretteContributionRaw`, `substitutContributionRaw`,
  `patchContributionRaw`, `tensionFromNiveau` — documentés, non utilisés en dehors des tests.
- 37 invariants Vitest couvrent : baseline, clamp, monotonie, cumulativité, élimination, pics
  temps, accumulation, saturation, tension, cohérence, scénario titration.

### Décision ④ — Cartes Vrai/faux sensibles, livrées actives, à revalider (S6)

**Décision**

Livrer les 15 cartes **toutes actives** (`actif: true`), y compris les 3 cartes sensibles (n°4
« Quelques cigarettes », n°14 « Vapoteuse », n°15 « Réduire »). Ces 3 cartes portent un commentaire
`// à revalider (Thibault)` et sont destinées à une revue clinique en conditions réelles d'usage.

**Contexte**

Le module 10 est une ressource de discussion (non un quiz). Les cartes 14-15 portent sur des sujets
où les données / recommandations HAS/OMS évoluent. Mettre en face du patient en vraie consultation
est pédagogiquement utile.

**Raison du choix**

Maximiser l'utilité clinique. Retrait simple : changement d'un seul champ `actif: false`.

**Conséquences**

- Cartes 4, 14, 15 apparaissent et sont navigables.
- Feedback de Thibault après usage peut être : validation, ajustement mineur, ou retrait.
- Le commentaire `// à revalider` sur les cartes 4 et 14 signale que leurs sources (Santé publique
  France) doivent être vérifiées régulièrement (différentes de HAS).

### Décision ⑤ — Correctif de cible tactile ≥44 px appliqué au module idées-recues (S6)

**Décision**

Les points de navigation du module 10 affichent visuellement en 20 px (discrétion) mais imposent une
cible tactile **réelle** ≥44 px (conformité invariant CLAUDE.md) via une zone invisible `:before` en
`inset: -12px`. Le correctif a été appliqué en **post-session par l'orchestrateur** avant S7.

**Contexte**

CLAUDE.md prescrit « cibles ≥44 px ». Les points de navigation étaient initialement au-dessus de ce
seuil. Correction requise pour l'accessibilité tactile sur tablette.

**Raison du choix**

Conformité à l'invariant sans compromettre l'esthétique du module.

**Conséquences**

- Aucune autre modification du module requise.
- Le pattern (cible invisible > affichage) devient réutilisable pour d'autres modules si besoin.
- `VALIDATION.md` doit noter : « cibles du module 10 testées ≥44 px ».

---

## 2026-07-10 — Chantier `boite-a-outils` (BO1-BO9) : fusion Craving → Stratégies & outils + 5 décisions

### Décision ① — Fusion Craving → Boîte à outils, module renommé « Stratégies & outils »

**Décision**

Le module `craving` disparaît du registre tabac ; `boite-a-outils` (« Stratégies & outils ») prend sa
place exacte (famille `agir`, hue `vigilance`). L'outil vague/4D est **déplacé** (pas réécrit) dans
`boite-a-outils/VagueCraving.tsx` — mécanique et fiche « Ma carte anti-envie » inchangées — et devient
un outil parmi 14, filtrables par situation. `src/features/tabac/craving/**` est supprimé (BO2). Tous
les renvois `'craving'` du thème (portes de fin de module, Vrai/faux) sont retargetés vers
`'boite-a-outils'`.

**Contexte**

Rapport OpenEvidence « stratégies comportementales du sevrage » (`docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`) : la vague/4D n'est qu'une des nombreuses techniques comportementales
validées (contrôle du stimulus, plans si-alors, activité physique brève, respiration, plan de secours
après un écart…). Élargir le module unique en une boîte à outils filtrable par situation, plutôt que
d'ajouter des modules séparés.

**Raison du choix**

Regrouper les techniques comportementales en un seul lieu filtrable évite la prolifération de modules
et permet un couplage direct avec le repérage de situations du Module 1 (Composantes).

**Conséquences**

- `docs/contenu-modules-tabac.md` Module 6 renommé et réécrit (table des 14 outils + détail).
- Fiche « Ma boîte à outils » (nouvelle, BO2) s'ajoute aux 4 fiches X1-X5 existantes (5 au total).
- `src/features/registry.ts` (registre générique multi-thèmes) conserve une occurrence textuelle du mot
  « craving » dans sa description libre du thème tabac — signalée par S1, **hors périmètre BO1 et BO9**
  (ni l'un ni l'autre n'a ce fichier dans sa zone « Modifier ») : reportée ci-dessous comme point ouvert.

### Décision ② — Contexte de navigation générique (`unknown`) dans le moteur

**Décision**

`ModuleProps` gagne `{ onNavigate: (id, context?: unknown) => void; context?: unknown }` ; `App.tsx`
stocke ce contexte dans l'entrée d'historique et le restitue au module au rendu. Le moteur ne connaît
**jamais** la forme du contexte (`unknown` strict, aucun type « situations » dans `types.ts`/`App.tsx`) ;
chaque thème valide lui-même la forme reçue (ex. `parseSelectionSituations` côté tabac).

**Contexte**

Nécessaire pour transmettre la sélection de situations du Module 1 (Composantes) vers le Module 6
(Stratégies & outils) sans coupler le moteur générique à un thème.

**Raison du choix**

Respecte l'invariant multi-thèmes (#4 de CLAUDE.md) : un mécanisme de contexte de navigation
réutilisable par tout thème futur, sans dette de conception spécifique au tabac.

**Conséquences**

- `navigateToModule` accepte et propage `context` ; le retour arrière restaure la vue (id + contexte)
  mais **pas** le state interne du module appelé (ex. `AddictionModule` : la sélection de situations
  n'est pas restaurée après un retour arrière — comportement accepté et documenté, cf. S3).
- Réutilisable par le thème diabète ou tout futur thème sans modification du moteur.

### Décision ③ — Situations partagées `situations.ts`, colonne vertébrale Addiction ↔ Stratégies & outils

**Décision**

La liste canonique des situations du thème tabac (3 piliers, 20 situations, ids stables) vit dans
`src/features/tabac/situations.ts`, consommée par `addiction/AddictionModule.tsx` (sélection radiale)
et `boite-a-outils/BoiteAOutilsModule.tsx` (filtre + badges). Le module Composantes (Addiction) perd ses
anciens champs `exemples`/`outils` et son panneau latéral de navigation directe.

**Contexte**

Éviter la duplication de libellés entre le Module 1 (qui servait déjà de carte d'orientation avec des
`exemples` par pilier) et le nouveau Module 6 filtrable par situation.

**Raison du choix**

Une seule source de vérité pour les situations, partagée par les deux seuls modules qui en ont besoin
— pas une promotion au moteur générique (les situations sont spécifiques au thème tabac).

**Conséquences**

- `AddictionModule.tsx` devient une page de repérage pur (sélection radiale, sans description ni
  solution à l'écran) ; toute narration pédagogique reste portée par le soignant.
- Ajouter/retirer une situation ne touche qu'un seul fichier (`situations.ts`), consommé par les deux
  modules sans duplication de libellés.

### Décision ④ — Niveaux de preuve à l'écran limités à 2 mentions qualitatives

**Décision**

Aucun chiffre brut d'étude (OR, SMD, RR, IC) n'est jamais affiché côté patient. Le module Stratégies &
outils n'expose que 2 registres qualitatifs par outil : « Efficacité démontrée dans les études » /
« Recommandé par les experts du sevrage ». Les chiffres du rapport OpenEvidence (si-alors OR 1,70 ;
exercice aigu SMD −1,64 ; counseling infirmier RR 1,29 ; recyclage post-rechute OR 3,5 ; paradoxe
tabac-stress SMD −0,37/−0,27 ; etc.) ne vivent **que** dans `docs/contenu-modules-tabac.md` (Module 6)
et dans le rapport source `docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`.

**Contexte**

Cohérent avec l'invariant déjà en vigueur pour les autres modules (aucune unité/valeur chiffrée à
l'écran, cf. décision transverse initiale du 2026-06-28) — étendu explicitement aux niveaux de preuve
scientifique, qui n'ont pas leur place dans un entretien de consultation.

**Raison du choix**

Un patient n'a pas besoin (et ne doit pas être exposé à) un intervalle de confiance pour être convaincu
qu'une technique fonctionne ; la mention qualitative suffit à la crédibilité pédagogique du soignant.

**Conséquences**

- `Preuve` (type dans `boite-a-outils/data.ts`) est une union à 2 valeurs (`demontree` / `experts`), pas
  un champ numérique.
- Toute évolution du rapport OE se répercute uniquement dans la documentation, jamais dans le code
  écran.

### Décision ⑤ — Vapoteuse réintégrée comme outil de réduction des risques (à revalider)

**Décision**

La vapoteuse redevient une **6ᵉ forme** du module Substituts (`FormeId`), avec un traitement visuel
distinct (badge « Réduction des risques », encart de statut « pas un médicament ») — revenant
partiellement sur la décision du 2026-07-08 qui l'avait retirée avec l'inhaleur. Elle reste absente du
bac à sable Nicotine (Module 2) et des formes ponctuelles (`FORMES_PONCTUELLES`) de la titration.
Contenu rédigé par Fable d'après HAS/HCSP + rapport OE, marqué `// à revalider (Thibault)`.

**Contexte**

Le rapport OpenEvidence et 3 nouvelles cartes Vrai/faux (BO4) documentent la vapoteuse comme outil de
réduction des risques reconnu (HCSP), distinct des substituts validés — cohérent avec la carte
`vf-vapoteuse` déjà existante. La garder hors du Module 3 devenait incohérent avec ce contenu.

**Raison du choix**

Traiter la vapoteuse avec la même rigueur que les 5 autres formes (bonnes pratiques/erreurs) tout en la
distinguant clairement d'un médicament, pour ne pas induire en erreur sur son statut.

**Conséquences**

- `SubstitutsModule.tsx` : 6 formes, badge et encart conditionnés à la sélection `vapoteuse`.
- `docs/contenu-modules-tabac.md` Module 3 mis à jour ; note « à revalider (Thibault) » conservée
  jusqu'à validation clinique.
- Chips substituts du Module 8 (Plan d'arrêt) : « Vapoteuse » ajoutée en cohérence (BO6).

### Décision ⑥ — Filtre « toniques uniquement » côté diabète : ne touche jamais la jauge

**Décision**

Le module diabète Activité physique gagne un interrupteur `toniquesUniquement` (défaut `false`) qui
filtre la **réserve** d'activités affichées (masque les activités d'intensité légère) sans jamais
retirer une activité déjà placée dans la jauge par le patient. Le calcul de la jauge (total, rayons)
reste strictement inchangé.

**Contexte**

Permettre au soignant d'adapter le discours au public (ne montrer que les activités modérées+ à un
public pour qui la marche légère n'est pas un levier suffisant) sans jamais effacer un choix déjà fait
par le patient — invariant "on ne retire jamais un choix du patient".

**Raison du choix**

Séparer strictement la vue « réserve filtrée » de la vue « jauge/total » évite tout risque de
resynchronisation incohérente entre les deux, et respecte la mécanique existante du module.

**Conséquences**

- `ActiviteModule.tsx` : nouveau mémo `reserveView` (filtré) distinct de `activitiesView` (source de
  vérité de la jauge, inchangé).
- `data.ts` du module diabète non modifié (aucune nouvelle activité/catégorie ajoutée).

### Points ouverts (à revalider Thibault)

- **Vapoteuse dans les substituts** (BO5) : technique d'utilisation rédigée par Fable à partir des
  positions HAS/HCSP et du rapport OE — à revalider avant usage en consultation.
- **Nouvelles cartes Vrai/faux** (BO4) : sources internationales (NEJM, Cochrane 2025, ACC, JAMA) en
  attendant un équivalent HAS/SPF — 11 cartes sur 21 marquées `// à revalider (Thibault)`.
- **Formulations patient des 14 outils** (BO2) : adaptées du rapport OE — ton et exactitude à juger à
  l'usage en consultation.
- **Occurrences résiduelles du mot « craving »**, hors périmètre de tout `S<k>.md` de ce chantier (donc
  non corrigées ici, signalées pour une éventuelle session future) :
  - `src/features/registry.ts` (registre générique multi-thèmes) — description libre du thème tabac
    (« … gérer le craving et la motivation. »), signalée par S1 dès BO1.
  - `src/features/tabac/nicotine/NicotineModule.tsx` — libellé texte « Craving » dans une liste de
    signes de manque (pas un id de navigation).
  - `src/features/tabac/plan-arret/PlanArretModule.tsx` — commentaire de code référençant l'ancien
    chemin `features/tabac/craving/CravingModule.tsx` (supprimé), signalé par S2 dès BO2.
  - Occurrences légitimes (non résiduelles, à conserver) : `situations.ts` (id `craving` de la
    situation « Envie irrépressible »), `boite-a-outils/data.ts` (mêmes ids de situation),
    `boite-a-outils/VagueCraving.tsx` (nom du composant/fichier, choix délibéré de BO2 pour rappeler
    l'origine du code déplacé), et les mentions physiologiques génériques dans le Module 2/5
    (`docs/contenu-modules-tabac.md`, antérieures à ce chantier).

**Décision**

Les points de navigation du module 10 affichent visuellement en 20 px (discrétion) mais imposent une
cible tactile **réelle** ≥44 px (conformité invariant CLAUDE.md) via une zone invisible `:before` en
`inset: -12px`. Le correctif a été appliqué en **post-session par l'orchestrateur** avant S7.

**Contexte**

CLAUDE.md prescrit « cibles ≥44 px ». Les points de navigation étaient initialement au-dessus de ce
seuil. Correction requise pour l'accessibilité tactile sur tablette.

**Raison du choix**

Conformité à l'invariant sans compromettre l'esthétique du module.

**Conséquences**

- Aucune autre modification du module requise.
- Le pattern (cible invisible > affichage) devient réutilisable pour d'autres modules si besoin.
- `VALIDATION.md` doit noter : « cibles du module 10 testées ≥44 px ».
---

## 2026-07-10 — Illustrations diabète S1 : pipeline d'assets + silhouette `bodyImage`/hotspot

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
---

## 2026-07-10 — Illustrations diabète S3 : M4 devient illustration-driven (artère + plaque + feux lucide)

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
---

## 2026-07-10 — Illustrations diabète S4 : M1 devient une animation illustration-driven à 4 modes

### Décision

1. **`MecanismeModule.tsx` réécrit en intégralité** — l'ancien wizard codé (4 temps linéaires,
   next/prev, 5 cellules-œufs en SVG) est remplacé par une **animation à 4 modes persistants**
   (Sans diabète / Insulinopénie / Insulinorésistance / Mixte), **3 cellules** contrôlées
   individuellement, portée fidèlement du prototype validé `proto-m1-anim2.html` (index
   illustrations-diabete §6, qui fait foi) : boucle de 3 phases (clés qui partent du pancréas →
   serrures qui réagissent → sucre qui se dépose/se vide), rejouée automatiquement toutes les
   ~4,9 s tant que le mode reste sélectionné.
2. **6 nouveaux assets** (`cell-closed/open/rusty.png`, `key.png`, `sugar.png`, `pancreas.png`)
   ajoutés à `build_assets.py`. Le script gagne un paramètre `base` par entrée de la table
   `ASSETS`, pour lire deux sources régénérées le 2026-07-11 (`cellule ouverte.png`, `Cellule
   serrure rouillée.png`) déposées à la **racine** de `Downloads` plutôt que dans le sous-dossier
   habituel `Downloads\illustration ETP` (nouvelle constante `SRC_DIR_ROOT`).
3. **Artère sous les cellules : reste codée** (barre CSS + jetons image), **pas**
   `artere-saine.png` étirée. Le plan proposait explicitement de « tester les deux rendus et
   garder le plus lisible » — sans accès navigateur pour comparer visuellement, le choix par
   défaut a été de garder l'option **déjà validée par Thibault au prototypage** (la barre codée du
   proto) plutôt que de risquer une image compacte déformée sur une largeur ~4× plus grande que sa
   proportion native.
4. **`prefers-reduced-motion` géré explicitement en JavaScript** (hook `usePrefersReducedMotion` +
   court-circuit de la boucle de `setTimeout`), en plus de la neutralisation CSS globale
   (`global.css`, transitions à 0.01 ms). La neutralisation CSS seule ne suffisait pas : elle
   accélère les transitions mais la scène aurait continué à changer d'état toutes les ~1,3 s même
   avec l'préférence système « mouvement réduit » activée — pas un « état statique lisible » au
   sens de l'étape 5 du plan S4.

### Contexte

Suite de S1 (pipeline + silhouette). S4 est indépendante des silhouettes/organes des autres
sessions (dépend seulement du pipeline d'assets), mais impose une réécriture complète du module
car le modèle mental change (temps successifs → modes persistants, 5 cellules → 3, coordonnées
codées → illustrations positionnées en %).

### Alternatives envisagées

- Garder l'ancien wizard 5-cellules et se contenter d'habiller ses étapes d'illustrations →
  écarté : le prototype validé par Thibault (index §6) définit un modèle d'interaction
  différent (mode persistant + boucle), pas une simple habillage visuel du wizard existant.
- Utiliser `artere-saine.png` sous les cellules (option notée « à tester » dans le plan) → écartée
  pour cette session par prudence (cf. décision ③) ; reste une piste explicite pour une itération
  future si Thibault la demande après avoir vu le rendu codé actuel.
- S'appuyer uniquement sur la règle CSS globale `prefers-reduced-motion` → écarté : elle ne coupe
  pas la logique de `setTimeout` qui pilote les phases, seulement la durée des transitions
  visuelles ; sans court-circuit JS, la scène continuerait de changer d'état en boucle.

### Raison du choix

Fidélité au prototype validé (seule source de vérité comportementale explicitement désignée par le
plan) ; prudence sur l'option d'image non testée visuellement, en cohérence avec la règle projet
« pas de navigateur côté Claude » — préférer une option déjà validée à une nouveauté non vérifiable
plutôt que d'introduire un risque visuel supplémentaire dans la même session que S3 (déjà signalée
comme point sensible).

### Conséquences

- Le composant n'a plus de notion de « temps 1 à 4 » linéaires ; toute référence future à
  `plans/theme-diabete/S4.md` (D4, l'ancien wizard) est obsolète pour ce module — ce plan-ci
  (`plans/illustrations-diabete/S4.md`) fait désormais autorité sur M1.
- `build_assets.py` supporte maintenant des sources multi-dossiers (`base=`) — pattern réutilisable
  si de futures régénérations d'illustrations atterrissent hors du sous-dossier `illustration ETP`.
- Positions/rotations des clés volantes (constantes du module) sont une **première approximation**
  calculée sans rendu visuel — point de revalidation explicite dans `VALIDATION.md` §S4.

### Impact IA

- Si Thibault demande finalement l'option `artere-saine.png` sous les cellules, c'est un
  changement localisé au bloc `.canalWrap`/`.canal` de `MecanismeModule.tsx`/`.module.css` — pas
  une reconception du reste de l'animation (modes, phases, clés, cellules inchangés).
- Si un mode doit changer (nouveau mécanisme, textes de légende), modifier uniquement la table
  `MODES` du module — la logique de phases/timers est générique et ne connaît pas le contenu des
  modes.
---

## 2026-07-10 — Illustrations diabète S6 : M6 stations/organes du cadran → lucide

### Décision

Les 9 icônes de station de `SuiviModule.tsx` (`suivi-stethoscope`, `suivi-prise-de-sang`,
`suivi-organe-<protects>` × 7) passent d'`IllustrationSlot` (jamais générées, placeholders
permanents) à un composant local `StationIcon` (lucide dans un cadre neutre circulaire/arrondi),
avec deux ajustements par rapport au libellé de l'index §4 :

1. **`defenses` → `Syringe`** (pas `ShieldPlus`, pourtant aussi suggéré). Dans le code actuel,
   `defenses` n'est le `protects` que d'un seul examen (« Vaccins ») — il n'existe pas de slot
   séparé « défenses immunitaires » vs « vaccins » comme le laissait entendre la formulation à
   deux entrées de l'index (`défenses → ShieldPlus`, `vaccins → Syringe`). Une seule icône,
   choisie pour matcher l'examen concret vu par le patient.
2. **`pied` → `Footprints`**, absent de la liste de l'index (qui ne couvrait pas ce cas) — ajout
   évident, lucide propose une icône directement adaptée.

Rein et dentiste suivent la décision déjà actée dans l'index §4 : rein reste l'image
`organe-reins.png` (S1) faute d'icône lucide adaptée ; dentiste (protège « bouche ») → `Smile`.

### Contexte

Suite de S1-S5. Session indépendante (pas de dépendance sur la silhouette ou le pipeline
d'assets), portant sur le cadran/panneau de réglage/porte « Ce que ça garde » de M6 uniquement.

### Raison du choix

Minimiser l'écart avec l'intention du plan (mêmes familles d'icônes suggérées) tout en respectant
la structure de données réelle (`ProtectsId`, une seule dimension de clé pour l'icône) plutôt que
d'introduire une distinction vaccins/défenses qui n'existe nulle part ailleurs dans le code.

### Conséquences

- `IllustrationSlot` n'est plus importé dans `SuiviModule.tsx` ; les ids `suivi-*` ne sont plus
  référencés (aucune image `suivi-*.png` à produire — ils étaient de toute façon toujours restés
  au stade placeholder).
- Le cadran, l'aiguille et le centre (motif fil rouge, `dialCenter*`) restent des tracés SVG codés,
  inchangés.

### Impact IA

- Si Thibault souhaite distinguer vaccins de « défenses immunitaires » avec deux icônes, cela
  demande d'abord un changement de modèle de données (`ExamDef` ou une nouvelle clé), pas un
  changement purement visuel de `StationIcon`.
---

## 2026-07-10 — Illustrations diabète S7 : 62 vignettes M2/M3/M8, chantier clos

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

---

## 2026-07-11 — Corrections visuelles diabète (revue Thibault, 13 captures → 5 causes-racines)

### Décision ① — S4 : fin du côte-à-côte cadran/panneau + suppression des chips de fréquences

Le module 6 Suivi (« Parcours ») passe d'un layout côte-à-côte (`@media (min-width: 860px)` :
cadran + panneau en `flex-direction: row`) à un **empilement systématique** (cadran toujours
au-dessus, panneau toujours pleine largeur en dessous). Les groupes de chips de fréquences
alternatives (consultations : 3 chips « Tous les 3/4/6 mois » ; examens : 4 chips « Chaque
consult. / 1×/an / 1×/2 ans / 1×/5 ans ») sont remplacés par **un seul stepper `‹ valeur ›`**
par ligne (nouvel helper `cycleValue`), qui cycle dans les mêmes options.

**Contexte** — Capture Thibault #3 : le côte-à-côte (cadran max 480px + panneau `flex 1 1
520px`) dépassait la largeur d'écran, coupant le panneau à droite ; les lignes d'examen
cumulaient 5-7 colonnes en polices 10-12px, illisibles à distance de consultation.

**Alternatives envisagées** — Garder le côte-à-côte et réduire seulement les polices : écarté,
la largeur cumulée (480+520px) dépasse un écran de consultation standard quel que soit le
contenu. Garder les chips mais les faire réellement tenir en une ligne (largeurs réduites) :
écarté, les libellés (« Tous les 6 mois », « 1×/2 ans ») ne se compriment pas assez pour rester
lisibles à ≥14px sur 4 chips côte à côte.

**Conséquences** — Les steppers `STEP_CONSULT_START`/`STEP_EXAM_MONTH` (ajustement fin du mois
de départ dans le cycle, hors cible de simplification du plan) sont retirés en même temps que
leur UI — action reducer et fonctions associées supprimées plutôt que laissées mortes. Les
examens/consultations restent placés au mois par défaut de `logic.ts` (`DEFAULT_EXAM_FREQUENCY`,
`// à revalider`) sans réglage manuel de mois. Le bouton dédié « Ce que ça garde » est retiré ;
son rôle est repris par l'icône de la ligne (devenue un `<button>` avec `aria-label` explicite)
pour ne pas perdre l'accès au panneau descriptif tout en tenant la cible de colonnes du plan.

**Impact IA** — Si Thibault souhaite réintroduire un réglage fin du mois par examen, il faudra
réintroduire une action reducer dédiée (ex. `SET_EXAM_MONTH`) et une UI compacte (pas un 2ᵉ
stepper par ligne, qui recasserait la largeur) — probablement un réglage global plutôt que par
ligne. Détail complet dans `plans/corrections-visuelles-diabete/S4.md`.

### Décision ② — S2 : modèle de courbe glycémie recalibré (K_CHARGE/K_FREIN/K_RETARD)

`glycemieCurve.ts` : `K_CHARGE` 60→20, `K_FREIN` 6→20, `K_RETARD` 5→14 (désaturation
**conjointe**, pas seulement `K_CHARGE`), `ORDRE_FREIN_BONUS` 0.45→0.6, `ORDRE_RETARD_BONUS`
0.35→0.5. Résultat : un féculent seul « rouge » culmine désormais ~80/100 (contre ~55 avant),
trois féculents cumulés ~90/100 (contre ~67 avant, un écart jugé insuffisant par Thibault,
capture #9). `PEAK_BAS_MAX`/`PEAK_HAUT_MIN` (défi ② Alimentation) recalibrés 47/50 → 55/74 par
ré-échantillonnage complet du garde-manger (33 aliments).

**Contexte** — Le plan indicatif suggérait d'augmenter seulement `K_CHARGE` (60→110-140). Un
calibrage réel (script jetable, hors navigateur) a montré que cette direction **abaisse** les
pics au lieu de les monter : avec `K_CHARGE` seul relevé, la charge d'un féculent isolé diminue
(la fonction de saturation `1 - exp(-x/K)` reste alors dans sa portion quasi-linéaire, plus
basse). C'est la baisse conjointe de `K_CHARGE` (charge monte plus vite par gramme de CG) **et**
de `K_FREIN`/`K_RETARD` (le frein cumulé de plusieurs féculents identiques ne rattrape plus le
gain de charge) qui produit l'effet demandé.

**Alternatives envisagées** — Suivre le plan à la lettre (`K_CHARGE` 60→130 seul) : écarté après
vérification chiffrée (voir ci-dessus, effet inverse à celui recherché). Changer la forme de la
fonction de charge (loi de puissance au lieu d'une exponentielle de saturation) pour découpler
plus finement bas et haut de gamme : écarté, hors périmètre du plan (qui ne demandait qu'un
ajustement de constantes, pas une refonte de la formule) et risque de complexité inutile pour un
gain marginal.

**Conséquences** — 2 tests ajoutés (`glycemieCurve.test.ts`) : pic(3 féculents identiques) >
pic(1 seul) et proche du plafond ; delta ordre premier/dernier ≥ 15 points. Seuils absolus de 2
tests existants (pastèque/lentilles) relevés en conscience (`BASELINE+12` → `BASELINE+20`),
l'invariant relatif renforcé (`rizBlanc - 25` au lieu d'une simple comparaison). `bandeToY`
déplacé de `insuline/scenarios.ts` vers `CourbeGlycemie.tsx` (export générique, paramètre
`levelMax` par défaut 100) pour être réutilisé par le module Alimentation sans dupliquer le
calcul.

**Impact IA** — Toutes les constantes de courbe restent `// à revalider (Thibault)` — calibrage
pédagogique, pas un simulateur métabolique validé. Si Thibault ajuste à l'usage, ne modifier que
les constantes commentées dans `glycemieCurve.ts`, pas la formule elle-même. Détail complet dans
`plans/corrections-visuelles-diabete/S2.md`.

### Décision ③ — S6 : Mécanisme, option B (jouer une fois puis « Rejouer »)

`MecanismeModule.tsx` abandonne la boucle auto-relancée (400→1600→2700ms puis relance à
4900ms, ~2,2s de tenue sur l'état final) au profit de l'**option B** du plan : la séquence se
joue **une seule fois** (500→2000→3400ms) à la sélection d'un mode, puis reste sur l'état
final **indéfiniment**. Un bouton « Rejouer » (sous la légende, masqué si
`prefers-reduced-motion`) permet de la relancer à la demande ; re-cliquer le mode déjà actif
la relance aussi (nouveau state `replayKey`).

**Contexte** — Capture Thibault #11 : « les animations sont trop rapides et ne restent pas
assez longtemps sur l'état final ». Le plan proposait deux options ; B est explicitement
recommandée (« moins diaporama, plus maîtrisé par le soignant »).

**Raison du choix** — Cohérent avec l'esprit du module (le soignant choisit le mode, ne pilote
pas la boucle image par image) : ici il déclenche, la scène se joue, elle s'arrête sur le
résultat — le soignant garde la main sur le rythme de la narration, contrairement à une boucle
qui repart automatiquement pendant qu'il commente encore la phase précédente.

**Conséquences** — Le nettoyage `cancelled`/`clearTimeout` au démontage/changement de mode est
préservé (une seule série de timers désormais, plus de récursion `runCycle`). Les 3 durées de
phase sont légèrement allongées (400→500, 1600→2000, 2700→3400 ms) pour un mouvement plus posé,
sans modifier les transitions CSS des cellules/clés/jetons (déjà dans une plage compatible).

**Impact IA** — Si Thibault préfère finalement l'option A (boucle continue mais plus lente),
remplacer le retrait de la relance par un `window.setTimeout(runCycle, X)` en fin de séquence
(cf. version précédente dans `git log`), sans toucher au reste du composant.

### Décision ④ — S7 : plaque d'athérome en croissant pariétal (au lieu d'une ellipse centrée)

`PlaqueArtere.tsx` remplace l'ellipse centrée (`cx=50 cy=50`, grossissant au milieu du
vaisseau) par un **dépôt en croissant** (`crescentPath`, courbe de Bézier quadratique) collé à
la paroi (y=0 dans le repère local du composant), plat aux deux extrémités du vaisseau et
bombé vers le centre de la lumière au milieu — au-delà d'un seuil d'encrassement (>0.5), un
2ᵉ croissant apparaît sur la paroi opposée (rétrécissement bilatéral, profondeur 75 % du
premier). Même courbe de croissance (`pot = encrassement^0.75`), mêmes paliers de teinte,
`plaquePassagePct` **non modifiée**.

**Contexte** — Capture Thibault #13 : « la forme de la plaque n'est pas vraiment adaptée à
l'artère » — un blob rouge centré ne « colle » pas à un vaisseau (tube horizontal/oblique).

**Alternatives envisagées** — Lentille/banane en `path` SVG dessinée à la main (le plan
proposait aussi cette option) : écartée au profit d'une courbe de Bézier quadratique simple
(`M0,edgeY Q50,peakY 100,edgeY Z`), plus courte à maintenir et strictement suffisante pour
l'effet visuel recherché (plat aux bords, bombé au centre). Repositionner `.artereOverlay`
(rotation/position déjà calées en S3 illustrations-diabete par analyse PCA de l'image) :
écarté, la boîte overlay était déjà posée sur la lumière — seul le contenu du SVG à
l'intérieur change, pas son cadrage.

**Conséquences** — La profondeur du croissant au centre (`wallDepth`) dérive de la même
formule que `plaquePassagePct` (paroi 8→42 sur référence 120, mise à l'échelle du viewBox
0–100), pour que le texte « Passage du sang : X % » reste cohérent avec le point le plus
étroit du dépôt visuel. Transition CSS `rx`/`ry` (obsolète, `path` n'a pas ces attributs)
remplacée par une transition `d`, neutralisée sous `prefers-reduced-motion`.

**Impact IA** — Point sensible non vérifié à l'écran (règle projet, cf. `VALIDATION.md` §S7) :
si le croissant déborde de la lumière visible, ajuster uniquement `.artereOverlay`
(`RisqueCardioModule.module.css`, `left`/`top`/`width`/`height`/rotation) — ne pas retoucher
`PlaqueArtere.tsx` pour un problème de cadrage.

### Décision ⑤ — S8 : passe « moins de texte » agressive (9 modules) + libellé Insuline ③

Passe agressive de retrait de texte ambiant sur les 9 modules diabète, selon la règle de tri
posée par le plan : **on coupe** intros/consignes de tête de module, bandes de légende
explicatives en bas d'écran, hints redondants ; **on garde** les eyebrows courts d'onglet et
**tout texte qui EST le résultat d'une interaction** (`sideText` Traitements, décision
Insuline, verdicts Alimentation, détail au clic Activité, panneau organe Complications,
`patienceMessage` Hypoglycémie). En cas de doute, garder l'eyebrow, couper le paragraphe.
Libellé de l'onglet ③ Insuline corrigé : `'③ 2 situations'` → `'③ Décider'` (la carte ①
contient en réalité **3 chips** de lecture de la nuit, le chiffre était trompeur).

**Contexte** — Capture Thibault #1 + remarque transverse D : « beaucoup de texte explicatif
souvent inutile/polluant. C'est le soignant qui fait la narration. » Le texte en trop
allongeait aussi les pages (Insuline #1 : les cartes situations passaient sous la ligne de
flottaison).

**Alternatives envisagées** — Retrait sélectif module par module selon un jugement au cas par
cas, sans règle explicite : écarté, risque d'incohérence de registre entre les 9 modules (un
module resté verbeux à côté de 8 allégés) — la règle de tri écrite dans le plan tranche les
cas ambigus (ex. `D1_CAPTIONS` gardées car sorties dynamiques du plateau, mais réduites à une
ligne ; `arteryMessage` gardé mais raccourci, pas coupé, car sortie du réglage des feux).

**Conséquences** — Bundle JS réduit (459,9 → 455,0 kB) malgré aucune fonctionnalité perdue :
tous les textes coupés étaient de la narration ambiante déjà répétée par les eyebrows/labels
ou destinée à être portée par le soignant. Plusieurs classes CSS mortes supprimées avec leur
texte (`.intro`, `.videSousTitre`, `.vueHint`, `.captionText`, `.totalNote`, `.sideHint`,
`.caption` selon les modules).

**Impact IA** — Toute future addition de texte dans ces 9 modules doit repasser par la même
règle de tri (eyebrow court ou sortie d'interaction, sinon narration orale du soignant) —
sinon le registre redevient hétérogène entre modules.
