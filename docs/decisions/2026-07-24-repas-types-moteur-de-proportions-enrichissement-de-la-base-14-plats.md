# 2026-07-24 — Repas-types : moteur de proportions + enrichissement de la base (14 plats)

### Décision

Suite à une revue directe du garde-manger avec Thibault, deux évolutions du mécanisme
« repas-types » (`src/content/repas-types.ts`, partagé cardio + diabète) :

1. **Moteur de proportions.** Jusqu'ici un preset n'était qu'une liste d'aliments à portion
   unique côté diabète, et remettait le camembert cardio à parts égales quel que soit le plat
   réel — aucune pondération. Deux mécanismes ajoutés, sans 2ᵉ modèle de données parallèle :
   - `portions` par aliment (diabète) : l'aliment est répété N fois dans l'assiette
     (`synthPlate`), exactement comme si le patient l'avait ajouté N fois à la main — pèse donc
     N fois dans la somme cg/fibres/protéines/lipides qui alimente `glycemieCurve`.
   - `proportionsCoeur` (cardio) : poids relatifs des 3 catégories-cœur (légumes/féculents/
     protéines), convertis en angles de frontière par une nouvelle fonction pure
     `anglesFromProportions()` — remplace le `setAngles(ANGLES_DEFAUT)` inconditionnel. C'est un
     poids de **catégorie**, pas la somme des `portions` des aliments individuels : un plat où le
     féculent domine visuellement garde un poids féculent élevé même si la garniture légumes
     comporte plusieurs aliments légers.
2. **Enrichissement à 14 plats** (5 existants + 9 nouveaux), couvrant les 5 populations
   majoritaires de la patientèle MSP (française, maghrébine, africaine subsaharienne, orientale/
   pakistanaise, un peu asiatique) : poulet rôti-pommes de terre-haricots verts et salade
   composée (française) ; tajine poulet-olives (maghrébine, en plus du couscous-merguez déjà
   présent) ; riz au gras façon jollof, attiéké-poisson et mafé riz-sauce arachide (Afrique
   subsaharienne, en plus du riz-poisson et poulet-plantain déjà présents) ; dal lentilles-riz
   basmati et curry d'agneau-riz-naan (orientale/pakistanaise, famille jusque-là quasi absente) ;
   riz-poulet-légumes sautés (asiatique générique).
3. **4 nouveaux ingrédients** pour rendre les plats orientaux/pakistanais et la sauce arachide
   représentables : naan (féculent), agneau/bœuf (protéine, viande rouge — absente jusqu'ici du
   garde-manger, qui n'avait que volaille/poisson), ghee/beurre clarifié (lipide saturé),
   pâte d'arachide (lipide, légumineuse). Ajoutés aux deux tables (`diabete/alimentation/data.ts`
   et `cardio/manger/data.ts`) avec caractéristiques complètes, + 4 prompts d'illustration dans
   `design/illustrations/prompts-illustrations-diabete.html` (section `gm-monde`).
4. **Matières grasses de cuisson ajoutées où la préparation réelle en comporte** : `huile-olive`
   ajoutée à couscous-merguez/riz-poisson/poulet-plantain (déjà fait le 2026-07-24, cf. entrée
   précédente) et systématiquement aux nouveaux plats concernés (tajine, riz au gras, riz sauté) ;
   `ghee` pour le curry (cuisson traditionnelle, plus fidèle que l'huile d'olive pour ce registre).
5. **Symétrisation** : « Pâtes blanches » (existait côté diabète depuis 2026-07-10) ajoutée au
   garde-manger cardio, qui ne l'avait jamais eue — écart repéré en vérifiant les deux tables
   avant l'enrichissement.

### Contexte

Question directe de Thibault : les plats géraient-ils des proportions réalistes, et le garde-manger
couvrait-il vraiment la diversité de la patientèle (au-delà de protéine/légume/féculent, incluant
les matières grasses qui pèsent sur le profil glycémique et cardio) ? Vérification du code a
confirmé l'absence totale de pondération (cardio) et de portions relatives (diabète), et un
déséquilibre réel de représentation (aucun plat oriental/pakistanais, matière grasse de cuisson
absente de 3 des 5 plats existants).

### Alternatives envisagées

- Dériver les poids cardio depuis la somme des `portions` par aliment (comme le diabète) plutôt
  qu'un champ `proportionsCoeur` dédié → écarté : le modèle cardio n'a qu'un seul aliment
  représentant par catégorie-cœur (`repFood`), les autres allant en `extras` sans peser sur la
  taille de la part visuelle — dériver depuis les portions aurait ignoré cette contrainte
  structurelle et produit des proportions incohérentes avec ce qui s'affiche réellement.
- Générer des grammages précis par aliment plutôt que des poids relatifs qualitatifs → écarté,
  cohérent avec l'esprit du reste de la table (« ordres de grandeur pédagogiques »).
- Réutiliser des ingrédients existants pour approximer les plats orientaux (ex. riz-basmati seul
  sans ghee/naan/viande rouge) → écarté pour le curry d'agneau : le ghee et le naan changent
  significativement le profil lipidique/glucidique réel, une approximation aurait été trompeuse.

### Raison du choix

Deux mécanismes de pondération séparés (portions par aliment côté diabète, poids de catégorie
côté cardio) plutôt qu'un modèle unique, parce que les deux moteurs consommateurs ont des
contraintes structurelles différentes (somme libre d'aliments vs. un représentant unique par
catégorie-cœur) — forcer un modèle commun aurait complexifié les deux sans bénéfice réel.

### Conséquences

- **`src/content/repas-types.ts`** : nouveau type `RepasTypeAliment { id, portions? }` (remplace
  `aliments: string[]`) + nouveau champ optionnel `proportionsCoeur` sur `RepasType`. 14 plats
  (tous avec `proportionsCoeur`, la plupart avec au moins un `portions` > 1 sur l'ingrédient
  dominant).
- **`AlimentationModule.tsx`** (diabète) : `chargerRepasType()` répète chaque aliment `portions`
  fois (plafond 10 items inchangé).
- **`MangerModule.tsx`** (cardio) : nouvelle fonction pure `anglesFromProportions()` ; `angles`
  du camembert calibrés depuis `repas.proportionsCoeur` au lieu d'un reset systématique.
- **4 nouveaux aliments** dans les deux `data.ts` + `REPERE_PAR_ALIMENT` (cardio) : arachide →
  légumineuses, ghee/viande-rouge → graisses saturées.
- Toutes les valeurs (nutritionnelles + proportions) restent `// à revalider (Thibault)` —
  ordres de grandeur pédagogiques, pas des recommandations chiffrées validées.

### Impact IA

- **`repas-types.ts`** fait désormais foi pour la forme `RepasTypeAliment`/`proportionsCoeur` —
  ne pas revenir à `aliments: string[]` sans mettre à jour les deux consommateurs.
- Si un futur plat est ajouté : vérifier l'id dans les DEUX `data.ts` avant de l'utiliser (comme
  documenté en tête de fichier), choisir des `portions`/`proportionsCoeur` cohérents avec la
  composition réelle du plat plutôt que des valeurs par défaut.
- Les 4 nouveaux ingrédients attendent leur PNG (prompts prêts, section `gm-monde` du fichier de
  prompts) — `IllustrationSlot` retombe sur le placeholder en attendant, aucune régression.

