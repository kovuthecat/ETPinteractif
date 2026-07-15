# CLAUDE.md

Instructions permanentes pour Claude Code. Seul fichier chargé automatiquement :
il pointe vers le reste, sans le recopier.

## Commandes

```bash
# Dev / serveur local
npm run dev

# Build (inclut le typecheck via tsc -b)
npm run build

# Preview du build
npm run preview

# Tests (toute la suite, Vitest)
npm test

# Test unitaire ciblé
npx vitest run src/lib/nicotineCurve.test.ts

# Typecheck seul (sans build complet)
npx tsc --noEmit
```

- Pas de script `lint` dédié dans ce projet.
- Variables d'environnement : aucune (application 100% statique, sans backend).
- Ne jamais committer de secret (`.env`, clés, tokens) — non applicable ici en l'état (aucun `.env`).

@C:\Users\kovu\SynologyDrive\Thibault\Projets\Templates\CLAUDE-BASE.md

## Règles spécifiques au projet

### À lire avant une tâche importante

- `PROJECT_BRIEF.md` (objectif, périmètre, contraintes) · `DECISIONS.md` (décisions structurantes)
- `PROJECT_MAP.md` (localisation des modules) · contenu médical par thème, autorité du contenu : `docs/contenu-modules-tabac.md` (thème tabac, fichier unique) · `docs/diabete/` (thème diabète, un fichier par module + `00-global.md` pour la grammaire commune — évite un fichier unique démesuré)

### Invariants non négociables

1. **Persistance scopée par contexte** (amendé — chantier `revue-chrome-2026-07`) :
   - **Consultation** (bundle `consultation`) : **zéro donnée patient stockée** — aucune persistance (localStorage, cookies, base, réseau). Interaction éphémère. *La dose de titration mémorisée pour le livret vit en mémoire de session (`SelectionContext`), jamais sur disque.*
   - **App patient** (bundle `patient`) : **persistance locale autorisée** — localStorage sur l'appareil du patient, pour ses données personnelles (titration, carnet de suivi). C'est son outil. **Jamais de réseau ; rien ne quitte l'appareil.** Prévoir un effacement et le repli si le stockage est indisponible.
2. **Local-first / hors-ligne** : pas de dépendance réseau au runtime (vaut pour les deux bundles).
3. **Pile runtime figée** : Vite + React + TypeScript, sans backend, **aucune dépendance runtime ajoutée**. *Exception* : devDependencies d'outillage/test (ex. Vitest) si listées dans le plan.
4. **Multi-thèmes par conception** : le moteur générique (`src/components/`, `src/features/types.ts`, `src/features/registry.ts`) ne connaît aucun thème par son nom ; tout contenu spécifique (tabac, diabète…) vit sous `src/features/<theme>/`.
5. **Exactitude médicale** : contenu sourcé (HAS, Tabac Info Service). En cas de doute clinique, signaler plutôt qu'inventer.
6. **Support de consultation** : sobriété, gros éléments lisibles à ~1 m, interactivité (≠ diaporama).
