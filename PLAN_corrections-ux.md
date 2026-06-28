# PLAN_corrections-ux.md — Plan d'exécution   (rédigé par Opus)

> **Exécutants (Sonnet / Haiku / Codex)** : faites UNIQUEMENT votre tâche.
> Suivez les **Étapes dans l'ordre**. Lisez UNIQUEMENT les fichiers sous « Lire ».
> Ne créez AUCUN fichier ni dépendance hors « Modifier ». Le design est fixé par Opus —
> ne reconcevez pas. Doute ou blocage → **STOP**, signalez, rendez la main. N'improvisez pas.

- **Date :** 2026-06-28 · **Rédigé par :** Opus · **Branche :** — (repo local, main)
- **Plan parent / lié :** `PLAN_modules-tabac.md` (clos, T1-T11) · **Source :** `AUDIT_VISUEL_UX_2026-06-28.md` (audit Codex)

## Pourquoi ce plan

L'audit du 28/06 conclut que l'app fonctionne mais ressemble à un prototype : le sens repose sur du texte
et des boutons, la palette est quasi monochrome, et **4 modules ont besoin d'un changement de modèle
d'interaction**, pas d'un simple ajustement CSS. Ce plan traduit l'audit en tâches exécutables, dans
l'ordre recommandé par son §9 : socle visuel → modèles fonctionnels → scènes fortes → contenu/accessibilité.

### Arbitrages déjà tranchés par Thibault (28/06)
- **Affiche « Autopsie d'un meurtrier » (La Ligue contre le cancer)** : **recomposition libre** — on s'en
  inspire (liste de substances), on ne la reproduit pas. Formulations médicales validées *après* (cf. C7).
- **Courbe de stress (module soulagement)** : Claude **propose** une forme schématique plausible
  (clairement marquée « illustrative »), **Thibault valide** le récit ensuite (cf. C4).
- **Périmètre de ce passage** : écrire le PLAN. Aucune tâche n'est exécutée tant que Thibault ne lance pas le lot.

## Convention de validation (s'applique à TOUTES les tâches)

- **Auto** = gate du commit, responsabilité de l'exécutant : `npm run build` (typecheck inclus) et
  `npm run test` quand la tâche touche de la logique pure. Pas de commit si ça échoue.
- **Visuel** = responsabilité de **Thibault**, **non bloquant** : l'exécutant **ne tente PAS** de le vérifier
  (pas de navigateur, pas de capture, pas de Playwright). Il reporte la ligne « visuel : » dans `VALIDATION.md`
  (1 entrée/tâche : quoi regarder, attendu) et continue. Thibault déroule en une session `npm run dev`.

## Invariants à NE PAS casser (rappel `CLAUDE.md`)

1. **Zéro persistance** (pas de localStorage/cookies/réseau). L'historique de navigation (C8) reste en mémoire React.
2. **Local-first / hors-ligne** : **aucune dépendance runtime ajoutée**. Illustrations = **SVG/CSS inline**, pas
   d'images binaires externes ni de lib (pas d'images bitmap, pas de lib de graphes/animation).
3. **Pile figée** : Vite + React + TS, CSS Modules + `tokens.css`, icônes `lucide-react`, pas de router.
4. **Multi-thèmes** : ne rien coder « tabac » dans le moteur générique (`ModuleShell`, `Home`, `registry` reste
   la seule liste de modules ; les tokens sémantiques sont génériques, pas « tabac »).
5. **Exactitude médicale** : tout contenu médical sourcé. En cas de doute clinique → **STOP**, signaler, ne pas inventer.
6. **Accessibilité daltonisme** : la couleur est **toujours doublée** d'un libellé, d'une icône ou d'une forme.

---

## Lot A — Socle visuel sémantique  *(fondation, faible risque, débloque tout le reste)*

### C1 — Tokens sémantiques + utilitaires d'accessibilité · Modèle : Sonnet
- **But :** remplacer la palette monochrome par un système sémantique et poser les utilitaires de lisibilité/cibles.
- **Lire :** `src/styles/tokens.css`, `src/styles/global.css` ; `AUDIT_VISUEL_UX_2026-06-28.md` §1 et §8.
- **Modifier :** `src/styles/tokens.css`, `src/styles/global.css`.
- **Hors périmètre :** ne PAS modifier les modules (ils consommeront ces tokens dans C2-C9) ; ne pas changer la structure HTML.
- **Étapes :**
  1. `tokens.css` — ajouter une palette sémantique (en plus des tokens existants, ne pas casser les noms actuels) :
     `--color-confort` (vert), `--color-toxique` (rouge), `--color-vigilance` (ambre), `--color-nav` (bleu, =
     l'`--color-accent` actuel), + variantes « -soft » (fonds clairs). Passer `--color-bg` à un **fond chaud très
     clair** (au lieu du gris froid `#f7f7f5`).
  2. Tokens de lisibilité : `--font-size-base` reste 18px ; ajouter `--font-size-lead` (~20px, texte utile),
     `--font-size-small` (≥16px, plus jamais 14px pour du texte lu à distance) ; `--target-min: 44px`.
  3. `global.css` — utilitaires génériques : classe d'**état actif doublé** (contour + coche/`✓` + libellé, pas
     seulement la couleur) réutilisable par les bascules ; `min-height/min-width: var(--target-min)` sur
     `button`/contrôles tactiles ; bloc `@media (prefers-reduced-motion: reduce)` neutralisant `animation`/`transition`.
  4. Documenter en tête de `tokens.css` la **convention sémantique** (vert/rouge/ambre/bleu + « couleur toujours doublée »).
- **Validation :** auto `npm run build`. visuel : fond plus chaud, boutons plus hauts, rien de cassé sur l'accueil et les 6 modules.
- **Si bloqué :** —
- **Commit :** `feat(ui): palette semantique + utilitaires accessibilite (tokens)`
- **Statut :** [x] fait

---

## Lot B — Corrections de modèle fonctionnel (P0/P1 logique)

### C2 — Substituts : titration illimitée + patchs en grille 2×2 (P0) · Modèle : Sonnet
- **But :** pouvoir représenter 1, 1¼, 2, 3, 4… patchs ; chaque patch dessiné en **4 carrés (2×2)**.
- **Lire :** `src/features/substituts/SubstitutsModule.tsx` (+ `.module.css`) ; `docs/contenu-modules.md` §Module 3 ;
  `AUDIT_VISUEL_UX_2026-06-28.md` §4.
- **Modifier :** `src/features/substituts/SubstitutsModule.tsx` (+ `.module.css`).
- **Hors périmètre :** **aucun dosage chiffré** (rester en quarts/patchs) ; ne pas toucher la Partie A (formes), traitée en C10.
- **Étapes :**
  1. État : `quarts: number` **sans plafond** (supprimer `MAX_QUARTS` comme borne haute). Init = **4** (= 1 patch complet).
  2. `PatchQuarts` → composant qui rend **N patchs** : `patchsPleins = Math.floor(quarts/4)`, `reste = quarts%4`,
     chaque patch = **grille CSS 2×2** de 4 cases (remplies/vides). Ex. 9 quarts = 2 patchs pleins + 1 case du 3ᵉ.
  3. Double libellé non ambigu : afficher **« 2 patchs + 1/4 »** *et* **« 9 quarts »** simultanément.
  4. Boutons : **« + ¼ »** (incrémente, lié au scénario « envie persiste / pas de surdosage » comme reco) ;
     **« − ¼ » indépendant** (toujours dispo, min 0) ; conserver **« signes de surdosage → revenir en arrière »**
     comme reco visuelle (ambre/rouge via tokens C1). Jour/Nuit : nuit clampée ≤ jour, même rendu multi-patchs.
  5. Conserver le message « Expérimentez, fiez-vous à votre ressenti ».
- **Validation :** auto `npm run build`. visuel : on atteint 2, 3, 4+ patchs ; chaque patch a bien 4 carrés ;
  double libellé cohérent ; − ¼ marche hors surdosage.
- **Si bloqué :** —
- **Commit :** `feat(module): titration substituts illimitee + patchs 2x2`
- **Statut :** [x] fait

### C3 — Nicotine : lecture temporelle animée + coloration par zone (P0) · Modèle : Sonnet  *(Codex acceptable)*
- **But :** la concentration **monte puis redescend dans le temps** ; le tracé courant est **vert en zone
  confortable, rouge sous le manque / au-dessus du seuil haut** ; pictos de prise sur l'axe du temps.
- **Lire :** `src/features/nicotine/NicotineModule.tsx` (+ `.module.css`) ; `src/lib/nicotineCurve.ts` (+ `.test.ts`) ;
  `AUDIT_VISUEL_UX_2026-06-28.md` §3 ; ce PLAN §Invariants.
- **Modifier :** `src/features/nicotine/NicotineModule.tsx` (+ `.module.css`), `src/lib/nicotineCurve.ts`,
  `src/lib/nicotineCurve.test.ts`.
- **Hors périmètre :** rester **illustratif** (valeurs relatives 0–1, mention « schéma illustratif » conservée) ;
  ne pas en faire un outil de dosage clinique. Ne pas modifier le module soulagement (C4) bien qu'il partage `nicotineCurve.ts`.
- **Étapes :**
  1. `nicotineCurve.ts` — ajouter une **fonction pure** `classifyZone(y: number): 'manque' | 'confort' | 'haut'`
     (basée sur `THRESHOLD_LOW`/`THRESHOLD_HIGH`) + tests Vitest associés (frontières incluses). **C'est ici que
     l'auto-validation a le plus de valeur.**
  2. Module : remplacer le recalcul instantané par une **timeline jouée** — curseur « maintenant » qui avance de
     gauche à droite via `requestAnimationFrame` (nettoyé à l'unmount) ; contrôles **lecture / pause / vitesse /
     remise à zéro**. Un clic « cigarette / substitut / vapoteuse / patch » ajoute la prise **au temps courant**.
  3. Rendu : tracer le segment **déjà écoulé** coloré par `classifyZone` (vert/rouge via tokens C1, **doublé** d'un
     libellé d'état « manque / confort / trop haut » dans une jauge secondaire simple) ; le futur reste discret.
  4. Chaque prise laisse un **pictogramme** (icône lucide) sur l'axe du temps. Respecter `prefers-reduced-motion`
     (si réduit : pas d'animation, afficher la courbe complète + état final).
- **Validation :** auto `npm run build` **et** `npm run test` (dont `classifyZone`). visuel : après un clic, la
  montée puis la descente se dessinent ; la couleur/état suit la zone à tout instant ; play/pause/reset OK.
- **Si bloqué :** si l'animation sature (events rapprochés), c'est attendu (clamp) — ne pas redessiner le modèle.
- **Commit :** `feat(module): nicotine timeline animee + coloration par zone`
- **Statut :** [ ] à faire

### C4 — Soulagement : graphe stress + nicotine (P0) · Modèle : Sonnet
- **But :** non-fumeur = **aucune courbe de nicotine**, seulement un stress basal bas et stable ; fumeur = nicotine
  (secondaire) + **stress (principal)** en corrélation inverse (le stress monte quand la nicotine redescend).
- **Lire :** `src/features/soulagement/SoulagementModule.tsx` (+ `.module.css`) ; `src/lib/nicotineCurve.ts` ;
  `docs/contenu-modules.md` §Module 5 ; `AUDIT_VISUEL_UX_2026-06-28.md` §6.
- **Modifier :** `src/features/soulagement/SoulagementModule.tsx` (+ `.module.css`), `src/lib/nicotineCurve.ts`
  (+ `.test.ts`) si la courbe de stress y est ajoutée comme fonction pure.
- **Hors périmètre :** la courbe de stress est une **proposition schématique** (mention « illustrative »
  obligatoire) → **Thibault valide le récit après coup**. Ne pas modifier le module nicotine (C3).
- **Étapes :**
  1. Ajouter une fonction pure `sampleStress(opts)` (ou paramètre dédié) dans `nicotineCurve.ts` + tests :
     - **Non-fumeur :** stress **bas et stable** (constante basse), **pas de nicotine du tout**.
     - **Fumeur :** stress basal **légèrement au-dessus** de celui du non-fumeur ; à chaque cigarette, **baisse
       transitoire** du stress (soulagement) synchronisée avec le **pic de nicotine**, puis remontée quand la
       nicotine redescend → corrélation **inverse** visible.
  2. Module : non-fumeur → tracer **uniquement** la ligne de stress basal. Fumeur → nicotine en **pointillé/
     secondaire** + stress en **trait plein principal** ; annoter « soulagement du manque » au moment du creux.
  3. Comparaison finale superposée optionnelle : rendre visible que le **niveau moyen de tension** du fumeur reste
     plus haut. Couleurs sémantiques C1 + libellés (jamais la couleur seule). Ton non culpabilisant conservé.
- **Validation :** auto `npm run build` (+ `npm run test` si fonction pure). visuel : écran non-fumeur **sans
  aucune courbe de nicotine** ; écran fumeur rend évidente la corrélation inverse manque↔stress.
- **Si bloqué :** si le récit pédagogique exact (amplitudes, basal) est incertain → coder une version plausible
  marquée « illustrative » et **lister la question dans `VALIDATION.md`** pour arbitrage Thibault. Ne pas inventer de chiffres cliniques.
- **Commit :** `feat(module): soulagement graphe stress + nicotine`
- **Statut :** [ ] à faire

### C5 — Craving : les 4D agissent sur la vague (P1) · Modèle : Sonnet
- **But :** chaque outil **occupe la zone du pic** pendant que la vague continue de redescendre derrière, au lieu
  d'ouvrir du texte sous le graphe.
- **Lire :** `src/features/craving/CravingModule.tsx` (+ `.module.css`) ; `docs/contenu-modules.md` §Module 6 ;
  `AUDIT_VISUEL_UX_2026-06-28.md` §7.
- **Modifier :** `src/features/craving/CravingModule.tsx` (+ `.module.css`).
- **Hors périmètre :** pas de persistance, pas de son. Ne pas « effacer » techniquement la courbe (elle continue derrière).
- **Étapes :**
  1. Réimplanter les outils en **overlays ancrés sur la zone du pic** du graphe (position absolue dans le conteneur SVG) :
     - **Différer** : compte à rebours couvrant la zone du pic ; **Distraire** : activité visuelle au premier plan
       atténuant la courbe ; **Décontracter** : cercle respiratoire superposé au pic (inspire 4 s / expire 6 s) ;
       **De l'eau** : courte séquence de gorgées / checklist gestuelle.
  2. Autoriser **plusieurs outils** simultanés ; montrer que **la vague redescend toujours** derrière l'overlay.
  3. Ajouter un bouton **« passer 30 s »** (démo courte en consultation). Cibles ≥ 44 px (tokens C1).
     Respecter `prefers-reduced-motion`.
- **Validation :** auto `npm run build`. visuel : un outil choisi au pic occupe le centre du graphe tandis que la
  vague poursuit sa descente en arrière-plan ; « passer 30 s » accélère.
- **Si bloqué :** —
- **Commit :** `feat(module): craving 4D agissant sur la vague`
- **Statut :** [ ] à faire

---

## Lot C — Deux scènes fortes (P0/P1)

### C6 — Addiction : trois cercles qui se chevauchent (P1) · Modèle : Sonnet
- **But :** remplacer les 3 boutons indépendants par **3 cercles SVG qui se chevauchent** (physique / psychologique /
  comportemental), montrant l'imbrication sans hiérarchie.
- **Lire :** `src/features/addiction/AddictionModule.tsx` (+ `.module.css`) ; `docs/contenu-modules.md` §Module 1 ;
  `AUDIT_VISUEL_UX_2026-06-28.md` §2 ; `src/features/types.ts` (onNavigate).
- **Modifier :** `src/features/addiction/AddictionModule.tsx` (+ `.module.css`).
- **Hors périmètre :** garder **le contenu exact** du §Module 1 (pas d'invention) ; cercles de **chevauchement**
  (diagramme de Venn), surtout **pas concentriques** (impliquerait une hiérarchie).
- **Étapes :**
  1. 3 cercles SVG se recouvrant, chacun coloré + **étiqueté** (libellé, jamais couleur seule), quelques mots-clés au repos.
  2. Au clic sur un cercle : il **avance légèrement** ; ses exemples (§Module 1) apparaissent en **petites bulles** autour.
  3. **Intersection centrale** : message « ces dimensions s'alimentent entre elles ».
  4. Outils du pilier → **cartes-actions** en périphérie, reliées visuellement au cercle concerné. Renvois inter-modules
     conservés (`onNavigate('nicotine'|'substituts'|'craving')`) **avec indication claire de changement de module**.
- **Validation :** auto `npm run build`. visuel (critère d'acceptation audit) : **sans lire le détail**, on nomme les
  3 dimensions et on comprend qu'elles se combinent.
- **Si bloqué :** —
- **Commit :** `feat(module): addiction en trois cercles qui se chevauchent`
- **Statut :** [ ] à faire

### C7 — Nicotine ≠ toxique : affiche interactive recomposée (P0) · Modèle : Sonnet  *(Codex acceptable)*
- **But :** recomposer l'idée de l'affiche en **scène interactive** (cigarette au centre, hotspots, bulles) où
  **rouge = combustion toxique** et **vert = nicotine isolée** ; remplacer le comparatif textuel actuel.
- **Lire :** `src/features/nicotine-toxique/NicotineToxiqueModule.tsx` (+ `.module.css`) ;
  `docs/contenu-modules.md` §Module 4 ; `AUDIT_VISUEL_UX_2026-06-28.md` §5 ; `src/features/types.ts`.
- **Modifier :** `src/features/nicotine-toxique/NicotineToxiqueModule.tsx` (+ `.module.css`).
- **Hors périmètre :** **recomposition libre** (décision Thibault) — **ne pas** importer/reproduire l'affiche d'origine
  (droits La Ligue) ; tout en **SVG/CSS inline** (invariant 2). **Regrouper les substances par famille/effet** plutôt
  qu'une forêt de libellés. Ne pas reprendre les formulations datées de l'affiche sans validation (cf. ci-dessous).
- **Étapes :**
  1. Scène SVG : cigarette / fumée au centre ; **hotspots** autour reliés par des traits.
  2. **Substances toxiques de la combustion = rouge**, **regroupées par effet/famille** (ex. irritants des voies
     respiratoires, cancérogènes, gaz/CO, métaux/radioactifs…) — éviter d'éparpiller 30 noms.
  3. **Nicotine = vert**, **spatialement isolée**, avec formulation nuancée (« crée la dépendance, n'est pas ce qui
     rend malade » — cf. §Module 4).
  4. Clic sur un hotspot → **bulle ancrée** au point (rôle, picto d'organe/effet, fermeture claire). Variante
     tablette : bulles **ne recouvrant pas** les hotspots.
  5. **Filtres** « toxiques de la combustion » / « dépendance » qui **atténuent** le reste sans le faire disparaître.
     Renvois `onNavigate('nicotine'|'substituts')`.
  6. **VALIDATION.md** : noter explicitement que **les formulations/regroupements médicaux sont à valider par
     Thibault** (certaines affirmations de l'affiche d'origine sont datées/impropres).
- **Validation :** auto `npm run build`. visuel (critère audit) : **sans ouvrir de bulle**, on comprend immédiatement
  « rouge = combustion toxique » et « vert = nicotine/dépendance, distincte de la toxicité de la fumée ».
- **Si bloqué :** doute clinique sur une substance/famille → **STOP**, mettre un placeholder neutre, signaler dans `VALIDATION.md`.
- **Commit :** `feat(module): affiche interactive toxiques vs nicotine`
- **Statut :** [ ] à faire

---

## Lot D — Navigation, accueil, contenu (finitions)

### C8 — Historique de navigation éphémère (P1) · Modèle : Haiku
- **But :** le bouton retour renvoie au **module précédent**, pas systématiquement à l'accueil — **sans persistance**.
- **Lire :** `src/App.tsx` ; `src/components/ModuleShell.tsx` ; `AUDIT_VISUEL_UX_2026-06-28.md` §8.
- **Modifier :** `src/App.tsx` (et `ModuleShell.tsx` seulement si le libellé/retour doit refléter l'origine).
- **Hors périmètre :** **pas de router**, **pas de persistance** (pile d'historique = state React en mémoire, perdue au reload).
- **Étapes :**
  1. Remplacer `view` par une **pile** `history: ('home' | ModuleId)[]` en `useState`. `navigateTo` empile ; `back` dépile.
  2. `onBack` de `ModuleShell` → revient à l'entrée précédente (module ou accueil), pas toujours `home`.
  3. Optionnel : fil d'Ariane éphémère court (ex. « Composantes → Substituts ») si simple.
- **Validation :** auto `npm run build`. visuel : Composantes → Substituts, retour → revient à Composantes (pas à l'accueil).
- **Si bloqué :** —
- **Commit :** `feat(nav): historique de navigation ephemere`
- **Statut :** [ ] à faire

### C9 — Accueil plus pédagogique (P1) · Modèle : Haiku
- **But :** mini-illustration par carte, résumés en **une phrase**, grille **3×2 centrée**, accroche « Que voulez-vous explorer ? ».
- **Lire :** `src/components/Home.tsx` (+ `.module.css`), `src/components/ModuleCard.tsx` (+ `.module.css`) ;
  `src/features/registry.ts` ; `AUDIT_VISUEL_UX_2026-06-28.md` §1.
- **Modifier :** `src/components/Home.tsx` (+ `.module.css`), `src/components/ModuleCard.tsx` (+ `.module.css`).
- **Hors périmètre :** mini-illustrations = **icônes lucide / SVG inline** (pas d'images binaires). Ne pas coder « tabac »
  dans `Home`/`ModuleCard` (rester générique, lire le registre). Résumés courts : si ça touche le texte, le faire dans `registry.ts`.
- **Étapes :**
  1. Grille **3×2 centrée** (au lieu d'occuper < moitié de la hauteur avec du vide en bas).
  2. Chaque `ModuleCard` : mini-pictogramme du mécanisme (icône/SVG), titre, **résumé 1 phrase** (texte ≥ 16-18 px, tokens C1).
  3. Accroche d'accueil « Que voulez-vous explorer ? » (plus adaptée à une consultation non linéaire qu'un titre de thème).
- **Validation :** auto `npm run build`. visuel : accueil centré, 6 cartes lisibles à ~1 m, résumés courts, accroche présente.
- **Si bloqué :** —
- **Commit :** `feat(ui): accueil pedagogique (grille 3x2, mini-illustrations, accroche)`
- **Statut :** [ ] à faire

### C10 — Contenu : sources par module + bonnes pratiques substituts (P1) · Modèle : Sonnet  — **BLOQUÉ sur contenu Thibault**
- **But :** renseigner les sources propres à chaque module et le contenu « bonnes pratiques / erreurs » par forme de
  substitut, pour sortir des états « à compléter ».
- **Lire :** `src/features/registry.ts` ; `src/features/substituts/SubstitutsModule.tsx` ; `docs/contenu-modules.md`.
- **Modifier :** `src/features/registry.ts` (`sources?`), `src/features/substituts/SubstitutsModule.tsx` (`FORMES_DATA`),
  `docs/contenu-modules.md` (consigner le contenu validé).
- **Hors périmètre :** **ne rien inventer** (invariant 5). Cette tâche **attend que Thibault fournisse** : références
  exactes (HAS / Tabac Info Service) par module, et le contenu clinique des 7 formes (+ illustrations par geste : pose
  du patch, mastication de la gomme, position de la pastille, geste du spray…).
- **Étapes :**
  1. **STOP tant que le contenu n'est pas fourni par Thibault.** Une fois fourni : remplir `sources?` par module et
     `FORMES_DATA[*].bonnesPratiques/erreurs`. Les illustrations de geste = SVG/CSS inline, validées avec le contenu clinique.
  2. Vérifier que `Sources.tsx` affiche proprement les sources renseignées (panneau lisible par module).
- **Validation :** auto `npm run build`. visuel : sources propres par module ; chaque forme a un contenu réel + visuel de geste.
- **Si bloqué (par défaut au lancement) :** contenu absent → **STOP**, rendre la main, signaler que C10 attend Thibault.
- **Commit :** `content: sources par module + bonnes pratiques substituts`
- **Statut :** [ ] à faire (bloqué — contenu Thibault requis)

---

## Dépendances / ordre

```
C1 (socle)  →  prérequis visuel de C2..C9
Lot B : C2, C3, C4, C5  (C3 et C4 partagent nicotineCurve.ts → ne pas les paralléliser sur le même fichier)
Lot C : C6, C7
Lot D : C8, C9 indépendants ; C10 bloqué (contenu Thibault)
```
Ordre recommandé (suit l'audit §9) : **C1 → C2 → C3 → C5 → C6 → C9 → C8 → C4 → C7 → C10**.
(C4 et C7 plus tard car ils demandent un aller-retour de validation contenu ; C10 quand Thibault fournit le contenu.)

## Mode autonome possible vs arbitrage requis

- **Exécutables en autonomie (gate = Auto)** : C1, C2, C3, C5, C6, C8, C9. Enchaîner, accumuler `VALIDATION.md`, rendre la main en fin de lot.
- **Proposition + validation Thibault** : C4 (récit de la courbe de stress), C7 (formulations médicales recomposées).
- **Bloqué sur contenu Thibault** : C10.

## Après le lot — mise à jour du contexte (obligatoire)

- [ ] **PLAN** : passer chaque tâche faite à `[x]` (exécuté par / le / commit).
- [ ] **STATUS.md** : refléter l'état réel (modèles d'interaction revus, ce qui reste en attente de contenu).
- [ ] **VALIDATION.md** : 1 entrée par tâche pour la passe visuelle de Thibault (dont questions de validation C4/C7).
- [ ] **PROJECT_MAP.md** : mettre à jour si l'arborescence change (nouveaux helpers `nicotineCurve.ts`, etc.).
- [ ] **DECISIONS.md** : consigner la décision « palette sémantique » et « recomposition libre de l'affiche ».
- [ ] Vérifier qu'aucun fichier de contexte n'est devenu faux. Commits atomiques par tâche.
