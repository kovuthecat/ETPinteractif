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
- **Substituts : 5 formes** (patch, gomme, pastille, comprimé sublingual, spray buccal). *(Inhaleur et vapoteuse retirés le 2026-07-08 — cf. `DECISIONS.md`. La vapoteuse reste un outil d'aide à l'arrêt à part entière au niveau clinique, mais n'apparaît plus dans aucun module manipulable : ni comme « forme de substitut » du Module 3, ni comme outil du bac à sable Nicotine du Module 2 — dont les 3 outils manipulables, depuis la réécriture S4 du 2026-07-08, sont Cigarette/Patch/Substitut.)*
- **Sources : affichage discret** (icône dans l'en-tête du module → liste en pop-over).
- **Zéro persistance** : toute manipulation est éphémère (invariant projet).
- **Fiches imprimables** (X1-X4, `docs/BRIEF_TABAC.md` §3.1) : 4 fiches à emporter (craving, substituts,
  motivation, plan d'arrêt), composées à l'écran et imprimées à la volée (`window.print()`) via le
  composant générique `FicheOverlay` — zéro donnée conservée.
- **Fil rouge** (X6, `docs/BRIEF_TABAC.md` §3.4) : refrain du thème en exergue d'accueil et en clôture
  des 4 modules « Comprendre », classe globale `.filrouge`/`.fiche-filrouge`.
- **2ᵉ niveau InfoHover** (X6, `docs/BRIEF_TABAC.md` §3.5) : composant générique créé pour généraliser
  les tooltips de zone, non câblé tant qu'aucun contenu n'est validé par Thibault.

---

## Modules retenus (cadrage v1 + v2 + extensions 2026-07-09)

1. Les composantes de l'addiction
2. La nicotine : cinétique & seuils
3. Utilisation des substituts & titration du patch
4. La nicotine n'est pas le toxique
5. Le piège du soulagement
6. Gérer le craving (4D)
7. Explorer ma motivation (ajouté 2026-07-01, `PLAN_corrections-v2.md` R9)
8. Mon plan d'arrêt (ajouté 2026-07-09, brief §3.2)

Carte des renvois (portes de fin de module, `ModuleFooterNav`, X6) : Nicotine → Substituts, Soulagement ·
Soulagement → Substituts, Craving · Craving → Motivation, Plan d'arrêt · Substituts → Plan d'arrêt,
Nicotine · Motivation → Plan d'arrêt · Nicotine ≠ toxique → Substituts, Nicotine (inchangé) · Addiction →
portes contextuelles dans le panneau (pas de pied dupliqué) · Plan d'arrêt → aucune (la fiche est la sortie).

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

**Structure interactive (frise 24 h, tel que codé dans `NicotineModule.tsx` depuis S4/refonte-ui)** : un
graphique (temps 0–24 h en x, nicotinémie en y, **relatif, sans unité**) avec **3 zones** empilées
(SURDOSAGE / ZONE DE CONFORT / MANQUE, bandes soft + libellés capitales) et une courbe recomposée en
direct à partir des événements placés.

Mécanique : choisir un **outil** (Cigarette / Patch / Substitut) puis **cliquer sur la frise** pour
poser un événement à cet instant (le geste « placer sur la frise », repris en Module 5) ; clic sur un
marqueur pour le retirer. Le **patch** se règle en **quarts de dose ±¼** (boutons − / + sur le
marqueur) ; une **chip « Pic atteint : \<zone> »** affiche en direct la zone atteinte par le pic de la
courbe ; les libellés **MANQUE**/**SURDOSAGE** portent une **tooltip au survol/focus** listant les
signes correspondants (embryon du 2ᵉ niveau de lecture, §3.5 du brief). Bouton « Réinitialiser » si des
événements sont posés.

*(La vapoteuse ne fait plus partie des outils du bac à sable depuis la réécriture S4 du 2026-07-08 —
seuls Cigarette, Patch et Substitut sont manipulables ici.)*

**Messages clés** : pic rapide = renforcement ; chute sous le seuil = craving ; bon usage des substituts = rester dans la zone sans combustion.

**Modèle de courbe** : logique pure dans `src/features/tabac/lib/nicotineCurve.ts` (`sampleCurve`,
`classifyZone`, `toSvgPath`), testée Vitest — ne jamais la dupliquer dans un composant.

**Vigilance** : courbes **pédagogiques, non pharmacocinétiques** (mention « schéma illustratif »). Renvois → Modules 3 et 5 (portes de fin de module, `ModuleFooterNav`).
**Sources** : HAS / Tabac Info Service *(à compléter)*.

---

### Module 3 — Utilisation des substituts & titration du patch

**Objectif** : bonnes pratiques par forme + démystifier le dosage (le sous-dosage est une cause fréquente d'échec), en **autonomisant** la personne.

**Partie A — Bonnes pratiques par forme.** Sélecteur de formes ; chaque forme = « bonnes pratiques » + « erreurs fréquentes » :

- Patch (24 h / 16 h), gomme, pastille, comprimé sublingual, spray buccal.
  *(Inhaleur et vapoteuse retirés le 2026-07-08 — décision Thibault, cf. `DECISIONS.md` ; les 5 formes conservées ont toutes un contenu validé.)*

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

1. **La vague de l'envie** : courbe en cloche (tracé Bézier) ; bouton « Je ressens un craving » →
   **compte à rebours réel de 3 min** (horloge `3:00 → 0:00`, `CRAVING_DURATION = 180` s dans
   `CravingModule.tsx`), un repère parcourt la vague au même rythme. **3 phases** : `idle` (« Une envie
   arrive ? »), `active` (compte à rebours + 4D affichés), `done` (« La vague est passée » — réservé à
   la fin réelle du décompte). Bouton « Recommencer » en phase `done`.
2. **Les 4 D** (cartes cliquables/bascules, actives pendant la phase `active`), libellés exacts du
   code :
   - **Différer** : attendre que la vague passe.
   - **Détourner l'attention** : occuper les mains et l'esprit quelques minutes.
   - **Se détendre — respirez** : respiration lente — **animation de respiration** (cercle qui grandit/se
     resserre, inspire/expire 5 s, en boucle quand la carte est activée).
   - **D'eau** : boire un verre d'eau lentement, en petites gorgées.
   - Aparté discret, en toute phase : en parler / **Tabac Info Service 39 89**.
3. **Fiche « Ma carte anti-envie »** (X2) : bouton « Préparer ma carte » (hors phase `active`) → voir
   `docs/BRIEF_TABAC.md` §3.1.

**Renvoi** ← Module 1 (composantes psychologique & comportementale) · **Portes de fin de module**
(X6) → Motivation, Plan d'arrêt.
**Sources** : HAS / Tabac Info Service *(à compléter)*.

---

### Module 7 — Explorer ma motivation

**Objectif** : module centré sur le **positif**, sans balance décisionnelle (jugée limitante, cf. arbitrage
Thibault du 2026-07-01) — faire le point sur ses raisons d'arrêter, à son rythme.

**Structure interactive (2 onglets, `MotivationModule.tsx`)** :

1. **Onglet « Où en êtes-vous ? » — flux de 2 questions + synthèse** : un **cadran circulaire à
   glisser** (composant `Dial`, 0–10) pour chaque question, l'une après l'autre — « À quel point est-ce
   important pour vous d'arrêter ? » (Importance) puis « À quel point vous sentez-vous capable /
   confiant(e) ? » (Confiance). Sous chaque valeur, une **relance non culpabilisante** façon entretien
   motivationnel : « Pourquoi pas *[valeur − 1]* plutôt que *[valeur]* ? » (fait verbaliser ses propres
   raisons du niveau atteint plutôt que de le justifier a posteriori) et « Qu'est-ce qui aiderait à
   passer à *[valeur + 1]* ? ». Un écran de synthèse récapitule les deux valeurs (« ↺ Revoir mes
   réponses » pour recommencer). Éphémère (state React), pas de sauvegarde.
2. **Onglet « Mes raisons » (tableau blanc)** : une **réserve** de cartes seed — **clic sur une carte de
   la réserve** l'ajoute au tableau (elle quitte la réserve) ; sur le tableau, les cartes se
   **repositionnent au pointeur** (pointer events natifs, aucune librairie de drag) et un **clic sans
   déplacement ouvre l'édition** (champ raison + détail personnel optionnel, bouton Supprimer) ; « + une
   raison » crée une carte vierge directement en édition.

**Contenu de départ (cartes seed)**, catégories de raisons couramment citées pour l'arrêt du tabac,
**neutres et non médicales** (pas une affirmation clinique à sourcer HAS), libellés exacts du code
(`MOTIVATION_SEED`) : Ma santé, Mes proches, Le budget, Le goût / l'odorat, Mon souffle / ma forme, Ma
liberté.

*(Cette liste de cartes seed et les libellés des deux échelles étaient une proposition de Claude — cf.
`PLAN_corrections-v2.md` R9 — **validés par Thibault le 2026-07-08**, cf. `DECISIONS.md` et
`VALIDATION.md`.)*

**Vigilance** : pas de balance décisionnelle (avantages/inconvénients du tabac) ; ton positif et non
injonctif. **Portes de fin de module** (X6) → Plan d'arrêt. **Fiche « Mes raisons »** (X4) : bouton
« Imprimer mes raisons », visible dès qu'au moins une carte est sur le tableau — voir
`docs/BRIEF_TABAC.md` §3.1.
**Sources** : catégories génériques d'entretien motivationnel, pas de donnée clinique chiffrée nécessitant une
source HAS/Tabac Info Service.

---

### Module 8 — Mon plan d'arrêt (ajouté 2026-07-09)

**Objectif** : clore l'arc du thème par l'**application** — rassembler ce qui a été compris et choisi
(date, substituts, situations à risque, parades, raisons) en un plan concret, imprimé, collé au frigo.
Contenu détaillé, décisions et libellés exacts : `docs/BRIEF_TABAC.md` §3.2 (autorité normative — non
dupliqué ici). **Aucune porte de fin de module** : la fiche imprimée est la sortie du module.
**Sources** : aucune (pas de contenu clinique chiffré — reprend, en chips, des libellés déjà validés des
modules Substituts, Addiction, Craving et Motivation).

---

## Données cliniques (validées 2026-06-28, complétées 2026-07-08/09)

- **Titration** : pas de calcul de dose (méthode illustrée) ; ¼ de patch tous les 2-3 jours tant qu'envie persiste sans surdosage ; pas de dose max (borne = ressenti) ; retour à la dose précédente si surdosage ; signes = nausées, écœurement, céphalées, palpitations, rêves intenses ; patchs sécables ; nuance jour/nuit (dose nuit plus faible si troubles du sommeil) ; objectif d'autonomisation/expérimentation.
- **Vapoteuse** : outil d'aide à l'arrêt à part entière ; dosage traité **qualitativement**. *(N'apparaît plus comme forme du Module 3 depuis le 2026-07-08 ; n'est plus non plus un outil manipulable du bac à sable Nicotine, Module 2, depuis sa réécriture S4 le même jour — seuls Cigarette/Patch/Substitut y figurent désormais.)*
- **Craving** : 4 D (Différer, Détourner l'attention, Se détendre — respirez, D'eau) + aparté Tabac Info Service 39 89 ; vague réelle de 3 min (idle/active/done).
- **Motivation** : cadran circulaire 0–10 (Importance, Confiance) + cartes seed — libellés validés par Thibault le 2026-07-08.
- **Sources** : affichage discret.

## Reste à fournir par Thibault (non bloquant pour le squelette)

- Références de sources exactes par module.
