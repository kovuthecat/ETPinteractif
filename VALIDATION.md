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
