# 2026-07-11 — Corrections visuelles diabète (revue Thibault, 13 captures → 5 causes-racines)

### Décision ① — S4 : fin du côte-à-côte cadran/panneau + suppression des chips de fréquences

Le module 6 Suivi (« Parcours ») passe d'un layout côte-à-côte (`@media (min-width: 860px)` :
cadran + panneau en `flex-direction: row`) à un **empilement systématique** (cadran toujours
au-dessus, panneau toujours pleine largeur en dessous). Les groupes de chips de fréquences
alternatives (consultations : 3 chips « Tous les 3/4/6 mois » ; examens : 4 chips « Chaque
consult. / 1×/an / 1×/2 ans / 1×/5 ans ») sont remplacés par **un seul stepper `‹ valeur ›`**
par ligne (nouvel helper `cycleValue`), qui cycle dans les mêmes options.

**Contexte** — Capture Thibault #3 : le côte-à-côte (cadran max 480px + panneau `flex 1 1
520px`) dépassait la largeur d'écran, coupant le panneau à droite ; les lignes d'examen
cumulaient 5-7 colonnes en polices 10-12px, illisibles à distance de consultation.

**Alternatives envisagées** — Garder le côte-à-côte et réduire seulement les polices : écarté,
la largeur cumulée (480+520px) dépasse un écran de consultation standard quel que soit le
contenu. Garder les chips mais les faire réellement tenir en une ligne (largeurs réduites) :
écarté, les libellés (« Tous les 6 mois », « 1×/2 ans ») ne se compriment pas assez pour rester
lisibles à ≥14px sur 4 chips côte à côte.

**Conséquences** — Les steppers `STEP_CONSULT_START`/`STEP_EXAM_MONTH` (ajustement fin du mois
de départ dans le cycle, hors cible de simplification du plan) sont retirés en même temps que
leur UI — action reducer et fonctions associées supprimées plutôt que laissées mortes. Les
examens/consultations restent placés au mois par défaut de `logic.ts` (`DEFAULT_EXAM_FREQUENCY`,
`// à revalider`) sans réglage manuel de mois. Le bouton dédié « Ce que ça garde » est retiré ;
son rôle est repris par l'icône de la ligne (devenue un `<button>` avec `aria-label` explicite)
pour ne pas perdre l'accès au panneau descriptif tout en tenant la cible de colonnes du plan.

**Impact IA** — Si Thibault souhaite réintroduire un réglage fin du mois par examen, il faudra
réintroduire une action reducer dédiée (ex. `SET_EXAM_MONTH`) et une UI compacte (pas un 2ᵉ
stepper par ligne, qui recasserait la largeur) — probablement un réglage global plutôt que par
ligne. Détail complet dans `plans/corrections-visuelles-diabete/S4.md`.

### Décision ② — S2 : modèle de courbe glycémie recalibré (K_CHARGE/K_FREIN/K_RETARD)

`glycemieCurve.ts` : `K_CHARGE` 60→20, `K_FREIN` 6→20, `K_RETARD` 5→14 (désaturation
**conjointe**, pas seulement `K_CHARGE`), `ORDRE_FREIN_BONUS` 0.45→0.6, `ORDRE_RETARD_BONUS`
0.35→0.5. Résultat : un féculent seul « rouge » culmine désormais ~80/100 (contre ~55 avant),
trois féculents cumulés ~90/100 (contre ~67 avant, un écart jugé insuffisant par Thibault,
capture #9). `PEAK_BAS_MAX`/`PEAK_HAUT_MIN` (défi ② Alimentation) recalibrés 47/50 → 55/74 par
ré-échantillonnage complet du garde-manger (33 aliments).

**Contexte** — Le plan indicatif suggérait d'augmenter seulement `K_CHARGE` (60→110-140). Un
calibrage réel (script jetable, hors navigateur) a montré que cette direction **abaisse** les
pics au lieu de les monter : avec `K_CHARGE` seul relevé, la charge d'un féculent isolé diminue
(la fonction de saturation `1 - exp(-x/K)` reste alors dans sa portion quasi-linéaire, plus
basse). C'est la baisse conjointe de `K_CHARGE` (charge monte plus vite par gramme de CG) **et**
de `K_FREIN`/`K_RETARD` (le frein cumulé de plusieurs féculents identiques ne rattrape plus le
gain de charge) qui produit l'effet demandé.

**Alternatives envisagées** — Suivre le plan à la lettre (`K_CHARGE` 60→130 seul) : écarté après
vérification chiffrée (voir ci-dessus, effet inverse à celui recherché). Changer la forme de la
fonction de charge (loi de puissance au lieu d'une exponentielle de saturation) pour découpler
plus finement bas et haut de gamme : écarté, hors périmètre du plan (qui ne demandait qu'un
ajustement de constantes, pas une refonte de la formule) et risque de complexité inutile pour un
gain marginal.

**Conséquences** — 2 tests ajoutés (`glycemieCurve.test.ts`) : pic(3 féculents identiques) >
pic(1 seul) et proche du plafond ; delta ordre premier/dernier ≥ 15 points. Seuils absolus de 2
tests existants (pastèque/lentilles) relevés en conscience (`BASELINE+12` → `BASELINE+20`),
l'invariant relatif renforcé (`rizBlanc - 25` au lieu d'une simple comparaison). `bandeToY`
déplacé de `insuline/scenarios.ts` vers `CourbeGlycemie.tsx` (export générique, paramètre
`levelMax` par défaut 100) pour être réutilisé par le module Alimentation sans dupliquer le
calcul.

**Impact IA** — Toutes les constantes de courbe restent `// à revalider (Thibault)` — calibrage
pédagogique, pas un simulateur métabolique validé. Si Thibault ajuste à l'usage, ne modifier que
les constantes commentées dans `glycemieCurve.ts`, pas la formule elle-même. Détail complet dans
`plans/corrections-visuelles-diabete/S2.md`.

### Décision ③ — S6 : Mécanisme, option B (jouer une fois puis « Rejouer »)

`MecanismeModule.tsx` abandonne la boucle auto-relancée (400→1600→2700ms puis relance à
4900ms, ~2,2s de tenue sur l'état final) au profit de l'**option B** du plan : la séquence se
joue **une seule fois** (500→2000→3400ms) à la sélection d'un mode, puis reste sur l'état
final **indéfiniment**. Un bouton « Rejouer » (sous la légende, masqué si
`prefers-reduced-motion`) permet de la relancer à la demande ; re-cliquer le mode déjà actif
la relance aussi (nouveau state `replayKey`).

**Contexte** — Capture Thibault #11 : « les animations sont trop rapides et ne restent pas
assez longtemps sur l'état final ». Le plan proposait deux options ; B est explicitement
recommandée (« moins diaporama, plus maîtrisé par le soignant »).

**Raison du choix** — Cohérent avec l'esprit du module (le soignant choisit le mode, ne pilote
pas la boucle image par image) : ici il déclenche, la scène se joue, elle s'arrête sur le
résultat — le soignant garde la main sur le rythme de la narration, contrairement à une boucle
qui repart automatiquement pendant qu'il commente encore la phase précédente.

**Conséquences** — Le nettoyage `cancelled`/`clearTimeout` au démontage/changement de mode est
préservé (une seule série de timers désormais, plus de récursion `runCycle`). Les 3 durées de
phase sont légèrement allongées (400→500, 1600→2000, 2700→3400 ms) pour un mouvement plus posé,
sans modifier les transitions CSS des cellules/clés/jetons (déjà dans une plage compatible).

**Impact IA** — Si Thibault préfère finalement l'option A (boucle continue mais plus lente),
remplacer le retrait de la relance par un `window.setTimeout(runCycle, X)` en fin de séquence
(cf. version précédente dans `git log`), sans toucher au reste du composant.

### Décision ④ — S7 : plaque d'athérome en croissant pariétal (au lieu d'une ellipse centrée)

`PlaqueArtere.tsx` remplace l'ellipse centrée (`cx=50 cy=50`, grossissant au milieu du
vaisseau) par un **dépôt en croissant** (`crescentPath`, courbe de Bézier quadratique) collé à
la paroi (y=0 dans le repère local du composant), plat aux deux extrémités du vaisseau et
bombé vers le centre de la lumière au milieu — au-delà d'un seuil d'encrassement (>0.5), un
2ᵉ croissant apparaît sur la paroi opposée (rétrécissement bilatéral, profondeur 75 % du
premier). Même courbe de croissance (`pot = encrassement^0.75`), mêmes paliers de teinte,
`plaquePassagePct` **non modifiée**.

**Contexte** — Capture Thibault #13 : « la forme de la plaque n'est pas vraiment adaptée à
l'artère » — un blob rouge centré ne « colle » pas à un vaisseau (tube horizontal/oblique).

**Alternatives envisagées** — Lentille/banane en `path` SVG dessinée à la main (le plan
proposait aussi cette option) : écartée au profit d'une courbe de Bézier quadratique simple
(`M0,edgeY Q50,peakY 100,edgeY Z`), plus courte à maintenir et strictement suffisante pour
l'effet visuel recherché (plat aux bords, bombé au centre). Repositionner `.artereOverlay`
(rotation/position déjà calées en S3 illustrations-diabete par analyse PCA de l'image) :
écarté, la boîte overlay était déjà posée sur la lumière — seul le contenu du SVG à
l'intérieur change, pas son cadrage.

**Conséquences** — La profondeur du croissant au centre (`wallDepth`) dérive de la même
formule que `plaquePassagePct` (paroi 8→42 sur référence 120, mise à l'échelle du viewBox
0–100), pour que le texte « Passage du sang : X % » reste cohérent avec le point le plus
étroit du dépôt visuel. Transition CSS `rx`/`ry` (obsolète, `path` n'a pas ces attributs)
remplacée par une transition `d`, neutralisée sous `prefers-reduced-motion`.

**Impact IA** — Point sensible non vérifié à l'écran (règle projet, cf. `VALIDATION.md` §S7) :
si le croissant déborde de la lumière visible, ajuster uniquement `.artereOverlay`
(`RisqueCardioModule.module.css`, `left`/`top`/`width`/`height`/rotation) — ne pas retoucher
`PlaqueArtere.tsx` pour un problème de cadrage.

### Décision ⑤ — S8 : passe « moins de texte » agressive (9 modules) + libellé Insuline ③

Passe agressive de retrait de texte ambiant sur les 9 modules diabète, selon la règle de tri
posée par le plan : **on coupe** intros/consignes de tête de module, bandes de légende
explicatives en bas d'écran, hints redondants ; **on garde** les eyebrows courts d'onglet et
**tout texte qui EST le résultat d'une interaction** (`sideText` Traitements, décision
Insuline, verdicts Alimentation, détail au clic Activité, panneau organe Complications,
`patienceMessage` Hypoglycémie). En cas de doute, garder l'eyebrow, couper le paragraphe.
Libellé de l'onglet ③ Insuline corrigé : `'③ 2 situations'` → `'③ Décider'` (la carte ①
contient en réalité **3 chips** de lecture de la nuit, le chiffre était trompeur).

**Contexte** — Capture Thibault #1 + remarque transverse D : « beaucoup de texte explicatif
souvent inutile/polluant. C'est le soignant qui fait la narration. » Le texte en trop
allongeait aussi les pages (Insuline #1 : les cartes situations passaient sous la ligne de
flottaison).

**Alternatives envisagées** — Retrait sélectif module par module selon un jugement au cas par
cas, sans règle explicite : écarté, risque d'incohérence de registre entre les 9 modules (un
module resté verbeux à côté de 8 allégés) — la règle de tri écrite dans le plan tranche les
cas ambigus (ex. `D1_CAPTIONS` gardées car sorties dynamiques du plateau, mais réduites à une
ligne ; `arteryMessage` gardé mais raccourci, pas coupé, car sortie du réglage des feux).

**Conséquences** — Bundle JS réduit (459,9 → 455,0 kB) malgré aucune fonctionnalité perdue :
tous les textes coupés étaient de la narration ambiante déjà répétée par les eyebrows/labels
ou destinée à être portée par le soignant. Plusieurs classes CSS mortes supprimées avec leur
texte (`.intro`, `.videSousTitre`, `.vueHint`, `.captionText`, `.totalNote`, `.sideHint`,
`.caption` selon les modules).

**Impact IA** — Toute future addition de texte dans ces 9 modules doit repasser par la même
règle de tri (eyebrow court ou sortie d'interaction, sinon narration orale du soignant) —
sinon le registre redevient hétérogène entre modules.

