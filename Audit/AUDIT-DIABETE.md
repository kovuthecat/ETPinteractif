# Audit UX/pédagogique — thème Diabète

Audit réalisé sur `https://etp-interactif.vercel.app/` avec Chromium/Playwright, thème **Diabète** uniquement. Captures et JSON de preuve : `Audit/evidence-audit-diabete/`. Viewports testés : `1440x900` et `1024x768`.

## Résumé exécutif

1. **Important — Chiffres médicaux visibles ou exposés dans l'UI** : plusieurs écrans/contrôles affichent des valeurs brutes ou dosages (`CG 22`, `150 ml`, `15 g`, `mg/dL`, pourcentages TIR, sources avec chiffres). Cela contredit l'invariant "pas de texte médical chiffré brut à l'écran" et peut déplacer la consultation vers la prescription/calcul au lieu de la compréhension.
2. **Important — Cibles trop petites dans Activité physique** : les boutons "Coupure 1" à "Coupure 6" mesurent `30x30 px` à `1024x768`, sous le minimum de 44 px. Risque de clic raté en écran partagé ou tactile.
3. **Important — Densité trop forte dans Suivi et Traitements** : beaucoup de contrôles simultanés, libellés techniques, petits textes à 13 px et commandes de fréquence. À 1 m, le soignant doit probablement reprendre la main et expliquer l'interface avant le message.
4. **Important — Module Mécanisme moins pilotable qu'un vrai déroulé en 4 temps** : l'animation clé/serrure fonctionne, mais les phases sont temporisées et non contrôlées étape par étape. Le soignant ne peut pas facilement s'arrêter sur chaque temps pédagogique.
5. **Important — Plusieurs libellés d'accessibilité ou boutons sont peu discriminants** : Risque cardio expose cinq boutons nommés "Vert"; Suivi expose plusieurs petits boutons "i"; Traitements expose des boutons longs et techniques. Le clavier/focus fonctionne globalement, mais la compréhension au focus est variable.
6. **Mineur — Navigation globale cohérente mais libellé retour ambigu** : le bouton d'en-tête est "Accueil", pas "Retour". Le retour vers la carte fonctionne sur les modules testés, mais le libellé est moins explicite pendant un module.
7. **Mineur — Aucun débordement horizontal détecté à 1024x768** : les métriques Playwright indiquent `scrollWidth == clientWidth` sur les écrans vérifiés. Le responsive tient, au prix d'une densité parfois élevée.
8. **Mineur — Santé technique correcte** : aucune requête échouée; seuls des warnings de preload de police `WorkSans-latin.woff2` ont été observés.

## 1. C'est quoi le diabète

**Ce qui fonctionne bien**

La métaphore clé/serrure est immédiatement identifiable. Les quatre modes ("Sans diabète", "Insulinopénie", "Insulinorésistance", "Mixte") sont de grandes cibles, et le bouton "Rejouer" donne un contrôle minimal au soignant. Captures : `01-mecanisme-empty.png`, `01-mecanisme-modes-final.png`, `01-mecanisme-1024-fast.png`.

**Problèmes constatés**

- **Gravité : important | Axe : pédagogie/ergonomie**  
  Étapes : ouvrir le module, cliquer "Insulinopénie", "Insulinorésistance", "Mixte", attendre la fin de l'animation. Capture : `Audit/evidence-audit-diabete/01-mecanisme-modes-final.png`.  
  Constat : le déroulé en 4 temps demandé est joué par une animation temporisée, sans boutons "temps 1/2/3/4". Le soignant peut rejouer, mais ne peut pas figer précisément "les clés partent", "la serrure réagit", "le sucre reste".  
  Impact : le patient peut voir une animation finie sans comprendre les étapes intermédiaires; le soignant doit narrer au bon timing.

- **Gravité : mineur | Axe : lisibilité**  
  Étapes : passer en `1024x768`. Capture : `Audit/evidence-audit-diabete/01-mecanisme-1024-fast.png`.  
  Constat : plusieurs libellés de scène sont à 12-13 px (`PANCRÉAS`, état du sucre).  
  Impact : à 1 m, ces repères servent peu; ils risquent d'être décoratifs plutôt que pédagogiques.

**Suggestions concrètes**

Ajouter un contrôle de phases ("1. clé", "2. serrure", "3. sucre", "4. synthèse") ou un mode pause/étape. Grossir les libellés anatomiques ou les remplacer par des repères visuels plus forts.

## 2. Alimentation

**Ce qui fonctionne bien**

Le module est riche et réellement interactif : familles d'aliments, ajout dans l'assiette, deuxième niveau de lecture, onglets de défis, synthèse. Le retour à la carte est validé. Captures : `02-alimentation-empty-fast.png`, `02-alimentation-infohover-fast.png`, `02-alimentation--d-fi-2-comparer-duels-i-fast.png`, `02-alimentation--synth-i-fast.png`, `02-alimentation-1024-fast.png`.

**Problèmes constatés**

- **Gravité : important | Axe : lisibilité/pédagogie**  
  Étapes : ouvrir Alimentation, lire les cartes du garde-manger ou interroger les noms accessibles des boutons. Capture : `Audit/evidence-audit-diabete/02-alimentation-empty-fast.png`.  
  Constat : les contrôles exposent des valeurs de charge glycémique (`CG 22`, `CG 14`, etc.) et les sources incluent aussi des chiffres.  
  Impact : l'écran risque de devenir un tableau de valeurs, alors que l'objectif patient est de comprendre des leviers simples.

- **Gravité : important | Axe : ergonomie**  
  Étapes : ouvrir l'état initial à `1440x900`. Capture : `Audit/evidence-audit-diabete/02-alimentation-empty-fast.png`.  
  Constat : beaucoup de contrôles sont visibles en même temps : 5 onglets, 6 familles, une longue liste d'aliments, assiette/courbe.  
  Impact : pour un patient à 1 m, le point d'entrée n'est pas évident; le soignant doit guider fortement.

- **Gravité : mineur | Axe : fonctionnalité**  
  Étapes : ouvrir la synthèse et tenter la fiche. Captures : `02-alimentation--synth-i-fast.png`, première passe `02-alimentation-synthese-fiche.png`.  
  Constat : la fiche existe, mais elle est moins découvrable si le patient/soignant n'arrive pas jusqu'à la synthèse.  
  Impact : la "fiche à emporter" peut être manquée.

**Suggestions concrètes**

Remplacer les chiffres CG par des catégories patient ("impact doux/moyen/rapide") et garder les chiffres uniquement côté sources non patient. Réduire l'état initial : commencer par 4-6 aliments exemples, puis révéler le garde-manger complet à la demande. Mettre la fiche à emporter dans une zone stable en fin de module.

## 3. Activité physique

**Ce qui fonctionne bien**

Les trois temps sont clairs : rayonnement, volume, timing. Le filtre "Activités toniques uniquement" fonctionne, la jauge réagit, et le passage marche post-repas/micro-coupures modifie la courbe. Captures : `03-activite-empty.png`, `03-activite-volume.png`, `03-activite-timing-marche.png`, `03-activite-timing-micro.png`, `03-activite-1024-fast.png`.

**Problèmes constatés**

- **Gravité : important | Axe : accessibilité/ergonomie**  
  Étapes : ouvrir Activité physique, onglet "Timing", choisir "Micro-coupures", cliquer quelques coupures, passer en `1024x768`. Capture : `Audit/evidence-audit-diabete/03-activite-timing-micro.png`.  
  Constat : les six boutons de coupure mesurent `30x30 px`.  
  Impact : cibles trop petites pour écran partagé/tactile; risque de clic raté pendant la consultation.

- **Gravité : mineur | Axe : ergonomie**  
  Étapes : cliquer le noeud "Sucre" dans le rayonnement. Capture : `03-activite-rayonnement.png`.  
  Constat : ce noeud fait aussi avancer automatiquement vers l'onglet Volume.  
  Impact : comportement utile mais surprenant; l'utilisateur peut croire avoir simplement sélectionné un bénéfice.

- **Gravité : mineur | Axe : lisibilité**  
  Étapes : afficher "Timing" à `1024x768`. Capture : `03-activite-1024-fast.png`.  
  Constat : plusieurs libellés de courbe/ticks sont à 13 px.  
  Impact : lisibilité limite à 1 m.

**Suggestions concrètes**

Passer les micro-coupures à au moins `44x44 px` avec libellé plus visible. Rendre le saut depuis "Sucre" explicite ("voir le volume") ou demander un clic distinct. Agrandir les légendes de courbe.

## 4. Risque cardiovasculaire

**Ce qui fonctionne bien**

Le principe des 5 feux et la coupe d'artère rendent la notion de cumul visuelle. Les onglets "leviers / artère / anatomie / fiche" donnent une progression pédagogique. Captures : `04-risque-cardio-empty.png`, `04-risque-cardio-feux-artere.png`, `04-risque-cardio-1024x768.png`.

**Problèmes constatés**

- **Gravité : important | Axe : accessibilité/ergonomie**  
  Étapes : ouvrir le module, état initial. Capture : `Audit/evidence-audit-diabete/04-risque-cardio-empty.png`.  
  Constat : les cinq commandes de feux ont le même nom visible/accessibilité ("Vert").  
  Impact : au clavier ou pour un soignant qui verbalise l'action, on ne sait pas quel facteur est modifié.

- **Gravité : important | Axe : pédagogie**  
  Étapes : activer les feux puis voir la coupe d'artère. Capture : `04-risque-cardio-feux-artere.png`.  
  Constat : l'effet visuel est fort, mais le lien exact entre chaque feu et la plaque peut paraître mécanique/linéaire.  
  Impact : risque d'induire "un bouton = une quantité de bouchon", alors que le message clinique est multifactoriel et progressif.

- **Gravité : mineur | Axe : lisibilité**  
  Étapes : ouvrir à `1024x768`. Capture : `04-risque-cardio-1024x768.png`.  
  Constat : pas de débordement horizontal observé, mais la densité des onglets + légendes est élevée.

**Suggestions concrètes**

Nommer chaque feu dans le bouton ("Tension : vert", "Tabac : vert", etc.). Ajouter une phrase de synthèse qualitative : "moins de feux allumés = artères plus protégées", sans pourcentage. Éviter toute lecture quantitative du diamètre.

## 5. Complications

**Ce qui fonctionne bien**

La silhouette avec zones est adaptée au face-à-face : le patient peut pointer un organe. Le badge "évitable et dépistable" soutient le message de prévention. La fiche pied existe. Captures : `05-complications-empty.png`, `05-complications-silhouette-zones.png`, `05-complications-pied-fiche.png`, `05-complications-1024-fast.png`.

**Problèmes constatés**

- **Gravité : important | Axe : ergonomie/pédagogie**  
  Étapes : ouvrir le module, observer l'état initial. Capture : `Audit/evidence-audit-diabete/05-complications-empty.png`.  
  Constat : certaines zones apparaissent déjà comme "déjà vu" (`Cerveau`, `Cœur`) dans l'état initial.  
  Impact : le patient peut ne pas comprendre ce qui reste à explorer, ni pourquoi certaines zones sont verrouillées/validées.

- **Gravité : mineur | Axe : fonctionnalité**  
  Étapes : cliquer "Pied", ouvrir la fiche. Capture : `05-complications-pied-fiche.png`.  
  Constat : la fiche pied s'ouvre correctement, mais elle dépend d'une action spécifique dans la zone.  
  Impact : utile si guidé; moins découvrable en autonomie.

**Suggestions concrètes**

Clarifier l'état initial avec une légende simple ("déjà abordé dans risque cardio" vs "à explorer"). Rendre la fiche pied disponible aussi via un bouton stable quand la zone pied est active.

## 6. Suivi

**Ce qui fonctionne bien**

Le cadran annuel donne une métaphore pertinente : programmer, voir ce qui protège, produire une fiche calendrier. Le retour à la carte fonctionne. Captures : `06-suivi-empty.png`, `06-suivi-cadran.png`, `06-suivi-cadran-interactions.png`, `06-suivi-1024-fast.png`.

**Problèmes constatés**

- **Gravité : important | Axe : ergonomie/lisibilité**  
  Étapes : ouvrir Suivi à `1024x768`. Capture : `Audit/evidence-audit-diabete/06-suivi-1024-fast.png`.  
  Constat : beaucoup de contrôles sont visibles simultanément : onglets, réinitialiser, flèches, "Placer sur le cadran", boutons "Ce que ... protège", boutons `i`. Plusieurs textes sont à 13 px.  
  Impact : charge cognitive élevée; le patient risque de regarder l'outil plutôt que le message "on surveille pour protéger".

- **Gravité : important | Axe : accessibilité**  
  Étapes : relever les cibles à `1024x768`. Capture : `06-suivi-1024-fast.png`.  
  Constat : les boutons `i` mesurés font environ `110x19 px` : largeur suffisante, hauteur insuffisante.  
  Impact : cible difficile au pointeur et au tactile.

- **Gravité : mineur | Axe : ergonomie**  
  Étapes : utiliser les flèches de fréquence. Capture : `06-suivi-cadran-interactions.png`.  
  Constat : les commandes `‹` / `›` sont compactes et répétées.  
  Impact : risque d'action sur la mauvaise ligne.

**Suggestions concrètes**

Créer un mode "consultation" simplifié : un gros cadran + une seule action principale à la fois. Agrandir les boutons d'information. Regrouper les réglages fins dans un panneau "adapter le calendrier" moins exposé.

## 7. Traitements

**Ce qui fonctionne bien**

La mise en correspondance ordonnance ↔ silhouette sert bien le propos : une ligne de traitement éclaire ce qu'elle protège. Captures : `07-traitements-empty.png`, `07-traitements-correspondance.png`, `07-traitements-1024-fast.png`.

**Problèmes constatés**

- **Gravité : important | Axe : ergonomie/lisibilité**  
  Étapes : ouvrir Traitements à `1024x768`. Capture : `Audit/evidence-audit-diabete/07-traitements-1024-fast.png`.  
  Constat : les sélecteurs "Molécule de la ligne 1/2" sont mesurés à `343x34 px`, sous la hauteur cible de 44 px. Plusieurs lignes d'ordonnance sont à 13 px.  
  Impact : difficile à manipuler à distance; l'ordonnance factice peut devenir trop réaliste et trop dense.

- **Gravité : important | Axe : pédagogie**  
  Étapes : cliquer "Voir l'effet" sur une ligne. Capture : `07-traitements-correspondance.png`.  
  Constat : les boutons "Quoi surveiller" exposent des effets indésirables détaillés dans l'interface principale.  
  Impact : peut détourner la séquence vers les risques du médicament avant d'ancrer le bénéfice/protection.

- **Gravité : mineur | Axe : fonctionnalité**  
  Étapes : ajouter/retirer une ligne. Capture : `07-traitements-empty.png`.  
  Constat : les contrôles fonctionnent, mais la densité augmente vite dès qu'on ajoute des lignes.

**Suggestions concrètes**

Augmenter la hauteur des sélecteurs. Faire de "Quoi surveiller" un second niveau optionnel moins proéminent. Mettre au premier plan le verbe patient : "protège le coeur", "protège les reins", "évite les hypos".

## 8. Hypoglycémie

**Ce qui fonctionne bien**

Les trois temps sont clairs : profil, réflexe 15/15, carte. Les signes sont sélectionnables, la courbe overshoot illustre bien le risque de reprendre trop tôt, et la carte à emporter s'ouvre. Captures : `08-hypoglycemie-empty.png`, `08-hypoglycemie-reconnaitre.png`, `08-hypoglycemie-overshoot.png`, `08-hypoglycemie-carte-fiche.png`, `08-hypoglycemie-1024-fast.png`.

**Problèmes constatés**

- **Gravité : important | Axe : pédagogie/lisibilité**  
  Étapes : ouvrir le module, état "Mon profil hypo". Capture : `Audit/evidence-audit-diabete/08-hypoglycemie-empty.png`.  
  Constat : les options affichent des quantités (`150 ml`, `15 g`) et la règle elle-même expose des chiffres.  
  Impact : utile médicalement, mais contraire à l'invariant "pas de dosages" si l'écran est destiné au patient.

- **Gravité : mineur | Axe : ergonomie**  
  Étapes : activer plusieurs signes puis aller à la carte. Captures : `08-hypoglycemie-reconnaitre.png`, `08-hypoglycemie-carte-fiche.png`.  
  Constat : le module fonctionne, mais la carte dépend du profil renseigné; si on saute directement à la carte, certains champs restent à définir.  
  Impact : à sécuriser en consultation pour ne pas imprimer une carte incomplète.

**Suggestions concrètes**

Garder la règle "15/15" comme nom mnémotechnique, mais remplacer les dosages visibles par des équivalents patient validés ("ma portion de resucrage habituelle") ou les placer dans la fiche/zone soignant. Ajouter un état d'alerte discret avant impression si signes ou resucrage ne sont pas choisis.

## 9. Insuline

**Ce qui fonctionne bien**

La courbe capteur et la notion de temps dans la cible rendent le sujet plus visuel qu'un tableau. Les profils patient modifient la cible et le lien vers Hypoglycémie est pertinent. Captures : `09-insuline-empty.png`, `09-insuline-traces.png`, `09-insuline-1024-fast.png`.

**Problèmes constatés**

- **Gravité : important | Axe : lisibilité/pédagogie**  
  Étapes : ouvrir Insuline. Capture : `Audit/evidence-audit-diabete/09-insuline-empty.png`.  
  Constat : l'interface expose des pourcentages TIR et des segments ("nuit / à jeun", "bosses post-repas"). Les libellés de courbe sont à 13 px à `1024x768`.  
  Impact : le patient peut se focaliser sur des chiffres et zones techniques plutôt que sur la décision simple attendue.

- **Gravité : mineur | Axe : ergonomie**  
  Étapes : passer entre "Zone-cible", "Lire la courbe", "Décider". Capture : `09-insuline-traces.png`.  
  Constat : les interactions fonctionnent, mais les boutons de profil portent de longues phrases.  
  Impact : moins scannable à distance; le soignant doit lire à voix haute.

**Suggestions concrètes**

Traduire le TIR en message visuel qualitatif ("plus de temps dans la zone verte") et réserver les pourcentages aux sources/fiche soignant. Raccourcir les profils en deux libellés forts, avec détail au second niveau.

## Constats transverses

- **Navigation globale** : la sélection Diabète fonctionne; le retour à la carte fonctionne sur les modules testés via le bouton d'en-tête "Accueil". Le terme "Accueil" est moins clair qu'un vrai "Retour aux modules" dans un contexte module.
- **Cohérence inter-modules** : les onglets numérotés sont cohérents et aident le soignant. En revanche, certains modules sont très guidés (Hypoglycémie), d'autres très denses/configurables (Suivi, Traitements), ce qui crée une variation d'effort.
- **Accessibilité de base** : la plupart des contrôles sont des boutons réels et focusables. Problèmes mesurés : micro-coupures `30x30`, boutons info de Suivi trop bas, sélecteurs Traitements à `34 px` de haut, libellés dupliqués "Vert".
- **Responsive** : pas de débordement horizontal relevé à `1024x768`. La lisibilité baisse par densité et petits textes, pas par casse de layout.
- **Fonctionnalité** : aucune requête échouée. Les fiches testées s'ouvrent en overlay (`Alimentation`, `Complications`, `Hypoglycémie`; Risque/Suivi selon onglets). L'impression n'a pas été déclenchée pour éviter d'ouvrir le dialogue système.
- **Pédagogie visuelle** : les meilleurs écrans sont ceux où un seul geste produit un effet visuel clair (Mécanisme, Activité timing, Hypoglycémie overshoot). Les écrans les moins efficaces à 1 m sont ceux qui ressemblent à des panneaux de configuration (Suivi, Traitements).

## Tableau de synthèse

| Problème | Module | Axe | Gravité |
|---|---|---|---|
| Chiffres/dosages/valeurs brutes exposés (`CG`, `mg/dL`, `15 g`, `150 ml`, `%`) | Alimentation, Activité, Hypoglycémie, Insuline, Sources | Lisibilité / pédagogie | Important |
| Animation non pilotable en vrais temps pédagogiques | C'est quoi le diabète | Pédagogie / ergonomie | Important |
| Cibles micro-coupures à `30x30 px` | Activité physique | Accessibilité / ergonomie | Important |
| Cinq boutons nommés "Vert" | Risque cardiovasculaire | Accessibilité / ergonomie | Important |
| Densité forte et boutons info trop bas | Suivi | Lisibilité / accessibilité | Important |
| Sélecteurs ordonnance à `34 px` de haut | Traitements | Accessibilité / ergonomie | Important |
| Zones déjà vues dès l'état initial | Complications | Ergonomie / pédagogie | Important |
| Dosages visibles dans les choix de resucrage | Hypoglycémie | Pédagogie / lisibilité | Important |
| Pourcentages TIR et libellés techniques dominants | Insuline | Pédagogie / lisibilité | Important |
| Petits textes 12-13 px sur plusieurs écrans | Plusieurs modules | Lisibilité | Mineur |
| Libellé "Accueil" au lieu de "Retour aux modules" | Transverse | Ergonomie | Mineur |
| Warnings preload police | Transverse | Fonctionnalité technique | Mineur |
