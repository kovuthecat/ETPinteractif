# PLAN_modules-tabac.md — Plan d'exécution   (rédigé par Opus)

> **Exécutants (Sonnet / Haiku / Codex)** : faites UNIQUEMENT votre tâche.
> Suivez les **Étapes dans l'ordre**. Lisez UNIQUEMENT les fichiers sous « Lire ».
> Ne créez AUCUN fichier ni dépendance hors « Modifier ». Le design est fixé par Opus —
> ne reconcevez pas. Doute ou blocage → **STOP**, signalez, rendez la main. N'improvisez pas.

- **Date :** 2026-06-28 · **Rédigé par :** Opus · **Branche :** — (repo local, main)
- **Plan parent / lié :** —

## Convention de validation (s'applique à TOUTES les tâches)

Chaque tâche a deux niveaux de validation :
- **Auto** = gate du commit, responsabilité de l'exécutant : `npm run build` (typecheck inclus)
  et `npm run test` quand la tâche touche de la logique pure. Pas de commit si ça échoue.
- **Visuel** = responsabilité de **Thibault**, **non bloquant** : l'exécutant **ne tente PAS**
  de le vérifier (pas de navigateur, pas de capture d'écran). Il reporte la ligne « visuel : »
  de la tâche dans `VALIDATION.md` (1 entrée/tâche : quoi regarder, attendu) et continue.
  Thibault déroule la checklist en une session `npm run dev` en fin de lot.

## Objectif global

Construire le squelette de l'app ETP (Vite + React + TS, local-first, zéro persistance) et les 6 premiers
modules du thème tabac, à interaction « manipulation libre ». Le contenu détaillé de chaque module est
dans `docs/contenu-modules.md` (autorité du contenu).

## Contexte / décision clé

- Invariants : `CLAUDE.md` (zéro persistance, hors-ligne, multi-thèmes, sources discrètes).
- Conception des modules : `docs/contenu-modules.md` §"Décisions de conception transverses" + §Module X.
- **Pile runtime imposée (ne pas ajouter d'autre dépendance _runtime_)** : `react`, `react-dom`, `vite`, `typescript`,
  `@vitejs/plugin-react`, `lucide-react` (icônes). _Exception devDep test_ : `vitest` autorisé (cf. T5). **Styles : CSS Modules** (`*.module.css`) + `tokens.css`.
  **Pas de router** (navigation par état dans `App.tsx`). **Pas de lib de graphes** (courbes en SVG pur).
- **Contrat de navigation** : chaque module reçoit la prop `onNavigate(id: ModuleId)` pour les renvois.
- **Contrat visuel** : lisible à ~1 m (grandes cibles, contrastes), mention « schéma illustratif » sur les courbes.

## Tâches

### T1 — Scaffolding du projet · Modèle : Sonnet
- **But :** initialiser l'app Vite React-TS et l'ossature de dossiers/styles.
- **Lire :** `PROJECT_BRIEF.md` §Stack ; `docs/architecture.md` ; ce PLAN §Contexte.
- **Modifier (créer) :** `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`,
  `src/main.tsx`, `src/App.tsx` (placeholder « Hello »), `src/styles/tokens.css`, `src/styles/global.css`,
  dossiers vides `src/components/`, `src/features/`, `src/lib/`.
- **Hors périmètre :** aucun module, aucune logique métier.
- **Étapes :**
  1. `npm create vite@latest . -- --template react-ts` dans le dossier projet (ne pas écraser les `.md` ni `.git`/`.gitignore` existants ; si l'outil refuse un dossier non vide, générer dans un sous-dossier temporaire puis déplacer les fichiers source).
  2. `npm i` puis `npm i lucide-react`.
  3. Créer `src/styles/tokens.css` : variables CSS `--color-bg`, `--color-surface`, `--color-text`,
     `--color-accent`, `--color-warn`, `--radius`, `--font-size-base` (grand, ~18px), `--space-*`.
  4. `src/styles/global.css` : reset léger, `font-family` système, fond, import des tokens ; importer le tout dans `main.tsx`.
  5. `App.tsx` = simple `<div>ETP — socle OK</div>` pour valider le build.
- **Validation :**
  - auto : `npm run build` → succès ; `npm run dev` → démarre sans erreur.
  - visuel : page « ETP — socle OK » s'affiche.
- **Si bloqué :** si `npm create vite` refuse d'écrire dans le dossier non vide et qu'aucune option `.`/sous-dossier ne marche → STOP, signaler.
- **Commit :** `chore: scaffolding Vite React-TS + styles de base`
- **Statut :** [x] fait · exécuté par : Sonnet · le : 2026-06-28 · commit : c101ef4

### T2 — Types, registre des modules, navigation · Modèle : Sonnet
- **But :** poser le modèle de données des modules, le registre, et la navigation par état (carte ↔ module), avec des **stubs** pour les 6 modules.
- **Lire :** `docs/contenu-modules.md` §"Modules retenus" + §"Décisions transverses" ; ce PLAN §Contexte.
- **Modifier (créer) :** `src/features/types.ts`, `src/features/registry.ts`,
  `src/features/<slug>/<Nom>Module.tsx` (6 stubs), `src/App.tsx` (navigation).
- **Hors périmètre :** ne pas implémenter le contenu des modules (stubs uniquement) ; ne pas styliser la carte (fait en T4).
- **Étapes :**
  1. `types.ts` :
     ```ts
     export type ModuleId = 'addiction' | 'nicotine' | 'substituts' | 'nicotine-toxique' | 'soulagement' | 'craving';
     export interface ModuleProps { onNavigate: (id: ModuleId) => void; }
     export interface ModuleDef {
       id: ModuleId; titre: string; resume: string;
       Icon: import('lucide-react').LucideIcon;
       Component: React.ComponentType<ModuleProps>;
     }
     ```
  2. Créer 6 fichiers stub, ex. `src/features/nicotine/NicotineModule.tsx` :
     `export default function NicotineModule(_: ModuleProps){ return <p>À venir</p>; }`
     Slugs/dossiers : `addiction`, `nicotine`, `substituts`, `nicotine-toxique`, `soulagement`, `craving`.
  3. `registry.ts` : tableau `MODULES: ModuleDef[]` (ordre = liste du §Modules retenus), titres = noms des modules,
     `resume` = 1 phrase tirée de l'objectif du module, `Icon` = une icône lucide cohérente par module.
  4. `App.tsx` : état `view: 'home' | ModuleId`. `navigateTo(id)`. Rend la carte (placeholder list pour l'instant)
     ou le module sélectionné via `registry`, en passant `onNavigate={navigateTo}`.
- **Validation :**
  - auto : `npm run build` → succès.
  - visuel : liste cliquable des 6 modules → ouvre chaque stub « À venir » → retour possible.
- **Si bloqué :** si le typage `LucideIcon` pose problème, typer `Icon: React.ComponentType<{size?:number}>` ; ne pas changer l'archi.
- **Commit :** `feat: types, registre des modules et navigation par etat`
- **Statut :** [x] fait · exécuté par : Sonnet · le : 2026-06-28 · commit : fa8f923

### T3 — Coquille de module + sources discrètes + carte · Modèle : Sonnet
- **But :** composants partagés : `ModuleShell` (en-tête + retour + sources), `Sources` (pop-over discret), `ModuleCard`.
- **Lire :** `docs/contenu-modules.md` §"Décisions transverses" (sources discrètes) ; ce PLAN §Contexte.
- **Modifier (créer) :** `src/components/ModuleShell.tsx` (+ `.module.css`),
  `src/components/Sources.tsx` (+ `.module.css`), `src/components/ModuleCard.tsx` (+ `.module.css`).
- **Hors périmètre :** ne pas modifier les modules ni la carte d'accueil (T4 consomme `ModuleCard`).
- **Étapes :**
  1. `ModuleShell` props : `{ titre: string; sources?: string[]; onBack: () => void; children }`. En-tête avec
     bouton retour (icône) à gauche, titre centré, `<Sources>` à droite. Contenu = `children`.
  2. `Sources` props : `{ items?: string[] }`. Icône « info » discrète ; clic → petit pop-over listant les sources ;
     si `items` vide → afficher « Sources : à compléter ».
  3. `ModuleCard` props : `{ titre; resume; Icon; onClick }`. Grande carte cliquable (icône + titre + résumé).
- **Validation :**
  - auto : `npm run build` → succès.
  - visuel : composants isolés rendables (vérifié indirectement en T4).
- **Si bloqué :** —
- **Commit :** `feat: coquille de module, sources discretes et carte`
- **Statut :** [x] fait · exécuté par : Sonnet · le : 2026-06-28 · commit : dfe1c94

### T4 — Carte centrale (accueil) · Modèle : Haiku
- **But :** écran d'accueil = grille des modules à partir du registre.
- **Lire :** `src/features/registry.ts`, `src/components/ModuleCard.tsx`, `src/App.tsx` (zone home).
- **Modifier :** `src/App.tsx` (remplacer la liste placeholder par une grille de `ModuleCard`),
  créer `src/components/Home.tsx` (+ `.module.css`) si plus propre.
- **Hors périmètre :** ne pas toucher aux modules, types, registre.
- **Étapes :**
  1. Mapper `MODULES` → `<ModuleCard … onClick={() => navigateTo(m.id)} />` dans une grille responsive.
  2. Titre de page sobre (ex. « Sevrage tabagique »).
- **Validation :**
  - auto : `npm run build` → succès.
  - visuel : grille de 6 cartes lisibles, clic ouvre le module, retour fonctionne.
- **Si bloqué :** —
- **Commit :** `feat: carte centrale des modules`
- **Statut :** [x] fait · exécuté par : Haiku · le : 2026-06-28 · commits : 0fc4637 (grille), 17f2b64 (ModuleShell)

### T5 — Utilitaire de courbe nicotine · Modèle : Sonnet
- **But :** fonction pure générant les courbes (partagée par Modules 2 et 5), valeurs **relatives 0–1**, **avec test unitaire** (c'est ici que l'auto-validation a le plus de valeur : logique pure, pas de rendu).
- **Lire :** `docs/contenu-modules.md` §Module 2 (modèle de courbe) ; ce PLAN (constantes ci-dessous).
- **Modifier (créer) :** `src/lib/nicotineCurve.ts`, `src/lib/nicotineCurve.test.ts` ; `package.json` (script `test`, devDep `vitest`).
- **Hors périmètre :** aucun composant React, aucun SVG d'UI (juste path string). Ne pas configurer jsdom (logique pure, runtime node suffit).
- **Étapes :**
  0. `npm i -D vitest` ; ajouter `"test": "vitest run"` dans `package.json` (scripts).
  1. Implémenter `src/lib/nicotineCurve.ts` exactement :
  ```ts
  export const THRESHOLD_LOW = 0.25;
  export const THRESHOLD_HIGH = 0.80;
  export const PATCH_PLATEAU = 0.45;
  export type CurveEvent = { kind: 'cigarette' | 'ponctuel' | 'vapoteuse'; t: number }; // t in [0,1]
  // noyaux (t0 = event.t, x courant) :
  //  cigarette : A=0.90, decay rapide  -> A*exp(-(x-t0)/0.03)               (x>=t0)
  //  ponctuel  : A=0.35, lent          -> A*(exp(-(x-t0)/0.12)-exp(-(x-t0)/0.04)) (x>=t0, clamp>=0)
  //  vapoteuse : A=0.50, intermediaire -> A*(exp(-(x-t0)/0.07)-exp(-(x-t0)/0.03)) (x>=t0, clamp>=0)
  //  patch     : plateau PATCH_PLATEAU avec rampe lineaire sur les premiers 10% (x<0.1)
  export function sampleCurve(opts: { patch: boolean; events: CurveEvent[]; n?: number }): number[]; // n défaut 120, somme clampée [0,1]
  export function toSvgPath(ys: number[], width: number, height: number): string; // y=0 en bas
  ```
  2. Écrire `src/lib/nicotineCurve.test.ts` (Vitest) — au minimum :
     - `sampleCurve({patch:false, events:[]})` → longueur `n` (défaut 120), toutes valeurs dans `[0,1]`.
     - une cigarette à `t=0.2` → la courbe n'est PAS plate (max > 0) et le pic est proche de `t=0.2`.
     - même `t`, pic `cigarette` > pic `ponctuel` (amplitudes 0.90 vs 0.35).
     - `patch:true` → plateau ≈ `PATCH_PLATEAU` après la rampe (x ≥ 0.1).
     - composition de plusieurs events → valeurs toujours clampées ≤ 1.
     - `toSvgPath([0,1], 100, 50)` → renvoie une string non vide commençant par `M`.
- **Validation :**
  - auto : `npm run build` → succès (typecheck OK) **et** `npm run test` → tous verts.
- **Si bloqué :** si une normalisation rend la courbe plate, garder les amplitudes brutes clampées — ne pas réajuster le design.
- **Commit :** `feat: utilitaire de courbe nicotine (SVG) + tests vitest`
- **Statut :** [x] fait · exécuté par : Sonnet · le : 2026-06-28 · commit : d275377

### T6 — Module 2 : nicotine (bac à sable) · Modèle : Sonnet  *(Codex acceptable)*
- **Pourquoi ce modèle :** logique interactive + SVG la plus complexe du lot.
- **But :** graphique manipulable (cigarette / patch / ponctuel / vapoteuse / réinitialiser) avec 2 seuils.
- **Lire :** `docs/contenu-modules.md` §Module 2 ; `src/lib/nicotineCurve.ts` ; `src/components/ModuleShell.tsx` ; `src/features/types.ts`.
- **Modifier :** `src/features/nicotine/NicotineModule.tsx` (+ `.module.css`).
- **Hors périmètre :** ne pas modifier `nicotineCurve.ts`, le registre, la navigation.
- **Étapes :**
  1. État : `patch: boolean`, `events: CurveEvent[]`. Boutons « Fumer une cigarette / Substitut ponctuel / Vapoteuse »
     ajoutent un event à un `t` réparti (ex. prochain créneau régulier) ; toggle « Patch » ; bouton « Réinitialiser ».
  2. Rendu SVG : zone de tracé, **2 lignes pointillées** (LOW, HIGH), bande « zone confortable » entre les deux,
     path via `toSvgPath(sampleCurve(...))`. Mention « schéma illustratif ».
  3. Légende courte des messages clés (§Module 2). Envelopper dans `<ModuleShell titre sources onBack…>` (onBack via onNavigate? non : ModuleShell.onBack vient de App ; ici le module reçoit `onNavigate`, le retour global est géré par App → **le module n'affiche pas son propre retour**, il est dans ModuleShell fourni par App). NOTE : voir §"Contrat coquille" ci-dessous.
- **Validation :**
  - auto : `npm run build` → succès.
  - visuel : chaque bouton modifie la courbe en direct ; seuils visibles ; reset fonctionne.
- **Si bloqué :** si la composition d'events dépasse 1 et sature visuellement, c'est attendu (clamp) — ne pas redessiner le modèle.
- **Commit :** `feat(module): nicotine cinetique et seuils`
- **Statut :** [x] fait · exécuté par : Sonnet · le : 2026-06-28 · commit : bd5d649

### T7 — Module 5 : le piège du soulagement · Modèle : Sonnet
- **But :** bascule non-fumeur (ligne stable) vs fumeur (yo-yo) réutilisant la courbe.
- **Lire :** `docs/contenu-modules.md` §Module 5 ; `src/lib/nicotineCurve.ts` ; `src/features/nicotine/NicotineModule.tsx` (imiter le rendu SVG).
- **Modifier :** `src/features/soulagement/SoulagementModule.tsx` (+ `.module.css`).
- **Hors périmètre :** ne pas modifier la courbe ni le module nicotine.
- **Étapes :**
  1. Toggle « Non-fumeur / Fumeur ». Non-fumeur = ligne plate calme (tableau constant). Fumeur =
     `sampleCurve({ patch:false, events: cigarettes à t=0.1,0.3,0.5,0.7,0.9 })` (yo-yo sous LOW entre cigarettes).
  2. Annotation : le « plaisir » = soulagement du manque créé ; ton non culpabilisant.
- **Validation :** auto `npm run build` ; visuel : bascule change la courbe + le message.
- **Si bloqué :** —
- **Commit :** `feat(module): le piege du soulagement`
- **Statut :** [x] fait · exécuté par : Sonnet · le : 2026-06-28 · commit : 4386f03

### T8 — Module 1 : composantes de l'addiction · Modèle : Haiku
- **But :** 3 piliers cliquables, chacun 2 onglets (exemples / outils+renvois).
- **Lire :** `docs/contenu-modules.md` §Module 1 (tableau de contenu) ; `src/features/types.ts` (onNavigate).
- **Modifier :** `src/features/addiction/AddictionModule.tsx` (+ `.module.css`).
- **Hors périmètre :** ne rien écrire d'autre que le contenu du tableau §Module 1 ; pas d'invention médicale.
- **Étapes :**
  1. 3 boutons piliers (Physique / Psychologique / Comportementale) ; sélection affiche 2 onglets.
  2. Onglet « De quoi parle-t-on ? » = liste d'exemples ; onglet « Outils » = conseils courts +
     boutons de renvoi appelant `onNavigate('nicotine'|'substituts'|'craving')` selon le tableau.
- **Validation :** auto `npm run build` ; visuel : navigation piliers/onglets + renvois fonctionnent.
- **Si bloqué :** —
- **Commit :** `feat(module): composantes de l'addiction`
- **Statut :** [x] fait · exécuté par : Haiku · le : 2026-06-28 · commit : a0ed3b7

### T9 — Module 3 : substituts & titration · Modèle : Sonnet
- **But :** A) sélecteur de formes (bonnes pratiques / erreurs, avec placeholders à remplir) ; B) illustration interactive de la **méthode** de titration (pas de calcul).
- **Lire :** `docs/contenu-modules.md` §Module 3 (Parties A et B + données cliniques validées) ; `src/features/types.ts`.
- **Modifier :** `src/features/substituts/SubstitutsModule.tsx` (+ `.module.css`).
- **Hors périmètre :** **aucun dosage chiffré** ; ne pas inventer le contenu A (mettre des placeholders « à compléter » par forme).
- **Étapes :**
  1. Partie A : onglets/chips des 7 formes (patch 24h/16h, gomme, pastille, comprimé sublingual, inhaleur, spray, vapoteuse) ;
     panneau « Bonnes pratiques » / « Erreurs fréquentes » avec texte placeholder par forme.
  2. Partie B : patch dessiné en **4 quarts**. Deux toggles « envie persiste » / « signes de surdosage ».
     Bouton « + ¼ (à J+2-3) » (activable si envie & pas de surdosage) ajoute un quart ; « surdosage → revenir en arrière » retire un quart.
     Toggle « Jour / Nuit » montrant deux patchs (nuit ≤ jour). Message permanent « expérimentez, fiez-vous à votre ressenti ».
- **Validation :** auto `npm run build` ; visuel : sélecteur de formes OK ; ajout/retrait de quarts + jour/nuit cohérents avec la méthode.
- **Si bloqué :** —
- **Commit :** `feat(module): substituts et titration du patch`
- **Statut :** [x] fait · exécuté par : Sonnet · le : 2026-06-28 · commit : 7c3c581

### T10 — Module 4 : la nicotine n'est pas le toxique · Modèle : Haiku
- **But :** comparatif « ce qui rend malade » vs « ce qui crée la dépendance », avec bascule de mise en évidence.
- **Lire :** `docs/contenu-modules.md` §Module 4 (listes exactes) ; `src/features/types.ts` (renvois).
- **Modifier :** `src/features/nicotine-toxique/NicotineToxiqueModule.tsx` (+ `.module.css`).
- **Hors périmètre :** respecter la nuance « nicotine non anodine mais pas ce qui tue » ; pas d'autre affirmation médicale.
- **Étapes :**
  1. Deux colonnes : fumée (goudrons, CO, particules fines, ~7000 substances, ~70 cancérogènes) ; nicotine.
  2. Bascule « ce qui crée la dépendance » / « ce qui rend malade » → met en évidence le bon groupe ; clic d'un item → son rôle.
  3. Renvois `onNavigate('substituts'|'nicotine')`.
- **Validation :** auto `npm run build` ; visuel : bascule + items cliquables + renvois.
- **Si bloqué :** —
- **Commit :** `feat(module): la nicotine n'est pas le toxique`
- **Statut :** [ ] à faire · exécuté par : — · le : — · commit : —

### T11 — Module 6 : gérer le craving (4D) · Modèle : Sonnet
- **But :** vague de l'envie (minuteur ~30 s) + 4 cartes D (dont animation de respiration).
- **Lire :** `docs/contenu-modules.md` §Module 6 ; `src/features/types.ts`.
- **Modifier :** `src/features/craving/CravingModule.tsx` (+ `.module.css`).
- **Hors périmètre :** pas de persistance ; pas de son.
- **Étapes :**
  1. « La vague de l'envie » : courbe en cloche (SVG) ; bouton « Une envie arrive » lance un repère qui parcourt la vague
     en ~30 s ; états affichés ça monte → pic → ça redescend → c'est passé ; bouton replay. Utiliser `requestAnimationFrame` ou timer, nettoyer à l'unmount.
  2. 4 cartes D (Différer, Distraire, Décontracter, De l'eau), chacune déplie un conseil ; « Décontracter » propose
     une **animation de respiration** (cercle CSS, inspire 4 s / expire 6 s en boucle quand activée).
  3. Aparté discret « En parler — Tabac Info Service 39 89 ».
- **Validation :** auto `npm run build` ; visuel : minuteur joue/rejoue et se nettoie ; cartes dépliables ; respiration anime.
- **Si bloqué :** —
- **Commit :** `feat(module): gerer le craving (4D)`
- **Statut :** [ ] à faire · exécuté par : — · le : — · commit : —

## Contrat coquille (à respecter par tous les modules)

`App.tsx` enveloppe le module sélectionné dans `<ModuleShell titre sources onBack=…>` et lui passe `onNavigate`.
**Décision** : c'est **App** qui rend `ModuleShell` (en-tête + retour + sources), pas chaque module — les modules ne
rendent QUE leur contenu interactif et reçoivent `onNavigate`. App lit `titre`/`sources` depuis le registre.
→ En T2, étendre `ModuleDef` avec `sources?: string[]` ; en T3/T6-T11, les modules ne dupliquent pas l'en-tête.

## Dépendances / ordre

```
T1 → T2 → T3 → T4
T2 → T5 → T6 → T7
T2,T3 prérequis de T6–T11
T8, T9, T10, T11 indépendants entre eux (après T2/T3)
```

## Après le lot — mise à jour du contexte (obligatoire)

- [ ] **PLAN** : passer chaque tâche faite à `[x]` (exécuté par / le / commit).
- [ ] **STATUS.md** : refléter l'état réel (modules fonctionnels, placeholders restants).
- [ ] **VALIDATION.md** : checklist visuelle/UX à jour (1 entrée par module/tâche) pour la passe de Thibault.
- [ ] **PROJECT_MAP.md** : remplacer l'arborescence « cible » par l'arborescence réelle ; lister les modules.
- [ ] **Autres fichiers SEULEMENT si changés** : DECISIONS / ROADMAP / TASKS / PROJECT_BRIEF.
- [ ] Vérifier qu'aucun fichier de contexte n'est devenu faux.
- [ ] Commits atomiques par tâche (messages ci-dessus).
