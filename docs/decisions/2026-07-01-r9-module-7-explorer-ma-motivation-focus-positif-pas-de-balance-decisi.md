# 2026-07-01 — R9 : module 7 « Explorer ma motivation », focus positif (pas de balance décisionnelle)

### Décision

Ajout d'un 7ᵉ module, **sans balance décisionnelle** (avantages/inconvénients du tabac), au profit de deux
outils centrés sur le positif : (A) échelles 0–10 importance/confiance avec relance non culpabilisante
(« pourquoi pas *n − 1* ? » / « qu'est-ce qui aiderait à passer à *n + 1* ? ») ; (C) un tableau blanc « Mes
raisons » (cartes déplaçables, éditables, création libre). Le drag & drop est implémenté avec des **pointer
events natifs** sur un `<button>` poignée (pas de librairie) : la même poignée gère aussi le déplacement au
**clavier** (flèches directionnelles), ce qui couvre l'accessibilité clavier sans bouton de secours séparé.
Les positions des cartes sont stockées en **pourcentages relatifs** du conteneur (pas en pixels), pour rester
stables au redimensionnement/tablette sans recalcul.

### Contexte

Arbitrage de Thibault (2026-07-01, `PLAN_corrections-v2.md` R9) : la balance décisionnelle classique était
jugée limitante pour ce public. `App.tsx` étant déjà générique (rendu par `MODULES.find`), aucune modification
n'a été nécessaire dans le moteur — seuls `types.ts` et `registry.ts` ont été touchés, conformément à
l'invariant 4 (rien de spécifique au tabac dans le moteur générique).

### Alternatives envisagées

- Positions en pixels absolus recalculées au resize → écarté : plus de code, plus fragile, alors que les
  pourcentages résolvent nativement le problème.
- Boutons de déplacement séparés (↑↓←→) en plus du drag → écarté : la poignée `<button>` gère déjà les deux
  modes (pointer + clavier) sur le même élément, un doublon aurait été une complexité inutile pour rien de
  plus accessible.

### Raison du choix

Minimise la surface de code, respecte l'invariant « zéro dépendance runtime ajoutée » et l'invariant
accessibilité (cibles ≥ 44 px via la règle globale `button`, clavier fonctionnel).

### Conséquences

- Contenu de départ du module (libellés des 2 échelles, 6 cartes seed) = **proposition non sourcée** de
  Claude, marquée comme telle dans `docs/contenu-modules.md` §Module 7 et dans `VALIDATION.md` §R9 — à
  valider/ajuster par Thibault, sans bloquer le reste du module.

### Impact IA

- Si Thibault change la liste de cartes seed ou les libellés d'échelle, modifier uniquement les constantes
  `SEED_CARTES` / les chaînes de labels dans `MotivationModule.tsx` — aucune reconception de la mécanique de
  drag ou des échelles n'est nécessaire.

