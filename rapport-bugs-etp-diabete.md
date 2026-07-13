# Rapport de bugs & améliorations — ETP interactif · thème **Diabète**

> **Origine** : audit navigateur (Claude in Chrome) sur https://etp-interactif.vercel.app/, reconstruit
> dans Claude Code le 2026-07-13 à partir du copier-coller intégral de la session (le rapport `.md` d'origine
> avait bien été téléchargé côté navigateur ; cette version ajoute les **chemins de fichiers source vérifiés**).
>
> Stack : Vite + React + TS + CSS Modules, local-first, zéro persistance.

## ✅ Déjà appliqué par Claude Code (2026-07-13)

Deux retours diabète mineurs demandés en fin de session, appliqués directement (données du registre,
typecheck OK) — [src/features/diabete/registry.ts](src/features/diabete/registry.ts) :

- **Module « Hypoglycémie » déplacé en dernier** dans l'ordre d'affichage (déplacé après « Insuline rapide »
  dans le tableau `MODULES`, famille `soigner`).
- **« Insuline : adapter les doses » renommé « Insuline basale »** (`titre` uniquement ; l'`id` `insuline`,
  le dossier et les imports sont inchangés). *Résumé laissé tel quel — à ajuster si besoin.*

## Synthèse par priorité

| # | Titre | Priorité | Fichier(s) source |
|---|-------|----------|-------------------|
| 5 | « Couvrir le repas » : courbe + message ne croisent pas glucides × dose | **Haute (logique)** | `src/features/diabete/insuline-rapide/InsulineRapideModule.tsx` (+ `lib/glycemieCurve.ts`) |
| 6 | « Le piège du cumul » : situation mal posée + résolution hors cadre | **Haute (logique/rendu)** | `src/features/diabete/insuline-rapide/InsulineRapideModule.tsx` |
| 4 | Illustrations des signes d'hypo masquées sur la carte imprimable | Moyenne (bug rendu) | `src/features/diabete/hypoglycemie/HypoglycemieModule.tsx` (+ `.module.css`) |
| 3 | Proportions : drag sur SVG + camembert + icônes Lucide | Moyenne (évolution) | `src/features/diabete/alimentation/AlimentationModule.tsx` |
| 2 | Mettre en avant la conséquence de chaque lésion | Basse (UX) | `src/features/diabete/risque-cardio/RisqueCardioModule.tsx` |
| 1 | Icônes/illustrations par thème (écran de sélection) | Basse (UI) | `src/components/ThemeSelector.tsx` |

---

## #5 — [BUG LOGIQUE MAJEUR] « Couvrir le repas » : les résultats (courbe + message) ne croisent pas glucides × dose

**Écran** : Module « Insuline rapide (avant le repas) » → onglet **« Couvrir le repas »**.
**Fichier (vérifié — les libellés de message y figurent)** : `src/features/diabete/insuline-rapide/InsulineRapideModule.tsx`.
Logique de courbe probable : `src/features/diabete/lib/glycemieCurve.ts`.
Contrôles (radios) : Glucides `ref_58`(Peu)/`ref_59`(Moyen)/`ref_60`(Beaucoup) ; Dose `ref_62`(Moins)/`ref_63`(Habituelle)/`ref_64`(Plus).

**Objectif pédagogique visé** : faire comprendre que la bonne dose dépend du repas — repas moyen → dose
standard, repas léger → un peu moins, repas lourd → un peu plus. Le « bon » résultat (courbe qui revient dans
la cible + message positif) doit apparaître **sur la diagonale** : Peu+Moins, Moyen+Habituelle, Beaucoup+Plus.

**Constat après test exhaustif des 9 combinaisons** (bandes du SVG `viewBox 0 0 640 262` : `y<80` = hyper,
`80–150` = cible, `y>150` = hypo) :

- **Bug A — la COURBE ne dépend que des glucides, jamais de la dose.** Pour un repas donné, changer la dose ne
  change pas la courbe (`yMin` identique) :
  - Peu → `yMin=100` (reste dans la cible) — pour Moins **et** Habituelle **et** Plus.
  - Moyen → `yMin=74` (monte en hyper) — identique pour les 3 doses.
  - Beaucoup → `yMin=48` (hyper marqué) — identique pour les 3 doses.
  → La dose d'insuline n'a **aucun** effet sur la glycémie simulée (l'inverse de l'attendu : plus de dose = glycémie plus basse).
- **Bug B — le MESSAGE ne dépend que de la dose, jamais des glucides.**
  - Dose « Moins » → toujours « trop peu… au-dessus de la cible ».
  - Dose « Habituelle » → toujours « …le pic est couvert : le sucre revient vers la cible ».
  - Dose « Plus » → toujours « trop… poussé sous la cible — risque d'hypo ».
  → Conséquences absurdes : **Beaucoup + Plus** (le bon appariement attendu) affiche « risque d'hypo » ❌ ;
  **Moyen + Habituelle** dit « couvert » ✅ mais la courbe monte quand même en hyper ❌ ; **Peu + Plus** dit
  « risque d'hypo » alors que la courbe ne descend jamais sous la cible.

**Comportement attendu** : courbe **et** message fonction du **couple** (glucides, dose), via un écart
`= dose − besoinRepas` (échelle −1 / 0 / +1) :
- écart = 0 → repas couvert, courbe qui pique légèrement puis revient dans la cible → message positif ;
- écart < 0 (pas assez d'insuline) → courbe en hyper → « pas assez couvert » ;
- écart > 0 (trop d'insuline) → courbe sous la cible → « risque d'hypo ».

**Matrice attendue (courbe)** :

|          | Moins | Habituelle | Plus |
|----------|-------|-----------|------|
| Peu      | cible ✅ | hypo | hypo |
| Moyen    | hyper | cible ✅ | hypo |
| Beaucoup | hyper | hyper | cible ✅ |

**Où corriger** : la fonction qui calcule le `path` de la courbe « avec rapide » **et** le texte du message
doivent toutes deux consommer `(glucides, dose)` ensemble (aujourd'hui chacune ne lit qu'une seule variable).
Le tracé pointillé « sans rapide » (référence) peut rester fonction des seuls glucides.

---

## #6 — [BUG pédagogique + rendu] « Le piège du cumul » : situation mal posée + résolution non visible

**Écran** : Module « Insuline rapide » → onglet **« Le piège du cumul »**.
**Fichier** : `src/features/diabete/insuline-rapide/InsulineRapideModule.tsx`.
Contrôles : Situation `ref_112`(redescend seule)/`ref_113`(reste haute) ; Action `ref_115`(n'ajoute pas)/`ref_116`(recorrige tout de suite)/`ref_117`(attends puis recorrige).

Test des 6 combinaisons : la mécanique message↔courbe est techniquement cohérente, **mais deux problèmes de
fond invalident l'objectif pédagogique**.

**Problème A — la situation « La glycémie redescend toute seule » n'a pas de sens ici (à retirer ou reformuler).**
Le « piège du cumul » enseigne : une glycémie qui **reste haute** en post-prandial pousse à recorriger tout de
suite → on empile sur la 1ʳᵉ dose encore active → hypo. La leçon = **attendre la fin d'action** de la 1ʳᵉ dose.
Or « redescend toute seule » = glycémie déjà normale en post-prandial → personne n'envisage de correction, il
n'y a rien à corriger. Cette branche brouille le message (elle laisse croire qu'on pourrait « recorriger » une
glycémie normale).
- **Reco** : retirer cette situation, **ou** la reformuler en simple rappel « glycémie normale → aucune
  correction nécessaire », clairement séparée du piège, sans proposer les options de recorrection.
- Si on la garde : la courbe de base doit rester **franchement au milieu de la cible** — actuellement son nadir
  touche `y≈153` (sous la limite de cible à 150), ce qui suggère à tort un risque.

**Problème B — dans « La glycémie reste haute », la résolution (retour dans la cible) n'est pas visible.**
Combinaison « Reste haute » + « J'attends puis je recorrige » : le message dit « ramène dans la cible », mais on
ne voit jamais ce retour à l'écran.
- Preuve (fenêtre de plot `x ≈ 100→600`) : la courbe de base « reste haute » est tracée de `x=100` à `x=600`
  (bord droit, +3 h) et reste en hyper (`y 59–83`) ; la courbe de correction (pointillé) va de `x=100` jusqu'à
  **`x=975`** et n'atteint la cible (`yEnd≈121`) qu'à `x≈975`, **bien au-delà du bord droit (600)**.
  → La partie « ça redescend et se stabilise dans la cible » est calculée mais **rendue hors du cadre visible** :
  l'utilisateur ne voit qu'une plongée qui sort du graphe, jamais l'atterrissage réussi.
- **Recos** : étendre la fenêtre temporelle (axe X jusqu'à +4 h/+5 h) **ou** compresser l'échelle de temps de la
  courbe de correction pour que le retour se produise avant `x=600` ; terminer par un **plateau net dans la bande
  verte**, à l'intérieur du cadre ; idéalement marquer le moment « fin d'action de la 1ʳᵉ dose » (marqueur « A »).
- Mineur : la légende affiche la courbe « Avec rapide » même dans le cas « n'ajoute pas » (où il n'y a pas de
  correction tracée) — n'afficher que les courbes réellement rendues.

---

## #4 — [Bug rendu + amélioration] Illustrations des signes d'hypo masquées sur la carte imprimable

**Écran** : Thème Hypoglycémie → bouton « Ma carte » → modale « Ma carte-réflexe 15 / 15 » (aperçu avant impression).
**Fichier** : `src/features/diabete/hypoglycemie/HypoglycemieModule.tsx` + `HypoglycemieModule.module.css`.

**Constat clé : les illustrations existent déjà mais sont masquées.** La modale contient deux représentations
des signes — des **chips texte** (visibles) et un **bloc profil avec illustrations** qui, lui, est rendu 0×0 px
car un ancêtre est en `display:none` :

```
_module_12lk5_1        display:flex  (1160px)  ← visible
  └ _panel_12lk5_32     display:none            ← ❌ MASQUÉ ICI
      └ _profilGrid_12lk5_53   0×0
          └ _profilCol_12lk5_60   0×0
              └ _preview_12lk5_70   0×0
                  └ _previewItem_12lk5_81 (img + label)  0×0
```

Les images sont pourtant bien chargées (`naturalWidth: 512`, `complete: true`) :
`/illustrations/diabete/signe-tremblements.png`, `signe-palpitations.png`, `signe-irritabilite.png`.
Chips texte visibles : `<span class="_previewLabel_12lk5_89">` dans `_previewItem_12lk5_81`.

**Actions** :
1. Vérifier le comportement à l'impression réelle : `_panel_12lk5_32` est-il réactivé via `@media print` ?
   Si oui, l'aperçu écran est trompeur (les illus sortiraient au papier mais pas à la preview) ; si non, elles
   ne sortent nulle part → bug.
2. Objectif : faire apparaître les illus `signe-*.png` sur la carte imprimable, à côté (ou à la place) des chips
   texte de la section « MES SIGNES ». Option simple : injecter le `<img>` correspondant dans chaque
   `_previewItem` de la section visible (mapping Tremblements → `signe-tremblements.png`, etc.).
3. Impression : `print-color-adjust: exact;` (+ `-webkit-`) pour que les images ne soient pas supprimées, et
   taille explicite (~40–48 px) car le conteneur s'effondre à 0.
- **Connexe** : des illus de resucrage existent aussi (`resucrage-jus/-sucre/-comprimes/-soda.png`) → même
  traitement possible pour la section « MON RESUCRAGE ».

---

## #3 — [Évolution] Proportions : réglage par **drag sur le SVG** + **camembert** + **icônes Lucide**

**Écran** : Thème « Alimentation » → onglet **« Proportion »**.
**Fichier** : `src/features/diabete/alimentation/AlimentationModule.tsx` (+ `data.ts`, `.module.css`).
Items : Légumes / Protéines / Féculents. Refs +/− existants : Légumes `ref_25`/`ref_26`, Protéines `ref_28`/`ref_29`, Féculents `ref_32`/`ref_33`.

**Problème initial** : les boutons +/− ne permettent pas un réglage précis (pas irrégulier ≈15 %, total contraint
à 100 % qui redistribue automatiquement sur un autre item sans que l'utilisateur comprenne lequel).

**Structure actuelle du SVG** (centre (100,100), rayon 92) :

```html
<svg viewBox="0 0 200 200" role="img" aria-label="Répartition de l'assiette en parts">
  <circle cx="100" cy="100" r="92" fill="none" stroke="var(--color-line)" stroke-dasharray="3 5"/>
  <path fill="var(--color-confort)" d="M 100 100 L 100.0 8.0 A 92 92 0 0 1 154.1 174.4 Z"/>  <!-- Légumes -->
  <path fill="var(--color-toxique)" d="M 100 100 L 154.1 174.4 A 92 92 0 1 1 100.0 8.0 Z"/>  <!-- Féculents -->
  <circle cx="100" cy="100" r="34" fill="var(--color-bg)"/>  <!-- trou central du donut -->
</svg>
```
⚠️ Seuls les segments > 0 % sont rendus (Protéines à 0 % → pas de `<path>`) — à gérer pour le drag.

**A. Réglage direct par drag sur le SVG**
- Poignées sur les frontières inter-segments, à l'angle `= cumulativePct * 3.6°`. Angle→coord :
  `x = 100 + R*sin(θ)`, `y = 100 − R*cos(θ)` (0° en haut, sens horaire — cohérent avec le `path` qui démarre à 100,8).
- Sur `pointerdown`/`pointermove` : `θ = atan2(y−100, x−100)`, convertir en %, redistribuer entre les **deux
  segments adjacents** (les autres fixes) → total = 100 % garanti. Pointer Events (souris + tactile), snap 5 %.
- Conserver les boutons +/− en fallback accessible/clavier.

**B. Donut → camembert** (plus représentatif d'une assiette) : retirer le `<circle r="34" fill="var(--color-bg)">`
(les `<path>` vont déjà jusqu'au centre). Option « assiette » : liseré circulaire externe + ombre portée douce.

**C. Icônes Lucide par section** : Légumes → `Carrot`/`Salad`/`Leaf` ; Protéines → `Beef`/`Egg`/`Fish`/`Drumstick` ;
Féculents → `Wheat`/`Croissant`/`Cookie`. Placer dans chaque ligne d'item (à côté/à la place de la pastille de
couleur), colorisées via la variable CSS correspondante, `aria-hidden="true"`.
Variables observées : `--color-confort` (Légumes, vert), `--color-toxique` (Féculents, rouge), `--color-bg`,
`--color-line` (vérifier la variable de couleur des Protéines / l'or).

---

## #2 — [Amélioration UX] Mettre davantage en avant la conséquence de chaque lésion

**Écran** : Thème « Risque cardiovasculaire » (Module 4 du **thème diabète**) → onglet « L'anatomie » →
« Cliquez une zone du corps ».
**Fichiers** : `src/features/diabete/risque-cardio/RisqueCardioModule.tsx` (+ `.module.css` pour
`_zoneDescPanel_1eepl_201`, `_vueEyebrow_1eepl_39`) ; silhouette + hotspots via
`src/features/diabete/components/Silhouette.tsx` (`_wrap_g2u2u_1`, `_bodyImg_g2u2u_18`, `_hotspot_g2u2u_142`,
état actif `_hotspot--ouvert_g2u2u_179`).

> **Fausse alerte du rapport navigateur, corrigée** : l'image `src="/illustrations/diabete/silhouette.png"`
> **n'est pas** un mauvais nommage. « Risque cardiovasculaire » **est** un module du thème Diabète, donc le
> chemin `/illustrations/diabete/` est correct. Aucune action requise sur ce point.

**Demande** : quand on clique une zone du corps (hotspot : Cœur / Cou / Jambes), la conséquence
physiopathologique doit être bien plus mise en avant. Aujourd'hui le message apparaît dans un panneau texte
discret (ex. Cou → « Une artère du cou bouchée peut priver une partie du cerveau de sang : c'est l'AVC. »).
L'info clé (la conséquence, ici l'AVC) se noie dans la phrase.

Panneau à faire évoluer : `<div class="_zoneDescPanel_1eepl_201 card"><p>…</p></div>`.

**Pistes** :
- Restructurer la donnée de chaque zone en champs distincts : `{ zone, mecanisme, consequence, severite }` (au
  lieu d'une phrase unique) pour pouvoir styler la conséquence à part.
- Mettre la conséquence **en exergue** : titre/badge fort (ex. « ⚠️ Conséquence : AVC ») au-dessus, puis le
  mécanisme en texte secondaire. Code couleur de gravité par zone, lien visuel hotspot actif ↔ conséquence,
  pictogramme de la conséquence.

---

## #1 — [Amélioration UI] Icônes / illustrations par thème sur l'écran « Choisir un thème »

**Écran** : écran de sélection de thème (heading « Choisir un thème »).
**Fichier** : `src/components/ThemeSelector.tsx` + `ThemeSelector.module.css` (cartes `_card_1rxx9_29`,
corps `_body_1rxx9_59`, titre `_titre_1rxx9_66`, description `_description_1rxx9_80`).

Chaque carte de thème est actuellement uniquement textuelle (titre + description). Ajouter une icône/illustration
en tête de chaque carte pour l'identification visuelle.

```html
<button type="button" class="card _card_1rxx9_29">
  <span class="_body_1rxx9_59">
    <span class="_titre_1rxx9_66">Sevrage tabagique</span>
    <span class="_description_1rxx9_80">Comprendre l'addiction, …</span>
  </span>
</button>
```

**Piste** : insérer un élément (icône SVG Lucide, ou `<img>` depuis `/public`) comme **premier enfant** du
`<button>`, avant `_body`, via un mapping `thème → icône` (ex. poumon/cigarette barrée pour le sevrage, goutte de
sang/glycémie pour le diabète). `aria-hidden="true"` (icône décorative, le titre porte l'info).

---

## Points « à vérifier / non audités »

- Onglets **non audités** du module Insuline rapide : « Le bon moment » et « Corriger avant le repas »
  (vérifier qu'ils ne souffrent pas de la même logique mono-variable que #5).
- Variable CSS de couleur des **Protéines** / la teinte or (#3).
