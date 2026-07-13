# Rapport d'audit — ETP Interactif (etp-interactif.vercel.app) — Itération 2

Date : 12/07/2026
Contexte : suite du rapport d'audit précédent (`audit-etp-interactif.md`), dont les corrections ont été implémentées. Cette itération consigne une nouvelle vague de remarques, formulées en navigant l'app en direct, avec le contexte technique nécessaire à Claude Code (qui n'a accès qu'au code source, pas au rendu de la page).

Note générale : plusieurs composants ont changé de hash CSS Modules depuis le 1er rapport (signe qu'ils ont été reconstruits lors de l'implémentation des corrections) : le module "Insuline : adapter les doses" est passé de `1vr1s` à `11ee6`, et le module "Insuline rapide (avant le repas)" est passé de `12ghf` à `idvd4`.

---

## 1. Insuline : adapter les doses > Décider — Logique inversée sur "Baisser la lente" (situation "Plusieurs nuits qui montent")

**Constat :** sur la situation **"Plusieurs nuits qui montent"** (la glycémie grimpe la nuit → la dose de lente est insuffisante), cliquer sur **"Baisser la lente"** affiche le message *"Ça descend trop : on frôle l'hypo au petit matin."* — c'est physiologiquement l'inverse : baisser une dose déjà insuffisante devrait faire **monter** encore plus la glycémie nocturne, pas provoquer une hypo.

**Voir aussi remarque #3 ci-dessous**, qui affine l'analyse de ce bug après vérification croisée avec une 2e situation : il s'agit en réalité d'un échange (swap) de messages entre situations, pas d'un message isolé à corriger.

**Contexte technique** (composant CSS Modules hash `11ee6`, module "Insuline : adapter les doses", onglet "Décider") :
- Bloc : `<div class="_ajustementRow_11ee6_221">` contenant 3 boutons `<button class="chip _ajustementBtn_11ee6_227">` avec icônes Lucide déjà correctes : `lucide-trending-down` (Baisser), `lucide-minus` (Laisser pareil), `lucide-trending-up` (Monter) — les icônes ne sont pas en cause, seul le texte de feedback l'est.
- Message de feedback : `<p class="_ajustementMessage_11ee6_236">`, texte dynamique selon le bouton cliqué et la situation active (`_situationChipActive_11ee6_207`).

---

## 2. Insuline : adapter les doses > Décider — Supprimer les phrases narratives qui donnent la réponse (les 3 situations)

**Demande :** supprimer, pour **chacune des 3 situations**, le texte narratif qui révèle une partie de la réponse avant l'interaction :
- Situation "Plusieurs nuits qui montent" : *"Le taux grimpe pendant la nuit, loin de tout repas — et ça se répète, nuit après nuit, plusieurs nuits d'affilée : une vraie dérive de la lente. Une seule nuit qui dévie, c'est du bruit : on ne bouge pas."*
- Situation "Ça descend la nuit, bas au réveil" : *"La trace glisse vers le bas au fil de la nuit et finit près du plancher au petit matin — plusieurs nuits d'affilée : la lente est trop forte."*
- Situation "Déjà haut après le repas, stable" : *"Le taux est déjà haut juste après le dîner et reste stable toute la nuit, sans grimper davantage — ce n'est pas la nuit qui pose problème."*

**Contexte technique :** ces 3 textes sont portés par le même élément `<p class="_situationDesc_11ee6_213">` dans `_situationCard_11ee6_161`, un par situation.

**Piste pour Claude Code :** retirer le rendu de `_situationDesc_11ee6_213` pour les 3 situations, afin de ne garder que le nom de la situation (le chip) + les 3 boutons d'ajustement + le message de résultat après clic, sans description narrative intermédiaire qui oriente vers la réponse.

---

## 3. Insuline : adapter les doses > Décider — Les messages de feedback "aggravants" sont inversés entre situations

**Constat** (situation **"Ça descend la nuit, bas au réveil"**, où la lente est trop forte, bonne réponse = "Baisser la lente") : cliquer sur **"Monter la lente"** (mauvais choix, qui aggrave un dosage déjà trop fort) affiche *"Ça continue de monter la nuit : on s'éloigne de la cible."* — alors que ça devrait décrire une hypo aggravée, pas une remontée du taux.

**Mapping complet observé des 3 messages génériques utilisés par le composant** (en croisant situations 1 et 2) :
- Message A (réponse correcte) : *"La dérive s'aplatit : on est revenu dans la cible."* → correctement affiché comme bonne réponse dans les 2 situations vérifiées. OK, pas de changement nécessaire.
- Message B : *"Ça continue de monter la nuit : on s'éloigne de la cible."* → correct pour "Laisser pareil" en situation 1 (dose déjà trop faible, ne rien faire = ça continue de monter). **Mais réutilisé à tort pour "Monter la lente" en situation 2**, où il faudrait un message d'hypo aggravée.
- Message C : *"Ça descend trop : on frôle l'hypo au petit matin."* → correct pour "Laisser pareil" en situation 2 (dose déjà trop forte, ne rien faire = ça continue de descendre). **Mais réutilisé à tort pour "Baisser la lente" en situation 1**, où il faudrait un message d'hyperglycémie aggravée.

**Contexte technique :** composant hash `11ee6`, mêmes éléments que la remarque #1 : `_ajustementRow_11ee6_221`, boutons `_ajustementBtn_11ee6_227`, message `_ajustementMessage_11ee6_236`.

**Piste pour Claude Code :** dans la table de données `{situation, choix} → message`, il manque 2 messages distincts supplémentaires (un pour "aggravation vers l'hyperglycémie" — cas "Baisser" en situation 1 — et un pour "aggravation vers l'hypoglycémie" — cas "Monter" en situation 2), au lieu de réutiliser B et C qui semblent actuellement câblés par position de bouton plutôt que par sens réel de l'erreur par rapport à la situation. Vérifier aussi la 3e situation pour le même défaut (voir remarque #4, où le problème est encore plus prononcé : aucune variation du tout).

---

## 4. Insuline : adapter les doses > Décider > "Déjà haut après le repas, stable" — Aucune interactivité (courbe et message figés)

**Constat technique :** sur cette 3e situation, cliquer sur "Baisser la lente", "Laisser pareil" ou "Monter la lente" ne change **ni la courbe** (`<path class="_courbePrincipale_ecn34_31">`, attribut `d` strictement identique dans les 3 cas — 9393 caractères, même tracé) **ni le message de feedback** (`<p class="_ajustementMessage_11ee6_236">` reste bloqué sur *"La lente n'y change presque rien : c'est le rapide du soir qu'on revoit."* quel que soit le choix). Contrairement aux situations 1 et 2 où le message change bien selon le bouton cliqué (même si son contenu est parfois incorrect, cf. remarque #3), ici rien ne réagit du tout.

**Comportement attendu :**
- **Baisser la lente** → courbe **ascendante** avec un point de départ haut (montre l'hyperglycémie qui s'installerait si on baisse une lente qui n'est déjà pas le problème).
- **Laisser pareil** → garder la courbe actuelle (plate, stable).
- **Monter la lente** → courbe **descendante** (montre le risque d'hypo si on monte une lente qui n'est pas en cause).
- Message attendu : *"La lente n'est pas le problème, la courbe de la nuit est plate, c'est le repas ou l'insuline du soir qu'il faut changer. Le risque en augmentant la lente est de se retrouver en hypo si on fait un repas moins riche le soir."*

**Piste pour Claude Code :** dans le composant hash `11ee6`, la situation "Déjà haut après le repas, stable" doit avoir son propre jeu de 3 courbes (une par choix) et son propre jeu de 3 messages, câblés à l'état du bouton actif — actuellement ces deux éléments semblent non implémentés pour cette situation (fallback sur une valeur unique par défaut) ou mal reliés au state du bouton sélectionné. Vérifier la fonction de génération de courbe (partagée avec les situations 1/2, composant de graphe `ecn34`) pour s'assurer qu'elle reçoit bien le paramètre `situation + choix` et pas seulement `situation`.

**Rattaché à la remarque #2 :** la phrase descriptive de cette situation doit également être supprimée (même élément `_situationDesc_11ee6_213`).

---

## 5. Insuline rapide > "Couvrir le repas" — Ajouter un réglage de dose (standard / + / -) croisé avec les 3 repas

**Demande :** ajouter la possibilité de choisir une dose de rapide "standard", "+" (plus) ou "-" (moins), en plus du choix de repas déjà existant (Peu de glucides / Repas moyen / Beaucoup de glucides), et faire en sorte que la courbe s'adapte selon la combinaison choisie — soit **3 réglages de dose × 3 tailles de repas = 9 courbes** possibles au total.

**Contexte technique** (composant CSS Modules hash `idvd4`, onglet "Couvrir le repas" — hash différent du rapport précédent `12ghf`, confirmant que ce composant a été retouché depuis) :
- Sélecteur de repas actuel : `<div class="_chipRow_idvd4_44">` avec 3 boutons "Peu de glucides" / "Repas moyen" / "Beaucoup de glucides" (un seul axe de variation actuellement).
- Graphique : `<div class="card _courbeCard_idvd4_62">`, affichant 2 courbes fixes : "Sans rapide : le pic monte librement" (pointillés) et "Avec rapide : le pic est couvert" (pleine) — cette 2e courbe utilise implicitement une dose "standard" non paramétrable.
- Message sous le graphique : `<p class="_message_idvd4_90">` — "Plus le repas apporte de glucides, plus il faut de rapide pour couvrir la montée du sucre."

**Piste pour Claude Code :**
1. Ajouter un 2e sélecteur (ex. 3 boutons ou un slider "Dose −" / "Dose standard" / "Dose +") à côté ou sous `_chipRow_idvd4_44`.
2. Faire dépendre la génération de la courbe "avec rapide" (composant de graphe `ecn34`) de ces 2 paramètres combinés (taille du repas + niveau de dose), avec 9 combinaisons résultantes : dose standard = pic couvert (comme actuellement), dose "−" pour un repas donné = pic insuffisamment couvert (sucre reste plus haut), dose "+" = risque de creuser sous la cible (hypo), l'écart devant être proportionnellement plus marqué pour "Beaucoup de glucides" que pour "Peu de glucides".
3. Adapter le message `_message_idvd4_90` pour refléter la combinaison sélectionnée.

---

## 6. Insuline rapide > "Corriger avant le repas" — Ajouter un réglage de dose (standard / + / -) croisé avec les 3 glycémies de départ

**Demande :** même principe que la remarque #5 — ajouter un choix de dose de correction ("standard" / "+" / "-") en plus du choix de glycémie de départ déjà existant (Basse / Dans la cible / Haute), avec la courbe qui s'adapte selon la combinaison → 3 × 3 = 9 courbes.

**Contexte technique** (composant hash `idvd4`, onglet "Corriger avant le repas") : structure similaire à l'onglet "Couvrir le repas" — `_chipRow_idvd4_44` pour "Basse/Dans la cible/Haute", `_courbeCard_idvd4_62` pour le graphique, `_message_idvd4_90` pour le texte de conclusion.

**⚠️ Point important, déjà consigné dans le 1er rapport (point 11 : "les courbes ne correspondent pas aux situations décrites") :** cet onglet a un bug connu où la courbe est **strictement identique** entre les 3 états Basse/Cible/Haute (le point de départ ne varie pas selon l'état sélectionné). **Si ce bug n'a pas encore été corrigé, il doit impérativement l'être avant ou en même temps** que l'ajout du réglage de dose — sinon les 9 courbes ne varieront que selon un seul axe (la dose) au lieu de deux.

**Piste pour Claude Code :**
1. Vérifier/corriger d'abord que la courbe varie bien selon Basse/Cible/Haute (point 11 du rapport précédent).
2. Ajouter le 2e sélecteur de dose (même composant/pattern que la remarque #5, mutualisable entre les deux onglets puisqu'ils partagent déjà le même hash `idvd4` et la même structure `_chipRow_`/`_courbeCard_`/`_message_`).
3. Générer les 9 combinaisons : dose standard = comportement actuel par état, dose "+" = risque de sur-correction (hypo, plus marqué si glycémie de départ était déjà "Basse"), dose "-" = correction insuffisante (reste au-dessus de la cible, plus marqué si glycémie de départ était "Haute").

**Remarque transversale pour Claude Code :** vu que les onglets "Couvrir le repas" et "Corriger avant le repas" partagent la même structure (`idvd4`), une implémentation mutualisée (composant de sélection de dose réutilisable) serait pertinente plutôt que deux implémentations séparées et redondantes.

---

*Fin du rapport (itération 2). Les points 1, 3 et 4 concernent tous le même module "Insuline : adapter les doses" (hash `11ee6`) et peuvent être traités ensemble (refonte de la table de données situation/choix → message + courbe). Les points 5 et 6 concernent le module "Insuline rapide" (hash `idvd4`) et devraient être traités avec une logique de dose partagée entre les deux onglets.*
