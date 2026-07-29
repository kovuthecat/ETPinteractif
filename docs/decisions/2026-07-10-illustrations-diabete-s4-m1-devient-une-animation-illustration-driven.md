# 2026-07-10 — Illustrations diabète S4 : M1 devient une animation illustration-driven à 4 modes

### Décision

1. **`MecanismeModule.tsx` réécrit en intégralité** — l'ancien wizard codé (4 temps linéaires,
   next/prev, 5 cellules-œufs en SVG) est remplacé par une **animation à 4 modes persistants**
   (Sans diabète / Insulinopénie / Insulinorésistance / Mixte), **3 cellules** contrôlées
   individuellement, portée fidèlement du prototype validé `proto-m1-anim2.html` (index
   illustrations-diabete §6, qui fait foi) : boucle de 3 phases (clés qui partent du pancréas →
   serrures qui réagissent → sucre qui se dépose/se vide), rejouée automatiquement toutes les
   ~4,9 s tant que le mode reste sélectionné.
2. **6 nouveaux assets** (`cell-closed/open/rusty.png`, `key.png`, `sugar.png`, `pancreas.png`)
   ajoutés à `build_assets.py`. Le script gagne un paramètre `base` par entrée de la table
   `ASSETS`, pour lire deux sources régénérées le 2026-07-11 (`cellule ouverte.png`, `Cellule
   serrure rouillée.png`) déposées à la **racine** de `Downloads` plutôt que dans le sous-dossier
   habituel `Downloads\illustration ETP` (nouvelle constante `SRC_DIR_ROOT`).
3. **Artère sous les cellules : reste codée** (barre CSS + jetons image), **pas**
   `artere-saine.png` étirée. Le plan proposait explicitement de « tester les deux rendus et
   garder le plus lisible » — sans accès navigateur pour comparer visuellement, le choix par
   défaut a été de garder l'option **déjà validée par Thibault au prototypage** (la barre codée du
   proto) plutôt que de risquer une image compacte déformée sur une largeur ~4× plus grande que sa
   proportion native.
4. **`prefers-reduced-motion` géré explicitement en JavaScript** (hook `usePrefersReducedMotion` +
   court-circuit de la boucle de `setTimeout`), en plus de la neutralisation CSS globale
   (`global.css`, transitions à 0.01 ms). La neutralisation CSS seule ne suffisait pas : elle
   accélère les transitions mais la scène aurait continué à changer d'état toutes les ~1,3 s même
   avec l'préférence système « mouvement réduit » activée — pas un « état statique lisible » au
   sens de l'étape 5 du plan S4.

### Contexte

Suite de S1 (pipeline + silhouette). S4 est indépendante des silhouettes/organes des autres
sessions (dépend seulement du pipeline d'assets), mais impose une réécriture complète du module
car le modèle mental change (temps successifs → modes persistants, 5 cellules → 3, coordonnées
codées → illustrations positionnées en %).

### Alternatives envisagées

- Garder l'ancien wizard 5-cellules et se contenter d'habiller ses étapes d'illustrations →
  écarté : le prototype validé par Thibault (index §6) définit un modèle d'interaction
  différent (mode persistant + boucle), pas une simple habillage visuel du wizard existant.
- Utiliser `artere-saine.png` sous les cellules (option notée « à tester » dans le plan) → écartée
  pour cette session par prudence (cf. décision ③) ; reste une piste explicite pour une itération
  future si Thibault la demande après avoir vu le rendu codé actuel.
- S'appuyer uniquement sur la règle CSS globale `prefers-reduced-motion` → écarté : elle ne coupe
  pas la logique de `setTimeout` qui pilote les phases, seulement la durée des transitions
  visuelles ; sans court-circuit JS, la scène continuerait de changer d'état en boucle.

### Raison du choix

Fidélité au prototype validé (seule source de vérité comportementale explicitement désignée par le
plan) ; prudence sur l'option d'image non testée visuellement, en cohérence avec la règle projet
« pas de navigateur côté Claude » — préférer une option déjà validée à une nouveauté non vérifiable
plutôt que d'introduire un risque visuel supplémentaire dans la même session que S3 (déjà signalée
comme point sensible).

### Conséquences

- Le composant n'a plus de notion de « temps 1 à 4 » linéaires ; toute référence future à
  `plans/theme-diabete/S4.md` (D4, l'ancien wizard) est obsolète pour ce module — ce plan-ci
  (`plans/illustrations-diabete/S4.md`) fait désormais autorité sur M1.
- `build_assets.py` supporte maintenant des sources multi-dossiers (`base=`) — pattern réutilisable
  si de futures régénérations d'illustrations atterrissent hors du sous-dossier `illustration ETP`.
- Positions/rotations des clés volantes (constantes du module) sont une **première approximation**
  calculée sans rendu visuel — point de revalidation explicite dans `VALIDATION.md` §S4.

### Impact IA

- Si Thibault demande finalement l'option `artere-saine.png` sous les cellules, c'est un
  changement localisé au bloc `.canalWrap`/`.canal` de `MecanismeModule.tsx`/`.module.css` — pas
  une reconception du reste de l'animation (modes, phases, clés, cellules inchangés).
- Si un mode doit changer (nouveau mécanisme, textes de légende), modifier uniquement la table
  `MODES` du module — la logique de phases/timers est générique et ne connaît pas le contenu des
  modes.
