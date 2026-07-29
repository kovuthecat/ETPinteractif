# 2026-06-28 — Données cliniques + choix techniques d'implémentation

### Décision

- **Titration patch** : on illustre la **méthode**, pas de calcul de dose. ¼ de patch (sécables) tous les 2-3 jours
  tant que l'envie persiste sans surdosage ; pas de dose max (borne = ressenti) ; retour à la dose précédente si
  surdosage (nausées, écœurement, céphalées, palpitations, rêves intenses) ; nuance jour/nuit ; visée d'autonomisation.
- **Vapoteuse** : outil d'aide à l'arrêt à part entière ; dosage qualitatif.
- **Craving** : 4 D (Différer, Distraire, Décontracter, De l'eau) + Tabac Info Service 39 89 ; minuteur « vague ».
- **Sources** : affichage discret (icône → pop-over).
- **Pile technique** : Vite + React + TS ; **CSS Modules** ; **pas de router** (navigation par état) ;
  **pas de lib de graphes** (SVG pur) ; seule dépendance UI ajoutée : `lucide-react` (icônes).

### Contexte

Données fournies par Thibault. Rédaction du plan d'exécution `PLAN_modules-tabac.md` (T1–T11) pour Sonnet/Codex/Haiku.

### Alternatives envisagées

- React Router → écarté (kiosque sans URL, hors-ligne, zéro besoin).
- Lib de graphes (recharts…) → écarté (courbes simples en SVG, garder les dépendances minimales).
- Calculateur de dose → écarté (choix clinique : illustrer la méthode, autonomiser).

### Raison du choix

Simplicité, légèreté, hors-ligne, et fidélité à l'intention pédagogique (méthode > calcul).

### Conséquences

- Un utilitaire de courbe partagé (`src/lib/nicotineCurve.ts`) sert aux Modules 2 et 5.
- Le contrat « App rend ModuleShell, les modules ne rendent que leur contenu » fixe la navigation/sources.
- Contenu non bloquant restant : sources exactes + détail des formes de substituts.

### Impact IA

- Plan découpé en tâches atomiques taguées par modèle → faible coût d'exécution.
- Constantes/signatures figées dans le plan → pas de reconception par les exécutants.

