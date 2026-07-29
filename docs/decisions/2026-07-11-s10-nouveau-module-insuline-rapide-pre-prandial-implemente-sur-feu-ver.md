# 2026-07-11 — S10 : nouveau module « Insuline rapide (pré-prandial) », implémenté sur feu vert explicite avant relecture finale formelle du contenu

**Contexte** — `S10.md` posait un gate de contenu bloquant : le fichier
`docs/diabete/10-insuline-rapide.md` (périmètre DT2 basal-bolus, déroulé 4 temps, sources
OpenEvidence ADA 2026/ADA-EASD/AACE/Endocrine Society) devait recevoir une **relecture finale**
de Thibault avant tout code. Un plan d'implémentation détaillé (`S10-implementation.md`) avait
été préparé en amont pour exécution « de bout en bout » une fois ce feu vert donné.

**Décision** — Thibault a explicitement demandé l'implémentation (« implemente S10 ») avec le
fichier `S10.md` ouvert dans l'IDE, sans que le statut du document de contenu ait été changé de
« en attente de relecture finale » à « validé ». Cette instruction directe a été interprétée
comme le feu vert attendu par le plan, et l'implémentation a suivi `S10-implementation.md` sans
autre changement de périmètre. Le statut de relecture du contenu (§ en tête de
`10-insuline-rapide.md`) n'a **pas** été modifié par cette session — il reste à confirmer
a posteriori par Thibault que le contenu livré est bien celui qu'il valide.

**Réalisé** :

- `sampleRepasAvecBolus` (`src/features/diabete/lib/glycemieCurve.ts`) : modèle PK/PD qualitatif
  d'un bolus rapide (latence/pic/durée/amplitude en cloche, cf. plan §1.2), avec correction du
  point de départ (temps ③) et 2ᵉ dose de cumul optionnelle (temps ④). 6 nouveaux tests
  d'invariants qualitatifs (`glycemieCurve.test.ts`, describe « invariant 10 »).
- **Recalibrage `BOLUS_DUREE` 240→180 min** (borne basse de la fourchette sourcée « activité
  clinique 3-4h », toujours `// à revalider (Thibault)`) : avec 240 min, une dose unique
  correctement dosée/timée laissait une traîne résiduelle qui creusait artificiellement sous la
  baseline après le retour à baseline du repas, brouillant la distinction pédagogique avec le
  cumul (temps ④). À 180 min, une dose unique reste proche de la baseline (tolérance testée
  ±8 points) tandis qu'un cumul rapproché creuse nettement (>15 points sous baseline).
- `InsulineRapideModule.tsx` + `.module.css` (`src/features/diabete/insuline-rapide/`) : 4 temps
  à onglets (pattern S1 `wide`/`nav`, calqué sur `HypoglycemieModule.tsx`), `CourbeGlycemie`
  réutilisée sans modification de son viewBox, domaine temporel commun -60→+180 min (« Repas »
  aligné exactement sur l'étiquette d'axe médiane). **Zéro chiffre à l'écran** : le curseur de
  temps ② (délai d'injection) pilote un `<input type="range">` avec ticks qualitatifs
  (« bien avant / juste avant / au moment du repas / après le repas »), jamais de minutes
  affichées — plus strict que le module 3 Activité qui affiche des minutes sur son slider
  équivalent (ici explicitement interdit par le plan, contenu contraint par le sujet dose/insuline).
  Pas de `FicheOverlay` (interdiction explicite du contenu : fiche d'ajustement de dose de repas
  jugée dangereuse hors contexte).
- Enregistré dans `registry.ts` (id `insuline-rapide`, famille `soigner`, juste après `insuline`,
  icône `Utensils`).

**Conséquences** — Le thème diabète compte désormais 10 modules. `tsc --noEmit` + `npm run
build` + `npm test` (86/86, dont les 6 nouveaux) verts. Reste ouvert : (1) la relecture finale du
contenu par Thibault (le document n'a pas changé de statut) ; (2) tous les paramètres cliniques
du modèle (`BOLUS_LATENCE`/`BOLUS_PIC`/`BOLUS_DUREE`/`BOLUS_EFFET_MAX`, valeurs de `depart` par
palier, offset de la 2ᵉ dose) restent `// à revalider (Thibault)` ; (3) validation visuelle du
module (checklist `VALIDATION.md § S10-v3`).

**Impact IA** — Si une session future doit retravailler le modèle `sampleRepasAvecBolus`, lire
d'abord ce journal + les tests « invariant 10 » : le choix `BOLUS_DUREE=180` (plutôt que 240,
sourcé) est une calibration pédagogique délibérée, pas une erreur à « corriger » vers la valeur
sourcée sans revérifier l'invariant temps unique vs cumul qu'il protège.

