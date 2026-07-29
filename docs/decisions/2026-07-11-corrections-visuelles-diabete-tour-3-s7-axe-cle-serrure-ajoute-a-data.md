# 2026-07-11 — Corrections visuelles diabète, tour 3 — S7 : axe clé/serrure ajouté à `data.ts` (classement à revalider)

**Contexte** — Le module Traitements manquait d'un lien visuel avec la métaphore clé/serrure du
module Mécanisme (« C'est quoi le diabète ? ») : rien ne distinguait, dans le panneau d'effet,
les traitements qui agissent sur l'insulinorésistance (serrure rouillée) de ceux qui agissent
sur la sécrétion d'insuline (manque de clés).

**Décision** — Nouveau champ optionnel `ClasseTraitement.picto?: 'serrure' | 'cle'` dans
`data.ts`. Classement retenu : `metformine` → `serrure` (sensibilisateur, insulinorésistance) ;
`sulfamide`, `idpp4`, `aglp1`, `insuline` → `cle` (sécrétion / effet incrétine gluco-dépendant) ;
`gliflozine` (action rénale), `ieca`, `statine` (cardio/lipidique) → **aucun picto**, elles sont
hors métaphore et on ne force pas un classement qui n'a pas de sens clinique pour elles
(invariant 5 : ne rien inventer).

**Point ouvert (bloquant clinique, pas bloquant code)** — Le classement d'iDPP4/aGLP1 en
« sécrétion » est défendable (effet incrétine → sécrétion gluco-dépendante d'insuline) mais
n'a pas été validé par Thibault. Marqué `// à revalider (Thibault)` dans `data.ts`. Ne pas
présenter ce classement comme validé cliniquement tant que ce point n'est pas tranché.

