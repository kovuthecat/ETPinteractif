# DECISIONS.md

Journal des décisions techniques et produit.

## Format recommandé

```md
## YYYY-MM-DD — Titre de la décision

### Décision
### Contexte
### Alternatives envisagées
### Raison du choix
### Conséquences
### Impact IA
```

---

## Décisions

## 2026-07-24 — Repas-types : moteur de proportions + enrichissement de la base (14 plats)

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

## 2026-07-24 — Gates du chantier refonte-audit-2026-07 tranchées avec Thibault (2ᵉ passe)

### Décision

Suite à une discussion directe avec Thibault le jour même de la 1ʳᵉ passe du chantier, les 4 gates
restées ouvertes sont tranchées :

1. **G-A8 (mécanisme CV tabac, M6) — validée « OK pour les 5 »**. Les 5 formulations patient
   proposées en S6 (paroi agressée, vasoconstriction/spasme, plaque accélérée, thrombose,
   réversibilité) sont acceptées telles quelles. Conséquence : câblage immédiat de l'objet interactif
   — remplace la bascule 2 états par un curseur 5 étapes sur l'artère héros partagée.
2. **G-Suivi (pré-cochage des mois passés, diabète Suivi) — tranchée « neutre »**. Les mois passés ne
   sont plus pré-cochés « fait » par défaut ; ils repartent à « à programmer », cohérent avec
   « couverture, pas bilan ». Le clic manuel pour cocher un mois reste inchangé.
3. **G-M10-nausées (signe atypique d'infarctus, cardio M10) — tranchée « à retirer »**. La carte
   « nausées isolées, sans autre signe » est retirée (jugée trop peu spécifique, risque de fausses
   alertes). Les nausées associées à d'autres signes (signes classiques) ne sont pas concernées.
4. **G-M7-taille (cohérence « tour de taille », cardio M7 vs M2) — tranchée « acceptable »**. Le
   bénéfice « Poids / tour de taille » reste affiché en M7 (bénéfice de l'activité, contexte différent
   du facteur de risque du cockpit M2 dont il a été retiré) ; aucun changement de code, seule
   l'annotation `// à revalider` est levée.

### Contexte

Ces 4 gates avaient été codées avec un défaut sobre ou laissées en attente lors de la 1ʳᵉ passe du
chantier `refonte-audit-2026-07` (2026-07-24 matin). Thibault a demandé le détail de chaque gate en
conversation, tranché les 4 en une fois, ce qui a permis d'enchaîner immédiatement le code correspondant
dans la même journée (2ᵉ passe, 3 sessions parallèles + 1 correctif direct).

### Alternatives envisagées

- G-A8 : garder la bascule 2 états et se contenter de documenter le mécanisme en texte (2ᵉ niveau au
  survol) → écarté par le choix de Thibault, qui voulait un objet réellement manipulable et pas un texte
  de plus.
- G-Suivi : ajouter un 3ᵉ état intermédiaire (« passé non renseigné » visuellement distinct de « à
  programmer » futur) → écarté pour rester simple ; le statut `'a_programmer'` déjà existant sert aux
  deux cas (mois futurs et mois passés non cochés), sans complexifier le modèle d'état.
- G-M10-nausées : reformuler plutôt que retirer (ex. « nausées associées à un malaise ») → écarté,
  Thibault a tranché pour un retrait net plutôt qu'une nuance qui aurait pu rester ambiguë.

### Raison du choix

Débloquer entièrement le chantier `refonte-audit-2026-07` en une seule journée plutôt que de laisser 4
gates trainer indéfiniment ; les 4 décisions sont courtes et n'entraînent pas de refonte, seulement des
changements ciblés dans des zones disjointes (parallélisables sans risque de conflit).

### Conséquences

- **`src/features/cardio/tabac/TabacModule.tsx`/`.module.css`** réécrits (bascule → curseur 5 étapes,
  réutilise `ArtereCoupe` sans duplication). `docs/cardio/CONTENU_cardio.md` §M6 : statut des 5
  formulations passé de « à revalider » à « validé Thibault 2026-07-24 ».
- **`src/features/diabete/suivi/logic.ts`** : `statusForMonth()` retourne `'a_programmer'` pour
  `month <= currentMonth` (au lieu de `'fait'` pour `month < currentMonth`) — comportement documenté en
  commentaire au-dessus de la fonction.
- **`src/features/cardio/alerte/AlerteModule.tsx`/`.module.css`** : `SIGNES_ATYPIQUES` réduit à 3
  entrées, grille réajustée (`repeat(3, 1fr)` desktop) ; fiche imprimable et
  `docs/cardio/CONTENU_cardio.md` §M10 mis à jour en cohérence.
- **`src/features/cardio/bouger/BougerModule.tsx`** : commentaire `// à revalider (Thibault)` remplacé
  par la trace de la décision actée, aucun changement fonctionnel.
- Toutes les gates du chantier `refonte-audit-2026-07` sont désormais tranchées ; seule S8 reste
  bloquée (dépend des PNG à générer par Thibault, sans rapport avec ces gates).

### Impact IA

- **`docs/cardio/CONTENU_cardio.md` §M6** fait foi : les 5 formulations du mécanisme CV tabac sont
  validées, ne plus les remettre en question sans une nouvelle décision explicite de Thibault.
- **`statusForMonth()`** (diabète Suivi) : si un futur besoin réclame de distinguer visuellement « mois
  passé non fait » de « mois futur », il faudra un nouvel état — ne pas réutiliser `'a_programmer'` à la
  légère pour un cas different sans vérifier l'impact sur le rendu du cadran.
- **`SIGNES_ATYPIQUES`** (cardio Alerte) : 3 entrées désormais la norme — ne pas réintroduire les
  nausées isolées sans nouvelle décision clinique de Thibault.

## 2026-07-24 — Chantier refonte-audit-2026-07 : suites de l'audit pédagogique des 3 thèmes

### Décision

Traiter les constats de l'audit pédagogique bi-agents du 2026-07-23 (`Audit/audit-pedagogique-2026-07.md`
+ `-partie2.md`) en 9 sessions, dont 6 codées dans cette passe (S1-S5, S7), 1 arrêtée sur gate contenu
(S6) et 1 hors vague (S8, bloquée PNG) :

1. **A1 — layout des modules à grand visuel diabète (S1)** : patron « colonne visuel réduite en empilé +
   contrôles visibles dans le premier écran » appliqué à Complications/Suivi/Insuline basale, sans
   composant partagé factorisé (le sur-dimensionnement avait 3 causes différentes par module — pas de
   sur-abstraction pour un motif non identique).
2. **A4 — insuline basale, feedback des décisions (S2)** : refrain de sécurité « ~3 jours / dans le
   doute on ne monte pas » rendu permanent, quel que soit le choix — pas une récompense de bonne
   réponse (posture ETP non évaluative).
3. **A5 — cardio M9, leviers stress + SAOS (S3)** : payoff réactif choisi (pas de dégradation en
   affichage non-cliquable) — le doc contenait assez de matière pour une phrase-conseil sobre par levier.
4. **A6a-g — micro-fixes groupés (S4)** : tous les 7 points reproduits sur le build à jour et corrigés
   (aucun faux positif dans ce lot).
5. **A7 — cardio M3, plaque-pivot (S5)** : enrichi **en place** (gate G-A7, défaut appliqué) — le
   moteur artère/silhouette partagé suffisait, aucun blocage technique justifiant une fusion de module.
6. **A8 — cardio M6, mécanisme CV tabac (S6) — BLOQUÉ gate contenu G-A8** : le doc `CONTENU_cardio.md`
   §M6 ne couvrait que 2 des 5 étapes du mécanisme en registre patient (paroi agressée et
   vasoconstriction/spasme manquaient). Conformément à la consigne « ne pas inventer de mécanisme non
   sourcé », une proposition a été écrite (sourcée OpenEvidence Socle §E.1/E.2) et le code de l'objet
   interactif **n'a pas été fait** — arrêt volontaire avant tout câblage.
7. **A10 — rétro-port barre de risque (S7)** : modèles de cumul cardio (multiplicatif) et diabète
   (moyenne pondérée des feux) jugés **incompatibles** — seule l'**UI** est partagée
   (`src/components/RisqueBarre.tsx`, score qualitatif 0-1, aucun chiffre affiché), chaque thème
   continue de calculer son propre score en interne.

### Contexte

Audit pédagogique critique mené au navigateur in-app sur la prod (2026-07-23), verdict : socle
pédagogique solide, aucun trou conceptuel majeur, problèmes concentrés et majoritairement de forme.
Deux constats de l'audit vérifiés dans le code **avant** planification pour ne pas ouvrir un chantier
sur un faux positif : le « défi Qualité sans courbe » (Alimentation) était un faux positif de layout
(absorbé par A1) ; le pré-cochage des mois passés du Suivi (`statusForMonth`) est une conception
délibérée, pas un bug — capturé comme question produit **G-Suivi**, non codé.

### Alternatives envisagées

- S6 : coder un mécanisme plausible mais non entièrement sourcé pour ne pas bloquer la session →
  écarté, contrevient explicitement à l'invariant « exactitude médicale, signaler plutôt qu'inventer »
  et à la consigne impérative de la fiche S6.
- S7 : partager le calcul de cumul entre cardio et diabète pour une seule source de vérité → écarté,
  les modèles de risque (facteurs, pondérations) diffèrent réellement entre les deux thèmes ; forcer un
  partage aurait introduit un couplage artificiel entre features indépendantes.
- S1 : factoriser un composant de layout partagé dès cette passe → écarté, les 3 causes de
  sur-dimensionnement étaient différentes par module (dimension fixe, plafond CSS, absence de grille) —
  pas de motif identique à abstraire sans sur-ingénierie.

### Raison du choix

Respecter la hiérarchie du plan : les correctifs de forme (S1, S3, S4, S7) s'exécutent sans gate
bloquante ; les refontes à contenu clinique nouveau (S5, S6) passent par une gate explicite avant tout
code d'objet interactif — S5 n'en avait pas besoin (mapping organe→accident déjà validé au G1 initial
du thème cardio), S6 en avait besoin et s'est arrêtée dessus.

### Conséquences

- **Nouveau composant partagé** `src/components/RisqueBarre.tsx` (+ `.module.css`) — générique,
  agnostique du thème (invariant 4), consommé par `CockpitFeux` (cardio, extraction propre depuis le
  code existant) et `RisqueCardioModule` (diabète, nouveau usage).
- **`docs/cardio/CONTENU_cardio.md` §M6 enrichi** d'une proposition de mécanisme CV (5 étapes, sourcée),
  marquée `// à revalider (Thibault)` — **bloque tout câblage de l'objet interactif M6 tant que non
  validée cliniquement**.
- Points `// à revalider (Thibault)` non bloquants : 3 phrases-conseil leviers stress (S3), 4 phrases de
  conséquence + libellé « Agir » de M3 (S5), sort du « tour de taille » M7 (S4, **G-M7-taille**).
- Gates non tranchées, hors périmètre code de ce chantier : **G-Suivi** (pré-cochage mois passés),
  **G-M10-nausées** (arbitrage clinique sensibilité/spécificité).

### Impact IA

- **S6 / M6 tabac** : ne pas coder l'objet interactif du mécanisme CV avant que Thibault ait validé ou
  corrigé les 5 formulations du bloc « PROPOSITION DE RÉ-ENRICHISSEMENT » dans
  `docs/cardio/CONTENU_cardio.md` §M6 — c'est la gate G-A8, toujours ouverte.
- **`RisqueBarre`** : composant générique réutilisable pour tout futur thème ayant besoin d'une barre de
  risque qualitative de synthèse — ne jamais y coder de logique de cumul spécifique à un thème (le score
  0-1 est calculé par l'appelant).
- **G-Suivi/G-M10-nausées/G-M7-taille** : décisions produit/clinique ouvertes, à trancher avec Thibault
  avant tout code futur sur `diabete/suivi` (pré-cochage), `cardio/alerte` (nausées) ou `cardio/bouger`
  (tour de taille).

## 2026-07-23 — Chantier enrichissement-visuel-2026-07 : finition visuelle & garde-manger

### Décision

Trois axes structurants pour la finition visuelle de l'app de consultation, émergents de l'audit
`rapport-audit-consultation-2026-07.md` (2026-07-23) :

1. **Prompts d'illustration ajoutés au HTML** (D1) : 23 nouveaux prompts dans
   `design/illustrations/prompts-illustrations-diabete.html` (6 `vf-*` tabac vrai/faux, 10 légumes
   garde-manger, 7 aliments-situations — thon, merguez, fromage, féta, olives, houmous, pois cassés)
   + 11 prompts Alerte cardio préexistants. Chaque aliment partagé copié dans `diabete/ ET cardio/`.
   **Génération des PNG : chantier Thibault (S6), pilotée par l'audit.**

2. **Enrichissement garde-manger appliqué aux DEUX thèmes** (D2) : rayon « Légumes » passant de
   brocoli+carotte à 12 items (tomate, courgette, aubergine, poivron, épinards, haricots-verts,
   oignon, gombo, potiron, chou) + 7 aliments-situations ; cardio enrichi aussi de 6 féculents
   culturels diabète (manioc, igname, banane-plantain, couscous-complet, dattes, galette-riz) par
   réutilisation PNG — aucun nouveau prompt. **Source partagée** : les nouvelles données = ordres de
   grandeur Ciqual/GI-GL dans `features/diabete/alimentation/data.ts` (`FOODS`) et
   `features/cardio/manger/data.ts` (`ALIMENTS_PLATEAU`), toutes marquées `// à revalider (Thibault)`.
   Invariant **aucun chiffre à l'écran** (paliers qualitatifs seuls) préservé.

3. **Presets « repas-types » : mécanique partagée, effets spécifiques par thème** (D4) : nouveau fichier
   `src/content/repas-types.ts` (source de vérité unique) exportant 5 presets (couscous-merguez,
   riz-poisson thiéboudienne, poulet-plantain, lentilles-œuf, petit-déj méditerranéen). Bouton
   « Charger un repas-type » dans les deux modules (`MangerModule` cardio, `AlimentationModule` diabète).
   Côté **cardio** : mappe vers `repFood` + `extras` + 3 frontières camembert (pré-remplit puis
   modifiable). Côté **diabète** : mappe vers l'assiette + déclenche `paramsFromAssiette`
   (courbe glycémie live, pédagogiquement riche). **Composition/proportions = ordres de grandeur**,
   marquées `// à revalider (Thibault)` — aucun verrouillage post-chargement. Zéro persistance.

4. **Garde-manger cardio passé d'une colonne empilée à des onglets par catégorie** (D2b) : même patron
   que diabète (`AlimentationModule`), 6 onglets (Légumes/Féculents/Protéines/Matières grasses/Fruits/
   Laitiers), une seule catégorie visible à la fois — absorbe naturellement l'enrichissement de 26 → 49
   aliments. Le défaut initial (Légumes) est le rayon enrichi.

5. **Écran de sélection de thème : icônes par thème + grille équilibrée** (D6) : ajout générique du
   champ `Icon: LucideIcon` à `ThemeDef` (moteur agnostique du nom de thème). Icônes implémentées :
   tabac = `CigaretteOff` (lucide), diabète = `Droplet`, cardio = `Heart`. Grille repositionnée à
   3 colonnes (ou 3 cartes alignées selon taille). `ThemeSelector` n'affiche que si ≥ 2 thèmes —
   usage mono-thème inchangé (pas de friction).

6. **Nettoyage du fichier de prompts (hygiène)** (V0-bis) : suppression de 71 prompts obsolètes
   (illustrations déjà générées et présentes dans `public/illustrations/**`), conservation de 23
   prompts existants + ajout de 11 cardio Alerte + 6 tabac vrai/faux. Le fichier HTML redevient
   fonctionnel (structure JS valide, aucun bruit de prompts périmés).

### Contexte

Chantier issu d'un audit visuel complet de l'app de consultation (navigation in-app, 2026-07-23).
L'ossature est déjà professionnelle (palette crème/serif, cartes-modules cohérentes, interactions
vivantes) ; les faiblesses sont localisées : illustrations manquantes (trous visuels), quelques
incohérences de finition, garde-manger sous-doté culturellement. Le plus gros levier « rendu pro »
est de finaliser les illustrations prévues (prompts écrits, génération à faire par Thibault). L'enrichissement
du garde-manger répond à un besoin réel : la population MSP Paris 20e (maghrébine/africaine/antillaise)
n'est pas représentée dans les deux thèmes avant ce chantier.

### Alternatives envisagées

- Attendre la génération Thibault avant de toucher aux data — écarté : les data peuvent référencer les
  aliments avant que leurs PNG existent (fallback `IllustrationSlot` placeholder) ; commencer les data
  et prompts en parallèle accélère sans risque de régression.
- Garde-manger cardio : ajouter une scrollbar sur une seule colonne — écarté : patron onglets
  (diabète) éprouvé, générique, évite le scroll; réutiliser plutôt qu'inventer.
- Presets repas-types : réutiliser directement les aliments déjà dans `FOODS` — partiellement faisable,
  mais la composition réelle (portions, mélange protéines+lipides) suppose de créer une abstraction
  aliment différente de `Food` seul ; nouveau fichier `repas-types.ts` (implicitement) sépare bien
  les deux concepts (aliments comme données, repas comme scénarios pédagogiques).
- Familles cardio (D5) : proposée mais non tranchée (gate **G-familles**). Repli sûr = garder la
  flamme unique, différencier au moins par une teinte ou une forme (décision plus tard si validée).

### Raison du choix

(1) et (2) répondent directement à l'audit : finir les illustrations prévues (zéro nouvelle mécanique,
prompts seulement) + enrichir la représentativité culturelle sans inventer de contenu. (3) et (4)
maximisent la réutilisabilité (une source partagée repas-types, un patron d'UI onglets) et la pédagogie
(la courbe glycémie se met à jour en direct au chargement d'un repas-type diabète). (5) et (6) sont
des finitions de polish (moteur générique, nettoyage hygiène).

### Conséquences

- **Champ `Icon` ajouté à `ThemeDef`** (`features/types.ts` + tous les thèmes dans `registry.ts`) —
  migration entièrement isolée (aucun impact modules métier).
- **Nouveaux fichiers créés** : `src/content/repas-types.ts` (partagé, aucun dépendance thème) ;
  aucune dépendance runtime ajoutée.
- **Data enrichies** : table `FOODS` (diabète, S1), table `ALIMENTS_PLATEAU` (cardio, S1) ; toutes les
  valeurs neuves `// à revalider`. Si Thibault ajuste les chiffres (après validation clinique),
  modification isolée des tables (pas de code logique impactée, sauf `paramsFromAssiette` si les
  paliers de CG changent drastiquement — peu probable).
- **Valeurs nutritionnelles marquées `// à revalider`** (17 aliments + 6 situations diabète, sel/graisses
  cardio, priorisation de brocoli/carotte/lentilles comme pépites pédagogiques) — **point de revue
  clinique incontournable avant clôture du chantier** (gate G-nutrition). Formellement, les ordres de
  grandeur sont viables au MVP (l'app tourne, interactivité fonctionnelle) mais la légitimité clinique
  en dépend.
- **Gates non tranchées** : G-nutrition, G-repas (composition + calibrage courbe), G-familles (approche
  picto). Sessions S5/S6 bloquées en conséquence, à débloquer parallèlement à la génération PNG.

### Impact IA

- Lire D1-D6 ci-dessus si modification ultérieure du garde-manger, choix de thème, ou
  repas-types — l'architecture est documentée explicitement.
- **Fichier `repas-types.ts`** : source unique, aucun duplication d'IDs ou de listes. Ne pas encoder
  de composition de repas ailleurs (les modules ne sont que des consommateurs).
- **Field `Icon`** sur `ThemeDef` : aucun contenu en dur dans les modules (iconographie reste générique).
  Un thème futur ajoute simplement une icône à son entrée `registry.ts`.
- Si Thibault demande un ajustement de plage de CG des aliments ou proportion d'un repas-type,
  modification purement tabulaire (données), pas de logique à revoir (sauf mention explicite).

---

## 2026-06-28 — Cadrage initial du projet ETP interactif (thème : sevrage tabagique)

### Décision

Créer une application web interactive d'éducation thérapeutique, multi-thèmes par conception,
dont le premier contenu est le **sevrage tabagique**. Quatre choix structurants ont été arrêtés :

1. **Contexte d'usage** : en consultation, soignant + patient sur un écran/tablette partagé.
2. **Navigation** : choix libre par centres d'intérêt (carte de modules non-linéaire), pas de questionnaire de profilage imposé.
3. **Données** : aucune persistance — toute interaction est éphémère.
4. **Stack** : Vite + React + TypeScript, local-first, sans backend.

### Contexte

Outil professionnel pour un soignant. Besoin d'un support visuel et interactif (pas un diaporama),
utilisable au cabinet, sur un poste potentiellement partagé.

### Alternatives envisagées

- Navigation : profilage Fagerström + Prochaska auto-adaptatif → écarté (rigidifie, alourdit ; le soignant
  pilote déjà l'entretien). Fagerström/Prochaska pourront exister comme **modules** visuels parmi d'autres.
- Données : sauvegarde locale (localStorage) ou fiche récap → écarté en v1 pour sécurité RGPD maximale
  sur poste partagé. Une **fiche imprimable éphémère** (générée puis non stockée) reste envisageable plus tard.
- Stack : Next.js → écarté (SSR/serveur superflu ici, plus lourd à maintenir).

### Raison du choix

Maximiser simplicité, sécurité des données patient et alignement avec les autres projets de Thibault
(même stack que recettes / FermentLab / cosme-diy).

### Conséquences

- Aucun backend, aucune base : déploiement statique trivial, hors-ligne possible.
- L'architecture doit prévoir un **moteur de modules générique** réutilisable pour de futurs thèmes.
- Le contenu médical devra être sourcé (HAS, Tabac Info Service).

### Impact IA

- Complexité : faible. Coût de maintenance IA : faible (modules isolés).
- Contexte nécessaire : faible si l'organisation feature-first par module est respectée.
- `PROJECT_MAP.md` : à créer/maintenir dès le scaffolding du code.

## 2026-06-28 — Cadrage des 6 premiers modules

### Décision

Cadrage validé de 6 modules pour le thème tabac (détail dans `docs/contenu-modules.md`) :
1. Composantes de l'addiction · 2. Cinétique de la nicotine & seuils · 3. Substituts & titration ·
4. La nicotine n'est pas le toxique · 5. Le piège du soulagement · 6. Gérer le craving (4D).

Décisions de conception transverses :
- **Interaction : manipulation libre** (bacs à sable avec curseurs/boutons, rendu en direct).
- **Graphiques : qualitatif / relatif** (pas de valeurs chiffrées ; mention « schéma illustratif »).
- **Module 1 = carte d'orientation** (conseils courts + renvois, pas de duplication).
- **Public mixte** (ambivalents + engagés) → ton non injonctif, motivationnel optionnel.
- **Substituts : toutes les formes + la vapoteuse** (la vapoteuse apparaît aussi comme scénario dans le module 2).

### Contexte

Affinage du contenu des premiers modules avec Thibault (expert clinique du contenu).

### Alternatives envisagées

- Interaction guidée pas-à-pas → écartée au profit de la manipulation libre (plus marquant en consultation).
- Graphique chiffré (ng/mL, mg) → écarté (risque de fausse précision médicale).
- Module 1 auto-suffisant → écarté (duplication avec les modules dédiés).

### Raison du choix

Maximiser l'impact pédagogique en consultation tout en limitant le risque médical et la duplication.

### Conséquences

- Effort de dev plus élevé sur les modules 2, 3-B et 5 (interactivité libre + courbes).
- Modules 2/3/4/5 fortement liés (renvois) : soigner le moteur de module et la navigation croisée.
- **Données cliniques en attente** (titration patch, vapoteuse, liste 4D, affichage sources) — voir `docs/contenu-modules.md`.

### Impact IA

- Complexité : modérée (les bacs à sable interactifs concentrent la difficulté).
- Contexte : maîtrisé si chaque module reste une feature isolée.
- `PROJECT_MAP.md` : modules à refléter dès le scaffolding.

## 2026-06-28 — Données cliniques + choix techniques d'implémentation

### Décision

- **Titration patch** : on illustre la **méthode**, pas de calcul de dose. ¼ de patch (sécables) tous les 2-3 jours
  tant que l'envie persiste sans surdosage ; pas de dose max (borne = ressenti) ; retour à la dose précédente si
  surdosage (nausées, écœurement, céphalées, palpitations, rêves intenses) ; nuance jour/nuit ; visée d'autonomisation.
- **Vapoteuse** : outil d'aide à l'arrêt à part entière ; dosage qualitatif.
- **Craving** : 4 D (Différer, Distraire, Décontracter, De l'eau) + Tabac Info Service 39 89 ; minuteur « vague ».
- **Sources** : affichage discret (icône → pop-over).
- **Pile technique** : Vite + React + TS ; **CSS Modules** ; **pas de router** (navigation par état) ;
  **pas de lib de graphes** (SVG pur) ; seule dépendance UI ajoutée : `lucide-react` (icônes).

### Contexte

Données fournies par Thibault. Rédaction du plan d'exécution `PLAN_modules-tabac.md` (T1–T11) pour Sonnet/Codex/Haiku.

### Alternatives envisagées

- React Router → écarté (kiosque sans URL, hors-ligne, zéro besoin).
- Lib de graphes (recharts…) → écarté (courbes simples en SVG, garder les dépendances minimales).
- Calculateur de dose → écarté (choix clinique : illustrer la méthode, autonomiser).

### Raison du choix

Simplicité, légèreté, hors-ligne, et fidélité à l'intention pédagogique (méthode > calcul).

### Conséquences

- Un utilitaire de courbe partagé (`src/lib/nicotineCurve.ts`) sert aux Modules 2 et 5.
- Le contrat « App rend ModuleShell, les modules ne rendent que leur contenu » fixe la navigation/sources.
- Contenu non bloquant restant : sources exactes + détail des formes de substituts.

### Impact IA

- Plan découpé en tâches atomiques taguées par modèle → faible coût d'exécution.
- Constantes/signatures figées dans le plan → pas de reconception par les exécutants.

## 2026-06-28 — C4 : récit illustratif du modèle de stress (soulagement)

### Décision

Pour la tâche C4 (`PLAN_corrections-ux.md`), en l'absence d'un récit chiffré fourni par Thibault, Claude a
codé une **proposition plausible** dans `sampleStress()` (`src/lib/nicotineCurve.ts`) :
- non-fumeur : stress basal constant `STRESS_BASAL_NON_FUMEUR = 0.25` (échelle relative 0–1), aucune nicotine.
- fumeur : stress dérivé de la nicotinémie (`STRESS_BASAL_FUMEUR + STRESS_AMPLITUDE_MANQUE * (1 - nicotine)`),
  avec `STRESS_BASAL_FUMEUR = 0.30` (plancher, juste après une cigarette) et `STRESS_AMPLITUDE_MANQUE = 0.35`
  (plafond ≈ 0.65 en l'absence de cigarette récente). La chute de stress est synchronisée exactement avec le
  pic de nicotine (même cinétique que `cigaretteKernel`).

### Contexte

Le PLAN marque C4 comme « proposition + validation Thibault » (pas de blocage) : Claude propose une forme
schématique marquée « illustrative », Thibault valide le récit après coup (cf. arbitrage du 28/06 dans
`PLAN_corrections-ux.md` §Arbitrages).

### Alternatives envisagées

- Attendre le contenu de Thibault avant de coder (comme C10) → écarté, le PLAN autorise explicitement une
  proposition illustrative pour C4.
- Modèle de stress indépendant de la courbe de nicotine (deux fonctions séparées) → écarté au profit d'une
  dérivation directe de `sampleCurve` (une seule source de vérité pour la cinétique, moins de duplication).

### Raison du choix

Débloquer la tâche sans inventer de chiffre clinique : les valeurs sont explicitement relatives/illustratives,
documentées en tête de `nicotineCurve.ts` et listées comme question d'arbitrage dans `VALIDATION.md`.

### Conséquences

- `sampleStress()` est **dérivée** de `sampleCurve()` : un seul kernel cigarette à ajuster si Thibault demande
  une cinétique différente.
- Question ouverte non bloquante : amplitudes (0.25 / 0.30 / 0.35) à valider ou ajuster par Thibault.

### Impact IA

- Si Thibault demande un ajustement, modifier uniquement les 3 constantes `STRESS_*` dans `nicotineCurve.ts`
  (pas de reconception du composant `SoulagementModule.tsx`).

## 2026-06-28 - C7 : recomposition libre de l'affiche nicotine / toxiques

### Décision

Ne pas importer ni reproduire l'affiche « Autopsie d'un meurtrier ». Le module 4 utilise une scène originale
en SVG/CSS inline : cigarette et fumée centrales, quatre familles toxiques rouges et nicotine isolée en vert.
Des hotspots ouvrent des bulles ; deux filtres atténuent le groupe non sélectionné.

### Contexte

Thibault a autorisé une recomposition libre, sous réserve de validation des formulations médicales et sans
réutilisation de l'affiche de La Ligue.

### Alternatives envisagées

- Reproduire l'affiche originale : écarté pour les droits et les formulations potentiellement datées.
- Afficher une longue liste de substances : écarté au profit de familles lisibles à distance.
- Ajouter une image bitmap : écarté pour préserver le fonctionnement local-first et hors-ligne.

### Raison du choix

La séparation rouge/vert transmet le message avant lecture du détail. La couleur reste doublée par des
libellés, pictogrammes et motifs.

### Conséquences

- Aucun nouvel asset ni dépendance runtime.
- Les formulations sont listées dans `VALIDATION.md` pour validation par Thibault.
- Les futures corrections de contenu restent localisées dans `HOTSPOTS`.

### Impact IA

- Complexité faible : état local limité au filtre et au hotspot actif.

## 2026-07-01 — R5 : soulagement en bac à sable temps réel (fin de la bascule d'onglets)

### Décision

Le module Soulagement (`SoulagementModule.tsx`) abandonne la bascule d'onglets « Non-fumeur / Fumeur » au
profit d'un **bac à sable temps réel calqué sur R4** : un balayage continu (façon oscilloscope) tourne dès
l'ouverture ; cliquer « Fumer une cigarette » insère la prise au temps courant et le stress chute
immédiatement, synchronisé au pic de nicotine, puis remonte. Le non-fumeur n'est plus un écran séparé mais un
**repère superposé sur la même courbe** via un bouton unique « Comparer au non-fumeur ».

### Contexte

Arbitrage de Thibault (2026-07-01, `PLAN_corrections-v2.md` R5) : la bascule d'onglets était jugée moins
pédagogique qu'un modèle temps réel montrant, sur un seul graphe, que le creux du fumeur reste toujours
au-dessus du niveau stable du non-fumeur.

### Alternatives envisagées

- Garder deux courbes indépendantes (fumeur vs non-fumeur) calculées séparément → écarté : `sampleStress()`
  dérive déjà les deux du même modèle (`STRESS_BASAL_*`), pas besoin de dupliquer la logique.
- Positionner dynamiquement le repère non-fumeur au ras du creux observé (calcul par render) → écarté : le
  repère est une **constante** (`STRESS_BASAL_NON_FUMEUR`), et l'invariant « toujours sous le creux fumeur »
  est déjà garanti *par construction* (le plancher structurel du stress fumeur = `STRESS_BASAL_FUMEUR`, même
  si la nicotine sature à 1), donc un calcul dynamique aurait été une complexité inutile.

### Raison du choix

Cohérence avec R4 (même mécanique de balayage, même vocabulaire visuel) et invariant pédagogique garanti sans
calcul additionnel : `STRESS_BASAL_FUMEUR (0.30) > STRESS_BASAL_NON_FUMEUR (0.25)` est vérifié pour toute
composition d'événements, y compris la saturation multi-cigarettes (couvert par 2 nouveaux tests Vitest dans
`nicotineCurve.test.ts`, 17 tests au total).

### Conséquences

- `nicotineCurve.ts` n'a **pas changé de formule** : seule sa consommation change (événements accumulés en
  continu au lieu d'une liste fixe de 5 cigarettes pour la démo statique).
- Les amplitudes (0.25 / 0.30 / 0.35, cf. décision C4 ci-dessus) restent des valeurs illustratives **non
  re-validées** dans ce nouveau contexte interactif — question toujours ouverte dans `VALIDATION.md` §R5.

### Impact IA

- Si Thibault ajuste les amplitudes, modifier uniquement les constantes `STRESS_*` dans `nicotineCurve.ts` ;
  aucun changement requis dans `SoulagementModule.tsx` (qui ne fait que consommer `sampleStress`).
- Une évolution médicale modifie le contenu, pas la structure de la scène.

## 2026-07-01 — R9 : module 7 « Explorer ma motivation », focus positif (pas de balance décisionnelle)

### Décision

Ajout d'un 7ᵉ module, **sans balance décisionnelle** (avantages/inconvénients du tabac), au profit de deux
outils centrés sur le positif : (A) échelles 0–10 importance/confiance avec relance non culpabilisante
(« pourquoi pas *n − 1* ? » / « qu'est-ce qui aiderait à passer à *n + 1* ? ») ; (C) un tableau blanc « Mes
raisons » (cartes déplaçables, éditables, création libre). Le drag & drop est implémenté avec des **pointer
events natifs** sur un `<button>` poignée (pas de librairie) : la même poignée gère aussi le déplacement au
**clavier** (flèches directionnelles), ce qui couvre l'accessibilité clavier sans bouton de secours séparé.
Les positions des cartes sont stockées en **pourcentages relatifs** du conteneur (pas en pixels), pour rester
stables au redimensionnement/tablette sans recalcul.

### Contexte

Arbitrage de Thibault (2026-07-01, `PLAN_corrections-v2.md` R9) : la balance décisionnelle classique était
jugée limitante pour ce public. `App.tsx` étant déjà générique (rendu par `MODULES.find`), aucune modification
n'a été nécessaire dans le moteur — seuls `types.ts` et `registry.ts` ont été touchés, conformément à
l'invariant 4 (rien de spécifique au tabac dans le moteur générique).

### Alternatives envisagées

- Positions en pixels absolus recalculées au resize → écarté : plus de code, plus fragile, alors que les
  pourcentages résolvent nativement le problème.
- Boutons de déplacement séparés (↑↓←→) en plus du drag → écarté : la poignée `<button>` gère déjà les deux
  modes (pointer + clavier) sur le même élément, un doublon aurait été une complexité inutile pour rien de
  plus accessible.

### Raison du choix

Minimise la surface de code, respecte l'invariant « zéro dépendance runtime ajoutée » et l'invariant
accessibilité (cibles ≥ 44 px via la règle globale `button`, clavier fonctionnel).

### Conséquences

- Contenu de départ du module (libellés des 2 échelles, 6 cartes seed) = **proposition non sourcée** de
  Claude, marquée comme telle dans `docs/contenu-modules.md` §Module 7 et dans `VALIDATION.md` §R9 — à
  valider/ajuster par Thibault, sans bloquer le reste du module.

### Impact IA

- Si Thibault change la liste de cartes seed ou les libellés d'échelle, modifier uniquement les constantes
  `SEED_CARTES` / les chaînes de labels dans `MotivationModule.tsx` — aucune reconception de la mécanique de
  drag ou des échelles n'est nécessaire.

## 2026-07-08 — Refonte visuelle complète : système de design Claude Design + nouveau modèle de courbes (S1-S10 + S2-S9)

### Décision

Refonte complète de l'UI de l'ETP interactif basée sur la maquette Claude Design (`maquettes/ETP Tabac - Standalone.html`),
exécutée en **deux vagues parallèles** :

**Vague 1 (S1, socle bloquant) :**
1. **Polices** : auto-hébergement de Source Serif 4 (titres) + Work Sans (corps) en `public/fonts/` (`@font-face` dans
   `global.css`, préchargement dans `index.html`) — fin du chargement CDN Google Fonts, fonctionnement garanti hors-ligne.
2. **Tokens CSS** : remplacement complet de la palette hex par tokens `oklch` sémantiques — fonds crème, texte brun éditoriale,
   séries confort/toxique/vigilance/nav, alpha soft (ex. `--zone-confort: oklch(70% 0.05 120)`), rayons `sm/·/lg/pill`,
   ombres brunes 1/2/3. Noms historiques (`--color-accent`, `--color-warn`) conservés pour compatibilité.
3. **Primitives globales** dans `global.css` : `.eyebrow`, `.btn` (4 variantes : primary/ghost/tertiary/danger),
   `.chip`, `.card`, `.panel`, `.callout`, `.alert`, classes d'annotation `.zone-fill--*` / `.zone-label--*` pour
   codification de zones de graphe (confort/toxique/vigilance).

**Vague 2 (S10 + S2-S9 en parallèle, 8 agents) :**
- **S10** : réécriture de `src/lib/nicotineCurve.ts` + tests — nouveau modèle 0–100 / 24 h transcrit du handoff
  (vs. ancien modèle 0–10 / heures arbitraires). Affects Module 2 (Nicotine) et Module 5 (Soulagement).
- **S2-S9** : restyle de tous les modules (accueil, coquille, Addiction, Nicotine, Substituts, Nicotine-toxique,
  Soulagement, Craving) + réécriture Motivation (cadran circulaire + interaction simplifiée). Toutes les zones
  consomment les primitives S1, aucun override local de `tokens.css`/`global.css`.

### Contexte

Maquette Claude Design fournie par Thibault (2026-07-06), validée pour capturer le système de design complet (typo,
couleurs, composants, interactions). Objectif : réaliser fidèlement le design visuel et interactif du handoff, débranchant
l'ancienne palette ad-hoc et l'ergonomie piecemeal des phases antérieures (R1-R9, V1-V8, A1-A12).

### Alternatives envisagées

- Rester sur la palette hex + bootstrap-like : écartée (rupture avec la direction du design Thibault, pas de cohérence
  sémantique, plus coûteux à maintenir).
- Implémenter la refonte par modules (par exemple S2 une semaine, puis S3 la semaine d'après) : écartée au profit de
  l'exécution parallèle vague 2 (accélère le time-to-delivery, zones disjointes = pas de conflits merge).

### Raison du choix

Maximiser la fidélité au design tout en minimisant la refonte incrementale coûteuse. Un socle S1 figé permet à S2-S9
de progresser en parallèle sans débordement de tokens ou de composants. Le nouveau modèle de courbes S10 est nécessaire
pour que S4/S7 implémentent fidèlement le handoff (grille 0–100/24h vs. ancien schéma arbitraire).

### Conséquences

- **Tous les modules** sont redessinés ; aucune dépendance visuelle sur l'ancienne palette.
- `src/lib/nicotineCurve.ts` rebasé sur la grille handoff ; interfaces Modules 2/5 restent stables (mêmes props),
  logique interne transformée. Tests Vitest couvrent les invariants (monotonie, cumul, stress-basal).
- `npm run dev` + `npm run build` et `npm run test` doivent passer après chaque session ; validation visuelle déléguée
  à Thibault (passe de review de la maquette vs. rendu produit).
- Pas d'ajout de dépendances runtime (animation, router, libs de design). Primitives générées manuellement en CSS.

### Impact IA

- Contexts complexe mais bien scopé par design (`docs/DESIGN_REFONTE.md` + `maquettes/handoff/` autorités primaires).
- Zones disjointes → travail parallèle à bas risque de merge conflict.
- Validation gate (`tsc -b`, `vite build`, `vitest run`) automatique ; validation visuelle humaine non bloquante
  pour commit mais signalée dans `VALIDATION.md`.
- Si correction ultérieure : localiser le `.module.css` du module impacté dans `src/features/<slug>/` ou la règle
  dans `global.css` (primitives) / `tokens.css` (variables). Modifications de `nicotineCurve.ts` affectent S4/S7 seulement.

## 2026-07-08 — Introduction du moteur multi-thèmes + scaffold du thème diabète

### Décision

Généraliser le moteur, jusqu'ici implicitement câblé pour le tabac, pour qu'il accueille plusieurs
thèmes ETP, et scaffolder un 2e thème `diabete` (sans contenu) pour valider le moteur de bout en bout :

1. **Déplacement** : les 7 modules tabac + `registry.ts` + `src/lib/nicotineCurve.ts` déménagent sous
   `src/features/tabac/` (via `git mv`, historique préservé). `src/features/registry.ts` devient le
   registre des **thèmes** (`THEMES: ThemeDef[]`), chaque thème import son propre `registry.ts`
   (`tabac/registry.ts`, `diabete/registry.ts`).
2. **Types généralisés** (`src/features/types.ts`) : `ModuleId`/`FamilleId` passent d'unions littérales
   tabac-spécifiques à `string` ; `Hue` (déplacé depuis `ModuleCard.tsx`) rejoint `ModuleDef.hue` ;
   nouveaux types `FamilleDef` et `ThemeDef { id, titre, eyebrow, description, familles, modules,
   enConstruction? }`.
3. **Navigation à 3 niveaux** dans `App.tsx` : `{type:'themes'} | {type:'home', themeId} |
   {type:'module', themeId, moduleId}`. L'écran de sélection de thème (`ThemeSelector`, nouveau
   composant) ne s'affiche que si `THEMES.length > 1` — avec un seul thème, on saute directement à
   l'accueil (zéro friction ajoutée pour l'usage tabac actuel).
4. **`Home.tsx` reçoit `theme: ThemeDef` en prop** au lieu d'importer `MODULES` directement ; les
   tables locales `HUES` et `FAMILLES` (codées en dur avec les ids de modules tabac) sont supprimées —
   remplacées par `m.hue` et `theme.familles`.
5. **Thème `diabete` scaffoldé vide** : `src/features/diabete/registry.ts` exporte `MODULES: []`,
   `THEMES` le référence avec `enConstruction: true`. `ThemeSelector` l'affiche non cliquable avec un
   badge « Bientôt disponible ». Le cadrage clinique (modules, contenu, sources) est explicitement
   hors scope de cette tâche — stub créé dans `docs/contenu-modules-diabete.md`.
6. **`docs/contenu-modules.md` renommé `docs/contenu-modules-tabac.md`** (contenu inchangé) pour
   préparer un fichier d'autorité par thème.

### Contexte

Thibault veut concevoir un module diabète. Le moteur était prêt en théorie (`docs/architecture.md`
anticipait déjà un type `Theme = { id, titre, modules }` dès le cadrage initial du 2026-06-28) mais
pas en pratique : `Home.tsx` avait un header « Programme ETP · Sevrage tabagique » en dur et des
tables (`HUES`, `FAMILLES`) indexées par les ids littéraux des 7 modules tabac — exactement le
couplage que l'invariant projet #4 interdit. Avant de cadrer le contenu diabète, il fallait que ce
couplage disparaisse.

### Alternatives envisagées

- Préfixer les ids de modules par thème (`tabac-addiction`, `diabete-alimentation`) pour garder
  `ModuleId` comme union littérale globale → écarté : la recherche de module est désormais scopée au
  thème courant (`theme.modules.find(...)`), donc l'unicité n'est requise qu'au sein d'un thème ; un
  préfixage aurait été de la complexité sans bénéfice.
- Ajouter directement du contenu diabète dans cette tâche → écarté : le cadrage clinique (comme celui
  fait pour le tabac le 2026-06-28) n'a pas encore eu lieu ; coder des modules sans cadrage validé
  risquerait une erreur médicale. Le scaffold vide prouve le moteur sans inventer de contenu.
- Garder `src/lib/nicotineCurve.ts` à la racine (utilitaire « partagé ») → écarté : c'est un modèle
  pharmacocinétique du tabac (nicotinémie/tension), consommé uniquement par 2 modules tabac ; il n'a
  rien de générique au moteur, donc il suit les modules sous `features/tabac/lib/`.

### Raison du choix

Respecter l'invariant #4 (généricité multi-thèmes) sans reconception lourde : le moteur (`types.ts`,
`registry.ts`, `src/components/`) ne connaît plus aucun nom de thème ni d'id de module en dur. Le
scaffold vide permet de valider l'architecture (build, tests, navigation) avant d'investir dans le
cadrage clinique du diabète.

### Conséquences

- Le contenu tabac est identique visuellement et fonctionnellement — pure réorganisation + généralisation.
- `docs/contenu-modules-diabete.md` (stub) et le backlog `TASKS.md` portent la prochaine étape :
  cadrage du contenu diabète avec Thibault, sur le modèle des décisions 2026-06-28 pour le tabac.
- Toute future addition de thème suit le même schéma : dossier `src/features/<theme>/registry.ts` +
  entrée dans `THEMES` (`src/features/registry.ts`) + fichier `docs/contenu-modules-<theme>.md`.

### Impact IA

- Si Thibault ajoute des modules diabète : uniquement toucher `src/features/diabete/` (nouveaux
  dossiers de module + `registry.ts`) et `docs/contenu-modules-diabete.md` — aucune modification du
  moteur générique nécessaire, sauf besoin réel non anticipé (à documenter ici si ça arrive).
- `PROJECT_MAP.md` mis à jour avec la nouvelle arborescence.

## 2026-07-08 — Cadrage diabète : fichier par module + sources probantes brutes

### Décision

Le stub `docs/contenu-modules-diabete.md` est remplacé par un dossier `docs/diabete/` : un fichier
`00-global.md` (grammaire commune, vue d'ensemble des 8 modules, journal des décisions) + un fichier
par module (`module-1-cest-quoi-le-diabete.md`, `module-2-alimentation.md`,
`module-3-activite-physique.md`, `module-4-risque-cardiovasculaire.md`, et un fichier groupé
`modules-5-8-cadrage.md` pour les 4 modules encore juste cadrés). Les rapports de synthèse
OpenEvidence fournis par Thibault (traitement, suivi, complications, risque CV, activité physique,
alimentation) sont rangés dans `docs/evidence-diabete/` (noms en kebab-case).

### Contexte

Thibault a fourni un premier jet de spécification complète (`SPEC_outil_ETP_diabete.md`, 336 lignes)
couvrant l'intention, la grammaire commune et le détail de 4 des 8 modules diabète, plus 6 rapports de
sources probantes. Le thème diabète compte plus de modules que le tabac (8 vs 7) avec un niveau de
détail par module plus élevé (ex. module Alimentation à lui seul comparable en taille à tout
`contenu-modules-tabac.md`) — un fichier unique grossirait au point de devenir coûteux à charger en
contexte IA à mesure que les 8 modules seraient spécifiés puis codés.

### Alternatives envisagées

- Garder un fichier unique `docs/contenu-modules-diabete.md` comme pour le tabac → écarté : le tabac
  est un contenu **clos** (7 modules déjà codés), alors que le diabète est en cadrage **actif** et va
  continuer à grossir ; le fichier unique serait déjà le plus long du repo avant même d'avoir codé un
  seul module.
- Un fichier par module dès le départ, y compris pour les modules 5-8 encore sommaires → écarté pour
  l'instant : ces 4 modules n'ont que quelques lignes de cadrage chacun (pas encore de détail
  écran-par-écran) ; les regrouper dans `modules-5-8-cadrage.md` évite 4 fichiers quasi vides, à
  éclater plus tard quand chacun sera vraiment spécifié.

### Raison du choix

Le découpage par module est le même principe que le découpage `features/<theme>/<module>/` déjà en
place côté code : quand on travaille sur un module diabète (cadrage, design, câblage), on ne charge
que son fichier + `00-global.md`, jamais l'intégralité du contenu des 8 modules.

### Conséquences

- Toute référence à `docs/contenu-modules-diabete.md` dans le repo pointe maintenant vers
  `docs/diabete/00-global.md` (ou le fichier de module concerné) — mises à jour dans `PROJECT_MAP.md`,
  `CLAUDE.md`, `STATUS.md`, `ROADMAP.md`, `TASKS.md`.
- `registry.ts` du thème diabète reste `MODULES: []` — ce découpage ne change rien au statut « pas
  encore câblé » ; les 4 modules spécifiés (1, 2, 3, 4) sont prêts pour la maquette Claude Design, pas
  encore pour le code.

### Impact IA

- Pattern à réutiliser pour un futur thème volumineux : `docs/<theme>/00-global.md` + un fichier par
  module, plutôt qu'un fichier unique `docs/contenu-modules-<theme>.md` — à trancher au cas par cas
  selon le nombre de modules et leur profondeur attendue (le tabac, plus petit et clos, reste en
  fichier unique).

## 2026-07-08 — Substituts : retrait de l'inhaleur et de la vapoteuse (5 formes)

### Décision

Le Module 3 (substituts & titration) ne propose plus que **5 formes** : patch, gomme, pastille,
comprimé sublingual, spray buccal. **Inhaleur** et **vapoteuse** sont retirés du sélecteur de formes.

### Contexte

Ces deux formes étaient les seules restées sans contenu validé (affichées « Fiche en cours de
rédaction — à voir avec votre soignant », état `enRedaction`). Plutôt que de rédiger leur contenu,
Thibault (autorité clinique) a tranché pour leur retrait lors du dépouillement des questions ouvertes
de `VALIDATION.md` (2026-07-08).

### Alternatives envisagées

- Rédiger le contenu bonnes pratiques / erreurs pour l'inhaleur et la vapoteuse → écarté par Thibault.
- Garder le repli « en rédaction » indéfiniment → écarté : laisse deux formes vides dans le sélecteur.

### Raison du choix

Un module qui ne présente que des formes à contenu validé ; suppression du mécanisme `enRedaction`
devenu inutile (code mort). Décision de l'expert clinique.

### Conséquences

- **Revient sur une décision antérieure du 2026-06-28** (« Substituts : toutes les formes + la
  vapoteuse ») pour le périmètre du Module 3. La vapoteuse **reste** un outil d'aide à l'arrêt à part
  entière et **demeure présente comme geste du bac à sable Nicotine (Module 2)** — seule sa présence
  comme « forme de substitut » du Module 3 est retirée.
- `SubstitutsModule.tsx` : type `FormeId` réduit à 5, `FORMES_DATA` idem, suppression du type
  `enRedaction`, de sa branche de rendu (`panelRedaction`) et des classes CSS associées
  (`formeCardMuted`, `panelRedaction`). `tsc -b` + `vite build` verts.
- `docs/contenu-modules-tabac.md` mis à jour (décision transverse, Module 3, données cliniques,
  « reste à fournir »).

### Impact IA

- `docs/contenu-modules-tabac.md` reste l'autorité : le Module 3 = 5 formes. Ne pas réintroduire
  inhaleur/vapoteuse comme formes sans une nouvelle décision de Thibault.
- **Question laissée ouverte** (signalée à Thibault) : faut-il aussi retirer la vapoteuse du bac à
  sable Nicotine (Module 2) et des renvois du Module 4, ou la démonstration de cinétique la garde-t-elle ?

## 2026-07-09 — Extensions tabac au niveau du brief diabète, en v1 directe sans maquette

### Décision

Suite à l'analyse comparative code tabac ↔ brief diabète (session Fable du 2026-07-09), lancer
5 chantiers d'extension du thème tabac, **sans passage par Claude Design** (v1 directe composée
depuis le design system existant) :

1. **Fiches à emporter imprimables** (4 : carte anti-envie, méthode patch, mes raisons, plan
   d'arrêt) via un composant générique `FicheOverlay` — impression à la volée, zéro persistance.
2. **Nouveau module « Mon plan d'arrêt »** (famille Agir) — le module d'application qui clôt
   l'arc, fiche « frigo » à ROI maximal.
3. **Généralisation des portes de fin de module** (`ModuleFooterNav`, extrait de nicotine-toxique)
   et du **2ᵉ niveau de lecture** (`InfoHover`, extrait des tooltips de zones de nicotine).
4. **Fil rouge** du thème : « C'est la fumée qui rend malade. C'est le manque qui fait fumer.
   Et le manque, ça se traite. » (exergue accueil + clôtures Comprendre + pieds de fiches).
5. **`docs/BRIEF_TABAC.md`** : nouveau référentiel design/pédagogie du thème (rédigé par Fable,
   le code faisant foi pour l'existant) + resynchronisation des docs dépassées.

### Contexte

Le brief diabète (`docs/diabete/BRIEF_DESIGN_diabete.md`) a posé une barre de conception
(fiches à emporter, personnalisation, fil rouge, ponts scénarisés, 2ᵉ niveau au survol) que le
thème tabac — construit avant — n'atteint pas, alors que le code tabac contient déjà des embryons
de ces mécanismes (portes de nicotine-toxique, tooltips de zones de nicotine). Constat clé :
le thème tabac est 100 % démonstration/exploration, sans module d'application ni artefact emporté.

### Alternatives envisagées

- **Maquette Claude Design d'abord** (pipeline Templates habituel pour toute UI nouvelle) —
  écartée pour cette v1 : le module Plan d'arrêt est compositionnel (réutilise chips, quarts de
  patch, 4D, cartes raisons déjà dessinés) et le design system est documenté (`DESIGN_REFONTE.md`).
  Recours possible : repasser par Claude Design si la validation visuelle humaine déçoit.
- Import automatique des raisons (module Motivation → Plan d'arrêt) — écarté : zéro persistance
  inter-modules ; la re-sélection par chips se fait en parlant.

### Raison du choix

Coût d'essai faible (validation visuelle humaine = filet existant), vitesse, et cohérence garantie
par la composition de primitives déjà maquettées.

### Conséquences

- Plans exécutables Sonnet : `plans/extensions-tabac/X1..X7` (vagues : X1 → X2-X5 parallèles → X6 → X7).
- Nouveau référentiel `docs/BRIEF_TABAC.md` ; `contenu-modules-tabac.md` et `STATUS.md` seront
  resynchronisés en X7 (des dérives doc/code y sont recensées).
- Validations Thibault en attente listées dans `BRIEF_TABAC.md §5` (libellé fil rouge, contenus
  2ᵉ niveau + sources, libellés plan d'arrêt) — le 2ᵉ niveau n'est câblé qu'après validation.

### Impact IA

- Pour toute modification du thème tabac : lire `docs/BRIEF_TABAC.md` (design/pédagogie) en plus
  de `contenu-modules-tabac.md` (contenu médical). **Le code reste la source de vérité de
  l'existant** tant que X7 n'a pas resynchronisé les docs.
- `FicheOverlay`, `ModuleFooterNav`, `InfoHover` sont des composants **moteur** (génériques,
  multi-thèmes) : ne jamais y coder de contenu tabac en dur — le thème diabète les réutilisera.

## 2026-07-09 — Câblage du thème diabète (plan theme-diabete, S1-S13)

### Décision

Implémenter les **9 modules du thème diabète** fidèlement à la maquette Claude Design (handoff
2026-07-09) et à la SPEC pédagogique (`docs/diabete/SPEC_outil_ETP_diabete.md`). Cinq décisions
transverses :

1. **Modèle glycémie paramétrique testé** (remplace le score linéaire de la maquette) : lib
   `glycemieCurve.ts` (S2, 50 tests Vitest) modèle temporel physiologiquement plausible,
   temps réel en abscisse (minutes), niveau 0–100 (relative), avec invariants testés
   (repas mixte → pic adouci & retardé ; activité précoce → pic écrêté ; récupération 15 g
   → latence ~5 min ; overshoot à 2ᵉ prise ; TIR vivant avec bande du profil). Chaque module
   (2 Alimentation, 3 Activité, 8 Hypoglycémie, 9 Insuline) **consomme cette lib sans la
   modifier** — une seule identité courbe, rendue par `CourbeGlycemie` (S3).

2. **Silhouette SVG dessinée à la main** (pas d'image) : `Silhouette.tsx` (S3) corps humain
   stylisé, sobre, digne (pas de mannequin médical), avec ancres nommées (cerveau, yeux, cœur,
   cou, reins, nerfs, jambes, pied) + motif vaisseaux discret. États visuels (actif, ouvert,
   verrouillé, allumé, masqué) utilisés par modules 4 Risque cardiovasculaire, 5 Complications,
   7 Traitements, 6 Suivi.

3. **Convention IllustrationSlot + illustrations-diabete** : composant `IllustrationSlot` (S1)
   props `id` → `<img src="/illustrations/diabete/{id}.png">` + placeholder sobre
   (tuile crème, label gris). Convention d'ids slugifiés ASCII (`aliment-pomme`,
   `signe-tremblements`, `resucrage-jus`, etc.) dans `S1.md` ; illustrations générées par
   Claude Design → dépôt en `public/illustrations/diabete/` (zéro blocage si manquantes,
   placeholder affiché).

4. **Familles diabète** (définies dans `registry.ts`) : 3 familles (reprennent le pattern
   tabac Comprendre/Agir/Se motiver) — **Comprendre** (M1 Mécanisme, M4 Risque cardiovasculaire,
   M5 Complications), **Agir au quotidien** (M2 Alimentation, M3 Activité physique),
   **Se soigner** (M6 Suivi, M7 Traitements, M8 Hypoglycémie, M9 Insuline). Hues manuels par
   module (`nav`, `confort`, `toxique`, `vigilance`).

5. **Pas de police Caveat** (« effet manuscrit ») : remplacée par **Source Serif 4 italique**
   (cf. M7 Traitements champ molécule — l'italique serif substitue le manuscrit, déjà dans
   `tokens.css` et `global.css`). Aucune nouvelle police externe (constraint hors-ligne).

### Conséquences

- Lib `glycemieCurve.ts` spécifique au thème diabète, isolée dans `src/features/diabete/lib/`.
- 4 composants transversaux (S3) génériques diabète — s'ajoutent au moteur.
- Illustrations : convention d'ids fixée, génération en parallèle, rendu jamais bloqué.
- Vague 2 (S4-S12) : 9 agents parallèles, chacun seul écrivain de son module.

### Points ouverts (à revalider Thibault)

- Fréquences module 6 (ADA/HAS-SFD), seuils module 4, CG aliments module 2, phrases cliniques module 7.

### Impact IA

- Lire `docs/diabete/SPEC_outil_ETP_diabete.md` (autorité pédagogique) + `BRIEF_DESIGN_diabete.md`.
- `glycemieCurve.ts` : lib testée, jamais modifier sans revalider tests.
- Silhouette/CourbeGlycemie/PlaqueArtere/SignatureEvitable : composants moteur diabète, réutilisables.

## 2026-07-09 — Chantier alimentation-v2 (S1-S4) : déroulé pédagogique, lisibilité défi ② qualité, 2ᵉ niveau de lecture

### Décision

Amélioration du module 2 — Alimentation du thème diabète sur trois axes (validés 2026-07-09) :

1. **Déroulé pédagogique** : consigne remontée en haut de la scène, progression douce (coche par défi « joué » + CTA « Défi suivant → »), courbe fantôme « féculents seuls » au défi ①, duels suggérés (baguette/pain complet, riz blanc/basmati, riz blanc/lentilles, dattes/pastèque) au défi ②.

2. **Lisibilité des réponses du défi ② (Qualité / comparaison)** : identité visuelle par carte (A bleu nav, B prune, à poids égal), étiquettes directes (nom aliment) + marqueur de pic sur les courbes, badges de verdict francs (Pic bas/moyen/haut + ✓/✗ pictogramme), tracé animé au révèle.

3. **2ᵉ niveau de lecture** : données qualitatives d'affichage (portion, sel, qualité des graisses, oméga-3, fibres/protéines dérivées), câblage du composant générique `InfoHover` (survol **+ clic verrouillant**) sur le garde-manger et les cartes du défi ②, mention « vaisseaux » (pont fil rouge vers module Risque cardio). **+ C4** : 3 aliments oméga-3 (sardine, saumon, noix).

### Contexte

Suite à la maquette Claude Design handoff diabète, le module Alimentation (M2) doit servir de démonstrateur des capacités du 2ᵉ niveau de lecture générique (`InfoHover`) — préfiguration du cahier des charges pour les futurs modules diabète.

### Alternatives envisagées

- Consigne en bas de la scène (maquette d'origine) → écartée : déplacement en haut crée un contexte plus explicite du défi actif.
- Palette de couleurs consacrée pour A/B (confort/vigilance) → écartée : prune locale définie dans `CourbeGlycemie.module.css` (pas un token global) ; le désambiguïsement repose sur l'étiquette nominative, pas la couleur seule (double encodage).
- InfoHover générique non câblé sur diabète → écartée : l'intérêt du composant générique est sa réutilisation ; le câblage diabète valide l'architecture multi-thèmes.

### Raison du choix

Maximiser la pédagogie (clarté du défi, progression visible) et la réutilisabilité (moteur `InfoHover` générique, testable sur diabète en v1).

### Conséquences

- **S1** (`data.ts`) : ajout de champs qualitatifs à `Food` (portion, sel, graisses, omega3, atout) ; paliers dérivés pour fibres/protéines (constantes `// à revalider (Thibault)`) ; +3 aliments oméga-3 (sardine, saumon, noix, CG ~nulle).
- **S2** (`InfoHover`, `CourbeGlycemie`) : survol+clic verrouillant, variantes duo (duoA/duoB), marqueur de pic, étiquettes directes, tracé animé (props optionnelles, aucun impact sur les usages existants).
- **S3** (`AlimentationModule`) : caption repositionnée, coche+CTA progression, courbe fantôme ①, chips duels ②, verdicts badges ②, panneau `FoodDetail` au survol/clic des noms.
- **S4** (contexte) : `VALIDATION.md` checklist visuelle + table revalidation ; `DECISIONS.md` décisions transverses ; `PROJECT_MAP.md` ligne `alimentation/` mise à jour ; commits S1/S2/S3/contexte.

### Points ouverts (à revalider Thibault)

- **Valeurs qualitatives sel/graisses/oméga-3** (~27 aliments) : ordres de grandeur Ciqual/GI-GL, marqués `// à revalider`, table en entier dans `VALIDATION.md` S4.
- **Bande « moyen » du défi ②** (pics 47→50) : étroite, inchangée ici ; recalibrage ultérieur si les duels suggérés révèlent des verdicts contre-intuitifs.
- **Illustrations des 3 nouveaux aliments** : placeholders `IllustrationSlot` en attente des PNG (`public/illustrations/diabete/aliment-<id>.png`).

### Impact IA

- `InfoHover` devient un composant clé du moteur multi-thèmes — toute modification du pattern survol+clic doit être testée sur diabète (alimentation) + tabac (futur 2ᵉ niveau si câblé).
- `glycemieCurve.ts` inchangé (S14 gel de l'API) ; aucune dépendance ajoutée (CSS pur).
- Nouvelles constantes `// à revalider` dans `data.ts` et paliers — à valider avant clôture du chantier.

## 2026-07-09 — S14 : corrections revue visuelle — modèle repas par composition réelle + inversion D9 n°2

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

---

## 2026-07-21 — Chantier revue-prod-2026-07 : correctifs d'une revue prod navigateur in-app

### Décision

Six correctifs/décisions issus d'une revue prod complète (Thibault + Opus, `etp-interactif.vercel.app`) :

- **RP1 — parité de montage patient ↔ consultation.** `PatientSituations.tsx` montait l'outil interactif
  actif **après** la liste des cartes, sans overlay ni scroll — régression silencieuse de la promesse du
  chantier `outils-interactifs-2026-07` (le câblage patient existait mais n'était jamais visible, sauf
  pour l'unique outil déjà en overlay `position: fixed`). Adopté : le même schéma *early-return* que
  `BoiteAOutilsModule.tsx` (consultation) — l'outil actif remplace la liste au lieu de se monter en
  dessous. Aucun composant d'outil modifié, seul le point de montage change.
- **RP2 — le plan d'arrêt devient un plan « bornes ».** Sur demande explicite de Thibault, l'UI de
  « Mon plan d'arrêt » est réduite aux sections 1 (stratégie + date) et « Si j'ai un écart » (ex-section
  7) ; les sections substituts/situations/parades/raisons/autour-de-moi disparaissent de l'**écran**
  seulement — le livret imprimé (`livretSections.tsx`, non touché) continue de lire l'état partagé
  (`SelectionState`) en entier, rien n'est perdu côté livret. **Gate G-RP2 tranchée : oui** pour
  l'ajout d'un « + autre » dans Composantes (`AddictionModule.tsx`) — la seule saisie de situation
  personnalisée disparaissait avec la section 3 du plan ; le nouveau champ réutilise le canal existant
  `state.situationsLibres` (déjà lu par le livret, bucket « Autres »), aucun changement de reducer.
  Les parades (section 4) restent retirées sans remplacement (aucun module amont ne les alimente, le
  livret imprime déjà les 4D fixes) — statu quo assumé.
- **RP3 — le QR du livret ne doit pas sur-promettre.** Le libellé du QR (« retrouvez mes substituts et
  mes parades ») promettait une reprise personnalisée inexistante (zéro persistance + QR statique vers
  l'app patient générique). **Gate G-RP3 tranchée : (a) reformulation** (« Retrouvez l'application et
  ses outils chez vous »), pas de génération dynamique du QR. Correctif posé dans le composant partagé
  `src/components/QRBlock.tsx` (pas dans `livretSections.tsx` comme supposé initialement — c'est la
  seule source de vérité du texte, réutilisée aussi par les fiches individuelles). Les champs « + autre »
  restants valident désormais l'entrée au blur en plus d'Entrée, pour ne pas perdre une saisie tapée
  juste avant d'imprimer.
- **RP4 — vérifier avant de corriger.** Les 5 points d'ergonomie consultation relevés (débordement
  Composantes, cadran de motivation trop sensible, libellé « Glissez » d'Alimentation, gate « Voir
  l'effet » de Traitements par le nom de molécule, en-têtes à onglets multiples) ont tous été reproduits
  sur le code à jour (aucun déjà corrigé par un chantier antérieur) puis corrigés ciblés, sans refonte.
- **RP6 — cohérence & finitions tabac.** **Gate G-RP6 tranchée : (a)** la silhouette de « Ce que l'arrêt
  répare » porte désormais le surlignage d'organe (réutilise tel quel le moteur de halo déjà partagé avec
  le diabète, `SilhouetteCorps.tsx` — pas de duplication, juste l'ajout de l'allumage automatique au
  changement de repère). **Gate G-RP6 tranchée : (b)** le quiz « Vrai ou faux ? » reste volontairement
  **non-évaluatif** (aucun retour juste/faux à l'utilisateur) — posture ETP sans jugement assumée,
  aucune modification de code.

### Contexte

Revue prod menée par Thibault + Opus au navigateur in-app sur le déployé, reconstruite dans
`plans/revue-prod-2026-07/index.md`. Exécutée en vague parallèle (S1/S2/S4/S5 concurrentes sur zones
disjointes, S3 après S2 pour partage de `PlanArretModule.tsx`) + consolidation S6.

### Alternatives envisagées

- RP1 : encapsuler l'outil actif dans le conteneur existant sans early-return complet (fallback prévu si
  la barre de retour posait problème) → non nécessaire, l'early-return direct a suffi sans régression.
- RP2 : créer une source amont dédiée aux parades pour permettre leur personnalisation → écarté, hors
  périmètre de ce chantier (nécessiterait un nouveau module ou une extension d'un module existant).
- RP3 : (b) encoder l'état (substituts/situations/raisons) dans un QR généré dynamiquement → écarté par
  défaut (nécessiterait une dépendance runtime + une reprise d'état côté app patient), reste une option
  future si Thibault la demande explicitement.

### Raison du choix

Corriger une régression fonctionnelle bloquante (RP1) sans reconception ; simplifier l'écran du plan
d'arrêt sans perte de contenu au livret (RP2) ; ne pas sur-promettre au patient (RP3) ; ne corriger que
les bugs d'ergonomie réellement présents pour ne pas défaire un correctif déjà en place (RP4) ; aligner
la cohérence visuelle entre thèmes sans dupliquer de mécanisme (RP6a) tout en assumant un choix
pédagogique déjà fait (RP6c).

### Conséquences

- `PlanArretModule.tsx` et `AddictionModule.tsx` ont chacun reçu des contributions de plusieurs sessions
  du même chantier (S2+S3 et S2+S3+S4 respectivement) — commits groupés par fichier en consolidation,
  messages composés en conséquence (cf. `git log`, 2026-07-21).
- Aucune dépendance runtime ajoutée. Gate finale : `npx tsc --noEmit` ✓ · `npm run build` ✓ (2 entrées)
  · `npm test` ✓ 106/106.
- Validation visuelle humaine entièrement à faire (cf. `VALIDATION.md`).

### Impact IA

- RP1 : `PatientSituations.tsx` est désormais la référence patient du schéma early-return ; toute
  extension future des outils interactifs doit vérifier la parité patient ↔ consultation dès la
  conception, pas après coup (c'est exactement l'angle mort qui a produit RP1).
- RP2 : si un futur chantier personnalise les parades (section 4), il faudra d'abord créer une source
  amont (aucune n'existe aujourd'hui) avant d'envisager de les remettre dans l'UI du plan.
- RP3 : le libellé du QR vit dans `QRBlock.tsx`, pas dans chaque appelant — toute future évolution du
  texte QR (y compris un passage à l'option (b) encodée) se fait à un seul endroit.
- RP6a : le halo de silhouette est un mécanisme déjà générique (`SilhouetteCorps.tsx`) ; un futur thème
  qui a besoin d'un surlignage similaire n'a rien à extraire, juste à consommer la même prop.

---

## 2026-07-10 — Chantier approfondissement-tabac (S1-S6) : 5 décisions structurantes

### Décision ① — Promotion SilhouetteCorps générique, wrapper diabète iso-API (S2)

**Décision**

Promouvoir le composant `src/features/diabete/components/Silhouette.tsx` en composant générique
`src/components/SilhouetteCorps.tsx` (API générique, zones et états en données) ; réécrire le
diabète en wrapper fin qui préserve son API entièrement inchangée.

**Contexte**

Le module 9 tabac « Ce que l'arrêt répare » réutilise une silhouette (corps humain + zones cliquables)
avec des zones différentes (7 zones tabac vs ~10 diabète). La silhouette diabète était jusqu'à présent
spécifique au diabète.

**Raison du choix**

Conformité à l'invariant multi-thèmes. Factoriser par copie générique plutôt que par héritage.

**Conséquences**

- `SilhouetteCorps` reçoit `zones: SilhouetteZone[]` (id, label, x, y, r, etat) ; `SILHOUETTE_VIEWBOX`
  reste partagé.
- `src/features/diabete/components/Silhouette.tsx` mappe ses zones + `SILHOUETTE_ANCHORS` vers le
  générique et ré-exporte son API strictement inchangée.
- 8 imports diabète (modules : complications, risque-cardio, suivi, traitements) continuent sans
  modification.

### Décision ② — Duplication assumée d'IllustrationSlot par thème (S1)

**Décision**

Dupliquer `src/features/tabac/components/IllustrationSlot.tsx` depuis le modèle diabète ; ne pas
généraliser.

**Contexte**

Chaque thème a besoin de son propre placeholder d'illustration (chemin différent). La tentation
générale existe mais toucherait le thème diabète dans le processus.

**Raison du choix**

Simplicité et respect du contrôle de parallélisme des sessions. La duplication (~50 lignes) est
acceptable et sans regret futur.

### Décision ③ — Modèle nicotine réaliste, API gelée, invariants testés (S3)

**Décision**

Refondre `nicotineCurve.ts` pour refléter les ordres de grandeur pharmacologiques réels (demi-vie
~2 h, pic cigarette <10 min, patch 2–4 h, saturation/tolérance, tension du manque liée à la
nicotinémie), tout en gelant l'API. Aucun consommateur n'a à changer. La qualité du modèle est
garantie par 37 invariants testés Vitest.

**Contexte**

Les modules 2 & 5 contiennent des messages pédagogiques fondamentaux. L'ancien modèle était
pédagogiquement juste mais pharmacocinétiquement approximatif. Les consommateurs dépendent d'une
API stable.

**Raison du choix**

Maximiser la plausibilité pharmacologique sans casser le code. Certifier le modèle par des tests.

**Conséquences**

- Exports publics inchangés : `TIME_MAX`, `LEVEL_MAX`, `BASELINE`, `ZONE_THRESHOLD_*`, `TENSION_*`,
  `NicotineEventType`, `sampleLevel`, `classifyZone`, `tensionLevelAt`, `toSvgPath`.
- Exports supplémentaires (constantes + fonctions pures pour tests) : `T_HALF`, `K_SAT`,
  `N_APAISEMENT`, `TENSION_EXPONENT`, `cigaretteContributionRaw`, `substitutContributionRaw`,
  `patchContributionRaw`, `tensionFromNiveau` — documentés, non utilisés en dehors des tests.
- 37 invariants Vitest couvrent : baseline, clamp, monotonie, cumulativité, élimination, pics
  temps, accumulation, saturation, tension, cohérence, scénario titration.

### Décision ④ — Cartes Vrai/faux sensibles, livrées actives, à revalider (S6)

**Décision**

Livrer les 15 cartes **toutes actives** (`actif: true`), y compris les 3 cartes sensibles (n°4
« Quelques cigarettes », n°14 « Vapoteuse », n°15 « Réduire »). Ces 3 cartes portent un commentaire
`// à revalider (Thibault)` et sont destinées à une revue clinique en conditions réelles d'usage.

**Contexte**

Le module 10 est une ressource de discussion (non un quiz). Les cartes 14-15 portent sur des sujets
où les données / recommandations HAS/OMS évoluent. Mettre en face du patient en vraie consultation
est pédagogiquement utile.

**Raison du choix**

Maximiser l'utilité clinique. Retrait simple : changement d'un seul champ `actif: false`.

**Conséquences**

- Cartes 4, 14, 15 apparaissent et sont navigables.
- Feedback de Thibault après usage peut être : validation, ajustement mineur, ou retrait.
- Le commentaire `// à revalider` sur les cartes 4 et 14 signale que leurs sources (Santé publique
  France) doivent être vérifiées régulièrement (différentes de HAS).

### Décision ⑤ — Correctif de cible tactile ≥44 px appliqué au module idées-recues (S6)

**Décision**

Les points de navigation du module 10 affichent visuellement en 20 px (discrétion) mais imposent une
cible tactile **réelle** ≥44 px (conformité invariant CLAUDE.md) via une zone invisible `:before` en
`inset: -12px`. Le correctif a été appliqué en **post-session par l'orchestrateur** avant S7.

**Contexte**

CLAUDE.md prescrit « cibles ≥44 px ». Les points de navigation étaient initialement au-dessus de ce
seuil. Correction requise pour l'accessibilité tactile sur tablette.

**Raison du choix**

Conformité à l'invariant sans compromettre l'esthétique du module.

**Conséquences**

- Aucune autre modification du module requise.
- Le pattern (cible invisible > affichage) devient réutilisable pour d'autres modules si besoin.
- `VALIDATION.md` doit noter : « cibles du module 10 testées ≥44 px ».

---

## 2026-07-10 — Chantier `boite-a-outils` (BO1-BO9) : fusion Craving → Stratégies & outils + 5 décisions

### Décision ① — Fusion Craving → Boîte à outils, module renommé « Stratégies & outils »

**Décision**

Le module `craving` disparaît du registre tabac ; `boite-a-outils` (« Stratégies & outils ») prend sa
place exacte (famille `agir`, hue `vigilance`). L'outil vague/4D est **déplacé** (pas réécrit) dans
`boite-a-outils/VagueCraving.tsx` — mécanique et fiche « Ma carte anti-envie » inchangées — et devient
un outil parmi 14, filtrables par situation. `src/features/tabac/craving/**` est supprimé (BO2). Tous
les renvois `'craving'` du thème (portes de fin de module, Vrai/faux) sont retargetés vers
`'boite-a-outils'`.

**Contexte**

Rapport OpenEvidence « stratégies comportementales du sevrage » (`docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`) : la vague/4D n'est qu'une des nombreuses techniques comportementales
validées (contrôle du stimulus, plans si-alors, activité physique brève, respiration, plan de secours
après un écart…). Élargir le module unique en une boîte à outils filtrable par situation, plutôt que
d'ajouter des modules séparés.

**Raison du choix**

Regrouper les techniques comportementales en un seul lieu filtrable évite la prolifération de modules
et permet un couplage direct avec le repérage de situations du Module 1 (Composantes).

**Conséquences**

- `docs/contenu-modules-tabac.md` Module 6 renommé et réécrit (table des 14 outils + détail).
- Fiche « Ma boîte à outils » (nouvelle, BO2) s'ajoute aux 4 fiches X1-X5 existantes (5 au total).
- `src/features/registry.ts` (registre générique multi-thèmes) conserve une occurrence textuelle du mot
  « craving » dans sa description libre du thème tabac — signalée par S1, **hors périmètre BO1 et BO9**
  (ni l'un ni l'autre n'a ce fichier dans sa zone « Modifier ») : reportée ci-dessous comme point ouvert.

### Décision ② — Contexte de navigation générique (`unknown`) dans le moteur

**Décision**

`ModuleProps` gagne `{ onNavigate: (id, context?: unknown) => void; context?: unknown }` ; `App.tsx`
stocke ce contexte dans l'entrée d'historique et le restitue au module au rendu. Le moteur ne connaît
**jamais** la forme du contexte (`unknown` strict, aucun type « situations » dans `types.ts`/`App.tsx`) ;
chaque thème valide lui-même la forme reçue (ex. `parseSelectionSituations` côté tabac).

**Contexte**

Nécessaire pour transmettre la sélection de situations du Module 1 (Composantes) vers le Module 6
(Stratégies & outils) sans coupler le moteur générique à un thème.

**Raison du choix**

Respecte l'invariant multi-thèmes (#4 de CLAUDE.md) : un mécanisme de contexte de navigation
réutilisable par tout thème futur, sans dette de conception spécifique au tabac.

**Conséquences**

- `navigateToModule` accepte et propage `context` ; le retour arrière restaure la vue (id + contexte)
  mais **pas** le state interne du module appelé (ex. `AddictionModule` : la sélection de situations
  n'est pas restaurée après un retour arrière — comportement accepté et documenté, cf. S3).
- Réutilisable par le thème diabète ou tout futur thème sans modification du moteur.

### Décision ③ — Situations partagées `situations.ts`, colonne vertébrale Addiction ↔ Stratégies & outils

**Décision**

La liste canonique des situations du thème tabac (3 piliers, 20 situations, ids stables) vit dans
`src/features/tabac/situations.ts`, consommée par `addiction/AddictionModule.tsx` (sélection radiale)
et `boite-a-outils/BoiteAOutilsModule.tsx` (filtre + badges). Le module Composantes (Addiction) perd ses
anciens champs `exemples`/`outils` et son panneau latéral de navigation directe.

**Contexte**

Éviter la duplication de libellés entre le Module 1 (qui servait déjà de carte d'orientation avec des
`exemples` par pilier) et le nouveau Module 6 filtrable par situation.

**Raison du choix**

Une seule source de vérité pour les situations, partagée par les deux seuls modules qui en ont besoin
— pas une promotion au moteur générique (les situations sont spécifiques au thème tabac).

**Conséquences**

- `AddictionModule.tsx` devient une page de repérage pur (sélection radiale, sans description ni
  solution à l'écran) ; toute narration pédagogique reste portée par le soignant.
- Ajouter/retirer une situation ne touche qu'un seul fichier (`situations.ts`), consommé par les deux
  modules sans duplication de libellés.

### Décision ④ — Niveaux de preuve à l'écran limités à 2 mentions qualitatives

**Décision**

Aucun chiffre brut d'étude (OR, SMD, RR, IC) n'est jamais affiché côté patient. Le module Stratégies &
outils n'expose que 2 registres qualitatifs par outil : « Efficacité démontrée dans les études » /
« Recommandé par les experts du sevrage ». Les chiffres du rapport OpenEvidence (si-alors OR 1,70 ;
exercice aigu SMD −1,64 ; counseling infirmier RR 1,29 ; recyclage post-rechute OR 3,5 ; paradoxe
tabac-stress SMD −0,37/−0,27 ; etc.) ne vivent **que** dans `docs/contenu-modules-tabac.md` (Module 6)
et dans le rapport source `docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`.

**Contexte**

Cohérent avec l'invariant déjà en vigueur pour les autres modules (aucune unité/valeur chiffrée à
l'écran, cf. décision transverse initiale du 2026-06-28) — étendu explicitement aux niveaux de preuve
scientifique, qui n'ont pas leur place dans un entretien de consultation.

**Raison du choix**

Un patient n'a pas besoin (et ne doit pas être exposé à) un intervalle de confiance pour être convaincu
qu'une technique fonctionne ; la mention qualitative suffit à la crédibilité pédagogique du soignant.

**Conséquences**

- `Preuve` (type dans `boite-a-outils/data.ts`) est une union à 2 valeurs (`demontree` / `experts`), pas
  un champ numérique.
- Toute évolution du rapport OE se répercute uniquement dans la documentation, jamais dans le code
  écran.

### Décision ⑤ — Vapoteuse réintégrée comme outil de réduction des risques (à revalider)

**Décision**

La vapoteuse redevient une **6ᵉ forme** du module Substituts (`FormeId`), avec un traitement visuel
distinct (badge « Réduction des risques », encart de statut « pas un médicament ») — revenant
partiellement sur la décision du 2026-07-08 qui l'avait retirée avec l'inhaleur. Elle reste absente du
bac à sable Nicotine (Module 2) et des formes ponctuelles (`FORMES_PONCTUELLES`) de la titration.
Contenu rédigé par Fable d'après HAS/HCSP + rapport OE, marqué `// à revalider (Thibault)`.

**Contexte**

Le rapport OpenEvidence et 3 nouvelles cartes Vrai/faux (BO4) documentent la vapoteuse comme outil de
réduction des risques reconnu (HCSP), distinct des substituts validés — cohérent avec la carte
`vf-vapoteuse` déjà existante. La garder hors du Module 3 devenait incohérent avec ce contenu.

**Raison du choix**

Traiter la vapoteuse avec la même rigueur que les 5 autres formes (bonnes pratiques/erreurs) tout en la
distinguant clairement d'un médicament, pour ne pas induire en erreur sur son statut.

**Conséquences**

- `SubstitutsModule.tsx` : 6 formes, badge et encart conditionnés à la sélection `vapoteuse`.
- `docs/contenu-modules-tabac.md` Module 3 mis à jour ; note « à revalider (Thibault) » conservée
  jusqu'à validation clinique.
- Chips substituts du Module 8 (Plan d'arrêt) : « Vapoteuse » ajoutée en cohérence (BO6).

### Décision ⑥ — Filtre « toniques uniquement » côté diabète : ne touche jamais la jauge

**Décision**

Le module diabète Activité physique gagne un interrupteur `toniquesUniquement` (défaut `false`) qui
filtre la **réserve** d'activités affichées (masque les activités d'intensité légère) sans jamais
retirer une activité déjà placée dans la jauge par le patient. Le calcul de la jauge (total, rayons)
reste strictement inchangé.

**Contexte**

Permettre au soignant d'adapter le discours au public (ne montrer que les activités modérées+ à un
public pour qui la marche légère n'est pas un levier suffisant) sans jamais effacer un choix déjà fait
par le patient — invariant "on ne retire jamais un choix du patient".

**Raison du choix**

Séparer strictement la vue « réserve filtrée » de la vue « jauge/total » évite tout risque de
resynchronisation incohérente entre les deux, et respecte la mécanique existante du module.

**Conséquences**

- `ActiviteModule.tsx` : nouveau mémo `reserveView` (filtré) distinct de `activitiesView` (source de
  vérité de la jauge, inchangé).
- `data.ts` du module diabète non modifié (aucune nouvelle activité/catégorie ajoutée).

### Points ouverts (à revalider Thibault)

- **Vapoteuse dans les substituts** (BO5) : technique d'utilisation rédigée par Fable à partir des
  positions HAS/HCSP et du rapport OE — à revalider avant usage en consultation.
- **Nouvelles cartes Vrai/faux** (BO4) : sources internationales (NEJM, Cochrane 2025, ACC, JAMA) en
  attendant un équivalent HAS/SPF — 11 cartes sur 21 marquées `// à revalider (Thibault)`.
- **Formulations patient des 14 outils** (BO2) : adaptées du rapport OE — ton et exactitude à juger à
  l'usage en consultation.
- **Occurrences résiduelles du mot « craving »**, hors périmètre de tout `S<k>.md` de ce chantier (donc
  non corrigées ici, signalées pour une éventuelle session future) :
  - `src/features/registry.ts` (registre générique multi-thèmes) — description libre du thème tabac
    (« … gérer le craving et la motivation. »), signalée par S1 dès BO1.
  - `src/features/tabac/nicotine/NicotineModule.tsx` — libellé texte « Craving » dans une liste de
    signes de manque (pas un id de navigation).
  - `src/features/tabac/plan-arret/PlanArretModule.tsx` — commentaire de code référençant l'ancien
    chemin `features/tabac/craving/CravingModule.tsx` (supprimé), signalé par S2 dès BO2.
  - Occurrences légitimes (non résiduelles, à conserver) : `situations.ts` (id `craving` de la
    situation « Envie irrépressible »), `boite-a-outils/data.ts` (mêmes ids de situation),
    `boite-a-outils/VagueCraving.tsx` (nom du composant/fichier, choix délibéré de BO2 pour rappeler
    l'origine du code déplacé), et les mentions physiologiques génériques dans le Module 2/5
    (`docs/contenu-modules-tabac.md`, antérieures à ce chantier).

**Décision**

Les points de navigation du module 10 affichent visuellement en 20 px (discrétion) mais imposent une
cible tactile **réelle** ≥44 px (conformité invariant CLAUDE.md) via une zone invisible `:before` en
`inset: -12px`. Le correctif a été appliqué en **post-session par l'orchestrateur** avant S7.

**Contexte**

CLAUDE.md prescrit « cibles ≥44 px ». Les points de navigation étaient initialement au-dessus de ce
seuil. Correction requise pour l'accessibilité tactile sur tablette.

**Raison du choix**

Conformité à l'invariant sans compromettre l'esthétique du module.

**Conséquences**

- Aucune autre modification du module requise.
- Le pattern (cible invisible > affichage) devient réutilisable pour d'autres modules si besoin.
- `VALIDATION.md` doit noter : « cibles du module 10 testées ≥44 px ».
---

## 2026-07-10 — Illustrations diabète S1 : pipeline d'assets + silhouette `bodyImage`/hotspot

### Décision

1. **Pipeline `design/illustrations/build_assets.py`** (Pillow + numpy, outil local, hors
   `package.json`) : `build_opaque` (fonds décoratifs) et `build_transparent` (overlays) partagent un
   ré-encodage Pillow (élimine implicitement les chunks C2PA `caBX`), un flood-fill de transparence
   depuis les 8 points de bord (seuil 42, préserve l'intérieur clair fermé — cellules/organes), puis
   une **palette adaptative 256 couleurs** : RGB complet pour les fonds opaques, **RGB quantifié +
   canal alpha préservé en pleine résolution** pour les overlays (l'indexation PNG ne supporte pas un
   alpha en dégradé, nécessaire pour des bords de détourage nets). Les illustrations sources étant en
   aplats (peu de couleurs), la perte est visuellement nulle (vérifiée à l'œil sur chaque sortie) pour
   un gain de 60-85 % de poids (silhouette : 193 Ko -> 26 Ko).
2. **`SilhouetteCorps.tsx`** (générique) : nouvelle prop `bodyImage?: string`. Si fournie, le
   conteneur passe en carré (`aspect-ratio: 1/1`), un `<img>` remplace le corps SVG codé, et les
   zones basculent en **mode hotspot** (bouton transparent, halo radial doux — `--color-nav-soft` au
   survol/focus, `--color-confort-soft` persistant si `ouvert`/`allume`, rien si `verrouille` —
   **aucun cercle ni icône permanents**, contrairement au mode pastille). Sans `bodyImage`, le rendu
   (SVG codé + pastilles pleines + icônes Lock/CheckCircle2/ShieldCheck) reste **strictement
   inchangé** — non-régression tabac garantie par construction (branche de code distincte).
3. **Wrapper diabète (`Silhouette.tsx`)** : passe `bodyImage` vers `silhouette.png` et recalibre
   `SILHOUETTE_ANCHORS` en **pourcentages de l'image carrée** (repère différent du pixel
   `SILHOUETTE_VIEWBOX` 340×760, propre au corps SVG codé tabac), valeurs de
   `plans/illustrations-diabete/index.md` §7 — le nerf est positionné sur la main (validé au
   prototypage, pas sur le flanc comme l'ancien repère pixel le suggérait).
4. **`RisqueCardioModule.tsx`** (M4) : son overlay de plaque existant (pastille codée `PlaqueArtere`
   posée près de chaque organe) calculait sa position en divisant les anciennes ancres pixel par
   `SILHOUETTE_VIEWBOX` — recalé pour lire directement les nouvelles ancres en %. Seul le calcul de
   position est touché ; le recâblage complet de cet overlay en illustration (plaque en image, cf.
   index §3) reste S3.

### Contexte

Suite du chantier `plans/illustrations-diabete/` : après analyse de ~70 images générées et une série
de prototypes cliquables validés visuellement par Thibault (silhouette + hotspots sans cercle,
plaque en overlay, animation M1 à 4 modes — cf. index §6), le virage « illustration + overlay
interactif » remplace la vectorisation initialement prévue. S1 industrialise le pipeline et donne à
la silhouette partagée sa capacité `bodyImage`/hotspot, **sans encore recâbler** les modules
consommateurs M4/M5/M7 (overlays fins, panneaux détail — S2/S3/S5).

### Alternatives envisagées

- Vectorisation SVG des illustrations → écartée (déjà tranché avant S1, cf. index §1 : testé, 2,1 Mo
  pour la silhouette seule, sans zones exploitables, inutile aux tailles d'affichage réelles).
- Garder les ancres diabète en repère pixel `SILHOUETTE_VIEWBOX` et les convertir à la volée dans le
  composant générique → écarté : le conteneur `bodyImage` est carré (1:1) alors que
  `SILHOUETTE_VIEWBOX` reflète les proportions du corps codé tabac (340×760) ; exprimer les ancres
  directement en % est la représentation la plus simple, sans changer l'API des modules consommateurs
  (toujours des `ZoneId`, jamais des coordonnées).
- Quantifier aussi le canal alpha des overlays (palette RGBA indexée) → écarté : casserait les bords
  anti-aliasés du flood-fill (contour visiblement crénelé) ; seul le RGB est quantifié, l'alpha reste
  en pleine résolution.

### Raison du choix

Minimiser le poids des assets sans dépendance runtime nouvelle (Pillow/numpy = outillage local) ni
perte visuelle perceptible, tout en gardant `SilhouetteCorps` strictement rétro-compatible tabac —
la prop `bodyImage` reste neutre (aucun nom de thème dans `src/components/`), conformément à
l'invariant multi-thèmes.

### Conséquences

- `public/illustrations/diabete/` : 7 PNG committés (silhouette 26 Ko · organe-yeux 39 Ko ·
  organe-reins 38 Ko · organe-nerfs 62 Ko · pied-auto-examen 50 Ko · plaque 36 Ko · artere-saine
  73 Ko) — tous sous ou proches de la cible ~90 Ko/asset (index §2).
- `SILHOUETTE_ANCHORS` (diabète) change définitivement de repère (pixel → % de l'image carrée) :
  toute évolution future des ancres diabète doit rester en %, ne pas revenir au pixel
  `SILHOUETTE_VIEWBOX`.
- `SILHOUETTE_VIEWBOX` reste inchangé et utilisé tel quel par la branche SVG codée (tabac).
- `build_assets.py` est réutilisable tel quel pour les prochains lots (S2/S3/S7) : ajouter des lignes
  à la table `ASSETS` en tête de fichier.

### Impact IA

- S2 (M5 Complications), S3 (M4 Risque CV), S5 (M7 Traitements) consomment `bodyImage` déjà câblé :
  n'ont qu'à poser leurs overlays/panneaux via `children` + `SILHOUETTE_ANCHORS` (%), pas à retoucher
  `SilhouetteCorps` ni le wrapper diabète, sauf besoin réel non anticipé (à documenter ici si ça arrive).
- Si Thibault ajuste une ancre (§7 de l'index), modifier uniquement `SILHOUETTE_ANCHORS` dans
  `src/features/diabete/components/Silhouette.tsx` — aucune reconception du composant générique.
---

## 2026-07-10 — Illustrations diabète S3 : M4 devient illustration-driven (artère + plaque + feux lucide)

### Décision

1. **`PlaqueArtere.tsx` réduit à sa plus simple expression** : le composant ne dessine plus le
   vaisseau (paroi + lumière, rectangles codés) — seulement **le dépôt qui grossit** (une ellipse
   transparente, `viewBox 0 0 100 100`), destinée à être posée en overlay sur une illustration. La
   courbe de croissance (`pot = encrassement^0.75`) et les paliers de teinte (vigilance-soft →
   vigilance → toxique) sont conservés à l'identique. Nouvel export pur `plaquePassagePct(encrassement)`
   qui calcule le « % de lumière ouverte » indépendamment de tout tracé (formule reprise de l'ancien
   `wallFrac`), pour garder le texte « Passage du sang : X % » sans dépendre de la géométrie SVG.
2. **Vue « L'artère » (M4)** : `artere-saine.png` (S1) devient le fond de la scène ; `PlaqueArtere`
   (nouvelle forme) est posé en overlay absolu par-dessus, dimensionné et **pivoté (~-25°)** pour
   s'aligner sur l'axe long de l'illustration. L'angle a été mesuré par **analyse d'image** (PCA sur
   les pixels non transparents de `artere-saine.png` — script Python ponctuel, pas conservé dans le
   repo) plutôt qu'à l'œil, faute d'accès navigateur pendant le développement (règle projet).
3. **Vue « L'anatomie » (M4)** : les pastilles de plaque codées (ancienne variante `pastille` de
   `PlaqueArtere`, supprimée) sont remplacées par l'image `plaque.png` (S1), positionnée et pivotée
   par territoire via une nouvelle table locale `PLAQUE_OVERLAYS` (cou 50/17 rot 90°, cœur 49/26
   rot 0°, jambes 46/63 rot 90° — valeurs de `plans/illustrations-diabete/index.md` §7).
4. **5 feux → lucide** : `IllustrationSlot` (placeholders `risque-cardio-feu-*`, jamais générés)
   remplacé par `Droplet`/`Gauge`/`Droplets`/`Cigarette`/`Armchair` dans un cadre circulaire neutre
   (fond `--color-bg`, bordure `--color-line`, icône `--color-nav`). La couleur d'état (vert/ambre/
   rouge) reste portée uniquement par la carte (bordure + bouton), jamais par l'icône — conformément
   au garde-fou du plan S3.

### Contexte

Suite de S1 (pipeline + silhouette `bodyImage`) et S2 (M5). S3 est la première session qui recâble
réellement un module consommateur (M4) sur le virage illustration-driven décidé en amont du chantier
(index §1/§3) : « artère saine (image) + plaque codée qui grossit » et « plaque en overlay sur
territoire », feux abandonnés au profit de lucide (plus nets à 56-74 px, thématisables).

### Alternatives envisagées

- Garder `PlaqueArtere` capable de dessiner le vaisseau complet (variante `artere`) en plus du nouveau
  mode overlay → écarté : le vaisseau codé devient un doublon mort dès que l'illustration le remplace,
  et le projet proscrit le code mort (« si vous êtes certain que quelque chose est inutilisé, vous
  pouvez le supprimer complètement »).
- Deviner l'angle de rotation de `artere-saine.png` à l'œil → écarté au profit d'une mesure
  reproductible (PCA sur les pixels non transparents), documentée ici pour qu'un futur ajustement
  parte d'une valeur justifiée plutôt que d'un nouveau tâtonnement.
- Conserver la variante `pastille` de `PlaqueArtere` pour un usage futur hypothétique (M5 ?) → écartée :
  aucun consommateur actuel ni prévu dans le plan (M5 utilise ses propres illustrations d'organe
  depuis S2), donc code mort par anticipation — à recréer si un besoin réel apparaît.

### Raison du choix

Aligner M4 sur la décision de fond du chantier (illustration-driven) sans dupliquer de logique : la
seule partie qui reste « réellement codée » (index §1.6) est le dépôt qui grossit, pas le vaisseau —
exactement ce que `PlaqueArtere` fait désormais, et rien de plus.

### Conséquences

- `PlaqueArtere` n'a plus qu'une seule forme de rendu (l'overlay) ; toute réintroduction d'un vaisseau
  codé nécessiterait un nouveau composant, pas une variante de celui-ci.
- L'alignement visuel précis (angle, position) de la plaque sur `artere-saine.png` et de `plaque.png`
  sur la silhouette **n'a pas été vérifié à l'écran** par Claude (règle projet : pas de navigateur) —
  point de revalidation explicite dans `VALIDATION.md` §S3, avec un chemin de correction clair
  (constantes `.artereOverlay` en CSS, `PLAQUE_OVERLAYS` dans le module).
- Les ids `risque-cardio-feu-*` (jamais illustrés) disparaissent définitivement du code ; plus aucune
  référence dans `design/illustrations/prompts-illustrations-diabete.html` (déjà absents).

### Impact IA

- Si Thibault demande un recalage de la plaque (vue artère ou anatomie), modifier uniquement les
  constantes CSS (`.artereOverlay` : `left`/`top`/`width`/`height`/rotation) ou la table
  `PLAQUE_OVERLAYS` du module — aucune reconception de `PlaqueArtere.tsx` nécessaire, sauf si la forme
  du dépôt elle-même doit changer.
- `plaquePassagePct` est la seule source de vérité pour le texte « passage du sang » : si la formule
  de croissance change, l'ajuster une fois ici, pas dans le module consommateur.
---

## 2026-07-10 — Illustrations diabète S4 : M1 devient une animation illustration-driven à 4 modes

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
---

## 2026-07-10 — Illustrations diabète S6 : M6 stations/organes du cadran → lucide

### Décision

Les 9 icônes de station de `SuiviModule.tsx` (`suivi-stethoscope`, `suivi-prise-de-sang`,
`suivi-organe-<protects>` × 7) passent d'`IllustrationSlot` (jamais générées, placeholders
permanents) à un composant local `StationIcon` (lucide dans un cadre neutre circulaire/arrondi),
avec deux ajustements par rapport au libellé de l'index §4 :

1. **`defenses` → `Syringe`** (pas `ShieldPlus`, pourtant aussi suggéré). Dans le code actuel,
   `defenses` n'est le `protects` que d'un seul examen (« Vaccins ») — il n'existe pas de slot
   séparé « défenses immunitaires » vs « vaccins » comme le laissait entendre la formulation à
   deux entrées de l'index (`défenses → ShieldPlus`, `vaccins → Syringe`). Une seule icône,
   choisie pour matcher l'examen concret vu par le patient.
2. **`pied` → `Footprints`**, absent de la liste de l'index (qui ne couvrait pas ce cas) — ajout
   évident, lucide propose une icône directement adaptée.

Rein et dentiste suivent la décision déjà actée dans l'index §4 : rein reste l'image
`organe-reins.png` (S1) faute d'icône lucide adaptée ; dentiste (protège « bouche ») → `Smile`.

### Contexte

Suite de S1-S5. Session indépendante (pas de dépendance sur la silhouette ou le pipeline
d'assets), portant sur le cadran/panneau de réglage/porte « Ce que ça garde » de M6 uniquement.

### Raison du choix

Minimiser l'écart avec l'intention du plan (mêmes familles d'icônes suggérées) tout en respectant
la structure de données réelle (`ProtectsId`, une seule dimension de clé pour l'icône) plutôt que
d'introduire une distinction vaccins/défenses qui n'existe nulle part ailleurs dans le code.

### Conséquences

- `IllustrationSlot` n'est plus importé dans `SuiviModule.tsx` ; les ids `suivi-*` ne sont plus
  référencés (aucune image `suivi-*.png` à produire — ils étaient de toute façon toujours restés
  au stade placeholder).
- Le cadran, l'aiguille et le centre (motif fil rouge, `dialCenter*`) restent des tracés SVG codés,
  inchangés.

### Impact IA

- Si Thibault souhaite distinguer vaccins de « défenses immunitaires » avec deux icônes, cela
  demande d'abord un changement de modèle de données (`ExamDef` ou une nouvelle clé), pas un
  changement purement visuel de `StationIcon`.
---

## 2026-07-10 — Illustrations diabète S7 : 62 vignettes M2/M3/M8, chantier clos

### Décision

Déposer en une seule session les 62 vignettes M2 (33 aliments)/M3 (18 : centre + 4 rayons + 13
activités)/M8 (11 : 7 signes + 4 resucrages) — le lot de sources générées par Thibault en parallèle
des sessions S1-S6 s'est avéré quasi complet à l'ouverture de S7 (62/62 fichiers attendus déjà
présents, vérifiés un par un avant tout traitement). Ajout de 5 nouveaux aliments
(`alimentation/data.ts` : `pates-blanches`, `pates-completes`, `couscous-complet`,
`banane-plantain`, `haricots-rouges`) et d'une nouvelle activité (`activite/data.ts` : `sol`),
tous marqués `// à revalider (Thibault)`. Le chantier `plans/illustrations-diabete/` (S1-S7) est
déclaré **clos** à l'issue de cette session.

### Contexte

S7 est une session structurellement récurrente (« au fil des générations ») ; elle n'était censée
couvrir qu'un lot partiel au lancement du chantier. Le rythme réel de génération de Thibault ayant
dépassé celui des sessions de câblage, la quasi-totalité du travail restant (mentionné §8 de
l'index comme « à générer encore ») était déjà disponible au moment d'exécuter S7 — traité en une
seule passe plutôt qu'en plusieurs lots.

### Alternatives envisagées

- Ne traiter que le sous-ensemble explicitement listé dans le plan original (M2 : 16 aliments ;
  M3 : danse/laver-la-voiture ; M8 : 11) et laisser le reste pour une session future → écarté :
  toutes les sources étaient déjà là et vérifiées, aucune raison de fractionner artificiellement.
- Régénérer/retoucher le style des vignettes acceptées avec des écarts visuels (attiéké, igname,
  plantain) → écarté, conformément à la décision déjà actée dans le plan (« écarts de style
  tolérés »).

### Raison du choix

Minimiser le nombre de sessions pour un travail mécanique (même pipeline que S1, aucune nouvelle
décision de conception) une fois toutes les sources disponibles et vérifiées.

### Conséquences

- `public/illustrations/diabete/` passe de 13 à **75 fichiers**.
- `design/illustrations/build_assets.py` : table `ASSETS` étendue à 75 entrées, réutilisable telle
  quelle pour tout futur lot (ajouter des lignes).
- `alimentation/data.ts` (32 → 33 aliments) et `activite/data.ts` (12 → 13 activités) : les seuils
  du défi ② Alimentation (`PEAK_BAS_MAX`/`PEAK_HAUT_MIN`) restent inchangés — constantes
  indépendantes du nombre d'aliments, vérifié par les 78 tests existants restés verts.
- **Chantier `illustrations-diabete` clos** : S1 à S7 toutes exécutées. Reste ouvert : validation
  visuelle humaine de l'ensemble (`VALIDATION.md`), en particulier les deux points signalés comme
  jamais vérifiés à l'écran (plaque overlay M4, clés volantes M1).

### Impact IA

- Toute nouvelle vignette future (nouvel aliment, nouvelle activité, nouveau signe/resucrage) suit
  le même chemin : ajouter la donnée dans le `data.ts`/module concerné (`// à revalider`), ajouter
  la ligne correspondante à `ASSETS` dans `build_assets.py`, relancer le script.

---

## 2026-07-11 — Corrections visuelles diabète (revue Thibault, 13 captures → 5 causes-racines)

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

## 2026-07-11 — Corrections visuelles diabète, tour 2 (revue Thibault, insuffisant sur les tailles → 6 causes-racines)

### Décision ① — LA COURBE : plancher de taille posé dans le composant partagé, pas par module

`CourbeGlycemie.module.css` (`.wrap`) gagne un plancher `min-width: 440px` au-dessus de 480px
de viewport (aucun plancher en dessous, pour ne jamais provoquer de débordement réel sur
mobile). Alternative écartée : augmenter au cas par cas le `max-width` de chaque conteneur
consommateur (`courbeCard` Alimentation, `graphCard` Insuline, `timingCard` Activité,
`courbeCard` Hypoglycémie) — écarté car le plan (index v2 §T4) demande explicitement une
« règle partagée » pour éviter de la dupliquer/oublier sur l'un des 4 modules qui réutilisent
le composant.

**Conséquences** — Quand le conteneur flex parent (ex. Alimentation défi ③, garde-manger à
côté) ne peut pas offrir 440px, l'ancêtre `flex-wrap` reflue (le garde-manger passe sous la
courbe) au lieu de laisser la courbe s'écraser. Complété par un plafond `.courbeCard`
760→900px propre à Alimentation (défis ③/④ pleine largeur, sans garde-manger, restaient
capés bien en-dessous de l'espace réel).

### Décision ② — Risque cardio ③ : bug corrigé au passage (plaque déposée sur les 3 territoires)

En agrandissant la silhouette (S1-v2), code review a révélé que l'overlay `plaque.png` se
déposait sur **les 3 territoires** (cou/cœur/jambes) dès qu'un feu passait au rouge, au lieu du
seul territoire sélectionné (`zoneActive`) — comportement demandé explicitement par le plan
tour 2 (#3) mais qui était en réalité déjà cassé avant même l'agrandissement. Corrigé en même
temps (`ZONES.filter` → lecture directe de `PLAQUE_OVERLAYS[zoneActive]`).

### Décision ③ — Traitements : panneau texte masqué en entier plutôt qu'eyebrow seul

Le plan demandait de « garder l'eyebrow, retirer le paragraphe » narratif de guidage
(« Cliquez "Voir l'effet"… »). Un eyebrow seul sans carte de contenu en dessous aurait laissé
un intitulé flottant sans rien à décrire tant qu'aucune ligne n'est sélectionnée — le panneau
entier (`eyebrow` + carte) est donc masqué dans ce cas précis, et ne réapparaît que comme
sortie d'une interaction réelle (ligne sélectionnée, vue d'ensemble). Les cas avec contenu
(y compris l'état vide « Écrivez une molécule… ») gardent l'eyebrow + texte inchangés.

### Décision ④ — Alimentation défi ②/③ : passe défensive, pas un fix de cause confirmée

Le débordement rapporté (captures #14/#15) n'a pas pu être reproduit avec certitude par calcul
manuel des largeurs flex (`ModuleShell` content ≈900px, `.layout`/`.stage`/`.shelf` — le calcul
ne fait ressortir aucun dépassement garanti aux résolutions cibles, `flex-wrap` devrait replier
plutôt que déborder). Faute de navigateur côté Claude (règle projet), le correctif appliqué
retire les largeurs fixes redondantes avec `flex-basis` (`.d2Card`, `.d3Slot` → `min-width: 0`)
— une passe défensive conforme aux bonnes pratiques CSS flex, **pas un fix ciblé sur une cause
unique identifiée**. Signalé comme point prioritaire de revalidation dans `VALIDATION.md` et
`S6.md` plutôt que présenté comme résolu.

**Impact IA** — Si Thibault confirme que le débordement persiste après cette passe, la cause
réelle reste à investiguer avec un audit Playwright (Codex) plutôt qu'une nouvelle passe de
calcul manuel côté Claude — cf. `WORKFLOW.md` §2 (audit visuel = toujours Codex, jamais Claude).

## 2026-07-11 — Corrections visuelles diabète, tour 3 (audit Chrome sur le déployé) — S1 : chrome élargi via délégation du rendu du shell

**Contexte** — Décision Thibault : côté diabète uniquement, la barre d'onglets de chaque module
doit vivre sur la même ligne que le titre (pas empilée dessous) et le contenu doit être
nettement plus large (~1240px cible provisoire au lieu de 980px partout). `ModuleShell` est
partagé avec le tabac et doit rester thème-agnostique (invariant 4) : la largeur et le slot de
navigation devaient donc être des props génériques, jamais un test sur le nom du thème.

**Découverte en cours de route** — Le plan supposait que chaque module diabète appelait déjà
`<ModuleShell>` lui-même. En réalité, seul `App.tsx` le fait : il enveloppe génériquement
`<Component>` (le module) dans `<ModuleShell>`, et la barre d'onglets de chaque module vit à
l'intérieur du `Component`, donc dans les `children` de `ModuleShell` — pas dans son `header`.
Pour remonter cette barre dans un slot `nav` rendu par le `header` (un ancêtre), il fallait soit
un portail DOM (complexité/fragilité de timing), soit inverser qui rend `ModuleShell`.

**Décision** — `ModuleDef` gagne un champ générique optionnel `rendersOwnShell?: boolean`
(aucun nom de thème). Quand il est vrai, `App.tsx` ne wrap plus le module : il lui passe
`titre`/`sources`/`onBack` via un nouveau champ optionnel `ModuleProps.shell`, et c'est le module
qui appelle lui-même `<ModuleShell shell.titre ... wide nav={<sa barre d'onglets>}>`. Les 9
modules diabète passent `rendersOwnShell: true` ; le tabac ne le passe jamais (`undefined` →
falsy) donc `App.tsx` garde exactement son ancien chemin (`<ModuleShell><Component/></ModuleShell>`)
— rendu tabac inchangé au pixel par construction, pas seulement par CSS inchangée.

**Largeur retenue** — `wide` (prop booléenne de `ModuleShell`) porte une classe CSS
`.headerWide`/`.contentWide` à `max-width: 1240px` (contre 980px par défaut), marquée
`// à caler visuellement (Thibault)` — valeur de départ, pas un choix définitif validé.

**Modules avec barre remontée dans `nav`** (6/9, ceux qui ont une bascule de vue de premier
niveau) : risque-cardio, alimentation, suivi, hypoglycémie, insuline, activité. **Modules qui
gardent leur contrôle dans le contenu** (3/9, profitent seulement de `wide`) : mécanisme (les
boutons de mode sont du contenu pédagogique, pas une bascule de vue), complications (pas de
barre de premier niveau), traitements (bascule ligne/tous = contrôle interne au module).

**Conséquences** — Toute future prop de mise en page pour un thème passera par ce même schéma
(champ générique sur `ModuleDef`/`ModuleProps`, jamais un `theme === 'x'` dans
`src/components/`). Un nouveau module diabète (cf. S10) doit passer `rendersOwnShell: true` et
suivre le même patron pour bénéficier de `wide`/`nav`.

## 2026-07-11 — Corrections visuelles diabète, tour 3 — S3 : bug Bézier de la plaque d'artère identifié et corrigé

**Contexte** — L'audit Chrome pointait que la plaque d'athérome (module Risque cardio, vue
« L'artère ») ne réduisait jamais visiblement la lumière du vaisseau, même au score maximal, bien
que le texte annonce correctement « Passage du sang : 30 % ». Le tour 2 avait corrigé la
**symétrie** des deux dépôts (`oppositeDepthFactor`) sans jamais identifier la cause réelle.

**Cause** — `crescentPath(edgeY, peakY)` (`PlaqueArtere.tsx`) construisait une Bézier
quadratique `Q P0(0,edgeY) P1(50,peakY) P2(100,edgeY)` en passant l'apex **voulu** comme point de
**contrôle**. Pour une quadratique, le point réel au milieu (t=0.5) vaut `(edgeY + ctrl) / 2` —
la profondeur réelle du dépôt n'atteignait donc que la **moitié** de la valeur visée. À
`e = 1` (`wallDepth = 35`), l'apex réel n'était qu'à 17,5 au lieu de 35, laissant les deux
croissants collés aux parois quel que soit le score.

**Correctif** — `crescentPath` calcule maintenant le point de contrôle qui produit l'apex
demandé (`ctrl = 2*apexY - edgeY`) au lieu d'utiliser l'apex directement comme point de
contrôle. Les appels restent sémantiquement inchangés (`crescentPath(0, wallDepth)` etc.) :
c'est la fonction, pas ses appelants, qui était fausse. `plaquePassagePct` (source de vérité du
texte) n'est pas touchée — la géométrie est désormais alignée sur elle.

**Impact IA** — Ce bug n'était détectable que par lecture attentive de la géométrie Bézier
(calcul manuel du point médian) ; il n'était pas visible dans le code sans faire ce calcul. À
garder en tête pour toute future modification de tracés SVG à base de courbes de Bézier dans ce
projet : vérifier si un paramètre nommé « apex »/« peak » est utilisé comme point de contrôle ou
comme point réel du tracé, ce ne sont pas interchangeables.

## 2026-07-11 — Corrections visuelles diabète, tour 3 — S6 : breakpoint Suivi remonté 860→1200px

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

## 2026-07-11 — Corrections visuelles diabète, tour 3 — S7 : axe clé/serrure ajouté à `data.ts` (classement à revalider)

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

## 2026-07-11 — S10 : nouveau module « Insuline rapide (pré-prandial) », implémenté sur feu vert explicite avant relecture finale formelle du contenu

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

## 2026-07-11 — Insuline basale (module 9) : ajout d'un message d'accompagnement

**Contexte** — Interrogation OpenEvidence sur l'insuline basale DT2 (rapport archivé
`Downloads/Rapport OE insuline basale.txt`). Le rapport **valide fortement** la conception
existante du module 9 (bande individualisée jeune/âgé, pente sur 3 nuits, hypo prioritaire, hypo
nocturne invisible via capteur, cadence ~3 jours) — aucune correction de fond nécessaire.

**Décision Thibault** — Parmi 3 pistes d'enrichissement, deux (concept de surbasalisation ;
visualisation du croisement nocturne BeAM) **écartées** : elles supposent un niveau d'autonomie
que la patientèle de Thibault atteint rarement. Retenue : la 3ᵉ, un simple **message
d'accompagnement**. Formulation validée par Thibault (choix parmi 3 propositions) :
« Régler la lente, c'est un travail d'équipe avec votre soignant — pas une décision à prendre
seul. »

**Justification par les données** — L'auto-titration guidée est au moins aussi efficace que la
titration médicale, mais **uniquement avec accompagnement humain** (« l'application seule ne
suffit pas », méta-analyse Boonpattharatthiti 2025 ; l'éducation structurée réduit les hypos
sévères ~75 %, OR 0,25). Le message insiste donc sur l'accompagnement (« jamais seul »), ce qui
est à la fois honnête cliniquement et adapté à une patientèle peu autonome — plutôt qu'un message
d'autonomie qui serait en tension avec la réalité de terrain.

**Implémentation** — Une phrase en note discrète (`.accompagnement`, `--font-size-small`,
`--color-text-soft`) sous le refrain de sécurité existant (`.filrouge`, dominant), regroupés dans
un `.piedRefrain`. `InsulineModule.tsx` + `.module.css`. Aucun chiffre, aucun nouvel écran, aucune
régression (gates verts, 86 tests). Hors périmètre du chantier v3 (S1-S10) : enrichissement
ponctuel du module 9.

---

## 2026-07-12 — Chantier audit-diabete (S1-S6) : 12 corrections + modèle de cumul insuline (excès persistant/IOB)

### Décision

Six sessions (S1-S6), onze tâches (T1-T11), corrigeant les 12 points d'un audit manuel de Thibault
sur le déployé (`Audit/audit-etp-interactif.md`, sélecteurs DOM), par-dessus le chantier
`corrections-visuelles-diabete-v3` déjà déployé : allègements de mise en page (Cardio S1,
Alimentation S3), réutilisation d'un composant existant (illustrations Hypo S2), passage d'un
affichage figé à un **système d'expérimentation** sur la famille Insuline (S4 réglage de la lente,
S5 modèle convergent + cumul de l'insuline rapide), resserrement transversal du cadre de
consultation (S6, zéro scroll). Détail complet session par session dans `plans/audit-diabete/`
(`index.md` + `S1.md`-`S6.md`, chacun avec sa section « Bilan de session »).

Le point notable de ce chantier est la **modélisation du cumul de doses d'insuline rapide** (S5,
T10, onglet ④, matrice de 6 cases). La case « situation B (reste haute) + attente + recorrection →
retour en cible » s'est révélée **structurellement irréalisable** avec deux mécanismes successifs —
démontré par preuve numérique (grid search exhaustif) à chaque tentative, pas un problème de
calage. Le mécanisme retenu (3ᵉ tentative, proposé et vérifié numériquement par le modèle **Fable**
sollicité spécifiquement pour cette réflexion, implémenté par Sonnet sur le fichier réel) introduit
une élévation de glycémie **persistante** (`exces`, qui ne décroît pas avec le seul écoulement du
temps), résorbée uniquement par une dose de correction réelle — pondérée par l'insuline encore
active de la 1ʳᵉ dose (IOB qualitatif, via une nouvelle fonction `fractionEffetDelivree`) au moment
de cette recorrection. C'est ce terme IOB qui distingue correctement une recorrection « tôt »
(sur-effet, IOB encore élevé → hypo) d'une recorrection « après attente » (IOB quasi nul → retour
en cible) — pas la taille d'un quelconque coussin résiduel qui se serait contenté de décroître avec
le temps.

### Contexte

Le plan `plans/audit-diabete/S5.md` (T10) posait une matrice pédagogique à 6 cases (2 situations
cliniques × 3 choix de recorrection) et un garde-fou explicite : si le modèle ne produit pas
proprement la case « B + attente → cible » sans calage fragile, **STOP**, ne pas fudger, proposer à
Thibault un ajout minimal au modèle et attendre l'arbitrage. Ce garde-fou s'est déclenché deux fois
de suite avant qu'une consultation ponctuelle du modèle Fable (autre agent, sollicité spécifiquement
pour réfléchir au problème de modélisation, hors du fil d'exécution normal Sonnet) ne trouve un
mécanisme fonctionnel.

### Alternatives envisagées

- **Tentative 1 — réutiliser tel quel l'écart de départ résorbé par le temps** (mécanisme de T9,
  `decalageDepart`/`DEPART_RESORPTION`) pour modéliser un repas B « sous-couvert » (paramètres
  `charge`/`frein`/`retard` poussés). Rejetée par preuve numérique : dans `repasLevelAt`, le
  paramètre `frein` réduit l'amplitude du pic **et** allonge sa durée simultanément — les deux
  effets d'un même paramètre s'opposent structurellement, rendant impossible d'obtenir à la fois
  « pic franchement au-dessus de la bande cible » et « encore élevé 150 min après le repas », pour
  n'importe quelle combinaison de `RepasParams` (même poussés à leurs bornes théoriques, le plafond
  atteignable à l'instant « attente » reste à peine 6 points au-dessus de la baseline).
- **Tentative 2 — un « plateau additif » à résorption très longue** (`plateauHaut?`,
  `PLATEAU_RESORPTION ≥ 400`, même schéma `ease` que T9). Rejetée après recherche exhaustive sur
  grille (dose × `PLATEAU_RESORPTION` × `plateauHaut`, plus de 500 combinaisons testées) : aucune ne
  satisfait simultanément les 3 conditions de la matrice ; pire, dans 81 % des configurations qui
  satisfont déjà « B reste haute », la case « attente » est aussi mauvaise ou pire que la case
  « tôt » — l'inverse exact de ce que la matrice demande. Cause structurelle identique en substance
  à la tentative 1 : à l'instant « attente », le plateau s'est déjà partiellement résorbé par le
  temps (un « coussin » plus petit qu'à l'instant « tôt ») — toute dose assez forte pour transpercer
  le grand coussin de « tôt » transperce nécessairement aussi le petit coussin de « attente »,
  provoquant une hypo dans les deux cas au lieu d'un atterrissage en douceur dans la cible pour
  « attente » seulement.
- Fudger les seuils de lecture de la matrice (assouplir les critères « plonge »/« cible ») pour
  faire passer une des deux tentatives → écarté explicitement par le mandat de la session
  (« ne pas implémenter une version dégradée silencieusement »).

### Raison du choix

Le mécanisme IOB (3ᵉ tentative) lève la cause structurelle commune aux deux pistes rejetées :
l'élévation persistante ne décroît **jamais** sous le seul effet du temps — seule une dose de
correction réelle la consomme, à hauteur de la dose ajoutée plus l'insuline encore active de la
1ʳᵉ dose (IOB, calculée via `fractionEffetDelivree`). À l'instant « attente », l'IOB de la 1ʳᵉ dose
est quasi nul → la recorrection agit sur l'excès sans effet résiduel qui s'ajoute, et atterrit dans
la cible. À l'instant « tôt », l'IOB de la 1ʳᵉ dose est encore élevé → il s'additionne à l'effet de
la recorrection et provoque l'hypo. C'est ce terme IOB — pas la taille d'un coussin résiduel
arbitraire qui aurait fini par décroître de lui-même — qui distingue correctement les deux cas,
condition que les deux mécanismes précédents ne pouvaient pas satisfaire par construction.

### Conséquences

- Deux nouveaux champs optionnels sur `BolusParams` (`glycemieCurve.ts`) : `exces?: number`
  (élévation persistante) et `doseCorrection?: number` (dose de la 2ᵉ injection, défaut = `dose`)
  — comportement strictement inchangé quand ils sont absents (non-régression garantie par
  construction, vérifiée par les 55 tests de `glycemieCurve.test.ts`, dont 4 nouveaux ; aucun test
  existant modifié à travers les 3 tentatives).
- Nouvelle constante `EXCES_CONSOMMATION` (modèle, `glycemieCurve.ts`) + `EXCES_SITUATION_B`
  (composant, `InsulineRapideModule.tsx`) — points d'excès résorbés par unité d'insuline mobilisée,
  `// à caler (Thibault)`.
- Nouvelle fonction privée `fractionEffetDelivree(dt)` — fraction cumulée (0→1) de l'effet d'un
  bolus déjà délivrée à l'instant `dt`, distincte de `bolusEffet` (intensité instantanée). Ni
  `bolusEffet` ni aucune autre fonction existante de `glycemieCurve.ts` n'ont été modifiées ; seule
  `sampleRepasAvecBolus` a été touchée à travers les 3 tentatives (garde-fou du plan `S5.md`
  respecté de bout en bout).
- `InsulineRapideModule.tsx` onglet ④ reconstruit : les états `situationCumul`
  (`'revient'|'reste-haut'`) et `recorrection` (`'aucune'|'tot'|'attente'`) remplacent l'ancien
  toggle binaire `cumulActive` ; nouvelle fonction `matriceCumul(...)` qui calcule le message et
  l'issue (« plonge » ou non) pour chacune des 6 cases. Onglets ①②③ non touchés par T10.
- Résiduels zéro-scroll (S6, cf. `STATUS.md` § Phase 14) : point ouvert du même chantier, hors
  périmètre de cette décision de modélisation — micro-session dédiée à prévoir (Suivi « Le
  parcours » et Traitements « avec panneau » en priorité, breakpoints de layout mal calés à
  1024×768).

### Impact IA

- Si Thibault ajuste `EXCES_SITUATION_B`/`EXCES_CONSOMMATION` (marqués `// à caler`), aucune
  reconception n'est nécessaire — seules les constantes changent.
- Toute future extension du modèle de cumul (`sampleRepasAvecBolus`) doit passer par une nouvelle
  décision documentée ici, dans le même esprit que le gel d'API du 2026-07-09 (S14, module
  Alimentation) : pas de modification silencieuse du modèle sans revalider les invariants qu'il
  protège.
- Avant toute nouvelle tentative de modélisation d'un mécanisme de cumul/persistance sur ce module,
  lire les deux tentatives rejetées ci-dessus (et le détail chiffré dans le bilan de
  `plans/audit-diabete/S5.md`) pour ne pas répéter une preuve déjà faite : les deux échouent pour
  des raisons structurelles du modèle `repasLevelAt`/`ease` (couplage pic/durée via `frein` ;
  résorption temporelle du coussin), pas par sous-calage de constantes — un nouvel ajustement de
  `PLATEAU_RESORPTION` ou de `frein` ne suffira pas à les faire fonctionner.

## 2026-07-12 — Illustrations tabac : mapping fichier→id par correspondance de titre, pas par génération

### Décision

Intégrer le lot de sources tabac de `Downloads\illustration ETP\` (154 fichiers au total, partagés
avec le lot diabète) en mappant chaque fichier à l'id de slot existant **par correspondance de
libellé/titre/affirmation** (lecture des `data.ts` de `benefices-arret`, `boite-a-outils`,
`idees-recues`, `substituts`) plutôt que d'attendre une convention de nommage explicite côté
génération — aucune n'existait pour le tabac (contrairement au diabète, où `build_assets.py` gère
déjà cette table). Nouveau script dédié `design/illustrations/build_assets_tabac.py` (même pipeline
flood-fill que le diabète, dupliqué plutôt que factorisé — deux scripts autonomes de ~90 lignes ne
justifient pas un module partagé).

### Contexte

Le thème tabac a des slots `IllustrationSlot`/`TechniqueIllustration` câblés depuis plusieurs
chantiers (approfondissement-tabac S1, boite-a-outils BO1-BO2, X8) mais **aucune image** n'avait
jamais été fournie — contrairement au diabète, qui a son propre chantier `illustrations-diabete`
(S1-S7, clos) avec une table `ASSETS` explicite. Le dossier Downloads livré par Thibault mélange
des fichiers diabète (déjà tous couverts par `build_assets.py`, aucune action ici) et, pour la
première fois, un lot tabac complet — mais sans table de correspondance préexistante à suivre.

### Alternatives envisagées

- **Attendre une nomenclature explicite de Thibault** avant d'intégrer quoi que ce soit — écarté :
  les titres/affirmations des `data.ts` rendent la correspondance non ambiguë pour l'immense
  majorité des cas (36/42 fichiers ont un titre quasi identique au champ `affirmation`/`titre` du
  code), et le fallback `onError` d'`IllustrationSlot` rend une intégration partielle sans risque.
- **Forcer une image sur chaque id** (dupliquer une image existante sur plusieurs cartes proches,
  ex. les 4 cartes « poids ») — écarté : afficherait la même illustration sur 4 cartes différentes,
  ce qui laisse croire à une redondance de contenu inexistante. Préféré : une seule affectation au
  cas le plus central (`vf-poids`), les 3 autres restent en placeholder (états déjà gérés).
- **Réutiliser `IllustrationSlot`** (composant carré, `object-fit: cover`) pour les 6 scènes
  substituts — écarté après inspection visuelle des sources (`Patch — technique.png` = scène large
  16:7 en 3 panneaux) : un recadrage carré aurait coupé les panneaux latéraux. Gardé le composant
  `TechniqueIllustration` existant (déjà `width:100%; height:auto`, pas de crop forcé).

### Raison du choix

Les libellés du lot Downloads sont rédigés en français naturel et collent presque mot pour mot aux
champs `affirmation`/`titre`/`illustrationLabel` du code (ex. « Une semaine d'observation » =
titre exact de `outil-journal` ; « Ça commence en 20mn » = reformulation directe de l'affirmation
de `vf-20min`) — la correspondance est vérifiable par lecture, pas une supposition. Passer par une
recherche systématique (lister les 154 fichiers, croiser avec la table `ASSETS` diabète existante
pour isoler le résidu, puis croiser le résidu avec les `data.ts` tabac) donne un mapping complet et
traçable sans attendre un aller-retour supplémentaire avec Thibault.

### Conséquences

- **42/56 slots tabac couverts** (7 zones bénéfices + 14 outils + 15 idées reçues + 6 substituts) ;
  reste en placeholder (aucune image dédiée dans le lot, pas une erreur d'intégration) :
  `benef-horizon`, `vf-poids-coeur`, `vf-fumer-mince`, `vf-poids-regime`, `vf-vape-aide`,
  `vf-double-usage`, `vf-vapeur-eau`.
- **`vf-poids` a reçu le seul visuel « poids » du lot** (« Poids et arrêt.png ») au détriment de
  `vf-poids-coeur`/`vf-fumer-mince`/`vf-poids-regime` qui traitent aussi du poids — choix arbitré
  par Claude (carte la plus centrale/la plus probable à être lue en premier), **à confirmer par
  Thibault** (cf. `VALIDATION.md`) ; aucun changement de code nécessaire pour réaffecter, juste
  renommer le PNG.
- **`TechniqueIllustration.tsx` réécrit** : la table `ILLUSTRATIONS: Record<FormeId, string | null>`
  (toute à `null` depuis X8) disparaît, remplacée par un chargement direct
  `${BASE_URL}illustrations/tabac/substitut-${forme}.png` + état `errored` (même pattern que
  `IllustrationSlot`, dupliqué localement plutôt qu'importé — le composant a une contrainte de forme
  différente, cf. alternative écartée ci-dessus). `substitut-patch.png` existe mais n'est actuellement
  jamais rendu par l'UI (`showTechnique` exclut `patch`, `FORMES_PONCTUELLES` aussi) — comportement
  hérité de X8/BO5, non modifié ici, non bloquant.
- `public/illustrations/tabac/` créé (42 fichiers, 3,2 Mo), poids par asset 20-156 Ko (technique de
  prise, 900px, plus lourdes que les icônes 512px — cible ~90 Ko/asset du diabète non visée ici,
  jugée non pertinente pour des scènes 900px).

### Impact IA

- Si Thibault fournit les 7 illustrations manquantes plus tard, ajouter simplement une ligne à la
  table `ASSETS` de `build_assets_tabac.py` et relancer le script — aucun changement de composant.
- Avant toute réaffectation du mapping (notamment `vf-poids`), vérifier d'abord `VALIDATION.md`
  (section « Illustrations tabac ») pour le statut de validation Thibault en cours.
- Le pipeline `build_assets_tabac.py` est un outil local (hors `package.json`, Pillow/numpy) : ne
  jamais l'appeler depuis du code applicatif, seulement en session de génération d'assets.

## 2026-07-13 — Corrections audit Chrome tabac : état de sélection en mémoire, livret, cadrage app patient

### Décision

Chantier `plans/corrections-audit-tabac/` (S1-S13), traitant les 16 points d'un audit navigateur manuel de
Thibault sur le déployé (`rapport-bugs-etp-tabac.md` + `rapport-bugs-etp-diabete.md`). Au-delà des
retouches UI/a11y S1-S9 (quick-wins, chacune détaillée dans son `S<n>.md`), cinq décisions structurantes
tranchées par Thibault avant rédaction du plan :

1. **Persistance des sélections = EN MÉMOIRE, jamais `localStorage`.** Le rapport d'audit brut proposait
   `localStorage` pour que « Mon plan d'arrêt » retienne les choix faits dans les autres modules — proscrit
   (invariant « zéro donnée patient stockée », `CLAUDE.md`). Solution retenue (S10) : un **React Context
   monté dans `App.tsx`**, au-dessus du switcher de vues (`themes|home|module`), qui ne se démonte jamais
   tant que l'app tourne — il survit à la navigation inter-modules mais se réinitialise à un rechargement
   de page (comportement éphémère voulu, pas un défaut). Forme réelle de l'état par thème (`SelectionState`,
   `src/state/SelectionContext.tsx`) : `{ dateArret, situations (ids canoniques de situations.ts),
   situationsLibres (texte libre), substituts (FormeId), outilsFiche (ids d'outils), parades (4D + texte
   libre), raisons (libellés), gestesEcart (libellés + texte libre) }` — deux champs (`situationsLibres`,
   `parades`) s'ajoutent à la forme suggérée dans `S10.md` pour coller à ce que « Mon plan d'arrêt »
   affichait déjà (écart assumé, documenté dans le bilan de session).
2. **Marqueur « A » (courbe de glycémie, tous onglets Insuline) = injection d'insuline** (confirmé
   Thibault, pas « Action ») → icône Lucide `Syringe` ; « R » (repas) → `Utensils` (S7).
3. **Ordre des familles de l'accueil tabac** = **Se motiver → Comprendre → Agir** (confirmé, S9) ; thème
   diabète intact (Comprendre / Agir au quotidien / Se soigner, inchangé).
4. **Le livret d'accompagnement (S11) est livré comme une proposition non validée à l'écran** — Thibault a
   explicitement demandé de l'implémenter d'abord (« on ajustera après ») plutôt que d'attendre une revue
   visuelle intermédiaire avant de coder, à l'inverse de la règle habituelle « design fixé, ne pas
   reconcevoir » qui s'applique aux autres sessions du chantier.
5. **Module d'aide patient autonome (T16) sorti en chantier séparé cadré**, `plans/aide-patient/index.md` :
   ce n'est pas une correction mais une **nouvelle surface applicative** (2ᵉ entrée Vite, bundle qui
   n'importe jamais le registre ni un module de consultation), contenu **générique** (jamais les choix d'un
   patient), v1 = « Mes substituts » + « Agir face à une situation », **un seul QR** vers la racine de cette
   app (pas de deep-link par écran, donc pas de routeur côté patient non plus), contenu réutilisé + habillage
   patient proposé par Claude à revalider par Thibault. Hébergement de l'URL (2ᵉ projet Vercel ou vrai
   sous-domaine) différé au moment du déploiement.

### Contexte

Audit navigateur (Claude in Chrome) de Thibault sur `etp-interactif.vercel.app`, reconstruit et vérifié
fichier par fichier dans `rapport-bugs-etp-tabac.md` (16 points T1-T16, sélecteurs → fichiers vérifiés) et
`rapport-bugs-etp-diabete.md`. Passe par-dessus tout ce qui était déployé (`HEAD = origin/main`, dernier
commit avant chantier `9a6806d`, 2026-07-12 — reflète donc l'état post-`audit-diabete`/post-illustrations-
tabac). Points T6-T13/T15 = retouches UI/bugs quick-wins parallélisables (S1-S9) ; T11 = socle d'état
partagé (S10, bloquant, touche plusieurs modules + `App.tsx`) ; T14 = livret, qui **dépend** de S10 (S11) ;
T16 = nouvelle app patient, cadrée mais non exécutée dans ce chantier.

### Alternatives envisagées

- Persistance `localStorage` pour le state partagé (proposée telle quelle par le rapport d'audit brut) →
  écartée, contredit directement l'invariant « zéro donnée patient stockée » (`CLAUDE.md`).
- Remonter l'état de sélection au niveau de l'URL (querystring/routeur) → écarté : l'app n'a pas de routeur
  (navigation par état dans `App.tsx`) et une URL porteuse d'état introduirait une forme de persistance
  (historique navigateur, partage de lien possible) incompatible avec l'invariant.
- Module patient comme route masquée de l'app de consultation (`/patient`) plutôt que bundle Vite séparé →
  écarté par Thibault : « le patient n'accède jamais seul à l'outil soignant » doit se traduire par une
  **séparation physique du code** (2ᵉ point d'entrée, graphe d'import distinct), pas par une route cachée
  qui resterait techniquement atteignable depuis le même bundle.
- QR par écran (deep-link par slug d'URL) pour l'app patient → écarté : cohérent avec « pas de router » de
  l'app principale, et le périmètre v1 (2 écrans seulement) ne justifie pas d'introduire une navigation par
  URL côté patient ; un QR unique vers la racine, navigation interne par état, suffit.

### Raison du choix

Le Context en mémoire est le seul mécanisme qui satisfait simultanément « l'état doit survivre à la
navigation entre modules » (besoin fonctionnel exprimé par le plan d'arrêt, T11) et « zéro persistance »
(invariant produit non négociable) : il vit dans l'arbre React monté par `App.tsx`, jamais dans une API de
stockage navigateur ou réseau. Les arbitrages de contenu/mapping (marqueur A, ordre des familles tabac)
reflètent des décisions cliniques/pédagogiques de Thibault, tranchées avant rédaction pour ne pas les
laisser à l'appréciation de l'exécutant. Le chantier patient est cadré à part parce qu'il change
l'architecture de build (2 bundles Vite) et le périmètre produit (nouvelle audience — le patient seul, sans
soignant), ce qui en fait une nouvelle fonctionnalité et non une correction du produit existant.

### Conséquences

- Nouveau fichier `src/state/SelectionContext.tsx` (Provider générique indexé par `themeId` + hook
  `useSelection()`, aucune persistance) ; `App.tsx` monte le Provider au-dessus du rendu de module (ne se
  démonte jamais au changement de module). Câblage en écriture : `AddictionModule` (situations),
  `SubstitutsModule` (forme, via un nouveau toggle « Retenir pour mon plan »), `BoiteAOutilsModule` (outils
  « Dans ma fiche »), `MotivationModule` (raisons). `PlanArretModule` lit **et** écrit toutes ses sections
  (bidirectionnel) + `dateArret` + un nouveau bouton « Réinitialiser mon plan ».
- Nouveaux `src/components/PrintableLivret.tsx`/`.module.css` + `src/features/tabac/plan-arret/
  livretSections.tsx` (contrat `PrintableSection { id, eyebrow?, title, body, breakBefore? }` + builder
  `buildLivretSections(state)`). Le bouton « Imprimer mon plan » (ancienne fiche récap texte) est
  **remplacé** par « Imprimer mon livret complet » — il n'existe plus de fiche « plan » courte isolée
  (point ouvert à confirmer par Thibault, cf. `VALIDATION.md` §S11).
- Factorisation à l'occasion du livret, pour éviter de dupliquer du contenu clinique/présentation entre les
  modules et le livret : `FORMES_DATA`/`FormeId`/`FORMES_PONCTUELLES` extraits de `SubstitutsModule.tsx`
  vers `tabac/substituts/data.ts` ; `MOTIVATION_SEED`/`RAISON_ICONS`/`iconForRaison` extraits de
  `MotivationModule.tsx` vers `tabac/motivation/data.ts` (supprime au passage une duplication `RAISONS`
  préexistante dans `PlanArretModule.tsx`).
- Nouveau chantier cadré `plans/aide-patient/` (index.md complet, sessions P1-P6 « à écrire au lancement de
  l'exécution », non démarré) : à exécuter **après** commit/push du chantier `corrections-audit-tabac`
  stabilisé (P1 retouche substituts + boîte-à-outils, tout juste modifiés par S1/S3 — ne pas re-churner du
  code non commité).
- Gate finale du chantier : `npx tsc --noEmit` OK · `npm run build` OK · `npm test` 95/95 OK. Aucune
  dépendance runtime ajoutée (`lucide-react` déjà présent). **Aucune vérification navigateur côté Claude** —
  tout le visuel (S1-S11) reste à valider par Thibault via `npm run dev`, cf. `VALIDATION.md`.

### Impact IA

- Tout futur module tabac qui a besoin de retenir un choix entre modules doit passer par
  `useSelection(themeId)` (`src/state/SelectionContext.tsx`), jamais par un state local isolé ni par
  `localStorage`/`sessionStorage`/cookies — même règle pour l'app patient si elle en avait un jour besoin
  (non prévu en v1, qui n'a pas d'état partagé).
- Toute extension du livret (nouvelle section imprimable) doit passer par le contrat `PrintableSection` +
  `buildLivretSections` (`tabac/plan-arret/livretSections.tsx`), pas par une duplication de markup direct
  dans `PlanArretModule.tsx`.
- Avant de démarrer `plans/aide-patient/`, relire son cadrage complet (contenu générique, bundle séparé,
  couche `src/content/` comme source unique consommée par consultation **et** patient) — ne jamais dupliquer
  de contenu tabac entre les deux surfaces.
- Le livret (S11) est une proposition non revue à l'écran : ne pas la considérer comme un design validé tant
  que `VALIDATION.md` §S11 n'est pas coché par Thibault ; ne pas s'appuyer dessus comme référence de style
  pour d'autres sessions avant ce retour.

## 2026-07-13 — App d'aide patient autonome (chantier aide-patient, T16 du chantier corrections-audit-tabac)

### Décision

Créer une **2ᵉ surface applicative** (app patient autonome, sans soignant) à partir du **contenu existant du
sevrage tabagique**, avec un **périmètre v1 réduit** (deux écrans seulement) et une architecture de **bundle
Vite séparé** (jamais d'import du code de consultation).

Cinq choix structurants :

1. **Contenu générique** : le QR mène vers une **URL racine unique**, aucune donnée patient dans l'URL, le
   build ou une API — chaque patient voir le **même contenu**.
2. **Bundle physiquement séparé** : 2ᵉ point d'entrée Vite (`patient.html` + `src/patient/main.tsx`) dans le
   même repo ; le graphe d'import du bundle patient n'atteint **jamais** `src/features/*/registry.ts` ni un
   module de consultation (séparation stricte du code).
3. **Couche `src/content/tabac/`** comme **source unique** pour consultation **et** patient : tous les
   textes médical (situations, outils, substituts) vivent à cet endroit, les deux surfaces les
   réutilisent — aucune duplication.
4. **QR statique unique** : une image PNG (600×600, encodée hors-app) posée en `public/qr/patient.png`,
   régénérable si l'URL change. Pas de dépendance runtime (`qrcode` / `qrcode.react` interdits).
5. **Habillage patient proposé par Claude** : tout texte de cadrage au-portant (intro écran, libellés de
   section, bloc QR) est une proposition marquée `// à revalider (Thibault)` — ne jamais inventer de fait
   médical, juste reformuler en **voix patient** (« comment faire ») plutôt que soignant (« comment
   proposer »).

### Contexte

T16 du rapport d'audit navigateur (Claude in Chrome, 2026-07-13) : demande de complément patient autonome,
cadrée avec Thibault le même jour en session séparée (`plans/aide-patient/index.md`). Justification : le
soignant peut imprimer des fiches/le livret et y poser un QR → le patient rentre chez lui, scanne, retrouve
sur son téléphone « comment faire » sans données personnelles enregistrées.

### Alternatives envisagées

- Route masquée de l'app consultation (`/patient`) au lieu de bundle Vite séparé → rejeté : « séparation
  physique du code, jamais logique ».
- Deep-link par écran (QR vers `/patient/substituts?forme=patch`) → rejeté : incommode, introduit un
  routeur côté patient qui s'oppose à « pas de router » de la consultation ; QR unique vers la racine,
  navigation interne par état, suffit pour v1.
- Persistance `localStorage` des sélections patientes (substitut choisi, situation cochée) → rejeté :
  déroge à « zéro donnée patient ». Même si le patient ignore que ses clics ne persistent pas au-delà
  du rechargement, c'est cohérent avec le design philosophique de l'app (« éphémère, aucun enregistrement »).
- Maquette Claude Design avant S3/S4 → rejeté par défaut (v1-directe retenue : composer depuis les
  tokens/primitives/classes globales existantes, validation visuelle humaine sert de filet — même approche
  qu'extensions-tabac X1-X7).

### Raison du choix

- **Souveraineté de contenu** : une source unique `src/content/` facilite la maintenance (fix clinique appliqué
  aux deux surfaces en même temps).
- **Sécurité RGPD** : aucune donnée patient n'est jamais enregistrée, partagée ni transmise — l'app est
  **entièrement éphémère** et hors-ligne.
- **Simplicité** : un QR unique, pas de gestion de variantes d'URL ou de paramètres ; la navigation par état
  (React) suffit.
- **Réutilisabilité du code patient** : les composants `PatientApp`, `PatientSubstituts`, `PatientSituations`
  restent isolés dans `src/patient/`, ne contaminent jamais la consultation ; chaque surface réutilise
  `ModuleCard` (agnostique) pour les accueils.

### Conséquences

- **Refactor S1** : relocaliser `substituts/data.ts`, `situations.ts`, `boite-a-outils/data.ts` de
  `src/features/tabac/` vers `src/content/tabac/`, mettre à jour tous les importeurs (6 fichiers) —
  déplacement pur, aucune modification de logique (vérification Grep exhaustive).
- **Nouvelle coquille S2** : `patient.html` + `src/patient/main.tsx` + `src/patient/PatientApp.tsx` (état
  `view: 'home' | 'substituts' | 'situations'`) + `src/patient/Home.tsx` (2 cartes) + `vite.config.ts`
  (`build.rollupOptions.input: { main, patient }`).
- **Deux écrans S3-S4** (substituts/situations) : chacun un petit composant patient sans importer de module
  de consultation, une illustration locale (fallback sur `<img>` si nécessaire), une reformulation voix
  patient (`commentFaire()` pour outils).
- **QR S5** : `public/qr/patient.png` généré hors-app, constante `PATIENT_APP_URL` avec placeholder, bloc
  `QRBlock` réutilisé par `FicheOverlay` et `PrintableLivret`.
- **Aucune dépendance runtime ajoutée** : `package.json` inchangé ; `patient.html` réutilise les fonts/tokens
  globaux + `ModuleCard` agnostique.
- **Bundle séparation vérifiée post-build** : grep du bundle `dist/assets/patient-*.js` confirme aucune trace
  de `registry`, module consultation ou contenu soignant (la séparation des bundlesVite + l'absence
  d'import interdit = garde-fou physique).

### Impact IA

- Nouveau pattern pour « surfaces multiples d'une même app » : deux entrées Vite, contenu partagé dans
  `src/content/`, code surface-spécifique isolé par surface (`src/patient/` vs `src/features/`).
- Pas d'état partagé côté patient (v1) — si un jour elle en a besoin, utiliser la même `SelectionContext`
  générique que consultation (déjà en place), instancée avec `themeId = 'tabac'`.
- À chaque évolution du contenu (nouvelle situation, outil, substitut) : aucune duplication — modifier
  `src/content/tabac/`, les deux surfaces voient le changement.
- Avant futur déploiement patient : configurer la cible Vercel/sous-domaine pour servir `patient.html`
  comme racine (pas `/patient.html` sur le domaine consultation), régénérer `public/qr/patient.png` à
  l'URL définitive.

## 2026-07-14 — Chantier `corrections-revue-guidee` (13 points, blocs A-E) : 6 décisions structurantes

### Décision ① — Silhouette anatomique tabac : mode hotspot générique réutilisé sans importer le wrapper diabète

**Décision**

`BeneficesArretModule.tsx` (module « Ce que l'arrêt répare ») passe la silhouette schématique + cercles
blancs en **silhouette anatomique en mode hotspot**, en consommant `SilhouetteCorps` (`src/components/`,
générique) via sa prop existante `bodyImage` — **sans jamais importer** `src/features/diabete/components/
Silhouette.tsx` (qui code en dur les zones diabète). L'asset anatomique est **copié** (pas référencé à
distance) vers un chemin **tabac dédié** : `public/illustrations/tabac/silhouette-corps.png` (copie de
`public/illustrations/diabete/silhouette.png`). Les 7 zones tabac récupèrent des ancres en **pourcentages**
(repère de l'image carrée), dans `benefices-arret/data.ts`.

**Contexte**

Point 2-4 de la revue guidée : narration temporelle conservée (frise, cf. Décision ⑥ ci-dessous) mais les
cercles blancs codés en dur devaient disparaître au profit d'une vraie silhouette anatomique — celle déjà
utilisée par le module diabète « Complications ».

**Raison du choix**

`SilhouetteCorps` savait déjà rendre ce mode (utilisé par le wrapper diabète) : aucune extension du
composant partagé nécessaire. Copier l'asset plutôt que pointer `illustrations/diabete/…` **découple** les
deux thèmes — le module tabac possède son propre fichier et ne casse pas si la silhouette diabète évolue ou
déménage, conforme à l'invariant 4 (multi-thèmes par conception, aucun thème en dur dans le moteur générique
ni de couplage inter-thèmes caché).

**Conséquences**

- Nouveau fichier `public/illustrations/tabac/silhouette-corps.png` (copie, ~26 Ko).
- `SilhouetteCorps.tsx` et le wrapper diabète restent strictement inchangés (retouche additive côté tabac
  uniquement).
- Ancres % calées à l'œil par Claude, `// à revalider (Thibault)` — validées visuellement le 2026-07-14,
  calage fin des organes laissé ouvert.

### Décision ② — Insuline rapide, temps ① : dose « habituelle » fixe, résultat = écart (dose − glucides)

**Décision**

La dose du temps ① « Couvrir le repas » n'est plus recalée sur la charge du repas
(`cran.params.charge * DOSE_FACTOR`) mais devient **fixe**, calibrée pour un repas moyen
(`DOSE_ADEQUATE * DOSE_FACTOR`), exactement comme le fait déjà le temps ③. Le résultat de la courbe suit
donc l'**écart (dose − glucides)** : Peu + Habituelle → hypo, Repas moyen + Habituelle → cible (seul cas
parfait), Beaucoup + Habituelle → reste haut (sans plonger). `messageCouvrir` devient une matrice à 9 cases
(repas × dose).

**Contexte**

Point 11 de la revue guidée : le modèle antérieur faisait toujours coïncider dose et repas — « Dose
habituelle » couvrait **parfaitement** n'importe quelle charge, ce qui est pédagogiquement faux (masque
l'intérêt même d'ajuster la dose au repas).

**Raison du choix**

Aligner le temps ① sur la logique déjà saine du temps ③ (qui dépend bien des deux axes) plutôt que
d'inventer un nouveau mécanisme — cohérence interne du module.

**Conséquences**

- `REPAS_CRANS` recalé (`peu` 0.3→0.2, `beaucoup` 0.8→1.0) pour un contraste net avec une dose fixe ;
  `DOSE_ADEQUATE` 0.5→0.40.
- Répercussion en cascade sur le temps ③ (réglages fins : `DEPART_OPTIONS.haute` 30→45, `basse` −10→−7) et
  le temps ④ (recorrections passent par `doseCorrection: DOSE_ADEQUATE` explicite).
- Toutes les constantes `// à revalider (Thibault)` — rendu et sens validés visuellement le 2026-07-14,
  valeurs cliniques non tranchées.

### Décision ③ — `excesGate` : l'excès de glycémie du temps ④ devient gaté post-pic, pas un décalage constant

**Décision**

Correctif de séance (au-delà du plan initial) : dans `src/features/diabete/lib/glycemieCurve.ts`, une
nouvelle fonction `excesGate(params, t)` remplace le décalage constant qui portait jusque-là l'excès de la
situation « reste haute » (temps ④, `BolusParams.exces`). L'excès est désormais **nul avant/au pic** puis
monte après le retour du repas — ce qui permet aux deux courbes de base « redescend seule » / « reste
haute » (option sans dose ajoutée) de **partir identiques** (même repas, même dose de repas
`REPAS_CUMUL`/`DOSE_BASE_CUMUL`, montée commune vers un pic marqué dans le rouge) et de ne **diverger
qu'après le pic**.

**Contexte**

Retour visuel de Thibault sur S5 : la situation « reste haute » démarrait avec un **creux artificiel** au
tout début (dû au décalage constant qui relevait uniformément la courbe), ce qui ne correspondait à aucune
réalité physiologique et cassait la comparaison pédagogique avec « redescend seule ».

**Alternatives envisagées**

- Garder le décalage constant et recaler seulement son amplitude → rejeté : ne peut pas produire un départ
  **plat et identique** aux deux situations tout en gardant une divergence après le pic (le décalage agit
  dès `t=0`).

**Raison du choix**

`exces` n'est consommé **que** par `sampleRepasAvecBolus` (temps ④ insuline rapide) — gater son application
dans le temps est un levier lib chirurgical, sans impact sur les 8 autres modules diabète ni sur les autres
usages de `glycemieCurve.ts`.

**Conséquences**

- `glycemieCurve.test.ts` : les 4 invariants existants du point 12 passent inchangés + **1 nouvel
  invariant** « excès nul avant le pic » (96/96 tests verts au global).
- Constantes du module recalées (`REPAS_CUMUL`, `DOSE_BASE_CUMUL`, `DOSE_RECORRECTION`,
  `EXCES_SITUATION_B`, `RECORR_DELAIS`), toutes `// à revalider (Thibault)`.
- Docs de `exces`/`sampleRepasAvecBolus` mises à jour dans la lib.

### Décision ④ — Plan d'arrêt : stratégie en mémoire, libellés seuls, aucun protocole inventé

**Décision**

Le sélecteur de stratégie « Arrêt complet / Réduction progressive » (point 9) n'adapte **que les libellés**
de la section « 1. Ma date » (titre + aide de la date). Le champ `strategie: 'complet' | 'progressive' |
null` vit dans `SelectionContext`, **en mémoire uniquement** (jamais localStorage), inclus dans le reset.
Aucune génération de protocole, palier chiffré ou calendrier de réduction — le livret (`buildLivretSections`)
reste inchangé en v1.

**Contexte**

Point 9 de la revue guidée : les deux stratégies sont « également valables » (Thibault) mais aucun contenu
clinique de protocole de réduction n'a été fourni ni sourcé — inventer des paliers chiffrés violerait
l'invariant 5 (exactitude médicale, signaler plutôt qu'inventer).

**Raison du choix**

Portée v1 délibérément minimale : donner au patient le choix de nommer sa stratégie sans que Claude
n'invente de contenu médical non sourcé. Le livret inchangé évite de propager un texte non revalidé dans un
document imprimé.

**Conséquences**

- Tout texte affiché par ce sélecteur est annoté `// à revalider (Thibault)`.
- Extension future (protocole de réduction réel) possible sans casser l'API : le champ `strategie` existe
  déjà dans le contexte partagé.

### Décision ⑤ — Les 4D activés un par un, la vague de l'envie visible par défaut

**Décision**

Correctif de séance : dans `VagueCraving.tsx` (Boîte à outils), l'état `activeDs: Set<DKey>` (plusieurs D
affichables simultanément) devient `activeD: DKey | null` (un seul D actif à la fois). Par défaut, aucun D
n'est actif — la **vague de l'envie** est dégagée, entourée de 4 pastilles compactes (titres seuls). Cliquer
une pastille affiche son contenu **superposé sur la vague** ; re-cliquer la même pastille revient à la vague
seule.

**Contexte**

Retour visuel de Thibault : les 4 D affichés en permanence encombraient l'écran et masquaient la vague, qui
est l'élément pédagogique central de l'outil (montrer que l'envie monte puis redescend seule).

**Raison du choix**

Activation exclusive = même geste (clic sur une pastille) mais hiérarchie visuelle clarifiée : la vague
reste la référence constante, chaque D est une aide consultée ponctuellement, pas un mur de texte permanent.

**Conséquences**

- Contenu (`D_INFO`, fiche « Ma carte anti-envie ») strictement inchangé — retouche d'état/présentation
  uniquement.
- Pattern réutilisable si un futur outil a besoin d'un « détail exclusif superposé sur un visuel de
  référence ».

### Décision ⑥ — Insuline basale en écran unique : abandon des onglets (remplace l'alignement prévu sur la rapide)

**Décision**

Correctif de séance, décision Thibault : au lieu d'aligner la navigation de l'insuline **basale** sur les
onglets de l'insuline **rapide** (point 10 du rapport, idée initiale), les onglets de la basale sont
**entièrement retirés**. `InsulineModule.tsx` perd sa machinerie `tablist`/`tab`/`tabpanel` ; le bloc
« Décider » (situations → réponse → résultat) est désormais **toujours visible**, en un seul écran continu.
`scenarios.ts` (logique métier) reste **intact** ; l'insuline **rapide** demeure le module de référence pour
la présentation par onglets (S6 de ce même chantier a justement aligné la rapide sur le **patron visuel**
`.situationCard` de la basale — décision indépendante, toujours valide).

**Contexte**

En observant le rendu de S6 (encadré `.situationCard` posé sur la rapide, inspiré de la basale), Thibault a
jugé que les 2 « temps » de la basale n'étaient qu'un **découpage artificiel** : la courbe de glycémie était
de toute façon déjà visible en permanence dans les deux onglets, l'onglet n'apportait donc aucune valeur de
navigation réelle.

**Alternatives envisagées**

- Aligner la nav de la basale sur les 4 onglets de la rapide (idée initiale du point 10) → écartée en
  cours de séance : aurait ajouté de la structure là où Thibault a jugé qu'il fallait au contraire en
  retirer.

**Raison du choix**

Simplifier au lieu de complexifier : un seul écran continu réduit le nombre de clics et rend la courbe +
le bloc « Décider » visibles simultanément sans bascule d'onglet.

**Conséquences**

- `InsulineModule.module.css` : CSS d'onglets nettoyé (classes `tablist`/`tab`/`tabpanel` retirées).
- Prop `nav` de `ModuleShell` non passée par ce module (retour au chemin par défaut du shell).
- Aucune régression de logique : `scenarios.ts`, `AJUSTEMENT_RESULT`, la matrice `DECIDER_MATRICE`
  restent inchangés — retouche strictement présentation/navigation.
- Documente pour les futurs chantiers : « aligner deux modules visuellement » n'implique pas de leur
  imposer la **même** structure de navigation si l'un des deux n'en a pas besoin.


## 2026-07-15 — Scopage de la persistance par contexte (consultation vs app patient)

### Décision

L'invariant #1 de `CLAUDE.md` (« zéro persistance ») s'applique désormais **à la consultation uniquement**.
Nouvelle architecture de persistance scopée :
- **Consultation** (bundle `consultation`) : zéro donnée stockée (localStorage, cookies, base, réseau). Interaction éphémère. La dose de titration pour le livret vit en mémoire de session (`SelectionContext`), jamais sur disque.
- **App patient** (bundle `patient`) : persistance locale **autorisée** — localStorage sur l'appareil du patient pour ses données personnelles (titration patch, carnet de suivi). Aucune donnée réseau. Bouton d'effacement et repli silencieux si stockage indisponible.

### Contexte

Deux usages distincts : consultation (poste partagé, données sensibles, sécurité RGPD maximale) vs app patient mobile (outil personnel du patient, données confidentielles sur son appareil). La décision initiale « zéro persistance partout » était surestrictive pour l'app patient.

### Alternatives envisagées

1. Persistance globale (localStorage partout) → risque RGPD en consultation sur poste partagé.
2. Zéro persistance partout → app patient inutilisable (patient ne peut pas conserver sa titration).
3. Backend synchronisé → viole l'invariant local-first et ajoute une dépendance réseau.

### Raison du choix

Maximiser l'utilité de l'app patient tout en préservant la sécurité de la consultation (contexte partagé). Les bundles sont isolés : aucune fuite de localStorage consultation vers patient ou vice-versa.

### Conséquences

- `src/patient/lib/storage.ts` : utilitaire localStorage typé + garde SSR/erreurs (storage indisponible gérée).
- Titration patch côté consultation : mémoire de session (`SelectionContext.titrationPatch`).
- Titration patch côté patient : localStorage (`etp.patient.titrationPatch`).
- Carnet de suivi patient : localStorage (`etp.patient.carnetConso`), liste d'entrées `{ id, dateHeure, contexte, ressenti }`.

### Impact IA

- Contexte : modéré (deux modèles de persistance à maintenir, bien délimités).
- Tests : storage.test.ts sur le repli (indisponibilité du stockage).
- Documentation : invariant #1 de CLAUDE.md amendé et scopé.

## 2026-07-15 — Composant TitrationPatch partagé, A5 partout, priorisation outils, situations par pilier, respiration et carnet patient

Voir plans/revue-chrome-2026-07/index.md §Décisions structurantes pour l'ensemble des 11 décisions du chantier revue-chrome-2026-07 (S1-S18, 2026-07-15).

## 2026-07-21 — Chantier outils-interactifs-2026-07 : registre d'outils interactifs, persistance injectée, gates G1-G5

### Décision

Rendre interactifs 11 des 14 outils de « Stratégies & outils » (thème tabac), jusqu'ici de simples fiches
à lire (seul `outil-vague-4d` était réellement interactif, `outil-respiration` à moitié — câblé côté
patient seulement). Décisions structurantes (détail complet dans
`plans/outils-interactifs-2026-07/index.md` §Décisions structurantes) :

1. **Registre `interactif → composant`.** `OUTILS_INTERACTIFS: Partial<Record<Outil['interactif'],
   ComponentType<OutilInteractifProps>>>` (`src/features/tabac/boite-a-outils/outils-interactifs/
   registry.ts`) remplace le test en dur `interactif === 'vague4d'` de `BoiteAOutilsModule.tsx`. Les deux
   bundles (consultation, patient) consomment ce même registre pour afficher le bouton de lancement et
   monter le composant avec leur propre `store`.
2. **Composants bundle-agnostiques + persistance injectée.** Chaque outil interactif reçoit une prop
   `store: OutilStore` (`get(key)`/`setList(key, values)` sur des `string[]`) fournie par le bundle :
   consultation → `useConsultationStore` (adaptateur sur `SelectionContext`, mémoire de session, invariant
   #1 maintenu) ; patient → `usePatientStore` (adaptateur sur `localStorage`, clés `etp.tabac.<clé>`).
   Précédent d'extraction paramétrée : `TitrationPatch` (revue-chrome-2026-07).
3. **Un seul champ de données perso générique.** `SelectionState` gagne `outilsData: Record<string,
   string[]>` (+ action `SET_OUTIL_DATA`), clé = `outil.id` (ou `outil.id.sous-clé`) — au lieu d'un champ
   dédié par outil. Côté patient, mêmes clés sous `etp.tabac.<clé>` en `localStorage`.
4. **Contexte injecté en lecture seule.** `OutilInteractifProps.contexte?: { situationsActives?,
   raisons? }`, rempli par le bundle (consultation depuis `SelectionState` ; patient depuis l'écran
   courant) — jamais d'écriture par ce canal, l'écriture passe exclusivement par `store`.
5. **La fiche imprimée affiche le perso.** Dans « Ma boîte à outils », un outil coché dont
   `outilsData[outil.id]` est non vide affiche ces lignes ; sinon repli sur `consigneFiche` (comportement
   d'origine).
6. **Gates G1-G5, toutes tranchées le 2026-07-21** :
   - **G1** — tous les outils interactifs exposés côté app patient (extension du cadrage « lecture seule
     sauf respiration » de la v1 patient, `revue-chrome-2026-07/S15`).
   - **G2** — SI… ALORS… : déclencheurs « SI » = situations sélectionnées par le patient + saisie libre ;
     parades « ALORS » = suggestions reliées aux autres outils de la boîte + saisie libre.
   - **G3** — Tirelire : prix du paquet par défaut 12 €, `cigsParPaquet` défaut 20.
   - **G4** — Checklists : items suggérés pré-remplis (restructurés depuis `proposition`) + ajout libre,
     listes figées.
   - **G5** — Journal : app patient → renvoi vers le carnet existant (`PatientCarnet`, pas de doublon) ;
     consultation → gabarit hebdo imprimable, aucune persistance.

### Contexte

Source du besoin : revue produit de Thibault sur l'app déployée (2026-07-21) — 12 des 14 outils de la
boîte à outils n'étaient que des fiches à lire, sans que le patient « fasse » quelque chose. Chantier
exécuté en 3 vagues : S1 (socle, solo) → S2-S7 (un outil/archétype par session, parallèles) → S8
(consolidation, cette session).

### Alternatives envisagées

- Un champ de persistance dédié par outil (plutôt qu'`outilsData` générique) → écarté : aurait multiplié
  les champs de `SelectionState` à chaque nouvel outil interactif futur, alors qu'une seule map indexée par
  `outil.id` suffit et généralise sans reconception.
- Garder l'app patient « lecture seule » (hors respiration) → écarté par la gate G1 : incohérent avec un
  registre partagé entre les deux bundles (un outil interactif dans un seul bundle aurait nécessité un
  second mécanisme de câblage, plus de complexité pour moins de valeur patient).

### Raison du choix

Un seul registre + un seul contrat de persistance injectée permettent d'ajouter un futur outil interactif
sans toucher au moteur (`BoiteAOutilsModule.tsx`, `PatientSituations.tsx`) : créer un composant + une
entrée de registre suffit.

### Conséquences

- 14 outils sur 14 sont désormais soit interactifs (13, dont les 2 préexistants), soit un renvoi assumé
  (`outil-substituts`, vers le module Substituts).
- Aucune dépendance runtime ajoutée ; gate finale `tsc --noEmit` + `npm run build` (2 entrées) + `npm test`
  101/101 verts.
- Trois points remontés par les exécutants pendant l'exécution, non couverts par l'index, consignés
  ci-dessous.

### Impact IA

- Ajouter un futur outil interactif : créer un composant respectant `OutilInteractifProps` + une entrée
  dans `registry.ts` + un marqueur `interactif` sur l'`Outil` concerné dans `outils.ts` — aucune
  modification du moteur (`BoiteAOutilsModule.tsx`/`PatientSituations.tsx`) n'est nécessaire.
- `registry.ts` est stable depuis OI3 (S1) : aucune session S2-S7 n'y a retouché — seul le fichier du
  composant change quand son corps métier est implémenté.

---

### a. Tension d'architecture assumée : le bundle patient importe désormais `src/features/tabac/**`

**Constat.** `PatientSituations.tsx` (et le nouveau `usePatientStore.ts`) importent depuis
`src/features/tabac/boite-a-outils/outils-interactifs/` (le registre `OUTILS_INTERACTIFS` + le type
`OutilStore`), alors qu'un principe antérieur documenté dans `plans/aide-patient/index.md` §Architecture
cible interdisait à l'app patient d'importer `src/features/**` (séparation physique du code, vérifiée par
grep post-build, pour garantir que l'entrée patient ne tire jamais un module de consultation).

**Décision.** C'est une conséquence **assumée** de ce plan, pas une anomalie : le registre partagé entre
les deux bundles (décision structurante n°1 ci-dessus) et la gate G1 (tous les outils interactifs exposés
côté patient) n'ont de sens que si les deux bundles consomment le **même** registre — dupliquer le
registre côté patient aurait signifié maintenir deux listes d'outils interactifs en parallèle, source de
divergence future. `VagueCraving` (déjà sous `src/features/tabac/...` depuis le chantier `boite-a-outils`)
devient d'ailleurs lui aussi un outil patient via ce même registre, ce qui n'aurait aucun sens sans cet
import.

**Portée de l'amendement.** Strictement limitée au sous-arbre `outils-interactifs/` (registre + types +
composants) : l'interdiction reste entière pour tout **module** de consultation (`src/features/tabac/
<module>/*Module.tsx`) et pour le moteur de navigation (`src/features/registry.ts`, `App.tsx`) — le grep
post-build de vérification (mentionné dans `PROJECT_MAP.md` Feature 4bis) doit désormais exclure
`outils-interactifs/` de son périmètre d'alerte, pas être supprimé.

**Impact IA.** Si un futur outil interactif a besoin d'un composant vraiment spécifique à la consultation
(jamais monté côté patient), il doit vivre hors de `outils-interactifs/` et ne pas entrer dans le registre
partagé — sinon il sera importé par les deux bundles.

### b. Checklist « place-nette » : pas de 3ᵉ groupe « Travail » — point ouvert

**Constat.** La section « Décision clé » de `plans/outils-interactifs-2026-07/S4.md` mentionnait des
groupes « Maison / Voiture / Travail » pour la checklist place-nette, mais la liste concrète tranchée
(« Listes figées (G4) », étape 1 du même fichier) ne détaille que Maison et Voiture — cohérent avec
`outil-place-nette` dans `content/tabac/outils.ts`, qui ne parle pas du travail.

**Décision.** L'exécutant de S4 a suivi la liste concrète, plus récente et explicitement marquée
« G4 TRANCHÉ », plutôt que d'inventer un contenu « Travail » non sourcé. `data/checklists.ts` ne contient
donc que 2 groupes pour `place-nette`.

**Point ouvert — à revalider (Thibault)** : si un 3ᵉ groupe « Travail » était réellement voulu, il reste à
définir son contenu (items suggérés) et à l'ajouter à `CHECKLISTS['place-nette'].groupes` dans
`data/checklists.ts` — changement localisé, aucune reconception du composant `OutilChecklist`.

### c. Tirelire — valeur par défaut de `cigsParJour` non tranchée par la gate G3

**Constat.** La gate G3 (`plans/outils-interactifs-2026-07/index.md`) tranche le prix du paquet par
défaut (12 €) et le nombre de cigarettes par paquet (20), mais pas la valeur de démarrage de
`cigsParJour` (le premier champ que voit le patient à l'ouverture de l'outil).

**Décision.** L'exécutant de S3 a choisi **10** comme valeur neutre de démarrage, ajustable immédiatement
par les boutons ± ou par saisie directe — sans incidence sur le calcul ni sur la validation humaine du
plan (qui teste explicitement à 15 cig/j).

**Portée.** Détail mineur, non bloquant : à ajuster si Thibault préfère une autre valeur de départ (la
constante `DEFAULT_CIGS_PAR_JOUR` dans `Tirelire.tsx` est le seul point à changer).

## 2026-07-21 — Chantier insuline-affinements-2026-07 : 6 items de revue prod, gates G1-G5

### Décision

Traiter 6 défauts/manques remontés en revue prod par Thibault sur les modules diabète Insuline
basale (9) et rapide (10), jugés solides mais avec quelques trous et un peu de polish restant. Cinq
gates tranchées le 2026-07-21, toutes en amont de l'implémentation (S1 solo → vagues S2‖S3 → S4‖S5) :

- **G1 — contenu neuf sourcé avant code.** `docs/diabete/09-insuline-basale.md` (créé) + section
  « rapide sans repas » du `10`, rédigés en S1 depuis les réponses OpenEvidence de Thibault
  (`PROMPT-OPENEVIDENCE.md`), puis validés par Thibault le jour même — débloque S4/S5.
- **G2 — item 1 (régularité/horaire) : message générique, sans molécule.** Pas de sélecteur de
  molécule ni de promesse de flexibilité (dangereuse pour la glargine U100) — cohérent avec le
  retrait antérieur du sélecteur de profil basale (S3, chantier `revue-chrome-2026-07`). Un renvoi
  « ça dépend de ton insuline → soignant » remplace la différenciation.
- **G3 — item 6 (slider timing) : slider continu + libellé dynamique.** Le contrôle segmenté a été
  écarté (préserve le geste « course », cohérent avec le slider du module 3 Activité). La valeur du
  slider devient la source de vérité unique via `timingPhase(delay)` : `timingHint` (message) et le
  libellé sous le curseur en dérivent tous deux — fin des 4 étiquettes fixes équiréparties qui ne
  correspondaient pas aux seuils réels.
- **G4 — item 5 (creux sous baseline) : retouche du modèle, pas de la dose.** `DOSE_ADEQUATE` avait
  déjà été abaissée une fois (0.5→0.40, chantier `corrections-revue-guidee`) sans régler le fond du
  problème (creux sous la *baseline*, pas seulement sous la *bande*). Cette fois, correction de
  l'alignement effet-bolus/montée-repas dans `sampleRepasAvecBolus` : un garde-fou local borne la
  soustraction de l'effet bolus par l'excès de glycémie réellement disponible tant que le repas n'a
  pas commencé à monter (piste (a) du plan, retenue car la moins invasive — la piste (b), ré-aligner
  la latence du bolus, aurait changé le comportement pour tous les cas). 5 nouveaux invariants de
  test, aucun invariant existant assoupli (dont « invariant 10 », dose unique vs cumul, resté intact).
- **G5 — item 2 (profondeur du scénario « sans repas ») : 5ᵉ onglet distinct.** `⑤ Et si je ne mange
  pas ?`, pas une variante du ④ (qui traite le cumul) — la sémantique est différente (repas sauté vs
  double dose). Positionnement (après le ④) laissé `// à revalider (Thibault)` — validation visuelle.

### Contexte

Revue produit de Thibault le 2026-07-21 sur les deux modules Insuline, déjà proches de l'idéal
(courbes justes, actionnables) mais avec des trous ponctuels : pas de dimension régularité/horaire
côté basale, pas de scénario « rapide sans repas » (cause d'hypo fréquente) côté rapide, un artefact
visuel (creux sous baseline) et une incohérence étiquette/message/marqueur sur le slider de timing.

### Alternatives envisagées

- Sélecteur de molécule pour l'item 1 (régularité) → écarté (G2) : risque de conseil dangereux si mal
  calibré par molécule (ex. flexibilité horaire de la glargine U100), alors qu'un message générique +
  renvoi soignant est sûr par construction.
- Contrôle segmenté pour le slider timing (item 6) → écarté (G3) : casse la grammaire déjà partagée
  avec le module 3 Activité et le geste « course » plus expressif qu'un choix à 4 valeurs discrètes.
- Réglage de dose (encore) pour le creux sous baseline (item 5) → écarté (G4) : déjà tenté une fois
  sans résoudre le problème de fond (artefact d'alignement temporel, pas de calibrage).
- Variante du temps ④ pour le scénario « sans repas » (item 2) → écarté (G5) : sémantiquement
  distinct du cumul (④), un onglet dédié évite de surcharger un mécanisme déjà chargé.

### Raison du choix

Corriger la cause structurelle plutôt que le symptôme dans chacun des deux cas techniques (slider :
double source de vérité → source unique ; courbe : mauvais alignement temporel → garde-fou algébrique
exact, pas un réglage empirique de plus) ; garder les messages cliniques sûrs par défaut (générique,
sans molécule) là où le risque d'erreur est le plus élevé (item 1).

### Conséquences

- `src/features/diabete/insuline-rapide/InsulineRapideModule.tsx`/`.module.css` : `timingPhase(delay)`
  (S2) + 5ᵉ onglet « Et si je ne mange pas ? » (S5) — mêmes fichiers touchés par les deux sessions,
  qui se sont enchaînées sans commit intermédiaire (mode vague parallèle, commits différés à S6) ;
  `git add -p` n'étant pas utilisable en environnement d'exécution non interactif, **les deux tâches
  (IA3 + IA6) ont été committées ensemble** sur ces deux fichiers, plutôt qu'un commit strictement par
  tâche — écart assumé au principe général « un commit par tâche » du fait de la contrainte technique,
  pas d'un choix de conception.
- `src/features/diabete/lib/glycemieCurve.ts`/`.test.ts` : garde-fou local dans
  `sampleRepasAvecBolus`, API exportée inchangée (signatures gelées respectées).
- `src/features/diabete/insuline/InsulineModule.tsx`/`.module.css` : 3 ajouts sobres (intro, carte
  régularité, phrase-pont) au-dessus du jeu de titration existant, qui reste inchangé.
- **Phrases-pont (item 8) non identiques.** S4 (basale) et S5 (rapide) ont chacune rédigé leur
  phrase-pont depuis le même doc source (S1), conceptuellement cohérentes (même paire journée
  entière/un repas) mais formulées différemment (verbes/ordre) — S5 a comparé les deux en fin de
  session (S4 ayant terminé en premier) sans les harmoniser mot pour mot, jugeant le ton propre à
  chaque module acceptable. **Point ouvert, arbitrage Thibault** : garder les deux formulations
  telles quelles ou les harmoniser (cf. `VALIDATION.md`).

### Points ouverts (à revalider Thibault)

- Bornes du slider timing (S2) : seuil `bien-avant` (≤-30), bascule `juste-avant`/`au-moment`.
- Tolérance visuelle exacte du garde-fou bolus (S3) — garantie algébrique, pas de seuil calibré à
  ajuster, mais la validation visuelle du rendu reste à faire.
- Micro-copie intro/régularité/pont du module basale (S4) — dérivée du doc validé G1 mais libellé
  final non figé.
- Positionnement du 5ᵉ onglet (après le ④), note post-prandiale (paraphrase), micro-copie pont (S5).
- Harmonisation ou non des deux phrases-pont (S4 vs S5, cf. Conséquences ci-dessus).

### Impact IA

- `glycemieCurve.ts` reste la lib d'autorité partagée (modules 2/3/8/9/10) : toute future retouche du
  modèle bolus doit revalider les 5 invariants `IA4 — garde-fou pré-repas` ajoutés ici, en plus des
  invariants préexistants (dont « invariant 10 »).
- Si Thibault tranche l'harmonisation des phrases-pont, ne modifier que les deux constantes
  `PONT_TEXTE` respectives (`InsulineModule.tsx`, `InsulineRapideModule.tsx`) — aucune reconception.
- `docs/diabete/09-insuline-basale.md` devient l'autorité de contenu du module basale (au même titre
  que le `10` pour la rapide) — à lire avant toute future modification du module 9.

## 2026-07-22 — Nouveau thème `cardio` (« Prévention cardiovasculaire ») : composants cardio-owned, porte inter-thèmes en repli, gate contenu G1

### Décision

3ᵉ thème du moteur multi-thèmes (après tabac, diabète), câblé depuis un handoff Claude Design
(`design/Mosule cardio ETP interactif-handoff.zip`, prototype `ETP Cardio - Prototype.dc.html`, 12
modules) et le brief/evidence cliniques (`docs/cardio/`). Prévention **primaire** uniquement
(secondaire — post-infarctus/AVC, réadaptation, DAPT — hors v1). Quatre décisions structurantes,
tranchées avec Thibault le 2026-07-22 avant le fan-out des modules :

1. **Composants cardio-owned, pas de généralisation immédiate.** `ArtereCoupe` (artère réversible
   riche : dépôt, rupture, caillot, paroi renforcée) et `CockpitFeux` (cumul multiplicatif) vivent
   dans `src/features/cardio/components/`, découplés du diabète — même précédent que
   `IllustrationSlot` dupliqué par thème (cf. décision « Duplication assumée d'IllustrationSlot par
   thème », S1 illustrations-diabete). `Silhouette` réutilise le moteur générique `SilhouetteCorps`
   (wrapper mince, comme le diabète) ; le composant diabète `PlaqueArtere` n'a **pas** été réutilisé
   pour l'artère cardio : il ne dessine que le dépôt (`encrassement` 0→1), sans réversibilité ni
   rupture — insuffisant pour le brief cardio (réversibilité = message d'espoir non négociable).
2. **Porte inter-thèmes (M2→diabète, M6→tabac) : repli visuel, pas d'extension moteur.** La nav
   actuelle est strictement intra-thème (`onNavigate` reste sur le `themeId` courant ; seul chemin
   inter-thèmes = revenir au `ThemeSelector`). Les modules 2 et 6 affichent une mention informative
   non-navigante (« → Un parcours dédié existe dans le thème Diabète/Tabac ») plutôt que d'étendre
   `App.tsx`/`types.ts` (moteur partagé par les 3 thèmes, donc plus sensible). Extension réactivable
   plus tard si le besoin se confirme à l'usage.
3. **Module 12 « Mon suivi » = « mes 3 chiffres », pas le cadran annuel du diabète.** Le brief
   signalait lui-même le risque qu'un cadran annuel paraisse vide en prévention primaire (suivi léger,
   réévaluation tous les 3-5 ans). Grille de voyants légère (tension/LDL/tour de taille) retenue à la
   place, jamais de rouge (le rouge-santé reste réservé aux modules 2/4/5).
4. **Aspirine : jamais mentionnée à l'écran (modules 10 et 11).** Le rapport OpenEvidence (Complément
   K) mentionnait l'aspirine 160-325 mg « si disponible, en attendant » pour l'infarctus ; le brief
   posait explicitement le piège inverse (ne pas la banaliser). Arbitré en faveur de la **sûreté** :
   l'aspirine est contre-indiquée si l'accident est en réalité un AVC hémorragique, indiscernable sans
   imagerie — un panneau de survie ne peut pas se permettre cette ambiguïté. Le geste unique enseigné
   est « appelez le 15 (ou 112) » ; le module 11 (traitements) retire l'antiagrégant de sa table de
   classes (pas de comparaison/choix de molécule de toute façon, mais éviter jusqu'à la mention).

**Gate contenu (G1, verrou dur avant tout module).** `docs/cardio/CONTENU_cardio.md` distille le brief
+ les 2 rapports OpenEvidence (socle/complément) en un doc par module (message écran / 2ᵉ niveau
sourcé / calibrage jamais affiché / pièges / sources). Plusieurs seuils du brief se sont révélés **non
confirmables** par les rapports (tables ESC dégradées au copier-coller) : les cibles LDL en g/L
(`< 1,0` / `< 0,7`) et le seuil tensionnel « consultation < 140/90 ». Thibault a tranché le 2026-07-22 :
**jamais de cible LDL ou tensionnelle chiffrée à l'écran** (seuils modulés selon le niveau de risque
CV, hors écran) plutôt que d'attendre un re-sourçage ; **AMT < 135/85 conservé** (sourcé, solide) avec
le message « une seule mesure ne suffit pas » ; **sel** = message qualitatif seul, aucun g/j ; **alcool**
= repères Santé Publique France verbatim (« moins de 2/jour, pas tous les jours, ≤ 10/semaine »), sans
affirmer plus fort que le rapport (courbe en J *contestée*, pas réfutée). Seule réserve non bloquante :
les fréquences de suivi du module 12 restent `// à revalider (Thibault — HAS)`.

### Contexte

Précédent le plus proche : câblage du thème diabète (`plans/theme-diabete/`, 2026-07-09) — même
schéma (handoff Claude Design → registre de thème → modules), mais diabète n'avait pas de contenu
clinique aussi disputé (plusieurs seuils cardio se sont révélés dégradés/perdus dans le traitement du
rapport OpenEvidence, ce qui n'était pas arrivé aux rapports diabète/tabac).

### Alternatives envisagées

- Généraliser `ArtereCoupe`/`CockpitFeux` dans `src/components/` dès le câblage initial — écarté :
  aurait obligé à retoucher le module diabète existant (Risque cardiovasculaire) et à le retester,
  sans bénéfice pour un thème qui vient de naître. Peut être fait plus tard si un 3ᵉ usage émerge.
- Étendre le moteur pour une vraie porte inter-thèmes dès v1 — écarté : `App.tsx`/`types.ts` sont
  partagés par tabac et diabète ; le gain (un clic de moins) ne justifiait pas le risque de régression
  sur les deux thèmes existants pour une v1.
- Reprendre le cadran de l'année du diabète pour M12 — écarté par le brief lui-même (suivi léger en
  primaire, cadran risquant de paraître vide) et confirmé par Thibault.
- Afficher l'aspirine en 2ᵉ niveau seulement (comme initialement proposé par l'exécutant de S1) —
  écarté par Thibault : même en survol, la mention crée un risque de rappel erroné en situation
  d'urgence réelle ; la sûreté prime sur l'exhaustivité informative.

### Raison du choix

Cohérence avec l'invariant multi-thèmes (ne pas complexifier le moteur partagé pour un seul thème
naissant), et primauté de la sûreté clinique sur l'exhaustivité du contenu quand une source se révèle
dégradée ou ambiguë (mieux vaut un message qualitatif sourcé qu'un chiffre halluciné ou un rappel
dangereux sous stress).

### Conséquences

- `src/features/cardio/components/` et `src/features/cardio/lib/risqueCardio.ts` (21 invariants
  testés) sont la source de vérité du cumul multiplicatif et de la géométrie de plaque — toute
  retouche visuelle de l'artère doit passer par la lib, jamais par un composant de module.
- Les modules 2 et 6 portent chacun leur propre mention de repli (pas de composant partagé pour
  l'instant) — si une vraie porte inter-thèmes est développée plus tard, factoriser à ce moment-là.
- Aucune occurrence du mot « aspirine » ne doit apparaître dans un texte affiché des modules 10/11
  (vérifié par grep à la consolidation — seules des mentions en commentaire de maintenance
  subsistent) ; toute future évolution de ces modules doit préserver cet invariant.
- Les fréquences de suivi du module 12 (`SuiviModule.tsx`) sont marquées `// à revalider (Thibault —
  HAS)` — non bloquant, mais à trancher avant de considérer le module définitivement clos.

### Points ouverts (à revalider Thibault)

- Formulation exacte des signes atypiques d'infarctus (module 10, équilibre sensibilité/fausses alertes).
- Position du repère « > 5 min » (module 10) : laissé en sous-texte toujours visible faute de
  mécanisme de survol adapté à une carte de survie ; le doc de contenu posait la question ouverte de
  le remonter au 1ᵉʳ niveau.
- Accroche d'ouverture du module 8 (« l'assiette méditerranéenne soigne les artères ») : message
  patient non fourni par le rapport OpenEvidence, proposition de l'exécutant à juger par Thibault.
- Fréquences de suivi du module 12 — confirmation HAS.
- Validation visuelle des modules 4-12 (le pilote 1-3 est déjà validé, cf. `VALIDATION.md`).

### Impact IA

- `docs/cardio/CONTENU_cardio.md` devient l'autorité de contenu du thème cardio (au même titre que
  `docs/diabete/00-global.md` pour le diabète et `docs/contenu-modules-tabac.md` pour le tabac) — à
  lire avant toute future modification d'un module cardio, ne jamais réécrire son contenu depuis un
  module.
- Ne jamais réintroduire de valeur chiffrée (LDL, tension, sel, alcool) directement à l'écran d'un
  module cardio sans repasser par une gate de contenu équivalente à G1 — le précédent (tables ESC
  dégradées) montre que ces seuils sont un point de fragilité connu du pipeline evidence → contenu.
- Si un jour la porte inter-thèmes réelle ou la généralisation des composants sont entreprises,
  documenter la décision ici plutôt que de la coder silencieusement (les deux ont été explicitement
  écartées pour v1, pas oubliées).

## 2026-07-23 — Revue prod cardio (1ʳᵉ passe) : sédentarité remplace poids, tabac binaire, camembert à 3 frontières généralisé au diabète

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

