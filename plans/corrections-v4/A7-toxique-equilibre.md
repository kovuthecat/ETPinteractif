# A7 — Nicotine ≠ toxique : garder la dépendance lisible, ne pas reposer que sur rouge/vert · Modèle : Sonnet, effort : medium

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Postérieur à V6 (reformulation « Mélange chimique »).** Ne pas retoucher ce texte.

- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` §4 « Nicotine ≠ toxique ».
- **But :** le mode sélectionné **atténue fortement l'autre concept** → risque de faire croire
  que la nicotine isolée est **sans enjeu**. Maintenir lisible le rôle de **dépendance** dans les
  deux états, et ne pas reposer **uniquement** sur le codage rouge/vert (accessibilité + nuance).

## Lire
- `src/features/nicotine-toxique/NicotineToxiqueModule.tsx`
- `src/features/nicotine-toxique/NicotineToxiqueModule.module.css`
- `docs/contenu-modules.md` §Module 4 (nuance : « la nicotine n'est pas anodine — p. ex.
  grossesse — mais ce n'est pas elle qui tue »)

## Modifier
- `src/features/nicotine-toxique/NicotineToxiqueModule.tsx`
- `src/features/nicotine-toxique/NicotineToxiqueModule.module.css`

## Hors périmètre
- Ne pas retoucher le `detail` de « Mélange chimique » (V6). Aucune dépendance. Ne pas inventer de
  contenu non présent dans `docs/contenu-modules.md`.

## Conception (fixée)
- **Ne pas éteindre l'autre colonne** : quand un état est sélectionné, l'autre reste **lisible**
  (atténuation légère, pas quasi-invisible). Le message central « c'est la combustion, pas la
  nicotine, qui rend malade » reste dominant sans nier le rôle de dépendance de la nicotine.
- **Double encodage** (ne pas reposer que sur rouge/vert) : ajouter un repère **non chromatique**
  (icône, libellé explicite « dépendance » / « ce qui rend malade », motif ou position) pour que
  la distinction passe sans la couleur.
- **Nuance nicotine** : maintenir visible un rappel court que « la nicotine crée la dépendance et
  n'est pas totalement anodine (ex. grossesse), mais n'est pas ce qui rend malade » (source §M4)
  — sans moraliser, cohérent avec le takeaway existant.
- Sobriété et lisibilité à ~1 m ; réutiliser les tokens.

## Étapes
1. Ajuster l'état sélectionné pour garder l'autre colonne lisible (atténuation légère seulement).
2. Ajouter un repère non chromatique aux deux groupes (icône/libellé/position).
3. S'assurer que le rôle de dépendance de la nicotine reste énoncé dans les deux états.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** les deux concepts restent lisibles quel que soit l'état
  sélectionné ; la distinction est compréhensible sans la couleur ; la nicotine n'apparaît pas
  « sans enjeu » ; message principal toujours fort ; lisible à ~1 m.

## Si bloqué
Si l'équilibre lisibilité/emphase est difficile → privilégier **l'exactitude** (ne jamais laisser
croire que la nicotine est sans enjeu) quitte à réduire le contraste d'emphase, et signaler.
Doute clinique → STOP + signaler.

## Commit
`fix(nicotine-toxique): garder la dépendance lisible + double encodage (au-delà du rouge/vert) (A7)`

## Statut
[ ] à faire
