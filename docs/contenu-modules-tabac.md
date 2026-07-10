# Contenu des modules — thème : sevrage tabagique

> **Statut : contenu validé le 2026-06-28**, **resynchronisé le 2026-07-10** (chantier
> `plans/boite-a-outils/` BO1-BO9 : fusion Craving → Stratégies & outils, refonte Composantes,
> vapoteuse dans les substituts, section « Si j'ai un écart », 6 cartes Vrai/faux supplémentaires).
> Tout contenu médical s'appuie sur des références validées (HAS, Tabac Info Service) et, pour les
> chiffres du module Stratégies & outils, sur `docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`.
> ⚠️ Les **références de sources exactes** restent à compléter par Thibault (placeholders dans chaque module).

---

## Décisions de conception transverses

- **Style d'interaction : manipulation libre.** Modules = « bacs à sable » (curseurs/boutons, rendu en direct).
- **Graphiques : qualitatif / relatif.** Aucune unité ni valeur chiffrée ; mention « schéma illustratif ».
- **Module 1 = page de repérage pur.** *(Révisé 2026-07-10)* Sélection de situations sans description ni
  solution à l'écran (la narration est portée par le soignant) ; un seul CTA contextuel vers le module
  Stratégies & outils, pas de duplication de son contenu.
- **Public mixte** (ambivalents + engagés) → ton **non injonctif**, leviers motivationnels disponibles non imposés.
- **Substituts : 6 formes** (patch, gomme, pastille, comprimé sublingual, spray buccal, vapoteuse). *(Vapoteuse réintégrée le 2026-07-10 — chantier `boite-a-outils` BO5, cf. `DECISIONS.md` — comme outil de réduction des risques à traitement distinct (badge « Réduction des risques », encart de statut « pas un médicament »). Inhaleur reste retiré (2026-07-08). La vapoteuse n'apparaît toujours pas comme outil manipulable du bac à sable Nicotine du Module 2 — dont les 3 outils manipulables restent Cigarette/Patch/Substitut — ni dans les formes ponctuelles (`FORMES_PONCTUELLES`) de la titration du Module 3-B.)*
- **Sources : affichage discret** (icône dans l'en-tête du module → liste en pop-over).
- **Zéro persistance** : toute manipulation est éphémère (invariant projet).
- **Fiches imprimables** (X1-X4 + BO2, `docs/BRIEF_TABAC.md` §3.1) : 5 fiches à emporter — **Ma carte
  anti-envie** (attachée à l'outil vague/4D du module Stratégies & outils, contenu inchangé depuis
  l'ancien module Craving), **Ma boîte à outils** (nouvelle, BO2 — composée des outils cochés par le
  patient), méthode patch, mes raisons, mon plan d'arrêt — composées à l'écran et imprimées à la volée
  (`window.print()`) via le composant générique `FicheOverlay` — zéro donnée conservée.
- **Fil rouge** (X6, `docs/BRIEF_TABAC.md` §3.4) : refrain du thème en exergue d'accueil et en clôture
  des 4 modules « Comprendre », classe globale `.filrouge`/`.fiche-filrouge`.
- **2ᵉ niveau InfoHover** (X6, `docs/BRIEF_TABAC.md` §3.5) : composant générique créé pour généraliser
  les tooltips de zone, non câblé tant qu'aucun contenu n'est validé par Thibault.

---

## Modules retenus (cadrage v1 + v2 + extensions 2026-07-09)

1. Les composantes de l'addiction (refonte 2026-07-10 : sélection radiale de situations, cf. Module 1)
2. La nicotine : cinétique & seuils
3. Utilisation des substituts & titration du patch
4. La nicotine n'est pas le toxique
5. Le piège du soulagement
6. Stratégies & outils (fusion avec l'ancien module « Gérer le craving (4D) », le 2026-07-10)
7. Explorer ma motivation (ajouté 2026-07-01, `PLAN_corrections-v2.md` R9)
8. Mon plan d'arrêt (ajouté 2026-07-09, brief §3.2 ; section 7 « Si j'ai un écart » ajoutée le 2026-07-10)

Carte des renvois (portes de fin de module, `ModuleFooterNav`, X6 ; mise à jour BO1-BO3 du 2026-07-10) :
Nicotine → Substituts, Soulagement · Soulagement → Substituts, Stratégies & outils · Stratégies & outils
→ Plan d'arrêt, Motivation · Substituts → Plan d'arrêt, Nicotine · Motivation → Plan d'arrêt · Nicotine ≠
toxique → Substituts, Nicotine (inchangé) · Addiction → CTA contextuel unique vers Stratégies & outils
(situations sélectionnées transmises en contexte de navigation, pas de pied `ModuleFooterNav`) · Plan
d'arrêt → aucune (la fiche est la sortie).

---

### Module 1 — Les composantes de l'addiction

**Objectif** : repérer, avec le patient, les situations qui déclenchent l'envie de fumer dans chacune
des 3 dimensions de l'addiction — sans dupliquer le contenu du module Stratégies & outils. La
narration (expliquer *pourquoi* physique/psychologique/comportementale, donner du sens aux situations)
reste portée par le soignant ; l'écran ne fait que le **repérage**.

**Structure interactive (refonte 2026-07-10, `plans/boite-a-outils/` BO3)** : diagramme de Venn à
3 cercles cliquables — **Physique (nicotinique)** · **Psychologique** · **Comportementale**, géométrie
fixe (même rayon dans tous les états). Clic sur un cercle → ses situations se déploient en **menu
radial** de puces autour du cercle (secteur d'arc dédié par pilier, même géométrie que l'ancien menu
radial du module). Les situations sont désormais **la liste canonique partagée**
`src/features/tabac/situations.ts` (20 situations, 3 piliers) — plus aucun libellé en dur dans le
composant :

| Pilier | Situations (`situations.ts`) |
| --- | --- |
| Physique | Manque, Irritabilité, Nervosité, Concentration difficile, Sommeil perturbé, Fringales, Envie irrépressible |
| Psychologique | Stress, Anxiété, Ennui, Plaisir / récompense, Stimulation, « Anti-déprime » |
| Comportementale | Café-clope, Après les repas, En pause, En voiture, Avec le téléphone, En société, Avec l'alcool |

Chaque situation est une **puce à bascule** (`aria-pressed`, double encodage fond plein + coche +
texte inversé quand sélectionnée). La sélection (un `Set` d'ids) est **persistante en changeant de
pilier** — on peut sélectionner des situations dans les 3 piliers — avec un badge « · n » sur la
légende de chaque pilier. **Aucun texte descriptif n'apparaît à l'écran** : ni « De quoi parle-t-on ? »,
ni tooltip, ni panneau latéral, ni renvoi direct vers un autre module — ce panneau et ces renvois
directs (vers nicotine/substituts/craving) ont été retirés avec la refonte.

**CTA** : sous le diagramme, dès qu'au moins une situation est sélectionnée, un bouton primaire
« Stratégies et outils (n) » navigue vers le module **Stratégies & outils** (`boite-a-outils`) avec la
sélection en contexte de navigation (`{ situations: [...] }`) — la grille d'outils s'y ouvre déjà
pré-filtrée sur ces situations. À 0 sélection, une ligne discrète invite à sélectionner.

**Vigilance** : rester une page de repérage pur (zéro texte pédagogique par situation), ne pas
dupliquer le module Stratégies & outils. Le retour arrière remet le module à zéro (le `Set` de
sélection n'est pas conservé dans l'historique de navigation — comportement accepté, cf. `DECISIONS.md`).
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

- Patch (24 h / 16 h), gomme, pastille, comprimé sublingual, spray buccal, **vapoteuse** (réintégrée
  le 2026-07-10, cf. ci-dessous). *(Inhaleur reste retiré depuis le 2026-07-08 — décision Thibault,
  cf. `DECISIONS.md`.)*

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

*Vapoteuse* (réintégrée le 2026-07-10, `// à revalider (Thibault)`, rédigée d'après HAS/HCSP + rapport
OE) — bonnes pratiques : choisir le dosage de nicotine avec un professionnel (un dosage trop faible
est la première cause de retour à la cigarette) ; tirer lentement, en bouffées longues et espacées ;
vapoter dès les premiers signes d'envie, autant que nécessaire ; objectif = remplacer complètement le
tabac fumé, puis réduire progressivement le dosage à distance.
Erreurs : sous-doser « pour faire moins fort » ; continuer à fumer en parallèle (« double usage ») ;
reproduire les bouffées courtes et rapides de la cigarette ; acheter hors des circuits contrôlés
(normes UE/AFNOR).
**Encart de statut** (affiché uniquement quand la forme est sélectionnée, style sobre, pas une alerte) :
« La vapoteuse n'est pas un médicament : c'est un outil de réduction des risques, utile aux personnes
qui n'ont pas réussi avec les traitements validés. Les substituts restent le premier choix. À discuter
avec un professionnel. » `// à revalider (Thibault)`. **Badge** sur le bouton de sélection : « Réduction
des risques » (libellé + pictogramme, jamais couleur seule). N'entre pas dans les formes ponctuelles
(`FORMES_PONCTUELLES`) de la titration du patch (partie B).

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

### Module 6 — Stratégies & outils *(ex-« Gérer le craving (4D) », fusionné le 2026-07-10)*

**Objectif** : proposer, situation par situation, des techniques concrètes pour faire face à l'envie
sans fumer — l'ancien outil vague/4D devient **un outil parmi 14**, filtrables selon les situations
sélectionnées au Module 1 — et permettre de composer une fiche « Ma boîte à outils » à emporter.
**Autorité chiffrée** : les niveaux de preuve numériques ci-dessous (OR, SMD, RR) proviennent de
`docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md` — **ils ne vivent que dans cette
documentation** ; l'écran patient n'affiche jamais qu'une des 2 mentions qualitatives
« Efficacité démontrée dans les études » / « Recommandé par les experts du sevrage » (cf. décision
transverse « Niveaux de preuve à l'écran », `DECISIONS.md` 2026-07-10).

**Structure interactive (`boite-a-outils/`)** :

1. **Intro** (1 ligne) : « Des techniques simples, à choisir selon vos situations. Touchez un outil
   pour voir comment l'utiliser. »
2. **Barre de filtres** : chips des 20 situations de `situations.ts`, groupées par pilier dans un
   `<details>` replié « Filtrer selon mes situations ». À l'arrivée depuis le Module 1 (contexte de
   navigation `{ situations: [...] }`), les situations transmises sont pré-actives. Filtre en
   **union** : un outil s'affiche si aucune chip n'est active, s'il est `transverse`, ou si ses
   situations croisent au moins une chip active.
3. **Grille de 14 outils** (carte = illustration + titre + accroche + case « Dans ma fiche »
   indépendante). Clic sur la carte → panneau de détail : illustration, titre, situations liées
   (double encodage pastille pilier + libellé), **mention de preuve qualitative** (jamais de chiffre),
   bloc « **Comment le proposer** » (formulation patient entre guillemets), renvoi éventuel, bouton
   « Ajouter à ma fiche ». Pour `outil-vague-4d` : bouton « Lancer l'outil » → l'outil interactif
   vague/4D (voir ci-dessous, code hérité de l'ancien module Craving, mécanique inchangée).
4. **Pied** : bouton « Imprimer ma boîte à outils (n) » → fiche « Ma boîte à outils » (titre +
   consigne d'une ligne par outil coché, jusqu'à ~12 outils lisibles en A4) + aparté « En parler —
   Tabac Info Service 39 89 ».
5. **Portes de fin de module** → Plan d'arrêt, Motivation.

**Les 14 outils** (id, titre, situations, niveau de preuve *qualitatif à l'écran*, renvoi) :

| # | id | Titre | Situations | Preuve (écran) | Renvoi |
| --- | --- | --- | --- | --- | --- |
| 1 | `outil-vague-4d` | Laisser passer la vague — les 4D | transverse | Recommandé par les experts | — |
| 2 | `outil-si-alors` | Mes plans « SI… ALORS… » | transverse | Efficacité démontrée | Plan d'arrêt |
| 3 | `outil-bouger` | Bouger 10 minutes | craving, stress, ennui, stimulation, déprime, fringales | Efficacité démontrée | — |
| 4 | `outil-respiration` | Respirer pour redescendre | stress, anxiété, nervosité, irritabilité | Recommandé par les experts | Soulagement |
| 5 | `outil-surfer` | Surfer sur l'envie | anxiété, craving, manque | Recommandé par les experts | — |
| 6 | `outil-place-nette` | Faire place nette | café, repas, voiture | Recommandé par les experts | — |
| 7 | `outil-routine` | Casser la routine | café, repas, pause, voiture, téléphone | Recommandé par les experts | — |
| 8 | `outil-mains-bouche` | Occuper les mains et la bouche | fringales, ennui, téléphone, craving, café | Recommandé par les experts | — |
| 9 | `outil-journal` | Une semaine d'observation | transverse | Recommandé par les experts | — |
| 10 | `outil-refus` | Ma phrase de refus | social, alcool, pause | Recommandé par les experts | — |
| 11 | `outil-recompense` | Se récompenser — la tirelire | plaisir, déprime, stimulation | Recommandé par les experts | — |
| 12 | `outil-anti-ennui` | La liste anti-ennui | ennui, stimulation, téléphone | Recommandé par les experts | — |
| 13 | `outil-faux-pas` | Si j'ai un écart — le plan de secours | transverse | Recommandé par les experts | Plan d'arrêt |
| 14 | `outil-substituts` | Traiter le manque — les substituts | manque, irritabilité, nervosité, concentration, sommeil, fringales, craving | Efficacité démontrée | Substituts |

**Détail par outil** (principe + formulation patient, verbatim `data.ts` ; chiffres bruts du rapport OE
entre parenthèses, **jamais affichés à l'écran**) :

1. **Les 4 D** : une envie de fumer est une vague de 3 à 5 minutes qui redescend toujours, qu'on fume
   ou non. Différer, Détourner l'attention, se Détendre, boire De l'eau aident à tenir pendant le pic.
   Outil hérité tel quel de l'ancien module Craving (minuteur réel 180 s, animation de respiration,
   fiche « Ma carte anti-envie »).
2. **Plans « SI… ALORS… »** : pré-programmer une réponse précise pour chaque situation à risque
   court-circuite la décision au moment critique — *OR 1,70 (IC 95 % 1,32–2,20) pour le sevrage,
   méta-analyse de 12 études*. Formuler 3 à 5 plans écrits, relus chaque matin.
3. **Bouger 10 minutes** : un exercice bref (même 10 min de marche rapide) fait nettement baisser
   l'envie, effet persistant 20-30 min — *SMD −1,64 (IC 95 % −2,22 à −1,05), effet aigu sur le
   craving*. À défaut : 5 contractions des poings 10 s.
4. **Respirer pour redescendre** : la respiration lente active le système d'apaisement du corps ;
   rappel utile — la cigarette ne réduit pas le stress, elle soulage le manque qu'elle a elle-même
   créé (*paradoxe tabac-stress, SMD −0,37 anxiété / −0,27 stress après l'arrêt*). Respiration 4-7-8
   (inspirer 4 s, retenir 7 s, souffler 8 s, ×3).
5. **Surfer sur l'envie** : observer l'envie comme une vague qu'on regarde passer, sans lutter ni
   céder, affaiblit peu à peu le lien situation-cigarette (pleine conscience informelle, niveau de
   preuve faible à modéré selon Cochrane).
6. **Faire place nette** : chaque objet/lieu associé à la cigarette est un déclencheur ; les retirer du
   champ de vision désamorce l'automatisme (contrôle du stimulus, composante du counseling infirmier —
   *RR 1,29, IC 95 % 1,21–1,38, 44 essais*).
7. **Casser la routine** : modifier un élément de la séquence café/repas/pause (lieu, ordre, boisson)
   casse l'enchaînement automatique (méta-régression sur 143 groupes, processus auto-régulateurs
   *B = 0,041, p < 0,05*).
8. **Occuper les mains et la bouche** : un geste de remplacement incompatible avec la cigarette comble
   le vide sensoriel pendant que l'envie redescend (substitution comportementale, consensus ACC).
9. **Une semaine d'observation** : noter chaque cigarette avec son contexte avant l'arrêt fait
   apparaître les schémas répétitifs — première étape recommandée pour planifier des parades ciblées.
10. **Ma phrase de refus** : une réponse courte et préparée évite d'improviser au moment vulnérable ;
    vigilance particulière avec l'alcool, qui baisse la garde (revue de 27 études : consommation
    d'alcool associée à des taux de sevrage plus faibles dans 20/27 études).
11. **Se récompenser — la tirelire** : planifier des plaisirs de remplacement et matérialiser l'argent
    économisé soutient la motivation les premières semaines (incitations financières, revue Cochrane
    de 43 études).
12. **La liste anti-ennui** : une liste de 10 activités courtes, préparée à l'avance, évite de rester
    inactif face à une envie — l'envie a besoin de vide pour s'installer.
13. **Si j'ai un écart — le plan de secours** : un écart n'est pas une rechute ; le geste d'après compte
    plus que l'écart lui-même. Plan en 3 gestes (jeter le paquet, appeler quelqu'un, relire ses
    raisons) puis reprendre les substituts comme avant — le **recyclage immédiat** après un écart
    multiplie les chances de réussite (*OR 3,5, IC 95 % 1,0–12,4, vs. attente, essai SMART*). Rationnel
    partagé avec la section 7 du Module 8 (préparer la réponse à l'écart *avant* le jour J).
14. **Traiter le manque — les substituts** : les signes physiques du manque (irritabilité, nervosité,
    concentration, sommeil, fringales) se traitent avec des substituts bien dosés — patch pour le fond,
    forme orale pour les pics d'envie (association recommandée, HAS/Cochrane).

**Outil interactif vague/4D** (`VagueCraving.tsx`, déplacé quasi tel quel depuis l'ancien module
Craving) : courbe en cloche (tracé Bézier) ; bouton → **compte à rebours réel de 3 min** (`3:00 →
0:00`, `CRAVING_DURATION = 180` s), un repère parcourt la vague au même rythme. **3 phases** : `idle`
(« Une envie arrive ? »), `active` (compte à rebours + 4D affichés), `done` (« La vague est passée » —
réservé à la fin réelle du décompte). Les 4 D restent des cartes cliquables/bascules actives pendant la
phase `active`, avec l'animation de respiration (cercle qui grandit/se resserre, inspire/expire 5 s).
Fiche « Ma carte anti-envie » (X2) inchangée : bouton « Préparer ma carte » (hors phase `active`) → voir
`docs/BRIEF_TABAC.md` §3.1. Bouton « ← Retour aux outils » pour revenir à la grille (remplace l'ancien
`ModuleFooterNav` interne, qui vit désormais au niveau du module).

**Renvoi** ← Module 1 (sélection de situations, transmise en contexte de navigation) · **Portes de fin
de module** (X6) → Plan d'arrêt, Motivation.
**Sources** : HAS — Arrêt de la consommation de tabac (2014) · Tabac Info Service · ACC — Tobacco
Cessation Treatment Pathway (2018) `// à revalider (Thibault)` · Cochrane — revues sevrage tabagique
`// à revalider (Thibault)`.

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

### Module 8 — Mon plan d'arrêt (ajouté 2026-07-09 ; section 7 ajoutée le 2026-07-10)

**Objectif** : clore l'arc du thème par l'**application** — rassembler ce qui a été compris et choisi
(date, substituts, situations à risque, parades, raisons) en un plan concret, imprimé, collé au frigo.
Contenu détaillé, décisions et libellés exacts : `docs/BRIEF_TABAC.md` §3.2 (autorité normative — non
dupliqué ici). **Aucune porte de fin de module** : la fiche imprimée est la sortie du module.

**Section 7 — « Si j'ai un écart »** (ajoutée BO6, 2026-07-10, 7ᵉ et dernière section, après « 6. Autour
de moi ») : rationnel — préparer la réponse à l'écart **avant** le jour J plutôt que de l'improviser
(recommandation forte du rapport OE, cf. Module 6 outil `outil-faux-pas` : le recyclage immédiat après
un écart multiplie les chances de réussite). Phrase d'ancrage : « Un écart n'est pas une rechute. Je
prépare maintenant mes 3 gestes pour repartir aussitôt. » Chips pré-alimentées (+ saisie libre, comme
les 6 autres sections) : « Je jette le paquet et le briquet » · « J'appelle quelqu'un — un proche ou le
39 89 » · « Je relis mes raisons d'arrêter » · « Je continue mes substituts comme avant ». Reprise sur
la fiche imprimée (bloc « Si j'ai un écart — repartir aussitôt », conditionné à ≥ 1 geste coché). Ton :
« écart » uniquement, jamais « craquer »/« rechute » dans les libellés. Chips substituts (section 2) :
« Vapoteuse » ajoutée en fin de liste (cohérence avec le Module 3).
**Sources** : aucune (pas de contenu clinique chiffré — reprend, en chips, des libellés déjà validés des
modules Substituts, Addiction, Stratégies & outils et Motivation).

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

**Les 21 affirmations** (toutes livrées actives — à revalider par Thibault après usage ; 6 cartes
ajoutées le 2026-07-10, BO4, issues des rapports OE poids et cigarette électronique) :

| # | id | Affirmation | Verdict | Explication (+ nuance) | Source | Renvoi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `vf-detente` | « Fumer me détend. » | FAUX | La nicotine est un stimulant, pas un calmant. La sensation de détente vient surtout du soulagement du manque — créé par la cigarette précédente. Après le sevrage, le niveau moyen de stress et d'anxiété diminue chez la plupart des personnes. | Tabac Info Service | Soulagement |
| 2 | `vf-substituts-coeur` | « Les substituts nicotiniques sont dangereux pour le cœur. » | FAUX | Ce qui abîme le cœur et les vaisseaux, c'est la fumée (monoxyde de carbone, particules) — pas la nicotine seule. Les substituts délivrent la nicotine sans combustion : ils sont utilisables, y compris en cas de maladie cardiaque, avec l'avis d'un professionnel. | HAS · Tabac Info Service | Nicotine ≠ toxique |
| 3 | `vf-trop-tard` | « J'ai fumé trop longtemps, ça ne sert plus à rien d'arrêter. » | FAUX | Les bénéfices commencent 20 minutes après la dernière cigarette et s'accumulent pendant des années, quel que soit l'âge et l'ancienneté du tabagisme. Arrêter après 60 ans améliore encore la santé et l'espérance de vie. | Tabac Info Service · OMS | Ce que l'arrêt répare |
| 4 | `vf-petit-fumeur` | « Quelques cigarettes par jour, ce n'est pas vraiment dangereux. » | FAUX *(nuancé dans le texte)* | Il n'existe pas de seuil sans risque : même 1 à 5 cigarettes par jour exposent à une part importante du risque d'infarctus et d'AVC. Réduire reste un pas — mais c'est l'arrêt qui protège. | Santé publique France *(à revalider Thibault)* | — |
| 5 | `vf-light-roule` | « Les cigarettes "light" ou roulées sont moins nocives. » | FAUX | Les « light » n'ont jamais réduit le risque (appellation interdite depuis 2003). Le tabac à rouler délivre au moins autant — souvent plus — de goudrons et de monoxyde de carbone. | Tabac Info Service | Nicotine ≠ toxique |
| 6 | `vf-poids` | « Si j'arrête, je vais forcément prendre beaucoup de poids. » | FAUX | La prise moyenne est de **3 à 5 kg** (chiffre aligné sur le rapport OE), très variable : environ une personne sur cinq n'en prend pas, ou en perd. Substituts bien dosés et activité physique limitent cette prise — rien n'oblige à mener arrêt et régime de front. | Tabac Info Service · Cochrane *(à revalider Thibault)* | Substituts |
| 7 | `vf-poids-coeur` | « Prendre du poids à l'arrêt annule le bénéfice pour le cœur. » *(nouvelle, BO4)* | FAUX | Même chez ceux qui prennent beaucoup de poids (> 10 kg), le risque de mourir d'une maladie cardiovasculaire est réduit de moitié à deux tiers par rapport à ceux qui continuent de fumer. Le cœur gagne toujours au change. | NEJM 2018 *(à revalider Thibault)* | Ce que l'arrêt répare |
| 8 | `vf-fumer-mince` | « Mieux vaut continuer à fumer que de prendre quelques kilos. » *(nouvelle, BO4)* | FAUX | Le tabac tue un fumeur régulier sur deux. Les 3 à 5 kg moyens de l'arrêt n'ont aucun impact comparable — et ils se stabilisent puis diminuent avec les années. | Tabac Info Service · NEJM 2018 *(à revalider Thibault)* | Ce que l'arrêt répare |
| 9 | `vf-poids-regime` | « Il faut se mettre au régime en même temps qu'on arrête de fumer. » *(nouvelle, BO4)* | FAUX | Déconseillé : une restriction stricte mime les sensations de manque et fragilise le sevrage. Objectif des premiers mois : « maintenir, pas maigrir » (bouger 30 min/jour, boire de l'eau, en-cas peu caloriques). | ACC 2018 · Cochrane *(à revalider Thibault)* | — |
| 10 | `vf-volonte` | « Arrêter de fumer, c'est juste une question de volonté. » | FAUX | La dépendance est un mécanisme neurobiologique, pas un trait de caractère. Un accompagnement et des substituts bien dosés multiplient par 1,5 à 2 les chances de réussite. | HAS · Cochrane | Addiction |
| 11 | `vf-patch-marche-pas` | « J'ai déjà essayé les patchs : ça ne marche pas sur moi. » | FAUX *(nuancé)* | Le plus souvent, ce n'est pas le patch qui a échoué : c'est la dose trop faible, ou la durée trop courte. Une tentative « ratée » renseigne surtout sur le bon réglage pour la prochaine. | HAS | Substituts |
| 12 | `vf-faux-pas` | « Si je craque pour une cigarette, c'est un échec — tout est à refaire. » *(reformulée BO4)* | FAUX | Un écart n'est pas une rechute : il n'efface ni les bénéfices déjà acquis, ni ce que vous avez appris. Il faut en moyenne plusieurs tentatives — souvent 5 ou 6 — avant un arrêt durable, et repartir immédiatement après un écart multiplie les chances de réussite. Ce qui compte : jeter le paquet, continuer les substituts, comprendre le déclencheur. | Tabac Info Service · JAMA 2022 *(à revalider Thibault)* | Stratégies & outils |
| 13 | `vf-20min` | « Le corps commence à se réparer moins d'une heure après la dernière cigarette. » | VRAI | Dès 20 minutes, la pression artérielle et la fréquence cardiaque redeviennent normales. En 24 à 48 heures, le monoxyde de carbone est éliminé, le goût et l'odorat reviennent. | Tabac Info Service | Ce que l'arrêt répare |
| 14 | `vf-combinaison` | « On peut utiliser un patch et une gomme en même temps. » | VRAI | C'est même recommandé quand les envies persistent : le patch assure un fond stable, la forme orale répond aux pics d'envie. | HAS · Cochrane | Substituts |
| 15 | `vf-tentatives` | « Il faut souvent plusieurs tentatives avant d'arrêter pour de bon. » | VRAI | La plupart des ex-fumeurs ont fait plusieurs tentatives avant l'arrêt durable. Chaque tentative est un entraînement qui augmente les chances de la suivante. | Tabac Info Service | Motivation |
| 16 | `vf-vague` | « Une envie de fumer finit toujours par passer, même sans fumer. » | VRAI | Une envie est une vague de quelques minutes : elle monte, culmine, puis retombe d'elle-même — qu'on fume ou non. Les vagues s'espacent avec le temps. | Tabac Info Service | Stratégies & outils |
| 17 | `vf-vapoteuse` | « La vapoteuse est aussi dangereuse que la cigarette. » | FAUX *(nuancé)* | Nettement moins nocive que la cigarette (pas de combustion, ni goudrons ni monoxyde de carbone). Pas anodine pour autant ; l'objectif reste de s'en libérer aussi. | Santé publique France *(à revalider Thibault)* | Nicotine ≠ toxique |
| 18 | `vf-vape-aide` | « La vapoteuse peut aider à arrêter de fumer. » *(nouvelle, BO4)* | VRAI *(nuancé)* | Aide au moins autant que les substituts nicotiniques, à condition de basculer complètement. Pas un médicament : les substituts restent le premier choix, la vapoteuse une option à discuter. | Cochrane 2025 · HCSP *(à revalider Thibault)* | Substituts |
| 19 | `vf-double-usage` | « Vapoter tout en continuant à fumer, c'est déjà bon pour la santé. » *(nouvelle, BO4)* | FAUX | Le bénéfice n'existe que si la vapoteuse remplace complètement le tabac fumé — fumer et vapoter ensemble expose au moins autant que fumer seul (piège du « double usage »). | Cochrane · revues 2022-2026 *(à revalider Thibault)* | Substituts |
| 20 | `vf-vapeur-eau` | « La vapeur de la vapoteuse, c'est juste de la vapeur d'eau. » *(nouvelle, BO4)* | FAUX | L'aérosol contient nicotine, propylène glycol, glycérine, arômes et traces irritantes — beaucoup moins que la fumée, mais pas rien. | Santé publique France *(à revalider Thibault)* | Nicotine ≠ toxique |
| 21 | `vf-reduire` | « Réduire sa consommation sans arrêter protège déjà la santé. » | FAUX *(nuancé)* | Réduire seul protège peu (compensation par bouffée). En revanche, réduire **avec des substituts**, comme étape préparant l'arrêt complet, est une stratégie valable. | HAS *(à revalider Thibault)* | Plan d'arrêt |

**Cartes à revalider par Thibault après usage** (marquées `// à revalider (Thibault)` dans le code —
statut `actif: true` actuellement, pour permettre une revue clinique en conditions réelles ; retrait
possible sans code change) : 4, 6, 7, 8, 9, 12, 17, 18, 19, 20, 21 — soit toutes les cartes portant une
source internationale (NEJM, Cochrane, ACC, JAMA) ou Santé publique France en attendant un équivalent
HAS/Tabac Info Service pour les mêmes affirmations.

**Vigilance** : jamais de jugement (« il faut »), jamais d'humour moqueur, aucune formulation « raté/perdu/gagné ». Badges verdict en couleur + picto, jamais couleur seule (double encodage).

**Renvois** → Modules selon l'explication (voir tableau).
**Sources** : Tabac Info Service · HAS — Arrêt de la consommation de tabac (2014).

---

## Données cliniques (validées 2026-06-28, complétées 2026-07-08/09/10)

- **Titration** : pas de calcul de dose (méthode illustrée) ; ¼ de patch tous les 2-3 jours tant qu'envie persiste sans surdosage ; pas de dose max (borne = ressenti) ; retour à la dose précédente si surdosage ; signes = nausées, écœurement, céphalées, palpitations, rêves intenses ; patchs sécables ; nuance jour/nuit (dose nuit plus faible si troubles du sommeil) ; objectif d'autonomisation/expérimentation.
- **Vapoteuse** : outil d'aide à l'arrêt à part entière ; dosage traité **qualitativement**. *(Réintégrée comme 6ᵉ forme du Module 3 le 2026-07-10 — réduction des risques, à revalider Thibault ; reste absente du bac à sable Nicotine, Module 2, et des formes ponctuelles de la titration.)*
- **Stratégies & outils (ex-Craving)** : 14 outils filtrables par situation, dont les 4 D (Différer, Détourner l'attention, Se détendre — respirez, D'eau, désormais `outil-vague-4d`) + aparté Tabac Info Service 39 89 ; vague réelle de 3 min (idle/active/done) inchangée. Niveaux de preuve à l'écran limités à 2 mentions qualitatives — les chiffres bruts (OR/SMD/RR) ne vivent que dans `docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`.
- **Plan d'arrêt** : 7 sections (dont la nouvelle section 7 « Si j'ai un écart », 2026-07-10) + fiche imprimée correspondante.
- **Motivation** : cadran circulaire 0–10 (Importance, Confiance) + cartes seed — libellés validés par Thibault le 2026-07-08.
- **Sources** : affichage discret.

## Reste à fournir par Thibault (non bloquant pour le squelette)

- Références de sources exactes par module.
