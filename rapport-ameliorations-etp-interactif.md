# Rapport d'améliorations — Webapp "ETP interactif"

**Destinataire :** Claude Code
**Source :** https://etp-interactif.vercel.app/
**Date :** 2026-07-13
**Rédigé à partir de :** revue interactive guidée par l'auteur de l'app.

---

## Contexte technique général

- App React (rendu client), navigation par thèmes ("Sevrage tabagique", "Diabète") puis modules.
- Les modules "corps/organes" et "courbes de glycémie" reposent sur des **SVG**.
- Pour les courbes de glycémie (module Insuline) : `viewBox="0 0 640 262"`. Bandes horizontales (rect) :
  - **Hyper (rouge)** : y = 0 → 80
  - **Cible (vert)** : y = 80 → 150
  - **Hypo (beige)** : y = 150 → 200
  - Rappel : en SVG, **y petit = glycémie haute**, y grand = glycémie basse.
- Deux tracés par courbe : trait plein = "avec rapide / scénario choisi", pointillés = comparatif.

> Toutes les valeurs de courbe ci-dessous sont mesurées directement sur les attributs `d` des `<path>` du SVG.

---

# A. Module "Ce que l'arrêt répare" (thème Sevrage tabagique)

Page : Accueil Sevrage → "Ce que l'arrêt répare".
Structure actuelle : silhouette schématique à gauche (7 boutons-organes en **cercles blancs** superposés), à droite une timeline de **chips** (20 minutes → 10-15 ans) avec flèches ◀ ▶, un compteur "Étape X / 10", un titre, un texte, et une petite vignette d'illustration dans une "box de détail".

### 1. Supprimer la ligne "Étape X / 10"
- **Élément :** texte `"Étape 1 / 10"` affiché au-dessus du titre de l'étape.
- **Action :** le retirer.

### 2. Supprimer les chips de navigation temporelle — la navigation se fait par la silhouette
- **Éléments :** `group "Étapes de l'arrêt"` contenant les boutons chips ("20 minutes", "8 heures", "24 heures", "48 heures", "72 heures", "2 semaines à 3 mois", "1 à 9 mois", "1 an", "5 ans", "10 à 15 ans") + boutons "Étape précédente"/"Étape suivante".
- **Action :** supprimer toute cette barre de chips. L'accès aux étapes/contenus doit se faire **au clic sur les organes de la silhouette**.

### 3. Supprimer les cercles blancs sur la silhouette
- **Éléments :** un bouton par organe (`Cerveau`, `Goût & odorat`, `Cœur`, `Poumons`, `Sang & vaisseaux`, `Peau`, `Jambes & circulation`) rendu sous forme de **cercle blanc** posé sur une silhouette de fond.
- **Action :** supprimer les cercles blancs (habillage), garder des zones cliquables directement sur les organes.

### 4. Remplacer la silhouette par celle du module "Complications" (Diabète)
- **Référence à réutiliser :** thème Diabète → module **"Complications"** : silhouette anatomique pleine (vaisseaux artériels/veineux, organes dessinés : cerveau, cœur, reins…), zones cliquables directement sur les organes, panneau de détail latéral au clic. Aucun cercle blanc.
- **Action :** reprendre ce composant/ce style de silhouette pour "Ce que l'arrêt répare", et **repositionner correctement les zones cliquables** sur les organes concernés (Cerveau, Goût & odorat, Cœur, Poumons, Sang & vaisseaux, Peau, Jambes & circulation).

### 5. Illustration de la "box de détail" trop petite et mal alignée
- **Élément :** vignette (ex. `image "Cœur soulagé"`) affichée à gauche d'un badge organe, dans la carte de détail de l'étape.
- **Problème :** taille trop petite (icône ~64px, non responsive) et **alignée à gauche** au lieu d'être centrée.
- **Action :** agrandir l'illustration et la **centrer** dans la box de détail.

---

# B. Module "Utilisation des substituts & titration du patch" (Sevrage)

### 6. Illustration "Technique de prise — Vapoteuse" non visible sans scroller
- **Localisation :** onglet/forme **"Vapoteuse"** → bloc `TECHNIQUE DE PRISE — VAPOTEUSE` (illustration main+vapoteuse+horloge).
- **Problème :** l'illustration (info clé d'usage) est **sous la ligne de flottaison** ; il faut scroller pour la voir. Ce n'est pas un débordement CSS (rendu correct dans le cadre) mais un problème d'UX/priorité de contenu.
- **Action :** remonter ce contenu / réduire la hauteur du bloc supérieur, ou scroll automatique vers la technique de prise à la sélection de la forme, pour que l'illustration soit visible sans défiler.

---

# C. Module "Stratégies & outils" (Sevrage)

### 7. Supprimer le toggle "Dans ma fiche" sur les cartes de la grille
- **Éléments :** chaque carte de la grille "Stratégies & outils" porte un toggle `(cercle) "Dans ma fiche"` en bas de carte.
- **Justification :** l'ajout est **déjà possible depuis la vue détail** de chaque carte (bouton "Ajouter à ma fiche").
- **Action :** retirer le toggle "Dans ma fiche" de la vue grille (le garder uniquement en vue détail).

### 8. Supprimer le lien redondant "Les inscrire dans mon plan d'arrêt"
- **Élément :** dans la **vue détail** d'une carte, lien `"Les inscrire dans mon plan d'arrêt →"` situé au-dessus du bouton "Ajouter à ma fiche".
- **Justification :** redondant — tout ce qui est ajouté à la fiche est **déjà inclus** dans le plan d'arrêt.
- **Action :** supprimer ce lien/action séparé.

---

# D. Module "Mon plan d'arrêt" (Sevrage)

### 9. Section "1. Ma date" : proposer le choix de la stratégie
- **Élément actuel :** section `"1. Ma date"` = un simple champ `<input type="date">`.
- **Demande :** permettre de choisir entre **"Arrêt complet"** et **"Réduction progressive"** — deux stratégies également valables.
- **Action :** ajouter un sélecteur de stratégie (2 options) dans cette section, et adapter le libellé/contenu du plan selon le choix.

---

# E. Module "Insuline basale" vs "Insuline rapide" (thème Diabète)

### 10. Harmoniser la présentation situations/réponses entre les deux modules
- **Insuline basale → onglet "Décider" :** les chips "situation" + les chips "réponse" (Baisser la lente / Laisser pareil / Monter la lente) + le texte de résultat sont regroupés dans **un seul encadré** (bordure + fond).
- **Insuline rapide → onglet "① Couvrir le repas" (équivalent) :** les chips "situation" (glucides) et "réponse" (dose) **flottent librement** sous les onglets, sans encadré commun ; le résultat (graphe + texte) est dans un bloc séparé.
- **Action :** harmoniser la structure et le style des deux (même mise en encadré, même hiérarchie situations → réponses → résultat).

### 11. Incohérence pédagogique — Insuline rapide → "① Couvrir le repas"
Axes : glucides du repas (Peu / Repas moyen / Beaucoup) × dose de rapide (Moins / Habituelle / Plus).

**Défaut de fond :** le message de résultat **ne dépend que de la colonne "dose"**, jamais de la quantité de glucides. "Dose habituelle" affiche toujours le même message "dose ajustée à ce repas, le pic est couvert" quel que soit le repas → l'app traite la dose habituelle comme toujours parfaitement adaptée.

Mesures du **creux le plus bas** (y ; hypo si > 150), colonne **Dose habituelle** :

| Glucides | Creux (y) | Attendu |
|---|---|---|
| Peu de glucides | 148 (reste en cible, courbe la plus plate) | devrait faire une **HYPO** |
| Repas moyen | 155 | cas correct (retour cible) |
| Beaucoup de glucides | 163 (plonge le plus) | devrait **rester HAUT** (hyper), pas plonger |

→ Comportement **inversé** : à dose fixe, plus le repas est petit, moins ça descend, alors que ça devrait être l'inverse.

**Modèle correct attendu :** "Dose habituelle" = dose fixe calibrée pour un **Repas moyen**. Le résultat doit être fonction de l'écart `(dose − glucides)`, pas de l'index de dose seul :

| | Moins de dose | Dose habituelle | Plus de dose |
|---|---|---|---|
| **Peu de glucides** | ~cible | **HYPO** | hypo marquée |
| **Repas moyen** | reste haut | **cible (seul cas parfait)** | hypo |
| **Beaucoup de glucides** | très haut | **reste haut / hyper** | ~cible |

**Priorités :** corriger d'abord "Peu + Habituelle" (→ hypo) et "Beaucoup + Habituelle" (→ reste haut, ne doit pas plonger en hypo).

### 12. Cohérence — Insuline rapide → "③ Corriger avant le repas" (globalement OK)
Axes : glycémie de départ (Basse / Dans la cible / Haute) × dose. **Contrairement à l'onglet 1, le résultat dépend bien des deux axes** → logique saine. Deux réglages fins :
- **"Dans la cible + Dose habituelle" :** message "dose habituelle suffit, couvert" mais la courbe plonge très légèrement sous la cible (creux ≈153, limite hypo = 150). Recaler le creux dans le vert.
- **"Basse + Moins de dose" :** la courbe reste franchement en hypo (creux 166) malgré dose réduite + apport du repas ; un léger retour vers la cible serait plus réaliste (le message "traiter l'hypo d'abord" reste juste).
- Détail visuel : le départ "Haute" est posé pile sur la limite cible/hyper (y=80) ; le démarrer plus haut (nettement dans le rouge) le rendrait plus lisible.

### 13. Insuline rapide → "④ Le piège du cumul" — incohérence + bug d'affichage
Axes : situation ("La glycémie redescend toute seule" / "La glycémie reste haute") × action ("Je n'ajoute pas de dose" / "Je recorrige tout de suite" / "J'attends que la 1ʳᵉ ait fini, puis je recorrige").

**Situation "La glycémie reste haute" : cohérente.** Départ hyper (≈70), reste haut sans action ; "recorriger tout de suite" → les 2 doses s'additionnent → hypo (creux ≈176) ; "attendre puis recorriger" → retour cible (creux ≈139). Conforme à la logique attendue (correction nécessaire mais différée).

**Situation "La glycémie redescend toute seule" : à corriger.**
- La partie "recorriger = hypo" est OK (les 2 options de recorrection plongent à ≈195).
- **MAIS** la courbe de base "je n'ajoute pas de dose" reste quasi plate dans la cible (pic seulement ≈129, creux 153) : elle ne montre pas la dynamique attendue.
- **Attendu (auteur) :** glycémie normale au départ → **montée nette en post-prandial (zone haute/rouge)** → **redescente spontanée dans la cible vers +3h**. C'est ce qui donne son sens au nom "redescend toute seule" et au contraste avec l'autre situation.
- **Action :** redessiner la courbe de base de cette situation (départ cible → pic haut → retour cible à ~+3h, sans dose ajoutée).

**Bug d'affichage (situation "reste haute" + recorrection) :** le graphe + la 2ᵉ courbe en pointillés + la légende remplissent le viewport ; le **texte de résultat et le bouton "Ça ressemble à une hypo → le réflexe" sont sous la ligne de flottaison** (invisibles sans scroller). Compacter le graphe ou remonter le bloc résultat pour qu'il soit visible sans défiler (même famille de problème que le point 6).

---

## Synthèse des priorités

1. **Logique pédagogique (haute) :** point 11 (refonte du calcul de "Couvrir le repas") et point 13 (courbe "redescend toute seule").
2. **Visibilité/UX (moyenne) :** points 6 et 13-bug (contenus résultat sous la ligne de flottaison).
3. **Refonte visuelle (moyenne) :** points 1–5 (module "Ce que l'arrêt répare").
4. **Nettoyage/redondance (basse) :** points 7, 8.
5. **Fonctionnalité (à cadrer) :** point 9 (choix arrêt complet / réduction progressive).
6. **Réglages fins :** points 10, 12.
