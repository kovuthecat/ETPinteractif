# Outil d'ETP interactif — Diabète de type 2
## Fichier d'architecture & spécifications

> Document vivant. Rédigé en session de conception, enrichi module par module au fil des sessions suivantes.
> Destiné à cadrer le travail de **Claude Design** (visuel) puis **Claude Code** (câblage).

**Statut des modules**
| Module | Conception | Design | Code |
|--------|:---:|:---:|:---:|
| 1 · C'est quoi le diabète ? | ✅ spécifié | ⬜ | ⬜ |
| 2 · Alimentation | ✅ spécifié | ⬜ | ⬜ |
| 3 · Activité physique | ✅ spécifié | ⬜ | ⬜ |
| 4 · Risque cardiovasculaire | ✅ spécifié | ⬜ | ⬜ |
| 5 · Complications | ✅ spécifié | ⬜ | ⬜ |
| 6 · Suivi | ✅ spécifié | ⬜ | ⬜ |
| 7 · Traitements | ✅ spécifié | ⬜ | ⬜ |
| 8 · Hypoglycémie | ✅ spécifié | ⬜ | ⬜ |
| 9 · Insuline (adaptation) | ✅ spécifié | ⬜ | ⬜ |

---

## 1. Intention du projet

Outil visuel et interactif d'éducation thérapeutique du patient (ETP), utilisé **en consultation**, **narré par le soignant**. L'écran est un **support visuel pour la parole du soignant**, pas un e-learning autoportant.

**Objectif central :** maximiser la **réception** et la **mémorisation** des messages clés.

**Public :** patients diabétiques de type 2, dont une part importante en situation de précarité, à faible littératie en santé, peu lecteurs, parfois allophones — mais aussi des patients CSP+. L'outil doit parler à tous **sans infantiliser**.

**Fondement :** contenu adossé à des données probantes (rapports de synthèse OpenEvidence : ADA Standards of Care 2026, consensus ADA/EASD 2022, HAS/SFD, essais UKPDS, DCCT/EDIC, Steno-2, PREDIMED, Look AHEAD, cohorte Rawshani, etc.).

---

## 2. Grammaire commune à tous les modules

### 2.1 Rythme en 3 temps

Chaque module suit la même structure :

**① Sélecteur** — on choisit visuellement ce qui concerne *ce* patient (aliments connus, facteurs de risque présents, médicaments pris…).
**② Séquence** — courte manipulation visuelle portant uniquement sur ce qui a été sélectionné.
**③ Image à emporter** — l'écran final, éventuellement imprimable en **fiche mémo personnalisée** (photographie de ce qui vient d'être manipulé, pas une fiche générique).

Le sélecteur **est** le moteur de personnalisation : l'outil est identique pour tous, mais on n'y aborde que ce qui est pertinent au moment T.

### 2.2 Règles de conception non négociables

- **Deux niveaux de lecture.** L'image parle seule au patient précaire. Une couche de donnée (chiffre réel, ordre de grandeur) est accessible **au survol** (desktop) pour le patient CSP+, sans jamais s'imposer. → garde-fou anti-infantilisation.
- **Aucune dépendance à une manip réussie par le patient.** S'il ne touche/clique pas, le soignant le fait, le contenu avance à l'identique.
- **Zéro donnée stockée.** L'état des sélections meurt à la fin de la consultation. Rien ne persiste. → RGPD-propre par construction. (La fiche mémo est générée à la volée puis imprimée, non conservée.)
- **Anti-infantilisation par le haut de gamme graphique.** Ce qui infantilise, c'est le visuel pauvre (gros smileys, ton scolaire), pas le visuel. On vise un rendu soigné qui respecte l'intelligence.

### 2.3 Support

- **Poste principal : ordinateur de bureau**, grand écran horizontal, souris.
- Conséquences : le **survol (hover)** est disponible et sert au 2ᵉ niveau de lecture ; les zones sélecteur et séquence peuvent coexister **simultanément** à l'écran (pas seulement en étapes successives) ; l'écran est **tourné/partagé vers le patient**.
- Concevoir des cibles cliquables confortables (un poste tactile reste possible à terme).

### 2.4 Fil rouge (refrain volontairement répété)

> **Le diabète est une maladie des vaisseaux, pas seulement du sucre — et agir sur tout ensemble protège.**
> Ancres probantes : **Steno-2** (approche multifactorielle → +8 ans de vie) · **Rawshani** (tous les facteurs dans la cible → risque quasi équivalent à la population générale).

Ce motif est **installé au module 1** et réapparaît aux modules **4, 5 et 6** comme un refrain visuel.

### 2.5 Navigation inter-modules (ponts)

Les modules ne sont pas des silos étanches. Certains se répondent et peuvent s'enchaîner via des **ponts optionnels** que le soignant emprunte ou non, selon le patient et le temps disponible. Un pont est une **porte proposée en fin de séquence**, jamais un enchaînement forcé.

Ponts identifiés à ce stade :
- **1 → 2** : la conclusion du module 1 (« bien manger aide la clé ») ouvre vers Alimentation.
- **2 ↔ 3** *(premier pont bidirectionnel)* : les modules Alimentation et Activité partagent **la même courbe** de glycémie post-repas. Depuis l'assiette, une porte « et si on bougeait après ce repas ? » mène au temps *timing* du module 3 ; réciproquement, le timing du module 3 peut renvoyer à l'assiette. Rend évident le message « alimentation et mouvement agissent sur le même pic ».
- **4 → 5** : la fin de l'anatomie macro (cou/cœur/jambes) ouvre vers les complications micro (« et il y a aussi les petits vaisseaux… »).
- **5 ↔ 6** *(second pont bidirectionnel)* : le module 5 promet, pour chaque complication, « c'est **dépistable** » ; le module 6 **incarne ce dépistage**. Depuis une branche du module 5 (œil, rein, nerf, pied), une porte « *et cet examen, on le programme quand ?* » mène au cadran de suivi ; réciproquement, la **révélation « ce que ça garde » sur demande** d'une station du cadran (§ module 6, temps ②) rouvre l'organe correspondant du module 5. C'est le pont qui matérialise la promesse « dépistable » : le 5 dit *que*, le 6 dit *comment et quand*.
- **4 → 6** : les 3 feux « mesurables » du module 4 (HbA1c · tension · cholestérol) **réapparaissent** comme cadrans de suivi au module 6. Continuité d'instrumentation (même objet vu une fois en *état* — où j'en suis —, une fois en *calendrier de vérification* — quand je relis), pas redite. Porte optionnelle « ces feux, voici quand on les rallume pour vérifier ».
- **7 ↔ 5** : le module 7 réutilise la **silhouette du module 5** (3ᵉ passage). Un organe *défendu* par un traitement (7) rouvre l'*enjeu* (5), et réciproquement.
- **6 ↔ 7** *(confirmé bidirectionnel)* : le *quoi surveiller* d'une ligne d'ordonnance (ex. contrôle du rein) renvoie à la station du cadran du module 6 ; réciproquement, une surveillance du cadran liée à un médicament rouvre la ligne du module 7.
- **7 → 8** : la pastille « peut faire l'hypo » (sulfamides, insuline) au module 7 ouvre la fiche-réflexe du module 8.
- **7 → 9** : une ligne d'**insuline** au module 7 ouvre le module 9 (adaptation des doses).
- **9 → 8** : le resucrage universel vit au module 8 ; le module 9 y renvoie sans le dupliquer (même logique que le pied 5/6).
- **9 ↔ 2 / 3** : la **courbe de glycémie** des modules 2 (aliment) et 3 (mouvement) est **la même** que la trace du capteur FreeStyle Libre du module 9. La bosse post-repas qu'on y aplatit est ce qu'un bolus couvre → le patient apprend à lire son capteur dès le module 2. Même langage visuel d'un bout à l'autre.
- **8 ↔ 9** : en cas de perte des signes d'alerte (*hypo unawareness*), le capteur du module 9 alarme sur les bas et sert de filet au réflexe du module 8. La **courbe de récupération** du module 8 prolonge la continuité de courbe 2 / 3 / 9.

D'autres ponts émergeront à mesure que les modules seront spécifiés. À traiter comme une **couche de navigation transverse**, pas comme un détail interne à un module.

---

## 3. Vue d'ensemble des modules (9)

| # | Module | Objet interactif central | Pilote | Fiche mémo | Ancre probante |
|---|--------|--------------------------|--------|:----------:|----------------|
| 1 | **C'est quoi le diabète ?** | Séquence clé/serrure : sujet sain → insulinopénie → insulinorésistance → conclusion | Soignant | Non | Socle du fil rouge |
| 2 | **Alimentation** | Assiette qu'on compose + courbe de glycémie réactive | Les deux | **Oui** (son assiette) | Glucides en dernier −42 mg/dL ; CG ; méditerranéen ; fibres |
| 3 | **Activité physique** | Rayonnement (bénéfices multiples) → jauge d'activités du quotidien → courbe timing | Les deux | Non | 150 min ≈ un médicament ; marche post-prandiale ; santé mentale |
| 4 | **Risque cardiovasculaire** | Feux tricolores (5 FDR) + artère qui se bouche par cumul + modèle anatomique | Soignant | **Oui** (ses feux) | Steno-2 ; Rawshani |
| 5 | **Complications** | Silhouette-carte du corps : on ouvre un organe → menace + « c'est évitable » + geste/suivi | Les deux | Oui (pied) | DCCT/UKPDS ; pied 1/3, −2/3 amputations ; effet mémoire |
| 6 | **Suivi** | Cadran de l'année (tableau de bord rond, aiguille = maintenant) : régler / cocher les examens faits / à programmer | Les deux | **Oui** (son calendrier — ROI ++) | Fréquences ADA/HAS-SFD ; suivi structuré multifactoriel (Steno-2/Rawshani) |
| 7 | **Traitements** | Ordonnance ↔ silhouette-organes : clic sur une ligne → les zones où le traitement agit s'allument | Soignant | Non (a déjà son ordonnance) | Classes ; double protection cœur-rein |
| 8 | **Hypoglycémie** | Carte-réflexe 15/15 (reconnaître → 15 g → attendre) + courbe de récupération/overshoot ; dessus perso (mes signes, mon resucrage) | Soignant | **Oui** (carte-réflexe) | Reconnaître tôt · doser · attendre |
| 9 | **Insuline** (adaptation) | Courbe du capteur (FreeStyle Libre = courbe des modules 2/3) : couplage segment↔insuline, tendance, Temps dans la cible ; 3 cas (monter/rien/descendre) | Soignant | Non (option référence, plus tard) | Titration basale ; cadence attente ; hypo nocturne ; asymétrie du risque |

**Répartition macro/micro (frontière 4↔5) :** le module 4 porte le **macro** (artère qui se bouche → cou/cœur/jambes) ; le module 5 porte le **micro** (yeux, reins, nerfs) + le **pied** + la dimension « évitable / dépistable ». Le recouvrement est une **répétition voulue**, pas une redite.

---

## 4. Ordre de construction

Ordre non numérique, choisi pour **valider la mécanique le plus vite** :

1. **Alimentation** — le plus démonstratif ; éprouve le triptyque sélecteur→séquence→fiche au complet.
2. **Risque cardiovasculaire** — cœur émotionnel ; pose le refrain Steno-2 réutilisé par 1/5/6.
3. Les autres se coulent dans le moule validé, dans l'ordre clinique qui convient.

---

## 5. Module 1 — C'est quoi le diabète ?

**Rôle :** cadrage mental fondateur. Installe le modèle de compréhension que tous les autres modules réutilisent. Pas de personnalisation, pas de fiche.
**Pilotage :** entièrement narré/déclenché par le soignant (le patient ne manipule pas).
**Format :** séquence linéaire en **4 temps** que le soignant fait avancer.

### Métaphore centrale
- **L'insuline = une clé** qui ouvre la **serrure de la cellule** pour y faire entrer le sucre.
- Deux pannes possibles, montrées séparément puis réunies.

### Déroulé

**① Le sujet sain** — Le sucre arrive dans le sang après le repas → l'insuline (clés) ouvre les serrures → le sucre entre dans les cellules → la glycémie redescend. *On installe le fonctionnement normal.*

**② L'insulinopénie** — *Pas assez de clés* : le pancréas se fatigue et n'en produit plus assez → du sucre reste dans le sang.

**③ L'insulinorésistance** — *Serrure rouillée* : les clés sont là mais entrent mal → du sucre reste dans le sang aussi, **mais pour une autre raison**.

**④ Conclusion** — En pratique, **souvent un peu des deux**. Puis message déculpabilisant essentiel :
> On n'a pas le diabète « parce qu'on a mangé du sucre ». Mais **bien manger et bouger aident la clé à mieux fonctionner et soulagent le pancréas.**

Ce dernier écran fait le **pont vers le module 2** (alimentation).

### Point d'attention Design
Les temps ② et ③ ont des **mécanismes différents** mais la **même conséquence** (sucre qui reste dans le sang). Visuellement, les deux pannes doivent **converger vers la même image d'hyperglycémie** — c'est le cœur pédagogique du module.

---

## 6. Module 2 — Alimentation

**Rôle :** montrer, de façon manipulable, ce qui fait varier la glycémie après un repas.
**Pilotage :** les deux (soignant ou patient).
**Fiche mémo :** **oui** — l'assiette-modèle composée par le patient + les principes en pictogrammes.

### 6.1 Principe pédagogique

L'assiette **est** le terrain de jeu (comparateur et composition fondus, pas d'écran de quiz séparé). Le module se parcourt en **4 défis guidés + une synthèse**, chacun isolant **une seule variable** pour rester lisible :

`1 · Composition` → `2 · Qualité (devine→révèle)` → `3 · Ordre` → `4 · Proportion` → `★ Repas complet` (= fiche)

### 6.2 Anatomie de l'écran (desktop large, 3 zones simultanées)

- **Gauche — le garde-manger** : étagères par famille, grandes vignettes qu'on glisse vers l'assiette.
- **Haut-droite — l'assiette** : zone de dépôt ; en défi 4, chaque aliment occupe une **part ajustable** du cercle (type parts de camembert).
- **Bas-droite — la courbe de glycémie** : temps en horizontal, montée réactive en direct.
- **Barre de défis** en haut : cadre la narration et l'avancement.

### 6.3 La courbe

- **Schématique par défaut** : forme + hauteur relative, sans chiffres qui encombrent.
- Assez **fine** pour rendre visible chaque geste, via **trois leviers** : hauteur du pic · moment du pic · douceur de la descente.
- Valeurs mg/dL disponibles **au survol** (2ᵉ niveau, CSP+).
- ⚠️ **Modèle pédagogique, pas simulateur métabolique validé.** Elle traduit fidèlement le *sens* des variations (plus de fibres/protéines → pic plus bas et plus tardif), pas des valeurs au mg/dL près. Message porté = « ça monte moins et plus doucement », jamais « +37 vs +52 mg/dL ».

### 6.4 Les 4 défis + synthèse

**Défi 1 — Composition.** Féculent seul → grand pic. Ajout de protéines / lipides / fibres → le pic s'aplatit à chaque ajout, **à féculent constant**. *Message : ce n'est pas que le féculent, c'est ce qu'il y a autour.*

**Défi 2 — Qualité.** C'est ici que vit le **« devine → révèle »** (uniquement ce défi). On reste dans une famille, on pose deux aliments (ex. baguette vs pain complet) ; **avant** l'affichage : « lequel fait le plus monter ? » (prédiction bas/moyen/haut) → puis les deux courbes se dessinent. On rejoue famille par famille. Terrain d'exploration à CG.

**Défi 3 — Ordre.** Même assiette, on fait glisser l'ordre : féculent d'abord → gros pic ; légumes/protéines d'abord, féculent en dernier → pic réduit (le **−42 mg/dL** rendu visible).

**Défi 4 — Proportion.** On joue sur les **quantités relatives** (parts du cercle). Fait apparaître l'**assiette-modèle ½ légumes / ¼ protéines / ¼ féculents**. *Message : ce n'est pas seulement quoi, c'est combien* (une grosse portion de riz complet peut dépasser une petite portion de riz blanc).

**★ Repas complet (synthèse + fiche).** On compose un vrai repas en combinant les 4 principes, comparé à une version « naïve ». **Cet écran final devient la fiche mémo** : l'assiette optimisée du patient + les principes en pictogrammes.

### 6.5 Le garde-manger

Rangé par **familles** (onglets/étagères). Charge glycémique en **relatif** : 🟢 bas / 🟠 moyen / 🔴 haut. Chiffre exact au survol.

**Principe de sélection :** peu d'aliments mais **variété suffisante pour comparer au sein d'une famille** (pâtes blanches vs complètes, riz blanc vs basmati…) et **diversité culturelle** (patientèle maghrébine, afrique subsaharienne, indienne/pakistanaise, chinoise). L'outil enseigne un *principe*, ce n'est pas une base de données nutritionnelle.

Base représentative (à amender à la construction) :

- **Féculents & pains** *(cœur du jeu)* : baguette blanche 🔴 / pain complet 🟠 · riz blanc 🔴 / basmati 🟠 / complet 🟠 · semoule fine 🟠 / couscous complet 🟠 · pâtes bien cuites 🟠 / al dente 🟠 / complètes 🟢 · pomme de terre-purée 🔴 / patate douce 🟠 · manioc-attiéké 🟠 · igname 🟠 · banane plantain 🟠 · **lentilles / pois chiches / haricots rouges 🟢** · naan 🔴 / chapati complet 🟠 · boulgour 🟢
- **Fruits** : pomme, orange, cerises 🟢 · banane mûre, mangue, raisin, dattes 🟠🔴 · pastèque 🟢 · fruits au sirop 🔴
- **Légumes** : courgette, tomate, aubergine, haricots verts, épinards, gombo, poivron 🟢 *(message : presque tous verts)*
- **Laitages** : yaourt nature, lait, lben 🟢 · yaourt sucré/aux fruits 🟠
- **Protéines** : poulet, poisson, œuf, bœuf, tofu — CG ~nulle *(rôle : aplatir)*
- **Matières grasses** : huile d'olive, beurre — CG nulle *(rôle : aplatir)*
- **Boissons** : soda, jus, thé à la menthe sucré 🔴 · eau, thé/café non sucrés 🟢

**Points de conception notables :**
- **Légumineuses = pépite pédagogique.** Féculent *et* riche en fibres/protéines → un féculent qui monte doucement. Pont vivant entre défi « qualité » et défi « composition ». → **double-classer visuellement**.
- **Afficher la CG (charge), pas l'IG.** Règle le piège de la pastèque (IG haut / CG basse) : on reste on-message (« la pastèque, ça va »).
- ⚠️ **Méthodo à traiter à la construction :** les CG des aliments culturels (attiéké, khobz maison, lben) sont moins standardisées. Assumer un **classement relatif** adossé à une source (tables internationales GI/GL ou repères SFD), pas un chiffre au gramme près.

---

## 7. Module 4 — Risque cardiovasculaire *(cœur émotionnel)*

**Rôle :** faire comprendre que le diabète est une maladie des vaisseaux, que les facteurs de risque **se cumulent**, et que **c'est réversible** — on peut rouvrir. Porte le refrain Steno-2 / Rawshani.
**Pilotage :** soignant.
**Fiche mémo :** **oui** — le schéma global + les leviers d'action retenus.
**Nature :** module **pédagogique et non diagnostique** — on manipule des feux « pour voir ce qui se passe », on ne saisit **aucune donnée de santé réelle**. Reste zéro-donnée comme le reste de l'outil.

### 7.1 La chaîne (colonne vertébrale)

Les trois objets ne sont pas juxtaposés : ils forment une **chaîne causale**.

**① État** (les feux : les leviers d'action) → **② Mécanisme** (l'artère : le cumul l'encrasse, réversible) → **③ Conséquence** (l'anatomie : ce qui arrive quand ça se bouche ici).

**Motif-fil :** la **plaque d'athérome** est le même objet visuel tout du long. Elle apparaît dans l'artère générique (mécanisme abstrait) puis **voyage** sur le modèle anatomique (conséquence incarnée). Design doit la traiter comme **un motif récurrent identifiable**, pas deux illustrations distinctes — c'est elle qui comble le trou noir habituel entre « vos artères s'encrassent » et « AVC ».

### 7.2 Les temps

**① Le tableau de leviers.** 5 feux — **sucre · tension · cholestérol · tabac · sédentarité/inactivité** — cadrés comme *« là où on peut agir ensemble »*, **pas comme un score**. Chacun se règle vert / orange / rouge d'un clic. Objectif **de démonstration**, non lié aux résultats du patient. Valeurs-seuil (HbA1c < 7 %, TA < 130/80, LDL selon risque…) disponibles en **2ᵉ niveau au survol**.
*(Le poids a été retiré des FDR, remplacé par sédentarité — moins culpabilisant, actionnable, cohérent avec le module 3.)*

**② L'artère, liée aux feux (un seul objet, réversible).** Chaque feu passé au **rouge** dépose une plaque / encrasse la lumière artérielle ; repassé au **vert**, elle se dégage. On tourne dans les **deux sens** :
- sens « rouge » → le **cumul** (un facteur gêne un peu, tous ensemble bouchent) ;
- sens « vert » → **Rawshani** (on rouvre → le risque redevient presque normal). **C'est le message d'espoir**, celui qui évite de laisser le patient dans la sidération et lui donne une prise.

**③ Le modèle anatomique.** Une fois le mécanisme compris, on va voir *où* ça se joue : on **place les plaques** sur les territoires et on touche le **cou** → AVC · le **cœur** → infarctus · les **jambes** → artériopathie. Chaque zone montre simplement ce que « l'artère bouchée » veut dire concrètement pour cet organe.

**④ Cadrage non-modifiable (dernier écran, une phrase).** Les facteurs non modifiables (âge, ancienneté du diabète, hérédité) **n'entrent pas dans les feux** (le tableau reste 100 % actionnable) mais sont évoqués en une phrase de cadrage **déculpabilisante** : *« il y a une part qui ne dépend pas de vous — raison de plus d'agir sur ces 5 leviers qui, eux, dépendent de vous. »* Non manipulable, il encadre la démonstration sans la polluer.

**Fiche.** Le schéma global + les leviers d'action retenus (cochés selon les besoins du patient).
⚠️ *Point de vigilance narratif (pas une contrainte technique) :* une fiche avec 5 leviers cochés redevient un « bulletin » (tout est à revoir). Le jugement clinique du soignant tranche le nombre — l'outil ne l'impose pas.

### 7.3 Pont sortant

**4 → 5** : à la fin de l'anatomie macro, une porte optionnelle s'ouvre vers les complications micro du module 5 (« et il y a aussi les petits vaisseaux… »). Empruntée ou non selon le patient.

---

## 8. Module 3 — Activité physique

**Rôle :** montrer que bouger apporte des bénéfices multiples (pas seulement sur le sucre), que **ce qu'on fait déjà compte**, et *quand* bouger pour agir sur le pic glycémique.
**Pilotage :** les deux.
**Fiche mémo :** **non** (module qui installe principes + motivation ; comme le module 1, pas d'emport).
**Message socle, adapté à la patientèle précaire :** *bouger ≠ forcément sport* — les activités du quotidien comptent.

### 8.1 Structure en 3 temps (avec bascule d'entrée)

**① Le rayonnement** *(motivationnel — vient en premier).*
Un motif central « activité » d'où **partent des rayons** vers plusieurs bénéfices :
- **sucre** (glycémie / HbA1c) ;
- **cœur & vaisseaux** (tension, cholestérol, mortalité CV — déjà dans les rapports OpenEvidence) ;
- **tête** (moral, sommeil, stress) ;
- **autonomie** (force, équilibre, prévention des chutes).

Message : *un seul effort, plusieurs bénéfices.* Formulation **qualitative** (jamais de SMD/HR bruts à l'écran) ; ordres de grandeur sourcés disponibles au **survol**. Pour la santé mentale, formuler « effet comparable à d'autres approches non médicamenteuses de la dépression », pas le chiffre.
**Bascule :** on **clique sur le rayon “sucre”** pour entrer dans les temps ② et ③.

**② Le volume** *(jauge ouverte).*
Collection d'**activités du quotidien** reconnaissables (marcher, vélo, ménage, bricolage, jardinage, porter les courses…) qu'on coche → **jauge sans plafond** (« chaque activité compte, plus on en fait mieux c'est »).
- Comptage **tout-en-minutes** (addition simple, tout compte pareil) ; **intensité en 2ᵉ niveau** au survol.
- Effet visé : **surprise valorisante** (« j'en fais déjà plus que je croyais »), pas constat culpabilisant.
- **Renforcement musculaire visible** : y inclure des activités qui *sont* du renforcement sans en avoir l'air (se lever d'une chaise, monter les escaliers, porter les courses, se relever du sol). Repérables par un marqueur visuel discret « bon pour les muscles », **sans catégorie intimidante à part**, et **sans comptage séparé** (elles comptent en minutes comme les autres — la spécificité « garder ses muscles » est portée par le rayon *autonomie* + la narration). Se relie au rayon autonomie du temps ①.

**③ Le timing** *(courbe réutilisée du module 2).*
On reprend la **courbe de glycémie post-repas** du module Alimentation et on ajoute un **curseur d'activité déplaçable sur l'axe du temps** → l'écrêtage du pic varie selon *où* on place le mouvement. Deux régimes démontrables :
- **marche unique post-repas** : écrête le pic ; d'autant plus efficace qu'elle est **proche du repas** (bouger tout de suite > attendre 30 min) ;
- **micro-coupures** : 2–3 min répétées **toutes les 30 min** ; stratégie pour le mode de vie sédentaire (« même 2 minutes, ça marche »).

### 8.2 Socle probant (2ᵉ niveau / narration)

- **Glycémie** : exercice structuré −0,5 à −0,8 % d'HbA1c (≈ metformine) ; dose ~150 min/sem (rapports OpenEvidence).
- **Santé mentale (DT2)** : méta-analyses — réduction significative de l'anxiété et de la dépression ; aérobie et résistance efficaces. Effet cliniquement significatif. *(recherche web 2023–2025)*
- **Marche courte post-repas** : une marche de ~10 min immédiatement après le repas écrête le pic ; marcher après **chaque** repas > une seule marche plus longue à un moment quelconque. *(recherche web)*
- **Interrompre la position assise** (fort en DT2) : 3 min de marche légère ou d'exercices simples toutes les 30 min atténuent glycémie et insuline post-prandiales ; durées de 2–3–5 min efficaces ; interruption toutes les 30 min = stratégie la mieux classée. *(recherche web)*
- **Signal d'équité** : bénéfice au moins aussi marqué chez les personnes d'origine sud-asiatique (à manier avec prudence, une étude). *(recherche web)*

### 8.3 Pont

**2 ↔ 3** (bidirectionnel) : courbe partagée avec le module Alimentation. Voir §2.5.

---

## 9. Module 5 — Complications

**Rôle :** faire comprendre ce que le diabète peut abîmer — **sans jamais faire peur pour rien**. La peur sidère et installe le fatalisme ; l'antidote est dans les données (37–46 % des complications microvasculaires évitables, effet mémoire, dépistage qui change tout).
**Pilotage :** les deux.
**Nature :** module **contemplatif** — exploration guidée, peu d'interactivité, beaucoup de clarté et de calme. Le calme est ici une fonctionnalité (un module anxiogène n'a pas besoin de gamification, il a besoin d'être maîtrisé et posé). On n'ouvre que ce qu'on veut, on referme quand c'est assez.
**Fiche mémo :** **oui, pour le pied uniquement** (fiche de référence — voir §9.4 et note catégorie de fiche).

### 9.1 Règle non négociable du module

Chaque complication est présentée en **trois temps indissociables** :
1. **Ce que c'est** (la menace, amenée sobrement, jamais brandie) ;
2. **Mais c'est évitable et dépistable** (l'échappatoire) ;
3. **Le geste ou le suivi concret**.

Le module dit *« voilà ce qu'on surveille pour que ça n'arrive pas »*, jamais *« voilà ce qui vous attend »*. La menace seule est proscrite.

**Signature « évitable » récurrente :** un même motif visuel « bonne nouvelle » réapparaît systématiquement au 2ᵉ temps de chaque organe. Objectif : créer un réflexe — à chaque menace, l'œil cherche et trouve l'échappatoire. À traiter par Design comme un élément d'identité constant.

### 9.2 Objet unique : la silhouette-carte du corps

Une seule carte du corps, qui incarne le fil rouge « maladie des vaisseaux ». La sélection d'organe fait à la fois la **personnalisation** (on n'ouvre que le pertinent) et le **dosage émotionnel** (pas de défilé anxiogène imposé).

**États visuels des zones :**
- **Cœur + cerveau** : visibles mais **grisés durs** — non cliquables, purement contextuels. Vus au module 4 (macro). Le grisé porte le message « ça, on l'a déjà vu, c'est la même histoire » → macro et micro = **deux profondeurs d'une même maladie vasculaire**, pas deux sujets. En arrivant par le pont 4→5, ces zones sont naturellement estompées. *Design : prévoir un état « déjà exploré / vu au module 4 » distinct de l'état actif.*
- **Yeux, reins, nerfs** : branches **micro cliquables**, triptyque simple, orientées « laissez-vous dépister ».
- **Pied** : branche **renforcée** (voir §9.4).

### 9.3 Branches micro (yeux / reins / nerfs)

Triptyque standard *ce que c'est / dépistable / laissez-vous dépister*. Ancres probantes disponibles en 2ᵉ niveau : DCCT/UKPDS (contrôle glycémique → −25 à −76 % de complications micro), effet mémoire/héritage, fréquences de dépistage (renvoi naturel au module 6 Suivi).

### 9.4 Branche renforcée : le pied

Le **seul organe où le patient est acteur direct** (pas seulement « dépisté ») → justifie un traitement à part. Structure enrichie :
- **Risque** : à vie ~1/3 — amené sans le brandir.
- **Dépistage** : examen annuel (monofilament 10 g), comme les autres branches.
- **Ce que le patient fait lui-même** *(spécifique au pied)* : auto-examen quotidien (regarder dessus, dessous au miroir, entre les orteils), bon chaussage, ne pas marcher pieds nus, conduite à tenir si une plaie apparaît.
- **Levier émotionnel** : les programmes éducatifs réduisent les amputations d'environ **deux tiers** → « la complication la plus grave *et* la plus évitable par vos propres gestes ».
- **Traitement visuel** : illustration **statique** des points de contrôle (pas de séquence interactive).

**Fiche pied** = les points de contrôle de l'auto-examen + la conduite si plaie. Disponible si la branche pied est ouverte.

### 9.5 Note — deux catégories de fiche mémo

La fiche pied introduit une **seconde catégorie** de fiche, différente du principe initial :
- **Fiche-photographie personnalisée** (modules 2, 4…) : capture ce qu'on vient de manipuler ensemble, propre à ce patient.
- **Fiche-mémo de référence** (fiche pied) : contenu **stable, identique pour tous**, aide-mémoire d'un geste universel. Resservira probablement pour les modules 7 (ordonnance/hypo) et 8.

### 9.6 Pont entrant

**4 → 5** : la plaque d'athérome et le refrain « maladie des vaisseaux » arrivent du module 4. Les zones cœur/cerveau déjà explorées y apparaissent grisées.

---

## 10. Module 6 — Suivi

**Rôle :** retourner le suivi — vécu comme une corvée administrative, une liste de rendez-vous sans cause ressentie — en **tableau de bord de son année de soins**. C'est le seul module d'**application** (revue de situation réelle) et non de démonstration : il transforme tout ce que les autres modules ont installé (le modèle, les leviers, les enjeux, le traitement) en **plan concret de l'année**. Le passage à l'acte, la clôture de l'arc.
**Pilotage :** les deux (le patient peut cocher / régler ses propres stations).
**Nature :** module **d'organisation** — calme et concret comme le module 5, mais **actif** : on fait le tour, on règle, on marque, on programme. Peu de démonstration, beaucoup de mise en ordre.
**Fiche mémo :** **oui** — son calendrier de suivi personnalisé. Catégorie **photographie** (capture l'état réel du patient : fait / à programmer), avec le **plus haut ROI « frigo »** de tout l'outil.
**Refrain fil rouge :** le cadran est la **face concrète de Steno-2 / Rawshani**. « Surveiller tous les facteurs ensemble », l'approche multifactorielle qui donne +8 ans et rapproche le risque de la normale, *ça ressemble à ça* : un tour de cadran par an.

### 10.1 Nature particulière : application, pas démonstration

Tous les autres modules enseignent un principe **dans l'abstrait** — le module 4 le dit noir sur blanc : on manipule des feux *pour voir ce qui se passe*, aucune donnée réelle. Le module 6, lui, touche à l'état **réel** du patient (« avez-vous fait votre fond d'œil ? à reprogrammer quand ? »). 

La règle **zéro-donnée tient par le même mécanisme que l'assiette du module 2** : on marque en direct, on imprime la fiche, **rien ne persiste** — RGPD-propre par construction. Mais la *nature* de l'interaction bascule : ce n'est plus une démonstration, c'est une **revue de situation**. Conséquence de conception : l'objet ne peut pas être qu'un beau schéma, il doit produire un **vrai artefact de planification** (voir § 10.7).

### 10.2 Métaphore centrale : le tableau de bord (en partage avec le module 4)

Le module 6 **est** un tableau de bord — mais le module 4 en est déjà un (les 5 feux). Le partage est explicite et non négociable, car c'est lui qui évite le télescopage :

- **Module 4 = les jauges d'état** — *où j'en suis* sur mes leviers. Démonstration, non-diagnostique.
- **Module 6 = le cadran de vérification** — *quand je vérifie quoi*. Application, réel.

Les **3 feux « mesurables » du module 4** (HbA1c · tension · cholestérol) **réapparaissent** ici comme cadrans de suivi, cette fois avec leur *prochaine lecture*. Le pont 4→6 cesse d'être un simple écho : c'est la **même instrumentation**, vue une fois en état, une fois en calendrier de vérification. Continuité, pas redite.

Le reframe « examen = dépistage qui attrape la complication avant la panne » (l'idée initiale du *gardien*) est **absorbé** par le tableau de bord et dit mieux : un dépistage = **un voyant qui s'allume avant la panne**. Tout le cadran parle une seule langue — des *jauges* (ce qu'on relit : sucre, tension, cholestérol) et des *voyants* (ce qu'on dépiste : yeux, reins, pieds). Le mot « sentinelle / gardien » est écarté (trop guerrier) ; la substance reste, portée par le langage instrument.

**Registre :** *pilotage*, pas *garage*. Le patient est **aux commandes de son année** (valorisant, anti-infantilisant). On ne parle jamais de « révision des 15 000 km ».

### 10.3 Objet unique : le cadran de l'année

Un cadran **rond = l'année civile** (janvier → décembre), à la fois « tableau de bord » (rond comme un compteur) et cyclique (« ça revient chaque année », rassurant pour un patient peu lecteur ; les saisons tombent juste — grippe → secteur automne).

**Anatomie :**
- **Centre** : le motif fil-rouge (la personne / les vaisseaux protégés). C'est ce qui est surveillé.
- **4 stations « consultation » aux points cardinaux** : les **consultations trimestrielles** — le pouls du cadran. Elles sont **composites** : chaque RDV *contient* poids, tension, tolérance du traitement, coup d'œil aux pieds. Ces vitales ne sont **pas dispersées** en points flottants, elles vivent dans la consultation.
- **Couronne annuelle (les voyants/gardiens)** : les examens une fois par an, posés chacun sur leur mois — **fond d'œil**, **rein** (DFG + albuminurie), **pied complet** (monofilament 10 g), **bilan lipidique**, **dentiste**, **vaccins**.
- **HbA1c** : non pas un point flottant, mais un **surlignage** posé sur les consultations où elle est due (2 ou 4 selon le réglage).

**L'aiguille = maintenant.** Une aiguille pointe le mois courant et balaie l'année. Devant elle = à venir, à planifier ; derrière elle et non coché = à rattraper à la prochaine occasion. D'un coup d'œil : *« voilà où tu en es dans ton année de soins, voilà ce qui arrive. »* Elle transforme une liste abstraite (« vous devriez faire… ») en une **position dans le temps orientée vers l'avant** — beaucoup moins culpabilisant qu'un audit du passé.

### 10.4 Deux règles gravées (lisibilité + anti-honte)

**① Deux axes dissociés — l'aiguille dit *maintenant*, la couleur dit *à jour / à rattraper*.** Le statut d'une station se lit sur l'**intervalle recommandé**, **pas** sur l'année civile. Un fond d'œil fait en décembre dernier reste **vert** même si l'aiguille a dépassé son secteur. Sans cette règle, un patient vu en novembre verrait un cadran presque tout « derrière l'aiguille » et vide → effet *« on est en novembre et vous n'avez rien fait »*, la honte exacte qu'on fuit. Le cadran affiche une **couverture**, pas un bilan de l'année en cours → utilisable **à n'importe quel mois** sans jamais accabler.

**② Jamais de rouge-panne.** fait = **vert coché** ; à programmer / à rattraper = **ambre neutre + horloge**, jamais rouge. Le rouge reste au **module 4** (l'état de santé) ; le module 6 ne parle que de **tâches**, pas de résultats. Un tableau de bord où « pas fait » se lirait comme une panne (voiture qui meurt) serait anxiogène — l'inverse du but.

### 10.5 Fréquence = densité de points (le réglage se voit)

Une fréquence se lit comme un **nombre de marques autour du cercle**. Régler la fréquence, c'est **ajouter ou retirer des points** — le patient *voit* la cadence : HbA1c « tous les 3 mois » → 4 repères ; « tous les 6 mois » → 2. **La densité est le message** : plus c'est fréquent, plus il y a de plots. On ne l'explique pas, on le donne à voir. Chaque occurrence est aussi sa propre case cochable (« HbA1c de mars : fait ✓ / celle de juin : à programmer »), ce qui nourrit la fiche.

**Réglage = préréglages fermés par ligne** (des **crans**, pas un curseur libre) : moins d'« effet donnée », plus lisible, et garde le lien fréquence↔densité net. Le **rythme standard est pré-posé** (l'objet montre d'emblée la cadence recommandée — on comprend le rythme au premier regard), puis le soignant l'ajuste. Zéro-donnée : le réglage vit au moment T, meurt à la fin, n'existe que pour imprimer — comme la composition de l'assiette. L'objet reste **identique pour tous** (règle §2.1) ; c'est le réglage au moment T qui varie.

**Cas de l'examen moins fréquent qu'annuel** (typiquement fond d'œil à 2 ans si pas de rétinopathie et bon contrôle) : la station **reste présente, grisée, badgée « 2 ans — prochain : 2027 »**. Visible (« j'ai bien un rendez-vous yeux dans ma vie »), honnête sur le timing (« pas cette année »), jamais évaporée — oublier un dépistage est précisément ce qu'on veut éviter. Le forward-planning au-delà de 12 mois vit sur la **fiche**, pas sur le cadran.

### 10.6 Les trois temps

Comme l'assiette du module 2, le cadran **fusionne sélecteur et séquence** en un seul terrain.

**① Le cadran pré-peuplé.** Il s'affiche déjà garni du rythme standard → on comprend la cadence recommandée au premier regard.

**② Le parcours (réglage + marquage).** On fait le tour : régler les fréquences (= densifier / alléger les points), marquer chaque station **fait (vert)** / **à programmer (ambre)**. Marquage **live, zéro-donnée**. Deux appuis narratifs : valoriser d'abord le **déjà fait** (« regardez tout ce que vous avez posé autour de vous »), présenter le à-programmer comme le **prochain geste facile**.
> **Révélation « ce que ça garde » — sur demande.** Toucher une station la **marque** simplement (défaut : le cadran reste un instrument calme, lisible d'un coup d'œil). Mais une **porte optionnelle** retourne la station et révèle l'organe surveillé — rappel visuel du module 5 (œil → rétine, rein → néphron…). C'est **ici que vit le pont 5↔6**, jamais imposé : on le pousse si on veut expliquer *pourquoi* ce voyant existe. On garde le cadran net *et* le lien au 5, sans qu'ils s'annulent.

**③ La fiche qui décroche.** L'écran/plan bouclé produit la fiche (§10.7).

### 10.7 La fiche — calendrier de suivi (artefact séparé, ROI « frigo » maximal)

**Deux artefacts, pas un.** Le **cadran fait comprendre** (enseigne le rythme, se lit d'un regard) ; la **fiche fait agir** (planifie). Une roue se lit mal comme to-do → on ne force pas les deux métiers dans un seul objet. La fiche **décroche** en check-list, mais partage l'**ADN visuel du cadran** pour qu'elle « descende » visiblement de lui.

Catégorie **photographie personnalisée**, mais à visée **logistique** (la seule fiche de l'outil qui bascule du mémo pédagogique vers l'**outil de planification réel**). Design doit la rendre **utilisable pour de vrai** :
- Mois lisibles ; une **case à cocher** par examen ; un **espace pour écrire la vraie date** du rendez-vous une fois pris.
- Distinction claire ✓ fait / ⏳ à programmer ; les échéances > 12 mois (bisannuel) y figurent.
- Tient sur une page, se colle sur un frigo, se relit dans six mois.
- Design : lui donner une **identité d'outil** (cases, dates à écrire) distincte des fiches-photographies purement pédagogiques.

### 10.8 Ponts

- **5 ↔ 6** *(second pont bidirectionnel).* Le 5 promet « c'est dépistable », le 6 l'incarne. Entrant : depuis une branche du module 5, « *cet examen, on le programme quand ?* » mène à la station du cadran. Sortant/réciproque : la **révélation à la demande** (§10.6, temps ②) rouvre l'organe du module 5. Voir §2.5.
- **4 → 6.** Les 3 feux mesurables du module 4 réapparaissent en cadrans de suivi. Même instrumentation, état → vérification. Voir §2.5.
- **6 → 7** *(émergent).* Surveillances liées aux médicaments → porte possible vers Traitements. À confirmer quand le module 7 sera spécifié.

### 10.9 Socle probant (2ᵉ niveau / narration)

⚠️ **Méthodo à revalider à la construction** (comme le contenu médicamenteux du module 7) : les **fréquences exactes** doivent être re-vérifiées contre **ADA Standards of Care (millésime courant)** et **HAS / SFD** au moment du câblage — elles bougent à la marge. Cadre de référence à ce stade, disponible en 2ᵉ niveau au survol :
- **HbA1c** : ~3 mois si hors cible / traitement modifié ; ~6 mois si stable dans la cible.
- **Fond d'œil / rétinographie** : au diagnostic (DT2), puis annuel — espaçable à 1–2 ans si pas de rétinopathie et bon contrôle.
- **Rein** : DFG estimé **+ albuminurie (RAC)** au moins annuels.
- **Pied** : examen complet au monofilament 10 g au moins annuel ; plus fréquent selon la gradation du risque podologique.
- **Bilan lipidique** : annuel (ou davantage sous traitement / après ajustement).
- **Tension · poids · statut tabagique** : à chaque consultation.
- **Dentaire** : au moins annuel. **Vaccins** : grippe annuelle ; pneumocoque / COVID / hépatite B selon recommandations.

Ancre **fil rouge** en 2ᵉ niveau : le **suivi structuré multifactoriel** est le bras opérationnel de **Steno-2** (+8 ans) et de **Rawshani** (tous les facteurs dans la cible → risque quasi normalisé).

### 10.10 Notes de conception

- **Cadran = année civile + aiguille = maintenant** : un seul objet unifie « tableau de bord » (rond) et « calendrier » (daté), disposé **par le temps** (le type jauge/voyant survit comme sous-langage graphique, pas comme rangement spatial).
- **Recouvrement volontaire avec le module 5 (pied)** : la station « pied » du cadran (examen annuel au monofilament) recoupe la branche pied du module 5 (auto-examen quotidien). Répétition **voulue** — même logique macro/micro : le module 5 porte *ce que le patient fait*, le module 6 porte *ce que le soignant vérifie et quand*.
- **Deux artefacts** (cadran qui enseigne / fiche qui organise) : ADN visuel commun obligatoire pour que la fiche « descende » du cadran.

---

## 11. Module 7 — Traitements

**Rôle :** retirer le modèle réducteur *« mes cachets font baisser le sucre »* et le remplacer par *« certains de mes traitements gardent mes vaisseaux »*. Le module **encaisse le fil rouge** : la silhouette du module 5 revient une **3ᵉ fois** — les organes vus comme *menaces* (5), *surveillés* (6), sont ici *défendus* (7). Message-phare : la **double protection cœur-rein** (gliflozines / AR GLP-1), **montrée, pas dite**.
**Pilotage :** soignant (contenu sensible, mené par la consultation).
**Nature :** module **explicatif** — on transcrit l'ordonnance réelle et on montre *où* chaque traitement agit. Aucune option thérapeutique proposée.
**Fiche mémo :** **non**. Le patient a déjà son **ordonnance papier** (celle qui fait foi à la pharmacie) ; en produire une « illustrée » créerait un **doublon concurrent**, source de confusion. → correction du cadrage initial (qui prévoyait une « ordonnance illustrée » à haut ROI frigo). Le module rejoint 1 et 3 : sa valeur est la **compréhension en consultation**, pas l'emport.

### 11.1 Contrainte structurante : l'obsolescence

Le contenu médicamenteux **vieillit vite** (noms, classes, place dans les recommandations bougent) — là où l'aliment et le corps sont stables. Le design **isole le durable du volatil** :
- **Durable** (porte la pédagogie) : le *rôle*, les *zones d'action*, le *quoi surveiller* — attachés à la **classe / au rôle**.
- **Volatil** (ne porte qu'un nom) : la **molécule exacte**, posée en **étiquette fine** par le soignant.

→ un nouveau médicament = une étiquette à ajouter, **rien à redessiner**. Un seul endroit à revalider, et **plus souvent** que le reste de l'outil.

### 11.2 Objet : ordonnance ↔ silhouette (deux zones simultanées)

- **Gauche — l'ordonnance** qu'on **transcrit** ligne par ligne : les lignes **réelles** du patient, **jamais un catalogue** de molécules (verrou anti-auto-prescription, voir §11.4).
- **Droite — la silhouette-organes du module 5** (3ᵉ passage).
- **Clic sur une ligne → la/les zones où ce traitement agit s'allument** sur la silhouette.

**Le message-phare est porté par l'image :** une gliflozine / un AR GLP-1 **allume plusieurs zones** (sucre + cœur + rein) ; un traitement « sucre seul » n'en allume qu'une. Le patient **voit** qu'un seul traitement défend plusieurs fronts — pendant exact du **« plusieurs rayons »** du module 3. On ne l'écrit pas, la silhouette le dit.

### 11.3 Partage des deux zones

- **Silhouette = protection** (*où ça agit*) — **gardée pure** : pas d'alerte ni de clignotement sur le corps, elle ne montre que le **bien** que fait le traitement.
- **Ordonnance = usage** : le *quand* en **pictogramme sur la ligne** (quotidien / hebdo / aux repas) ; le *quoi surveiller* en **pastille 2ᵉ niveau sur la ligne** (peut faire l'hypo ? rein à contrôler ?), **jamais sur le corps**.

### 11.4 Verrou anti-auto-prescription

On **transcrit et on explique**, on **ne compare ni ne choisit**. L'outil illustre l'ordonnance existante, ne propose **aucune** option thérapeutique. Le choix entre molécules relève de la consultation.

### 11.5 Vigilance narrative (double protection)

Symétrique de l'effet « bulletin » du module 4 : informer que « certains protègent le cœur-rein » **sans faire sentir** au patient qui n'est *pas* sous ces classes que son traitement serait au rabais. L'outil **informe**, il n'éditorialise pas « les vôtres sont moins bien » — ça, c'est une conversation clinique, pas un jugement de l'outil.

### 11.6 Les 3 temps

Comme l'assiette du module 2, l'objet **fusionne sélecteur** (construire l'ordonnance) **et séquence** (allumer les zones). **Pas de temps ③ « fiche »** (sans emport) → le module se **clôt sur la silhouette pleinement allumée** = la carte de protection du patient, vue et comprise à l'écran.

### 11.7 Ponts

- **7 ↔ 5** : même silhouette. Un organe *défendu* (7) rouvre l'*enjeu* (5) et réciproquement.
- **6 ↔ 7** *(confirmé bidirectionnel)* : le *quoi surveiller* d'une ligne (ex. contrôle du rein) renvoie à la station du cadran du module 6 ; réciproquement, une surveillance du cadran liée à un médicament rouvre la ligne.
- **7 → 8** : la pastille « peut faire l'hypo » (sulfamides, insuline) ouvre la fiche-réflexe du module 8.
- **7 → 9** : une ligne d'**insuline** ouvre le module dédié d'adaptation des doses.

---

## 12. Module 8 — Hypoglycémie

**Rôle :** installer le **réflexe de resucrage** — reconnaître tôt, traiter avec une quantité **mesurée** (15 g), puis **attendre** — pour arrêter une hypo avant qu'elle ne s'aggrave, sans basculer dans la sur-réaction.
**Pilotage :** soignant.
**Nature :** module **le plus singulier** — le seul dont le contenu se **rappelle en pleine crise**, pas au calme. Une hypo prive le cerveau de sucre (tremblements, sueurs, confusion, neuroglucopénie) → tout doit être **exécutable sous stress**. Barre de conception = clarté d'un **panneau de sortie de secours** : ça se *voit*, ça ne se lit pas. Opposé des modules contemplatifs.
**Fiche mémo :** **oui** — la **carte-réflexe** est le cœur du module (comme la fiche pied, socle référence). Hybride : *structure* universelle (les 15), *dessus* personnalisé (mes signes, mon resucrage). **Patient-only, ultra-simple** ; l'hypo sévère / l'entourage est traitée **par la parole du soignant**, jamais sur la carte (pour ne pas encombrer l'objet de crise).

### 12.1 Le cœur : reconnaître tôt · doser · attendre (parallèle au module 9)

L'ennemi de l'hypo est la **panique**, dans les deux sens :
- **sous-réaction** → on ne reconnaît pas, ça s'aggrave jusqu'au malaise grave ;
- **sur-réaction** → *« je me suis senti bas, j'ai vidé le frigo »* → rebond en hyper, prise de poids, cycle de peur.

La **règle des 15** existe pour ça : une quantité **mesurée** (15 g de sucre rapide), puis **on attend ~15 min sans se resucrer en rafale**, on recontrôle, on répète seulement si besoin. **Le temps fort n'est pas le geste, c'est l'attente** contre l'envie de continuer — **même enseignement de retenue que le module 9** (« attendre 3 jours » ↔ « attendre 15 minutes »).

### 12.2 La courbe de récupération (réutilisation, 4ᵉ fois)

Après 15 g, la glycémie remonte en ~15 min : la **courbe de récupération**. Si on panique et qu'on remange, la courbe **dépasse** et part en hyper. On **montre pourquoi on attend** : le sucre n'a pas encore agi, en rajouter maintenant = overshoot garanti. **Même langage visuel que les modules 2 / 3 / 9** — le patient reconnaît sa courbe. *(Piège écarté au passage : le chocolat / les sucreries grasses remontent trop lentement — le gras freine l'absorption.)*

### 12.3 Division du travail avec le module 9

Pas de redite : le **module 9 ajuste sur plusieurs jours pour prévenir** les hypos (titration) ; le **module 8 réagit à l'hypo maintenant** (réflexe aigu). Les ponts l'expriment (9 → 8 : tu détectes un bas → voici le geste).

### 12.4 Les signes : apprendre SA signature précoce

Chaque patient a ses **signes précoces** (tremblement, sueurs, palpitations, faim, irritabilité, trouble de la concentration…). Enjeu de sécurité : **agir aux signes précoces**, avant que la neuroglucopénie n'ôte la capacité de se traiter soi-même. Cette ligne précoce / tardive recoupe la ligne **auto-traitement / entourage** : tant que je reconnais → je me resucre ; trop tard → quelqu'un agit pour moi (glucagon, PLS, secours — **narration soignant**, hors carte).

**Perte des signes d'alerte** (*hypo unawareness*) : certains patients ne sentent plus venir l'hypo → le **capteur (module 9)** devient le filet, il **alarme** même sans symptôme. Pont 8 ↔ 9.

### 12.5 Les trois temps

**① Sélecteur — construire mon profil hypo.** Le patient identifie **ses signes précoces** (lesquels *lui* parlent en premier) et **son resucrage habituel** — les 15 g qu'il aura *vraiment* sur lui (jus, sucres, comprimés de glucose). Personnalisation qui augmente l'exécution réelle : la carte montrera *ses* signes, *son* remède, pas un dépliant générique.

**② Séquence — le réflexe 15/15.** On déroule : signes → 15 g → **attente 15 min** (avec la courbe de récupération / overshoot) → recontrôle → répéter ou récupérer. Une fois remonté, si le prochain repas est loin → collation de sucres lents pour éviter la rechute.

**③ La carte-réflexe (fiche).** Objet de crise : gros, simple, la boucle 15/15 **inratable**, le dessus personnalisé (mes signes, mon remède). Se lit en tremblant.

### 12.6 Ton & contrainte de conception

Fiche **mobilisée en détresse** → la clarté sous stress prime sur tout : pictogrammes, très peu de mots, la boucle 15/15 comme une signalétique. **Aucun encombrement** (entourage / glucagon reste hors carte). C'est l'artefact « exécuter sous contrainte » de l'outil — barre = panneau d'urgence.

### 12.7 Ponts

- **7 → 8** *(entrant)* : la pastille « peut faire l'hypo » (sulfamides, insuline) du module 7 ouvre la carte-réflexe.
- **9 → 8** *(entrant)* : le 3ᵉ cas du module 9 (trace basse) bascule vers le resucrage.
- **8 ↔ 9** : en cas de perte des signes d'alerte, le capteur du module 9 alarme et sert de filet.
- **Continuité de courbe** avec les modules 2 / 3 / 9 (la récupération est la même courbe).

---

## 13. Module 9 — Insuline (adaptation des doses)

**Rôle :** rendre le patient déjà sous insuline **autonome et sûr** dans la lecture de sa **courbe de capteur (FreeStyle Libre)** et l'ajustement de sa dose — en apprenant à voir une **tendance** plutôt qu'à réagir à un chiffre isolé.
**Pilotage :** soignant.
**Nature :** module **le plus délicat** de l'outil — le seul où une incompréhension a une **conséquence physique directe** (hypo sévère). La **sécurité est la colonne vertébrale du design**, pas une note de bas de page (comme « jamais la menace seule » structure le module 5).
**Périmètre :** **adapter les doses** pour patient **déjà sous insuline** (consolider / corriger). Pas un module « débuter l'insuline ».
**Fiche mémo :** **non** (option référence gardée pour plus tard, voir §13.9).

### 13.1 Principe de sécurité fondateur : le verrou est clinique

Le garde-fou n'est pas la timidité de l'outil, c'est **le jugement du soignant qui ouvre la porte**. On ne montre ce module qu'à un patient jugé **capable d'ajuster**. Conséquence : l'outil n'étant **jamais en libre-service**, il peut être **pleinement explicite** — il enseigne l'ajustement sans détour, parce que la sélection clinique a déjà fait le tri. *La sélection est le verrou ; l'outil, une fois ouvert, enseigne franchement.*

### 13.2 Résolution de la tension « chiffres »

Tout l'outil bannit le chiffre au profit de l'image ; or un capteur, *c'est* des chiffres. Résolution : **on n'enseigne aucun nombre.** Le FreeStyle Libre joue ici *en notre faveur* — il affiche d'emblée une **courbe**, une **flèche de tendance** et des **bandes de couleur** : le capteur parle déjà notre grammaire (lire une forme, pas un nombre).
- **Le pas d'ajustement est un geste, pas un nombre** : « un petit cran », une flèche — jamais « +2 UI ». La magnitude réelle vient à 100 % du **protocole du patient**.
- **La cible est une bande, pas un seuil** : on lit haut / cible / bas en *position* et *couleur* (grammaire des feux du module 4), pas en g/L.
- **Les seuls nombres présents sont ceux de la trace du patient lui-même** — ses propres données, lues **visuellement** (forme de la courbe, couleur), jamais commentées au chiffre près.

→ **aucun nombre générique** à mémoriser ni à confondre avec « sa règle ». *(Supersède la ligne rouge initiale « chiffres génériques d'exemple autorisés » : le design a rendu le chiffre inutile — meilleur résultat.)*

### 13.3 La zone-cible posée par le soignant (temps ①)

En début de séance, le soignant **règle la bande verte « temps dans la cible »** sur la vue-courbe — geste de sécurité *visible* et individualisant :
- sujet jeune → bande basse et serrée ;
- patient âgé / fragile → bande **posée plus haut** : le patient voit *« ma cible à moi est ici, on vise plus doux, éviter l'hypo prime sur le chiffre parfait »*.

L'individualisation devient un moment pédagogique, pas un réglage caché. Le patient lit une **bande**, jamais un seuil chiffré. Le sélecteur du temps ① porte aussi **le schéma** (basal seul / basal + 1 / basal-bolus → décide quelles insulines existent, donc quels couplages sont pertinents).

### 13.4 L'objet : la courbe du capteur (FreeStyle Libre)

Quasiment tous les patients sous insuline ont un **FreeStyle Libre** → l'objet réel qu'ils lisent n'est **pas une grille de valeurs, c'est une courbe**. Le module en fait son **objet primaire** ; la grille jours × moments devient le **repli** pour la minorité sans capteur (dans ce repli, l'à jeun = un **point marqué sur la trace**).

**Réutilisation de la courbe des modules 2 et 3** *(continuité forte)* : la courbe de glycémie post-repas que le patient a apprise au module 2 (ce que fait un aliment) et au module 3 (ce que fait le mouvement sur le pic) est **la même courbe que sa trace Libre**. Il apprend à lire son capteur **depuis le module 2 sans le savoir**. Même langage visuel d'un bout à l'autre de l'outil.

Deux mécaniques de lecture, reposées sur la courbe :
- **Couplage** — *chaque portion de courbe parle à une insuline*. La trace se découpe en **segments de temps** : le **segment nuit / à jeun ↔ la lente** (couplage **unique et propre**, cas majoritaire) ; les **bosses post-repas ↔ le bolus**. Clic sur un segment → l'insuline correspondante s'allume. Le temps devient **spatial** (comme le curseur du module 3), plus intuitif que la grille. Réutilise le geste « allumer le lien » du module 7 et l'esprit clé/serrure du module 1.
- **Tendance** — *on lit une pente, pas le chiffre du jour*. La **flèche de tendance** du capteur + **plusieurs jours superposés** (le profil type du Libre) : la pente se voit d'un **bloc**, sans moyenne ni calcul.

**Visuel de synthèse — le « Temps dans la cible »** (barre colorée empilée : part de vert / haut / bas). C'est le langage actuel du Libre et il **épouse notre grammaire de zones** : « combien de mon temps est vert ? ». Écho direct de l'idée de **couverture** du module 6 — un indicateur unique, positif, qui valorise le chemin fait plutôt que de compter les manques.

### 13.5 La séquence (temps ②) : les trois cas, cœur du module

On n'enseigne **pas** « voir haut → ajouter » (réflexe dangereux) mais à **discriminer**. Les trois cas se lisent **sur la trace**, à parts égales :
1. **Ça penche haut** (la trace du matin dérive haut sur plusieurs nuits) → **un cran de plus** sur la lente (geste, non chiffré) → **et surtout : on attend ~3 jours sans retoucher à rien**, puis on recontrôle. **La cadence est le temps fort**, pas le cran — rebouger trop tôt (empilement) est l'erreur qui envoie à l'hypo.
2. **Une seule mauvaise nuit** (bruit, pas tendance) → **on ne bouge pas**. Distinguer le signal du hasard.
3. **La trace plonge dans le bas** → **on descend d'un cran**, et **l'hypo prime** : on la traite d'abord (→ temps ③). Porte l'asymétrie du risque.

**L'hypo nocturne invisible — au cœur de la sécurité.** Le capteur révèle les **chutes de la nuit** que le patient ne sent pas et que le bout du doigt ratait : *« regardez, à 3 h vous étiez bas sans le savoir »*. C'est *l'*argument concret qui justifie de titrer la lente **avec prudence** et qui muscle le 3ᵉ cas comme tout le refrain « dans le doute, on ne monte pas ». Levier de sécurité que la piqûre ne pouvait pas donner.

Ancre récurrente : **« votre protocole = votre ordonnance »** (le cran réel et le rythme exact viennent de là). Refrain de sécurité : **« dans le doute, on ne monte pas — et on traite l'hypo d'abord. »**

### 13.6 Le resucrage (temps ③)

Le 3ᵉ cas (case basse) bascule naturellement vers le **resucrage** — la **règle des 15**, qui vit au **module 8** (universel). Le module 9 y **renvoie** sans le dupliquer (même logique que le pied 5/6).

### 13.7 Basal / bolus

- **Basal = pleinement traité** : titration de la lente sur le **segment nuit / à jeun** de la trace (cas majoritaire en DT2, sûr, haut rendement). Couplage unique et clair.
- **Bolus / correction = seulement pour les schémas basal-bolus**, plus loin dans le module et **plus encadré** : le couplage aux **bosses post-repas** y est plus ambigu (quelle portion « commande » quel bolus) et la surcorrection est le principal pourvoyeur d'hypo. **On ne met jamais la partie risquée au même niveau que la partie sûre.**

### 13.8 Ponts

- **7 → 9** *(entrant)* : une ligne d'insuline au module 7 ouvre ce module.
- **9 → 8** : le 3ᵉ cas (trace basse) renvoie au resucrage du module 8.
- **9 ↔ 2 / 3** *(nouveau)* : la trace du capteur **est la même courbe** que la glycémie post-repas des modules 2 et 3. La bosse post-repas qu'on aplatit au module 2 (aliment) / module 3 (mouvement) est exactement ce qu'un **bolus** couvre. Le patient apprend à lire son Libre dès le module 2 sans le savoir.
- **9 ↔ 6** *(à examiner)* : autosurveillance et cadran de suivi.

### 13.9 Fiche

Pas de fiche d'ajustement (dangereuse : prise pour un protocole, variable selon le patient). Option gardée : fiche **de référence stable** « lire sa courbe + règle des 15 », identique pour tous, **sans aucune dose**. Piste ultérieure : l'outil pourrait servir à **générer / illustrer un protocole** de titration (à explorer).

---

## 14. Répartition des fiches mémo

Deux catégories de fiche (voir §9.5) :
- **Photographie personnalisée** — capture ce qu'on vient de manipuler ensemble, propre au patient.
- **Mémo de référence** — contenu stable, identique pour tous, aide-mémoire d'un geste/réflexe universel.

| Module | Fiche | Catégorie |
|--------|-------|-----------|
| 2 · Alimentation | Son assiette-modèle + principes | Photographie |
| 4 · RCV | Ses feux + leviers retenus | Photographie |
| 5 · Complications | Auto-examen du pied + conduite si plaie | Référence |
| 6 · Suivi | Son calendrier *(ROI ++)* | Photographie |
| 8 · Hypo | Sa carte-réflexe 15/15 (dessus perso : signes + resucrage) | Référence + photographie |
| 9 · Insuline | *(option)* Lire sa courbe + règle des 15 — sans dose | Référence *(plus tard)* |

*(Modules 1, 3 et 7 : sans fiche. Module 7 : le patient a déjà son ordonnance papier — pas de doublon.)*

---

## 15. Journal des décisions

- Écran = support de la parole du soignant (narration en direct), pas e-learning autoportant → texte minimal, tout porté par l'image.
- Personnalisation = sélection au moment T, rien en amont, rien stocké.
- Pas d'audio ni de traductions à produire (le soignant narre).
- Anti-infantilisation = qualité graphique + 2ᵉ niveau de lecture au survol.
- Poids retiré des FDR → remplacé par sédentarité/inactivité.
- Alimentation : 4 défis guidés isolant chacun une variable, combinés en synthèse ; proportion = 4ᵉ défi (et non réglage permanent) pour ne pas brouiller les 3 premières démonstrations.
- Travailler en **charge glycémique** (CG), pas en index glycémique (IG).
- Module 4 pensé comme **chaîne causale** État→Mécanisme→Conséquence, pas 3 objets juxtaposés.
- Feux ↔ artère = **un seul objet réversible** : le sens « retour au vert » (Rawshani) est le message d'espoir, non négociable.
- FDRCV = module **de démonstration**, non lié aux vraies valeurs du patient → reste zéro-donnée ; valeurs-seuil seulement en 2ᵉ niveau.
- **Plaque d'athérome = motif-fil** qui voyage de l'artère générique au modèle anatomique (comble le saut « artères encrassées » → « AVC »).
- Non-modifiables : **hors des feux**, évoqués en une phrase de cadrage déculpabilisante au dernier écran (ni ignorés, ni manipulables).
- Introduction d'une **couche de navigation inter-modules (ponts optionnels)** : premiers ponts 1→2 et 4→5.
- Fiche FDRCV : leviers cochés selon les besoins ; vigilance narrative (pas technique) pour éviter l'effet « bulletin » si tout est coché.
- Module 3 en 3 temps avec **rayonnement en premier** (motivation d'abord : bénéfices multiples), puis clic sur le rayon « sucre » vers volume et timing.
- Jauge d'activité **ouverte** (sans plafond) + **tout-en-minutes**, intensité en 2ᵉ niveau → message « chaque activité compte », déculpabilisant.
- Bénéfices non-glycémiques en **formulation qualitative** à l'écran ; chiffres bruts (SMD/HR) réservés à la documentation, jamais affichés.
- **Renforcement musculaire montré mais non comptabilisé à part** (option « on assume ») : activités du quotidien marquées « bon pour les muscles », pas de catégorie séparée.
- Santé mentale / marche courte post-repas / interruption de la sédentarité : **étayés par recherche web** (hors rapports OpenEvidence initiaux), sources 2023–2025.
- Module 3 **sans fiche** (comme module 1).
- Premier **pont bidirectionnel 2 ↔ 3** via la courbe partagée.
- Module 5 = module **contemplatif** (exploration guidée, peu d'interactivité) ; le calme est une fonctionnalité face à un contenu anxiogène.
- **Règle non négociable du module 5** : chaque complication en 3 temps (ce que c'est / évitable-dépistable / geste), jamais la menace seule. **Signature « évitable » récurrente**.
- Silhouette-carte unique : **cœur/cerveau grisés durs** (vus au module 4) → macro et micro = deux profondeurs d'une même maladie vasculaire.
- **Pied = branche renforcée** (seul organe où le patient est acteur direct) ; illustration statique ; levier −2/3 amputations.
- Introduction de **deux catégories de fiche** : photographie personnalisée vs mémo de référence (la fiche pied inaugure la seconde).
- Module 6 = seul module d'**application** (revue de situation réelle), pas de démonstration ; zéro-donnée par le même mécanisme que l'assiette (marquage live → impression → rien ne persiste).
- Métaphore = **tableau de bord**, en partage explicite avec le module 4 : **4 = jauges d'état** (*où j'en suis*) / **6 = cadran de vérification** (*quand je vérifie quoi*). Reframe « gardien » absorbé → « voyant qui s'allume avant la panne ». Registre **pilotage, pas garage**.
- Objet = **cadran rond = année civile** (janv→déc) + **aiguille = maintenant** (oriente vers l'avant, pas d'audit du passé). Disposition **par le temps** ; jauge/voyant = sous-langage graphique, pas rangement spatial.
- **Deux axes dissociés (règle gravée)** : l'aiguille dit *maintenant*, la couleur dit *à jour / à rattraper* → statut lu sur l'**intervalle recommandé**, pas sur l'année civile → objet utilisable à n'importe quel mois sans accabler.
- **Jamais de rouge-panne** : fait = vert / à programmer = ambre + horloge. Le rouge (résultat de santé) reste au module 4 ; le 6 ne parle que de **tâches**.
- **Fréquence = densité de points** (le réglage se voit) ; **préréglages fermés par ligne** (crans, pas curseur) ; rythme standard **pré-posé** puis ajusté (zéro-donnée). Examen bisannuel = station **grisée-présente** (« 2 ans — prochain : … »), jamais évaporée.
- **Révélation « ce que ça garde » sur demande** (porte du pont 5↔6), jamais imposée → le cadran reste un instrument calme.
- **Deux artefacts** : le **cadran enseigne**, la **fiche organise** (check-list datée, cases, date à écrire — ROI « frigo » maximal, identité d'outil), ADN visuel commun.
- Nouveaux ponts : **5 ↔ 6** (second bidirectionnel : le 6 matérialise le « dépistable » du 5), **4 → 6** (même instrumentation, état → vérification), **6 → 7** émergent.
- Fréquences exactes à **revalider à la construction** (ADA / HAS-SFD).
- Module 7 = objet **ordonnance ↔ silhouette** (2 zones simultanées) : clic sur une ligne → zones d'action allumées sur la silhouette du module 5 (**3ᵉ passage** : menace→surveillé→défendu). Double protection **montrée** (plusieurs zones s'allument), pas dite.
- Partage : **silhouette = protection** (gardée pure, pas d'alerte sur le corps) / **ordonnance = usage** (quand en picto, quoi surveiller en pastille 2ᵉ niveau sur la ligne).
- Anti-obsolescence : zones d'action attachées à la **classe/rôle**, molécule = **étiquette fine volatile** → un seul endroit à revalider.
- **Verrou anti-auto-prescription** : on **transcrit** l'ordonnance réelle (jamais un catalogue), on explique, on ne compare pas.
- Module 7 **sans fiche** (correction du cadrage « ordonnance illustrée ») : le patient a déjà son ordonnance papier officielle → pas de doublon concurrent. Valeur = compréhension en consult.
- Nouveaux ponts : **7↔5**, **6↔7** (confirmé), **7→8**, **7→9**, **9→8**.
- **Ajout d'un 9ᵉ module — Insuline (adaptation des doses)** : le seul où une incompréhension a une conséquence physique directe → **sécurité = colonne vertébrale du design**.
- Insuline : périmètre = **adapter les doses**, public = **déjà sous insuline** ; **chiffres génériques d'exemple** autorisés, jamais la dose réelle ; l'outil enseigne le **raisonnement**, renvoie au **protocole du prescripteur**.
- Règle-socle insuline : **filigrane « exemple »** · ancre « votre protocole = votre ordonnance » · refrain **« dans le doute on ne monte pas, on traite l'hypo d'abord »** (asymétrie du risque).
- Objet insuline = **le carnet** (jours × moments), 2 mécaniques : **couplage** (chaque glycémie parle à une insuline) + **tendance** (lire une pente, pas le chiffre du jour). 3 temps : schéma → couplage/tendance → resucrage (renvoi 8).
- Insuline : **basal pleinement traité** (titration de la lente sur la glycémie à jeun) ; **bolus/correction seulement si schéma basal-bolus**, plus tard et plus encadré.
- Insuline **sans fiche d'ajustement** (dangereuse) ; option future = fiche **de référence** « lire mon carnet + règle des 15 » sans dose ; piste : générer/illustrer un protocole (plus tard).
- Insuline — **verrou = clinique** : la sélection du soignant (patient jugé capable) est le garde-fou → l'outil, jamais en libre-service, peut être **pleinement explicite** (démonstration d'ajustement complète assumée).
- Insuline — **on n'enseigne aucun nombre** : pas d'ajustement = **geste/flèche non chiffré** ; cible = **bande** (position, pas seuil) posée par le soignant ; seuls nombres = les glycémies du **carnet du patient**, lues en couleur. → **supersède** la décision « chiffres génériques d'exemple autorisés » (devenue inutile).
- Insuline — **zone-cible posée par le soignant** (temps ①) : geste de sécurité visible et individualisant (plus haute pour le sujet âgé/fragile = viser plus doux).
- Insuline — **séquence = 3 cas à parts égales** (penche haut → cran + **attente 3 j** ; 1 jour haut → on ne bouge pas ; case basse → on descend, l'hypo prime). Enseigne à **discriminer**, pas à réagir. **La cadence (attendre) est le temps fort**, pas le cran.
- Insuline — objet = **carnet à cases colorées** ; couplage à jeun↔lente (basal, unique et propre) ; tendance = **motif de pente**, pas de calcul. Bolus seulement si basal-bolus, plus encadré.
- Insuline — **objet primaire = la courbe du capteur (FreeStyle Libre)**, quasi universel chez les patients sous insuline ; la grille jours×moments devient le **repli** (à jeun = point marqué sur la trace). Couplage par **segments de temps** (nuit/à jeun↔lente, bosses post-repas↔bolus).
- Insuline — **réutilisation de la courbe des modules 2/3** : la trace Libre = la courbe post-repas déjà apprise → nouveau pont **9↔2/3**, le patient apprend à lire son capteur dès le module 2. Même langage visuel sur tout l'outil.
- Insuline — **« Temps dans la cible »** (barre colorée, % de vert) adopté comme **visuel de synthèse** : langage actuel du Libre, épouse notre grammaire de zones, écho « couverture » du module 6.
- Insuline — **hypo nocturne invisible** mise au cœur du temps de sécurité : le capteur révèle les chutes non ressenties (que la piqûre ratait) → justifie de titrer la lente avec prudence.
- Module 8 = seul module **rappelé en crise** (cerveau privé de sucre) → barre de conception = **panneau de sortie de secours**, exécutable sous stress ; opposé des modules contemplatifs.
- Module 8 — cœur = **reconnaître tôt · doser (15 g) · attendre** ; l'ennemi est la **panique** (sous- ET sur-réaction / « vider le frigo »). **L'attente est le temps fort** — même retenue que le module 9 (« attendre 15 min » ↔ « attendre 3 jours »).
- Module 8 — **réutilisation de la courbe (4ᵉ fois)** : courbe de récupération après 15 g ; panique = overshoot en hyper → montre *pourquoi* on attend. Continuité 2/3/9/8. (Piège écarté : chocolat/gras trop lent.)
- Module 8 — **division du travail avec le 9** : le 9 prévient sur plusieurs jours (titration), le 8 réagit maintenant (réflexe aigu).
- Module 8 — sélecteur = **profil hypo perso** (mes signes précoces + mon resucrage habituel, pas les situations à risque). Signes précoces = agir avant la neuroglucopénie.
- Module 8 — **hypo sévère / entourage** (glucagon, PLS, secours) traitée **par la parole du soignant**, **hors carte** : la carte reste **patient-only, ultra-simple**.
- Module 8 — fiche **hybride** (structure référence des 15 + dessus photographie perso). Pont **8↔9** (le capteur alarme en cas de perte des signes d'alerte).
- **★ Les 9 modules sont désormais spécifiés.** Prochaine étape : passes transverses (schéma des ponts, cohérence visuelle) puis brief Design / prototypage.
