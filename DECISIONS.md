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

