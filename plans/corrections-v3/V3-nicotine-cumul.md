# V3 — Nicotine : cumul sur axe fixe (supprime balayage/curseur) · Modèle : Sonnet, effort : high

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Touche `src/lib/nicotineCurve.ts` (partagé avec Soulagement) + ses tests.** Faire AVANT V4.

- **Capture :** `corrections/Ne convient pas. Je ne veut pas de la ligne bleue qui avance ni des courbes grisées. ...PNG`
- **Décisions Thibault :** cumul sur axe fixe ; 1 cigarette → pic milieu zone confort ;
  plusieurs cigarettes enchaînées → surdosage ; patch + cigarettes → surdosage.

## But
Supprimer le balayage temporel automatique (oscilloscope), le **curseur bleu** et la
**courbe grisée « fantôme »** (`courbeDiscrete`). Chaque clic sur un geste **dépose une prise
sur une frise temporelle statique** ; la courbe **cumulée** s'affiche entièrement, colorée par
zone. Retuner les amplitudes pour le comportement de cumul ci-dessus.

## Lire
- `src/features/nicotine/NicotineModule.tsx`
- `src/features/nicotine/NicotineModule.module.css`
- `src/lib/nicotineCurve.ts` + `src/lib/nicotineCurve.test.ts`

## Modifier
- `src/features/nicotine/NicotineModule.tsx`
- `src/features/nicotine/NicotineModule.module.css`
- `src/lib/nicotineCurve.ts` (amplitude/largeur des noyaux, sans changer la signature)
- `src/lib/nicotineCurve.test.ts` (nouveaux/ajustés cas)

## Hors périmètre
- Ne PAS ajouter de dépendance. Ne PAS toucher Soulagement (V4). Garder les 4 gestes.

## Conception (fixée)
- **Suppressions** : état `now`/`playing`/`speedIndex`/`resetTick`, la boucle `requestAnimationFrame`,
  le `<line className=cursor>`, le `path courbeDiscrete`, les boutons Pause/Vitesse. `Réinitialiser`
  vide simplement les événements.
- **Placement des prises** : chaque clic ajoute un événement au **temps suivant** sur la frise
  (réutiliser la logique `nextEventTime` : `FIRST_EVENT_T + n*EVENT_STEP`, borné `MAX_EVENT_T`).
  `EVENT_STEP` **réduit** pour que des prises successives se chevauchent et cumulent (viser ~0.05).
- **Rendu** : dessiner la courbe **complète** (tous les points, pas seulement « écoulés »),
  segmentée et colorée par zone (`buildZoneSegments` sur `ys` entier), avec l'aire dégradée.
  Le chip « État actuel » reflète la **zone du point le plus haut atteint** (ou du dernier pic).
- **Amplitudes (retune `nicotineCurve.ts`)** — cibles (valeurs relatives 0–1, seuils
  `LOW=0.25`, `HIGH=0.80`) :
  - **1 cigarette** seule : pic dans la zone confort, ~**0.50** (milieu de [0.25, 0.80]).
    → abaisser `cigaretteKernel` (actuel 0.90) vers ~0.50 d'amplitude.
  - **≥3 cigarettes** rapprochées (au pas `EVENT_STEP`) : la **somme** dépasse `HIGH` (surdosage).
    → régler amplitude + largeur de décroissance pour que 3 prises cumulent > 0.80.
  - **patch + 2 cigarettes** : `patchKernel` (plateau ~0.45) + cigarettes → somme > 0.80.
  - Ne pas casser `ponctuel`/`vapoteuse`/`patch` (rester des formes plausibles et distinctes).
- **prefers-reduced-motion** : plus pertinent puisqu'il n'y a plus d'animation continue — le
  rendu est déjà statique. Retirer le hook `useReducedMotion` si devenu inutile.

## Étapes
1. `nicotineCurve.ts` : ajuster `cigaretteKernel` (amplitude ~0.50, largeur telle que le cumul
   fonctionne) ; vérifier `patchKernel`/`ponctuelKernel`/`vapoteuseKernel` cohérents.
2. `nicotineCurve.test.ts` : ajouter des tests d'invariants (voir §Validation auto).
3. `NicotineModule.tsx` : retirer boucle rAF, curseur, courbe fantôme, contrôles Pause/Vitesse ;
   `addEvent` place la prise via `nextEventTime` ; rendre la courbe complète colorée par zone ;
   `reset` vide les événements.
4. `NicotineModule.module.css` : retirer les styles `cursor`/`courbeDiscrete` devenus inutiles ;
   ajuster la mise en page des contrôles restants (gestes + Réinitialiser + chip).
5. Garder la mention « Schéma illustratif » et la légende (Pic / Chute / Bon usage).

## Validation
- **auto :** `tsc -b` + `vite build` + `vitest run` verts. Tests à garantir dans
  `nicotineCurve.test.ts` :
  - `sampleCurve` avec **1 cigarette** : `max(ys)` ∈ [0.40, 0.65] (zone confort).
  - **3 cigarettes** au pas `EVENT_STEP` : `max(ys) > 0.80` (zone haute / surdosage).
  - **patch + 2 cigarettes** rapprochées : `max(ys) > 0.80`.
  - `classifyZone` inchangée (seuils constants).
- **visuel (→ VALIDATION.md) :** aucun curseur bleu ni défilement ; 1 cigarette = une bosse
  qui monte au milieu du vert puis redescend et se fige ; enchaîner des cigarettes fait grimper
  la courbe dans la zone rouge du haut ; patch + cigarettes idem ; couleurs de zone correctes.

## Si bloqué
Si le triple objectif (1=confort, 3=surdosage, patch+2=surdosage) est impossible à concilier
avec les mêmes constantes → privilégier l'exactitude du message (1 cigarette en confort +
cumul visible vers le haut) et **signaler l'arbitrage** dans VALIDATION.md. Ne pas inventer de
seuils cliniques. Doute majeur → STOP.

## Commit
`fix(nicotine): cumul sur axe fixe, suppression du balayage/curseur, retune amplitudes (V3)`

## Statut
[x] fait
