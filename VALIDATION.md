# VALIDATION.md — checklist visuelle / UX (passe humaine)

> Validation **visuelle** déléguée à Thibault, **non bloquante** pour les commits.
> Claude consigne ici (ne tente pas de vérifier lui-même : pas de navigateur).
> Dérouler en une session : `npm run dev`, puis cocher.
>
> Légende statut : [ ] à valider · [x] OK · [!] à corriger (décrire dessous).
> Rappel cadre : lisible à ~1 m, sobre, interactif (≠ diaporama).

## T2 — Types, registre, navigation
- [ ] Liste cliquable des 6 modules s'affiche.
- [ ] Chaque entrée ouvre son stub « À venir ».
- [ ] Retour à l'accueil possible depuis un module.

## T3 — Coquille / sources / carte
- [ ] (Vérifié indirectement en T4 — composants consommés par la carte.)

## T4 — Carte centrale (accueil)
- [ ] Grille de 6 cartes lisibles (icône + titre + résumé).
- [ ] Clic sur une carte ouvre le module.
- [ ] Retour fonctionne.
- [ ] Titre de page sobre (« Sevrage tabagique »).

## T6 — Module 2 : nicotine (bac à sable)
- [ ] Chaque bouton (cigarette / substitut ponctuel / vapoteuse) modifie la courbe en direct.
- [ ] Toggle « Patch » visible et actif.
- [ ] 2 seuils (LOW, HIGH) visibles + bande « zone confortable ».
- [ ] « Réinitialiser » remet à zéro.
- [ ] Mention « schéma illustratif » présente.

## V3 — Nicotine : cumul sur axe fixe (2026-07-01)
- [ ] Plus de curseur bleu ni de défilement automatique (courbe grisée fantôme supprimée).
- [ ] 1 clic « Fumer une cigarette » seule = une bosse qui monte au milieu de la zone verte
      (confort) puis redescend et se fige.
- [ ] Enchaîner plusieurs cigarettes rapprochées fait grimper la courbe dans la zone rouge du
      haut (surdosage).
- [ ] Patch + cigarettes rapprochées : même constat de surdosage.
- [ ] Couleurs de zone (bande + trait) cohérentes sur toute la courbe cumulée.
- [ ] « Réinitialiser » vide bien tous les événements (courbe et pictogrammes disparaissent).

## T7 — Module 5 : le piège du soulagement
- [ ] Bascule « Non-fumeur / Fumeur » change la courbe.
- [ ] Non-fumeur = ligne plate calme ; Fumeur = yo-yo sous LOW.
- [ ] Message change avec la bascule (ton non culpabilisant).

## T8 — Module 1 : composantes de l'addiction
- [ ] 3 piliers (Physique / Psychologique / Comportementale) sélectionnables.
- [ ] 2 onglets par pilier (« De quoi parle-t-on ? » / « Outils »).
- [ ] Boutons de renvoi (`onNavigate`) ouvrent le bon module.

## T9 — Module 3 : substituts & titration
- [ ] Sélecteur des 7 formes ; panneaux « Bonnes pratiques » / « Erreurs fréquentes ».
- [ ] Partie B : patch en 4 quarts ; ajout/retrait de quart cohérent avec les toggles.
- [ ] Toggle Jour/Nuit (nuit ≤ jour).
- [ ] Message permanent « expérimentez, fiez-vous à votre ressenti ».
- [ ] Aucun dosage chiffré affiché.

## T10 — Module 4 : la nicotine n'est pas le toxique
- [ ] Deux colonnes (fumée vs nicotine).
- [ ] Bascule « dépendance » / « rend malade » met en évidence le bon groupe.
- [ ] Clic sur un item montre son rôle ; renvois fonctionnent.

## T11 — Module 6 : gérer le craving (4D)
- [ ] « La vague de l'envie » : repère parcourt la cloche en ~30 s ; états ça monte → pic → redescend → passé.
- [ ] Bouton replay ; pas de fuite après navigation (timer nettoyé).
- [ ] 4 cartes D dépliables ; « Décontracter » anime la respiration (inspire 4 s / expire 6 s).
- [ ] Aparté « Tabac Info Service 39 89 » discret.

## C1 — Tokens sémantiques + utilitaires d'accessibilité
- [ ] Fond d'écran plus chaud (`--color-bg`) sur l'accueil et les 6 modules, rien de cassé visuellement.
- [ ] Boutons et contrôles plus hauts (cible tactile ≥ 44 px) sans rupture de mise en page.
- [ ] Aucun module n'utilise encore la nouvelle palette sémantique (confort/toxique/vigilance/nav) : normal, c'est prévu en C2-C9.
- [ ] Rien à vérifier sur `.activeDoubled` (pas encore consommée par un composant) ni sur `prefers-reduced-motion` (pas encore d'animation dans l'app à ce stade).

## C2 — Substituts : titration illimitée + patchs en grille 2×2
- [ ] On atteint 2, 3, 4+ patchs avec « + ¼ » (plus aucun blocage à 4/4) ; chaque patch dessiné en grille **2×2** (4 petits carrés), pas une barre découpée en 4 bandes verticales.
- [ ] Exemple à vérifier : amener à 9 quarts → on voit 2 patchs pleins + 1 case remplie sur un 3ᵉ patch ; le libellé affiche **« 2 patchs + 1/4 (9 quarts) »** simultanément.
- [ ] « + ¼ (à J+2-3) » (vert) reste désactivé si « envie persiste » est décoché ou si « signes de surdosage » est coché.
- [ ] Nouveau bouton **« − ¼ »** (neutre, contour bleu) toujours cliquable hors surdosage, jusqu'à 0 quart (désactivé à 0).
- [ ] « Signes de surdosage → revenir en arrière » (rouge) reste désactivé hors surdosage ou à 0 quart.
- [ ] Toggle Jour/Nuit : le bloc nuit reste clampé ≤ dose de jour et s'affiche aussi en multi-patchs 2×2.
- [ ] Message « Expérimentez, fiez-vous à votre ressenti » toujours présent ; aucun dosage chiffré affiché.

## C4 — Soulagement : graphe stress + nicotine *(récit proposé, à valider par Thibault)*
- [ ] **Écran non-fumeur** : une seule ligne (verte, pleine) « Stress basal (stable) », **aucune courbe ni mention de nicotine**.
- [ ] **Écran fumeur** : courbe nicotine en **pointillé gris discret** (« Nicotine (repère, pointillé) ») + courbe stress en **trait plein ambre** (« Stress (trait plein) ») qui monte quand la nicotine redescend et **chute brièvement** juste après chaque cigarette.
- [ ] Annotation italique « soulagement du manque » visible au niveau d'un creux de la courbe de stress (vers le milieu du graphe).
- [ ] Bouton **« Comparer au non-fumeur »** (visible seulement en mode Fumeur) superpose un repère pointillé vert horizontal stable ; visuellement, la courbe de stress du fumeur reste **majoritairement au-dessus** de ce repère.
- [ ] Message sous le graphe change avec la bascule (ton non culpabilisant conservé).
- [ ] Mention « schéma illustratif » présente.
- **Question d'arbitrage (cf. PLAN §C4, « Si bloqué ») :** le récit chiffré codé est une proposition plausible, pas une donnée clinique :
  - stress basal non-fumeur = 0,25 (échelle relative 0–1) ;
  - stress basal fumeur juste après une cigarette (soulagement) = 0,30 (légèrement au-dessus du non-fumeur) ;
  - amplitude de manque = 0,35 → plafond de tension du fumeur sans cigarette récente ≈ 0,65.
  La chute de stress est synchronisée exactement avec le pic de nicotine (même cinétique que `cigaretteKernel`). **À valider/ajuster par Thibault** : ces amplitudes relatives correspondent-elles au message pédagogique voulu, ou faut-il un creux plus marqué / un plafond plus bas ?

## C5 — Craving : les 4D agissant sur la vague
- [ ] Sous « Les 4 D », les 4 boutons (Différer / Distraire / Décontracter / De l'eau) sont des **bascules** (`aria-pressed`) : cliquer en active plusieurs **simultanément**, sans ouvrir de texte en dessous.
- [ ] Dès qu'au moins un outil est actif, une ou plusieurs **carte(s) superposée(s)** apparaissent **sur le graphe**, ancrées autour de la zone du pic (≈30 % de la largeur), tandis que la vague (courbe + repère) continue de se dessiner/avancer derrière.
- [ ] « Distraire » actif : la courbe sous-jacente s'**atténue visuellement** (opacité réduite) pendant que la carte reste lisible au-dessus.
- [ ] « Différer » actif : la carte affiche un **compte à rebours en secondes** qui décroît au fil de la vague (lancer « Une envie arrive » et observer la valeur descendre, jusqu'à « C'est passé »).
- [ ] « Décontracter » actif : le cercle de respiration (inspire/expire) apparaît **dans la carte superposée** (plus dans une liste sous le graphe) ; bouton Démarrer/Arrêter fonctionne comme avant.
- [ ] « De l'eau » actif : mini-séquence cliquable « Une gorgée » (1/3 → 2/3 → 3/3 → « C'est fait, bien joué » → « Recommencer »).
- [ ] Nouveau bouton **« Passer 30 s »** (icône avance rapide) : clique → la vague saute directement à l'état final (« C'est passé »), sans attendre l'animation ; désactivé une fois déjà à la fin.
- [ ] Tous les boutons (4D, Passer 30 s, Une envie arrive/Rejouer) restent confortables au doigt (cible ≥ 44 px).
- [ ] Avec « Réduire les animations » activé au niveau OS/navigateur : l'icône « Distraire » et le cercle « Décontracter » ne pulsent plus (figés), le reste du comportement (compte à rebours, gorgées, passer 30 s) est inchangé.

## C6 — Addiction : trois cercles qui se chevauchent
- [ ] **Critère d'acceptation (audit) :** sans lire le détail, on identifie les 3 dimensions (Physique, Psychologique, Comportementale) et on comprend qu'elles se combinent — un message « Ces dimensions s'alimentent entre elles » est visible au centre du diagramme.
- [ ] Les 3 cercles **se chevauchent** (pas concentriques), chacun coloré (ambre/bleu/vert) et **étiqueté** (le libellé reste lisible, pas seulement la couleur) ; quelques mots-clés visibles au repos sous chaque libellé.
- [ ] Cliquer un cercle : il s'agrandit légèrement et passe au-dessus des autres (contour plus épais + ombre) ; ses exemples (§Module 1, liste inchangée) apparaissent en **bulles** dans le coin du diagramme associé (physique → haut-gauche, psychologique → haut-droite, comportementale → bas-centre).
- [ ] Sous le diagramme, un panneau « Outils & stratégies — {pilier} » apparaît avec une **bande de couleur** reprenant la couleur du cercle sélectionné ; les boutons de renvoi (`onNavigate`) portent la mention **« autre module »** (avec icône flèche) pour signaler le changement de module.
- [ ] Cliquer à nouveau le même cercle le désélectionne (retour à l'état de repos, 3 cercles).
- [ ] Aucun contenu (libellés, exemples, outils) n'a changé par rapport à l'ancienne version à onglets — seule la présentation a changé.
- [ ] Cibles tactiles (cercles et boutons) confortables au doigt/tablette.

## C3 — Nicotine : timeline animée + coloration par zone
- [ ] Cliquer sur « Fumer une cigarette » / « Substitut ponctuel » / « Vapoteuse » / « Poser un patch » ajoute un pictogramme sur l'axe du temps, à la position du curseur « maintenant » (pas à un créneau fixe).
- [ ] « Lecture » fait avancer le curseur de gauche à droite ; la courbe déjà parcourue se colore en **vert** dans la zone confortable et en **rouge** sous le seuil de manque ou au-dessus du seuil de tolérance ; le reste de la courbe (futur) reste fin et discret.
- [ ] Le libellé « État actuel : Manque / Confort / Trop haut » au-dessus du graphe change en cohérence avec la couleur de la courbe au niveau du curseur (texte toujours présent, jamais la couleur seule).
- [ ] « Pause » arrête le curseur sans le remettre à zéro ; « Lecture » reprend depuis la position figée. Bouton « Vitesse ×1/×2/×4 » change la vitesse de défilement.
- [ ] « Réinitialiser » remet le curseur à 0, efface les prises et la courbe.
- [ ] Mention « schéma illustratif » toujours présente ; aucune valeur chiffrée de dosage.
- [ ] Avec « Réduire les animations » activé au niveau OS/navigateur : pas de défilement animé, la courbe complète s'affiche directement et les boutons de lecture/vitesse disparaissent (seul « Réinitialiser » reste, avec les boutons de prise).

## C7 - Nicotine vs toxique : affiche interactive recomposée *(contenu à valider par Thibault)*
- [ ] Sans ouvrir de bulle, on comprend « rouge = toxiques de la combustion » et « vert = nicotine / dépendance ».
- [ ] Cigarette et fumée au centre ; quatre hotspots rouges reliés à la combustion ; nicotine isolée dans une zone verte.
- [ ] La couleur est doublée par hachures, icônes, contours et libellés.
- [ ] Chaque hotspot ouvre une bulle lisible avec famille, effet et pictogramme ; la croix la ferme.
- [ ] Sur tablette/mobile, la bulle ne recouvre pas les hotspots et il n'y a aucun débordement horizontal.
- [ ] Les filtres atténuent l'autre groupe sans le masquer ; recliquer le filtre actif restaure la vue complète.
- [ ] Les deux renvois ouvrent les bons modules.
- [ ] **Validation médicale :** confirmer les regroupements « Goudrons et particules », « Monoxyde de carbone », « environ 70 cancérogènes connus » et « environ 7 000 substances chimiques ».
- [ ] **Validation médicale :** confirmer la formulation nicotine : elle crée la dépendance, n'est pas anodine, mais ne provoque pas les cancers et maladies liés à la fumée.

## C8 — Historique de navigation éphémère

- [ ] Accueil → Composantes → Substituts : clic retour revient à Composantes (pas à l'accueil).
- [ ] Composantes → Substituts → {autre module} : clic retour chaîne correctement au travers de la pile.
- [ ] Retour depuis le dernier module ramène à l'accueil (pile à hauteur 1).
- [ ] Rechargement de la page remet à l'accueil (historique éphémère, pas de persistance).

## C9 — Accueil plus pédagogique

- [ ] Grille 3×2 centrée (non qui occupait moins de la moitié de la hauteur disponible).
- [ ] Accroche « Que voulez-vous explorer ? » présente sous le titre.
- [ ] Les 6 cartes sont lisibles à ~1 m (résumés en taille 16–18 px, icônes claires).
- [ ] Responsive (2×3 sur mobile 768 px, puis 1 colonne sur mobile étroit).

## R1 — Débordement systémique : zone de contenu et graphiques SVG bornés

- [ ] Sur écran large (≥1800 px), aucun module (Nicotine, Soulagement, Craving, Addiction, Nicotine/toxique) ne dépasse le cadre visible ; le contenu tient dans une colonne centrée (~960 px).
- [ ] Les graphiques SVG (courbes Nicotine/Soulagement/Craving, Venn Addiction) restent centrés, lisibles, sans étirement disproportionné ni déformation du tracé.
- [ ] M5 (Nicotine, vue non-fumeur) : le titre n'est plus repoussé tout en bas par un grand espace vide.
- [ ] Nicotine/toxique : la scène (illustration cigarette/fumée) tient dans la largeur de contenu bornée, sans régression des positions de hotspots.

## R2 — Nicotine-toxique : étiquettes alignées + pop-up ancré

> Refonte : les 4 hotspots toxiques + la position « nicotine » sont désormais définis par un point unique
> (coordonnées viewBox) qui sert à la fois au tracé du trait pointillé, au placement de l'étiquette et à
> l'ancrage du pop-up. La scène (`.scene`) suit maintenant le ratio du viewBox (`aspect-ratio: 1000/620`),
> ce qui supprime le besoin de repositionner les hotspots par media query (root cause du décalage : le SVG
> se redimensionnait en lettrboxing sans que les étiquettes HTML suivent).

- [ ] Chaque étiquette (« Goudrons et particules », « Monoxyde de carbone », « Cancérogènes », « Mélange chimique ») touche bien l'extrémité de sa ligne pointillée, à toutes les tailles d'écran (large, tablette, mobile).
- [ ] Cliquer « Goudrons et particules » (haut-gauche) ouvre le pop-up **près du point cliqué** (à droite/en dessous), pas en bas à droite de la scène.
- [ ] Cliquer « Cancérogènes » ou « Mélange chimique » (à droite du cadre) ouvre le pop-up qui s'anchore à gauche du point (jamais hors cadre à droite).
- [ ] Sous 900 px (tablette/mobile), le pop-up devient un bandeau ancré en bas de la scène : il ne recouvre aucun hotspot et ne déborde jamais horizontalement.
- [ ] Redimensionner la fenêtre ne désynchronise plus jamais trait / étiquette / pop-up (positions dérivées d'une seule source).
- [ ] Aucune régression : filtres toxiques/dépendance, fermeture du pop-up (croix), renvois vers Substituts/Nicotine.

## R3 — Craving : cartes 4D bornées au cadre

> Root cause : `.overlayZone` était en position absolue avec un `max-width: 75%` mais **sans borne de hauteur** ;
> avec plusieurs cartes actives, `flex-wrap` empilait les lignes et le bloc débordait vers le bas du `graphWrap`
> (et donc de l'écran, cf. R1). Fix : la zone superposée est maintenant bornée par `inset` + `max-height: 88%` +
> `overflow: auto` **tant qu'il y a ≤ 1 outil actif** ; dès que **2 outils ou plus** sont actifs, les cartes basculent
> automatiquement **sous le graphe** dans une grille responsive (`repeat(auto-fit, minmax(200px,1fr))`), le marqueur
> et la courbe restant visibles sur le graphe dans les deux cas.

- [ ] Activer 1 seul outil (ex. « Différer ») : la carte reste **superposée sur le graphe**, ancrée en haut de la zone du pic, sans dépasser le cadre du graphique.
- [ ] Activer les **4 outils en même temps** : les cartes basculent **sous le graphe** en grille (2 colonnes environ sur écran large, empilées sur mobile) ; rien ne sort de l'écran, pas de scroll horizontal.
- [ ] Repasser de 2+ outils à 1 seul (désactiver 3 outils) : la carte restante revient bien **superposée sur le graphe** (pas coincée sous le graphe).
- [ ] Dans les deux modes (superposé / grille), la vague (courbe + repère) continue de se dessiner/avancer visiblement.
- [ ] Comportement des widgets inchangé : compte à rebours « Différer », pulsation « Distraire » (respecte `prefers-reduced-motion`), cercle de respiration « Décontracter », séquence de gorgées « De l'eau ».
- [ ] Cibles tactiles (cartes, boutons internes) toujours confortables (≥ 44 px) dans les deux modes d'affichage.

## R4 — Nicotine : cinétique temps réel au clic + refonte visuelle

> Le modèle « lecture différée jusqu'à Lecture » est supprimé : le temps avance désormais tout seul en boucle
> continue dès l'ouverture du module (façon balayage d'oscilloscope), sans dépendre d'un clic sur un bouton
> Lecture. Un clic sur un geste (cigarette/substitut/vapoteuse/patch) insère la prise **au temps courant** du
> balayage et sa cinétique se dessine immédiatement. Pause/Vitesse sont conservés en contrôles secondaires
> (discrets, sous forme de boutons contour) ; le geste (primaire, rempli) reste l'action principale. Le
> balayage boucle en continu tant qu'il n'est pas mis en pause (root cause de l'ancien blocage : `now`
> restait figé à 0 tant que `playing` n'était jamais activé). Ajout d'un léger dégradé de remplissage sous la
> partie de la courbe déjà parcourue (couleur zone : vert confort / rouge manque-trop haut), et d'un chip
> « État actuel » avec icône (✓ confort, ⚠ manque/trop haut) mieux intégré au-dessus du graphe.
> `nicotineCurve.ts` n'a pas été modifié (partagé avec R5, non touché comme prévu).

- [ ] Dès l'ouverture du module, le curseur temporel avance déjà tout seul (pas besoin de cliquer sur un bouton Lecture pour voir quoi que ce soit bouger).
- [ ] Cliquer sur un geste (« Fumer une cigarette », « Substitut ponctuel », « Vapoteuse », « Poser un patch ») insère immédiatement un pictogramme au temps courant et sa cinétique (montée/descente) se dessine tout de suite, sans étape intermédiaire.
- [ ] Le bouton « Pause » (contrôle secondaire) fige le balayage ; il devient « Reprendre » et relance depuis la position figée.
- [ ] « Vitesse ×1/×2/×4 » change la vitesse de balayage.
- [ ] « Réinitialiser » remet le curseur à 0, efface les prises, et le balayage repart automatiquement (pas besoin de recliquer Lecture après un reset).
- [ ] Le balayage boucle en continu (revient à 0 après un tour) sans que la courbe déjà tracée (repère fin en arrière-plan) ne change — seule la portion colorée « déjà parcourue » se redessine à chaque tour.
- [ ] Le chip « État actuel : Manque / Confort / Trop haut » (icône + couleur + texte) est bien lisible au-dessus du graphe et change en cohérence avec la couleur de la courbe au niveau du curseur.
- [ ] Un léger dégradé de couleur (vert ou rouge selon la zone) est visible sous la portion de courbe déjà parcourue, sans nuire à la lisibilité des bandes de zone en arrière-plan.
- [ ] Hiérarchie visuelle des boutons perceptible : gestes en boutons pleins (accent), Pause/Vitesse en contour discret, Réinitialiser en contour rouge/alerte à part.
- [ ] Mention « schéma illustratif » toujours présente ; aucune valeur chiffrée de dosage.
- [ ] Avec « Réduire les animations » activé au niveau OS/navigateur : pas de balayage animé ni de curseur, la courbe complète s'affiche directement, les boutons Pause/Vitesse disparaissent (reste geste + Réinitialiser) ; ajouter un geste met quand même à jour la courbe.

**Auto :** `tsc -b` + `vite build` + `vitest run` (15 tests) exécutés directement via `node_modules/.bin` (npm/node non détectés sur le PATH de cet environnement, mais `/c/Program Files/nodejs/node.exe` est présent) — tous verts, aucune régression.

## R5 — Soulagement : modèle temps réel + superposition non-fumeur sur la même courbe

> La bascule d'onglets « Non-fumeur / Fumeur » est supprimée : le module est désormais un **bac à sable temps
> réel calqué sur R4** (balayage continu façon oscilloscope, dès l'ouverture). Cliquer « Fumer une cigarette »
> insère la prise au temps courant ; le stress chute exactement au pic de nicotine puis remonte. Un seul
> bouton « Comparer au non-fumeur » superpose, **sur le même graphe**, une ligne de repère stable — toujours
> **sous** le creux le plus bas atteint par le fumeur (invariant garanti par construction : le plancher de
> stress fumeur = `STRESS_BASAL_FUMEUR` = 0,30, strictement > `STRESS_BASAL_NON_FUMEUR` = 0,25, même si
> plusieurs cigarettes saturent la nicotine à 1). `nicotineCurve.ts` n'a pas eu besoin de changer de formule ;
> deux tests Vitest ont été ajoutés pour figer cet invariant en comportement observable (pas seulement en
> comparaison de constantes) : saturation multi-cigarettes + monotonie creux/rebond après une cigarette.

- [ ] Dès l'ouverture du module, le curseur temporel avance déjà tout seul ; la courbe de stress est plate au
  plafond de manque (aucune cigarette encore « fumée »).
- [ ] Cliquer « Fumer une cigarette » insère immédiatement un pictogramme au temps courant ; le stress chute
  au même instant (synchronisé au pic de nicotine, courbe pointillée grise en repère) puis remonte
  progressivement vers le plafond, jusqu'à la cigarette suivante.
- [ ] Cliquer plusieurs fois de suite : chaque clic ajoute un pictogramme distinct sur l'axe du temps et un
  nouveau creux, sans jamais faire descendre le stress sous le plancher illustré.
- [ ] Bouton « Comparer au non-fumeur » : superpose une ligne verte pointillée horizontale, libellée
  « Repère : stress non-fumeur (stable) », visuellement **sous** (plus bas que) tous les creux du fumeur —
  jamais couleur seule (libellé texte toujours présent). Un second paragraphe de légende apparaît, expliquant
  que le fumeur reste au-dessus même soulagé.
- [ ] Annotation italique « soulagement du manque » ancrée au creux le plus bas actuellement dessiné, une
  fois qu'au moins une cigarette a été « fumée ».
- [ ] « Réinitialiser » efface les cigarettes posées et remet le curseur à 0 ; le balayage continue
  automatiquement (le toggle « Comparer » n'est pas réinitialisé, c'est une préférence d'affichage).
- [ ] Mention « schéma illustratif — pas une mesure clinique » toujours présente ; ton non culpabilisant
  conservé (la cigarette « soulage un manque qu'elle a elle-même créé », jamais formulé comme une faute).
- [ ] Avec « Réduire les animations » activé : pas de balayage animé, la courbe s'affiche directement en
  entier (état final) ; cliquer « Fumer une cigarette » ajoute quand même un nouveau creux visible, espacé
  automatiquement sur l'axe.
- **Question d'arbitrage héritée (cf. §C4 ci-dessus, non retranchée par R5)** : les amplitudes restent celles
  déjà proposées (basal non-fumeur 0,25 ; basal fumeur juste après soulagement 0,30 ; amplitude de manque
  0,35 → plafond ≈ 0,65) — **toujours à valider/ajuster par Thibault** dans le nouveau contexte temps réel
  (le récit visuel change : creux ponctuels répétés au clic plutôt qu'une séquence de 5 cigarettes fixes).

**Auto :** `tsc -b` + `vite build` + `vitest run` (17 tests, dont les 2 nouveaux tests d'invariant R5) exécutés
via `node_modules/.bin` (`/c/Program Files/nodejs/node.exe` sur le PATH) — tous verts, aucune régression.

## R6 — Addiction : exploration lisible + outils dans le cadre

> Le panneau « De quoi parle-t-on ? » (bulles d'exemples) qui était positionné en **absolu par-dessus le
> diagramme de Venn** (un coin par pilier, pouvait chevaucher les cercles/libellés) est désormais un **panneau
> en flux normal, sous le diagramme**, comme le panneau « Outils & stratégies » déjà existant — les deux
> panneaux s'empilent verticalement, jamais de superposition. Le diagramme reste au repos (3 cercles, léger
> grossissement ×1.06 au clic, pas d'onglets) ; l'intersection centrale reste lisible. Le contenu des « Outils
> & stratégies » n'a **pas** été étoffé au-delà des 2 items déjà présents par pilier : `docs/contenu-modules.md`
> §Module 1 ne fournit pas d'items supplémentaires sourcés — en ajouter aurait signifié inventer du contenu
> médical, explicitement interdit par le plan (§Si bloqué). **Question pour Thibault** : fournir du contenu
> « outils/stratégies » supplémentaire par pilier si un enrichissement est souhaité au-delà de la carte
> d'orientation actuelle.

- [ ] Cliquer un cercle ouvre, sous le diagramme (jamais par-dessus), un panneau « De quoi parle-t-on ? »
  listant les exemples en bulles, entièrement lisible, sans chevauchement avec le Venn.
- [ ] Le panneau « Outils & stratégies » reste juste en dessous, également dans le cadre.
- [ ] Recliquer sur le même cercle referme les deux panneaux (retour au repos).
- [ ] Les renvois « autre module » (substituts, nicotine, craving) fonctionnent toujours.
- [ ] L'intersection centrale « Ces dimensions s'alimentent entre elles » reste visible et lisible en toute
  circonstance.

**Auto :** `tsc -b` + `vite build` + `vitest run` (17 tests) via `node_modules/.bin` — tous verts, aucune
régression.

## R7 — Craving : courbe « vague » plus expressive

> Ajout d'un remplissage dégradé sous la courbe (aire, via `<linearGradient>` SVG inline), épaississement du
> trait (`stroke-width` 3→4, arrondi), marqueur du « maintenant » renforcé (halo semi-transparent + point plein
> cerclé), repère discret du pic (ligne pointillée verticale + libellé italique léger) et d'un axe temps discret
> en bas du graphe. Aucune dépendance ajoutée, aucun changement de logique (`bellValue`/`getPhase` intacts).

- [ ] La vague affiche une aire teintée sous la courbe (dégradé qui s'estompe vers le bas), pas seulement un
  simple trait.
- [ ] Le marqueur « maintenant » (point qui avance) est nettement plus visible qu'avant (halo + contour blanc).
- [ ] Un repère pointillé discret marque le pic de l'envie, libellé « pic ».
- [ ] Une ligne d'axe fine est visible en bas du graphe.
- [ ] Toujours sobre, lisible à ~1 m ; aucune régression sur l'atténuation de la courbe quand « Distraire » est
  actif.

**Auto :** `tsc -b` + `vite build` + `vitest run` (17 tests) via `node_modules/.bin` — tous verts, aucune
régression.

## R8 — Substituts : refonte ergonomique de la titration

> Les 3 cases à cocher brutes (« Envie de fumer persiste », « Signes de surdosage », « Jour / Nuit ») sont
> devenues des **cartes cliquables** (checkbox natif masqué visuellement mais accessible), cible ≥ 44 px,
> icône (Flame / AlertTriangle / Moon) + état actif coloré par token sémantique (ambre vigilance pour
> l'envie/jour-nuit, rouge toxique pour le surdosage). Le bouton grisé « Signes de surdosage → revenir en
> arrière » est remplacé par une **bannière d'alerte explicite** (fond + bordure rouge toxique, icône, texte)
> qui n'apparaît que si le surdosage est coché, avec le bouton d'action dedans. Les commandes de dose sont
> regroupées par bloc jour / nuit (« Dose de jour » / « Dose de nuit », icône Sun/Moon), chaque bloc avec ses
> propres boutons ± ¼ ≥ 44 px. Le libellé des patchs 2×2 passe sur deux lignes (nom en gras, détail
> « 2 patchs + ¼ (9 quarts) » en dessous, plus discret) pour la lisibilité. Aucun changement de mécanique
> (quarts illimités, patchs 2×2, jour ≥ nuit implicite via `Math.min`, aucun dosage chiffré).

- [ ] Les 3 états (envie / surdosage / jour-nuit) se présentent comme des cartes avec icône, cible confortable
  au clic/tactile, état actif visuellement distinct (couleur + icône, jamais couleur seule).
- [ ] Cocher « Signes de surdosage » fait apparaître une bannière d'alerte rouge explicite avec le bouton
  « Revenir en arrière (− ¼) », plutôt qu'un bouton grisé peu parlant.
- [ ] Décocher « Signes de surdosage » fait disparaître la bannière.
- [ ] Les blocs « Dose de jour » / « Dose de nuit » (ce dernier seulement si « Jour / Nuit » coché) sont
  visuellement séparés, chacun avec ses patchs et ses boutons ± ¼.
- [ ] Le double libellé des patchs (nom + décompte quarts) est lisible en deux lignes distinctes.
- [ ] La mécanique reste identique à avant (cf. `VALIDATION.md` §C2) : pas de dosage chiffré, patchs sécables en
  quarts, dose de nuit toujours ≤ dose de jour.

**Auto :** `tsc -b` + `vite build` + `vitest run` (17 tests) via `node_modules/.bin` — tous verts, aucune
régression.

## R9 — Nouveau module M7 « Explorer ma motivation »

> Squelette branché comme les 6 autres modules (`types.ts` + `registry.ts`, icône `Compass`) — `App.tsx` n'a
> nécessité **aucune modification** : il rend déjà les modules génériquement via `MODULES.find`. Deux outils :
> (A) deux curseurs 0–10 (importance / confiance) avec relance non culpabilisante sous chaque valeur ; (C) un
> tableau blanc de cartes « Mes raisons » (6 cartes de départ), déplaçables via pointer events natifs **et**
> flèches du clavier (poignée = `<button>` focusable, aucune librairie de drag), éditables (texte + détail
> optionnel), avec bouton « + une raison » pour en créer de nouvelles. Aucune persistance (state React
> éphémère). Contenu de départ = proposition neutre non sourcée, cf. `docs/contenu-modules.md` §Module 7,
> **à valider par Thibault**.

- [ ] Le module « Explorer ma motivation » apparaît comme 7ᵉ carte sur l'accueil (grille reste correcte, rien
  ne casse visuellement avec 7 cartes).
- [ ] Les deux curseurs 0–10 sont manipulables ; la valeur s'affiche ; la relance change avec la valeur (aucune
  relance « plus bas » à 0, aucune relance « plus haut » à 10).
- [ ] Les 6 cartes de départ sont visibles, dans le cadre, sans chevauchement excessif.
- [ ] Une carte se déplace à la souris/tactile (glisser la poignée) et reste dans le cadre du tableau blanc.
- [ ] Une carte se déplace aussi au clavier (Tab jusqu'à la poignée, flèches directionnelles).
- [ ] Le texte d'une carte est éditable ; ajouter un détail dans le champ dédié fonctionne.
- [ ] « + une raison » crée une nouvelle carte vide, éditable immédiatement (focus posé dessus).
- [ ] Recharger la page (reload) réinitialise tout (aucune persistance).
- [ ] **Question pour Thibault** : la liste des 6 cartes seed (santé, argent, goût/odorat, souffle, proches,
  liberté) et les deux libellés d'échelle sont-ils satisfaisants, ou à remplacer/compléter ?

**Auto :** `tsc -b` + `vite build` + `vitest run` (17 tests) via `node_modules/.bin` — tous verts, aucune
régression.

## V1 — Addiction : agrandir le diagramme de Venn
> Agrandissement de la taille de rendu du diagramme de Venn et augmentation de la lisibilité des labels
> pour une meilleure visibilité à ~1 m. Modifications CSS : `.vennWrap` max-width 640→800px, `.venn` max-height
> 46vh→65vh, `.circleLabel` font-size 18→24px, `.circleKeywords` font-size 13→16px.

- [ ] Le diagramme de Venn (3 cercles) est nettement plus grand à l'écran (cercles + labels visiblement agrandis).
- [ ] Les labels (« Physique (nicotinique) », « Psychologique », « Comportementale ») et mots-clés sous chaque cercle sont lisibles à ~1 m.
- [ ] Cliquer chaque cercle sélectionne toujours le bon pilier ; aucune régression sur l'interaction.
- [ ] Les `.hitArea` restent correctement alignées avec les cercles après agrandissement (pas de décalage).
- [ ] Le message central « Ces dimensions s'alimentent entre elles » reste visible et lisible.
- [ ] Aucun débordement horizontal du diagramme en dehors du `.content` (960 px) sur desktop.
- [ ] Sur tablette/mobile, le diagramme s'adapte proportionnellement sans cassure (responsive OK).

**Auto :** `npm run build` OK ; `tsc -b` + `vite build` OK.

## V2 — Addiction : items « De quoi parle-t-on » en menu radial
> Le panneau `.explorePanel`/`.bubbleRow` (liste sous forme de panneau, en flux) est remplacé par des bulles
> positionnées en arc autour du cercle sélectionné, en % du `.vennWrap` (même méthode que les `.hitArea`).
> Secteur par pilier (angle 0°=droite, 90°=bas), choisi pour s'éloigner des deux autres cercles :
> physique 120°→240° (gauche), psychologique -60°→60° (droite), comportementale 30°→150° (bas). Rayon des
> bulles = `R + 60` (rayon du cercle + 60, soit ~190px en coordonnées viewBox). Le titre « De quoi parle-t-on ?
> — {label} » reste en flux, au-dessus du diagramme (ne recouvre rien). Pas de trait de liaison bulle↔cercle
> (optionnel dans le plan, omis pour rester sobre).

- [ ] Cliquer chaque pilier (Physique / Psychologique / Comportementale) : ses exemples s'affichent en éventail
  autour du bon cercle, lisibles, sans recouvrir le cercle sélectionné ni les deux autres cercles/hitAreas.
- [ ] Le secteur choisi s'éloigne bien des cercles voisins (physique → vers la gauche, psychologique → vers la
  droite, comportementale → vers le bas).
- [ ] Désélectionner (recliquer le même cercle) retire toutes les bulles.
- [ ] Le titre « De quoi parle-t-on ? — {pilier} » reste lisible, sans chevaucher le diagramme.
- [ ] Sur mobile/tablette étroite, pas de chevauchement gênant entre bulles (7 exemples pour physique et
  comportementale) ; si chevauchement gênant, cf. §Si bloqué du plan (agrandir rayon/secteur).
- [ ] Le panneau « Outils & stratégies » sous le diagramme est inchangé.

**Auto :** `tsc -b` + `vite build` OK (voir commande ci-dessus).

## V4 — Soulagement : clic → chute/remontée figée, plus de curseur
> Alignement sur le modèle nicotine V3 : suppression du balayage continu (`now`/rAF/`resetTick`), du
> curseur bleu et du hook `useReducedMotion` devenu inutile. « Fumer une cigarette » dépose désormais
> une prise sur une frise statique via `nextEventTime` (même mécanique que Nicotine). Les courbes
> nicotine (repère pointillé) et stress (trait plein) se tracent d'un coup sur toute la frise ; le
> `troughIndex`/l'annotation « soulagement du manque » se recalent sur la courbe complète. `nicotineCurve.ts`
> non modifié (formule héritée du retune V3).

- [ ] Plus de curseur bleu ni de balayage automatique à l'ouverture du module.
- [ ] Cliquer « Fumer une cigarette » dépose un pictogramme sur la frise ; le stress chute au pic de
  nicotine (courbe pointillée grise) puis remonte, courbe figée immédiatement (pas d'animation).
- [ ] Enchaîner plusieurs cigarettes cumule les creux/rebonds (dents de scie) sur la frise.
- [ ] Annotation italique « soulagement du manque » ancrée au creux le plus bas de la courbe complète.
- [ ] « Comparer au non-fumeur » superpose toujours la ligne repère sous le creux le plus bas du fumeur.
- [ ] « Réinitialiser » vide les événements et la courbe redevient plate au plafond de manque.
- [ ] Mention « schéma illustratif » toujours présente.

**Auto :** `tsc -b` + `vite build` + `vitest run` (20 tests) — tous verts, aucune régression.

## V5 — Craving : les 4 D masquent progressivement le pic
> Supprime la bascule « sous le graphe dès 2+ outils » (root cause R3/C5 devenue obsolète) : il n'y a
> plus qu'un seul conteneur `.overlayZone`, toujours superposé au SVG, ancré au-dessus de la zone du
> pic (centré sur `PEAK_X`, ~30 % de la largeur du graphe), en disposition flexbox compacte (jusqu'à
> 2×2, cartes réduites en taille/police pour tenir sur la zone haute). L'atténuation binaire de la
> courbe (`courbeAttenuee`, liée au seul « Distraire ») est remplacée par une opacité graduée
> (`picOpacity`, palette 1 / 0,55 / 0,35 / 0,2 / 0,1) pilotée par `activeTools.size`, appliquée en
> style inline sur le `<path>` de la courbe. **Remplace donc les critères R3/C5 ci-dessus qui
> décrivaient l'ancien comportement (bascule sous le graphe) — ne plus s'y fier pour ce module.**

- [ ] Activer 1 seul outil : sa carte **recouvre la zone du pic** (jamais sous le graphe), le pic est
  légèrement estompé derrière (opacité ~0,55) mais toujours devinable.
- [ ] Activer 2, 3 puis 4 outils : les cartes s'empilent en grille compacte (2×2 max) toujours sur la
  zone du pic, et le pic derrière s'assombrit/s'estompe **de plus en plus** jusqu'à devenir à peine
  visible avec les 4 outils actifs (opacité ~0,1).
- [ ] À chaque étape, les cartes restent **lisibles** (fond opaque, titre + icône visibles), même
  réduites en taille pour tenir sur la zone haute du graphe.
- [ ] Rien ne déborde du cadre `.graphWrap`, à aucun moment (1 à 4 outils actifs).
- [ ] Désactiver les outils un par un : le pic redevient progressivement net (opacité qui remonte),
  jusqu'à disparition complète des cartes et pic à pleine opacité sans aucun outil actif.
- [ ] Comportement des widgets inchangé : compte à rebours « Différer », pulsation « Distraire »,
  cercle de respiration « Décontracter », séquence de gorgées « De l'eau ».
- [ ] Cibles tactiles (cartes, boutons internes) restent confortables malgré la taille réduite.

**Auto :** `tsc -b` + `vite build` OK.

## V7 — Motivation : scinder en 2 onglets
> Barre d'onglets (`role="tablist"`) ajoutée en tête du module : « Où en êtes-vous ? » / « Mes
> raisons ». Les deux `<section>` existantes restent montées en permanence (aucun état perdu,
> les curseurs/cartes vivent déjà dans le state du composant parent) et sont masquées via
> l'attribut HTML `hidden` selon l'onglet actif. Navigation clavier flèches gauche/droite entre
> onglets (`aria-selected`, `tabIndex` roving), cibles ≥ 44 px.

- [ ] Deux onglets visibles en haut du module, bascule fluide au clic.
- [ ] Flèches gauche/droite au clavier (focus sur un onglet) changent l'onglet actif.
- [ ] Modifier un curseur ou une carte, changer d'onglet puis revenir : les valeurs sont conservées.
- [ ] Lisible à ~1 m ; un seul panneau visible à la fois.

**Auto :** `tsc -b` + `vite build` OK.

## V8 — Motivation : tableau plus grand + cartes en réserve
> Ajout d'un champ `placed: boolean` sur `Carte` ; les 6 cartes seed et toute nouvelle carte
> démarrent `placed:false` (dans la **réserve**, un bac en flux normal au-dessus du tableau).
> Deux boutons non-drag « Placer » / « Retirer » (≥ 44 px) permettent de faire passer une carte
> entre réserve et tableau — **choix délibéré retenu depuis le §« Si bloqué » du plan** : le
> glisser-déposer natif (pointer capture) entre deux conteneurs DOM distincts (réserve en flux vs
> tableau en position absolue) démonterait/remonterait le bouton-poignée en cours de glissement et
> casserait la capture du pointeur — fragile pour un gain d'ergonomie marginal face aux boutons
> dédiés. Le drag au pointeur reste donc utilisé **uniquement pour repositionner une carte déjà
> placée à l'intérieur du tableau** (comportement inchangé) ; en bonus, relâcher le glissement
> **en dehors** du cadre du tableau renvoie la carte à la réserve (`placed:false`), en plus du
> bouton « Retirer ». `.whiteboard` agrandi (`min-height: min(70vh, 640px)`, borné par `.content`).

- [ ] Au chargement du module, les 6 cartes de départ sont toutes dans la **réserve** (en haut),
  le tableau en dessous est **vide** et nettement plus grand qu'avant.
- [ ] Bouton « Placer » sur une carte de la réserve : la carte apparaît sur le tableau, à sa
  position d'origine (ou dernière position connue).
- [ ] Bouton « Retirer » sur une carte du tableau : la carte revient dans la réserve (bac), rien
  n'est perdu (texte/détail conservés).
- [ ] Glisser une carte déjà placée (poignée) puis relâcher **en dehors** du cadre du tableau : la
  carte revient aussi dans la réserve.
- [ ] Glisser une carte placée **à l'intérieur** du tableau se comporte comme avant (repositionnement
  libre, bornes 10–90 %).
- [ ] Déplacement au clavier (flèches, une fois la poignée focus) fonctionne toujours pour les
  cartes placées.
- [ ] « + Une raison » crée une nouvelle carte **dans la réserve**, focus posé sur son champ texte.
- [ ] Quand toutes les cartes sont placées, la réserve affiche « Toutes les cartes sont sur le
  tableau. » plutôt qu'un bac vide silencieux.
- [ ] Cibles tactiles (Placer / Retirer / poignée) confortables (≥ 44 px) ; utilisable au doigt.

**Auto :** `tsc -b` + `vite build` OK.

## V6 — Nicotine-toxique : « Mélange chimique » reformulé avec conséquence *(texte à valider par Thibault)*
> Le `detail` du hotspot `melange` n'énonçait que le chiffre (« ~7 000 substances chimiques ») sans
> conséquence. Reformulé pour nommer la conséquence, cohérent avec la source
> (`docs/contenu-modules.md` §Module 4 : « c'est la fumée/combustion qui rend malade, pas la
> nicotine ») : « En brûlant, le tabac libère un cocktail d'environ 7 000 substances chimiques. C'est
> ce mélange issu de la combustion — et non la nicotine — qui rend malade. » `eyebrow` inchangé
> (« Fumée de combustion »).

- [ ] Ouvrir le pop-up « Mélange chimique » : une conséquence claire est énoncée (« rend malade »),
  pas seulement le chiffre.
- [ ] Cohérent avec le message du module : c'est la combustion (pas la nicotine) qui rend malade.
- [ ] **Validation médicale (Thibault) :** confirmer la formulation « cocktail... rend malade » —
  texte proposé par Claude, à ajuster si besoin.

**Auto :** `tsc -b` + `vite build` OK.
