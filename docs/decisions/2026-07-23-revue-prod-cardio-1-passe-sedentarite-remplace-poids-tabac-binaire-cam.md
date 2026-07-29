# 2026-07-23 — Revue prod cardio (1ʳᵉ passe) : sédentarité remplace poids, tabac binaire, camembert à 3 frontières généralisé au diabète

**Contexte** — Après le pilote M1-M3 du chantier `theme-cardio-2026-07`, Thibault a fait une revue
directe du déployé (hors plan/sessions formelles) et corrigé 8 points, committés au fil de l'eau sans
resynchronisation immédiate de `STATUS.md`/`TASKS.md` (fait a posteriori le 2026-07-23, cf. `STATUS.md`).

**Décisions actées** :
1. **M2 — sédentarité plutôt que poids/tour de taille.** Le facteur poids faisait doublon avec « mes 3
   chiffres » du module Suivi et était moins actionnable qu'un levier comportemental. Conséquence en
   cascade sur M12 (voir point 4).
2. **M2 — tabac binaire, pas de palier intermédiaire.** Justification clinique : il n'existe pas de
   niveau de tabagisme « orange », le risque bascule à l'arrêt complet.
3. **Renvois inter-modules en pied d'écran retirés partout** (M1/M3/M4/M5/M7/M11). Rationnel : le
   soignant connaît l'outil et navigue lui-même depuis l'accueil du thème — ces raccourcis étaient une
   redondance de navigation, pas un besoin pédagogique.
4. **M12 — glycémie remplace tension/LDL/tour de taille dans « mes 3 chiffres ».** Le facteur tour de
   taille est devenu orphelin après la décision 1 (plus aucune station du thème ne le mesurait) ;
   glycémie choisie car elle correspond à l'une des 5 stations existantes de la grille de suivi (contrainte
   : les 3 chiffres doivent chacun avoir une station associée, jamais un chiffre flottant).
5. **M8 — camembert à 3 frontières indépendantes** (au lieu de 2 + un point de fermeture fixe), chaque
   catégorie-cœur représentée par un aliment concret choisi par glisser-déposé plutôt qu'un compteur
   abstrait. **Généralisé au diabète (défi Proportion, module Alimentation) en miroir**, à la demande de
   Thibault — même patron d'interaction dans les deux thèmes plutôt que deux implémentations divergentes.
   Un bug de bornage latent (catégorie à 0 % bloquant le calcul de l'empan voisin, angles ambigus) a été
   corrigé au passage dans les deux thèmes.
6. **M9 — alcool en icônes+fréquence, stress en échelle analogique.** Un slider nu pour l'alcool
   supposait implicitement une consommation quotidienne (biais de cadrage) ; les icônes de verre +
   sélecteur de fréquence explicite évitent ce biais. Le stress perd son curseur+chiffre brut au profit
   d'une échelle visuelle qualitative (confort→vigilance→toxique) — cohérent avec l'invariant « pas de
   chiffre à l'écran » que le curseur numérique enfreignait.

**Non fait dans cette passe** : aucune session formelle (pas de `plans/`), aucun nouveau commit de
contexte au moment des corrections — la resynchronisation `STATUS.md`/`TASKS.md`/`VALIDATION.md` est
un rattrapage a posteriori, pas une nouvelle passe de gate.

