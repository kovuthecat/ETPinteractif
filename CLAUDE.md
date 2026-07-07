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
- `PROJECT_MAP.md` (localisation des modules) · `docs/contenu-modules.md` (contenu médical, autorité du contenu)

### Invariants non négociables

1. **Zéro donnée patient stockée** : aucune persistance (localStorage, cookies, base, réseau). Interaction éphémère.
2. **Local-first / hors-ligne** : pas de dépendance réseau au runtime.
3. **Pile runtime figée** : Vite + React + TypeScript, sans backend, **aucune dépendance runtime ajoutée**. *Exception* : devDependencies d'outillage/test (ex. Vitest) si listées dans le plan.
4. **Multi-thèmes par conception** : ne pas coder « en dur » pour le tabac dans le moteur de module générique.
5. **Exactitude médicale** : contenu sourcé (HAS, Tabac Info Service). En cas de doute clinique, signaler plutôt qu'inventer.
6. **Support de consultation** : sobriété, gros éléments lisibles à ~1 m, interactivité (≠ diaporama).
