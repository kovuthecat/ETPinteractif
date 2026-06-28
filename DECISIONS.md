# DECISIONS.md

Journal des décisions techniques et produit.

## Format recommandé

```md
## YYYY-MM-DD — Titre de la décision

### Décision
### Contexte
### Alternatives envisagées
### Raison du choix
### Conséquences
### Impact IA
```

---

## Décisions

## 2026-06-28 — Cadrage initial du projet ETP interactif (thème : sevrage tabagique)

### Décision

Créer une application web interactive d'éducation thérapeutique, multi-thèmes par conception,
dont le premier contenu est le **sevrage tabagique**. Quatre choix structurants ont été arrêtés :

1. **Contexte d'usage** : en consultation, soignant + patient sur un écran/tablette partagé.
2. **Navigation** : choix libre par centres d'intérêt (carte de modules non-linéaire), pas de questionnaire de profilage imposé.
3. **Données** : aucune persistance — toute interaction est éphémère.
4. **Stack** : Vite + React + TypeScript, local-first, sans backend.

### Contexte

Outil professionnel pour un soignant. Besoin d'un support visuel et interactif (pas un diaporama),
utilisable au cabinet, sur un poste potentiellement partagé.

### Alternatives envisagées

- Navigation : profilage Fagerström + Prochaska auto-adaptatif → écarté (rigidifie, alourdit ; le soignant
  pilote déjà l'entretien). Fagerström/Prochaska pourront exister comme **modules** visuels parmi d'autres.
- Données : sauvegarde locale (localStorage) ou fiche récap → écarté en v1 pour sécurité RGPD maximale
  sur poste partagé. Une **fiche imprimable éphémère** (générée puis non stockée) reste envisageable plus tard.
- Stack : Next.js → écarté (SSR/serveur superflu ici, plus lourd à maintenir).

### Raison du choix

Maximiser simplicité, sécurité des données patient et alignement avec les autres projets de Thibault
(même stack que recettes / FermentLab / cosme-diy).

### Conséquences

- Aucun backend, aucune base : déploiement statique trivial, hors-ligne possible.
- L'architecture doit prévoir un **moteur de modules générique** réutilisable pour de futurs thèmes.
- Le contenu médical devra être sourcé (HAS, Tabac Info Service).

### Impact IA

- Complexité : faible. Coût de maintenance IA : faible (modules isolés).
- Contexte nécessaire : faible si l'organisation feature-first par module est respectée.
- `PROJECT_MAP.md` : à créer/maintenir dès le scaffolding du code.
