# Plan — Corrections audit Chrome (Tabac + 2 retours Diabète, 2026-07-13)   (rédigé par Opus)

> **Origine** : audit navigateur de Thibault (Claude in Chrome, 2026-07-13) sur `etp-interactif.vercel.app`,
> reconstruit et corrigé dans [`rapport-bugs-etp-tabac.md`](../../rapport-bugs-etp-tabac.md) (16 points T1–T16,
> sélecteurs → fichiers vérifiés) et [`rapport-bugs-etp-diabete.md`](../../rapport-bugs-etp-diabete.md). Passe
> **par-dessus** tout ce qui est déjà déployé (`HEAD = origin/main`, dernier commit `9a6806d` du 2026-07-12) —
> l'audit reflète donc l'état post-`audit-diabete`/post-illustrations-tabac.
> **Autorités** : ce fichier · les 2 rapports · `PROJECT_BRIEF.md` · `DECISIONS.md` · `CLAUDE.md` (invariants) ·
> `docs/contenu-modules-tabac.md` (contenu clinique tabac).
> **Exécutant** : **Sonnet** par défaut ; **Opus** conseillé pour S10 (persistance) et S11 (livret). Un lot = une session.
> **Règle de validation** : **jamais** de navigateur/Playwright côté Claude. Chaque session =
> `npx tsc --noEmit` + `npm run build` + `npm test` verts + checklist **visuelle** consignée dans son propre
> `S<n>.md` + `VALIDATION.md` (validée par Thibault à l'écran, `npm run dev`). Cf. `[[feedback_validation_visuelle]]`.

## Objectif d'ensemble

Traiter les 16 points de l'audit tabac. Quatre natures de travail : **bugs** (T6/T7), **retouches UI/tailles/
icônes** (T1–T5, T8–T13, T15), **socle d'état partagé en mémoire** (T11) qui débloque le **livret** (T14), et
une **nouvelle app patient** autonome (T16, chantier séparé recommandé). Les 2 retours diabète triviaux (ordre
Hypoglycémie, renommage « Insuline basale ») sont **déjà appliqués** (AT-D1, hors vagues).

## Décisions de Thibault (tranchées avant rédaction)

1. **Persistance = EN MÉMOIRE, jamais `localStorage`.** Le rapport navigateur (#T11) proposait `localStorage` :
   proscrit (invariant « zéro persistance »). Solution actée : **React Context monté dans `App.tsx`** au-dessus
   du switcher de vues — survit à la navigation inter-modules, se réinitialise au rechargement (éphémère). Socle
   de S10, dont dépend le livret S11.
2. **Marqueur « A » = injection d'insuline** (confirmé Thibault), « R » = repas. → S7 : R → `Utensils`, **A → `Syringe`** (plus d'ambiguïté).
3. **Module patient (S16/T16)** : **sous-domaine séparé** (l'app patient n'est PAS une route de l'app de
   consultation — la route est retirée de l'URL pour que le patient n'accède jamais seul à l'outil soignant) ;
   contenu **générique** (jamais les choix d'un patient) ; **v1 = « Mes substituts » + « Agir face à une
   situation » (situation → outils)** uniquement. → chantier séparé (voir S12).
4. **Ordre des familles tabac** = **Se motiver → Comprendre → Agir** (confirmé). → S9.

## État git / déploiement (2026-07-13, vérifié)

`HEAD = origin/main` (fetch fait), **0 commit non pushé**. Déployé = code committé actuel. Les correctifs
`audit-diabete` (dont `d2d72dc`, illustrations des signes d'hypo = rapport Diabète #4) **sont déployés**. Non
committé (working tree) : le « ménage du dépôt 2026-07-13 » + ce plan + `registry.ts` (AT-D1, pas encore déployé).

## Mapping rapport → sessions

| Point(s) | Écran / zone | Session |
| --- | --- | --- |
| T6, T7 | Substituts : titration conditionnelle + illustration vapoteuse | **S1** |
| T4, T5 | Vrai ou faux : grille + a11y + taille illustration | **S2** |
| T8, T10, T9 | Boîte à outils : checkbox + tailles + overlay 4D | **S3** |
| T1 | Composantes : cercle Comportementale + légende | **S4** |
| T2 | Nicotine : agrandir + moderniser la courbe | **S5** |
| T12 | Ce que l'arrêt répare : illustrations d'organes en vue frise | **S6** |
| T3 | Marqueurs R/A → icônes Lucide (CourbeGlycemie) | **S7** |
| T13 | Cartes-raisons : icônes Lucide + retrait placeholders | **S8** |
| T15 | Accueil tabac : ordre des familles | **S9** |
| T11 | État de sélection partagé (Context en mémoire) | **S10** |
| T14 | Livret d'accompagnement + double impression | **S11** |
| T16 | Module patient autonome (QR, sous-domaine) | **S12** |
| — | Consolidation (contexte + commits) | **S13** |

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée (« Modifier ») | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T6,T7 | Substituts : titration conditionnelle + vapoteuse responsive | Sonnet | high | — | `tabac/substituts/SubstitutsModule.tsx` (+`.module.css`) | [ ] |
| [S2](S2.md) | T4,T5 | Vrai/faux : grille + a11y + taille illustration | Sonnet | high | — | `tabac/idees-recues/IdeesRecuesModule.tsx` (+`.module.css`, `data.ts`) | [ ] |
| [S3](S3.md) | T8,T10,T9 | Boîte à outils : checkbox + tailles + overlay 4D | Sonnet | high | — | `tabac/boite-a-outils/BoiteAOutilsModule.tsx`, `VagueCraving.tsx` (+`.module.css`) | [ ] |
| [S4](S4.md) | T1 | Composantes : anti-débordement + retrait légende | Sonnet | medium | — | `tabac/addiction/AddictionModule.tsx` (+`.module.css`) | [ ] |
| [S5](S5.md) | T2 | Nicotine : agrandir + moderniser la box | Sonnet | high | — | `tabac/nicotine/NicotineModule.tsx` (+`.module.css`) | [ ] |
| [S6](S6.md) | T12 | Ce que l'arrêt répare : illustrations en vue frise | Sonnet | medium | — | `tabac/benefices-arret/BeneficesArretModule.tsx` (+`.module.css`) | [ ] |
| [S7](S7.md) | T3 | Marqueurs R/A → icônes Lucide | Sonnet | low | — | `diabete/components/CourbeGlycemie.tsx` (+`.module.css`) | [ ] |
| [S8](S8.md) | T13 | Cartes-raisons : icônes + retrait placeholders | Sonnet | low | — | `tabac/motivation/MotivationModule.tsx` (+`.module.css`) | [ ] |
| [S9](S9.md) | T15 | Accueil tabac : ordre des familles | Sonnet | minimal | — | `features/registry.ts` | [ ] |
| [S10](S10.md) | T11 | État de sélection partagé (Context en mémoire) | Opus | xhigh | après V1 | `App.tsx` + `SelectionContext` + câblage modules | [ ] |
| [S11](S11.md) | T14 | Livret d'accompagnement + double impression | Opus | xhigh | S10 | `tabac/plan-arret/`, `components/FicheOverlay.tsx`, `PrintableLivret` | [ ] |
| [S12](S12.md) | T16 | Module patient autonome (QR, sous-domaine) | Sonnet | xhigh | cadrage ✓ | nouveau — `src/content/` + entrée patient | [ ] |
| [S13](S13.md) | — | Consolidation contexte + commits | Haiku | low | tout | STATUS/TASKS/VALIDATION/DECISIONS/PROJECT_MAP | [ ] |

## Ordonnancement

- **Vague 1 — parallélisable (9 agents, zones disjointes)** : **S1 · S2 · S3 · S4 · S5 · S6 · S7 · S8 · S9**.
  Chaque session touche un dossier/fichier distinct → aucune collision. Quick-wins, bugs, UI — livrables un par un.
- **Vague 2 — solo** : **S10**. Après **merge de la V1**, car le câblage de l'état re-touche des modules de la V1
  (addiction/substituts/boîte-à-outils/motivation/plan-arrêt) + `App.tsx`.
- **Vague 3 — solo** : **S11** (livret). **Dépend de S10.**
- **Vague 4 — consolidation** : **S13** (commits tâche par tâche, contexte, push).
- **Hors vagues** : **S12** — cadré, mais **chantier séparé recommandé** (nouvelle surface applicative, sous-domaine).

```
V1: S1 S2 S3 S4 S5 S6 S7 S8 S9   (parallèle)
V2: S10                          (solo, après merge V1)   → bloque S11
V3: S11                          (solo, dépend S10)
V4: S13                          (consolidation)
hors: S12                        (cadré → chantier séparé)
```

## Gates humaines (bloquantes)

- **Après chaque session** : validation visuelle Thibault (`npm run dev`, checklist dans le `S<n>.md` + `VALIDATION.md`).
  Les px/tailles donnés sont des **points de départ à caler à l'œil**.
- **Avant S11** : S10 mergée et validée (le livret lit l'état centralisé).
- **Avant S12** : décider la dépendance runtime `qrcode` (sinon QR générés hors-app) — cf. invariant 3.

## Garde-fous (toutes sessions)

- **Zéro persistance** (S10 = Context mémoire, jamais localStorage/cookies/réseau). **Zéro dépendance runtime
  ajoutée** — `lucide-react` déjà présent (S7/S8/S3/S13 OK) ; `qrcode` (S12) à trancher.
- **Moteur thème-agnostique** (`src/components/`, `types.ts`, `registry.ts`) : ne jamais coder un thème en dur.
  S9 ne touche QUE l'ordre des familles **du thème tabac** ; S7 touche un composant partagé diabète.
- **Ne pas modifier la classe de base `IllustrationSlot`** (partagée) : jouer sur la prop `size` contextuelle (S2, S3, S6).
- **Contenu médical** ajouté/refondu → `// à revalider (Thibault)`. Cibles interactives ≥ 44 px.
- **Validation visuelle = humaine.** Ne jamais prétendre avoir vu le rendu.

## À réconcilier — reste du rapport Diabète (#1–#6)

Déployé = HEAD (confirmé) → #1–#6 reflètent le code actuel. Avant d'en faire des sessions, revérifier chacun
contre le code : **#4** (illustrations hypo) **déjà corrigé et déployé** (`d2d72dc`) — probable résidu du
panneau `@media print` ; **#1** (icônes de thème) et **#3** (proportions drag + camembert + icônes) sont des
candidats sûrs ; **#2** (mise en avant des conséquences cardio) à confirmer. Non planifiés ici volontairement.
