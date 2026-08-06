# Plan `recette-outils-2026-08` — suites de la recette « outils & modules » (2026-08-06)

> Source : recette conduite au navigateur in-app le 2026-08-06 sur le module tabac
> « Stratégies & outils » (13 identifiants d'outils sur 14 exercés en marche), les modules
> diabète Alimentation/Activité, cardio Manger/Bouger, et l'app patient.
> **Niveau de preuve** : `N1` = constaté au navigateur · `N2` = jugement à trancher (Thibault).

## Contexte

La recette confirme que **les outils interactifs eux-mêmes sont solides** : minuteurs réels
(décomptes vérifiés), invites temporisées de `surfer` observées en direct à 45 s, calcul de la
tirelire juste et gardé (`min=1`), repli mobilité réduite du minuteur `bouger`, bifurcation
consultation/patient de `GabaritJournal` sur présence de prop (jamais par détection de bundle),
suggestions éditables des checklists avec `aria-label` corrects. **Aucun défaut fonctionnel
bloquant.** Ce plan traite la plomberie autour des outils, deux incohérences pédagogiques, et un
lot de finitions.

Deux faux positifs écartés en cours de recette, à ne pas rouvrir : l'accessibilité du garde-manger
diabète (l'`aria-label` double bien l'encodage couleur de la CG) et le « Poids / tour de taille »
de cardio Bouger (gate **G-M7-taille** tranchée le 2026-07-24, documentée en clair ligne 65).

## Décisions structurantes

**D1 — Le travail du patient doit atteindre sa fiche.** Aujourd'hui, composer 5 plans « SI… ALORS… »
laisse le compteur de fiche à `(0)` : le contenu n'y arrive que si l'on ressort du détail pour
cocher « Ajouter à ma fiche ». Le pipeline existe et fonctionne (ligne personnalisée vérifiée sur
la fiche) — il manque le dernier mètre. **G-fiche tranchée (2026-08-06)** : rattachement
automatique dès contenu personnalisé, *plus* la case sur la tuile pour les outils sans saisie.

**D2 — Un écran ne contredit jamais le geste du patient.** Cardio Manger : ajouter 6 légumes laisse
l'analyse afficher « Pas assez de légumes » (elle ne lit que le camembert, jamais les aliments).
**G-assiette tranchée (2026-08-06)** : l'analyse lira désormais **les deux** — les proportions du
camembert *et* la variété d'aliments déposés. Le camembert reste réglable à la main : il porte la
pédagogie des proportions, jumelle du défi 4 du diabète, et n'est pas sacrifié.

**D3 — Aucun écran ne sanctionne un comportement que son propre texte valide.** Cardio Bouger :
`prot = actif ? 100 : max(0, prot − 45)` avec seuils 60/25 → le 2ᵉ jour de repos passe au **rouge**,
alors que le repère affiché dessous tolère « pas plus de 2 jours consécutifs ». **G-baremes
tranchée** : on adoucit la décroissance, le repère ne bouge pas. Cas voisin de la liste anti-ennui
(cible 10 pour 6 suggestions) — traité par l'ajout de 4 suggestions, pas par le retrait de la cible.

**D4 — Une promesse affichée doit avoir un mécanisme.** Le carnet patient annonce « repérer vos
moments à risque » sans aucune agrégation (0 occurrence de `reduce`/`groupBy`). **G-carnet
tranchée** : synthèse minimale à 3 agrégats, sans courbe de progrès ni objectif.

## Sessions

| Session | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | Finitions de vocabulaire & code mort (5 correctifs, dont anti-ennui) | Haiku | low | — | `VagueCraving.tsx`, `PhraseRefus.tsx` (+`.module.css`), `AlimentationModule.tsx`, `checklists.ts` | [x] fait 2026-08-06 · N1 vérifié navigateur · anti-ennui complété à 10/10, libellés validés Thibault |
| S2 | Fiche « Ma boîte à outils » : rattachement auto + case sur la tuile + débordement | Sonnet | medium | — | `BoiteAOutilsModule.tsx` + `.module.css` | [ ] |
| S3 | Cardio Bouger : barème adouci + test unitaire de la table de vérité | Sonnet | low | — | `BougerModule.tsx`, `cardio/lib/protectionSemaine.ts` (créé) + test | [x] fait 2026-08-06 · N1 vérifié navigateur (Lundi+Jeudi actifs → jamais de rouge) · 4 tests unitaires ajoutés |
| S4 | Cardio Manger : analyse croisée aliments × proportions | Sonnet | high | libellés matrice | `MangerModule.tsx` + `.module.css` + test | [ ] |
| S5 | Carnet patient : synthèse « mes moments à risque » (3 agrégats) | Sonnet | medium | — | `PatientCarnet.tsx` | [ ] |
| S6 | Minuteurs : pause + cadrage « à faire chez vous » | Sonnet | low | — | `MinuteurGuide.tsx` (+css), `VagueCraving.tsx`, `RespirationGuidee.tsx` (+css), `BoiteAOutilsModule.tsx` | [x] fait 2026-08-06 · N1 vérifié navigateur (3 minuteurs : pause/reprise testées en direct, chrono gelé puis reparti) |
| S7 | Mutualisation des 13 activités diabète/cardio | Sonnet | medium | — | `src/content/activites.ts` (créé), `diabete/activite/data.ts`, `cardio/bouger/BougerModule.tsx` | [x] fait 2026-08-06 · N1 vérifié navigateur (13 activités identiques dans les deux modules) |
| S8 | App patient : tuile + détail au lieu du tout-déplié | Sonnet | high | — | `PatientSituations.tsx` + `.module.css` | [ ] |

> Toutes les gates étant tranchées, **plus aucune session n'est bloquée par un arbitrage**. Restent
> deux points de **contenu** (les 4 libellés anti-ennui en S1, la matrice de messages en S4) qui
> peuvent être livrés en dernier sans retenir le reste de leur session.

## Ordonnancement

Gates tranchées le 2026-08-06 → tout est exécutable. Zones de fichiers disjointes d'une vague à
l'autre : les 3 vagues sont parallélisables entre elles si besoin.

- **Vague 1 — rapide, faible risque** : **S3** (barème + test) · **S1** (finitions) · **S6**
  (minuteurs) · **S7** (mutualisation). S3 en tête : c'est le correctif le plus net cliniquement
  pour le moins de code.
- **Vague 2 — cœur fonctionnel** : **S2** (fiche) · **S4** (analyse croisée). Les deux plus
  structurantes ; S4 est la plus lourde du plan.
- **Vague 3 — app patient** : **S5** (synthèse carnet) · **S8** (tuile + détail). À enchaîner pour
  ne rouvrir le bundle patient qu'une fois et ne le revalider au mobile qu'une fois.

## Spécification par session

### S1 — Finitions (aucun arbitrage nécessaire)

1. **`VagueCraving.tsx`** — le bouton d'entrée de l'outil de crise dit « **Je ressens un craving** ».
   Le module a été renommé pour sortir du jargon ; la porte d'entrée l'a gardé. Remplacer par
   « J'ai une envie de fumer » (ou équivalent validé). *Cette occurrence n'est pas dans la liste
   de `TASKS.md`, qui ne cite que `registry.ts`, `NicotineModule.tsx`, `PlanArretModule.tsx` — c'est
   pourtant la plus exposée : premier mot lu par un patient en manque.* `N1`
2. **`PhraseRefus.tsx`** — le message de vigilance alcool apparaît deux fois sur le même écran
   (dans le `principe` en tête, puis en pied). Garder une seule occurrence. `N1`
3. **`AlimentationModule.tsx:995`** — `styles.levelDefault` n'existe pas dans le CSS module
   (0 occurrence) : la classe littérale `"undefined"` atterrit dans le DOM. Supprimer la référence
   ou créer la règle. Sans effet visuel. `N1`
4. **`checklists.ts`** — `anti-ennui` a `cible: 10` pour **6** suggestions : cocher tout affiche
   « 6 / 10 choisis », un déficit permanent. **Tranché** : porter la liste à **10 suggestions**
   (la cible reste). ⚠️ **Point de contenu — 4 propositions à valider par Thibault** avant
   câblage ; à défaut, S1 livre les 3 autres correctifs et laisse celui-ci ouvert :
   - « Sortir prendre l'air 5 minutes »
   - « Écouter de la musique »
   - « Faire la vaisselle »
   - « Prendre une douche »

   *Critères retenus pour la proposition : gratuit, sans matériel, court, physiquement
   incompatible avec la cigarette, et sans recouper une situation déclencheuse déjà listée
   (café, téléphone).* `N1` (le déficit) + `N2` (les 4 libellés)
5. Vérifier qu'aucune autre `cible` ne produit le même effet.

### S2 — Fiche « Ma boîte à outils » (G-fiche ✅ auto + case)

- **Rattachement automatique** : un outil rejoint `state.outilsFiche` dès que `store.setList` écrit
  une entrée non vide. Concerne 7 outils sur 14 (SI…ALORS, tirelire, les 4 checklists, phrase de
  refus) ; les 7 autres sont des minuteurs/exercices sans rien à conserver et retombent légitimement
  sur `consigneFiche`. **Réversible** : le retrait manuel reste possible, l'automatisme ne
  re-coche pas un outil que l'on vient de décocher (garder un drapeau « retiré à la main »).
- **Case « Dans ma fiche » sur la tuile**, prévue par `docs/contenu-modules-tabac.md` §Module 6
  (« carte = illustration + titre + accroche + case indépendante ») et absente du DOM (0
  `input[type=checkbox]` dans la grille). Aujourd'hui : 3 clics par outil, soit 15 clics pour 5
  outils. Cible : 1 clic, sans ouvrir le détail.
- **Débordement** : vérifié à 12 outils — les blocs 9 à 12 s'impriment **sans titre** (`index < 8`),
  laissant des consignes orphelines. Le rattachement automatique rendant le débordement **plus
  probable**, ce point n'est plus cosmétique : prévoir un plafond explicite, une typo réduite, ou
  une 2ᵉ page.

### S3 — Cardio Bouger, barème (G-baremes ✅ adoucir la décroissance)

Constaté au navigateur (Lundi + Vendredi actifs) : `[100 vert, 55 ambre, 10 rouge, 4 rouge,
100 vert, 55 ambre, 10 rouge]`. Le 1ᵉʳ jour de repos vire à l'ambre, le 2ᵉ au rouge — un patient
actif lundi et jeudi, **conforme** au repère affiché, voit du rouge. Contraire au principe
« jauge sans plafond, pas de barre objectif atteint/échoué » (brief M7).

**Le repère affiché ne change pas.** Régler `PROTECTION_DECAY` et/ou les seuils de
`protectionColor` pour que **2 jours de repos consécutifs restent au-dessus du rouge**, et que le
rouge ne survienne qu'au **3ᵉ** — c'est-à-dire quand le repère est réellement dépassé.
Piste : `DECAY = 30` avec seuils `55 / 20` → J+1 = 70 vert, J+2 = 40 ambre, J+3 = 10 rouge.
**Ajouter un test unitaire** figeant cette table de vérité (le fichier n'en a aucun aujourd'hui) :
c'est la garantie que le barème ne redivergera pas du repère.

### S4 — Cardio Manger, analyse croisée (G-assiette ✅ aliments + camembert)

Aujourd'hui le garde-manger ne fixe que l'**aliment représentatif** de chaque catégorie (seul le
dernier cliqué est retenu) et l'analyse ne lit que le camembert : ajouter 6 légumes laisse
« Pas assez de légumes » à l'écran.

**Cible.** Le camembert reste réglable à la main (pédagogie des proportions, jumelle du défi 4 du
diabète). L'analyse devient **croisée** — elle commente les proportions **et** ce que le patient a
réellement déposé :
- Conserver **tous** les aliments déposés par catégorie, pas seulement le dernier (c'est le
  prérequis technique : aujourd'hui `repFood` écrase). Le dernier reste la vignette affichée.
- Croiser les deux axes dans le message, sans jamais moraliser. Grammaire à écrire, par ex. :
  proportions bonnes + peu d'aliments → « De bonnes proportions ; variez les légumes » ·
  beaucoup de légumes + part faible → « De beaux légumes — laissez-leur plus de place » ·
  les deux bons → renforcement positif.
- ⚠️ **Point de contenu (Thibault)** : les libellés de la matrice croisée sont à valider, comme
  l'a été l'accroche du module. Ne pas inventer de seuil chiffré (invariant sel/graisses).
- Prévoir un **test unitaire** sur la fonction d'analyse (entrées → branche de message).

### S5 — Carnet patient, synthèse (G-carnet ✅ synthèse minimale)

Trois agrégats, et rien de plus :
1. **Répartition par tranche horaire** (matin / midi / après-midi / soir) — c'est elle qui fait
   apparaître les « moments à risque » promis par le libellé.
2. **Les 3 contextes les plus fréquents** parmi les saisies.
3. **Total sur 7 jours glissants.**

Contraintes : 100 % local (invariant #1, aucune sortie réseau) · **aucune courbe de progrès,
aucun objectif, aucune comparaison entre semaines** — le carnet observe, il ne note pas ·
la synthèse ne s'affiche qu'à partir d'un volume minimal de saisies (sinon elle donne
l'illusion d'un motif là où il n'y en a pas) · rester lisible sur mobile.
Le champ `contexte` étant aujourd'hui **libre**, prévoir soit un regroupement tolérant, soit des
suggestions de contexte à la saisie — sans quoi le top 3 sera ininterprétable.

### S6 — Minuteurs

- **Pause** sur les trois minuteurs (`MinuteurGuide` 600 s / 180 s, `VagueCraving` 180 s,
  `RespirationGuidee` 120 s) : aujourd'hui seulement « Arrêter », donc toute interruption
  (un appel, quelqu'un qui parle) impose de repartir de zéro — pénalisant sur les 10 minutes.
- **Cadrage** de « Bouger 10 minutes » : inadapté au temps de consultation, parfait côté patient,
  mais présenté comme les 13 autres. Ajouter une mention « à faire chez vous » (ou masquer le
  bouton de lancement côté consultation en gardant la fiche).

### S7 — Mutualisation des activités

Les 13 activités sont dupliquées verbatim (mêmes `id`, `nom`, `minutes`, `muscle`) entre
`diabete/activite/data.ts:64` et `cardio/bouger/BougerModule.tsx:46` — seul `intensite` diffère
(présent côté diabète uniquement). Extraire vers `src/content/activites.ts`, sur le modèle déjà
en place pour `repas-types.ts` et `tabac/substituts.ts`. `intensite` reste optionnelle.
Risque traité : dérive silencieuse à la prochaine revalidation clinique.

### S8 — Densité de l'app patient (G-densite ✅ tuile + détail)

Pour « Envie irrépressible » : **8 outils entièrement dépliés, 5,7 écrans** de défilement sur
mobile (4627 px / 812 px). La consultation, elle, présente une grille compacte de tuiles avec
détail à la demande. Le modèle lourd est donc servi au patient **en situation de crise**, l'inverse
du registre attendu.

**Cible.** Reprendre le patron tuile + détail du module soignant. Points de vigilance :
- Le bouton de lancement du premier outil est aujourd'hui au-dessus de la ligne de flottaison
  (y = 644 < 812) — **ne pas régresser** : en crise, l'accès à l'outil ne doit pas coûter un
  défilement. Idéalement le lancement reste accessible depuis la tuile elle-même.
- Le passage de « tout visible » à « détail au toucher » ajoute un geste : le compenser en
  faisant remonter l'outil le plus pertinent de la situation.
- Vérifier au navigateur à 375 px après refonte (aucun débordement horizontal aujourd'hui).

## Gates — toutes tranchées avec Thibault le 2026-08-06

- **G-fiche** ✅ — **rattachement automatique** dès qu'un outil produit du contenu personnalisé
  (7 outils sur 14), **plus** la case « Dans ma fiche » rétablie sur la tuile pour les 7 autres.
  Le patient ne peut plus perdre son travail ; le soignant garde la main pour retirer. (S2)
- **G-baremes** ✅ — **adoucir la décroissance** cardio pour qu'un écart de 2 jours reste vert ou
  ambre. Le repère affiché ne bouge pas. (S3)
- **G-assiette** ✅ — **lier l'analyse aux aliments ajoutés**, **camembert conservé** et toujours
  réglable à la main : l'analyse devient **croisée** (proportions × variété d'aliments). Aucune
  mécanique existante cassée. (S4)
- **G-carnet** ✅ — **synthèse minimale** : tranches horaires, 3 contextes les plus fréquents,
  total 7 jours. Jamais de courbe de progrès ni d'objectif. (S5)
- **G-densite** ✅ — **tuile + détail**, même patron qu'en consultation. (S8)
- **Cible anti-ennui** ✅ — **compléter la liste à 10 suggestions** (et non retirer le
  dénominateur). ⚠️ Ouvre un point de contenu : 4 propositions à valider, cf. S1.

## Hors périmètre (constaté, non traité ici)

- **App patient = tabac uniquement.** Diabète et cardio n'ont aucun emport numérique. Question de
  feuille de route produit, pas un défaut.
- **`localStorage` partagé d'origine.** `etp.patient.carnetConso` est lisible depuis
  `/consultation.html` (même origine). L'invariant #1 n'est pas violé — la consultation n'écrit
  ni ne lit rien — mais à documenter si les deux bundles cohabitent sur un même appareil.
- Un filtre de situation actif sans action de l'utilisateur a été observé une fois puis **n'a pas
  été reproduit** sur chargement neuf (14 tuiles, aucun filtre) : attribué au script de recette,
  pas retenu comme défaut.

## Clôture Vague 1 (S1, S3, S6, S7 — 2026-08-06)

### Gates auto
`npx tsc -b --noEmit` ✓ · `npm run build` ✓ · `npm test` ✓ **134/134** (+7 tests sur
`protectionSemaine.ts`, aucune dépendance runtime ajoutée).

### N1 (navigateur in-app)
- **S3** : Lundi+Jeudi actifs → barres `[100 vert, 70 vert, 40 ambre, 10 rouge, 100 vert, 70 vert,
  40 ambre]` — 2 jours de repos consécutifs ne descendent plus qu'à l'ambre, conforme au repère.
- **S6** : les 3 minuteurs (Vague/4D, MinuteurGuide bouger+surfer, RespirationGuidee) pausés puis
  repris en direct — chrono vérifié gelé pendant la pause (4 s sans changement), reparti après
  reprise. Mention « À faire chez vous, ou pour découvrir l'outil. » confirmée sur la fiche
  détail de `outil-bouger` en consultation.
- **S7** : 13 activités identiques vérifiées dans `diabete/activite` (avec `intensité`) et
  `cardio/bouger` (sans), depuis la même source `src/content/activites.ts`.
- **S1** : bouton d'entrée de la vague affiche « J'ai une envie de fumer » · Phrase de refus
  n'affiche plus qu'une seule occurrence du message alcool · classe `levelBtn` du défi Qualité
  (diabète) ne contient plus `undefined`.

### Point rouvert puis clos
**S1, item 4 (liste anti-ennui)** — les 4 libellés proposés (« Sortir prendre l'air 5 minutes »,
« Écouter de la musique », « Faire la vaisselle », « Prendre une douche ») validés par Thibault le
2026-08-06 et ajoutés à `checklists.ts`. Vérifié en navigateur : « 10 / 10 choisis » en cochant
tout, les 10 items s'affichent. **Vague 1 intégralement close.**

### Commits
En cours — Thibault a demandé le commit/push de la vague 1 le 2026-08-06.

### Prochaine étape
Vague 2 (S2 + S4) — les deux sessions restantes ouvrent chacune un point de contenu
supplémentaire (débordement de fiche à re-preciser en S2 ; matrice de messages croisés en S4).

## Références

- Recette : session Claude Code du 2026-08-06 (navigateur in-app, serveur de dev).
- Contenu de référence : `docs/contenu-modules-tabac.md` §Module 6 · `docs/cardio/CONTENU_cardio.md`
  §M7/M8 · `docs/diabete/SPEC_outil_ETP_diabete.md` §6/§8.
- Registre des outils : `src/features/tabac/boite-a-outils/outils-interactifs/registry.ts`
  (13 entrées, 8 composants distincts).
