# A8 — Soulagement : lecture en 2 temps + qualifier « stress » · Modèle : Sonnet, effort : low

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Postérieur à V4 (cumul clic, plus de curseur).** Ne pas revenir sur le modèle d'interaction.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §5 « Piège du soulagement ».
- **But :** le graphe associe **simultanément** nicotine, stress et soulagement → exige une
  médiation orale. (a) Ajouter une **consigne de lecture en deux étapes** et faire ressortir le
  **délai** entre la chute puis la remontée ; (b) qualifier le terme « **stress** » comme
  **tension liée au manque** pour éviter une généralisation clinique.

## Lire
- `src/features/soulagement/SoulagementModule.tsx`
- `src/features/soulagement/SoulagementModule.module.css`
- `docs/contenu-modules.md` §Module 5

## Modifier
- `src/features/soulagement/SoulagementModule.tsx`
- `src/features/soulagement/SoulagementModule.module.css`

## Hors périmètre
- Ne PAS toucher `src/lib/nicotineCurve.ts` (`sampleStress`) sauf strict besoin de libellé.
  Aucune dépendance. Ne pas réintroduire de curseur/animation (V4).

## Conception (fixée)
- **Consigne de lecture en 2 temps** : une phrase guidant l'œil, ex. « 1) La cigarette fait
  chuter la tension du manque ; 2) puis elle remonte, un peu plus haut → on refume. »
- **Délai chute → remontée** : le rendre **visuellement saillant** (annotation, flèche ou
  intervalle marqué entre le creux et la remontée), pour que le mécanisme se lise sans
  explication orale.
- **Terme « stress »** : remplacer / qualifier par « **tension liée au manque** » (ou « tension
  du manque ») partout où « stress » désigne cette courbe, pour éviter une lecture clinique
  générale. Vérifier la cohérence avec le contenu source.

## Étapes
1. Ajouter la consigne de lecture en deux étapes (au-dessus/à côté du graphe).
2. Annoter visuellement le délai chute → remontée.
3. Renommer « stress » → « tension liée au manque » dans les libellés/légendes du module.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** la consigne en 2 temps est présente ; le délai chute/remontée se
  voit ; plus de « stress » nu (remplacé par « tension liée au manque ») ; message final clair ;
  lisible à ~1 m.

## Si bloqué
Si l'annotation du délai est complexe à placer sur le SVG → se limiter à la consigne 2 temps + le
renommage (déjà l'essentiel du message) et signaler. Doute clinique → STOP + signaler.

## Commit
`fix(soulagement): lecture en 2 temps + qualifier « stress » en « tension liée au manque » (A8)`

## Statut
[ ] à faire
