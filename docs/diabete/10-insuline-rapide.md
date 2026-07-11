# Module 10 — Insuline rapide (pré-prandial)

> **Statut : CONTENU SOURCÉ — en attente de la relecture finale de Thibault (soignant).**
> **Validé par Thibault le 2026-07-11** : périmètre **DT2** (patient diabétique de type 2 sous
> schéma basal-bolus) ; ajout des temps pédagogiques **timing d'injection** et **cumul de bolus**.
> **Sources fournies le 2026-07-11** via OpenEvidence (§5, remplacent les sources web générales
> initiales) — elles fondent chaque temps pédagogique sur des recommandations (ADA 2026, consensus
> ADA/EASD, AACE, Endocrine Society) et des essais dans le DT2. **Il reste à Thibault de relire ce
> document réécrit et de donner le feu vert** avant que l'implémentation (§2 du plan S10) démarre.
> Toute règle chiffrée ci-dessous est un exemple pédagogique générique, jamais une posologie ; les
> chiffres extraits des sources servent à cadrer la conception, **aucun n'est affiché au patient**.

## 1. Objectif pédagogique

**Périmètre (validé Thibault 2026-07-11)** : patient adulte **diabétique de type 2**,
insulinorequérant, déjà passé en schéma **basale + rapide** (basal-bolus). Le module fait
comprendre le raisonnement derrière l'ajustement de la dose d'insuline **rapide prise avant les
repas** (« bolus prandial ») — distinct du module 9 existant (« Insuline : adapter les doses »),
qui ne couvre que la titration de l'insuline **basale/lente** sur la glycémie à jeun.

Quatre idées à faire comprendre, **sans jamais afficher de dose réelle** (cf. invariant
« pas de chiffre médical brut », `AUDIT-DIABETE.md`, et décision déjà actée pour le module 9 :
« on n'enseigne aucun nombre ») :

1. **La rapide couvre les glucides du repas** — plus le repas apporte de glucides, plus il faut
   de rapide pour « couvrir » la montée de sucre attendue (notion de ratio insuline/glucides,
   dite I/G — cf. sources ci-dessous).
2. **Le bon moment compte** *(validé 2026-07-11)* — la rapide s'injecte **avant** le repas ;
   trop tard, le pic passe devant elle ; trop tôt, elle agit avant que le repas ne monte.
   Dimension très visuelle sur la courbe (même grammaire que le slider de délai du module 3
   Activité ③ Timing). *Délais exacts selon l'analogue : à revalider, jamais affichés en chiffre.*
3. **La rapide peut aussi corriger** une glycémie déjà haute avant le repas (dose de correction,
   fonction d'un facteur de sensibilité à l'insuline).
4. **Le piège du cumul** *(validé 2026-07-11)* — se recorriger trop tôt alors que le bolus
   précédent agit encore (insuline active résiduelle, « stacking ») est une cause classique
   d'**hypoglycémie post-prandiale**. Même leçon de patience que le 15/15 du module 8 :
   « l'insuline n'a pas fini d'agir — on n'empile pas ». Renvoi direct au module 8.

## 2. Message clé (une phrase)

« La rapide, c'est l'insuline du repas : plus il y a de glucides, plus il en faut pour les
couvrir — mais en mettre trop fait plonger après. »

## 3. Déroulé pédagogique proposé (4 temps — intègre timing et cumul, validés 2026-07-11)

① **Couvrir le repas** — rappel court du fil rouge (le repas fait monter le sucre, modules 2/9),
puis le geste : plus le repas apporte de glucides, plus il faut de rapide pour le couvrir.
Entrée par l'**assiette du module 2** (pont fort : composer un repas « peu / moyen / beaucoup de
glucides » avec le garde-manger déjà appris) plutôt qu'un curseur abstrait — la dose qualitative
de rapide s'ajuste et la courbe montre le pic couvert. **Jamais le chiffre du ratio affiché.**

② **Le bon moment** — slider de délai d'injection (grammaire du module 3 Activité ③ Timing) :
injecter avant le repas couvre le pic ; injecter en retard le laisse passer ; injecter trop tôt
creuse avant le repas. Le message : la rapide se prépare **avant** de manger.

③ **Corriger avant le repas** — toggle qualitatif « glycémie avant repas : basse / dans la
cible / haute » qui déplace le point de départ de la courbe (pas de chiffres), avec le principe
de correction : glycémie haute → un peu plus de rapide, glycémie basse → prudence (traiter
l'hypo d'abord, renvoi module 8).

④ **Le piège du cumul** — scénario « ça ne descend pas assez vite, j'en remets » : une 2ᵉ dose
injectée alors que la première agit encore fait plonger la courbe sous la bande-cible (motif
« overshoot »/fantôme du module 8, inversé). Message de patience : l'insuline rapide agit
pendant plusieurs heures — on n'empile pas, on attend, on recontrôle. Porte vers le module 8.

**Refrain de sécurité du module** (proposition, à valider) : « La bonne dose, c'est celle de
votre protocole — ici on apprend le raisonnement, pas les chiffres. » Complété par le verrou
déjà acté au module 9 : l'outil n'est jamais en libre-service, le soignant pilote.

**Pas de fiche imprimable** pour ce module (interdiction explicite) : une fiche d'ajustement de
doses de repas serait dangereuse hors contexte — même décision que le module 9 (« sans fiche
d'ajustement »), encore plus impérative ici.

*(Libellés exacts et nombre de paliers à caler avec Thibault au moment de l'implémentation.)*

## 4. Règles « chiffrées » — en paliers qualitatifs uniquement

Comme pour le module 9 (« zone-cible posée par le soignant », « aucun nombre affiché »），toute
règle numérique doit être traduite en **paliers qualitatifs** avant affichage :

- **Ratio insuline/glucides (I/G)** : notion à illustrer par « peu / moyen / beaucoup » de
  glucides → « peu / moyen / beaucoup » de rapide, jamais par un ratio chiffré. Les formules
  existent (AACE : ratio de départ = 500/dose totale quotidienne, ISF = 1800/DTQ) mais sont des
  **points de départ individuels à ajuster empiriquement** — d'où l'interdiction de tout chiffre
  générique à l'écran.
- **Nuance DT2 importante (à intégrer au ton du module)** : contrairement au DT1, dans le DT2
  sous basal-bolus le **comptage précis des glucides n'est pas supérieur aux doses fixes** sur
  l'HbA1c (essais Bergenstal 2008, Christensen 2021, Levy 2026 — cf. §5). Le module doit donc
  enseigner le **raisonnement** (« plus de glucides → plus de rapide pour couvrir ») **sans
  survendre le comptage** ni le présenter comme un impératif : c'est un principe de
  compréhension, pas une méthode de calcul imposée. Cela renforce le choix « paliers qualitatifs,
  pas de chiffres » du projet.
- **Facteur de sensibilité / correction** : à illustrer par « glycémie haute → un peu plus de
  rapide », sans formule ni valeur.
- **Timing d'injection** : le principe « avant le repas » est solide (analogues rapides ~15-20
  min avant → −30 % d'excursion post-prandiale ; ultra-rapides au moment du repas). Mais le
  **délai exact dépend de l'insuline du patient** (rapide vs ultra-rapide) → le module enseigne
  le principe (préparer avant, pas après) et **renvoie au protocole**, sans afficher de minutes.
- **Cumul / insuline active résiduelle** : l'analogue rapide agit **3 à 5 h** (≈ 50 % d'effet
  résiduel à 2 h, ≈ 25 % à 3 h) → règle de prudence « attendre 3-4 h avant une correction
  supplémentaire ». À traduire visuellement (l'insuline « travaille encore ») **sans chiffrer**.
- **Risque d'hypoglycémie post-prandiale** : conséquence qualitative d'un surdosage ou d'un
  cumul, montrée sur la courbe (creux sous la bande-cible), jamais quantifiée en dose.

**// à revalider (Thibault)** : les paliers qualitatifs exacts (combien de niveaux ? quels
libellés ?) et la pertinence clinique de représenter le ratio I/G et le facteur de correction
comme deux leviers distincts pour un public DT2 (risque de survimplifier ou, à l'inverse, de
complexifier inutilement selon le profil visé).

## 5. Sources (recherche OpenEvidence, 2026-07-11)

Sources fournies par une interrogation OpenEvidence (rapport archivé :
`Downloads/rapport open evidence insuline.txt`). Recommandations et essais adossés au **DT2 sous
basal-bolus** autant que possible. Chaque source est rattachée au temps pédagogique qu'elle fonde.

### Cadre général & couverture des glucides (temps ①)

- **ADA — Standards of Care in Diabetes 2026, §9 (Pharmacologic Approaches).** *Diabetes Care.*
  2026;49(S1):S183-S215. doi:10.2337/dc26-S009. — Initiation/titration de l'insuline prandiale
  dans le DT2 (« pattern control ») ; note que le ratio I/G et l'ISF ne sont pas spécifiquement
  détaillés pour le DT2.
- **ADA — Standards of Care 2026, §5 (Medical Nutrition Therapy).** — Recommande une éducation
  continue au couplage insuline-glucides pour tout patient sous insuline prandiale ; comptage des
  glucides selon la littératie/numératie du patient.
- **Consensus ADA/EASD 2022** (management de l'hyperglycémie dans le DT2). — L'ajout d'insuline
  prandiale nécessite un renforcement de l'ETP (DSMES) ; débuter par le repas à plus forte
  excursion. Note que transposer les paradigmes DT1 au DT2 ignore les différences physiopatho.
- **AACE** (algorithmes de titration prandiale DT2 ; formules ratio I/G = 500/DTQ, ISF = 1800/DTQ).
  — Deux approches valides : doses fixes (pattern management) ou comptage. **Formules = points de
  départ individuels, à ajuster empiriquement** (justifie « aucun chiffre à l'écran »).
- **Bergenstal et al. 2008 — essai « Adjust to Target »** (n=273 DT2 basal-bolus, 24 sem.). —
  Doses fixes vs comptage des glucides : **HbA1c comparable** (−1,46 % vs −1,59 %, p=0,24),
  hypoglycémie sévère identique. Base de la « nuance DT2 » du §4.
- **Christensen et al. 2021** (n=79 DT2 basal-bolus). — Comptage avancé des glucides : −0,8 %
  d'HbA1c, moindre variabilité, sans hausse d'hypo — « efficace et peu coûteux ».

### Timing d'injection (temps ②)

- **Slattery et al. 2018** (revue systématique). — Analogues rapides injectés **15-20 min avant**
  le repas : **−30 % d'excursion glycémique post-prandiale** vs injection à 0 min, sans hausse
  d'hypo ; injection après le repas = hyperglycémie PP + hypo tardive.
- **Luijf et al. 2010** (essai croisé). — Injection à −15 min = meilleur compromis (pic plus bas,
  meilleur temps dans la cible) ; −30 min expose à l'hypo pré-prandiale.
- **PRONTO-T2D, Blevins et al. 2020** (n=673 DT2 basal-bolus). — Ultra-rapide lispro vs lispro,
  toutes deux à 0-2 min : non-infériorité HbA1c, excursions PP réduites avec l'ultra-rapide →
  fonde la distinction « rapide (15-20 min avant) vs ultra-rapide (au moment du repas) ».
- **De Block et al. 2022** (revue). — L'injection pré-prandiale reste le gold standard ; le
  post-prandial réservé aux populations vulnérables. Profils PK/PD des analogues (début 15-30 min,
  pic 50-150 min, durée 3-5 h).

### Cumul / insuline active résiduelle (temps ④)

- **Heise & Meneghini 2014.** — Définition de l'« insulin stacking » (cumul d'effet quand une
  correction est donnée alors qu'un bolus précédent agit encore) ; à distinguer de l'accumulation
  normale des basales.
- **Walsh et al. 2014.** — Une durée d'action (DIA) réglée trop courte fait sous-estimer
  l'insuline résiduelle → corrections excessives → hypos non reconnues. DIA réelle des analogues
  rapides ≈ 5-7 h (activité clinique concentrée sur 3-4 h).
- **Règle de prudence retenue** (synthèse AACE/Endocrine Society du rapport) : ne pas corriger
  moins de **3-4 h** après un bolus rapide ; effet résiduel ≈ 50 % à 2 h, ≈ 25 % à 3 h. À rendre
  visuellement, jamais chiffré.

### Éducation thérapeutique (justification du module)

- **ADA 2026, §5** (grade A) et **Endocrine Society 2023** — ETP structurée fortement recommandée
  pour tout patient sous insuline : réduction d'HbA1c ~0,2-0,8 % et **des hypoglycémies sévères
  ~75 % (OR 0,25)** ; meilleurs résultats pour des programmes > 10 h sur 6-12 mois.
- **Franc et al. 2019 — TeleDiab-2** (français, n=191 DT2). — Auto-titration guidée par
  algorithme/éducation : double le taux d'atteinte de la cible HbA1c, sans hausse d'hypo.

**Limite** : rapport OpenEvidence, non filtré par un professionnel choisi par Thibault. Les
recommandations françaises SFD n'étaient pas dans la base interrogée (principes ADA/EASD/AACE
largement repris en pratique européenne). **Thibault (soignant) doit relire cette section et
confirmer/corriger avant implémentation** — notamment que la transposition DT1→DT2 des notions I/G
et ISF est présentée avec la bonne prudence pour le public visé.

### État des points à trancher (mis à jour 2026-07-11)

1. ~~Confirmer ou corriger le déroulé pédagogique (§3)~~ — **validé** (avec ajout timing + cumul).
2. Trancher le nombre et les libellés des paliers qualitatifs (§4) — reporté à l'implémentation.
3. ~~Sources définitives~~ — **fournies (OpenEvidence, ci-dessus)** ; reste la **relecture finale
   par Thibault** de cette section réécrite (dernier verrou avant code).
4. ~~Confirmer le périmètre~~ — **validé : DT2** insulinorequérant en schéma basal-bolus.

## 6. Ce qui n'est pas fait

Aucune implémentation (`InsulineRapideModule.tsx`, `registry.ts`, etc.) — le plan S10 l'interdit
tant que ce document n'est pas validé. cf. `plans/corrections-visuelles-diabete-v3/S10.md`.
