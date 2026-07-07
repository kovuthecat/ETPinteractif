# DESIGN_REFONTE.md — Système de design de la refonte UI   (autorité, rédigé par Opus)

Source de vérité de la refonte. **Autorité primaire = le handoff Claude Design** (source lisible, avec toute
la logique de chaque composant) :

- **`maquettes/handoff/projet-etp-interactif/project/ETP Tabac.dc.html`** — LA référence. Format `<x-dc>`
  (bindings `{{ }}`, `<sc-if>`), styles inline exacts **et** un bloc `<script type="text/x-dc" data-dc-script>`
  qui contient **tout l'état et toute la logique** (courbes, seuils, interactions). C'est là qu'on lit les
  valeurs exactes (dimensions, couleurs, formules) — pas un screenshot.
- **`maquettes/handoff/dc-script.extracted.js`** — le bloc `data-dc-script` extrait seul (≈836 lignes),
  pour lire la logique sans le markup. Constantes/fonctions de courbe, tension, craving, dial, données modules.
- **`maquettes/handoff/projet-etp-interactif/README.md`** — note d'intention Claude Design (recréer *pixel-perfect*
  dans la techno cible ; ne pas copier la structure interne du prototype ; ne pas rendre au navigateur).
- **`maquettes/reference/fonts/`** — les 4 woff2 (variables) à copier dans l'app. **Conservés** : le handoff
  charge les polices via Google Fonts (CDN), interdit hors-ligne → on garde ces woff2 auto-hébergés.
- *(secondaire)* `maquettes/reference/snapshot.html` — rendu HTML aplati que j'avais décodé du bundle standalone ;
  pratique pour un survol visuel, mais **le `.dc.html` prime** (il a la logique, pas le snapshot).

> ⚠️ `support.js` (handoff) = uniquement le **runtime du design-tool** (`dc-runtime`), pas la logique de l'app — l'ignorer.
> Ce fichier fixe les **décisions** de design ; les sessions s'y réfèrent au lieu de les recopier. On ne reconçoit
> pas : on traduit le handoff en React + CSS Modules (structure interne libre, rendu identique).

---

## 1. Principe

Refonte **visuelle** de l'app existante (7 modules déjà fonctionnels). On garde la structure, la navigation
et les interactions actuelles **sauf** là où la maquette les redessine (cf. §6, seul Motivation change vraiment).
Esthétique cible : **éditoriale, chaleureuse « papier crème/kraft »**, titres en serif, UI en sans, ombres
brunes douces, grands rayons. Invariants projet inchangés (zéro persistance, hors-ligne, lisible à ~1 m,
couleur jamais seule — cf. `CLAUDE.md`).

## 2. Typographie

Deux familles, **auto-hébergées** (invariant hors-ligne — pas de Google Fonts au runtime) :

| Rôle | Famille | Poids utilisés |
| --- | --- | --- |
| Titres / hero / titres de module | **Source Serif 4** (serif) | 500, 600, 700 |
| UI, corps, boutons, labels | **Work Sans** (sans) | 400, 500, 600, 700, 800 |

Fichiers (variables, couvrent tous les poids) dans `maquettes/reference/fonts/`, à copier vers
`public/fonts/` :

- `SourceSerif4-latin.woff2` (`unicode-range: U+0000-00FF, …` latin) + `SourceSerif4-latinExt.woff2` (latin-ext, accents FR).
- `WorkSans-latin.woff2` + `WorkSans-latinExt.woff2`.

`@font-face` : `font-display: swap`, deux `@font-face` par famille (latin + latin-ext, mêmes `unicode-range`
que la maquette — copier depuis `snapshot.html`), `src: url('/fonts/…') format('woff2')`. Pas de préconnexion réseau.

**Échelle de taille** (repère, valeurs de la maquette) : hero/titre section `34px` · titres de module `26–28px` ·
sous-titres `20–22px` · corps `15–16px` · labels/légendes `13–14px` · micro `11–12px`. Body base = `16px` Work Sans.

**Eyebrow** (surtitre type « PROGRAMME ETP · SEVRAGE TABAGIQUE ») : `13px`, `font-weight:700`,
`letter-spacing:.09em`, `text-transform:uppercase`, couleur `--color-nav`.

## 3. Couleurs (tokens `oklch`)

Remplacer la palette hex actuelle de `tokens.css` par ces valeurs `oklch` (mêmes **noms sémantiques** qu'aujourd'hui
pour ne pas casser les modules — la convention confort/toxique/vigilance/nav de l'en-tête de `tokens.css` reste vraie).

```css
:root {
  /* fonds & texte */
  --color-bg:        oklch(97% 0.015 75);   /* crème papier (ex #f7f4ee) */
  --color-surface:   #ffffff;               /* cartes/panneaux            */
  --color-surface-glass: rgba(255,255,255,.85);
  --color-text:      oklch(24% 0.02 50);    /* brun chaud sombre          */
  --color-text-soft: rgba(40,30,20,.55);    /* texte secondaire           */
  --color-text-faint: rgba(40,30,20,.45);   /* labels/eyebrows discrets   */
  --color-line:      rgba(60,40,20,.14);    /* bordures/hairlines         */

  /* sémantique (couleur JAMAIS seule — toujours + libellé/icône/forme) */
  --color-nav:       oklch(48% 0.08 230);   /* bleu — navigation, neutre  */
  --color-confort:   oklch(58% 0.09 145);   /* vert — confort/protecteur  */
  --color-confort-strong: oklch(38% 0.09 145);
  --color-toxique:   oklch(55% 0.15 30);    /* rouge chaud — toxicité     */
  --color-vigilance: oklch(65% 0.13 80);    /* ambre/or — vigilance       */
  --color-accent:    var(--color-nav);      /* alias historique           */
  --color-warn:      var(--color-toxique);  /* alias historique           */

  /* teintes douces = même hue en alpha .10–.18 (fonds de pastilles/bandes) */
  --color-nav-soft:       oklch(48% 0.08 230 / .12);
  --color-confort-soft:   oklch(58% 0.09 145 / .16);
  --color-toxique-soft:   oklch(55% 0.15 30 / .12);
  --color-vigilance-soft: oklch(65% 0.13 80 / .16);

  /* rayons */
  --radius-sm: 10px;  --radius: 12px;  --radius-lg: 16px;  --radius-pill: 999px;

  /* élévation (ombres brunes) */
  --shadow-1: 0 1px 3px rgba(60,40,20,.08);   /* cartes au repos          */
  --shadow-2: 0 4px 14px rgba(60,40,20,.14);  /* survol / éléments actifs */
  --shadow-3: 0 8px 28px rgba(40,30,20,.18);  /* pop-overs / overlays     */

  /* conservés de l'actuel */
  --font-size-base: 16px;  --target-min: 44px;
  --space-xs:4px; --space-sm:8px; --space-md:16px; --space-lg:24px; --space-xl:40px;
}
```

Notes :
- `oklch(... / .NN)` = même couleur en alpha (les teintes « soft »). Support navigateur OK (cible = Chromium récent en consultation).
- **Accessibilité daltonisme préservée** : la couleur reste doublée d'un libellé/icône/forme partout (invariant 6).
  Le double encodage déjà en place (⚠/🧠, libellés de zone MANQUE/CONFORT/SURDOSAGE, bornes, etc.) **ne doit pas être retiré** au restylage.
- Chaque **carte de module** de l'accueil porte une **pastille d'icône teintée** (`38×38`, `radius:10px`,
  fond `<hue> / .16`, point/icône `<hue>`) — la teinte varie par module ; lire la valeur exacte dans `snapshot.html`.

## 4. Élévation, rayons, surfaces

- Fond de page = `--color-bg` (crème). Conteneur centré `max-width: 980px; margin:0 auto; padding: 44px 40px 60px` (desktop).
- Cartes/panneaux = `--color-surface`, `--radius-lg`, `--shadow-1`, bordure `1px solid --color-line`.
- Pop-overs (Sources, étiquettes hotspot) = `--shadow-3`, `--radius`.
- Pastilles/chips = `--radius-pill`.

## 5. Primitives d'UI partagées (à définir en S1 dans `global.css`)

La maquette répète quelques motifs. Pour éviter que chaque module les réinvente, S1 crée un petit jeu de
**classes utilitaires globales** (dans `global.css`, hors CSS Modules) que les modules réutilisent via `className`.
Valeurs exactes à relever dans `snapshot.html` ; specs cibles :

- `.btn` (base) : `min-height:44px`, `padding:10px 16px`, `border-radius:--radius-pill`, `font:600 15px 'Work Sans'`,
  `cursor:pointer`, transition douce.
  - `.btn--primary` : fond `--color-nav`, texte blanc, `--shadow-1`.
  - `.btn--ghost` : fond transparent, bordure `1px --color-line`, texte `--color-text`.
  - `.btn--tertiary` : lien discret (Réinitialiser…), texte `--color-text-soft`, sans fond.
- `.chip` : pastille `--radius-pill`, `padding:4px 12px`, fond soft de la couleur sémantique, texte de la couleur forte.
- `.card` / `.panel` : surface + `--radius-lg` + `--shadow-1` + bordure `--color-line`.
- `.eyebrow` : cf. §2.
- `.callout` : bloc de lecture encadré (bord gauche épais couleur vigilance) — réutilisé par Soulagement (« lecture en 2 temps »).
- `.alert` : bannière rouge explicite (surdosage) — fond `--color-toxique-soft`, bord `--color-toxique`.
- Bandes de zone du graphe (MANQUE/CONFORT/SURDOSAGE) : fonds soft vigilance/confort/toxique + libellé en capitales.

> Les modules gardent leur `.module.css` pour le **layout spécifique** ; ils délèguent aux classes ci-dessus
> l'apparence des boutons/chips/cartes/bandes pour rester cohérents et éviter la dérive.

## 6. Deltas par module (visuel + interaction)

Réf. maquette = section correspondante du `snapshot.html` (chercher le libellé). « Restyle » = appliquer tokens +
primitives, aligner libellés/espacements sur la maquette, **sans** toucher la logique. Les interactions actuelles
sont décrites dans `STATUS.md` / `docs/architecture.md`.

| Module (fichier) | Nature | Détail |
| --- | --- | --- |
| **Accueil** `components/Home` | Restyle + copie | Surtitre `PROGRAMME ETP · SEVRAGE TABAGIQUE`, titre serif « Votre accompagnement », 3 familles (Comprendre / Agir / Se motiver) avec eyebrow discret, cartes = pastille teintée + titre `15.5/600` + résumé. |
| **Addiction** `features/addiction` | Restyle | Venn 3 cercles + sélection → panneau « De quoi parle-t-on ? » / « Outils & stratégies — <pilier> ». Garder géométrie/hitAreas et le double encodage. |
| **Nicotine** `features/nicotine` | ⚠ **Ré-implémentation (modèle changé)** | Le modèle a **entièrement changé** dans le handoff (cf. `dc-script.extracted.js`) : axe temps **24 h** (`TIME_MAX=24`, temps snappé au ¼h), niveau **0–100** (baseline 4), **3 types** Cigarette/Patch/Substitut, **dose par événement** (patch en quarts, `×N` ajustable ±¼), nouveaux noyaux (cigarette `40·(1−e^(−dt/0.04))·e^(−dt·LN2/1.2)`, patch `30·dose` rampe 0,5 h puis plateau, substitut `26·(1−e^(−dt/0.35))·e^(−dt·LN2/2.2)`). La **logique** va dans `nicotineCurve.ts` via **S10** ; ce module ré-implémente l'UI (outils, clic-placer sur 24 h, dose ±¼, bandes MANQUE/CONFORT/SURDOSAGE, chip « Pic atteint », légende). Pas un simple restyle. |
| **Substituts** `features/substituts` | Restyle + ajout mineur | 7 cartes-formes ; bonnes pratiques / erreurs ; titration par quarts ; **bannière `.alert` surdosage** ; bloc Jour/Nuit. La maquette ajoute un encart **« Technique de prise — <forme> »** (illustration placeholder) : le poser en placeholder sobre, sans inventer de contenu. Aucun dosage chiffré. |
| **Nicotine ≠ toxique** `features/nicotine-toxique` | Restyle | Scène SVG + hotspots ; bascule « ⚠ Ce qui rend malade » / « 🧠 Ce qui crée la dépendance » ; étiquette ancrée près du point ; légende. Garder le double encodage ⚠/🧠. |
| **Soulagement** `features/soulagement` | ⚠ **Ré-implémentation (modèle changé)** | Nouveau modèle de **tension** découplé de la nicotine (cf. handoff) : `HIGH=90, TROUGH=15, non-fumeur=4, TAU=2.2` ; à chaque cigarette la tension **chute au creux 15 puis remonte** vers 90 : `level = 90 − 75·e^(−(t−dernièreCig)/2.2)` (axe 24 h). Logique dans `nicotineCurve.ts` via **S10** ; ce module ré-implémente frise clic « fumer une cigarette », tracé tension, `.callout` « Lecture en 2 temps », annotation délai, « Comparer au non-fumeur » (ligne repère à `non-fumeur=4`). |
| **Craving** `features/craving` | Aligner sur handoff | ⚠ Différent de l'app actuelle : **compte à rebours 3 min** (`CRAVING_DURATION=180`, horloge 3:00→0:00), phases idle/active/done ; **vague = Bézier** (`CRAVING_WAVE_SEGMENTS`) parcourue par un marqueur « maintenant » ; **4 D multi-sélection** aux libellés du handoff — **Différer / Détourner l'attention / Se détendre — respirez / D'eau** ; « Se détendre » = respiration (`etp-breathe`) ; aparté 39 89. **Pas** d'opacité graduée ni de « 3 états Différer » (c'était l'app actuelle). |
| **Motivation** `features/motivation` | **Restyle + réécriture d'interaction** | ⚠ Seul vrai changement de geste. La maquette remplace les **2 curseurs 0–10** par un **flux à 2 questions** (« Question 1 sur 2 » / « … 2 sur 2 ») avec un **cadran circulaire à glisser** (« Faites glisser autour du cercle »), relances EM (« Pourquoi pas N-1 plutôt que N ? », « Qu'est-ce qui aiderait à passer à N+1 ? »), boutons « Suivant → » / « Terminer → », puis écran de synthèse « Merci d'avoir pris ce temps » + récap Importance/Confiance + « ↺ Revoir mes réponses ». L'onglet « Mes raisons » = tableau + réserve **du handoff** : **clic sur une carte de la réserve → l'ajoute au tableau** (pas de drag HTML5) ; repositionnement au **pointeur** dans le tableau ; clic = édition ; « + une raison ». Seed = `MOTIVATION_SEED` (Ma santé, Mes proches, Le budget, Le goût/l'odorat, Mon souffle/ma forme, Ma liberté). Zéro persistance (état éphémère). |

## 7. Ce qui ne change PAS

- Logique pure `src/lib/nicotineCurve.ts` et ses tests : **modifiés uniquement par la session dédiée S10**
  (le comportement des courbes a changé dans la maquette — nouvelle cible à spécifier par Thibault).
  Aucune autre session ne touche ce fichier ; S4 et S7 n'adaptent que le **rendu** dans leur module.
- Contrat coquille : `App.tsx` rend `ModuleShell` autour du module ; les modules ne dupliquent pas l'en-tête.
- `registry.ts` / `types.ts` : inchangés (titres, familles, icônes conservés) sauf ajout éventuel de `sources` (hors périmètre refonte).
- Aucune dépendance runtime ajoutée. Pas de router. SVG pur pour les graphes.
