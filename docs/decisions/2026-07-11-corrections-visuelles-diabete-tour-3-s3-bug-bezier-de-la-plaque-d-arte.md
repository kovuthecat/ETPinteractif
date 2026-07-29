# 2026-07-11 — Corrections visuelles diabète, tour 3 — S3 : bug Bézier de la plaque d'artère identifié et corrigé

**Contexte** — L'audit Chrome pointait que la plaque d'athérome (module Risque cardio, vue
« L'artère ») ne réduisait jamais visiblement la lumière du vaisseau, même au score maximal, bien
que le texte annonce correctement « Passage du sang : 30 % ». Le tour 2 avait corrigé la
**symétrie** des deux dépôts (`oppositeDepthFactor`) sans jamais identifier la cause réelle.

**Cause** — `crescentPath(edgeY, peakY)` (`PlaqueArtere.tsx`) construisait une Bézier
quadratique `Q P0(0,edgeY) P1(50,peakY) P2(100,edgeY)` en passant l'apex **voulu** comme point de
**contrôle**. Pour une quadratique, le point réel au milieu (t=0.5) vaut `(edgeY + ctrl) / 2` —
la profondeur réelle du dépôt n'atteignait donc que la **moitié** de la valeur visée. À
`e = 1` (`wallDepth = 35`), l'apex réel n'était qu'à 17,5 au lieu de 35, laissant les deux
croissants collés aux parois quel que soit le score.

**Correctif** — `crescentPath` calcule maintenant le point de contrôle qui produit l'apex
demandé (`ctrl = 2*apexY - edgeY`) au lieu d'utiliser l'apex directement comme point de
contrôle. Les appels restent sémantiquement inchangés (`crescentPath(0, wallDepth)` etc.) :
c'est la fonction, pas ses appelants, qui était fausse. `plaquePassagePct` (source de vérité du
texte) n'est pas touchée — la géométrie est désormais alignée sur elle.

**Impact IA** — Ce bug n'était détectable que par lecture attentive de la géométrie Bézier
(calcul manuel du point médian) ; il n'était pas visible dans le code sans faire ce calcul. À
garder en tête pour toute future modification de tracés SVG à base de courbes de Bézier dans ce
projet : vérifier si un paramètre nommé « apex »/« peak » est utilisé comme point de contrôle ou
comme point réel du tracé, ce ne sont pas interchangeables.

