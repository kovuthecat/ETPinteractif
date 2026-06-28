# Contenu des modules — thème : sevrage tabagique

> **Statut : cadrage validé le 2026-06-28** (décisions de conception arrêtées).
> ⚠️ **Données cliniques à compléter par Thibault** avant implémentation des modules 3 (titration) — voir §"Données cliniques à fournir".
> Tout contenu médical devra être **sourcé** (HAS, Tabac Info Service).

---

## Décisions de conception transverses

- **Style d'interaction : manipulation libre.** Les modules sont des « bacs à sable » : curseurs/boutons manipulés par le soignant ou le patient, résultat affiché en direct (≠ scénarios cliqués pas-à-pas).
- **Graphiques : qualitatif / relatif.** Pas d'unités ni de valeurs chiffrées ; afficher la mention « schéma illustratif ».
- **Module 1 = carte d'orientation.** Conseils ultra-courts + renvois vers les modules dédiés, pas de duplication.
- **Public : les deux selon le moment** (ambivalents et engagés). Ton **non injonctif** ; les leviers motivationnels restent disponibles mais ne sont pas imposés.
- **Substituts : toutes les formes + la vapoteuse.**
- **Zéro persistance** : toute saisie/manipulation est éphémère (invariant projet).

**Question encore ouverte (transverse) :** affichage des sources médicales — visible dans chaque module, ou discret (icône/au survol) ? → à trancher.

---

## Modules retenus (cadrage v1)

1. Les composantes de l'addiction
2. La nicotine : cinétique & seuils
3. Utilisation des substituts & titration du patch
4. La nicotine n'est pas le toxique
5. Le piège du soulagement
6. Gérer le craving (4D)

Carte des renvois : 1 → 2, 3, 6 · 4 ↔ 2, 3 · 5 ↔ 1, 2 · 6 ← 1

---

### Module 1 — Les composantes de l'addiction

**Objectif** : comprendre que l'addiction au tabac a 3 dimensions imbriquées, chacune avec ses leviers.

**Structure interactive** : 3 piliers cliquables — **Physique (nicotinique)** · **Psychologique** · **Comportementale**.
Clic sur un pilier → 2 onglets : « De quoi parle-t-on ? » (exemples illustrés) puis « Outils / stratégies » (conseils courts + renvois). Les 3 piliers restent visibles (vision d'ensemble).

| Composante | Exemples (« de quoi on parle ») | Outils (courts) + renvois |
|---|---|---|
| Physique | manque, irritabilité, nervosité, troubles concentration/sommeil, fringales, craving | substituts adaptés → *Module 3* ; comprendre le manque → *Module 2* |
| Psychologique | stress, anxiété, ennui, plaisir, récompense, stimulation, « anti-déprime » | gestion stress/respiration, alternatives plaisir → *Module 6* |
| Comportementale | automatismes : café-clope, après repas, pause, voiture, téléphone, social, alcool | repérer/rompre les associations, modifier routines → *Module 6* |

**Point de vigilance** : rester une carte d'orientation, ne pas dupliquer le contenu des modules dédiés.

---

### Module 2 — La nicotine : cinétique & seuils

**Objectif** : visualiser pourquoi on fume « pour ne pas être en manque » et comment les substituts maintiennent la nicotinémie dans la zone confortable.

**Structure interactive (bac à sable)** : un graphique unique (temps en x, nicotinémie en y) avec **2 lignes horizontales** : *seuil de manque* (dessous → craving) et *seuil de tolérance* (au-dessus → inconfort/surdosage). La zone entre les deux = « zone confortable ».

Contrôles manipulables librement, la courbe se recompose en direct :
- **Fumer une cigarette** : pic rapide et haut, puis chute → illustre le yo-yo et le pic rapide (renforçant).
- **Patch (continu)** : toggle → plateau stable au-dessus du seuil de manque (comble le fond).
- **Substitut ponctuel** : petit pic lent à la demande (gère les pics).
- **Vapoteuse** : pics intermédiaires modulables (entre cigarette et patch ; à la demande sans combustion).
- Combinaisons possibles (ex. patch + ponctuel) → rester dans la zone confortable.

**Messages clés** : pic rapide = renforcement ; chute sous le seuil = craving ; le bon usage des substituts = rester dans la zone sans combustion.

**Points de vigilance** : courbes **pédagogiques, non pharmacocinétiques** (mention « schéma illustratif ») ; pas de valeurs chiffrées. Renvois → Modules 3 et 5.

---

### Module 3 — Utilisation des substituts & titration du patch

**Objectif** : bonnes pratiques par forme + démystifier le dosage (le sous-dosage est une cause fréquente d'échec).

**Partie A — Bonnes pratiques par forme.** Sélecteur de formes ; chaque forme = mode d'emploi visuel + erreurs fréquentes :
- Patch (24 h / 16 h), gomme, pastille, comprimé sublingual, inhaleur, spray buccal, **vapoteuse**.

**Partie B — Assistant de titration du patch (échelle interactive manipulable)** :
```
Dose de départ → "Envie de fumer persistante ?"
     ├ oui + pas de signe de surdosage → + ¼ de patch → réévaluer
     ├ signes de surdosage → − ¼ de patch
     └ stable → dose d'entretien
```
Échelle/curseur que l'on monte par ¼, avec à chaque palier les deux check « envie ? » / « surdosage ? ».

**Points de vigilance** : insister sur le risque de sous-dosage ; illustration du « ¼ » dépend de la réponse sécable/superposition.

> ⚠️ **Bloquant** : contenu clinique de la Partie B à fournir (voir §"Données cliniques à fournir").

---

### Module 4 — La nicotine n'est pas (le principal) toxique

**Objectif** : lever le frein n°1 à l'usage des substituts/vapoteuse (« je remplace une drogue par une autre »).

**Structure interactive** : comparatif visuel **fumée de cigarette** (goudrons, monoxyde de carbone, +7000 substances, ~70 cancérogènes → c'est ce qui rend malade) vs **nicotine** (responsable de la dépendance, pas des cancers/maladies). Manipulation : cliquer/basculer les composants pour voir « ce qui crée la dépendance » vs « ce qui rend malade ».

**Renvois** → Modules 3 (donc substituts/vapoteuse acceptables) et 2.
**Point de vigilance** : message précis (la nicotine n'est pas anodine, mais ce n'est pas elle qui tue) — formulation à sourcer.

---

### Module 5 — Le piège du soulagement

**Objectif** : déconstruire le « plaisir » de la cigarette — elle soulage surtout le manque qu'elle a elle-même créé.

**Structure interactive** : s'appuie sur la courbe du Module 2. Comparer **non-fumeur** (ligne stable, pas de manque) vs **fumeur** (yo-yo : la cigarette ne fait que ramener au niveau « normal »). Le « plaisir » ressenti = soulagement du manque, pas un gain réel.

**Renvois** ↔ Modules 1 et 2.
**Point de vigilance** : ton **non culpabilisant** (cohérent avec le public mixte).

---

### Module 6 — Gérer le craving (4D)

**Objectif** : montrer que l'envie est une **vague de quelques minutes** qui retombe, et donner des techniques immédiates.

**Structure interactive** : minuteur « l'envie passe » — une courbe en vague (monte puis redescend) avec un bouton qui lance le compte à rebours et la fait retomber. + cartes des **4D** à explorer.

> ⚠️ **À valider** : la liste exacte des « 4D » (ou 5D) que tu utilises. Proposition à confirmer : **Différer · se Distraire · respirer (Décontraction) · boire de l'eau**.

**Renvoi** ← Module 1 (composantes psychologique & comportementale).

---

## Données cliniques à fournir par Thibault

Bloquant pour finaliser les modules concernés :

**Titration du patch (Module 3-B)**
1. Dose de départ selon la consommation (règle exacte).
2. Cadence d'ajustement (délai avant d'ajouter un ¼, rythme de réévaluation).
3. Dose maximale (garde-fou).
4. Liste des signes de surdosage retenue.
5. ¼ de patch = sécable ou superposition ?

**Vapoteuse (Modules 2 & 3)**
6. Positionnement/ton : outil d'aide à l'arrêt à part entière, ou avec réserve ?
7. Dosage : on reste qualitatif, ou repères en mg/mL / type de matériel ?

**Module 6**
8. Validation de la liste 4D/5D.

**Transverse**
9. Affichage des sources : visible ou discret ?

---

## Questions ouvertes (rappel)
- Quel module développer en premier comme **preuve de concept** de la manipulation libre ? (le Module 2 est le meilleur candidat : il sert aussi de socle aux modules 5 et — partiellement — 3.)
