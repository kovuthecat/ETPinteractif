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

**Modèle de courbe** (refonte S3, 2026-07-09) : logique pure dans `src/features/tabac/lib/nicotineCurve.ts` avec invariants testés Vitest. Le modèle reflète les ordres de grandeur réels (demi-vie plasmatique ≈ 2 h, pic cigarette < 10 min, patch montée 2-4 h) tout en restant pédagogique :
- **Élimination commune** (~2 h) : même molécule, même demi-vie quelle que soit la forme.
- **Profils d'absorption par source** : cigarette (pic < 10 min, bolus rapide), forme orale (pic ~30 min), patch (montée exponentielle, plateau ~3-4 h).
- **Saturation (tolérance)** : l'accumulation de brutes contributions plafonne, reflétant le plafonnement réel de la tolérance aux récepteurs — enchaînement de cigarettes ne fait pas exploser la courbe mais la maintient en haut zone confort/surdosage.
- **Tension du manque dérivée du niveau** : le craving suit la nicotinémie (bas niveau = tension haute, haut niveau = tension basse), renforçant la cohérence entre Modules 2 et 5.

Invariants garantis (voir `nicotineCurve.test.ts`, 37+ tests) : clairance nocturne complète (~6 h), accumulation progressive en journée, mono-cigarette en zone confort moitié haute, titration de patch par quarts visible, pic patch+cigarette bien dosé en surdosage.

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

**Modèle de tension** (refonte S3, 2026-07-09) : tiré de la nicotinémie réelle via la fonction `tensionLevelAt()`. Tension au plancher quand la nicotinémie est haute (juste après cigarette), remontée progressive vers `TENSION_HIGH` quand elle redescend (craving qui grandit). Fumeur régulier débute sa journée avec une tension élevée (TENSION_VIRTUAL_START), non-fumeur constant (TENSION_NONSMOKER bas). Invariant 15 en `nicotineCurve.test.ts` valide la cohérence : creux de tension = pic de niveau, pic de tension = creux de niveau. Délai de remontée de tension ~2 h (TENSION_TAU).

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

### Module 9 — Ce que l'arrêt répare

**Objectif** : visualiser concrètement et positivement les bénéfices de l'arrêt, organe par organe, dès les premières heures et tout au long de la vie. Registre **exclusivement positif** — jamais l'organe malade, seulement ce qui va mieux. Famille Se motiver.

**Structure interactive** : réutilise la **silhouette générique** (promue en S2) avec 7 zones cliquables (cerveau, bouche, cœur, poumons, sang/vaisseaux, peau, jambes). Une **frise de 10 jalons** (20 minutes → 10-15 ans) affiche l'échéance en chip cliquable, les zones du jalon courant s'allument, celles des jalons passés se verrouillent « acquis ». Clic sur une zone → détail avec vignette (illustration par zone) et liste de **tous** les bénéfices de cette zone (leurs dates, les acquis cochés).

| # | Échéance | Zones | Texte du bénéfice |
| --- | --- | --- | --- |
| 1 | 20 minutes | cœur | La pression artérielle et la fréquence cardiaque redeviennent normales. |
| 2 | 8 heures | sang | Le monoxyde de carbone dans le sang diminue de moitié. L'oxygénation des cellules redevient normale. |
| 3 | 24 heures | poumons, cœur | Le monoxyde de carbone est totalement éliminé. Les poumons commencent à évacuer le mucus et les résidus de fumée. Le risque d'infarctus commence déjà à baisser. |
| 4 | 48 heures | bouche | Le goût et l'odorat s'améliorent : les terminaisons nerveuses du goût commencent à repousser. |
| 5 | 72 heures | poumons | Respirer devient plus facile : les bronches se relâchent, l'énergie augmente. |
| 6 | 2 semaines à 3 mois | jambes, peau | La circulation sanguine s'améliore, la marche et l'effort deviennent plus faciles. Le teint s'éclaircit. |
| 7 | 1 à 9 mois | poumons | La toux et la fatigue diminuent. Les cils bronchiques repoussent, le souffle revient. |
| 8 | 1 an | cœur | Le risque d'infarctus du myocarde diminue de moitié. |
| 9 | 5 ans | cerveau, bouche | Le risque d'accident vasculaire cérébral rejoint celui d'une personne n'ayant jamais fumé. Le risque de cancers de la bouche, de la gorge et de l'œsophage diminue de moitié. |
| 10 | 10 à 15 ans | poumons, cœur | Le risque de cancer du poumon diminue de moitié. Le risque de maladie cardiaque et l'espérance de vie rejoignent ceux des personnes n'ayant jamais fumé. |

*(Chiffres à revalider par Thibault — source : Tabac Info Service / OMS.)*

**Message transverse permanent** : « Ces étapes se déclenchent quel que soit l'âge, le nombre d'années de tabac ou de tentatives précédentes. Il n'est jamais trop tard — ni trop tôt. »

**Vigilance** : ton positivement frais (aucune menace, aucun organe malade, aucun compte à rebours anxiogène). Renvois → Module Motivation, Plan d'arrêt (portes fin de module, `ModuleFooterNav`).
**Sources** : Tabac Info Service — Les bénéfices de l'arrêt du tabac · OMS — Sevrage tabagique.

---

### Module 10 — Vrai ou faux ?

**Objectif** : module de la famille Comprendre — explorer les idées reçues les plus fréquentes sur le tabac et le sevrage en révélant le verdict factuel, nuancé et sourcé. Registre **informatif, jamais culpabilisant ni infantilisant** — on discute des idées, jamais de la personne.

**Structure interactive** : une **carte à la fois**, l'affirmation en serif entre guillemets + vignette d'illustration (placeholder). Deux gros boutons **« Vrai »** / **« Faux »** (≥ 44 px, pictos ✓/✗ + libellé, jamais couleur seule). Révélation : badge verdict (**VRAI** vert confort / **FAUX** ambre nav — jamais rouge, une croyance n'est pas un danger) + badge secondaire « …et c'est plus nuancé » si applicable, puis explication 2-4 phrases, source en petit, bouton « Approfondir → [module] » si un renvoi existe. Aucun « Bonne réponse ! » / « Perdu ! » — verdict porte sur l'affirmation, pas sur la personne.

Navigation : points cliquables (cible ≥ 44 px) + boutons ‹ › ; compteur sobrement placé ; « Recommencer » réinitialise. On peut passer une carte sans répondre. Consigne d'ouverture : « À votre avis, vrai ou faux ? Répondez, puis regardons ce qu'en disent les faits. »

**Les 15 affirmations** (toutes livrées actives — à revalider par Thibault après usage) :

| # | Affirmation | Verdict | Explication (+ nuance) | Source | Renvoi |
| --- | --- | --- | --- | --- | --- |
| 1 | « Fumer me détend. » | FAUX | La nicotine est un stimulant, pas un calmant. La sensation de détente vient surtout du soulagement du manque — créé par la cigarette précédente. Après le sevrage, le niveau moyen de stress et d'anxiété diminue chez la plupart des personnes. | Tabac Info Service | Module 5 |
| 2 | « Les substituts nicotiniques sont dangereux pour le cœur. » | FAUX | Ce qui abîme le cœur et les vaisseaux, c'est la fumée (monoxyde de carbone, particules) — pas la nicotine seule. Les substituts délivrent la nicotine sans combustion : ils sont utilisables, y compris en cas de maladie cardiaque, avec l'avis d'un professionnel. | HAS · Tabac Info Service | Module 4 |
| 3 | « J'ai fumé trop longtemps, ça ne sert plus à rien d'arrêter. » | FAUX | Les bénéfices commencent 20 minutes après la dernière cigarette et s'accumulent pendant des années, quel que soit l'âge et l'ancienneté du tabagisme. Arrêter après 60 ans améliore encore la santé et l'espérance de vie. | Tabac Info Service · OMS | Module 9 |
| 4 | « Quelques cigarettes par jour, ce n'est pas vraiment dangereux. » | FAUX *(nuancé)* | Il n'existe pas de seuil sans risque : même 1 à 5 cigarettes par jour exposent à une part importante du risque d'infarctus et d'AVC — le risque cardiovasculaire n'est pas proportionnel au nombre de cigarettes. Réduire reste un pas — mais c'est l'arrêt qui protège. | Santé publique France | — |
| 5 | « Les cigarettes "light" ou roulées sont moins nocives. » | FAUX | Les « light » n'ont jamais réduit le risque : on compense en tirant plus fort et plus profondément (l'appellation est d'ailleurs interdite depuis 2003). Le tabac à rouler délivre au moins autant — souvent plus — de goudrons et de monoxyde de carbone. | Tabac Info Service | Module 4 |
| 6 | « Si j'arrête, je vais forcément prendre beaucoup de poids. » | FAUX | La prise moyenne est de 2 à 4 kg, et environ une personne sur trois n'en prend pas. La nicotine augmentait les dépenses d'énergie : le corps se rééquilibre. Les substituts bien dosés et l'activité physique limitent nettement cette prise — et rien n'oblige à tout mener de front. | Tabac Info Service · HAS | Module 3 |
| 7 | « Arrêter de fumer, c'est juste une question de volonté. » | FAUX | La dépendance est un mécanisme neurobiologique (les récepteurs à la nicotine du cerveau), pas un trait de caractère. La volonté compte, mais un accompagnement et des substituts bien dosés multiplient par 1,5 à 2 les chances de réussite. Demander de l'aide n'est pas un aveu de faiblesse. | HAS · Cochrane | Module 1 |
| 8 | « J'ai déjà essayé les patchs : ça ne marche pas sur moi. » | FAUX *(nuancé)* | Le plus souvent, ce n'est pas le patch qui a échoué : c'est la dose qui était trop faible, ou la durée trop courte. La dose s'ajuste au ressenti (par quarts de patch) et se complète d'une forme orale pour les envies. Une tentative « ratée » renseigne surtout sur le bon réglage pour la prochaine. | HAS | Module 3 |
| 9 | « Une cigarette pendant le sevrage, et tout est à refaire. » | FAUX | Un écart n'est pas une rechute : il n'efface ni les bénéfices déjà acquis, ni ce que vous avez appris. Ce qui compte, c'est la trajectoire d'ensemble, pas la perfection. Comprendre ce qui a déclenché l'écart prépare la suite. | Tabac Info Service | Module 6 |
| 10 | « Le corps commence à se réparer moins d'une heure après la dernière cigarette. » | VRAI | Dès 20 minutes, la pression artérielle et la fréquence cardiaque redeviennent normales. En 24 à 48 heures, le monoxyde de carbone est éliminé, le goût et l'odorat reviennent. La réparation démarre tout de suite — et continue pendant des années. | Tabac Info Service | Module 9 |
| 11 | « On peut utiliser un patch et une gomme en même temps. » | VRAI | C'est même recommandé quand les envies persistent : le patch assure un fond stable, la forme orale (gomme, pastille, spray) répond aux pics d'envie. Cette association augmente les chances de réussite — elle se règle avec un professionnel. | HAS · Cochrane | Module 3 |
| 12 | « Il faut souvent plusieurs tentatives avant d'arrêter pour de bon. » | VRAI | La plupart des ex-fumeurs ont fait plusieurs tentatives avant l'arrêt durable. Chaque tentative n'est pas un échec : c'est un entraînement qui augmente les chances de la suivante. | Tabac Info Service | Module 7 |
| 13 | « Une envie de fumer finit toujours par passer, même sans fumer. » | VRAI | Une envie est une vague de quelques minutes : elle monte, culmine, puis retombe d'elle-même — qu'on fume ou non. Les techniques des 4D aident à la laisser passer, et les vagues s'espacent avec le temps. | Tabac Info Service | Module 6 |
| 14 | « La vapoteuse est aussi dangereuse que la cigarette. » | FAUX *(nuancé)* | En l'état des connaissances, la vapoteuse est nettement moins nocive que la cigarette, car il n'y a pas de combustion — donc ni goudrons ni monoxyde de carbone. Elle n'est pas anodine pour autant, et l'objectif reste de s'en libérer aussi. À discuter avec un professionnel. | Santé publique France *(à revalider Thibault)* | Module 4 |
| 15 | « Réduire sa consommation sans arrêter protège déjà la santé. » | FAUX *(nuancé)* | Réduire seul protège peu : on compense souvent en tirant davantage sur chaque cigarette, et le risque cardiovasculaire persiste même à faible consommation. En revanche, réduire **avec des substituts**, comme étape préparant l'arrêt complet, est une stratégie valable. | HAS *(à revalider Thibault)* | Module 8 |

**Cartes 4, 14 et 15** : contenu à revalider par Thibault après usage (marqué `// à revalider (Thibault)` dans le code — statut `actif: true` actuellement, pour permettre une revue clinique en conditions réelles ; retrait possible sans code change).

**Vigilance** : jamais de jugement (« il faut »), jamais d'humour moqueur, aucune formulation « raté/perdu/gagné ». Badges verdict en couleur + picto, jamais couleur seule (double encodage).

**Renvois** → Modules selon l'explication (voir tableau).
**Sources** : Tabac Info Service · HAS — Arrêt de la consommation de tabac (2014).

---

## Données cliniques (validées 2026-06-28, complétées 2026-07-08/09)

- **Titration** : pas de calcul de dose (méthode illustrée) ; ¼ de patch tous les 2-3 jours tant qu'envie persiste sans surdosage ; pas de dose max (borne = ressenti) ; retour à la dose précédente si surdosage ; signes = nausées, écœurement, céphalées, palpitations, rêves intenses ; patchs sécables ; nuance jour/nuit (dose nuit plus faible si troubles du sommeil) ; objectif d'autonomisation/expérimentation.
- **Vapoteuse** : outil d'aide à l'arrêt à part entière ; dosage traité **qualitativement**. *(N'apparaît plus comme forme du Module 3 depuis le 2026-07-08 ; n'est plus non plus un outil manipulable du bac à sable Nicotine, Module 2, depuis sa réécriture S4 le même jour — seuls Cigarette/Patch/Substitut y figurent désormais.)*
- **Craving** : 4 D (Différer, Détourner l'attention, Se détendre — respirez, D'eau) + aparté Tabac Info Service 39 89 ; vague réelle de 3 min (idle/active/done).
- **Motivation** : cadran circulaire 0–10 (Importance, Confiance) + cartes seed — libellés validés par Thibault le 2026-07-08.
- **Sources** : affichage discret.

## Reste à fournir par Thibault (non bloquant pour le squelette)

- Références de sources exactes par module.
