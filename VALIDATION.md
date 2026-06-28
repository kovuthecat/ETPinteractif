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

## C3 — Nicotine : timeline animée + coloration par zone
- [ ] Cliquer sur « Fumer une cigarette » / « Substitut ponctuel » / « Vapoteuse » / « Poser un patch » ajoute un pictogramme sur l'axe du temps, à la position du curseur « maintenant » (pas à un créneau fixe).
- [ ] « Lecture » fait avancer le curseur de gauche à droite ; la courbe déjà parcourue se colore en **vert** dans la zone confortable et en **rouge** sous le seuil de manque ou au-dessus du seuil de tolérance ; le reste de la courbe (futur) reste fin et discret.
- [ ] Le libellé « État actuel : Manque / Confort / Trop haut » au-dessus du graphe change en cohérence avec la couleur de la courbe au niveau du curseur (texte toujours présent, jamais la couleur seule).
- [ ] « Pause » arrête le curseur sans le remettre à zéro ; « Lecture » reprend depuis la position figée. Bouton « Vitesse ×1/×2/×4 » change la vitesse de défilement.
- [ ] « Réinitialiser » remet le curseur à 0, efface les prises et la courbe.
- [ ] Mention « schéma illustratif » toujours présente ; aucune valeur chiffrée de dosage.
- [ ] Avec « Réduire les animations » activé au niveau OS/navigateur : pas de défilement animé, la courbe complète s'affiche directement et les boutons de lecture/vitesse disparaissent (seul « Réinitialiser » reste, avec les boutons de prise).
