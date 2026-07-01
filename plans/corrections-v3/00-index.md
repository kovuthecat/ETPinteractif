# PLAN corrections-v3 — Index   (rédigé par Opus)

> Lot issu des captures Thibault du 2026-07-01 (`corrections/`). Affine des choix du lot
> v2 (R4/R5/R7). **Un fichier `.md` par correctif** pour minimiser le contexte lu :
> chaque exécutant ne lit QUE son fichier + les fichiers listés dans sa section « Lire ».

- **Date :** 2026-07-01 · **Rédigé par :** Opus · **Branche :** — (repo local, main)
- **Décisions validées par Thibault** (AskUserQuestion, 2026-07-01) : voir §Décisions.

## Convention de validation (toutes tâches)
- **Auto** = gate du commit (exécutant) : `tsc -b` + `vite build` + `vitest run` quand la
  tâche touche `src/lib/`. `npm`/`node` absents du PATH dans cet env — utiliser
  `node_modules/.bin` via `/c/Program Files/nodejs/node.exe` (cf. STATUS.md) avant de
  déclarer l'auto-validation indisponible.
- **Visuel** = responsabilité de Thibault, non bloquant : l'exécutant NE vérifie PAS le
  rendu (pas de navigateur/capture). Il reporte 1 ligne dans `VALIDATION.md` (quoi
  regarder / attendu) et continue.

## Invariants (rappel CLAUDE.md)
Zéro persistance · local-first · aucune dépendance runtime ajoutée · exactitude médicale
sourcée · sobriété + lisibilité à ~1 m · généricité multi-thèmes (rien de « tabac » dans le moteur).

## Décisions validées (Thibault)
1. **Nicotine + Soulagement** : modèle **cumul sur axe fixe**. Plus de balayage
   oscilloscope, plus de curseur bleu glissant, plus de courbe « fantôme » grisée. Chaque
   clic dépose une prise sur une frise statique ; la courbe cumulée s'affiche entièrement.
2. **Amplitudes nicotine** : **1 cigarette → pic au milieu de la zone de confort** ;
   **plusieurs cigarettes enchaînées → cumul jusqu'au surdosage** (zone haute) ;
   **patch (plateau) + cigarettes → surdosage** également. La coloration par zone est conservée.
3. **Nicotine-toxique / « Mélange chimique »** : **reformuler avec une conséquence**
   (texte sourcé proposé dans V6, à valider Thibault).
4. **Motivation / tableau** : cartes en **réserve** hors tableau ; on glisse les
   pertinentes dans le tableau ; retirer une carte la renvoie au bac (rien n'est perdu).

## Correctifs
| ID | Module | Objet | Fichier |
|----|--------|-------|---------|
| V1 | addiction | Agrandir le diagramme de Venn (lisibilité) | `V1-addiction-agrandir.md` |
| V2 | addiction | Items « De quoi parle-t-on » en menu radial autour du cercle | `V2-addiction-radial.md` |
| V3 | nicotine | Cumul sur axe fixe (supprime balayage/curseur), amplitudes retunées | `V3-nicotine-cumul.md` |
| V4 | soulagement | Même modèle : clic → chute/remontée figée, plus de curseur | `V4-soulagement-clic.md` |
| V5 | craving | Les 4 D masquent progressivement le pic (opacité, lisible) | `V5-craving-masque-pic.md` |
| V6 | nicotine-toxique | « Mélange chimique » reformulé avec conséquence | `V6-toxique-melange.md` |
| V7 | motivation | Scinder en 2 onglets (Où en êtes-vous / Mes raisons) | `V7-motivation-onglets.md` |
| V8 | motivation | Tableau plus grand + cartes en réserve à glisser dedans | `V8-motivation-reserve.md` |

## Dépendances & ordre recommandé
- **V6** (isolé, contenu) → **V1 → V2** (même composant Addiction, V2 après V1) →
  **V5** (Craving) → **V7 → V8** (même composant Motivation, V8 après V7) →
  **V3 → V4** (partagent `src/lib/nicotineCurve.ts` ; faire V3 en premier, il modifie la lib et les tests).
- V3 touche `nicotineCurve.ts` (partagé + testé) : **mettre à jour les tests Vitest** dans le même commit.

## Suivi
Ajouter le bloc « Corrections v3 » dans `TASKS.md` ; mettre à jour `STATUS.md` en fin de lot.
