# PROJECT_MAP.md

Carte synthétique du projet. Sert à **localiser**, pas à comprendre l'historique — l'historique
complet vit dans `git log` + `docs/decisions/`. Plafond : 200 lignes (appliqué par hook).

---

## Vue d'ensemble

- Type : application web statique (Vite + React + TS), local-first, sans backend ni base.
- Grandes zones : un **écran de sélection de thème** (`ThemeSelector`, affiché si ≥ 2 thèmes) → une
  **carte de modules** par thème (`Home.tsx`) → des **modules ETP** indépendants
  (`src/features/<theme>/<slug>/`) → une **coquille de module** générique (`ModuleShell`) rendue par
  `App.tsx`.
- Navigation par état dans `App.tsx` (pas de router) :
  `view: {type:'themes'} | {type:'home', themeId} | {type:'module', themeId, moduleId}`.
- Flux principal : le soignant ouvre l'app → (si plusieurs thèmes) choisit un thème → carte des
  modules → clique un module → l'illustre avec le patient → revient à la carte. Aucune donnée
  n'est enregistrée côté consultation.
- Contrainte structurante : **multi-thèmes par conception**. Le moteur (`src/features/types.ts`,
  `src/features/registry.ts`, tout `src/components/`) ne connaît **aucun thème par son nom** —
  `ModuleId`/`FamilleId` sont des `string` génériques. Chaque thème (`tabac`, `diabete`, `cardio`)
  est un dossier isolé sous `src/features/<theme>/` avec son propre `registry.ts`.

---

## Arborescence réelle

```text
src/
  main.tsx / App.tsx        # entrée + navigation par état (themes <-> home <-> module)
  styles/                   # tokens.css (variables), global.css (reset)
  components/                # UI partagée, générique (aucun contenu de thème)
    ThemeSelector / Home / ModuleShell / Sources / ModuleCard
    FicheOverlay              # fiche à emporter générique (aperçu A4 + impression)
    ModuleFooterNav            # porte de fin de module « Continuer l'exploration »
    InfoHover                  # 2e niveau de lecture (survol/focus+clic), câblé partiellement
    RisqueBarre                # barre de risque qualitative générique (score 0-1), partagée cardio/diabète
    PrintableLivret             # livret d'accompagnement imprimable multi-pages A4 (tabac)
  state/
    SelectionContext.tsx      # état de sélection partagé EN MÉMOIRE (jamais localStorage), Provider
                               # générique par themeId + hook useSelection(), monté dans App.tsx
  content/
    repas-types.ts            # presets « repas-types » partagés (14 repas, moteur de proportions),
                               # consommés par MangerModule (cardio) + AlimentationModule (diabète)
    tabac/                     # contenu partagé consultation + app patient (substituts/situations/outils)
  features/
    types.ts / registry.ts    # ModuleId/FamilleId génériques ; THEMES: ThemeDef[] (tabac/diabete/cardio)
    tabac/
      registry.ts · situations.ts (20 situations partagées, 3 piliers)
      10 modules : addiction · nicotine · substituts · nicotine-toxique · soulagement ·
      boite-a-outils (14 outils, dont outils-interactifs/ — 11 outils rendus interactifs,
      registre `OUTILS_INTERACTIFS`, store consultation en mémoire / store patient localStorage) ·
      motivation · plan-arret (+ livretSections.tsx, alimente le livret) · benefices-arret ·
      idees-recues (21 cartes)
      lib/nicotineCurve.ts       # logique pure (Vitest), partagée modules Nicotine + Soulagement
    diabete/
      registry.ts (10 modules) · components/ (IllustrationSlot, Silhouette, CourbeGlycemie,
      PlaqueArtere, SignatureEvitable) · lib/glycemieCurve.ts (logique pure, Vitest)
      Modules : mecanisme · alimentation (+ data enrichie garde-manger) · activite · risque-cardio ·
      complications · suivi · traitements · hypoglycemie · insuline (basale) · insuline-rapide
    cardio/
      registry.ts (12 modules, 3 familles) · lib/risqueCardio.ts (cumul multiplicatif, 21 invariants)
      components/ (ArtereCoupe, CockpitFeux, Silhouette, IllustrationSlot — cardio-owned)
      Modules : artere · risque · territoires · tension · cholesterol · tabac (pont vers thème Tabac) ·
      bouger · manger (+ garde-manger onglets par catégorie) · leviers · alerte (carte VITE) ·
      traitements · suivi (« mes 3 chiffres »)
docs/
  architecture.md · BRIEF_TABAC.md · contenu-modules-tabac.md (autorité contenu tabac)
  diabete/                   # autorité contenu diabète : 00-global.md (grammaire commune) +
                              # un fichier par module (dont 09/10-insuline validés Thibault) + VALIDATION.md
  cardio/                    # autorité contenu cardio : CONTENU_cardio.md (validé gate G1) +
                              # BRIEF_DESIGN_cardio.md + evidence-cardio/ + VALIDATION.md
  evidence-diabete/ · evidence-tabac/   # rapports OpenEvidence, sources probantes brutes
  decisions/                 # détail des décisions (registre → DECISIONS.md)
plans/                       # un dossier par chantier EN COURS (index.md + S<n>.md) ; le détail
                              # d'un chantier clos est dans STATUS.md/git log, le dossier est purgé
```

---

## Features principales

### Sélection de thème + carte de modules
Rôle : choisir un thème (si plusieurs) puis présenter ses modules, navigation libre non-linéaire.
Fichiers clés : `src/components/{ThemeSelector,Home,ModuleCard}.tsx`, `src/App.tsx`.
Vigilance : lisible à distance, gros éléments cliquables ; `ThemeSelector` masqué si un seul thème.

### Coquille de module générique
Rôle : `App.tsx` rend `ModuleShell` (titre + retour + Sources) autour du module actif ; les
modules ne rendent que leur contenu interactif.
Fichiers clés : `src/components/{ModuleShell,Sources}.tsx`, `src/features/types.ts`.
Vigilance : généricité = clé de la réutilisation multi-thèmes ; aucun module ne duplique son en-tête.

### Fiches à emporter, portes de fin de module, fil rouge, livret (tabac)
Rôle : `FicheOverlay` compose et imprime une feuille A4 (5 fiches, zéro persistance) ;
`ModuleFooterNav` câble des portes optionnelles ; `PrintableLivret` assemble un livret A4
multi-pages depuis `SelectionContext` ; `InfoHover` (2e niveau de lecture) créé mais partiellement
câblé, en attente de validation de contenu.
Fichiers clés : `src/components/{FicheOverlay,ModuleFooterNav,InfoHover,PrintableLivret}.tsx`,
`src/features/tabac/plan-arret/livretSections.tsx`.
Vigilance : composants génériques, agnostiques du thème ; ne jamais câbler `InfoHover` sans
validation Thibault (`docs/BRIEF_TABAC.md` §3.5/§5).

### État de sélection partagé (tabac)
Rôle : les sélections des modules tabac (situations, forme de substitut, outils « dans ma fiche »,
raisons) survivent à la navigation entre modules via un état **en mémoire**.
Fichiers clés : `src/state/SelectionContext.tsx`.
Vigilance : **zéro persistance** (Context React uniquement, se réinitialise au rechargement).

### App d'aide patient autonome
Rôle : 2e surface applicative (bundle Vite séparé, `patient.html`), atteinte par QR, offrant au
patient seul « Mes substituts » et « Agir face à une situation ». Contenu générique via
`src/content/tabac/` (source unique, partagée avec la consultation).
Fichiers clés : `patient.html`, `src/patient/**`, `src/patient/situations/usePatientStore.ts`
(persistance `localStorage`, propre au patient).
Vigilance : le graphe d'import du bundle patient ne doit **jamais** atteindre un module de
consultation (exception assumée : le registre partagé `outils-interactifs/`, cf.
`docs/decisions/`) ; textes en « voix patient », `// à revalider (Thibault)`.

### Thème diabète
Rôle : 2e thème, 10 modules opérationnels. Contenu clinique dans `docs/diabete/` (fichier par
module + `00-global.md`).
Fichiers clés : `src/features/diabete/**`, `docs/diabete/`.
Vigilance : modules 5-8 pas encore spécifiés en détail — ne pas coder avant cadrage clinique complet.

### Thème cardio (« Prévention cardiovasculaire »)
Rôle : 3e thème, prévention primaire uniquement (secondaire hors v1). 12 modules, 3 familles
(Comprendre/Agir/Se soigner). Contenu clinique validé (gate G1, Thibault) avant tout câblage — 6
arbitrages structurants (jamais de LDL/tension chiffrés, aspirine jamais mentionnée, alcool/sel
qualitatifs sourcés SPF).
Fichiers clés : `src/features/cardio/**`, `docs/cardio/`.
Vigilance : modules 4-12 restent à valider à l'écran (pilote 1-3 validé) ; porte inter-thèmes réelle
et généralisation des composants cardio jugées hors v1.

---

## Fichiers transversaux importants

- Configuration : `vite.config.ts`, `tsconfig*.json`, `package.json` (scripts dev/build/test).
- Navigation : état local dans `src/App.tsx` (pas de router).
- État global : **éphémère uniquement** — `src/state/SelectionContext.tsx` (tabac, mémoire de
  session) ; côté patient, `usePatientStore()` sur `localStorage` (propre à l'appareil du patient).
- API / persistance : aucune côté consultation (décision structurante).
- UI partagée : `src/components/`.
- Logique pure testée : `nicotineCurve.ts` (tabac), `glycemieCurve.ts` (diabète), `risqueCardio.ts`
  (cardio) — chacune spécifique à son thème, pas un utilitaire du moteur générique.

---

## Zones à risque ou coûteuses en contexte IA

- Le moteur de module générique (impacte tous les modules et tous les thèmes) — à concevoir
  proprement une fois, rarement retouché.

---

## Règles locales importantes

- **Jamais de persistance côté consultation** (ni localStorage, ni cookies, ni réseau).
- Contenu médical **sourcé** (HAS, Tabac Info Service et équivalents), affichable dans le module.
- Garder l'interactivité (≠ diaporama) et la sobriété visuelle.
- Préserver la généricité multi-thèmes (rien en dur pour un thème dans `src/components/`,
  `src/features/types.ts`, `src/features/registry.ts`).
