# V6 — Nicotine-toxique : « Mélange chimique » reformulé avec conséquence · Modèle : Haiku, effort : low

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Correctif de CONTENU** : le texte proposé ci-dessous est à valider par Thibault (autorité médicale).

- **Capture :** `corrections/Quel interet de melange chimique tel quel, on ne mentionne aucune consequence.PNG`
- **But :** l'item « Mélange chimique » n'énonce qu'« environ 7 000 substances chimiques » sans
  **conséquence** → sans intérêt en l'état. Reformuler le détail pour **nommer la conséquence**,
  en restant dans le cadre sourcé du module.

## Lire
- `src/features/nicotine-toxique/NicotineToxiqueModule.tsx` (constante `HOTSPOTS`, id `melange`)
- `docs/contenu-modules.md` §Module 4 (autorité du contenu : « goudrons, CO, particules fines,
  ~7000 substances, ~70 cancérogènes ; c'est la fumée/combustion qui rend malade, pas la nicotine »)

## Modifier
- `src/features/nicotine-toxique/NicotineToxiqueModule.tsx` (champ `detail` du hotspot `melange`,
  éventuellement `eyebrow`/`label`)

## Hors périmètre
- Ne PAS ajouter de dépendance, ne pas toucher aux autres hotspots ni à la scène SVG.
- Ne pas inventer de chiffre non présent dans `docs/contenu-modules.md`.

## Texte proposé (à valider Thibault)
Reformulation du `detail` de `melange`, cohérente avec la source (le « cocktail » de la
combustion = ce qui rend malade, par opposition à la nicotine) :

> **Detail proposé :** « En brûlant, le tabac libère un cocktail d'environ 7 000 substances
> chimiques. C'est ce mélange issu de la combustion — et non la nicotine — qui rend malade. »

- `eyebrow` : conserver « Fumée de combustion » (ou « Ce qui rend malade »).
- Alternative si Thibault préfère : garder le chiffre en intro et **fusionner** l'item (option
  écartée à l'AskUserQuestion — décision = reformuler). Ne PAS fusionner sans nouvel accord.

## Étapes
1. Remplacer le `detail` du hotspot `melange` par le texte validé.
2. Vérifier la cohérence avec le takeaway existant (« retirer la combustion change l'exposition
   aux toxiques… »).

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** ouvrir le pop-up « Mélange chimique » → une conséquence claire
  est énoncée ; cohérent avec le message « c'est la combustion, pas la nicotine, qui rend malade ».

## Si bloqué
Si Thibault n'a pas encore validé le texte → appliquer la proposition ci-dessus **et** noter
« texte à valider » dans VALIDATION.md (ne pas bloquer le lot). Doute clinique → STOP + signaler.

## Commit
`fix(nicotine-toxique): reformuler « Mélange chimique » avec sa conséquence (V6)`

## Statut
[x] fait — texte à valider par Thibault (cf. VALIDATION.md)
