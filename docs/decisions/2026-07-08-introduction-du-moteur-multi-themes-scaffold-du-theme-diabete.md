# 2026-07-08 — Introduction du moteur multi-thèmes + scaffold du thème diabète

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

