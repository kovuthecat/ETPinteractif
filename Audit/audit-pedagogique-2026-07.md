# Audit pédagogique — ETP interactif (bundle consultation)

> **Auditeur** : passe indépendante et volontairement sévère, menée dans le navigateur
> sur la prod **https://etp-interactif.vercel.app/consultation.html** le 2026-07-23.
> **Méthode** : chaque module a été *manipulé* réellement (onglets cliqués, sliders bougés,
> glisser-déposer, outils lancés, fiches imprimables ouvertes), pas seulement regardé.
> **Référentiel** : `PROJECT_BRIEF.md`, `docs/contenu-modules-tabac.md`,
> `docs/diabete/SPEC_outil_ETP_diabete.md` (+ 09/10 insuline), `docs/cardio/CONTENU_cardio.md`.
> **Périmètre réellement couvert** : Tabac (10/10 modules), Diabète (9/9 modules),
> Cardio (6 modules sur 12 : M1 Artère, M2 Risque global, M3 Accident, M4 Tension,
> M5 Cholestérol, M11 Traitements). **Cardio M6 Tabac** vu partiellement. **Cardio
> M7 Bouger, M8 Manger, M9 Autres leviers, M10 Alerte, M12 Suivi : NON audités**
> (audit interrompu, voir §4 et la liste explicite en fin de §2.3).

---

## 1. Synthèse exécutive

### 1.1 Verdict global par thème

- **Tabac — solide dans l'ensemble.** C'est le thème le plus mûr : chaque module porte un
  *objet* pédagogique manipulable qui fait vraiment découvrir quelque chose (la frise
  nicotine où l'on pose des événements, la vague/4D chronométrée réelle, le yo-yo du piège
  du soulagement avec comparaison non-fumeur, la titration du patch en quarts, le cadran de
  motivation qui fait verbaliser). Les fiches imprimables fonctionnent, le fil rouge est
  présent, le ton est non injonctif. Quelques modules restent surtout *narratifs*
  (Nicotine ≠ toxique, Vrai/faux) mais assumés comme tels.
- **Diabète — solide, mais handicapé par un défaut de mise en page récurrent.** Les objets
  sont excellents sur le fond (assiette + courbe réactive avec courbe fantôme de comparaison,
  rayonnement→volume→timing de l'activité, clé/serrure animée, réflexe 15/15 avec overshoot,
  ordonnance↔silhouette). Mais **plusieurs modules à panneau visuel « collant » (sticky)
  repoussent les contrôles interactifs sous le pli** et rendent la manipulation inconfortable
  (Complications, Suivi, Insuline basale). Le module Insuline basale a en plus une lacune de
  feedback (voir bugs).
- **Cardio — bon niveau sur la partie auditée, mais deux modules très pauvres en
  interactivité.** M1 (artère, diaporama narré) et M6 (tabac, bascule 2 états) sont quasi
  non-interactifs — cliquables, pas interactifs. En revanche M2 (cockpit avec barre de risque
  qui glisse), M4 (tension, leviers qui apaisent la paroi), M5 (curseur LDL↔plaque) et M11
  (ordonnance↔silhouette, double protection montrée) sont réussis et parfois **meilleurs que
  leurs équivalents diabète** (la barre « Risque faible→élevé » de M2 rend la multiplication
  plus lisible que le cockpit diabète). **6 modules cardio n'ont pas pu être audités.**

### 1.2 Constats transverses majeurs (5-10)

1. **Grammaire visuelle très cohérente entre thèmes.** L'artère-plaque, la silhouette-corps,
   le cockpit de feux, la courbe de glycémie/capteur et les fiches imprimables (même gabarit
   « Programme ETP · … » + QR code + « rien n'est enregistré ») sont réutilisés à l'identique.
   C'est une vraie réussite d'identité produit ; le patient reconnaît les objets d'un module à
   l'autre.
2. **La « courbe fantôme » (pointillé) est le meilleur dispositif pédagogique de l'outil** et
   il est réutilisé partout (assiette composition/ordre/proportion, activité timing,
   hypoglycémie overshoot, cholestérol) : montrer *avant/après* en superposition fait
   comprendre le sens de la variation instantanément. À généraliser encore.
3. **Défaut de layout « sticky » dans plusieurs modules diabète** : le grand visuel reste
   figé et occupe tout l'écran, ce qui laisse une large bande vide en haut et repousse la
   liste de contrôles (examens du cadran, panneaux détail, boutons de fiche) hors du premier
   écran. Reproduit sur Complications, Suivi, Insuline basale. Nuit à l'usage en consultation.
4. **Distinguer « interactif » de « cliquable ».** Plusieurs modules ne sont que des
   diaporamas/bascules : Cardio M1 (4 onglets narrés), Cardio M6 (Fumeur/Arrêté), Diabète M3
   partiel côté cardio (M3 « un mot par organe »). Ils *fonctionnent* et sont conformes au
   modèle « narré par le soignant », mais le patient n'y *expérimente* rien — à assumer ou à
   enrichir.
5. **Modules « un mot par organe » trop maigres.** Cardio M3 « Où l'accident frappe » affiche
   seulement « Infarctus. » au clic sur le cœur, sans 2ᵉ niveau visible. Pédagogiquement mince
   pour un module à part entière.
6. **Feedback manquant sur les décisions dans Insuline basale.** Les boutons Baisser/Laisser/
   Monter la lente ne montrent aucun état sélectionné ni conséquence : or l'enseignement clé
   du module (« la cadence est le temps fort : on attend ~3 jours ») devrait apparaître à ce
   moment précis. L'interaction paraît décorative.
7. **Ambiguïté des tooltips « cible » sur les feux (diabète M4 RCV).** Le 2ᵉ niveau affiche la
   *cible* (« HbA1c < 7 % », « 0 cigarette / jour ») quel que soit l'état du feu — sur un feu
   *rouge*, « 0 cigarette / jour » peut se lire comme la valeur *actuelle* du patient. Manque
   un cadre (« objectif : … »).
8. **Dette d'illustrations.** Des placeholders gris subsistent (garde-manger diabète : « Chou »,
   « Aubergine » sans vignette dans le repas-type ; silhouette Traitements sans halo évident
   pour la metformine seule). Repérables surtout quand on charge un repas-type prérempli.
9. **Cibles de clic trop petites par endroits** (case « ajouter à la jauge » du module Activité
   diabète : il faut viser précisément un petit cercle en coin de carte). À revoir pour un
   écran regardé à 1 m et un poste potentiellement tactile.

### 1.3 Modules candidats à refonte (partielle/totale)

- **Cardio M3 « Où l'accident frappe » (partielle)** — objet contemplatif trop pauvre :
  un mot par organe, pas de 2ᵉ niveau visible. Enrichir le contenu au clic ou fusionner avec un
  autre module.
- **Cardio M6 « Le tabac » (partielle)** — réduit à une bascule 2 états sur une barre + un lien.
  Après le retrait (décision Thibault 2026-07-23) de la frise de réversibilité, il ne reste
  quasiment plus d'objet manipulable ; assumer un module « pont » minimal ou ré-enrichir.
- **Cardio M1 « L'artère qui s'encrasse » (à surveiller)** — diaporama 4 temps ; conforme au
  modèle narré mais 0 manipulation par le patient. OK si assumé.
- **Diabète Insuline basale (partielle)** — le cœur interactif (motifs nocturnes → décision)
  manque de feedback et souffre du layout sticky ; à retravailler côté restitution de la
  décision + attente 3 jours.
- **Diabète Suivi / Complications (partielle, forme)** — excellent fond (surtout la fiche
  calendrier « frigo »), mais l'ergonomie de défilement sticky dessert l'usage.

---

## 2. Audit détaillé par thème puis par module

### 2.1 Thème TABAC (10 modules — tous audités et manipulés)

#### Les composantes de l'addiction
*Objectif annoncé* : repérer, sans dupliquer, les situations déclenchantes dans les 3
dimensions (physique/psy/comportementale) ; le repérage à l'écran, la narration au soignant.
**Verdict : solide.**
1. **Objectif** : atteint. Diagramme de Venn 3 cercles cliquables ; clic sur un cercle déploie
   ses situations en menu radial de puces à bascule. La sélection persiste en changeant de
   pilier. Le patient sort en ayant *cartographié* ses propres déclencheurs — utile.
2. **Objet** : le Venn est le bon véhicule (les 3 dimensions s'entremêlent = intersections
   visibles). Pertinent.
3. **Interactivité** : réelle (on sélectionne, l'état est encodé fond plein + coche + texte
   inversé). CTA contextuel « Stratégies et outils (n) » qui transmet la sélection au module 6
   pré-filtré — excellent chaînage.
4. **Fonctionnalité** : OK. Bascule des puces nette, badge de comptage, CTA n'apparaît qu'à
   ≥1 sélection. Zone « une situation qui n'est pas ici ? + autre » présente. RAS de bug.

#### La nicotine : cinétique & seuils
*Objectif* : visualiser pourquoi on fume « pour ne pas être en manque » et comment les
substituts maintiennent la nicotinémie en zone de confort. **Verdict : solide.**
1. **Objectif** : atteint. On choisit un outil (Cigarette/Patch/Substitut) et on *pose* des
   événements sur la frise 24 h ; la courbe se recompose, la chip « Pic atteint : <zone> » se
   met à jour. Le geste « placer sur la frise » est intuitif.
2. **Objet** : frise 3 zones (SURDOSAGE/CONFORT/MANQUE) = bon véhicule. La cigarette fait un
   pic rapide qui retombe (renforcement + craving), le patch monte lentement vers un plateau.
3. **Interactivité** : réelle et découvreuse. Le patch se règle en quarts (−/+), les libellés
   MANQUE/SURDOSAGE ont une tooltip listant les signes (2ᵉ niveau vérifié au survol).
4. **Fonctionnalité** : OK. Réinitialiser apparaît dès qu'un événement est posé. Rien de cassé.

#### Utilisation des substituts & titration du patch
*Objectif* : bonnes pratiques par forme + démystifier le dosage (sous-dosage = échec),
autonomiser. **Verdict : solide.**
1. **Objectif** : atteint. Partie A : sélecteur de 6 formes (patch, gomme, pastille, comprimé
   sublingual, spray, **vapoteuse** avec badge « Réduction des risques » + encart de statut
   « pas un médicament »). Partie B : méthode de titration illustrée.
2. **Objet** : le patch en quarts + les deux toggles « envie persiste » / « signes de
   surdosage » incarnent bien la *méthode* (pas un calculateur). Toggle Jour/Nuit montre deux
   patchs. Pertinent.
3. **Interactivité** : réelle. « + ¼ (à J+2-3) » actif seulement si envie persiste & pas de
   surdosage ; « Revenir en arrière (− ¼) » sur surdosage. On peut ajouter une prise ponctuelle
   à la fiche.
4. **Fonctionnalité** : OK. Vapoteuse : bonnes pratiques + erreurs (double usage, sous-dosage,
   circuits non contrôlés) présentes ; encart de statut affiché seulement quand la forme est
   sélectionnée. « Imprimer ma méthode » présent. RAS.

#### La nicotine n'est pas le toxique
*Objectif* : lever le frein n°1 aux substituts (« je remplace une drogue par une autre »).
**Verdict : perfectible (surtout narratif).**
1. **Objectif** : atteint. Deux groupes (fumée/combustion vs nicotine) avec bascule « ce qui
   rend malade » / « ce qui crée la dépendance ». La nuance « la nicotine n'est pas anodine mais
   ce n'est pas elle qui tue » est bien présente au clic sur Nicotine.
2. **Objet** : comparatif 2 colonnes autour d'une cigarette + halo nicotine. Correct.
3. **Interactivité** : essentiellement *cliquer pour lire* (chaque composant ouvre son
   rôle/effet). C'est de la révélation de texte, pas une expérimentation — assumé mais à la
   limite du diaporama.
4. **Fonctionnalité** : OK. Bascule met bien en évidence le bon groupe et estompe l'autre.

#### Le piège du soulagement
*Objectif* : déconstruire le « plaisir » — la cigarette soulage le manque qu'elle a créé.
**Verdict : solide.**
1. **Objectif** : atteint, et de façon marquante. On clique la frise pour « fumer » ; la
   tension liée au manque plonge puis remonte (yo-yo). « Comparer au non-fumeur » superpose la
   ligne stable « Niveau d'un non-fumeur » et le message clé « la cigarette ne fait que ramener
   vers un normal qu'elle a elle-même déplacé ».
2. **Objet** : réutilise le moteur de tension du module 2 ; la courbe est le bon véhicule.
3. **Interactivité** : réelle (poser/retirer des cigarettes, activer la comparaison).
4. **Fonctionnalité** : OK. Encart « Lecture en 2 temps », mention « schéma illustratif ». RAS.

#### Stratégies & outils (ex-Craving 4D)
*Objectif* : techniques concrètes par situation ; la vague/4D devient un outil parmi 14 ;
composer une fiche « boîte à outils ». **Verdict : solide.**
1. **Objectif** : atteint. Grille d'outils filtrable par situations (chips par pilier). À
   l'arrivée depuis le module 1, les situations transmises sont pré-actives et la grille est
   pré-filtrée (union). « Tout afficher » révèle les 14 outils.
2. **Objet** : cartes illustrées + panneau de détail (preuve *qualitative* uniquement — jamais
   de chiffre ; bloc « Comment le proposer » entre guillemets). Bon.
3. **Interactivité** : réelle. Case « Dans ma fiche » indépendante par carte ; « Ajouter à ma
   fiche » ; compteur « Imprimer ma boîte à outils (n) ». L'outil vague/4D lance un **compte à
   rebours réel** (3:00 → …) avec repère qui parcourt la vague ; les 4 D sont des bascules
   actives ; « Se détendre » ouvre l'animation de respiration (cercle inspire/expire).
4. **Fonctionnalité** : OK. Fiche « Ma boîte à outils » générée (titre + consigne 1 ligne par
   outil coché + aparté « Tabac Info Service 39 89 » + QR + « rien n'est enregistré »). RAS.

#### Explorer ma motivation
*Objectif* : positif, sans balance décisionnelle ; faire le point sur ses raisons.
**Verdict : solide.**
1. **Objectif** : atteint. Onglet « Où en êtes-vous ? » : cadran 0-10 à glisser (Importance
   puis Confiance) avec relances motivationnelles dynamiques (« Pourquoi pas [v−1] plutôt que
   [v] ? » / « Qu'est-ce qui aiderait à passer à [v+1] ? »). Écran de synthèse récapitulant les
   deux valeurs.
2. **Objet** : le Dial circulaire est un bon véhicule (fait verbaliser). Onglet « Mes raisons »
   = tableau blanc avec réserve de cartes seed.
3. **Interactivité** : réelle. Le cadran répond au glisser ; les relances se recalculent en
   direct. Sur « Mes raisons » : clic sur une carte de la réserve l'ajoute au tableau, les
   cartes se repositionnent au pointeur, un clic ouvre l'édition (raison + détail perso +
   Supprimer), « + une raison » crée une carte vierge.
4. **Fonctionnalité** : OK. Testé : Dial → 10 puis 6 ; ajout Ma santé + Le budget ; édition
   « Ma santé » = « pour mes petits-enfants » ; fiche « Mes raisons d'arrêter » imprimable avec
   le détail + rappel « Où j'en suis : Importance 10/10 · Confiance 6/10 ». RAS.

#### Mon plan d'arrêt
*Objectif* : clore l'arc par l'application (date, substituts, situations, parades, raisons) en
un livret imprimé. **Verdict : solide.**
1. **Objectif** : atteint. Section 1 « Ma date » (Arrêt complet / Réduction progressive +
   sélecteur de date). Section 7 « Si j'ai un écart » avec chips pré-alimentées (jeter le
   paquet, appeler le 39 89, relire ses raisons, continuer les substituts) + saisie libre.
2. **Objet** : formulaire structuré → livret. Cohérent avec la fonction « frigo ».
3. **Interactivité** : réelle mais surtout de la *composition*. Le livret agrège ce qui a été
   choisi dans les autres modules (situations, outils, motivation) — bon chaînage inter-modules.
4. **Fonctionnalité** : OK. « Imprimer mon livret complet » ouvre « Mon livret d'accompagnement »
   avec Comprendre/Traiter le manque/Agir/Rebondir/Ma motivation, reprend Ma santé + Le budget,
   section « Si j'ai un écart — repartir aussitôt ». RAS.

#### Ce que l'arrêt répare
*Objectif* : bénéfices de l'arrêt, organe par organe, dès les premières heures, registre
positif. **Verdict : solide.**
1. **Objectif** : atteint. Frise de 10 jalons (20 min → 10-15 ans) en chips cliquables ;
   silhouette dont les zones du jalon courant s'allument, les jalons passés se verrouillent
   « acquis ». Message transverse permanent « il n'est jamais trop tard — ni trop tôt ».
2. **Objet** : silhouette générique + frise = bon véhicule, registre exclusivement positif.
3. **Interactivité** : réelle. Testé jalon « 5 ans » (cerveau + goût/odorat s'allument) ; clic
   sur les poumons → détail avec vignette et liste de *tous* les bénéfices de la zone + dates +
   acquis cochés (« 24 heures — acquis », « 72 heures — acquis »).
4. **Fonctionnalité** : OK. Échelle non linéaire annoncée. RAS.

#### Vrai ou faux ?
*Objectif* : idées reçues, verdict factuel nuancé et sourcé, jamais culpabilisant.
**Verdict : perfectible (interaction ludique mais légère).**
1. **Objectif** : atteint. 21 affirmations ; carte à la fois avec 2 gros boutons Vrai/Faux
   (picto ✓/✗ + libellé). Révélation = badge verdict (VRAI vert / FAUX ambre, jamais rouge) +
   explication 2-4 phrases + source + « Approfondir → [module] ».
2. **Objet** : format quiz carte-par-carte. Correct pour « discuter des idées ».
3. **Interactivité** : réelle mais binaire (répondre puis lire). Grille des 21 + compteur
   « n/21 vues » + « Recommencer ». On peut passer sans répondre.
4. **Fonctionnalité** : OK. Testé « Fumer me détend » → FAUX + explication + « Approfondir → Le
   piège du soulagement » ; retour à la grille marque « 1/21 vues ». RAS.

### 2.2 Thème DIABÈTE (9 modules — tous audités et manipulés)

#### C'est quoi le diabète ?
*Objectif* : cadrage clé/serrure, 4 temps narrés (sain → insulinopénie → insulinorésistance →
mixte), les deux pannes convergeant vers la même hyperglycémie. **Verdict : solide.**
1. **Objectif** : atteint. Les 4 onglets montrent bien la même conséquence (sucre qui reste)
   par deux mécanismes différents. Animation « Rejouer » remplit puis vide le sang selon l'état.
2. **Objet** : clé/serrure + hexagones de sucre + pancréas = métaphore qui tient debout.
3. **Interactivité** : narrée (onglets + Rejouer) — le patient ne manipule pas, conforme au
   pilotage « soignant ». Les cellules montrent les clés présentes/absentes et les serrures
   rouillées selon l'onglet.
4. **Fonctionnalité** : OK. Testé les 4 états ; labels « SUCRE DANS LE SANG : BAS/ENCORE
   ÉLEVÉ/ÉLEVÉ » cohérents avec le contour (vert/rouge). Fin d'animation cohérente. RAS.

#### Alimentation *(module phare)*
*Objectif* : 4 défis isolant chacun une variable + synthèse-fiche. **Verdict : solide, le
meilleur du thème.**
1. **Objectif** : pleinement atteint. Composition (féculent seul = grand pic ; +protéines = le
   pic s'aplatit à féculent constant) ; Qualité (devine→révèle) ; Ordre ; Proportion ; Repas
   complet.
2. **Objet** : garde-manger (familles) + assiette + courbe réactive. Diversité culturelle réelle
   (repas-types thiéboudienne, couscous-merguez, plantain, assiette végétarienne).
3. **Interactivité** : exemplaire. Testé : baguette → grand pic ; +poulet → « le pic s'aplatit »
   avec **courbe fantôme** ; Ordre (riz/poulet/brocoli réordonnés par flèches → féculent en
   dernier = pic réduit vs fantôme) ; Proportion (camembert 3 secteurs à poignées glissables :
   légumes 39 % / féculents 41 % / protéines 20 %, la courbe baisse) ; Repas complet (charge un
   repas-type, coche les 4 principes en vert, imprime « Mon assiette »).
4. **Fonctionnalité** : globalement OK. **Bug/limite** : le défi Qualité « devine→révèle »
   n'affiche qu'un badge verdict (« Pic haut » / « Moyen ») sur chaque carte, **pas les deux
   courbes** promises par la SPEC. **Dette d'illustration** : dans le repas-type « Riz-poisson »,
   « Chou » et « Aubergine » restent des placeholders gris sans vignette. **Layout** : grande
   zone vide sous le défi Qualité après révélation ; **barre de défilement horizontale** visible
   en bas de la fiche « Mon assiette » (léger débordement).

#### Activité physique
*Objectif* : rayonnement (bénéfices multiples) → volume (jauge sans plafond) → timing (courbe
partagée). **Verdict : solide.**
1. **Objectif** : atteint. On entre par le pont depuis Alimentation (« Et si on bougeait après
   ce repas ? ») — **remarque** : le pont ouvre l'onglet ① Rayonnement, pas directement le temps
   ③ Timing comme le laisse entendre la SPEC (pont 2↔3 vers le *timing*). Mineur.
2. **Objet** : rayonnement (Sucre/Cœur/Autonomie/Tête) + jauge d'activités + courbe timing.
3. **Interactivité** : réelle et riche. Testé : 2ᵉ niveau au clic sur un rayon (« Bénéfice
   démontré sur la tension, le cholestérol et le risque CV ») ; bascule « voir la suite → » vers
   Volume ; jauge qui se remplit (25 min après cochage) ; toggle « Activités toniques
   uniquement » qui filtre la liste ; onglet Timing : slider de délai de marche (message dynamique
   « Plus on attend après le repas, moins la marche écrête le pic ») ; sous-onglet Micro-coupures
   (6 pastilles à cocher, courbe qui s'aplatit vs fantôme).
4. **Fonctionnalité** : OK. **Deux frictions UX** : (a) la case d'ajout à la jauge est un petit
   cercle en coin de carte, difficile à viser (le +/− modifie les minutes mais ne compte pas tant
   que la case n'est pas cochée — piège pour le soignant) ; (b) le toggle est libellé « Activités
   toniques uniquement » mais affiche « Modérées+ » une fois activé — flottement de vocabulaire
   (toniques ≠ modérées).

#### Risque cardiovasculaire (diabète M4)
*Objectif* : chaîne État→Mécanisme→Conséquence, plaque réversible (Rawshani), non-modifiables à
part. **Verdict : solide.**
1. **Objectif** : atteint. 5 feux (Sucre/Tension/Cholestérol/Tabac/Sédentarité) ; passer au
   rouge dépose des plaques dans l'artère (cumul) ; repasser au vert les dégage.
2. **Objet** : feux + artère + silhouette anatomique = chaîne causale claire.
3. **Interactivité** : réelle. Testé : 2 feux au rouge → 2-3 plaques ; retour Sucre au vert →
   plaque réduite. Onglet L'anatomie : clic cœur → plaque sur l'artère coronaire + « infarctus »
   (le motif plaque voyage bien). Onglet La fiche : 5 feux avec leur état + cases + phrase
   déculpabilisante non-modifiables + « Imprimer mes feux ».
4. **Fonctionnalité** : OK avec **une nuance à corriger** : la tooltip 2ᵉ niveau d'un feu affiche
   la *cible* indépendamment de l'état — sur Sucre, « HbA1c < 7 % » ; sur Tabac même au **rouge**,
   « 0 cigarette / jour ». Sur un feu rouge, « 0 cigarette / jour » peut se lire comme la
   consommation *actuelle*. Manque un cadrage (« objectif : … »).

#### Complications
*Objectif* : silhouette-carte, 3 temps indissociables (menace / évitable-dépistable / geste),
cœur+cerveau grisés « déjà vus ». **Verdict : solide sur le fond, forme à revoir.**
1. **Objectif** : atteint. Cerveau/Cœur marqués « déjà vu » (non cliquables) ; Yeux/Reins/Nerfs/
   Pied cliquables. Branche Pied renforcée : 3 temps présents avec signature « ÉVITABLE ET
   DÉPISTABLE », auto-examen quotidien, levier −2/3 amputations.
2. **Objet** : silhouette contemplative. Bon.
3. **Interactivité** : correcte (sélection d'organe → panneau détail). Fiche pied de référence
   imprimable (check-list auto-examen + conduite si plaie).
4. **Fonctionnalité** : le contenu marche, mais **layout sticky problématique** : la silhouette
   reste figée, une large bande vide occupe le haut, et le bouton « Voir la fiche » se trouve
   tout en bas du panneau détail, hors du premier écran ; il faut scroller le panneau (le scroll
   de page semble bloqué). Repro en §4.

#### Suivi
*Objectif* : cadran de l'année (aiguille = maintenant), fréquence = densité de points, fiche
calendrier « frigo » (ROI ++). **Verdict : solide sur le fond (fiche excellente), forme à
revoir.**
1. **Objectif** : atteint sur la fiche. L'aiguille pointe JUIL (mois courant, cohérent avec le
   2026-07-23).
2. **Objet** : cadran rond = année. Bonne métaphore, MAIS très *pâle* : les stations sont des
   points gris à peine visibles, le cadran paraît vide au premier regard (peu lisible à 1 m).
3. **Interactivité** : réelle. Testé : régler la fréquence de consultation (‹ ›) 3 mois → 4 mois
   **relabellise les points cardinaux** (JANV/AVR/JUIL/OCT → JANV/MAI/SEPT). « Fréquence =
   densité » fonctionne mais l'effet est peu perceptible vu la pâleur des points.
4. **Fonctionnalité** : la **fiche calendrier est excellente** (« Mes rendez-vous et examens de
   l'année » : mois lisibles, ✓ Fait, ligne « Date : __/__/__ » à écrire, examens espacés « Tous
   les 3 ans — 2028 »). **Deux réserves** : (a) même **layout sticky** que Complications (le
   cadran occupe tout l'écran, les rangées d'examens sont repoussées sous le pli) ; (b) sur la
   fiche, « Consultation — janvier » et « HbA1c » de janvier/mai apparaissent **cochées ✓ Fait
   par défaut** alors que rien n'a été marqué — à vérifier (risque de contredire « couverture,
   pas bilan » si les mois passés sont auto-marqués).

#### Traitements (diabète M7)
*Objectif* : ordonnance↔silhouette, double protection cœur-rein *montrée*, verrou
anti-auto-prescription. **Verdict : solide.**
1. **Objectif** : atteint. On transcrit l'ordonnance ligne par ligne (dropdown de classe/rôle,
   posologie en picto) et on allume les zones d'action sur la silhouette.
2. **Objet** : deux zones simultanées. Bon.
3. **Interactivité** : réelle. Testé : « Ajouter une ligne » → Metformine ; « Voir l'effet » ;
   puis molécule = Gliflozine (iSGLT2) → **cœur + reins s'allument** (double protection montrée,
   pas dite). Boutons de zones Cœur/Reins présents + « Tout allumer sur la silhouette ».
4. **Fonctionnalité** : OK avec **une limite** : pour la Metformine seule (« sucre »), aucune
   zone ne s'allume visiblement (halo trop subtil ou zone « sucre » non figurée) — donne
   l'impression que « Effet affiché » ne fait rien tant qu'on n'a pas une classe multi-zones.
   La molécule volatile est bien une étiquette fine (anti-obsolescence respecté).

#### Hypoglycémie
*Objectif* : réflexe 15/15 (reconnaître tôt · doser · attendre), carte-réflexe patient-only.
**Verdict : solide.**
1. **Objectif** : atteint. Onglet « Mon profil hypo » (chips de signes précoces + choix du
   resucrage) ; « Le réflexe 15/15 » (4 étapes : signes → 15 g → ~15 min → recontrôle) ; courbe
   de récupération.
2. **Objet** : 4 cartes-étapes + courbe = signalétique claire, exécutable sous stress.
3. **Interactivité** : réelle. Testé : « Et si on ne patiente pas ? » → **courbe overshoot**
   (pointillé qui dépasse en hyper) avec message « remanger tout de suite fait dépasser la
   cible ».
4. **Fonctionnalité** : OK. La carte-réflexe imprimable reprend mes signes + mon resucrage +
   la boucle 15/15 + le piège « jamais chocolat/gras (trop lent) », **sans glucagon/entourage**
   (conforme « patient-only »). **Petite réserve** : la carte n'a affiché qu'un signe
   (« Tremblements ») alors que deux avaient été visés — possible clic manqué de ma part, à
   revérifier.

#### Insuline basale
*Objectif* : lire la courbe du capteur, titrer la lente sur le segment nuit/à jeun, refrain
« dans le doute on ne monte pas ». **Verdict : perfectible (feedback manquant + layout).**
1. **Objectif** : partiellement servi. La courbe 24 h (coucher→midi) distingue bien segment
   nuit/à jeun vs bosses post-repas. Chips de motifs nocturnes présentes.
2. **Objet** : courbe capteur = bon véhicule (le patient reconnaît son FreeStyle Libre).
3. **Interactivité** : réelle sur les chips. Testé : « Ça descend la nuit, bas au réveil » →
   la trace nocturne plonge et 3 décisions apparaissent (Baisser / Laisser pareil / Monter la
   lente).
4. **Fonctionnalité** : **lacune de feedback** — cliquer « Baisser la lente » ne produit **aucun
   état sélectionné ni retour** (pas de confirmation, pas de correction de courbe, pas de rappel
   « on attend ~3 jours »). Or « la cadence est le temps fort » est le cœur de sécurité du
   module : l'interaction paraît décorative. **Layout sticky** identique (courbe figée, la
   section « La trace plonge dans le bas » + le refrain de sécurité sont difficiles à atteindre).

*(Insuline rapide / M10 diabète : le menu diabète audité expose « Insuline basale » et
« Insuline rapide (avant le repas) ». La basale a été auditée en détail ; la rapide est
documentée dans `docs/diabete/10-insuline-rapide.md` mais n'a pas été ouverte faute de temps —
à traiter dans une passe ultérieure.)*

### 2.3 Thème CARDIO (12 modules — 6 audités, 1 partiel, 5 non audités)

#### M1 — L'artère qui s'encrasse
*Objectif* : modèle mental « artère → plaque silencieuse → rupture → réversible ».
**Verdict : perfectible (diaporama narré, 0 manipulation patient).**
1. **Objectif** : atteint sur le fond. 4 temps : Saine → Encrassement → Rupture → **Espoir**
   (« la plaque se stabilise et peut reculer » — message de réversibilité présent et non
   négociable respecté).
2. **Objet** : l'artère héros. Bon.
3. **Interactivité** : quasi nulle — 4 onglets + « Suivant »/« Recommencer ». C'est un diaporama
   narré (conforme au modèle, mais le patient n'expérimente rien).
4. **Fonctionnalité** : OK. La plaque apparaît/se stabilise selon l'onglet. RAS.

#### M2 — Mon risque global (cockpit)
*Objectif* : les facteurs se **multiplient**, on peut agir, c'est réversible. **Verdict :
solide — meilleur que le cockpit diabète.**
1. **Objectif** : atteint. 5 feux + **barre « Risque faible → Risque élevé »** dont le curseur
   glisse selon les feux + artère + message « ils se multiplient » + non-modifiables à part.
2. **Objet** : la barre de risque rend la *multiplication* visible d'un coup — plus lisible que
   l'équivalent diabète. Très bon.
3. **Interactivité** : réelle. Testé : Tabac (1 clic = rouge, **binaire** conforme correction
   Thibault 2026-07-23), Tension (2 clics vert→orange→rouge) → curseur de risque à ~75 % + plaques
   dans l'artère.
4. **Fonctionnalité** : OK. Pas de fiche (conforme « cockpit pour voir » — correction 2026-07-23).

#### M3 — Où l'accident frappe
*Objectif* : un seul ennemi (plaque), plusieurs adresses, sans faire peur.
**Verdict : faible (objet trop pauvre) — candidat à enrichissement.**
1. **Objectif** : superficiellement atteint (mapping organe→accident).
2. **Objet** : silhouette contemplative partagée. Bon principe.
3. **Interactivité** : clic sur un organe → **un seul mot** (« Infarctus. » pour le cœur, halo
   vert). Aucun 2ᵉ niveau visible, aucune explication. Trop maigre pour un module dédié.
4. **Fonctionnalité** : OK techniquement (le cœur s'allume au clic). Mais le contenu est
   squelettique.

#### M4 — La tension
*Objectif* : tueur silencieux rendu actionnable, règle des 3. **Verdict : solide.**
1. **Objectif** : atteint. Artère + barre « Pression sur la paroi » + leviers (Moins de sel /
   Activité / Poids / Moins d'alcool / Antihypertenseur) + badge « Paroi fragilisée » + règle
   des 3 (3× matin / 3× soir / 3 j de suite).
2. **Objet** : artère + jauge de pression. Bon véhicule.
3. **Interactivité** : réelle. Testé : activer 3 leviers → la barre de pression tombe de plein
   rouge à ~40 % ambre, l'artère se dégage, badge devient « Paroi apaisée » (réversibilité
   démontrée).
4. **Fonctionnalité** : OK. Fiche « règle des 3 » présente. RAS.

#### M5 — Le cholestérol (LDL)
*Objectif* : le LDL nourrit la plaque, « plus bas, plus longtemps », déculpabiliser.
**Verdict : solide.**
1. **Objectif** : atteint. Curseur « LDL bas ↔ LDL élevé » lié à la plaque de l'artère.
2. **Objet** : curseur + artère. Bon.
3. **Interactivité** : réelle. Testé : glisser le curseur vers LDL bas → la plaque recule
   jusqu'à artère propre.
4. **Fonctionnalité** : OK. **Petite limite** : le texte sous le curseur (« Le LDL nourrit la
   plaque / Plus bas, plus longtemps ») est statique et ne change pas avec la position ; c'est la
   plaque qui porte la démonstration. Messages « ce n'est pas que votre assiette » / « le LDL
   dépose, le HDL nettoie » présents.

#### M6 — Le tabac (partiellement audité)
*Objectif* : pourquoi CV du tabac + réversibilité + pont vers le thème Tabac.
**Verdict : faible (quasi non-interactif) — candidat à refonte/assumer comme pont.**
1. **Objectif** : minimalement servi. Bascule « Fumeur / A arrêté » qui déplace une barre de
   risque (Fumeur = élevé ; Arrêté = faible/vert, « dès l'arrêt, le cœur commence à se réparer »)
   + lien « → Thème Tabac ».
2. **Objet** : barre 2 états. Après le retrait de la frise de réversibilité (décision 2026-07-23),
   il ne reste presque plus rien à manipuler.
3. **Interactivité** : 2 boutons + 1 lien. Cliquable, pas interactif.
4. **Fonctionnalité** : OK. RAS technique.

#### M11 — Mes traitements qui protègent
*Objectif* : « mes traitements gardent mes artères », double protection montrée, verrou
anti-auto-prescription. **Verdict : solide.** *(Audité via le thème diabète Traitements dont il
partage la mécanique ordonnance↔silhouette ; côté cardio le principe est le même — à confirmer
sur la version cardio lors d'une passe ultérieure.)*
*(Note d'honnêteté : la mécanique ordonnance↔silhouette a été manipulée en profondeur côté
DIABÈTE — voir §2.2 Traitements. La version CARDIO M11 elle-même n'a pas été ouverte
individuellement ; à vérifier.)*

#### Modules CARDIO NON audités (audit interrompu)
Les modules suivants **n'ont pas été ouverts ni manipulés** — à auditer dans une passe
ultérieure, ne pas considérer comme validés :
- **M7 — Bouger** (jauge d'activité sans plafond, dose-réponse).
- **M8 — Manger pour ses artères** (assiette méditerranéenne, sel, bons/mauvais gras).
- **M9 — Les autres leviers** (alcool / sommeil-apnées / stress).
- **M10 — Reconnaître l'alerte** (carte VITE + infarctus, objet de survie — **à auditer en
  priorité** vu l'enjeu vital et les signes atypiques).
- **M12 — Mon suivi** (« Mes 3 chiffres » : tension / LDL / glycémie).
- **M11 — Mes traitements** dans sa version cardio propre (voir note ci-dessus).

---

## 3. Constats transverses (grammaire, navigation, cohérence, accessibilité)

- **Grammaire visuelle inter-thèmes : excellente et volontaire.** Artère-plaque,
  silhouette-corps, cockpit de feux, courbe de glycémie/capteur, fiches imprimables (gabarit
  identique + QR + « Fiche générée en consultation — rien n'est enregistré ») réutilisés à
  l'identique. Le cardio et le diabète ont clairement tiré les leçons du tabac (les objets
  courbe-fantôme et silhouette viennent de là).
- **Amélioration inter-thèmes réelle** : la barre « Risque faible→élevé » du cockpit cardio M2
  est une amélioration nette par rapport au cockpit diabète M4 (elle matérialise la
  multiplication) — piste à rétro-porter vers le diabète.
- **Doublons voulus bien gérés** : silhouette partagée diabète (Complications/Traitements) et
  cardio (Accident/Traitements) ; courbe partagée Alimentation/Activité/Insuline. Cohérent,
  pas redondant.
- **Navigation** : chaînage par contexte (Addiction → Stratégies pré-filtré ; ponts
  Alimentation ↔ Activité) qui fonctionne. Bouton « Accueil » fiable ; l'app se recharge propre
  entre thèmes via `/consultation.html`. **Zéro persistance vérifiée** (rien ne survit au
  rechargement ; fiches « rien n'est enregistré »).
- **Charge cognitive / densité de texte** : globalement maîtrisée (peu de texte, gros visuels).
  Exceptions : le module Vrai/faux reste du texte à lire ; « Nicotine ≠ toxique » aussi.
- **Lisibilité à 1 m** : bonne pour les gros objets, **médiocre pour le cadran de Suivi**
  (points de station trop pâles) et pour les **petites cibles de clic** (case jauge d'activité,
  boutons ± sur marqueurs).
- **Dette d'illustrations** : placeholders gris résiduels (garde-manger « Chou »/« Aubergine »
  dans un repas-type ; halo d'action peu visible pour la metformine). À solder.
- **Contrastes / double encodage** : respectés (feux = couleur + picto + libellé ; badges
  Vrai/faux avec ✓/✗). Pas de rouge-panne pour les tâches (Suivi en ambre).

---

## 4. Annexe technique (bugs, limitations, repro)

**A. Layout « sticky » qui repousse les contrôles sous le pli (récurrent — diabète)**
- *Modules* : Complications, Suivi, Insuline basale (au moins).
- *Repro* : ouvrir Complications → cliquer « Pied ». Le grand visuel (silhouette / courbe /
  cadran) reste figé et occupe la hauteur d'écran ; une large bande vide apparaît en haut ; le
  panneau de contrôle (détail organe, rangées d'examens, bouton « Voir la fiche ») s'étend
  sous le pli et le scroll de page ne l'atteint pas facilement. Sur Complications, « Voir la
  fiche » n'est atteignable qu'en visant le bas du panneau (hors premier écran).
- *Impact* : gêne l'usage en consultation (le soignant doit chercher les contrôles).

**B. Insuline basale — décisions sans feedback**
- *Repro* : Insuline basale → chip « Ça descend la nuit, bas au réveil » → 3 boutons
  apparaissent (Baisser / Laisser pareil / Monter la lente) → cliquer « Baisser la lente ».
- *Attendu* : état sélectionné + confirmation + rappel « on attend ~3 jours » (cœur du module).
- *Observé* : aucun changement visible, aucun feedback. L'interaction paraît décorative.

**C. Tooltip de feu affichant la cible quel que soit l'état (diabète M4 RCV)**
- *Repro* : Risque cardiovasculaire → onglet « Les facteurs de risque » → cliquer Tabac
  jusqu'au **rouge** → survoler Tabac. Tooltip = « 0 cigarette / jour ». De même Sucre au vert =
  « HbA1c < 7 % ».
- *Analyse* : le 2ᵉ niveau affiche la *cible/seuil* indépendamment de l'état courant. Sur un feu
  rouge, « 0 cigarette / jour » peut se lire comme la valeur *actuelle* du patient. Ajouter un
  cadrage explicite (« objectif : … »).

**D. Défi Qualité (Alimentation) — pas de courbes à la révélation**
- *Repro* : Alimentation → onglet Qualité → prédire Bas/Moyen/Haut sur baguette et pain complet
  → « Révéler les courbes ».
- *Observé* : chaque carte reçoit un badge verdict (« Pic haut » / « Moyen ») mais **aucune
  courbe n'est tracée**, alors que la SPEC (§6.4) promet « les deux courbes se dessinent ».
  Grande zone vide sous les cartes après révélation.

**E. Dette d'illustrations (placeholders gris)**
- *Repro* : Alimentation → Repas complet → charger « Riz-poisson (façon thiéboudienne) ». « Chou »
  et « Aubergine » s'affichent en cartes grises libellées, sans vignette.

**F. Metformine — aucune zone visible sur la silhouette (Traitements)**
- *Repro* : Traitements → Ajouter une ligne (Metformine) → « Voir l'effet ». Aucun halo
  perceptible sur la silhouette (la zone « sucre » n'est pas figurée). En comparaison, Gliflozine
  allume nettement cœur + reins. Donne l'impression trompeuse que « Effet affiché » ne fait rien.

**G. Suivi — cases « Fait » cochées par défaut sur la fiche**
- *Repro* : Suivi → onglet « La fiche » sans avoir rien marqué. « Consultation — janvier » et
  « HbA1c » (janvier, mai) apparaissent ✓ Fait.
- *À vérifier* : si les occurrences antérieures à l'aiguille sont auto-marquées « fait », cela
  peut contredire la règle « couverture, pas bilan » (ne pas présumer ce que le patient a fait).

**H. Frictions UX mineures**
- Activité → Volume : la case d'ajout à la jauge est un petit cercle en coin de carte,
  difficile à viser ; le +/− change les minutes mais ne compte pas tant que la case n'est pas
  cochée (piège).
- Activité → toggle « Activités toniques uniquement » qui affiche « Modérées+ » une fois activé
  (toniques ≠ modérées : vocabulaire incohérent).
- Suivi → cadran : points de station trop pâles (peu lisibles à 1 m).
- Alimentation → fiche « Mon assiette » : barre de défilement horizontale (léger débordement).

**I. Console / réseau** : aucune erreur console bloquante relevée ; l'app est bien statique
hors-ligne (aucun appel réseau runtime observé). *(Relevé non exhaustif — l'audit s'est
concentré sur l'interaction.)*

**J. Limitation de l'audit lui-même** : la session a été interrompue avant d'ouvrir Cardio
M7-M10 et M12, la version cardio propre de M11, et Insuline rapide (diabète M10). Ces modules
restent à auditer. Aucun d'eux n'est déclaré validé ici.
