# 2026-07-01 — R5 : soulagement en bac à sable temps réel (fin de la bascule d'onglets)

### Décision

Le module Soulagement (`SoulagementModule.tsx`) abandonne la bascule d'onglets « Non-fumeur / Fumeur » au
profit d'un **bac à sable temps réel calqué sur R4** : un balayage continu (façon oscilloscope) tourne dès
l'ouverture ; cliquer « Fumer une cigarette » insère la prise au temps courant et le stress chute
immédiatement, synchronisé au pic de nicotine, puis remonte. Le non-fumeur n'est plus un écran séparé mais un
**repère superposé sur la même courbe** via un bouton unique « Comparer au non-fumeur ».

### Contexte

Arbitrage de Thibault (2026-07-01, `PLAN_corrections-v2.md` R5) : la bascule d'onglets était jugée moins
pédagogique qu'un modèle temps réel montrant, sur un seul graphe, que le creux du fumeur reste toujours
au-dessus du niveau stable du non-fumeur.

### Alternatives envisagées

- Garder deux courbes indépendantes (fumeur vs non-fumeur) calculées séparément → écarté : `sampleStress()`
  dérive déjà les deux du même modèle (`STRESS_BASAL_*`), pas besoin de dupliquer la logique.
- Positionner dynamiquement le repère non-fumeur au ras du creux observé (calcul par render) → écarté : le
  repère est une **constante** (`STRESS_BASAL_NON_FUMEUR`), et l'invariant « toujours sous le creux fumeur »
  est déjà garanti *par construction* (le plancher structurel du stress fumeur = `STRESS_BASAL_FUMEUR`, même
  si la nicotine sature à 1), donc un calcul dynamique aurait été une complexité inutile.

### Raison du choix

Cohérence avec R4 (même mécanique de balayage, même vocabulaire visuel) et invariant pédagogique garanti sans
calcul additionnel : `STRESS_BASAL_FUMEUR (0.30) > STRESS_BASAL_NON_FUMEUR (0.25)` est vérifié pour toute
composition d'événements, y compris la saturation multi-cigarettes (couvert par 2 nouveaux tests Vitest dans
`nicotineCurve.test.ts`, 17 tests au total).

### Conséquences

- `nicotineCurve.ts` n'a **pas changé de formule** : seule sa consommation change (événements accumulés en
  continu au lieu d'une liste fixe de 5 cigarettes pour la démo statique).
- Les amplitudes (0.25 / 0.30 / 0.35, cf. décision C4 ci-dessus) restent des valeurs illustratives **non
  re-validées** dans ce nouveau contexte interactif — question toujours ouverte dans `VALIDATION.md` §R5.

### Impact IA

- Si Thibault ajuste les amplitudes, modifier uniquement les constantes `STRESS_*` dans `nicotineCurve.ts` ;
  aucun changement requis dans `SoulagementModule.tsx` (qui ne fait que consommer `sampleStress`).
- Une évolution médicale modifie le contenu, pas la structure de la scène.

