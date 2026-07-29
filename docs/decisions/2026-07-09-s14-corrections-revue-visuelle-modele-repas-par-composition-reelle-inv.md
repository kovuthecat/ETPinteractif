# 2026-07-09 — S14 : corrections revue visuelle — modèle repas par composition réelle + inversion D9 n°2

### Décision

Suite à la revue visuelle de Thibault sur build local (7 captures d'écran, 7 bugs), deux évolutions
structurantes en plus des correctifs ponctuels (`plans/theme-diabete/S14.md`) :

1. **Lib `glycemieCurve.ts` — modèle repas par composition réelle** (remplace le modèle S2/S5) :
   `paramsFromAssiette` ne dérive plus la courbe d'heuristiques de familles (« aliment-frein »
   comptés) + proximité à une assiette-modèle (½·¼·¼), mais de la **composition approximative
   réelle** de chaque aliment — `AlimentRepas { cg, fibres, proteines, lipides }` (grammes/charge
   réels par portion usuelle, plus l'échelle relative 0-100 d'avant). `Famille` et le paramètre
   `proportions` sortent entièrement de la lib : les familles ne vivent plus que côté modules
   (captions, pastilles, comparaisons UI), la lib ne les connaît plus. L'ordre du féculent devient
   gradué (`Assiette.ordreFeculent?: number`, 0 = en premier → 1 = en dernier) — le booléen
   `ordreFeculentDernier` disparaît sans compatibilité. Le scénario nocturne `'nuit_isolee'`
   (jugé trompeur : une nuit déviante rendue comme trace principale se lisait « la courbe
   plonge », pas « une nuit s'écarte ») est remplacé par `'descend_hypo_matinale'` (descente
   nocturne progressive → hypo au petit matin, le cas d'école du cran de moins sur la lente).
   Le raccord nuit→jour de `sampleJournee` devient continu (la portion jour repart du niveau de
   fin de nuit et revient vers `BASELINE` en ~90 min, au lieu d'un saut brutal à minuit).
2. **Inversion de la décision D9 n°2** (module 6 Suivi, posée en S9) : le cadran de l'année ne se
   pré-peuple plus automatiquement au montage (rythme standard + 7 examens visibles d'emblée) —
   il démarre **vide**, comme dans la maquette d'origine, et l'utilisateur le construit élément
   par élément (« Placer sur le cadran »). `initRevealedPrepeuple` est supprimée.

### Contexte

Thibault a testé le build local et fourni 7 captures d'écran commentées. Deux bugs (composition
défi 1, proportion défi 4) et une demande explicite (« la courbe augmente quand j'augmente les
protéines au détriment des féculents ») ont révélé que le modèle heuristique (comptage de familles
et distance à une assiette-modèle) ne collait pas à l'intuition physiologique attendue dans tous
les cas — la demande explicite du 2026-07-09 a été de refonder le calcul sur la composition réelle.
Le pré-peuplement du cadran (D9 n°2) a été jugé, à l'usage, contraire au geste pédagogique visé
(construire, pas contempler un cadran déjà rempli).

### Alternatives envisagées

- Corriger uniquement les symptômes (B1/B3) en gardant le modèle heuristique par familles → écarté :
  Thibault a explicitement demandé la refonte vers la composition réelle (§0.c du plan), le
  correctif ponctuel n'aurait pas réglé le défaut structurel (courbe insensible aux vraies
  portions).
- Garder `ordreFeculentDernier` en plus du nouveau champ gradué (compatibilité) → écarté par
  consigne du plan (« le booléen disparaît, pas de compat ») : un seul champ, migration complète
  des appelants dans la même session.

### Raison du choix

Aligner la lib sur l'intention pédagogique réelle (« proche de la réalité physiologique, même si
approximatif ») sans multiplier les paramètres ad hoc (proportions, comptage de familles) qui
avaient produit les bugs. Le cadran vide restaure le geste de construction voulu dès la conception
initiale de la maquette.

### Conséquences

- `alimentation/data.ts` : table `FOODS` réécrite avec CG/fibres/protéines/lipides réels par
  portion (26 aliments), seuils `cgTier` recalibrés (10/19 au lieu de 25/65) — quelques pastilles
  bougent par rapport à la maquette d'origine (pita, galette de riz → orange ; couscous → rouge),
  marquées `// à revalider (Thibault)`.
- `alimentation/AlimentationModule.tsx` : défi 1 devient une assiette libre (B1), défi 3 accepte le
  remplacement d'aliments + ordre gradué (B2), défi 4 construit l'assiette avec les portions
  réelles répétées (B3). Seuils `classifyPeak` (défi 2) recalibrés sur le nouveau modèle.
- `insuline/scenarios.ts` : `SituationId` perd `'bruit'`, gagne `'descend'` ; `SUB_SITUATIONS`
  réordonné (monte · descend · haut stable) ; l'enseignement « une seule nuit qui dévie = bruit »
  est reporté dans la description du chip `tendance`.
- `glycemieCurve.test.ts` intégralement réécrit (61 tests, dont les nouveaux invariants §0.c.4 —
  baguette/pain complet, riz blanc/basmati/complet, lentilles, galette de riz, pastèque,
  B3 émergent, assiette-modèle émergente — et §0.d — descente nocturne, raccord nuit→jour continu).

### Impact IA

- **API de `glycemieCurve.ts` à nouveau gelée après S14** : `AlimentRepas { cg, fibres, proteines,
  lipides }`, `Assiette { aliments, ordreFeculent? }`, `ScenarioTrace` sans `'nuit_isolee'` avec
  `'descend_hypo_matinale'`. Toute évolution future doit passer par une nouvelle décision documentée
  ici, pas une modification silencieuse.
- Si Thibault ajuste la table nutritionnelle (`alimentation/data.ts`, marquée `// à revalider`),
  aucune modification de la lib n'est nécessaire — seules les constantes de la table changent.
- Le module 6 (Suivi) ne doit plus jamais pré-peupler le cadran au montage sans une nouvelle
  décision explicite de Thibault (D9 n°2 a déjà été inversée une fois).
