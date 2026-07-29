# 2026-07-11 — Corrections visuelles diabète, tour 3 — S6 : breakpoint Suivi remonté 860→1200px

**Contexte** — Le module Suivi (onglet Parcours) passe en côte-à-côte (cadran + panneau
d'examens) dès 860px de large (décision tour 2, `S3-v2`). L'audit Chrome montre qu'à 881px
(viewport testé), le cadran agrandi ET le panneau d'examens larges ne tiennent pas ensemble sur
2 colonnes : soit le cadran est étranglé (v2, `.dialWrap` rétréci à 420px en côte-à-côte —
contre-intuitif, passer côte-à-côte réduisait le cadran), soit le panneau déborde
horizontalement, provoquant un double scroll (H et V, `.examList` avait aussi
`max-height:480px; overflow:auto`).

**Décision** — Remonter le breakpoint `.parcours`/`.panel` de 860px à 1200px : à 881-1199px, le
layout reste empilé (cadran centré pleine largeur au-dessus, panneau d'examens pleine largeur
dessous). Combiné au retrait de `max-height`/`overflow` sur `.examList`, ce scénario satisfait
littéralement les deux objectifs du plan (« cadran plus grand » ET « pas de scroll ») : à pleine
largeur, un `.examRow` déjà dégraissé (tour 2) tient sur une ligne, la hauteur totale de la
liste redevient gérable sans scroll interne.

**Conséquences** — Le côte-à-côte ne se déclenche plus qu'à partir de 1200px (grands écrans).
Si Thibault juge que des écrans intermédiaires (900-1199px) bénéficieraient d'un côte-à-côte
plutôt que de l'empilement, le seuil est isolé dans une seule règle CSS (`.parcours`, `.panel`)
et peut être ajusté sans toucher au reste. `// à revalider (Thibault)`.

