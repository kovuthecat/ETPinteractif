# ETP interactif — description des modules (pour génération de maquettes)

Ce document décrit l'état fonctionnel et pédagogique actuel de l'app, pour servir de brief à un outil de
design (maquettes visuelles). Il ne décrit pas le code, mais ce que l'utilisateur voit et fait à l'écran.

Contexte d'usage : outil de **support de consultation ETP** (éducation thérapeutique du patient), utilisé par
un soignant **avec** un patient, sur écran partagé (tablette/PC), thème actuel = **sevrage tabagique**. Aucune
donnée n'est enregistrée. Le style attendu est sobre, lisible à ~1 m, non infantilisant, non culpabilisant.

---

## 1. Structure générale de l'app

**Écran d'accueil (`Home`)** : une grille de 7 cartes-modules, cliquables, regroupées en **3 familles** avec
un intertitre discret pour chacune :

- **Comprendre** : Les composantes de l'addiction · La nicotine : cinétique & seuils · La nicotine n'est pas
  le toxique · Le piège du soulagement
- **Agir** : Utilisation des substituts & titration du patch · Gérer le craving (4D)
- **Se motiver** : Explorer ma motivation

Chaque carte affiche : une icône (Lucide — cerveau, activité, balance, répétition, pilule, vagues, boussole),
un titre, un résumé d'une phrase. Pas de hiérarchie imposée entre modules : navigation libre, non linéaire.

**Coquille de module (`ModuleShell`)**, commune à tous les modules : un en-tête avec bouton retour (vers
l'accueil), le titre du module, et un bouton discret « Sources » (icône + libellé) qui ouvre un pop-over
listant les références. Sous l'en-tête : la zone de contenu propre au module (tout le reste de ce document).

Aucune barre de navigation persistante au-delà de ce header ; pas d'étapes numérotées ni de progression —
chaque module est une session de manipulation libre, sans début/fin imposés.

---

## 2. Modules — famille « Comprendre »

### 2.1 Les composantes de l'addiction

**Objectif pédagogique** : faire comprendre que l'addiction au tabac a 3 dimensions imbriquées (physique,
psychologique, comportementale), chacune avec ses propres leviers d'action — sert de **carte d'orientation**
vers les autres modules, pas un contenu en soi.

**Ce que voit/fait l'utilisateur (état actuel)** :
- Un diagramme de Venn à 3 cercles qui se chevauchent (grand, occupe la majorité de l'écran, lisible à
  distance) : **Physique**, **Psychologique**, **Comportementale**, libellés lisibles avec halo pour rester
  net sur le chevauchement.
- Clic sur un cercle → il se distingue (contour/opacité/léger agrandissement) et un panneau apparaît sous le
  diagramme (en flux, jamais en superposition) avec 2 onglets : *« De quoi parle-t-on ? »* (exemples courts :
  ex. manque, irritabilité pour le physique) puis *« Outils / stratégies »* (2 conseils courts par pilier +
  renvois vers les modules Substituts / Nicotine / Craving).
- Les 3 cercles restent visibles et cliquables en permanence (pas de vue exclusive).

**État** : fonctionnel, contenu validé. Reste en attente : enrichir la liste d'outils/stratégies au-delà des
2 items actuels par pilier (non bloquant).

---

### 2.2 La nicotine : cinétique & seuils

**Objectif pédagogique** : visualiser pourquoi on fume « pour ne pas être en manque », et comment les
substituts nicotiniques maintiennent le taux de nicotine dans une zone confortable au lieu de l'effet
yo-yo de la cigarette.

**Ce que voit/fait l'utilisateur (état actuel)** :
- Un **graphique en courbe** (axe X = temps, axe Y = « nicotinémie », **volontairement sans unité ni
  chiffre**, mention « schéma illustratif »). Deux bandes horizontales repères : **seuil de manque** (en
  dessous → craving) et **seuil de tolérance/inconfort** (au-dessus) ; la bande entre les deux = « zone
  confortable ».
- Une **frise temporelle statique** en dessous/à côté du graphique, avec des **pictogrammes de gestes**
  (cigarette, patch, substitut ponctuel, vapoteuse) que l'utilisateur **dépose par glisser-déposer** sur la
  frise, au moment de son choix ; un clic/clavier simple fonctionne aussi en repli.
- Chaque dépôt fait apparaître **immédiatement** le tronçon de courbe correspondant, colorée/segmentée selon
  la zone (manque / confort / inconfort) ; les courbes de plusieurs prises se cumulent visuellement sur la
  frise complète.
- Un chip **« Pic atteint »** résume la zone la plus haute atteinte. Une liste texte sous le graphe récapitule
  les prises déposées (avec bouton de suppression par prise, en plus de la croix sur le pictogramme).
- Bouton « Réinitialiser » (secondaire/tertiaire, pas mis en avant).

**État** : fonctionnel, contenu et courbes validés (modèle pédagogique, non pharmacocinétique réel).

---

### 2.3 La nicotine n'est pas le toxique

**Objectif pédagogique** : lever le frein n°1 à l'usage des substituts/vapoteuse — l'idée fausse
« je remplace une drogue par une autre » — en séparant clairement ce qui **rend malade** (la combustion) de
ce qui **crée la dépendance** (la nicotine).

**Ce que voit/fait l'utilisateur (état actuel)** :
- Une **scène illustrée (SVG)** avec plusieurs **points cliquables (hotspots)** représentant les composants
  (goudrons, monoxyde de carbone, particules fines, nicotine, etc.).
- Une **bascule à deux états** : *« Ce qui rend malade »* / *« Ce qui crée la dépendance »* — bascule
  l'emphase visuelle : le groupe actif reste net, l'autre groupe s'atténue (opacité réduite) sans disparaître
  complètement.
- Double encodage non-couleur : icônes (⚠️ danger / 🧠 dépendance) + libellés de rôle en gras, pour rester
  lisible même sans distinguer les couleurs.
- Clic sur un composant → pop-over/étiquette ancrée près du point cliqué avec le détail (rôle, effet), pas
  dans un coin fixe de l'écran.
- Légende regroupant couleur → symptôme/rôle → stratégie.

**État** : fonctionnel. Contenu médical affiché mais formulations à valider finement par Thibault (nuance
« la nicotine n'est pas anodine mais n'est pas ce qui tue »).

---

### 2.4 Le piège du soulagement

**Objectif pédagogique** : déconstruire l'idée que la cigarette procure du plaisir — en réalité elle soulage
surtout le manque qu'elle a elle-même créé (effet yo-yo). Ton **non culpabilisant**.

**Ce que voit/fait l'utilisateur (état actuel)** :
- Réutilise la même mécanique visuelle que le module Nicotine (frise statique + dépôt de « Fumer une
  cigarette » par clic/drag) mais avec une **deuxième courbe superposée** : la « tension liée au manque »
  (renommé depuis « stress » pour un ton plus neutre), qui chute au moment précis de la prise puis remonte
  progressivement.
- Bouton unique **« Comparer au non-fumeur »** : superpose une ligne de repère horizontale représentant un
  non-fumeur (jamais en tension), toujours au-dessus du creux le plus bas atteint par le fumeur — pour
  montrer visuellement que le fumeur ne fait que revenir à un niveau que le non-fumeur a en permanence.
- Une consigne de lecture « en 2 temps » encadrée (bloc de vigilance visuel) explique comment lire le
  graphique. Annotation sur le graphique du délai entre la chute et la remontée de tension.

**État** : fonctionnel. Récit chiffré illustratif encore à valider par Thibault (non bloquant).

---

## 3. Modules — famille « Agir »

### 3.1 Utilisation des substituts & titration du patch

**Objectif pédagogique** : donner les bonnes pratiques par forme de substitut, et démystifier le dosage — le
sous-dosage étant une cause fréquente d'échec — en **autonomisant** la personne (pas de calcul de dose,
écoute du ressenti).

**Ce que voit/fait l'utilisateur (état actuel)** :

*Partie A — bonnes pratiques par forme* :
- 7 **cartes cliquables** avec icône, une par forme : patch (24h/16h), gomme, pastille, comprimé sublingual,
  spray buccal, inhaleur, vapoteuse. Cible tactile large (≥ 44 px), couleur d'état actif par carte.
- Sélection d'une carte → affiche « bonnes pratiques » et « erreurs fréquentes » pour cette forme. Contenu
  rédigé et validé pour 5 formes (patch, gomme, pastille, comprimé, spray) ; inhaleur et vapoteuse affichent
  un repli **« Fiche en cours de rédaction — à voir avec votre soignant »** (contenu manquant, assumé comme
  tel plutôt qu'inventé).

*Partie B — méthode de titration du patch (illustration de la méthode, pas un calculateur)* :
- Un **patch représenté en quarts** (visuel de fractions, pas de dose chiffrée).
- Deux **interrupteurs/retours utilisateur** : « l'envie de fumer persiste » et « signes de surdosage ».
- Bouton **« + ¼ (tous les 3 jours) »**, actif seulement si envie persiste et pas de surdosage ; une aide
  contextuelle explique la condition.
- En cas de surdosage : **bannière d'alerte rouge explicite** (pas un simple bouton grisé) invitant à revenir
  à la dose précédente, avec les signes listés (nausées, écœurement, céphalées, palpitations, rêves intenses).
- Bloc **Jour / Nuit** : deux patchs représentés côte à côte, possibilité de dose de nuit plus faible si
  troubles du sommeil.
- Message permanent : « expérimentez, fiez-vous à votre ressenti ».

**État** : fonctionnel pour 5/7 formes ; titration complète et validée. Reste : contenu inhaleur + vapoteuse,
sources exactes.

---

### 3.2 Gérer le craving (4D)

**Objectif pédagogique** : montrer que l'envie de fumer est une **vague qui monte puis retombe** en quelques
minutes, et donner 4 techniques immédiates à mobiliser pendant cette vague.

**Ce que voit/fait l'utilisateur (état actuel)** :
- Une **courbe en cloche** représentant « la vague de l'envie ». Bouton **« Une envie arrive »** → un repère
  parcourt la vague en ~30 secondes (compression du temps réel de quelques minutes), avec des états affichés
  en direct : *ça monte → pic → ça redescend → c'est passé*. Rejouable (« replay »).
- La courbe a une aire dégradée sous la courbe, un marqueur « maintenant » avec halo, un repère pointillé sur
  le pic, un axe de temps discret — traitement visuellement riche pour cette vague, qui est le cœur du module.
- **4 cartes cliquables** (les « 4 D »), positionnées de façon à rester ancrées au-dessus de la zone du pic de
  la courbe, jamais en superposition qui masquerait le graphique :
  - **Différer** : attendre que la vague passe (3 états : idle / en cours / passée — le message « c'est
    passé » n'apparaît que si la vague s'est réellement terminée pendant que l'outil était actif).
  - **Distraire** : occuper les mains et l'esprit.
  - **Décontracter** : mini-**animation de respiration** (cercle qui pulse, inspire 4 s / expire 6 s, en
    boucle tant qu'activé).
  - **De l'eau** : boire un grand verre d'eau lentement.
  - Un aparté discret : ligne d'écoute Tabac Info Service **39 89**.
- Quand plusieurs des 4 outils sont actifs simultanément, la courbe s'atténue graduellement en opacité (au
  lieu d'un état binaire) pour suggérer que combiner les techniques aide encore plus.

**État** : fonctionnel, contenu validé.

---

## 4. Module — famille « Se motiver »

### 4.1 Explorer ma motivation

**Objectif pédagogique** : module centré sur le **positif** (délibérément **sans balance décisionnelle**
avantages/inconvénients, jugée culpabilisante) — aider la personne à faire le point sur ses raisons
d'arrêter, à son rythme, ton non injonctif.

**Ce que voit/fait l'utilisateur (état actuel)** :
- Deux sections dans le module, présentées comme des **onglets** (« Où en êtes-vous ? » / « Mes raisons »),
  navigables à la souris ou au clavier (flèches gauche/droite) ; les deux restent montées en mémoire (aucune
  perte d'état en changeant d'onglet).

*Onglet « Où en êtes-vous ? »* :
- Deux **curseurs 0–10** : « À quel point est-ce important pour vous d'arrêter ? » et « À quel point vous
  sentez-vous capable / confiant(e) ? ». Piste et pouce de curseur épaissis pour la manipulation tactile,
  bornes 0 et 10 affichées.
- Sous chaque valeur, une **relance non culpabilisante** de type entretien motivationnel : « Pourquoi pas
  *[valeur − 1]* plutôt que *[valeur]* ? » et « Qu'est-ce qui aiderait à passer à *[valeur + 1]* ? » — fait
  verbaliser les propres raisons du patient plutôt que d'imposer un jugement.

*Onglet « Mes raisons »* :
- Un **tableau blanc** (zone large, ~40-70 % de la hauteur d'écran) où l'utilisateur peut **placer des
  cartes-raisons** librement (glisser-déposer natif + flèches clavier pour ajuster la position), les éditer
  (champ raison + détail personnel optionnel), et en créer de nouvelles via un bouton « + une raison ».
- Une **réserve** de cartes (bac en dehors du tableau) contient au départ 6 cartes-raisons courantes (santé,
  argent économisé, goût/odorat, souffle/forme physique, proches, liberté de ne plus dépendre) ; l'utilisateur
  les fait glisser vers le tableau pour les activer, ou les retire en les ramenant/en appuyant sur
  Suppr/Backspace.

**État** : fonctionnel. Contenu de départ (libellés des 2 échelles + les 6 cartes seed) est une **proposition
non encore validée** par Thibault — à traiter comme provisoire dans les maquettes.

---

## 5. Contraintes transverses pour les maquettes

- **Aucune donnée chiffrée réelle** dans les modules Nicotine/Soulagement (axes sans unité, mention « schéma
  illustratif ») ni de dosage en mg nulle part (Substituts) — rester qualitatif/relatif dans les visuels.
- **Lisibilité à ~1 m** : texte et éléments cliquables larges, contraste fort, pas de détails fins nécessitant
  une lecture rapprochée.
- **Cibles tactiles ≥ 44 px**, cohérent avec un usage tablette en consultation.
- **Ton non culpabilisant et non injonctif** partout, particulièrement Soulagement et Motivation.
- **Pas de persistance visible** : aucun élément d'interface ne doit suggérer une sauvegarde, un compte, un
  historique entre sessions.
- **Sources** : toujours accessibles mais discrètes (icône + pop-over dans le header), jamais intrusives.
- Palette actuelle : tokens sémantiques (confort / toxique / vigilance / navigation) définis dans
  `src/styles/tokens.css` — à respecter ou faire évoluer consciemment, pas à ignorer.
