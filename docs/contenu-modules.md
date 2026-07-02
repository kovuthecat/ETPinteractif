# Contenu des modules — thème : sevrage tabagique

> **Statut : contenu validé le 2026-06-28** (données cliniques fournies par Thibault).
> Tout contenu médical s'appuie sur des références validées (HAS, Tabac Info Service).
> ⚠️ Les **références de sources exactes** restent à compléter par Thibault (placeholders dans chaque module).

---

## Décisions de conception transverses

- **Style d'interaction : manipulation libre.** Modules = « bacs à sable » (curseurs/boutons, rendu en direct).
- **Graphiques : qualitatif / relatif.** Aucune unité ni valeur chiffrée ; mention « schéma illustratif ».
- **Module 1 = carte d'orientation.** Conseils ultra-courts + renvois, pas de duplication.
- **Public mixte** (ambivalents + engagés) → ton **non injonctif**, leviers motivationnels disponibles non imposés.
- **Substituts : toutes les formes + la vapoteuse** (vapoteuse = outil d'aide à l'arrêt à part entière).
- **Sources : affichage discret** (icône dans l'en-tête du module → liste en pop-over).
- **Zéro persistance** : toute manipulation est éphémère (invariant projet).

---

## Modules retenus (cadrage v1 + v2)

1. Les composantes de l'addiction
2. La nicotine : cinétique & seuils
3. Utilisation des substituts & titration du patch
4. La nicotine n'est pas le toxique
5. Le piège du soulagement
6. Gérer le craving (4D)
7. Explorer ma motivation (ajouté 2026-07-01, `PLAN_corrections-v2.md` R9)

Carte des renvois : 1 → 2, 3, 6 · 4 ↔ 2, 3 · 5 ↔ 1, 2 · 6 ← 1

---

### Module 1 — Les composantes de l'addiction

**Objectif** : comprendre que l'addiction au tabac a 3 dimensions imbriquées, chacune avec ses leviers.

**Structure interactive** : 3 piliers cliquables — **Physique (nicotinique)** · **Psychologique** · **Comportementale**. Clic sur un pilier → 2 onglets : « De quoi parle-t-on ? » (exemples) puis « Outils / stratégies » (conseils courts + renvois). Les 3 piliers restent visibles.

| Composante | Exemples (« de quoi on parle ») | Outils (courts) + renvois |
| --- | --- | --- |
| Physique | manque, irritabilité, nervosité, troubles concentration/sommeil, fringales, craving | substituts adaptés → *Module 3* ; comprendre le manque → *Module 2* |
| Psychologique | stress, anxiété, ennui, plaisir, récompense, stimulation, « anti-déprime » | gestion stress/respiration, alternatives plaisir → *Module 6* |
| Comportementale | automatismes : café-clope, après repas, pause, voiture, téléphone, social, alcool | repérer/rompre les associations, modifier routines → *Module 6* |

**Vigilance** : rester une carte d'orientation, ne pas dupliquer les modules dédiés.
**Sources** : HAS / Tabac Info Service *(références exactes à compléter)*.

---

### Module 2 — La nicotine : cinétique & seuils

**Objectif** : visualiser pourquoi on fume « pour ne pas être en manque » et comment les substituts maintiennent la nicotinémie dans la zone confortable.

**Structure interactive (bac à sable)** : un graphique (temps en x, nicotinémie en y, **relatif, sans unité**) avec **2 lignes horizontales** : *seuil de manque* (dessous → craving) et *seuil de tolérance* (au-dessus → inconfort). Zone entre les deux = « zone confortable » (bande discrète).

Contrôles manipulables, la courbe se recompose en direct :

- **Fumer une cigarette** (bouton) : pic rapide et haut, décroissance rapide → yo-yo, pic = renforçant.
- **Patch (continu)** (toggle) : plateau stable au-dessus du seuil de manque (comble le fond).
- **Substitut ponctuel** (bouton) : petit pic lent à la demande (gère les pics).
- **Vapoteuse** (bouton/toggle) : pics intermédiaires (entre cigarette et patch ; à la demande sans combustion).
- **Réinitialiser**.

**Messages clés** : pic rapide = renforcement ; chute sous le seuil = craving ; bon usage des substituts = rester dans la zone sans combustion.

**Modèle de courbe (fixé par Opus, valeurs relatives 0–1)** — voir constantes dans le PLAN :
seuil manque ≈ 0.25 · seuil tolérance ≈ 0.80 · plateau patch ≈ 0.45 · cigarette : amplitude ≈ 0.90, décroissance rapide · ponctuel : amplitude ≈ 0.35, montée/descente lentes · vapoteuse : amplitude ≈ 0.50, intermédiaire.

**Vigilance** : courbes **pédagogiques, non pharmacocinétiques** (mention « schéma illustratif »). Renvois → Modules 3 et 5.
**Sources** : HAS / Tabac Info Service *(à compléter)*.

---

### Module 3 — Utilisation des substituts & titration du patch

**Objectif** : bonnes pratiques par forme + démystifier le dosage (le sous-dosage est une cause fréquente d'échec), en **autonomisant** la personne.

**Partie A — Bonnes pratiques par forme.** Sélecteur de formes ; chaque forme = « bonnes pratiques » + « erreurs fréquentes » :

- Patch (24 h / 16 h), gomme, pastille, comprimé sublingual, inhaleur, spray buccal, **vapoteuse**.

**Contenu validé par Thibault (2026-07-01) — intégré dans le code :**

*Patch (24 h / 16 h)* — bonnes pratiques : appliquer 1 patch le matin au réveil ; changer de site chaque jour ; effet ~30 min après application ; garder le patch la nuit autant que possible.
Erreurs : attendre un effet immédiat ; retirer le patch la nuit sans raison ; reposer au même endroit.

*Gomme* — bonnes pratiques : prendre une gomme dès que l'envie se fait sentir ; mâcher lentement 5–6 fois puis garder contre la joue ~2 min ; remâcher et reposer, ~30 min au total ; gérer au coup par coup.
Erreurs : mâcher vite et en continu (nicotine avalée) ; avaler la salive.

*Pastille* — bonnes pratiques : prendre dès que l'envie se fait sentir ; laisser fondre sous la langue ou contre la joue ; effet en 2–3 min.
Erreurs : croquer ou avaler la pastille.

*Comprimé sublingual* — bonnes pratiques : prendre un ou deux comprimés dès que l'envie se fait sentir ; laisser fondre sous la langue ou contre la joue ; effet en quelques minutes.
Erreurs : croquer ou avaler le comprimé.

*Spray buccal* — bonnes pratiques : une ou deux pulvérisations dès que l'envie se fait sentir ; pulvériser sur l'intérieur des joues ; efficace en ~1 min.
Erreurs : viser le fond de la gorge / inhaler la pulvérisation.

*Inhaleur / Vapoteuse* — contenu non encore fourni ; affichage « Fiche en cours de rédaction — à voir avec votre soignant » (à compléter par Thibault).

**Partie B — Méthode de titration du patch (illustration de la MÉTHODE, pas un calculateur)** :

Principes (données cliniques validées) :

- **Pas de calcul de dose** : on illustre la méthode et on invite à l'expérimentation et à l'écoute du ressenti.
- Ajuster **par ¼ de patch** (patchs **sécables**).
- **Tous les 2 à 3 jours** : si l'**envie de fumer persiste** ET **pas de signe de surdosage** → **ajouter ¼ de patch**.
- **Signes de surdosage** : nausées, écœurement, céphalées, palpitations, rêves intenses → **revenir à la dose précédente** (pas de dose maximale théorique, c'est le ressenti qui borne).
- **Jour / nuit** : si une « bonne » dose de jour **perturbe le sommeil**, possibilité de **garder une dose plus faible la nuit**.

**Structure interactive (illustrative de la méthode)** :

- Un patch représenté en **quarts**. Deux retours que l'utilisateur bascule : « envie persiste » et « signes de surdosage ».
- Bouton « **+ ¼ (à J+2-3)** » (actif si envie persiste & pas de surdosage) ; « surdosage → **revenir en arrière** ».
- Toggle **Jour / Nuit** montrant deux patchs (ex. dose de jour vs dose de nuit plus faible).
- Message permanent : « expérimentez, fiez-vous à votre ressenti ».

**Vigilance** : insister sur le risque de sous-dosage ; rester qualitatif (aucune dose en mg).
**Sources** : HAS / Tabac Info Service *(à compléter)*.

---

### Module 4 — La nicotine n'est pas (le principal) toxique

**Objectif** : lever le frein n°1 à l'usage des substituts/vapoteuse (« je remplace une drogue par une autre »).

**Structure interactive** : comparatif visuel à deux colonnes, avec bascule **« ce qui crée la dépendance »** / **« ce qui rend malade »** qui met en évidence le bon groupe :

- **Ce qui rend malade (la fumée / la combustion)** : goudrons, monoxyde de carbone (CO), particules fines, ~7000 substances chimiques, ~70 cancérogènes connus.
- **Ce qui crée la dépendance** : la **nicotine** — responsable de la dépendance, **pas** des cancers/maladies de la fumée. (Nuance : la nicotine n'est pas anodine — p. ex. grossesse — mais ce n'est pas elle qui tue.)

Interaction : cliquer un composant pour afficher son rôle/effet.

**Renvois** → Modules 3 (substituts/vapoteuse acceptables) et 2.
**Vigilance** : formulation précise (nuance nicotine non anodine) — à sourcer.
**Sources** : HAS / Tabac Info Service *(à compléter)*.

---

### Module 5 — Le piège du soulagement

**Objectif** : déconstruire le « plaisir » — la cigarette soulage surtout le manque qu'elle a elle-même créé.

**Structure interactive** : réutilise le **moteur de courbe du Module 2**. Bascule **non-fumeur** (ligne stable, jamais en manque) vs **fumeur** (yo-yo : la cigarette ne fait que ramener au niveau « normal »). Annotation : le « plaisir » ressenti = soulagement du manque, pas un gain réel.

**Renvois** ↔ Modules 1 et 2.
**Vigilance** : ton **non culpabilisant**.
**Sources** : HAS / Tabac Info Service *(à compléter)*.

---

### Module 6 — Gérer le craving (4D)

**Objectif** : montrer que l'envie est une **vague de quelques minutes** qui retombe, et donner des techniques immédiates.

**Structure interactive** :

1. **La vague de l'envie** : courbe en cloche ; bouton « Une envie arrive » → un repère parcourt la vague en **~30 s** (représentant les quelques minutes réelles), états affichés : *ça monte → pic → ça redescend → c'est passé*. Replay possible.
2. **Les 4 D** (cartes cliquables, chacune déplie un conseil concret) :
   - **Différer** : attendre que la vague passe (quelques minutes).
   - **Distraire** : faire autre chose, occuper les mains et l'esprit.
   - **Décontracter** : respiration lente — petite **animation de respiration** (cercle, inspire 4 s / expire 6 s, en boucle quand activée).
   - **De l'eau** : boire un grand verre d'eau lentement.
   - Aparté discret : en parler / **Tabac Info Service 39 89**.

**Renvoi** ← Module 1 (composantes psychologique & comportementale).
**Sources** : HAS / Tabac Info Service *(à compléter)*.

---

### Module 7 — Explorer ma motivation

**Objectif** : module centré sur le **positif**, sans balance décisionnelle (jugée limitante, cf. arbitrage
Thibault du 2026-07-01) — faire le point sur ses raisons d'arrêter, à son rythme.

**Structure interactive** :

1. **Outil A — Échelles 0–10** : deux curseurs — « À quel point est-ce important pour vous d'arrêter ? » et
   « À quel point vous sentez-vous capable / confiant(e) ? ». Sous chaque valeur, une **relance non
   culpabilisante** façon entretien motivationnel : « Pourquoi pas *[valeur − 1]* plutôt que *[valeur]* ? »
   (fait verbaliser ses propres raisons du niveau atteint plutôt que de le justifier a posteriori) et
   « Qu'est-ce qui aiderait à passer à *[valeur + 1]* ? ». Éphémère (state React), pas de sauvegarde.
2. **Outil C — « Mes raisons » (tableau blanc)** : cartes déplaçables (pointer events natifs + flèches du
   clavier, aucune librairie de drag), éditables (champ raison + détail personnel optionnel), et création de
   nouvelles cartes vierges via « + une raison ».

**Contenu de départ (cartes seed)** — catégories de raisons couramment citées pour l'arrêt du tabac, **neutres
et non médicales** (pas une affirmation clinique à sourcer HAS) : santé, argent économisé, goût/odorat,
souffle/forme physique, proches, liberté de ne plus dépendre.

**⚠️ À valider par Thibault** : la liste de cartes seed ci-dessus et les libellés des deux échelles sont une
proposition de Claude (cf. `PLAN_corrections-v2.md` R9, « Si bloqué ») — à confirmer, ajuster ou remplacer.

**Vigilance** : pas de balance décisionnelle (avantages/inconvénients du tabac) ; ton positif et non injonctif.
**Sources** : catégories génériques d'entretien motivationnel, pas de donnée clinique chiffrée nécessitant une
source HAS/Tabac Info Service.

---

## Données cliniques (validées 2026-06-28)

- **Titration** : pas de calcul de dose (méthode illustrée) ; ¼ de patch tous les 2-3 jours tant qu'envie persiste sans surdosage ; pas de dose max (borne = ressenti) ; retour à la dose précédente si surdosage ; signes = nausées, écœurement, céphalées, palpitations, rêves intenses ; patchs sécables ; nuance jour/nuit (dose nuit plus faible si troubles du sommeil) ; objectif d'autonomisation/expérimentation.
- **Vapoteuse** : outil d'aide à l'arrêt à part entière ; dosage traité **qualitativement**.
- **Craving** : 4 D (Différer, Distraire, Décontracter, De l'eau) + aparté Tabac Info Service 39 89.
- **Sources** : affichage discret.

## Reste à fournir par Thibault (non bloquant pour le squelette)

- Références de sources exactes par module.
- Contenu « bonnes pratiques / erreurs fréquentes » pour l'**inhaleur** et la **vapoteuse** (Module 3-A) — en attente, repli « fiche en cours de rédaction » affiché dans l'app.
