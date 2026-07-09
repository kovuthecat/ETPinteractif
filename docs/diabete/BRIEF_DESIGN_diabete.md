# Brief Design — Outil ETP Diabète de type 2
## Document à transmettre à Claude Design (maquette écran par écran)

> **Ce document dit *à quoi ça ressemble*.** L'autorité pédagogique (le *pourquoi*) reste
> `SPEC_outil_ETP_diabete.md` — à lire en cas de doute sur une intention.
> Ici : zones d'écran, objets manipulables, états visuels, motifs partagés, pièges à éviter.
> Chaque fiche-module est autoportante : on peut la traiter isolément.

---

## 0. Ce qu'on dessine (contexte en 6 points)

1. **Support de consultation, pas e-learning.** L'écran est un grand moniteur de bureau, horizontal, **tourné vers le patient**, pendant que le soignant parle. Le texte à l'écran est **minimal** — tout passe par l'image. Ce n'est jamais un diaporama qu'on lit.
2. **Public double, sans jamais infantiliser.** Patients à faible littératie / allophones **et** patients CSP+. L'image doit parler seule au premier ; une **2ᵉ couche de donnée au survol** (hover souris) nourrit le second sans jamais s'imposer. La sobriété haut de gamme est l'anti-infantilisation — **jamais de gros smileys, de ton scolaire, de bulles enfantines.**
3. **Rythme en 3 temps partout** : ① **Sélecteur** (on choisit visuellement ce qui concerne *ce* patient) → ② **Séquence** (courte manip sur la sélection) → ③ **Image à emporter** (écran final, parfois imprimable en fiche). Sur desktop large, sélecteur et séquence **coexistent souvent à l'écran** (pas des étapes qui se cachent).
4. **Zéro donnée stockée.** Rien ne persiste ; les fiches sont générées à la volée puis imprimées. Aucune conséquence visuelle sauf : ne jamais dessiner de « compte », « historique », « profil enregistré ».
5. **Cibles cliquables larges** (poste tactile possible à terme), lisibilité à **~1 m**.
6. **Langue : français.** Peu de mots, gros, très lisibles.

---

## 1. Système visuel commun (à fixer AVANT les modules)

Ces éléments reviennent d'un module à l'autre. Ils doivent être **le même objet graphique** à chaque réapparition — c'est ce qui fait tenir l'outil comme un tout, pas comme 9 écrans sans lien.

### 1.1 La grammaire des couleurs — feux tricolores
Vert / orange (ambre) / rouge = **le langage de base** de tout l'outil (état d'un levier, charge d'un aliment, zone d'une bande-cible).
- **Vert** = favorable / fait / dans la cible.
- **Ambre** = intermédiaire / à surveiller / à programmer.
- **Rouge** = défavorable / à risque — **mais réservé à l'ÉTAT DE SANTÉ** (module 4, charge glycémique). **Jamais de rouge pour une tâche non faite** (module 6 : « pas encore fait » = ambre + horloge, jamais rouge-panne).
- Prévoir une lecture **non chromatique de secours** (forme, position, picto) — daltonisme.

### 1.2 LA COURBE (langage transversal n°1)
Une **courbe de glycémie post-repas** : axe horizontal = temps, axe vertical = niveau de sucre dans le sang. Une bosse qui monte puis redescend.
- **Schématique par défaut** : forme + hauteur relative, **pas de chiffres** à l'écran. Valeurs mg/dL **au survol seulement**.
- Trois leviers visuels de variation : **hauteur du pic**, **moment du pic**, **douceur de la descente**.
- **C'est le MÊME objet** aux modules **2** (ce qu'un aliment fait au pic), **3** (ce que le mouvement fait au pic), **8** (courbe de récupération après resucrage), **9** (la trace du capteur FreeStyle Libre). Le patient doit reconnaître « sa courbe » à chaque fois. → **une seule identité graphique de courbe, déclinée, jamais redessinée de zéro.**
- ⚠️ Modèle pédagogique, pas simulateur : elle dit « ça monte moins et plus doucement », jamais « +37 vs +52 mg/dL ».

### 1.3 LA SILHOUETTE-CORPS (langage transversal n°2)
Une **carte du corps humain**, stylisée, sobre, digne (pas un mannequin médical anxiogène). Elle sert à 3 modules avec 3 lectures superposées du **même dessin** :
- **Module 5** — les organes comme **menace** (on ouvre un organe → ce qu'il risque + l'échappatoire).
- **Module 6** — via une porte optionnelle, l'organe **surveillé** (révélation « ce que ça garde »).
- **Module 7** — les organes **défendus** (un traitement s'allume sur les zones qu'il protège).
- États d'une zone à prévoir : **actif/cliquable**, **grisé dur « déjà vu au module 4 »** (cœur/cerveau), **allumé/protégé** (halo positif, module 7). → **même silhouette, jamais deux dessins concurrents.**

### 1.4 LA PLAQUE D'ATHÉROME (motif-fil du module 4→5)
Un **même petit objet visuel** (dépôt qui rétrécit la lumière d'un vaisseau) qui **voyage** : il naît dans l'artère générique abstraite (module 4, mécanisme) puis se pose sur la silhouette (conséquence : cou→AVC, cœur→infarctus, jambes→artériopathie ; puis micro au module 5). Il **comble le trou** entre « vos artères s'encrassent » et « AVC ». → **un seul motif identifiable, pas deux illustrations distinctes.**

### 1.5 LA SIGNATURE « ÉVITABLE » (module 5, identité constante)
Un **même petit motif « bonne nouvelle »** qui réapparaît systématiquement au 2ᵉ temps de chaque complication (« mais c'est évitable et dépistable »). Objectif : créer un réflexe de l'œil — à chaque menace, il cherche et **trouve** l'échappatoire. À dessiner comme un élément d'identité récurrent (pas un simple ✓ générique).

### 1.6 Le fil rouge (message répété)
> **Le diabète est une maladie des vaisseaux, pas seulement du sucre — agir sur tout ensemble protège.**

Motif visuel central : **la personne / les vaisseaux protégés**. Installé au module 1, refrain aux modules 4, 5, 6. C'est aussi le **centre du cadran** (module 6) et le cœur de la silhouette.

### 1.7 Deux catégories de fiche à emporter
- **Fiche-photographie** : capture ce que *ce* patient vient de manipuler (assiette du module 2, feux du 4, calendrier du 6). Chaleureuse, personnelle.
- **Fiche-mémo de référence** : contenu **stable, identique pour tous**, aide-mémoire d'un geste universel (pied module 5, carte 15/15 module 8). Plus « signalétique ».

### 1.8 Tonalité générale
Épuré, adulte, apaisé, contrasté. Beaucoup de blanc/espace. Typo généreuse. Iconographie cohérente (une seule famille de pictos). Éviter : dégradés criards, 3D lourde, illustrations « stock santé » souriantes.

---

## 2. Fiches-modules

> Format de chaque fiche : **Intention** (1 phrase) · **Registre visuel** · **Écran & zones** · **Objet(s) & états** · **Les temps** · **2ᵉ niveau (survol)** · **Motifs communs mobilisés** · **Fiche à emporter** · **Portes (ponts)** · **⚠️ Pièges à éviter**.

---

### Module 1 — C'est quoi le diabète ?
**Intention.** Installer *une fois pour toutes* le modèle mental clé/serrure que tous les autres modules réutilisent.
**Registre visuel.** Fondateur, calme, quasi-schéma animé. Narré par le soignant (le patient ne manipule pas).
**Écran & zones.** Écran unique, **séquence linéaire en 4 temps** que le soignant fait avancer (un bouton « suivant » discret). Scène centrée : le **sang** (un flux/canal), des **cellules** (portes avec serrures), des **clés** = insuline, du **sucre** = petits jetons.
**Objet & états.**
- **Clé** (insuline) qui ouvre / n'ouvre pas la **serrure** de la cellule.
- Deux pannes, montrées séparément puis réunies : **pas assez de clés** (insulinopénie) · **serrure rouillée** (insulinorésistance).
- **État « hyperglycémie »** : du sucre qui **reste dans le sang** — c'est l'image de convergence.
**Les 4 temps.**
1. **Sujet sain** — sucre arrive → clés ouvrent → sucre entre → le sang se vide (glycémie redescend). *On installe le normal.*
2. **Pas assez de clés** — pancréas fatigué → sucre reste.
3. **Serrure rouillée** — clés présentes mais entrent mal → sucre reste **aussi**.
4. **Conclusion** — souvent un peu des deux + message déculpabilisant : *« bien manger et bouger aident la clé et soulagent le pancréas. »*
**2ᵉ niveau.** Léger, quasi nul ici (module fondateur).
**Motifs communs.** Pose l'esthétique clé/serrure réutilisée au module 9 (couplage segment↔insuline).
**Fiche.** Aucune.
**Portes.** **1→2** : le dernier écran (« bien manger aide la clé ») ouvre vers Alimentation.
**⚠️ Pièges.** Le **cœur pédagogique** = temps 2 et 3 ont des mécanismes **différents** mais **la même conséquence** → les deux pannes doivent **converger visuellement vers la même image de sucre qui stagne**. Ne pas culpabiliser (« trop de sucre mangé »). Pas de pancréas gore.

---

### Module 2 — Alimentation *(module pilote — valide tout le triptyque)*
**Intention.** Montrer, de façon manipulable, ce qui fait varier la glycémie après un repas.
**Registre visuel.** Terrain de jeu, tactile, appétissant sans être un catalogue. Manipulé par soignant **ou** patient.
**Écran & zones (desktop large, 3 zones simultanées).**
- **Gauche — le garde-manger** : étagères par **famille** (onglets), grandes vignettes d'aliments qu'on **glisse** vers l'assiette. Chaque vignette porte une **pastille de charge glycémique** 🟢/🟠/🔴.
- **Haut-droite — l'assiette** : zone de dépôt (cercle). En défi 4, chaque aliment occupe une **part ajustable** du cercle (parts de camembert).
- **Bas-droite — LA COURBE** : réactive en direct à chaque geste.
- **Barre de défis** en haut : cadre la narration et l'avancement (1·Composition → 2·Qualité → 3·Ordre → 4·Proportion → ★Repas complet).
**Objet & états.** Assiette = comparateur **et** composition fondus (pas d'écran de quiz séparé). Chaque défi isole **une seule variable**.
**Les temps (4 défis + synthèse).**
1. **Composition** — féculent seul = grand pic ; ajout protéines/lipides/fibres = le pic **s'aplatit à chaque ajout**, à féculent constant.
2. **Qualité** — le **« devine → révèle »** (uniquement ici) : deux aliments d'une même famille (baguette vs pain complet), le soignant/patient **prédit** (bas/moyen/haut) **avant** que les deux courbes se dessinent.
3. **Ordre** — même assiette, on **glisse l'ordre** : féculent en dernier → pic réduit (le −42 mg/dL rendu visible).
4. **Proportion** — on ajuste les **parts** du cercle → fait apparaître l'**assiette-modèle ½ légumes / ¼ protéines / ¼ féculents**.
- **★ Repas complet** — on compose un vrai repas (les 4 principes combinés), comparé à une version « naïve ». **Cet écran DEVIENT la fiche.**
**2ᵉ niveau.** Valeurs mg/dL de la courbe au survol ; charge glycémique exacte de l'aliment au survol.
**Motifs communs.** Première apparition de **LA COURBE**. Les **légumineuses** à double-classer visuellement (féculent 🟢 riche en fibres).
**Fiche (photographie).** L'assiette optimisée du patient + les 4 principes en pictogrammes.
**Portes.** **2↔3** (bidirectionnel) : depuis l'assiette, porte « et si on bougeait après ce repas ? » → timing du module 3. La **courbe est partagée**.
**⚠️ Pièges.** Afficher la **charge** (CG), pas l'index (IG) — règle le piège pastèque (« la pastèque, ça va »). Diversité culturelle des aliments (maghrébin, subsaharien, indo-pakistanais, chinois) **sans** en faire une base de données. Jamais de chiffres imposés sur la courbe.

---

### Module 4 — Risque cardiovasculaire *(cœur émotionnel — 2ᵉ module construit)*
**Intention.** Le diabète = maladie des vaisseaux ; les facteurs se **cumulent** ; et **c'est réversible** (message d'espoir). Porte le refrain Steno-2 / Rawshani.
**Registre visuel.** Émotionnel mais **jamais sidérant** : la réversibilité est aussi visible que la menace. Piloté soignant. **Non diagnostique** — on manipule des feux « pour voir », aucune donnée réelle.
**Écran & zones.** Une **chaîne causale** en 3 objets liés (pas juxtaposés), lisibles ensemble ou en séquence : **① les feux** (état) → **② l'artère** (mécanisme) → **③ l'anatomie** (conséquence).
**Objets & états.**
1. **Tableau de 5 feux** : **sucre · tension · cholestérol · tabac · sédentarité**. Chacun se règle vert/orange/rouge d'un clic. Cadrés « là où on peut agir ensemble », **pas un score**.
2. **L'artère (un seul objet réversible)** : chaque feu passé au **rouge** dépose une **plaque** / encrasse la lumière ; repassé au **vert**, elle **se dégage**. On tourne dans les **deux sens** — sens rouge = le **cumul** ; sens vert = **Rawshani** (on rouvre, le risque redevient presque normal) = **le message d'espoir, non négociable**.
3. **Modèle anatomique** (silhouette) : on **place les plaques** → **cou** = AVC · **cœur** = infarctus · **jambes** = artériopathie.
4. **Cadrage non-modifiable** (dernier écran, une phrase, non manipulable) : âge/ancienneté/hérédité hors des feux, phrase déculpabilisante.
**2ᵉ niveau.** Valeurs-seuil au survol (HbA1c < 7 %, TA < 130/80, LDL selon risque…).
**Motifs communs.** Naissance de **LA PLAQUE D'ATHÉROME** (qui voyagera au 5). Les **3 feux mesurables** (HbA1c·tension·cholestérol) reparaîtront comme **cadrans** au module 6. Grammaire feux réutilisée partout.
**Fiche (photographie).** Le schéma global + les leviers d'action retenus (cochés selon besoin).
**Portes.** **4→5** (« et il y a aussi les petits vaisseaux… ») · **4→6** (« ces feux, voici quand on les rallume pour vérifier »).
**⚠️ Pièges.** L'**aller-retour rouge↔vert sur un seul objet** est le cœur — ne pas en faire deux artères séparées. Ne pas transformer les 5 feux en bulletin/note. Le rouge vit **ici** (santé), pas au module 6.

---

### Module 3 — Activité physique
**Intention.** Bouger ≠ forcément sport ; **ce qu'on fait déjà compte** ; et *quand* bouger pour écrêter le pic.
**Registre visuel.** Motivant, valorisant (« surprise valorisante », jamais culpabilisant). Piloté les deux. **Pas de fiche.**
**Écran & zones.** 3 temps avec **bascule d'entrée par le rayon « sucre »**.
**Objets & états.**
1. **Le rayonnement** *(en premier, motivationnel)* : un motif central « activité » d'où **partent des rayons** vers **sucre** · **cœur & vaisseaux** · **tête** (moral/sommeil/stress) · **autonomie** (force/équilibre/chutes). Message : *un seul effort, plusieurs bénéfices.* **Cliquer le rayon « sucre »** fait basculer vers les temps 2 et 3.
2. **Le volume — jauge OUVERTE (sans plafond)** : collection d'**activités du quotidien** reconnaissables (marcher, vélo, ménage, bricolage, jardinage, porter les courses…) qu'on coche → la jauge monte, **sans maximum**. Comptage **tout-en-minutes** (tout compte pareil). Certaines activités portent un **marqueur discret « bon pour les muscles »** (se lever d'une chaise, escaliers, porter les courses) — **sans catégorie séparée ni comptage à part**.
3. **Le timing — LA COURBE réutilisée** : la courbe post-repas du module 2 + un **curseur d'activité déplaçable sur l'axe du temps** → l'écrêtage du pic varie selon *où* on place le mouvement. Deux régimes : **marche post-repas** (d'autant plus efficace qu'elle est proche du repas) · **micro-coupures** (2–3 min toutes les 30 min).
**2ᵉ niveau.** Intensité au survol ; ordres de grandeur sourcés (santé mentale : « effet comparable à d'autres approches non médicamenteuses », **jamais le chiffre brut**).
**Motifs communs.** Réutilise **LA COURBE** (temps 3). Le « plusieurs rayons » préfigure la « plusieurs zones s'allument » du module 7.
**Fiche.** Aucune.
**Portes.** **2↔3** (courbe partagée).
**⚠️ Pièges.** Jauge **sans plafond** — surtout pas de barre « objectif atteint / échoué ». Le renforcement musculaire est **montré mais fondu** dans les minutes, pas une catégorie intimidante. Aucun SMD/HR brut à l'écran.

---

### Module 5 — Complications
**Intention.** Faire comprendre ce que le diabète peut abîmer **sans jamais faire peur pour rien** — la peur sidère, l'antidote est « évitable / dépistable ».
**Registre visuel.** **Contemplatif** : calme, clair, aéré, peu d'interactivité. Le calme est une **fonctionnalité**. On n'ouvre que ce qu'on veut, on referme quand c'est assez.
**Écran & zones.** Objet unique : **LA SILHOUETTE-CARTE du corps**. La sélection d'organe fait à la fois personnalisation **et** dosage émotionnel (pas de défilé anxiogène imposé).
**Objet & états des zones.**
- **Cœur + cerveau** : visibles mais **grisés durs, non cliquables** (déjà vus au module 4) → macro et micro = deux profondeurs d'une même maladie. Prévoir un **état « déjà exploré »** distinct de l'actif.
- **Yeux, reins, nerfs** : branches **micro cliquables**, triptyque simple.
- **Pied** : branche **renforcée** (voir plus bas).
**Structure imposée (chaque organe, 3 temps indissociables).**
1. **Ce que c'est** (menace, sobre, jamais brandie) →
2. **Mais c'est évitable et dépistable** ← ici apparaît **LA SIGNATURE « ÉVITABLE »** (motif constant) →
3. **Le geste ou le suivi concret.**
**Branche renforcée — le pied.** Seul organe où le patient est **acteur direct**. Ajoute : **auto-examen quotidien** (dessus, dessous au miroir, entre les orteils), bon chaussage, jamais pieds nus, conduite si plaie. **Illustration statique** des points de contrôle (pas de séquence). Levier émotionnel : programmes éducatifs → **−2/3 amputations** (« la plus grave *et* la plus évitable par vos propres gestes »).
**2ᵉ niveau.** DCCT/UKPDS (−25 à −76 % de complications micro), effet mémoire, fréquences de dépistage (renvoi au 6).
**Motifs communs.** **LA SILHOUETTE** (1ᵉʳ passage) · **LA PLAQUE** arrive du 4 · **SIGNATURE ÉVITABLE**.
**Fiche.** **Pied uniquement** (référence) : points de contrôle de l'auto-examen + conduite si plaie.
**Portes.** **4→5** (entrant) · **5↔6** (« cet examen, on le programme quand ? » → cadran ; retour = révélation).
**⚠️ Pièges.** **Menace seule = proscrite.** Le module dit « voilà ce qu'on surveille pour que ça n'arrive pas », jamais « voilà ce qui vous attend ». Pas de gamification, pas d'images cliniques crues. Calme = maîtrisé et posé.

---

### Module 6 — Suivi *(clôture de l'arc — ROI « frigo » maximal)*
**Intention.** Retourner le suivi (corvée de rendez-vous) en **tableau de bord de son année de soins**. Seul module d'**application** (situation réelle du patient), pas de démonstration.
**Registre visuel.** Organisation, **pilotage** (patient aux commandes, valorisant) — **jamais « garage / révision des 15 000 km »**. Calme et concret comme le 5, mais **actif** : on fait le tour, on règle, on marque.
**Écran & zones.** Objet unique : **LE CADRAN DE L'ANNÉE** (rond = année civile janv→déc, à la fois compteur et cycle).
**Anatomie du cadran.**
- **Centre** : le motif fil-rouge (la personne / les vaisseaux protégés).
- **4 stations « consultation » aux points cardinaux** : les consultations trimestrielles (le pouls). **Composites** : chacune *contient* poids, tension, tolérance du traitement, coup d'œil aux pieds (ces vitales ne flottent pas — elles vivent dans la consultation).
- **Couronne annuelle (les voyants)** : examens 1×/an posés sur leur mois — **fond d'œil, rein, pied complet, bilan lipidique, dentiste, vaccins**.
- **HbA1c** : non un point, mais un **surlignage** posé sur les consultations où elle est due.
- **L'AIGUILLE = maintenant** : pointe le mois courant, oriente **vers l'avant** (devant = à venir/à planifier ; derrière non coché = à rattraper).
**États d'une station.** **fait = vert coché** · **à programmer / à rattraper = ambre + horloge** · **examen bisannuel = grisé-présent, badgé « 2 ans — prochain : 2027 »** (jamais évaporé).
**Deux règles gravées (à respecter absolument).**
- **① L'aiguille dit *maintenant*, la couleur dit *à jour / à rattraper*** : le statut se lit sur l'**intervalle recommandé**, PAS sur l'année civile. Un fond d'œil fait en décembre reste vert même si l'aiguille a dépassé son secteur. → le cadran affiche une **couverture**, jamais un bilan accablant. Utilisable **à n'importe quel mois** sans honte.
- **② Jamais de rouge-panne** : « pas fait » = ambre + horloge. Le rouge (résultat de santé) reste au module 4. Ici on ne parle que de **tâches**.
**Fréquence = densité de points.** Régler une fréquence = **ajouter/retirer des marques** autour du cercle (HbA1c « tous les 3 mois » = 4 repères ; « tous les 6 mois » = 2). **La densité est le message.** Réglage par **crans/préréglages fermés** (pas un curseur libre) ; le **rythme standard est pré-posé** puis ajusté.
**Les 3 temps.**
1. **Cadran pré-peuplé** (on comprend la cadence recommandée au premier regard).
2. **Le parcours** : régler les fréquences + marquer chaque station fait/à programmer. Valoriser d'abord le **déjà-fait**. **Porte optionnelle « ce que ça garde »** : toucher une station la marque ; une porte la **retourne** et révèle l'organe surveillé (rappel du module 5) — jamais imposée.
3. **La fiche décroche** (voir ci-dessous).
**La fiche (photographie, mais outil logistique).** **Décroche du cadran en check-list** (une roue se lit mal comme to-do), mais partage son **ADN visuel**. Doit être **utilisable pour de vrai** : mois lisibles, **une case à cocher par examen**, **un espace pour écrire la vraie date** du RDV, distinction ✓fait / ⏳à programmer, échéances > 12 mois incluses. Tient sur une page, se colle au frigo.
**2ᵉ niveau.** Fréquences ADA/HAS-SFD au survol (⚠️ à revalider au câblage).
**Motifs communs.** Les **3 feux mesurables du module 4** reviennent en cadrans (état→vérification). Centre = fil rouge. Pont vers **silhouette du 5** via révélation.
**Portes.** **5↔6** · **4→6** · **6→7** (surveillances liées aux médicaments).
**⚠️ Pièges.** Deux artefacts **distincts** obligatoires (cadran enseigne / fiche organise) avec ADN commun. Jamais de rouge. Jamais « on est en novembre et vous n'avez rien fait ».

---

### Module 7 — Traitements
**Intention.** Remplacer « mes cachets font baisser le sucre » par « **certains de mes traitements gardent mes vaisseaux** ». Message-phare : la **double protection cœur-rein**, **montrée pas dite**.
**Registre visuel.** Explicatif, sobre, piloté soignant (contenu sensible). **Pas de fiche** (le patient a déjà son ordonnance papier officielle).
**Écran & zones (2 zones simultanées).**
- **Gauche — l'ordonnance** qu'on **transcrit ligne par ligne** (les lignes **réelles** du patient, **jamais un catalogue** de molécules).
- **Droite — LA SILHOUETTE-organes** (3ᵉ passage : menace→surveillé→**défendu**).
- **Clic sur une ligne → la/les zones où ce traitement agit s'allument** sur la silhouette.
**Objet & états.**
- Une gliflozine / un AR GLP-1 **allume plusieurs zones** (sucre + cœur + rein) ; un « sucre seul » n'en allume qu'une → **le patient VOIT** qu'un seul traitement défend plusieurs fronts (pendant du « plusieurs rayons » du module 3).
- **Silhouette = protection, gardée pure** : **aucune alerte ni clignotement sur le corps** — elle ne montre que le **bien** que fait le traitement (halo positif).
- **Ordonnance = usage** : le **quand** en pictogramme sur la ligne (quotidien/hebdo/aux repas) ; le **quoi surveiller** en **pastille 2ᵉ niveau sur la ligne** (peut faire l'hypo ? rein à contrôler ?), **jamais sur le corps**.
- **Anti-obsolescence** : la **zone d'action** est attachée à la **classe/rôle** (durable) ; la **molécule** = **étiquette fine** posée par le soignant (volatile). Un nouveau médicament = une étiquette à ajouter, rien à redessiner.
**Les 3 temps.** Fusionne sélecteur (construire l'ordonnance) + séquence (allumer les zones). **Pas de temps ③ fiche** → se **clôt sur la silhouette pleinement allumée** = la carte de protection du patient.
**2ᵉ niveau.** Pastille « quoi surveiller » sur la ligne.
**Motifs communs.** **LA SILHOUETTE** (3ᵉ passage) · geste « allumer le lien » réutilisé au module 9.
**Portes.** **7↔5** · **6↔7** · **7→8** (pastille « peut faire l'hypo ») · **7→9** (ligne d'insuline).
**⚠️ Pièges.** **Verrou anti-auto-prescription** : on transcrit et explique, on ne **compare ni ne choisit** aucune option. **Vigilance double protection** : informer que certains protègent cœur-rein **sans faire sentir** au patient qui n'est pas sous ces classes que son traitement serait « au rabais ». Corps **pur** (aucune alerte dessus).

---

### Module 8 — Hypoglycémie *(le plus singulier — rappelé EN CRISE)*
**Intention.** Installer le réflexe **reconnaître tôt · doser (15 g) · attendre** — arrêter une hypo sans sur-réagir (« vider le frigo »).
**Registre visuel.** **Panneau de sortie de secours.** Ça se **voit**, ça ne se lit pas. Exécutable **sous stress** (cerveau privé de sucre : tremblements, confusion). **Opposé** des modules contemplatifs. Piloté soignant.
**Écran & zones.** Objet central : **la carte-réflexe 15/15** — une **boucle inratable** : signes → 15 g → **attendre ~15 min** → recontrôle → répéter ou récupérer.
**Objets & états.**
- **LA COURBE de récupération** (4ᵉ réutilisation) : après 15 g la glycémie remonte en ~15 min ; si on panique et qu'on remange, elle **dépasse** (overshoot en hyper). On **montre pourquoi on attend** — le sucre n'a pas encore agi.
- **Le temps fort = l'attente** (contre l'envie de continuer) — même retenue que le module 9.
**Les 3 temps.**
1. **Sélecteur — mon profil hypo** : le patient identifie **ses signes précoces** (tremblement, sueurs, palpitations, faim, irritabilité…) et **son resucrage** réel qu'il aura sur lui (jus, sucres, comprimés de glucose).
2. **Séquence — le réflexe 15/15** : signes → 15 g → attente 15 min (avec la courbe récupération/overshoot) → recontrôle → répéter ou collation de sucres lents si prochain repas loin.
3. **La carte-réflexe (fiche)** : gros, simple, la boucle 15/15 comme une **signalétique**, le **dessus personnalisé** (mes signes, mon remède). **Se lit en tremblant.**
**2ᵉ niveau.** Minimal (objet de crise, on n'encombre pas).
**Motifs communs.** **LA COURBE** (récupération) · retenue « attendre » partagée avec le 9.
**Fiche (référence + photographie).** Structure universelle des 15 (référence) + dessus perso (photographie). **Patient-only, ultra-simple.**
**Portes.** **7→8** · **9→8** · **8↔9** (perte des signes d'alerte → le capteur alarme).
**⚠️ Pièges.** **Hypo sévère / entourage / glucagon = HORS carte** (traité par la parole du soignant) — ne pas encombrer l'objet de crise. Piège du **chocolat/gras** (remonte trop lentement) à écarter visuellement. Clarté sous stress prime sur l'esthétique.

---

### Module 9 — Insuline (adaptation des doses) *(le plus délicat — sécurité = colonne vertébrale)*
**Intention.** Rendre le patient déjà sous insuline **autonome et sûr** dans la lecture de sa **courbe de capteur** et l'ajustement de sa dose — voir une **tendance**, pas un chiffre isolé.
**Registre visuel.** Sécurité d'abord, structurante (pas une note de bas de page). Piloté soignant ; **jamais en libre-service** (le verrou est clinique → l'outil peut être pleinement explicite).
**Écran & zones.** Objet primaire : **LA COURBE du capteur (FreeStyle Libre)** = la même courbe que les modules 2/3, avec **flèche de tendance** et **bandes de couleur**. (Repli pour les rares sans capteur : grille jours × moments, l'à-jeun = un point marqué sur la trace.)
**Résolution « chiffres ».** **On n'enseigne AUCUN nombre.** Le pas d'ajustement = **un geste / une flèche** (« un petit cran »), jamais « +2 UI ». La cible = **une BANDE** (position + couleur), pas un seuil. **Seuls nombres = ceux de la trace du patient**, lus visuellement (forme, couleur).
**Objets & états.**
- **Couplage** — chaque **segment** de courbe parle à une insuline : **segment nuit / à jeun ↔ la lente** (couplage unique et propre, cas majoritaire) ; **bosses post-repas ↔ le bolus**. Clic sur un segment → l'insuline s'allume (réutilise le geste du module 7, l'esprit clé/serrure du 1).
- **Tendance** — la **flèche** + **plusieurs jours superposés** : la pente se voit d'un bloc, sans calcul.
- **« Temps dans la cible »** — barre colorée empilée (part de vert / haut / bas) : indicateur unique positif (écho de la « couverture » du module 6).
- **Zone-cible posée par le soignant (temps ①)** : il **règle la bande verte** — basse et serrée (sujet jeune) / **plus haute** (âgé/fragile : « on vise plus doux, éviter l'hypo prime »). Geste de sécurité **visible**.
**La séquence (temps ②) — 3 cas à parts égales (cœur du module).**
1. **Ça penche haut** (dérive sur plusieurs nuits) → **un cran de plus** sur la lente → **et surtout on attend ~3 jours sans retoucher**. **La cadence est le temps fort.**
2. **Une seule mauvaise nuit** (bruit, pas tendance) → **on ne bouge pas.**
3. **La trace plonge dans le bas** → **un cran de moins**, et **l'hypo prime** (→ resucrage, module 8).
- **Hypo nocturne invisible** : le capteur révèle les chutes de 3 h que le patient ne sent pas → justifie de titrer la lente **avec prudence**.
**Basal / bolus.** **Basal = pleinement traité** (titration de la lente sur le segment nuit, sûr, couplage clair). **Bolus/correction = seulement schémas basal-bolus**, plus loin et **plus encadré** (jamais au même niveau que la partie sûre).
**2ᵉ niveau.** La trace du patient elle-même (jamais commentée au chiffre près).
**Motifs communs.** **LA COURBE** (trace = courbe des 2/3) · bandes = grammaire feux du 4 · geste « allumer le lien » du 7 · retenue « attendre » du 8.
**Fiche.** Aucune (option future : référence stable « lire sa courbe + règle des 15 », **sans aucune dose**).
**Portes.** **7→9** · **9→8** · **9↔2/3** (même courbe) · **8↔9**.
**⚠️ Pièges.** **Aucun nombre générique** à l'écran. Ne pas enseigner « voir haut → ajouter » (réflexe dangereux) mais à **discriminer** tendance vs bruit. Refrain de sécurité : **« dans le doute, on ne monte pas — et on traite l'hypo d'abord. »** Ancre : **« votre protocole = votre ordonnance. »**

---

## 3. Récapitulatif transversal (aide-mémoire designer)

**Objets partagés — même dessin à chaque réapparition :**
| Objet | Modules | Rôle |
|---|---|---|
| **LA COURBE** (glycémie) | 2 · 3 · 8 · 9 | aliment / mouvement / récupération / trace capteur |
| **LA SILHOUETTE** | 5 · 6(porte) · 7 | menace → surveillé → défendu |
| **LA PLAQUE d'athérome** | 4 → 5 | comble « artère encrassée » → organe |
| **Grammaire feux** vert/ambre/rouge | 4 · 6 · 9 · 2(pastilles) | état / tâche / bande-cible / charge |
| **Signature « évitable »** | 5 | réflexe « je cherche l'échappatoire » |
| **Fil rouge** (personne/vaisseaux) | 1 · 4 · 5 · 6(centre) | maladie des vaisseaux, agir protège |

**Registres émotionnels (à différencier visuellement) :**
- **Fondateur/schéma** : 1 · **Jeu** : 2 · **Motivation** : 3 · **Émotionnel+espoir** : 4 · **Contemplatif/calme** : 5 · **Pilotage/organisation** : 6 · **Explicatif/protection** : 7 · **Urgence/signalétique** : 8 · **Sécurité/délicat** : 9.

**Fiches à emporter :**
| Module | Fiche | Catégorie |
|---|---|---|
| 2 | assiette-modèle + principes | photographie |
| 4 | ses feux + leviers | photographie |
| 5 | auto-examen du pied | référence |
| 6 | son calendrier *(ROI ++)* | photographie / outil |
| 8 | carte-réflexe 15/15 | référence + photographie |
| 9 | *(option, plus tard)* lire sa courbe | référence |
*(1, 3, 7 : sans fiche.)*

**Ordre de maquettage conseillé** (valide la mécanique vite) : **2 (Alimentation)** d'abord → **4 (RCV)** → puis les autres dans le moule validé.

---

## 4. Ce que la maquette doit produire

Pour chaque module, écran(s) montrant : les **zones** en place, l'**objet manipulable** et ses **états clés** (au moins : état initial, un état de manip, l'écran final), le **2ᵉ niveau au survol** (indiqué même s'il n'est pas actif), et — pour les modules concernés — la **fiche à emporter**. Exporter dans `design/maquettes/` du projet et cocher la colonne **Design** du tableau de statut de `SPEC_outil_ETP_diabete.md`.
