# Brief Design — Outil ETP Prévention cardiovasculaire (thème `cardio`)
## Document à transmettre à Claude Design (maquette écran par écran)

> **Ce document dit *à quoi ça ressemble*.** L'autorité pédagogique (le *pourquoi*)
> reste les rapports OpenEvidence dans `docs/cardio/evidence-cardio/` (socle + complément,
> 2026-07-21) — à lire en cas de doute sur une intention ou un chiffre.
> Ici : zones d'écran, objets manipulables, états visuels, motifs partagés, pièges à éviter.
> Chaque fiche-module est autoportante : on peut la traiter isolément.
>
> **Périmètre : prévention PRIMAIRE.** Population = adultes à risque cardiovasculaire,
> **non spécifiquement diabétiques**. Le diabète est ici *un facteur parmi d'autres*
> (un « robinet » du module 2) qui renvoie au thème diabète. La prévention secondaire
> (post-infarctus / post-AVC : réadaptation, DAPT, cibles LDL très basses) est **hors v1**.
>
> **Thème frère, grammaire héritée.** 4 des 5 objets-héros existent déjà côté diabète
> (plaque d'athérome, silhouette-corps, feux tricolores, cadran de l'année). Le thème
> cardio les **réutilise** pour rester cohérent avec l'outil ; un seul objet est neuf :
> la **carte-réflexe VITE** (module 10).

---

## 0. Ce qu'on dessine (contexte en 6 points)

1. **Support de consultation, pas e-learning.** Grand moniteur horizontal **tourné vers le patient**, pendant que le soignant parle. Texte à l'écran **minimal** — tout passe par l'image. Jamais un diaporama qu'on lit.
2. **Public double, sans jamais infantiliser.** Patients à faible littératie / allophones **et** patients CSP+. L'image parle seule au premier ; une **2ᵉ couche de donnée au survol** (hover) nourrit le second sans s'imposer. Sobriété haut de gamme = anti-infantilisation — **jamais de gros smileys, de ton scolaire, de bulles enfantines.**
3. **Rythme en 3 temps partout** : ① **Sélecteur** (on choisit visuellement ce qui concerne *ce* patient) → ② **Séquence** (courte manip) → ③ **Image à emporter** (écran final, parfois imprimable). Sur desktop large, sélecteur et séquence **coexistent souvent** (pas des étapes qui se cachent).
4. **Zéro donnée stockée.** Rien ne persiste ; les fiches sont générées à la volée puis imprimées. Ne jamais dessiner de « compte », « historique », « profil enregistré ».
5. **Non diagnostique.** On manipule des feux/curseurs **« pour voir »**, jamais avec les vraies données du patient, jamais un score de risque calculé affiché. Cibles cliquables larges, lisibilité à **~1 m**.
6. **Langue : français.** Peu de mots, gros, très lisibles.

---

## 1. Système visuel commun (à fixer AVANT les modules)

Ces éléments reviennent d'un module à l'autre. Ils doivent être **le même objet graphique** à chaque réapparition — c'est ce qui fait tenir l'outil comme un tout.

### 1.1 La grammaire des couleurs — feux tricolores
Vert / ambre / rouge = **le langage de base** (état d'un facteur, charge d'un aliment, zone d'une bande).
- **Vert** = favorable / dans la cible / fait.
- **Ambre** = intermédiaire / à surveiller / à programmer.
- **Rouge** = défavorable / à risque — **réservé à l'ÉTAT DE SANTÉ** (facteurs des modules 2/4/5, plaque). **Jamais de rouge pour une tâche non faite** (module 12 : « pas encore fait » = ambre + horloge).
- Prévoir une lecture **non chromatique de secours** (forme, position, picto) — daltonisme.

### 1.2 L'ARTÈRE + LA PLAQUE (langage transversal n°1 — LE HÉROS DU THÈME)
Une **coupe d'artère** : une paroi, une lumière (le passage du sang), et un **dépôt (plaque)** qui rétrécit la lumière. C'est l'objet central du thème (le rôle que « la courbe » tenait côté diabète).
- **Réversible dans les deux sens** : les facteurs au rouge **déposent / épaississent** la plaque ; repassés au vert, elle **se stabilise et régresse**. La réversibilité doit être **aussi visible que la menace** (message d'espoir non négociable — cf. ASTEROID/PARADIGM, jamais chiffré).
- **C'est le MÊME objet** qui naît au module **1** (mécanisme), reçoit les facteurs au module **2** (cumul), est nourri par le LDL au module **5**, et **voyage** sur la silhouette au module **3** (cou→AVC, cœur→infarctus, jambes→artériopathie, reins). → **une seule identité graphique d'artère/plaque, déclinée, jamais redessinée de zéro.**
- ⚠️ Modèle pédagogique, pas simulateur : elle dit « ça se bouche plus ou moins vite », jamais un pourcentage de sténose.

### 1.3 LA SILHOUETTE-CORPS (langage transversal n°2)
Une **carte du corps humain**, stylisée, sobre, digne (pas un mannequin médical anxiogène). Trois lectures superposées du **même dessin** :
- **Module 3** — les territoires comme **menace** (on ouvre un territoire → l'accident qui s'y produit).
- **Module 10** — les 2 territoires de l'**alerte** (cœur = infarctus, cerveau = AVC).
- **Module 11** — les territoires **défendus** (un traitement s'allume sur les zones qu'il protège, halo positif).
- Zones : **cœur · cerveau · jambes · reins**. États à prévoir : **actif/cliquable**, **« déjà vu »**, **allumé/protégé** (halo, module 11). → **même silhouette, jamais deux dessins concurrents.**

### 1.4 LE COCKPIT DE FEUX (motif des facteurs)
Un **tableau de feux** réglables vert/ambre/rouge, un par **facteur modifiable** : **tabac · tension · cholestérol · sucre · poids/tour de taille** (+ les non-modifiables — âge, sexe, hérédité — montrés **à part**, non réglables). Né au module 2, chaque feu **réapparaît** dans son module Agir dédié (4-9). **Jamais un score, jamais une note.**
- **Cœur pédagogique du thème** : le cumul est **multiplicatif, pas additif**. Deux feux rouges doivent encrasser l'artère **beaucoup plus vite** que la somme de deux — c'est ce que l'objet doit faire **voir**.

### 1.5 LA CARTE-RÉFLEXE VITE (seul objet NEUF — module 10)
Un objet **signalétique d'urgence** (pendant de la carte 15/15 de l'hypo côté diabète) : gros pictos, inratable, **se lit en état de panique**. Porte l'acronyme **VITE** (Visage / Incapacité d'un bras / Trouble de la parole / En urgence → 15) + le tableau douleur thoracique de l'infarctus. À dessiner comme un **panneau de sortie de secours**, pas comme une infographie.

### 1.6 LE CADRAN DE L'ANNÉE (module 12 — *à valider, cf. §2 M12*)
Le **cadran annuel** du suivi (identique à celui du diabète), avec ses stations et sa règle « aiguille = maintenant / couleur = à jour ». ⚠️ En prévention primaire le suivi est **léger** (réévaluation du risque tous les 3-5 ans) : le cadran risque de paraître vide — une **alternative allégée** est proposée dans la fiche M12.

### 1.7 Le fil rouge (message répété)
> **L'athérosclérose avance en silence — mais elle est réversible. Agir sur plusieurs leviers à la fois protège le cœur, le cerveau, les jambes et les reins.**

Motif visuel central : **la personne / les artères protégées**. Installé au module 1, refrain aux modules 2, 3, 12.

### 1.8 Deux catégories de fiche à emporter
- **Fiche-photographie** : capture ce que *ce* patient vient de manipuler (ses feux du 2, son assiette du 8, son calendrier du 12). Chaleureuse, personnelle.
- **Fiche-mémo de référence** : contenu **stable, identique pour tous** (carte VITE du 10, règle des 3 du 4). Plus « signalétique ».

### 1.9 Tonalité générale
Épuré, adulte, apaisé, contrasté. Beaucoup de blanc/espace. Typo généreuse. Une seule famille de pictos. Éviter : dégradés criards, 3D lourde, illustrations « stock santé » souriantes, imagerie clinique crue.

---

## 2. Fiches-modules

> Format : **Intention** · **Registre visuel** · **Écran & zones** · **Objet(s) & états** · **Les temps** · **2ᵉ niveau (survol)** · **Motifs communs** · **Fiche** · **Portes** · **⚠️ Pièges**.

---

### Module 1 — L'artère qui s'encrasse *(fondateur — pose le héros)*
**Intention.** Installer *une fois pour toutes* le modèle mental « artère → plaque silencieuse → rupture = accident, mais réversible » que tous les autres modules réutilisent.
**Registre visuel.** Fondateur, calme, quasi-schéma animé narré par le soignant (le patient ne manipule pas).
**Écran & zones.** Écran unique, **séquence linéaire en 4 temps** (bouton « suivant » discret). Scène centrée : une **coupe d'artère** (paroi + lumière + flux sanguin), avec une **frise du temps** (années/décennies) sur le côté.
**Objet & états.** L'artère/plaque héros : paroi lisse → dépôt de LDL → plaque qui grossit **sur des années, sans douleur** → chape qui se fissure → **caillot** → lumière bouchée = **accident**.
**Les 4 temps.**
1. **Artère saine** — paroi lisse, sang qui passe librement. *On installe le normal.*
2. **L'encrassement silencieux** — le dépôt s'installe sur la frise des années, **aucun symptôme**.
3. **La rupture** — la plaque se fissure → caillot → bouchon = infarctus/AVC.
4. **L'espoir** — en agissant, la plaque se **stabilise et régresse** ; on rouvre le passage. *Le message de réversibilité, non négociable.*
**2ᵉ niveau.** Léger (module fondateur) : « silencieux pendant des années » explicité sur la frise.
**Motifs communs.** **Naissance de L'ARTÈRE + LA PLAQUE** (héros du thème).
**Fiche.** Aucune.
**Portes.** **1→2** : « et qu'est-ce qui accélère ce bouchage ? » → Mon risque global.
**⚠️ Pièges.** Le **silence** (années sans symptôme) et la **réversibilité** sont les deux messages-clés — la fin espoir doit être aussi forte que la menace. Pas de « tuyau bouché = fatalité ». Pas d'artère gore.

---

### Module 2 — Mon risque global *(cockpit — valide les feux + le cumul)*
**Intention.** Les facteurs se **multiplient** (≠ s'additionnent) ; on peut agir sur plusieurs ; et **c'est réversible** (Rawshani/espoir). Poser la grammaire des feux.
**Registre visuel.** Tableau de bord cognitif, **non diagnostique** : on allume les feux « pour voir », jamais un score réel. Piloté soignant.
**Écran & zones.** Un **cockpit de feux** relié à **L'ARTÈRE** (héros du 1) : lisibles ensemble. Optionnel : un **cadran « âge vasculaire »** illustratif.
**Objets & états.**
1. **Tableau de feux modifiables** : **tabac · tension · cholestérol · sucre · poids/tour de taille**. Chacun se règle vert/ambre/rouge d'un clic. Cadrés « là où on peut agir », **pas un score**.
2. **L'artère réagit (cumul multiplicatif)** : 1 feu rouge = ça s'encrasse ; 2-3 feux rouges = ça s'encrasse **beaucoup plus vite** (l'objet doit rendre la **multiplication** visible, pas une addition). Repasser au vert = l'artère se dégage = **espoir**.
3. **Âge vasculaire (illustratif)** : à mesure que les feux passent au rouge, l'« âge des artères » grimpe au-dessus de l'âge réel (« 50 ans, artères de 65 »). **Non diagnostique.**
4. **Le robinet « sucre »** : un des feux ; le toucher ouvre une **porte vers le thème diabète** (« si vous êtes diabétique, tout un parcours vous est dédié »).
5. **Cadrage non-modifiable** (à part) : âge, sexe, hérédité — montrés hors des feux réglables, phrase déculpabilisante.
**Les temps.** ① on allume les feux de *ce* patient « pour voir » → ② l'artère montre le cumul → ③ on rééteint des feux → l'artère se dégage / l'âge vasculaire rajeunit.
**2ᵉ niveau.** Valeurs-seuil au survol (TA, LDL selon risque, tour de taille H/F).
**Motifs communs.** **Naissance du COCKPIT DE FEUX** (réapparaît aux 4-9) · réutilise **L'ARTÈRE** · préfigure les cadrans du 12.
**Fiche (photographie).** Ses feux + les leviers retenus (cochés selon besoin).
**Portes.** **2→** chaque module Agir (4-9) · **2→** thème diabète (robinet sucre) · **2→3**.
**⚠️ Pièges.** **JAMAIS un score chiffré / bulletin / note.** Multiplication ≠ addition (le cœur pédagogique). Non-modifiables mis à part = déculpabilisant. L'âge vasculaire reste **illustratif**, jamais « votre chiffre ».

---

### Module 3 — Où l'accident frappe
**Intention.** Un seul ennemi (la plaque), **plusieurs adresses** : cœur, cerveau, jambes, reins. Faire comprendre les territoires **sans jamais faire peur pour rien**.
**Registre visuel.** **Contemplatif** : calme, clair, aéré. On n'ouvre que ce qu'on veut.
**Écran & zones.** Objet unique : **LA SILHOUETTE-CARTE du corps**. La sélection de territoire fait personnalisation **et** dosage émotionnel.
**Objet & états des zones.**
- **Cœur** → infarctus · **Cerveau** → AVC · **Jambes** → artériopathie (douleur à la marche) · **Reins** → insuffisance rénale silencieuse.
- Ouvrir une zone : **la plaque s'y pose** (elle arrive du 1/2) → ① **ce que c'est** (menace sobre) → ② **même maladie partout, mêmes leviers** (unité) → ③ pour cœur/cerveau : **renvoi à Reconnaître l'alerte**.
**Les temps.** Choix libre d'un territoire (pas de défilé imposé).
**2ᵉ niveau.** Formes/fréquences ; « silencieux jusqu'à l'accident ».
**Motifs communs.** **LA SILHOUETTE** (1ᵉʳ passage) · **LA PLAQUE** arrive du 1/2.
**Fiche.** Aucune (ou optionnelle).
**Portes.** **3→10** (cœur/cerveau → alerte) · **3→2** (les leviers).
**⚠️ Pièges.** **Menace seule = proscrite** : « voilà ce qu'on protège », jamais « voilà ce qui vous attend ». Message d'**unité** (un seul ennemi, plusieurs adresses) plutôt qu'un catalogue anxiogène. Pas d'images cliniques crues.

---

### Module 4 — La tension
**Intention.** Le « tueur silencieux » rendu concret et **actionnable** : pas de symptôme, mais ça abîme les artères — et on peut le mesurer chez soi.
**Registre visuel.** Concret, dédramatisant, valorisant (l'automesure = prendre la main).
**Écran & zones.** Le **feu « tension »** (rappel du 2) + un **tuyau/artère sous pression** + le **coin automesure** (brassard + règle des 3).
**Objets & états.**
1. **Le tuyau sous pression** : trop de pression en permanence → paroi qui s'abîme (déclinaison de l'artère héros).
2. **L'automesure — la « règle des 3 »** : 3 mesures matin + 3 soir, 3 jours de suite — montrée comme un **geste**, pas un chiffre imposé.
3. **Les leviers** : sel, activité, poids, alcool → font baisser la pression (montré qualitativement).
**Les temps.** ① le silencieux (aucun symptôme) → ② ce que ça fait aux artères → ③ mesurer chez soi + les leviers.
**2ᵉ niveau.** Seuils au survol (AMT ≥ 135/85 ; consultation < 140/90 ; cible personnalisée).
**Motifs communs.** Grammaire feux · le tuyau = déclinaison de l'artère · leviers partagés avec 8/9.
**Fiche (référence/outil).** « Ma règle des 3 » + un **relevé d'automesure vierge** à remplir chez soi.
**Portes.** **4→2** · **4→8** (le sel) · **4→11** (traitements de la tension).
**⚠️ Pièges.** Pas de dramatisation « tueur ». L'automesure est **valorisante**, pas un examen anxiogène. **Aucune cible chiffrée imposée** à l'écran (survol seulement).

---

### Module 5 — Le cholestérol (LDL)
**Intention.** Le LDL est **ce qui nourrit la plaque** (lien direct au 1) ; « plus bas, plus longtemps, mieux c'est » ; **déculpabiliser** (ce n'est pas que l'assiette).
**Registre visuel.** Pédagogique, apaisé, anti-culpabilisant.
**Écran & zones.** Le **LDL qui alimente LA PLAQUE** du module 1 + un **curseur de niveau** + la distinction LDL/HDL.
**Objets & états.**
1. **Le LDL** = des particules qui se déposent dans la paroi → **font grossir la plaque** du 1.
2. **Curseur « niveau de LDL »** : plus bas → moins de dépôt ; **la durée compte** (bas longtemps = plaque qui régresse).
3. **LDL vs HDL** : l'un dépose, l'autre nettoie — simple, sans surcharger.
**Les temps.** ① d'où vient la plaque (le LDL) → ② plus bas + plus longtemps = moins de dépôt → ③ les leviers (alimentation → 8 ; statines → 11).
**2ᵉ niveau.** Cibles selon risque au survol (primaire : < 1,0 g/L ; < 0,7 si risque élevé).
**Motifs communs.** **LA PLAQUE** (nourrie) · lien direct au module 1.
**Fiche.** Aucune (intégrée au 2).
**Portes.** **5→8** (alimentation) · **5→11** (statines) · **5→1**.
**⚠️ Pièges.** **Ne pas moraliser l'alimentation** : le LDL est en grande partie hépatique/génétique → « ce n'est pas seulement ce que vous mangez ». Cibles jamais imposées à l'écran.

---

### Module 6 — Le tabac *(module léger — pont vers le thème Tabac)*
**Intention.** Le « pourquoi cardiovasculaire » du tabac (accélération de la plaque + thrombose aiguë) et sa **réversibilité rapide** — puis **orienter** vers le thème Tabac pour l'accompagnement complet.
**Registre visuel.** Bref, motivant. **Ne duplique pas** le thème Tabac.
**Écran & zones.** Le message CV + une **frise de réversibilité** (le risque qui redescend après l'arrêt).
**Objets & états.** Frise : risque coronaire **−½ dès la 1re année**, rejoint le non-fumeur en **~15 ans** (montré qualitativement, pente qui redescend).
**Les temps.** ① ce que le tabac fait aux artères (thrombose + accélération) → ② ce que l'arrêt répare (frise) → ③ **PONT** vers le thème Tabac.
**2ᵉ niveau.** « Même quelques cigarettes comptent » ; cinétique par jalons.
**Motifs communs.** Écho de la frise « bénéfices-arrêt » du thème Tabac, version CV.
**Fiche.** Aucune.
**Portes.** **6→ thème Tabac** (navigation inter-thèmes — ⚠️ *à vérifier techniquement*, cf. §Notes d'implémentation).
**⚠️ Pièges.** Rester **court** : le « comment arrêter » vit dans le thème Tabac. Ici = le « pourquoi CV » + l'aiguillage. Message = **arrêt** (pas de seuil « sûr »).

---

### Module 7 — Bouger
**Intention.** Bouger ≠ sport ; **ce qu'on fait déjà compte** ; un seul effort, plusieurs bénéfices ; le plus grand saut = de *rien* à *un peu*.
**Registre visuel.** Motivant, valorisant (jamais culpabilisant).
**Écran & zones.** ① **Le rayonnement** (motif central « activité » → rayons vers **tension · cholestérol · poids · sucre · stress · cœur direct**) → ② **la jauge ouverte** (activités du quotidien, tout compte, sans plafond).
**Objets & états.**
1. **Rayonnement** : un effort → plusieurs bénéfices (pendant du « plusieurs zones » du module 11).
2. **Jauge OUVERTE (sans plafond)** : marcher, vélo, ménage, jardinage, escaliers, porter les courses… qu'on coche → la jauge monte, **sans maximum** ; repère « 150 min » discret, jamais un couperet.
3. Marqueur discret « bon pour les muscles » sur certaines activités (sans catégorie séparée).
**Les temps.** ① rayonnement → ② jauge de volume → ③ (option) la dose-réponse (le plus grand bénéfice = sortir de la sédentarité).
**2ᵉ niveau.** Intensité au survol ; ordres de grandeur sourcés (jamais le −23/−40 % brut).
**Motifs communs.** Le « plusieurs rayons » préfigure « plusieurs zones défendues » du 11.
**Fiche.** Aucune.
**Portes.** **7↔2** · **7←9** (stress).
**⚠️ Pièges.** Jauge **sans plafond**, pas de barre « objectif atteint/échoué ». Sédentarité = message « bouger un peu >> rien ». Aucun chiffre d'étude à l'écran.

---

### Module 8 — Manger pour ses artères
**Intention.** L'**assiette méditerranéenne** comme soin des artères ; le **sel** et les **graisses** ; sans catalogue ni moralisation.
**Registre visuel.** Appétissant sans être un catalogue, tactile, culturellement ouvert.
**Écran & zones.** ① **L'assiette** (dépôt d'aliments) + ② **la salière** (curseur sel) + ③ les **bons/mauvais gras**.
**Objets & états.**
1. **L'assiette méditerranéenne** : glisser des aliments « amis des artères » (huile d'olive, poisson, légumes, légumineuses, noix, céréales complètes) vs « à limiter » ; **pastille de feu** par aliment.
2. **Le sel** : curseur/salière → **la pression monte** (lien direct au tuyau du module 4).
3. **Les gras** : saturés (déposent → LDL, lien 5) vs insaturés (favorables).
**Les temps.** ① l'assiette méditerranéenne (le modèle) → ② le sel & la tension → ③ (option) les bons vs mauvais gras.
**2ᵉ niveau.** Repères sel / gras saturés au survol.
**Motifs communs.** L'assiette (héros du module) · feu par aliment · liens 4 (sel) et 5 (gras/LDL).
**Fiche (photographie).** L'assiette cardio du patient + repères (sel, gras, méditerranéen).
**Portes.** **8→4** (sel) · **8→5** (gras/LDL).
**⚠️ Pièges.** **Diversité culturelle** (maghrébin, subsaharien, asiatique…) sans base de données. **Pas de moralisation**, pas de régime restrictif punitif. Jamais de chiffres imposés.

---

### Module 9 — Les autres leviers
**Intention.** Les leviers qu'on oublie : **alcool · sommeil/apnées · stress** — réels, sourcés, sans culpabiliser.
**Registre visuel.** Sobre, exploratoire (3 volets qu'on ouvre à la carte).
**Écran & zones.** **3 cartes/volets** côte à côte, choix libre.
**Objets & états.**
1. **Alcool** : curseur de verres → au-delà de **2-3/jour**, la tension et le risque montent ; message « **pas un médicament pour le cœur** » (courbe en J enterrée). Repères Santé Publique France (max 2/j, pas tous les jours, ≤ 10/sem).
2. **Sommeil / apnées** : **7-9 h** ; ronflements + pauses respiratoires = signal d'**apnées (SAOS)** → orienter vers un dépistage ; « le sommeil répare le cœur ».
3. **Stress** : le stress chronique agit **sur le corps** (tension, inflammation) — « pas que dans la tête » ; leviers = activité, relaxation, lien social.
**Les temps.** Un volet à la fois (contemplatif, non imposé).
**2ᵉ niveau.** Repères SPF alcool · durée de sommeil · signes de SAOS.
**Motifs communs.** Feux (alcool) · liens 4 (alcool→tension) et 7 (stress→activité).
**Fiche.** Aucune (ou volet imprimable optionnel).
**Portes.** **9→4** (alcool) · **9→7** (stress).
**⚠️ Pièges.** **Ne pas culpabiliser** (stress). Alcool : message clair « non cardioprotecteur » **sans** ton prohibitionniste. SAOS = **orienter vers un dépistage**, jamais diagnostiquer à l'écran.

---

### Module 10 — Reconnaître l'alerte *(le module de survie — objet NEUF)*
**Intention.** Installer le réflexe **reconnaître → appeler le 15 → ne pas attendre**. « Chaque minute compte » (time is brain/muscle).
**Registre visuel.** **Panneau de sortie de secours.** Ça se **voit**, ça ne se lit pas. Exécutable **sous stress**. Opposé des modules contemplatifs. Piloté soignant.
**Écran & zones.** Objet central : **LA CARTE-RÉFLEXE VITE** + un **volet infarctus**, reliés à la silhouette (cœur/cerveau).
**Objets & états.**
1. **AVC — VITE** : **V**isage paralysé (sourire) · **I**ncapacité à lever un bras · **T**rouble de la parole (répéter une phrase) · **E**n urgence → **15**. Grands pictos.
2. **Infarctus** : douleur thoracique oppressive **> 5 min**, irradiations (bras gauche, mâchoire, dos), sueurs/nausées ; **formes atypiques** mises en avant (**femmes, diabétiques, âgés** : douleur dorsale/abdominale, fatigue intense, nausées isolées).
3. **Le geste unique** : **APPELER LE 15** (ou 112) immédiatement ; **ne pas conduire soi-même** ; ne pas temporiser.
4. **« Chaque minute compte »** : la fenêtre de traitement (dé-bouchage) se referme vite.
**Les temps.** ① reconnaître (les 2 tableaux : cœur / cerveau) → ② le réflexe unique : **15** → ③ la carte à emporter.
**2ᵉ niveau.** Minimal (objet de crise).
**Motifs communs.** Réutilise **LA SILHOUETTE** (cœur/cerveau) · **CARTE-RÉFLEXE** = nouveau héros.
**Fiche (référence).** La carte **VITE** + signes d'infarctus + **15**. Universelle, gros, aimant frigo, se lit en tremblant.
**Portes.** **3→10** · accessible de partout.
**⚠️ Pièges.** Clarté sous stress > esthétique. **Formes atypiques** capitales (ne pas rater l'infarctus de la femme). Message unique = **appeler le 15**, ne pas conduire, ne pas attendre que « ça passe ». ⚠️ **Sécurité aspirine** : **ne PAS** faire de l'auto-prise d'aspirine un geste par défaut à l'écran (contre-indiquée si l'accident est un AVC hémorragique) — au plus « suivez les consignes du 15 ».

---

### Module 11 — Mes traitements qui protègent
**Intention.** Remplacer « mes cachets font baisser un chiffre » par « **mes traitements gardent mes artères** ». En primaire : **tension + cholestérol**.
**Registre visuel.** Explicatif, sobre, piloté soignant (contenu sensible). **Pas de fiche** (l'ordonnance officielle existe).
**Écran & zones (2 zones simultanées).**
- **Gauche — l'ordonnance** transcrite **ligne par ligne** (les lignes **réelles** du patient, **jamais un catalogue**).
- **Droite — LA SILHOUETTE-organes** (lecture « défendu » : halo positif).
- **Clic sur une ligne → les zones protégées s'allument.**
**Objets & états.**
- **Antihypertenseurs** (les 4 classes, sans les opposer) → allument tension → protègent **cœur/cerveau/reins** ; « le bénéfice vient surtout de la baisse de pression ».
- **Statines / ézétimibe** → stabilisent **la plaque partout** (« le médicament le plus étudié au monde »).
- **Anti-obsolescence** : la zone d'action est attachée à la **classe/rôle** (durable) ; la **molécule** = étiquette fine posée par le soignant.
- **Aspirine** : **pastille 2ᵉ niveau** seulement — « après un accident, c'est autre chose » (**pas en prévention primaire de routine**).
- **Craintes fréquentes** en 2ᵉ niveau : douleurs musculaires / foie (statines) → messages d'observance rassurants.
**Les temps.** Fusionne sélecteur (transcrire l'ordonnance) + séquence (allumer les zones). Se **clôt sur la silhouette protégée**.
**2ᵉ niveau.** « Quoi surveiller » + craintes/observance sur la ligne.
**Motifs communs.** **LA SILHOUETTE** (défendu) · geste « allumer le lien ».
**Fiche.** Aucune.
**Portes.** **11↔4** · **11↔5** · **11↔3**.
**⚠️ Pièges.** **Verrou anti-auto-prescription** : on transcrit et explique, on ne **compare ni ne choisit** aucune molécule. Corps **pur** (halo positif, aucune alerte dessus). **Aspirine en primaire** : ne pas la banaliser ni la suggérer.

---

### Module 12 — Mon suivi
**Intention.** Retourner le suivi en **tableau de bord** : automesure de tension, bilan lipidique, réévaluation du risque.
**Registre visuel.** Organisation, **pilotage** (patient aux commandes), jamais « révision des 15 000 km ». Calme et concret, mais **actif**.
**Écran & zones.** Objet : **LE CADRAN DE L'ANNÉE** (rond = année civile) — *ou son alternative allégée, cf. piège ci-dessous.*
**Stations / voyants (prévention primaire).** **Automesure tensionnelle** (régulière) · **bilan lipidique** · **consultation de réévaluation du risque** (3-5 ans) · **glycémie** (1-3 ans) · **fonction rénale** (si traité par IEC/ARA2).
**États d'une station.** **fait = vert coché** · **à programmer / à rattraper = ambre + horloge** · **examen espacé = grisé-présent, badgé « prochain : … »** (jamais évaporé).
**Deux règles gravées.** ① L'aiguille dit *maintenant*, la couleur dit *à jour / à rattraper* (statut lu sur l'intervalle recommandé, pas l'année civile) → **couverture**, jamais bilan accablant. ② **Jamais de rouge-panne** : « pas fait » = ambre + horloge (le rouge-santé reste aux modules 2/4/5).
**Les temps.** ① cadran pré-peuplé (la cadence recommandée) → ② régler + marquer fait/à programmer → ③ la fiche décroche.
**2ᵉ niveau.** Fréquences HAS/ESC au survol (⚠️ à revalider au câblage).
**Motifs communs.** Les feux mesurables (tension, cholestérol) reviennent en cadrans · centre = fil rouge.
**Fiche (photographie/outil).** Check-list « frigo » : une case à cocher par examen + un espace pour la vraie date.
**Portes.** **12↔** tout.
**⚠️ Pièges.** ⚠️ **Décision de conception à valider avec Thibault** : en prévention primaire le suivi est **léger** (réévaluation tous les 3-5 ans) — un cadran annuel peut paraître **vide**. **Alternative recommandée** : remplacer le cadran par un **« mes 3 chiffres à suivre »** (tension / LDL / tour de taille) façon carnet simple, plutôt que d'importer tel quel le cadran dense du diabète. Jamais de rouge. Jamais « on est en novembre et vous n'avez rien fait ».

---

## 3. Récapitulatif transversal (aide-mémoire designer)

**Objets partagés — même dessin à chaque réapparition :**
| Objet | Modules | Rôle |
|---|---|---|
| **L'ARTÈRE + LA PLAQUE** *(héros)* | 1 · 2 · 3 · 5 · (6) | mécanisme réversible / cumul / territoires / nourrie par le LDL |
| **LA SILHOUETTE** | 3 · 10 · 11 | territoires → alerte → défendus |
| **COCKPIT DE FEUX** | 2 · 4 · 5 · (9) | état des facteurs (jamais un score) |
| **CARTE-RÉFLEXE VITE** *(neuf)* | 10 | urgence signalétique |
| **CADRAN DE L'ANNÉE** *(à valider)* | 12 | suivi / couverture |
| **Fil rouge** (personne / artères protégées) | 1 · 2 · 3 · 12 | silencieux mais réversible |

**Registres émotionnels (à différencier visuellement) :**
- **Fondateur/schéma** : 1 · **Tableau de bord** : 2 · **Contemplatif** : 3 · **Concret/dédramatisant** : 4 · **Pédagogique** : 5 · **Motivant/pont** : 6 · **Motivation** : 7 · **Jeu/appétissant** : 8 · **Sobre/exploratoire** : 9 · **Urgence/signalétique** : 10 · **Explicatif/protection** : 11 · **Pilotage/organisation** : 12.

**Fiches à emporter :**
| Module | Fiche | Catégorie |
|---|---|---|
| 2 | ses feux + leviers | photographie |
| 4 | règle des 3 + relevé d'automesure | référence / outil |
| 8 | assiette cardio | photographie |
| 10 | carte VITE + 15 | référence |
| 12 | son calendrier / ses 3 chiffres | photographie / outil |
*(1, 3, 5, 6, 7, 9, 11 : sans fiche.)*

**Ordre de maquettage conseillé** (valide la mécanique vite) : **1 (L'artère)** pour poser le héros → **2 (Mon risque)** pour valider feux + cumul → **10 (Reconnaître l'alerte)** pour caler le seul objet neuf → puis les autres dans le moule validé.

---

## 4. Notes d'implémentation (pour le câblage, pas pour le designer)

- **Réutilisation de composants diabète** : `PlaqueArtere`, `Silhouette`, feux, `Courbe`… vivent sous `src/features/diabete/components/` (spécifiques thème). Le thème cardio aura son propre `src/features/cardio/components/` ; à décider au câblage si on **généralise** ces composants dans `src/components/` ou si on les **duplique/adapte**. Le moteur (`src/features/types.ts`, `registry.ts`) reste agnostique du thème.
- **Porte inter-thèmes (module 6 → Tabac, module 2 → Diabète)** : la navigation actuelle est intra-thème (`view: {type:'module', themeId, moduleId}`). Une porte vers un autre thème implique un saut `{type:'home', themeId:'tabac'}`. **À vérifier techniquement** avant de la promettre dans la maquette ; repli = un simple renvoi visuel « voir le thème Tabac ».
- **Zéro persistance** (consultation) : relevés d'automesure, feux, assiette = éphémères. Les fiches s'impriment à la volée.

---

## 5. Ce que la maquette doit produire

Pour chaque module, écran(s) montrant : les **zones** en place, l'**objet manipulable** et ses **états clés** (au moins : état initial, un état de manip, l'écran final), le **2ᵉ niveau au survol** (indiqué même s'il n'est pas actif), et — pour les modules concernés — la **fiche à emporter**. Exporter dans `design/maquettes/` du projet.
