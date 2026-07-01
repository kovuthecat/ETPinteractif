# PLAN_corrections-v2.md — Plan d'exécution (2ᵉ passe corrections)   (rédigé par Opus)

> **Exécutants (Sonnet / Haiku)** : faites UNIQUEMENT votre tâche.
> Suivez les **Étapes dans l'ordre**. Lisez UNIQUEMENT les fichiers sous « Lire ».
> Ne créez AUCUN fichier ni dépendance hors « Modifier ». Le design est fixé par Opus —
> ne reconcevez pas. Doute ou blocage → **STOP**, signalez, rendez la main. N'improvisez pas.

- **Date :** 2026-07-01 · **Rédigé par :** Opus · **Branche :** — (repo local, main)
- **Plan parent / lié :** `PLAN_corrections-ux.md` (clos, C1-C9 ; C10 bloqué contenu).
- **Source :** captures d'écran de correction fournies par Thibault (2026-07-01) + arbitrages Thibault ci-dessous.

## Pourquoi ce plan

La v1 (6 modules + socle sémantique) fonctionne, mais une passe de test en conditions réelles
(`npm run dev`, écran large de consultation) révèle **12 problèmes**, regroupés en 5 familles :

1. **Débordement systémique** (« dépasse du cadre / hors écran ») sur tous les modules à SVG.
2. **Overlays/tooltips mal positionnés** (M4 étiquettes + pop-up ; M6 cartes 4D hors écran).
3. **Modèles d'interaction à faire évoluer** vers le temps réel (M2 nicotine, M5 soulagement) et une
   exploration lisible (M1 addiction).
4. **Finitions esthétiques** (M6 courbe, M3 titration).
5. **Nouveau module « Explorer ma motivation » (M7)**.

### Arbitrages déjà tranchés par Thibault (2026-07-01)

- **M5 Soulagement** : passer à un **modèle temps réel** — le fumeur a un **stress de base** ; cliquer
  « fumer une cigarette » fait **baisser le stress puis le fait remonter** ; un bouton superpose sur **la
  même courbe** le **stress basal du non-fumeur**, tracé **plus bas que le creux le plus bas du fumeur**
  (message : même « soulagé », le fumeur reste au-dessus du non-fumeur). Approche plus pédagogique que
  la bascule d'onglets actuelle. Amplitudes = **illustratives**, Thibault valide le récit après coup.
- **M7 Motivation** : **pas de balance décisionnelle** (jugée limitante) → **focus sur le positif**.
  Périmètre v1 = **(A) échelles importance / confiance (0–10)** + **(C) « Mes raisons » façon tableau
  blanc** : cartes à glisser, **éditables** (ajouter un détail dessus), avec possibilité **d'écrire de
  nouveaux items**.
- **Images IA** : Thibault peut générer des PNG (convertibles SVG). **Rappel invariant 2** : tout visuel
  intégré doit finir en **SVG/CSS inline** (pas de bitmap binaire embarqué). La plupart des besoins sont
  couverts par `lucide-react` / SVG inline ; prompts fournis à la demande, au cas par cas (cf. §Images).
- **Périmètre de ce passage** : écrire le PLAN. Aucune tâche n'est exécutée tant que Thibault ne lance pas le lot.

## Convention de validation (s'applique à TOUTES les tâches)

- **Auto** = gate du commit, responsabilité de l'exécutant : `npm run build` (typecheck inclus) et
  `npm run test` quand la tâche touche de la logique pure (`src/lib/nicotineCurve.ts`). Pas de commit si ça échoue.
- **Visuel** = responsabilité de **Thibault**, **non bloquant** : l'exécutant **ne tente PAS** de le vérifier
  (pas de navigateur, pas de capture, pas de Playwright). Il reporte la ligne « visuel : » dans `VALIDATION.md`
  (1 entrée/tâche : quoi regarder, attendu) et continue. Thibault déroule en une session `npm run dev`.

## Invariants à NE PAS casser (rappel `CLAUDE.md`)

1. **Zéro persistance** (pas de localStorage/cookies/réseau). Tout état (y compris cartes du tableau blanc M7,
   valeurs des échelles) reste en **mémoire React éphémère**, perdu au reload.
2. **Local-first / hors-ligne** : **aucune dépendance runtime ajoutée** (pas de lib de drag, de graphes, d'animation).
   Illustrations = **SVG/CSS inline**. Drag & drop M7 = **pointer events natifs**, pas de librairie.
3. **Pile figée** : Vite + React + TS, CSS Modules + `tokens.css`, icônes `lucide-react`, pas de router.
4. **Multi-thèmes** : ne rien coder « tabac » dans le moteur générique (`ModuleShell`, `Home`, `ModuleCard`,
   `App`). Le nouveau module M7 s'ajoute via `registry.ts` + `types.ts` comme les autres.
5. **Exactitude médicale** : contenu sourcé. Récits illustratifs marqués « illustratif » ; doute clinique → **STOP**.
6. **Accessibilité** : couleur **toujours doublée** (libellé/icône/forme) ; cibles ≥ 44 px ; `prefers-reduced-motion`.

---

## Lot A — Débordement systémique  *(fondation, faible risque, corrige ~5 captures)*

### R1 — Contraindre la zone de contenu et tous les graphiques SVG · Modèle : Sonnet, effort : low
- **But :** aucun module ne doit « dépasser du cadre » sur écran large. Cause racine : les SVG sont en
  `width:100% ; height:auto` sans borne de hauteur → sur ~1800 px utiles, un viewBox 600×280 fait ~840 px de
  haut (Venn 600×460 → ~1380 px), poussant le reste hors écran.
- **Lire :** `src/components/ModuleShell.module.css` ; `src/features/nicotine/NicotineModule.module.css` ;
  `src/features/soulagement/SoulagementModule.module.css` ; `src/features/craving/CravingModule.module.css` ;
  `src/features/addiction/AddictionModule.module.css` ; `src/features/nicotine-toxique/NicotineToxiqueModule.module.css` ;
  `src/styles/tokens.css` (tokens d'espacement disponibles).
- **Modifier :** `src/components/ModuleShell.module.css` + les 5 `*.module.css` de graphes ci-dessus.
- **Hors périmètre :** ne PAS toucher aux `.tsx` (pas de changement de viewBox ni de logique) ; ne pas
  retoucher le contenu ; ne pas régler ici les overlays M4/M6 (c'est R2/R3).
- **Étapes :**
  1. `ModuleShell.module.css` → `.content` : ajouter `max-width: 960px; margin-inline: auto;` (le header reste pleine largeur).
  2. Sur chaque `.graph` (les 5 fichiers) : borner la hauteur pour qu'un graphique ne dépasse jamais ~la moitié
     de l'écran, indépendamment de la largeur : `max-height: 46vh; width: 100%; height: auto;` +
     `max-width` cohérent avec le viewBox (ex. `max-width: 720px` centré via le conteneur). Vérifier que
     `preserveAspectRatio` par défaut ne déforme pas (garder le ratio du viewBox).
  3. Addiction : `.vennWrap` doit contraindre le SVG (Venn 600×460 = plus haut) — `max-width` centré + `max-height`.
  4. Vérifier qu'aucune règle `min-height` résiduelle ne force un grand vide (cf. M5 vue non-fumeur).
- **Validation :** auto `npm run build`. visuel : sur écran large, chaque module tient dans la fenêtre sans scroll
  vertical anormal ; graphiques centrés, lisibles ; plus de titre repoussé tout en bas (M5).
- **Si bloqué :** —
- **Commit :** `fix(ui): borner contenu et graphiques SVG (anti-debordement)`
- **Statut :** [ ] à faire

---

## Lot B — Positionnement des overlays / tooltips

### R2 — Nicotine ≠ toxique : étiquettes alignées + pop-up ancré au point cliqué · Modèle : Sonnet, effort : medium
- **But :** les étiquettes (« Goudrons et particules », « Monoxyde de carbone », « Cancérogènes », « Mélange
  chimique ») doivent rester **au bout de leur ligne pointillée** ; le pop-up de détail doit s'ouvrir **près de
  l'item cliqué**, pas en bas à droite de la scène.
- **Lire :** `src/features/nicotine-toxique/NicotineToxiqueModule.tsx` (+ `.module.css`) ; `PLAN_corrections-ux.md` §C7 ;
  `docs/contenu-modules.md` §Module 4.
- **Modifier :** `src/features/nicotine-toxique/NicotineToxiqueModule.tsx` (+ `.module.css`).
- **Hors périmètre :** ne pas retoucher le contenu médical (déjà en attente de validation, cf. C7 `VALIDATION.md`) ;
  recomposition libre conservée ; tout en SVG/CSS inline.
- **Étapes :**
  1. Recaler chaque étiquette sur l'**extrémité de sa ligne pointillée** : définir les hotspots par des coordonnées
     SVG uniques et dériver la position de l'étiquette **de la même source** que le trait (une seule constante par
     item → plus de décalage).
  2. Rendre le pop-up **ancré au hotspot** : soit via `<foreignObject>` positionné aux coordonnées SVG du point,
     soit en convertissant coordonnée SVG → pixel (mesure du conteneur via `ref` + ratio viewBox). Le pop-up
     s'ouvre à côté du point cliqué, avec un décalage anti-débordement (rester dans le cadre).
  3. Variante tablette/étroit : le pop-up **ne recouvre pas** le hotspot ; pas de débordement horizontal.
- **Validation :** auto `npm run build`. visuel : chaque étiquette touche bien sa ligne ; cliquer « Goudrons »
  (haut-gauche) ouvre le pop-up **près de haut-gauche**, pas en bas à droite ; rien ne dépasse.
- **Si bloqué :** conversion coordonnées instable au resize → privilégier `<foreignObject>` dans le SVG (suit le viewBox).
- **Commit :** `fix(module): nicotine-toxique etiquettes alignees + popup ancre`
- **Statut :** [~] fait (auto en attente : `npm` indisponible dans cet environnement pour lancer `npm run build` ; visuel → `VALIDATION.md`)

### R3 — Craving : sortir les cartes 4D du hors-champ · Modèle : Sonnet, effort : medium
- **But :** les cartes des outils 4D (Différer / Distraire / Décontracter / De l'eau) ne doivent plus **sortir de
  l'écran**. Conserver l'idée pédagogique (« l'outil occupe le pic, la vague redescend derrière ») sans casser la mise en page.
- **Lire :** `src/features/craving/CravingModule.tsx` (+ `.module.css`) ; `PLAN_corrections-ux.md` §C5 ;
  `VALIDATION.md` §C5.
- **Modifier :** `src/features/craving/CravingModule.tsx` (+ `.module.css`).
- **Hors périmètre :** pas de persistance/son ; ne pas retoucher la logique de la vague ni des widgets (respiration,
  gorgées, compte à rebours) — seulement leur **conteneur/placement**. L'esthétique de la courbe elle-même = R7.
- **Étapes :**
  1. Remplacer `.overlayZone` en position absolue (qui déborde vers le bas quand plusieurs cartes s'empilent) par un
     placement **borné au `graphWrap`** : overlay ancré en haut de la zone du pic, cartes en **rangée qui s'enroule**
     (`flex-wrap`) et **jamais plus larges/hautes que le graphe** (`max-width`/`max-height` + `overflow` maîtrisé).
  2. Si ≥ 2 outils actifs rendent l'overlay trop grand pour la zone du pic : **basculer les cartes sous le graphe**
     en grille responsive (`repeat(auto-fit, minmax(200px,1fr))`), le **marqueur restant sur la courbe**. La courbe
     continue de se dessiner derrière dans les deux cas.
  3. Vérifier cohérence avec R1 (le graphe est désormais borné en hauteur) : les cartes doivent tenir dans le cadre visible.
- **Validation :** auto `npm run build`. visuel : activer les 4 outils à la fois ne fait **rien sortir de l'écran** ;
  la vague reste visible et continue derrière/à côté ; comportement des widgets inchangé.
- **Si bloqué :** —
- **Commit :** `fix(module): craving 4D dans le cadre (overlay borne)`
- **Statut :** [~] fait (auto en attente : `npm` indisponible dans cet environnement pour lancer `npm run build` ; visuel → `VALIDATION.md`)

---

## Lot C — Modèles d'interaction (pédagogie)

### R4 — Nicotine : cinétique en temps réel au clic (fin du « différé jusqu'à Lecture ») · Modèle : Sonnet, effort : high
- **But :** au **clic** sur cigarette / substitut / vapoteuse / patch, la cinétique s'affiche **immédiatement, en
  temps réel**, au lieu d'attendre l'appui sur « Lecture ». Refonte esthétique de l'interface (jugée « moche »).
- **Lire :** `src/features/nicotine/NicotineModule.tsx` (+ `.module.css`) ; `src/lib/nicotineCurve.ts` ;
  `PLAN_corrections-ux.md` §C3 ; `VALIDATION.md` §C3 ; `src/styles/tokens.css`.
- **Modifier :** `src/features/nicotine/NicotineModule.tsx` (+ `.module.css`). **Ne pas** modifier `nicotineCurve.ts`
  (partagé avec R5 ; garder la logique pure intacte).
- **Hors périmètre :** rester **illustratif** (valeurs 0–1, mention conservée) ; ne pas devenir un outil de dosage ;
  respecter `prefers-reduced-motion` (mode réduit = courbe complète directe, pas d'animation).
- **Étapes :**
  1. Modèle de lecture **auto** : le temps avance en continu (le module « tourne » façon oscilloscope) ; un clic
     insère la prise **au temps courant** et sa cinétique se dessine **tout de suite**. Supprimer la contrainte
     « rien ne bouge tant qu'on n'a pas cliqué Lecture ».
  2. Reléguer Pause / Vitesse en **contrôles secondaires** (l'animation ne dépend plus d'un « Play » explicite).
     « Réinitialiser » conservé.
  3. **Distinguer visuellement** les 4 gestes (ex. pic bref cigarette vs plateau patch) par pictogramme/couleur sur
     l'axe du temps. Conserver la coloration par zone (`classifyZone`) + la jauge « État actuel » doublée d'un libellé.
  4. **Esthétique** (sobre, consultation) : dégradé léger sous la courbe, hiérarchie des boutons (gestes en primaire,
     lecture/vitesse en secondaire, reset en tertiaire/alerte), chip « État actuel » mieux intégré. Tokens C1 uniquement.
  5. `prefers-reduced-motion` : afficher la courbe finale sans défilement ; conserver l'ajout de prises.
- **Validation :** auto `npm run build`. visuel : un clic dessine la montée/descente **immédiatement** sans passer
  par Lecture ; couleur/état suivent la zone ; interface plus soignée et hiérarchisée.
- **Si bloqué :** si le défilement continu rend l'axe temps confus (prises qui « sortent » de l'écran temporel),
  clamp/rembobinage simple — ne pas réintroduire la dépendance à un bouton Lecture.
- **Commit :** `feat(module): nicotine cinetique temps reel au clic + refonte visuelle`
- **Statut :** [ ] à faire

### R5 — Soulagement : modèle temps réel + superposition non-fumeur sur la même courbe · Modèle : Sonnet, effort : high
- **But :** remplacer la bascule d'onglets par un **bac à sable temps réel** : le fumeur part d'un **stress de base** ;
  cliquer « fumer une cigarette » fait **chuter le stress puis remonter** ; un bouton superpose, **sur la même
  courbe**, le **stress basal du non-fumeur**, tracé **sous le creux le plus bas atteint par le fumeur**.
- **Lire :** `src/features/soulagement/SoulagementModule.tsx` (+ `.module.css`) ; `src/lib/nicotineCurve.ts`
  (+ `.test.ts`) ; `docs/contenu-modules.md` §Module 5 ; `PLAN_corrections-ux.md` §C4 ; `VALIDATION.md` §C4.
- **Modifier :** `src/features/soulagement/SoulagementModule.tsx` (+ `.module.css`), `src/lib/nicotineCurve.ts`
  (+ `nicotineCurve.test.ts`) si un helper pur est ajouté/ajusté.
- **Hors périmètre :** amplitudes = **schéma illustratif** (mention obligatoire) → **Thibault valide le récit** ;
  ne pas modifier le module nicotine (R4) bien que `nicotineCurve.ts` soit partagé (ne pas paralléliser R4/R5 sur ce fichier) ;
  ton non culpabilisant conservé.
- **Étapes :**
  1. `nicotineCurve.ts` : exposer (ou ajuster) une **fonction pure** produisant, à partir d'une liste de prises au
     temps courant, la courbe de **stress du fumeur** (chute transitoire synchronisée au pic de nicotine, remontée
     ensuite) **et** la constante **stress basal non-fumeur**, avec l'**invariant vérifié par un test** :
     `min(stress fumeur) > stress basal non-fumeur` (le creux du fumeur reste au-dessus du non-fumeur). + tests Vitest (frontières, monotonie du creux/rebond).
  2. Module : bac à sable temps réel calqué sur R4 (le temps avance ; « fumer une cigarette » insère une chute au
     temps courant). Un **seul bouton** « Comparer au non-fumeur » superpose la **ligne basale non-fumeur** sur le
     **même** graphe (plus bas que tous les creux fumeur), avec libellé clair (jamais couleur seule).
  3. Annotation « soulagement du manque » ancrée au creux ; message pédagogique : même soulagé, le fumeur reste
     au-dessus du non-fumeur → la cigarette soulage un manque qu'elle a elle-même créé.
  4. `prefers-reduced-motion` : rendu statique cohérent (courbe finale + repère non-fumeur).
- **Validation :** auto `npm run build` **et** `npm run test` (dont l'invariant creux fumeur > basal non-fumeur).
  visuel : cliquer « fumer » fait bien chuter puis remonter le stress ; le repère non-fumeur passe **sous** le
  creux le plus bas du fumeur ; message non culpabilisant ; mention illustrative présente.
- **Si bloqué :** si les amplitudes exactes sont incertaines → coder une version plausible marquée « illustrative »
  et **lister la question dans `VALIDATION.md`** pour arbitrage Thibault (ne pas inventer de chiffres cliniques).
- **Commit :** `feat(module): soulagement temps reel + repere non-fumeur superpose`
- **Statut :** [ ] à faire

### R6 — Addiction : exploration d'une dimension lisible + outils dans le cadre · Modèle : Sonnet, effort : medium
- **But :** au clic sur un cercle, remplacer le **zoom illisible** (texte qui déborde / se chevauche) par un
  **panneau d'exploration clair**, avec des **outils & stratégies enrichis** et **dans le cadre**.
- **Lire :** `src/features/addiction/AddictionModule.tsx` (+ `.module.css`) ; `docs/contenu-modules.md` §Module 1 ;
  `PLAN_corrections-ux.md` §C6 ; `VALIDATION.md` §C6 ; `src/features/types.ts` (`onNavigate`).
- **Modifier :** `src/features/addiction/AddictionModule.tsx` (+ `.module.css`).
- **Hors périmètre :** garder le **contenu exact** du §Module 1 (pas d'invention médicale) ; conserver le diagramme
  de Venn 3 cercles à l'état de repos (ne pas repasser à des onglets). Le débordement du SVG lui-même est géré par R1.
- **Étapes :**
  1. Au clic sur un cercle : ne **plus** agrandir le cercle au point de chevaucher les libellés. Ouvrir à la place un
     **panneau d'exploration** lisible (sous ou à côté du diagramme, dans le cadre) : titre de la dimension +
     exemples (§Module 1) présentés proprement (liste/bulles qui ne se recouvrent pas).
  2. **Outils & stratégies** : étoffer au-delà des 2 items actuels (le contenu existant est pauvre et sortait du
     cadre). Structurer en cartes-actions lisibles, avec les renvois inter-modules
     `onNavigate('nicotine'|'substituts'|'craving')` **marqués « autre module »**.
  3. Garder l'intersection centrale « ces dimensions s'alimentent entre elles » lisible (ne pas la laisser masquée
     par un cercle agrandi).
  4. Reclic sur le même cercle → referme le panneau (retour au repos).
- **Validation :** auto `npm run build`. visuel : sélectionner une dimension affiche un panneau **entièrement
  lisible**, sans texte tronqué/chevauché ; outils plus riches ; renvois fonctionnels ; rien hors cadre.
- **Si bloqué :** enrichissement des outils = reformuler/regrouper le contenu §Module 1 existant, **pas** inventer de
  nouvelles affirmations médicales → si un ajout dépasse la source, **STOP** et signaler dans `VALIDATION.md`.
- **Commit :** `feat(module): addiction exploration lisible + outils enrichis`
- **Statut :** [ ] à faire

---

## Lot D — Finitions esthétiques

### R7 — Craving : rendre la courbe « vague » plus expressive · Modèle : Haiku, effort : low
- **But :** la courbe « La vague de l'envie » est plate et fade → la rendre plus lisible et expressive (sobre).
- **Lire :** `src/features/craving/CravingModule.tsx` (+ `.module.css`) ; `src/styles/tokens.css`.
- **Modifier :** `src/features/craving/CravingModule.module.css` (et `.tsx` seulement si un `<defs>`/dégradé SVG
  doit être ajouté au markup).
- **Hors périmètre :** ne pas toucher à la logique de la vague ni au placement des 4D (R3) ; rester sobre.
- **Étapes :**
  1. Ajouter un **remplissage dégradé sous la courbe** (aire) + épaisseur/arrondi cohérents avec la charte ;
     marqueur du « maintenant » plus visible.
  2. Ajout d'un **repère d'axe temps léger** et éventuellement d'un repère de « pic » discret, sans surcharge.
  3. Vérifier lisibilité à ~1 m ; couleur doublée par la forme (aire) et les libellés existants.
- **Validation :** auto `npm run build`. visuel : la vague est nettement plus lisible/expressive, toujours sobre.
- **Si bloqué :** —
- **Commit :** `style(module): craving courbe de la vague plus expressive`
- **Statut :** [ ] à faire

### R8 — Substituts : refonte ergonomique de la titration · Modèle : Sonnet, effort : medium
- **But :** l'interface « Méthode de titration du patch » est jugée « moche et peu ergonomique » → la restructurer
  pour être claire et confortable, sans changer la logique métier.
- **Lire :** `src/features/substituts/SubstitutsModule.tsx` (+ `.module.css`) ; `PLAN_corrections-ux.md` §C2 ;
  `VALIDATION.md` §C2 ; `docs/contenu-modules.md` §Module 3 ; `src/styles/tokens.css`.
- **Modifier :** `src/features/substituts/SubstitutsModule.tsx` (+ `.module.css`) — **présentation** ; ne pas
  changer la mécanique (quarts illimités, patchs 2×2, jour ≥ nuit, aucun dosage chiffré).
- **Hors périmètre :** **aucun dosage chiffré** ; ne pas toucher la Partie A (formes, bloquée C10) ; conserver le
  message « Expérimentez, fiez-vous à votre ressenti » et le scénario envie/surdosage.
- **Étapes :**
  1. Restructurer les **cases à cocher** (« Envie de fumer persiste », « Signes de surdosage », « Jour / Nuit ») en
     **cartes/segments** clairs et lisibles, hiérarchie visuelle nette.
  2. Regrouper les commandes de dose (**+ ¼ / − ¼**, jour/nuit) de façon ergonomique (cibles ≥ 44 px, groupement
     logique jour vs nuit) ; rendre l'état « surdosage → revenir en arrière » **explicite** (alerte via tokens
     vigilance/toxique) plutôt qu'un bouton grisé peu parlant.
  3. Améliorer le rendu des **patchs 2×2** et le **double libellé** (« 2 patchs + ¼ (9 quarts) ») pour la lisibilité.
- **Validation :** auto `npm run build`. visuel : interface de titration nettement plus claire/ergonomique ; toute
  la mécanique C2 (cf. `VALIDATION.md` §C2) reste vraie ; aucun dosage chiffré.
- **Si bloqué :** —
- **Commit :** `feat(module): substituts refonte ergonomique de la titration`
- **Statut :** [ ] à faire

---

## Lot E — Nouveau module

### R9 — Module M7 « Explorer ma motivation » (échelles + tableau blanc) · Modèle : Sonnet, effort : high
- **But :** ajouter un 7ᵉ module, **centré sur le positif**, avec deux outils : **(A)** échelles importance /
  confiance **0–10** ; **(C)** « Mes raisons » façon **tableau blanc** — cartes à glisser, **éditables** (ajouter un
  détail), et **création de nouveaux items**.
- **Lire :** `src/features/types.ts` ; `src/features/registry.ts` ; `src/App.tsx` ; un module existant comme
  gabarit (`src/features/craving/CravingModule.tsx` + `.module.css`) ; `src/components/Home.tsx` (grille) ;
  `src/styles/tokens.css` ; `docs/contenu-modules.md` (pour y **ajouter** la section Module 7).
- **Modifier / Créer :**
  - Créer `src/features/motivation/MotivationModule.tsx` + `MotivationModule.module.css`.
  - `src/features/types.ts` : ajouter `'motivation'` à `ModuleId`.
  - `src/features/registry.ts` : entrée du module (titre, résumé 1 phrase, icône lucide, sources).
  - `src/App.tsx` : router l'affichage du nouveau module (comme les autres).
  - `docs/contenu-modules.md` : section §Module 7 (contenu de départ).
- **Hors périmètre :** **pas de balance décisionnelle** ; **zéro persistance** (échelles + cartes = state React
  éphémère) ; **aucune dépendance** (drag = pointer events natifs) ; ne pas coder « tabac » dans le moteur
  générique (le module s'ajoute par le registre). Contenu de départ = **neutre/sourçable**, validé par Thibault.
- **Étapes :**
  1. **Squelette** : créer le module, l'inscrire dans `types.ts` + `registry.ts`, le brancher dans `App.tsx`.
     Vérifier que la grille d'accueil (7 cartes) reste correcte (grille responsive existante).
  2. **Outil A — Échelles 0–10** : deux règles (curseurs) « À quel point est-ce important pour vous d'arrêter ? » et
     « À quel point vous sentez-vous capable / confiant ? ». Sous chaque valeur, une **relance non culpabilisante**
     (« pourquoi pas un chiffre plus bas ? » / « qu'est-ce qui aiderait à monter d'un point ? »). Éphémère, réinitialisable.
  3. **Outil C — « Mes raisons » (tableau blanc)** : zone bornée où des **cartes** (raisons positives : santé,
     argent, enfants, liberté, odeur, forme…) sont **déplaçables** via **pointer events** (position en state).
     Chaque carte est **éditable** (ajouter un détail : `contentEditable`/input contrôlé) et on peut **créer un
     nouvel item** (bouton « + une raison »). Cibles ≥ 44 px ; drag accessible au clavier si faisable simplement,
     sinon fournir un fallback (boutons de déplacement) — **ne pas** bloquer sur ce point.
  4. Ton **positif** et non injonctif partout ; renvois éventuels vers d'autres modules via `onNavigate` si pertinent.
  5. `docs/contenu-modules.md` : consigner le contenu de départ (libellés d'échelles, liste des cartes seed) et
     **marquer ce qui doit être validé par Thibault**.
- **Validation :** auto `npm run build`. visuel : le module apparaît sur l'accueil et s'ouvre ; échelles 0–10
  manipulables avec relances ; cartes déplaçables, éditables, ajout d'un nouvel item OK ; rien hors cadre ; rien
  n'est persisté (reload = état neuf).
- **Si bloqué :** drag natif instable au resize/tablette → borner le tableau blanc en coordonnées relatives et
  clamp dans le cadre ; si le contenu (libellés/seed) dépasse une source neutre → **STOP**, placeholder, signaler dans `VALIDATION.md`.
- **Commit :** `feat(module): explorer ma motivation (echelles + tableau blanc)`
- **Statut :** [ ] à faire

---

## Dépendances / ordre

```
R1 (anti-débordement)  →  prérequis de confort pour R2, R3, R4, R5, R6 (graphes bornés)
Lot B : R2, R3 (indépendants)
Lot C : R4 et R5 partagent nicotineCurve.ts → NE PAS paralléliser sur ce fichier (R4 ne le touche pas ; R5 oui)
        R6 indépendant
Lot D : R7 (peut suivre R3), R8 indépendants
Lot E : R9 (nouveau module, le plus gros, indépendant mais à faire en dernier)
```

Ordre recommandé : **R1 → R3 → R2 → R7 → R6 → R8 → R4 → R5 → R9**.
(Quick wins layout/esthétique d'abord ; refontes temps réel R4/R5 ensuite car elles demandent un aller-retour de
validation pédagogique Thibault ; nouveau module R9 en dernier.)

## Mode autonome possible vs arbitrage requis

- **Exécutables en autonomie (gate = Auto)** : R1, R2, R3, R4, R6, R7, R8.
- **Proposition + validation Thibault (récit illustratif)** : R5 (amplitudes stress fumeur vs non-fumeur).
- **Validation contenu Thibault** : R9 (libellés d'échelles + liste seed « Mes raisons » à confirmer/sourcer).

## Images IA (optionnel, à la demande de Thibault)

Rappel invariant 2 : tout visuel embarqué doit finir en **SVG/CSS inline** (pas de bitmap). La majorité des besoins
sont couverts par `lucide-react` / SVG inline. Cas où une image générée puis **convertie en SVG propre** pourrait
aider : illustrations des **formes de substituts** (patch, gomme, pastille, inhaleur) pour la Partie A de M3 (hors
périmètre ici, lié à C10). Aucun visuel généré n'est **nécessaire** pour R1–R9. Sur demande, Opus fournira des
prompts ciblés (fond transparent, style plat, palette de `tokens.css`).

## Après le lot — mise à jour du contexte (obligatoire)

- [ ] **PLAN** : passer chaque tâche faite à `[x]` (exécuté par / le / commit).
- [ ] **STATUS.md** : refléter l'état réel (débordement corrigé ; M2/M5 temps réel ; M7 ajouté).
- [ ] **VALIDATION.md** : 1 entrée par tâche pour la passe visuelle de Thibault (dont questions R5/R9).
- [ ] **PROJECT_MAP.md** : ajouter le module `motivation/` et tout helper ajouté à `nicotineCurve.ts`.
- [ ] **TASKS.md** : statut des R1–R9.
- [ ] **DECISIONS.md** : consigner « M5 modèle temps réel », « M7 focus positif (pas de balance décisionnelle) ».
- [ ] Vérifier qu'aucun fichier de contexte n'est devenu faux. Commits atomiques par tâche.
