# A1 — Substituts : intégrer le contenu validé par forme · Modèle : Sonnet, effort : medium

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design + contenu fixés par Opus/Thibault.
> **P0.** Le contenu par forme ci-dessous est **fourni et validé par Thibault** (autorité
> médicale, 2026-07-01). Le transcrire tel quel ; ne rien inventer au-delà.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §« P0 — Finaliser le contenu du module Substituts » +
  contenu Thibault (ci-dessous).
- **But :** remplacer les placeholders « À compléter » de `FORMES_DATA` (7 formes) par le contenu
  réel, structurer chaque forme en **bonnes pratiques** + **erreurs fréquentes**, rendre lisible
  la relation forme → cartes, et rendre le bouton « + ¼ » désactivé **explicable**.

## Lire
- `src/features/substituts/SubstitutsModule.tsx`
- `src/features/substituts/SubstitutsModule.module.css`
- `docs/contenu-modules.md` §Module 3

## Modifier
- `src/features/substituts/SubstitutsModule.tsx` (constante `FORMES_DATA`, titres de panels, aide bouton)
- éventuellement `src/features/substituts/SubstitutsModule.module.css` (consigne, état « en rédaction »)
- `docs/contenu-modules.md` §Module 3-A : reporter le contenu validé (la doc dit « à fournir »)

## Hors périmètre
- Aucune dépendance runtime. Rester **qualitatif** (aucune dose en mg). Ne pas inventer de contenu
  pour les formes non fournies (voir Inhaleur / Vapoteuse ci-dessous).

## Contenu validé Thibault — à transcrire dans `FORMES_DATA`

### Patch (24 h / 16 h) — `patch`
`bonnesPratiques` :
- Appliquer 1 patch le matin au réveil.
- Changer de site d'application chaque jour.
- L'effet commence à se faire sentir ~30 min après l'application.
- Autant que possible, garder le patch la nuit pour ne pas manquer de nicotine le matin.

`erreurs` (corollaires directs des consignes ci-dessus) :
- Attendre un effet immédiat (il faut ~30 min).
- Retirer le patch la nuit alors qu'on a besoin de nicotine au réveil (sauf sommeil perturbé →
  dose de nuit plus faible, cf. titration).
- Reposer le patch toujours au même endroit.

### Gomme — `gomme`
`bonnesPratiques` :
- Prendre une gomme dès que l'envie de fumer se fait sentir.
- Mâcher lentement 5–6 fois, puis garder la gomme contre la joue ~2 min (la nicotine se libère et
  est absorbée par la muqueuse buccale).
- Remâcher lentement puis reposer contre la joue, et recommencer ainsi pendant ~30 min.
- Gérer « au coup par coup » : une gomme dès que l'envie réapparaît dans la journée.

`erreurs` :
- Mâcher vite et en continu comme un chewing-gum (la nicotine est avalée, moins efficace).
- Avaler la salive au lieu de laisser absorber par la joue.

### Pastille — `pastille`
`bonnesPratiques` :
- Prendre une pastille dès que l'envie de fumer se fait sentir.
- Laisser se dissoudre sous la langue, ou contre la joue en la déplaçant régulièrement d'un côté à
  l'autre de la bouche.
- En 2–3 min, l'effet se fait sentir et l'envie s'estompe.

`erreurs` :
- Croquer ou avaler la pastille (elle doit fondre lentement).

### Comprimé sublingual — `sublingual`
`bonnesPratiques` :
- Prendre un ou deux comprimés dès que l'envie se fait sentir.
- Placer le comprimé sous la langue ou contre la joue et le laisser fondre.
- L'effet se fait sentir en quelques minutes.

`erreurs` :
- Croquer ou avaler le comprimé.

### Spray buccal — `spray`
`bonnesPratiques` :
- Une ou deux pulvérisations à chaque fois que l'envie de fumer se fait sentir.
- Pulvériser dans la bouche, sur l'intérieur des joues (placer le spray un peu de côté pour
  atteindre l'intérieur de la joue).
- On peut vaporiser sous la langue puis répartir sur l'intérieur des joues en bougeant la langue ;
  l'essentiel est de bien couvrir la muqueuse des joues.
- Efficace en ~1 min.

`erreurs` :
- Viser le fond de la gorge / inhaler la pulvérisation.

### Inhaleur — `inhaleur` · Vapoteuse — `vapoteuse`
Contenu **non fourni** à ce stade → **repli honnête** (pas de faux « À compléter ») : afficher un
état neutre « Fiche en cours de rédaction — à voir avec votre soignant », prêt à recevoir le
contenu quand Thibault le fournira. Signaler dans VALIDATION.md.

## Titration (Partie B) — préciser la règle et rendre le bouton explicable
Contenu Thibault (précise l'existant) :
- **Tous les 3 jours**, si la personne fume **encore plus de 3 cigarettes/jour** : **ajouter ¼ de
  patch**, et continuer ainsi progressivement **jusqu'à ce que l'envie s'estompe**.
- **Signes de surdosage** : impression d'avoir trop fumé, nausées, vertiges, palpitations →
  **revenir à la dose précédente** : c'est la dose dont on a besoin.

À intégrer :
- Reformuler le libellé du bouton « + ¼ (à J+2-3) » → « **+ ¼ (tous les 3 jours)** ».
- Ajouter, sous les contrôles, une **aide visible** expliquant la condition d'activation (pas
  seulement l'état `disabled`) : « Augmentez d'¼ tous les 3 jours tant que l'envie persiste
  (>3 cig/j), sans signe de surdosage. »
- Détailler les signes de surdosage dans la bannière `role="alert"` (« impression d'avoir trop
  fumé, nausées, vertiges, palpitations »). Ne pas changer la logique (`disabled={!envie ||
  surdosage}`), seulement l'expliciter.

## Étapes
1. Renseigner `FORMES_DATA` pour patch, gomme, pastille, sublingual, spray (contenu ci-dessus).
2. Inhaleur/vapoteuse : état « en cours de rédaction » (repli honnête), pas de « À compléter » brut.
3. Ajouter la consigne courte au-dessus des `.chips` et titrer les `.panel` avec le libellé de la
   forme sélectionnée (ex. « Patch — bonnes pratiques » / « Patch — erreurs fréquentes »).
4. Reformuler le bouton « + ¼ », ajouter l'aide de condition et détailler les signes de surdosage.
5. Reporter le contenu validé dans `docs/contenu-modules.md` §Module 3-A (retirer « à fournir »).

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** chaque forme fournie affiche de vraies bonnes pratiques + erreurs ;
  inhaleur/vapoteuse en « rédaction » (plus de « À compléter » brut) ; la forme sélectionnée titre
  les cartes ; le bouton « + ¼ » indique pourquoi il est désactivé ; signaler « inhaleur/vapoteuse
  à fournir par Thibault ».

## Si bloqué
Doute clinique sur une reformulation → STOP + signaler ; ne pas modifier le sens du contenu fourni.

## Commit
`feat(substituts): contenu validé par forme + titration précisée + bouton explicable (A1)`

## Statut
[ ] à faire — inhaleur/vapoteuse à fournir par Thibault (repli « en rédaction »)
