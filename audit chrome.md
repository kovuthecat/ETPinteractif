# Rapport d'audit UX/UI — ETP Interactif (Programme Diabète)
Date : 11/07/2026
Contexte : audit visuel réalisé en navigant sur https://etp-interactif.vercel.app/

---

## 1. Règles générales (s'appliquent à l'ensemble de l'app)

### 1.1 Supprimer le bloc "Continuer l'exploration"
Sur toutes les pages/modules, en bas de contenu, un bloc `<nav aria-label="Aller plus loin">` affiche "Continuer l'exploration" avec un ou plusieurs boutons liens vers d'autres sections (ex: "Voir comment l'alimentation joue", "Et il y a aussi les petits vaisseaux...", "Les surveillances liées aux médicaments").
**Action : supprimer ce composant sur toutes les pages où il apparaît.**

### 1.2 Réagencement général du layout
Sur la plupart des pages, revoir l'agencement pour :
- Positionner la barre de navigation des "chapitres"/onglets (ex: composant `_navigation_1gho0_1`) **sur la même ligne que le titre** (`h1._titre_jfth7_42`) plutôt qu'en dessous sur sa propre ligne.
- Réduire les espaces morts / marges excessives : sur plusieurs pages le conteneur de contenu (`_content_jfth7_51`, `max-width: 980px`) est centré sur un viewport bien plus large (ex: 1534px), laissant ~277px de marge vide de chaque côté.
- Faire en sorte que le contenu essentiel de chaque module (schémas, courbes, résultats) tienne **sans scroll** dans la hauteur d'écran, et que les modules interactifs occupent une part plus importante de l'espace disponible.

---

## 2. Page "C'est quoi le diabète ?"

- Supprimer le bloc "Continuer l'exploration" (voir règle générale 1.1).
- Le module interactif (schéma pancréas + cellules + jauge glycémie, classes `_module_nv4ex_9` / `_scene_nv4ex_42`, actuellement 900px de large) doit occuper davantage la page.

---

## 3. Page "Risque cardiovasculaire"

### 3.1 Onglet "Les leviers"
- Supprimer le bloc "Continuer l'exploration".
- Le conteneur des 5 facteurs de risque (`_vueBody_gyfjx_32`, en `flex`) affiche actuellement les items répartis **4 sur la 1ère ligne / 1 seul sur la 2e ligne** (Sucre, Tension, Cholestérol, Tabac / Sédentarité).
  **Cible : répartir en 3 items sur la 1ère ligne / 2 items sur la 2e ligne.**

### 3.2 Onglet "L'artère"
- **Bug visuel** : la plaque d'athérome (SVG `_artereOverlay_gyfjx_181`, paths `.path._plaque_vsn6f_8`) ne grossit pas visuellement selon les facteurs de risque sélectionnés — elle reste cantonnée dans la paroi de l'artère et ne réduit jamais visuellement la lumière (le passage du sang), alors que le texte affiché indique déjà "Passage du sang : 30 %" avec tous les facteurs de risque actifs.
  **Cible : quand un maximum de facteurs de risque sont actifs, la plaque doit visuellement empiéter jusqu'à occuper 70 % du diamètre de la lumière de l'artère** (cohérent avec les 30 % de passage déjà calculés), et non rester invisible/dans la paroi.
- Supprimer le bloc "Continuer l'exploration".
- Agrandir le module interactif de cette page (card `_arterePanel_gyfjx_142`, actuellement 720x453px sur un viewport de 1534x881px).

### 3.3 Onglet "L'anatomie"
- **Bug de dépendance entre modules** : le pin/plaque affiché sur la zone du corps cliquée (`img._plaquePin_gyfjx_215`) ne s'affiche que si des facteurs de risque ont été cochés au préalable dans l'onglet "Les leviers".
  **Cible : rendre les deux modules indépendants.** Cliquer une zone du corps dans "L'anatomie" doit systématiquement afficher un pin/plaque illustratif, quel que soit l'état de "Les leviers".
- Mettre davantage en valeur le texte de résultat (`_zoneDescPanel_gyfjx_231`, ex: "c'est l'infarctus") : texte plus grand/visible, et le repositionner **à côté** du diagramme corporel (`_silhouetteWrap_gyfjx_209`, 560x560px) plutôt qu'en dessous.

---

## 4. Module "Alimentation"

### 4.1 Général (tous onglets : Composition, Qualité, Ordre, Proportion, Repas complet)
- Réagencer le layout : nav des chapitres (`_navigation_1gho0_1`) sur la même ligne que le titre "Alimentation" (`_titre_jfth7_42`).
- Remonter le garde-manger (`aside._shelf_skjie_52`) et l'assiette/zone de dépose (`div._stage_skjie_166`) pour réduire l'espace vertical perdu en haut de page.
- Agrandir significativement la courbe "Glycémie après le repas" (`div.card._courbeCard_skjie_632`, actuellement seulement 490x295px) et la rendre bien visible sans scroll — **c'est le résultat clé de l'expérimentation du module**.
- Supprimer le bloc "Continuer l'exploration".

### 4.2 Onglet "Qualité"
- Les 2 cartes de comparaison (ex: "Baguette blanche" vs "Pain complet", classe `_d2Card_skjie_267`, 380x312px chacune) sont dans un conteneur `_d2Layout_skjie_249` en `flex-direction: row` mais large de seulement 531px — trop étroit pour les 2 cartes côte à côte (760px nécessaires), donc elles s'empilent verticalement.
  **Cible : élargir le conteneur pour que les 2 cartes s'affichent côte à côte.**

### 4.3 Onglet "Ordre"
- Les 3 cartes "bouchée" (1ère/2e/3e bouchée, `div._d3Slot_skjie_394`, 220px chacune = 660px au total) sont dans un conteneur `div._d3Row_skjie_386` en `flex-wrap: wrap` large de seulement 531px → seulement 2 cartes tiennent par ligne, la 3e passe à la ligne suivante.
  **Cible : élargir le conteneur (ou réduire proportionnellement les slots) pour que les 3 cartes tiennent sur une seule ligne.**

---

## 5. Module "Activité physique" (onglet "Le volume")

- La grille d'activités (`div.card._activitiesGrid_qn113_202`, grid 4 colonnes fixes, 13 cartes `_activityCard_qn113_300` de 123x157px) génère une hauteur totale de page de 1240px pour un viewport de 881px (~360px hors écran).
  **Cible : réagencer la grille pour que les 13 cartes + le panneau "Le total du jour" tiennent entièrement dans la hauteur de l'écran sans scroll** (par exemple 5-6 colonnes au lieu de 4, et/ou cartes plus compactes).

---

## 6. Module "Suivi" (onglet "Le parcours")

- Le cadran (SVG `_dialWrap_1xoe6_90`, actuellement 420x420px) est l'élément central de la page et doit être **agrandi**.
- La box "Mes examens — un par un" (`div._examList_1xoe6_542`, zone visible 440x480px) est trop petite pour son contenu réel (516x708px), ce qui génère **un double scroll horizontal ET vertical**.
  **Cible : élargir/agrandir cette box pour que tous les examens soient facilement accessibles sans scroll.**

---

## 7. Module "Traitements"

- La box "Ordonnance" (`section.card._ordonnance_1en55_16`, actuellement 380px de large) est trop étroite : les noms de traitements et leurs dropdowns sont tronqués (ex: "Metform...", "Dapaglif...").
  **Cible : élargir la box pour que chaque traitement tienne sur une seule ligne sans troncature.**
- Dans le panneau d'effet affiché au clic sur "Voir l'effet" (`div._panel_1en55_282`), ajouter un pictogramme selon le mécanisme d'action du traitement :
  - **Metformine** (cible : insulinorésistance) → afficher une **cellule verrouillée avec un cercle vert**.
  - **Traitements agissant sur la sécrétion d'insuline** (sulfamides, iDPP4, aGLP1, insuline, etc.) → afficher une **clé avec un cercle vert**.
  *(Cohérent avec la métaphore clé/serrure déjà utilisée dans le module "C'est quoi le diabète ?")*

---

## 8. Module "Hypoglycémie" (onglet "Mon profil hypo")

- **Bug** : quand plusieurs symptômes sont sélectionnés simultanément dans "Mes signes précoces" (ex: Sueurs, Palpitations, Faim soudaine, Irritabilité), le panneau d'illustration (`div._preview_1o2e3_68`) n'affiche que **l'illustration du dernier symptôme cliqué**.
  **Cible : afficher toutes les illustrations correspondant aux symptômes sélectionnés.**
- Revoir l'agencement général de la page (cf. règle générale 1.2).

---

## 9. Module "Insuline : adapter les doses"

- Supprimer l'item "Temps dans la cible" (`div._tirRow_1ln5d_94`, barre rouge/vert) — jugé sans intérêt.
- Revoir l'agencement général de la page (cf. règle générale 1.2).

---

## 10. Suggestions / idées futures

- Le module "Insuline : adapter les doses" actuel couvre l'adaptation de l'**insuline basale**. Prévoir un **module pédagogique complémentaire** pour apprendre à adapter l'**insuline rapide en pré-prandial** (avant les repas).

---

*Fin du rapport. Les noms de classes CSS mentionnés (ex: `_module_skjie_1`) sont ceux observés en production (build minifié) et servent de repères pour localiser les composants concernés dans le code source.*
