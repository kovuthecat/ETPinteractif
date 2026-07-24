# Contenu clinique — thème `cardio` (prévention cardiovasculaire PRIMAIRE)

> **Statut : VALIDÉ À G1 par Thibault le 2026-07-22** (décisions au §13 ; seule réserve restante :
> fréquences de suivi M12 à confirmer côté HAS, non bloquant).
> Rôle : **doc d'autorité de contenu** du thème cardio, source unique consommée par
> `src/features/cardio/` (les sessions de module S4-S14 le lisent sans le réécrire).
> Créé le 2026-07-22 (plan `theme-cardio-2026-07/S1`, tâche C1).
>
> **Chaîne d'autorité.** Le *quoi* (écran par écran, pièges) vient de
> `docs/cardio/BRIEF_DESIGN_cardio.md`. Le *pourquoi* (chiffres, forces de preuve) vient des
> deux rapports OpenEvidence `docs/cardio/evidence-cardio/2026-07-21-…-{socle,complement}.md`.
> **En cas de conflit ou de doute, le rapport OpenEvidence prime.** Quand le rapport est muet,
> la valeur n'est PAS comblée : elle est marquée `// à revalider (Thibault)` et listée au
> journal (§13) — c'est ce que le soignant tranche à G1.
>
> **Périmètre : prévention PRIMAIRE.** Adultes à risque CV, non spécifiquement diabétiques.
> Le diabète = un facteur (robinet du module 2) qui renvoie au thème diabète. Prévention
> **secondaire** (post-IDM / post-AVC, réadaptation, DAPT, cibles LDL très basses) **hors v1**.
>
> **Invariants non négociables (rappel).**
> 1. **Aucune valeur chiffrée à l'écran.** À l'écran, tout est **palier qualitatif** (feu,
>    curseur, jauge, pente). Les chiffres sourcés (seuils TA/LDL, durées, doses d'alcool,
>    fréquences de suivi) vivent **uniquement** dans les rubriques « 2ᵉ niveau (survol) » et
>    « Calibrage » de ce doc — jamais rendus tels quels au patient. Exception non chiffrée :
>    les **numéros d'urgence 15 / 112** (identifiants, cœur de la carte de survie du M10).
> 2. **Non diagnostique.** On manipule feux/curseurs « pour voir », jamais un score de risque
>    calculé, jamais les vraies données du patient. Jamais un bulletin, une note, un chiffre
>    « à vous ».
> 3. **Réversibilité = message d'espoir non négociable.** La régression de la plaque doit être
>    aussi visible que la menace (ASTEROID / PARADIGM, jamais chiffré à l'écran).
> 4. **Sobriété adulte, non culpabilisant.** Pas de smiley, pas de ton scolaire, pas de
>    dramatisation. « Voilà ce qu'on protège », jamais « voilà ce qui vous attend ».

---

## 0. Grammaire commune

### 0.1 Le fil rouge (verbatim, brief §1.7 — refrain des modules 1 · 2 · 3 · 12)

> **L'athérosclérose avance en silence — mais elle est réversible. Agir sur plusieurs
> leviers à la fois protège le cœur, le cerveau, les jambes et les reins.**

Motif visuel central : **la personne / les artères protégées**. Installé au module 1.

### 0.2 Les 6 objets partagés (brief §1 — même dessin à chaque réapparition)

| # | Objet | Modules | Rôle pédagogique |
|---|---|---|---|
| 1 | **L'ARTÈRE + LA PLAQUE** *(héros du thème)* | 1 · 2 · 3 · 5 · (6) | mécanisme réversible / cumul des facteurs / territoires / nourrie par le LDL. Modèle pédagogique, **jamais un % de sténose**. |
| 2 | **LA SILHOUETTE-CORPS** | 3 · 10 · 11 | territoires menacés → alerte → défendus. Zones : cœur · cerveau · jambes · reins. Sobre, digne, jamais anxiogène. |
| 3 | **LE COCKPIT DE FEUX** | 2 · 4 · 5 · (9) | état d'un facteur modifiable (tabac · tension · cholestérol · sucre · sédentarité/inactivité), vert/ambre/rouge — sauf tabac, **binaire** vert/rouge. **Jamais un score, jamais une note.** Non-modifiables (âge, sexe, hérédité) montrés à part, non réglables. |
| 4 | **LA CARTE-RÉFLEXE VITE** *(seul objet neuf)* | 10 | signalétique d'urgence, se lit en état de panique. Acronyme **VITE** + tableau infarctus. Dessiné comme un panneau de sortie de secours. |
| 5 | **« MES 3 CHIFFRES »** *(alternative au cadran de l'année — à valider, cf. M12)* | 12 | suivi léger de la prévention primaire : tension / LDL / tour de taille, façon carnet simple. // à revalider (Thibault) : « mes 3 chiffres » **ou** cadran de l'année du diabète (décision de conception, brief §2 M12). |
| 6 | **LE FIL ROUGE** (personne / artères protégées) | 1 · 2 · 3 · 12 | « silencieux mais réversible » ; message d'unité (un seul ennemi, plusieurs adresses). |

**Grammaire des couleurs.** Vert = favorable / dans la cible / fait · Ambre = intermédiaire /
à surveiller / à programmer · Rouge = **réservé à l'état de santé** (facteurs des modules 2/4/5,
plaque). **Jamais de rouge pour une tâche non faite** (M12 : « pas encore fait » = ambre +
horloge). Prévoir une lecture non chromatique de secours (forme, position, picto) — daltonisme.

---

## Module 1 — L'artère qui s'encrasse *(fondateur — pose le héros)*

**Intention.** Installer une fois pour toutes le modèle mental « artère → plaque silencieuse →
rupture = accident, mais réversible ».

**Message(s) à l'écran** (séquence 4 temps, narrée par le soignant ; qualitatif) :
1. « Une artère saine : le sang passe librement. »
2. « Un dépôt s'installe en silence, sans douleur. »
3. « La plaque se fissure : un caillot bouche le passage. »
4. « En agissant, la plaque se stabilise — et peut reculer. » *(espoir, non négociable.)*

**2ᵉ niveau (survol).**
- « Silencieux pendant des **années, voire des décennies**, avant le moindre symptôme »
  (Socle A.1 — athérosclérose, JACC State-of-the-Art 2019).
- Réversibilité documentée : sous traitement du LDL, la plaque **ralentit, se stabilise et peut
  régresser** (Socle A.2 — PARADIGM 2018 ; ASTEROID 2006). Aucun chiffre à l'écran.

**Calibrage (jamais à l'écran).**
- Cinétique de la frise : ordre de grandeur = **décennies** d'accumulation asymptomatique
  (Socle A.1). // à revalider (Thibault) : la **vitesse visuelle exacte** de l'animation
  (années par « pas ») est un choix de design non chiffré par le rapport.
- Amplitudes de régression pour piloter la « respiration » de la plaque (illustratif, non affiché) :
  ASTEROID −0,98 % de volume d'athérome en 24 mois ; PARADIGM HR 0,80 (0,69-0,93) sur la
  progression (Socle A.2).

**Pièges (brief M1).** Le **silence** (années sans symptôme) et la **réversibilité** sont les
deux messages-clés ; la fin espoir doit être aussi forte que la menace. Pas de « tuyau bouché =
fatalité ». **Pas d'artère gore.**

**Sources.**
```ts
sources: [
  "ESC 2021 — Guidelines on cardiovascular disease prevention",
  "PARADIGM (Lee SE et al., JACC Cardiovasc Imaging 2018)",
  "ASTEROID (Nissen SE et al., JAMA 2006)",
]
```

---

## Module 2 — Mon risque global *(cockpit — valide les feux + le cumul)*

**Intention.** Les facteurs se **multiplient** (≠ s'additionnent) ; on peut agir sur plusieurs ;
c'est réversible. Poser la grammaire des feux.

**Message(s) à l'écran** (qualitatif, non diagnostique) :
- « Ce n'est jamais un seul facteur : ils se **multiplient**. »
- « Agir sur plusieurs à la fois protège **beaucoup plus**. »
- Feux réglables « pour voir » : **tabac · tension · cholestérol · sucre · sédentarité/inactivité**.
  *(correction Thibault 2026-07-23 : remplace poids/tour de taille — doublon avec « mes 3
  chiffres » du M12 et moins actionnable au quotidien que la sédentarité.)*
- **Le tabac est binaire** (vert/rouge, pas de palier orange) : cliniquement, il n'y a pas de
  « niveau » intermédiaire de tabagisme pour ce facteur — on fume ou on ne fume pas *(correction
  Thibault 2026-07-23)*. Les 4 autres feux gardent le cycle vert→orange→rouge.
- Non-modifiables, montrés à part : « L'âge, le sexe, l'hérédité comptent aussi — on ne les
  change pas, alors on agit sur le reste. » *(déculpabilisant.)*
- Âge vasculaire (illustratif) : « Vos artères peuvent prendre de l'avance sur votre âge. »
  *(jamais « votre chiffre ».)*
- **Pas de renvoi textuel vers le thème Diabète** *(correction Thibault 2026-07-23 : c'est le
  soignant qui connaît l'outil et navigue lui-même — le message « robinet sucre » est retiré)*.
- **Pas de fiche imprimable pour ce module** *(correction Thibault 2026-07-23)* — cockpit « pour
  voir » seulement, rien à emporter.

**2ᵉ niveau (survol).**
- Tension — cible sous traitement : **PAS 120-130 mmHg** (< 65 ans), **130-139 mmHg** (≥ 65 ans),
  PAD 70-79 (Socle C.3 — ESC 2021 / ESH 2023).
- Sédentarité — pas de seuil chiffré ici (cf. Module 7 Bouger pour le 2ᵉ niveau complet,
  OMS 2020 / ESC 2021) : le feu reste qualitatif, « bouger un peu vaut mieux que rien ».
- LDL selon le risque. **✅ G1 (2026-07-22) : ne JAMAIS afficher de cible en g/L** — les seuils se
  modulent selon le **niveau de risque CV** (à ajuster, hors écran). À l'écran, le feu « cholestérol »
  reste qualitatif. Principe sourcé conservé (argument, pas chiffre) : **« réduction ≥ 50 % vs
  baseline »** (risque élevé/très élevé, Socle D.3).

**Calibrage (jamais à l'écran).**
- **Cumul multiplicatif** : moteur central de la réaction de l'artère — 2 feux rouges encrassent
  bien plus vite que la somme de deux (Socle B.1 ; INTERHEART : 9 facteurs modifiables > 90 % du
  risque attribuable d'IDM). L'objet doit rendre la **multiplication** visible, pas l'addition.
- Contexte SCORE2 : **la France = zone de risque bas** (Socle B.2). Le score n'est **jamais**
  affiché ; sert seulement à cadrer que l'outil n'est pas diagnostique.
- Catégories de risque ESC 2021 (partiellement dégradées, Socle B.3) : non affichées ; peuvent
  nourrir la « vitesse » de l'âge vasculaire illustratif.

**Pièges (brief M2).** **JAMAIS un score chiffré / bulletin / note.** Multiplication ≠ addition
(le cœur pédagogique). Non-modifiables mis à part = déculpabilisant. L'âge vasculaire reste
**illustratif**.

**Sources.**
```ts
sources: [
  "ESC 2021 — Guidelines on cardiovascular disease prevention",
  "SCORE2 (ESC Cardiovascular Risk Collaboration, Eur Heart J 2021)",
  "INTERHEART (Yusuf S et al., Lancet 2004)",
]
```

---

## Module 3 — Où l'accident frappe

**Intention.** Un seul ennemi (la plaque), **plusieurs adresses** : cœur, cerveau, jambes, reins.
Sans jamais faire peur pour rien.

**Message(s) à l'écran** (contemplatif ; le patient ouvre ce qu'il veut) :
- « Un seul ennemi, la plaque. Plusieurs adresses. »
- Cœur → « infarctus » · Cerveau → « AVC » · Jambes → « douleur à la marche (artériopathie) » ·
  Reins → « ils s'abîment en silence ».
- « Mêmes leviers, ils protègent **partout**. » *(message d'unité.)*

**2ᵉ niveau (survol).**
- « Souvent **silencieux jusqu'à l'accident** » (Socle A.1 ; I.1 — atteinte rénale/dysglycémie
  silencieuse).
- Formes/fréquences des territoires : le rapport reste qualitatif ; pas de chiffre de prévalence
  par territoire fourni. // à revalider (Thibault) : opportunité d'ajouter des ordres de grandeur
  par territoire (non présents dans les rapports).

**Calibrage (jamais à l'écran).** Aucun réglage numérique propre ; réutilise la plaque du 1/2.

**Pièges (brief M3).** **Menace seule = proscrite** : « voilà ce qu'on protège », jamais « voilà
ce qui vous attend ». Message d'**unité** plutôt qu'un catalogue anxiogène. **Pas d'images
cliniques crues.**

**Sources.**
```ts
sources: [
  "ESC 2021 — Guidelines on cardiovascular disease prevention",
  "Athérosclérose — JACC State-of-the-Art Review (Ahmadi A et al., JACC 2019)",
]
```

---

## Module 4 — La tension

**Intention.** Le « tueur silencieux » rendu concret et **actionnable** : pas de symptôme, mais
ça abîme les artères — et on peut le mesurer chez soi.

**Message(s) à l'écran** (concret, dédramatisant, valorisant) :
- « La tension ne se sent pas — et pourtant elle use les artères. »
- « La mesurer chez soi, c'est prendre la main. » / « **Une seule mesure ne suffit pas.** »
  *(la « règle des 3 » comme geste, pas comme chiffre imposé — nom de la méthode HAS.)*
- « Moins de sel, bouger, poids, alcool modéré : la pression baisse. » *(qualitatif.)*

**2ᵉ niveau (survol).**
- **Automesure (AMT)** : seuil d'HTA en automesure = **≥ 135/85 mmHg** ; **« règle des 3 »** =
  3 mesures matin + 3 mesures soir, 3 jours de suite (Socle C — HAS / SFHTA). *(Sourcé, solide.)*
- **Cible sous traitement** : PAS **120-130 mmHg** (< 65 ans), **130-139 mmHg** (≥ 65 ans),
  PAD 70-79 (Socle C.3 — ESC 2021 / ESH 2023).
- **✅ G1 (2026-07-22) : on garde l'AMT < 135/85** ; le seuil « consultation < 140/90 » est
  **retiré** — une **mesure unique n'est pas fiable** (c'est tout le sens de la règle des 3).

**Calibrage (jamais à l'écran).**
- Effet des mesures hygiéno-diététiques combinées (restriction sodée, DASH, activité, perte de
  poids, alcool) : **PAS −5 à −15 mmHg** (Socle C.2) ; DASH chez l'hypertendu : **PAS −8 à
  −14 mmHg** (Socle G.2). Pilote l'ampleur du « la pression baisse » sur le tuyau.

**Pièges (brief M4).** Pas de dramatisation « tueur ». L'automesure est **valorisante**, pas un
examen anxiogène. **Aucune cible chiffrée imposée à l'écran** (survol seulement).

**Sources.**
```ts
sources: [
  "HAS / SFHTA — Automesure tensionnelle (règle des 3)",
  "ESC 2021 — Guidelines on cardiovascular disease prevention",
  "ESH 2023 — Guidelines for the management of arterial hypertension",
]
```

---

## Module 5 — Le cholestérol (LDL)

**Intention.** Le LDL est **ce qui nourrit la plaque** (lien direct au 1) ; « plus bas, plus
longtemps, mieux c'est » ; déculpabiliser (ce n'est pas que l'assiette).

**Message(s) à l'écran** (pédagogique, anti-culpabilisant) :
- « Le LDL **nourrit la plaque**. »
- « Plus bas, plus longtemps : la plaque **recule**. »
- « Ce n'est pas que votre assiette. » *(déculpabilisant.)*
- « Le LDL dépose, le HDL nettoie. »

**2ᵉ niveau (survol).**
- Principe sourcé, **sans seuil g/L à l'écran** : « plus le LDL est **bas et maintenu longtemps**,
  plus la plaque se stabilise » (Socle D.1 — « lower is better, longer is better », relation
  causale + log-linéaire).
- Objectif de réduction sourcé : **réduction ≥ 50 % vs baseline** pour le risque élevé/très élevé
  (Socle D.3).
- Cibles chiffrées en g/L : **✅ G1 (2026-07-22) : jamais affichées** — seuils modulés selon le
  **niveau de risque CV** (à ajuster, hors écran), comme M2. Le curseur/feu LDL reste qualitatif.

**Calibrage (jamais à l'écran).**
- Dose-réponse pour piloter le curseur « niveau de LDL » ↔ dépôt : chaque **−1 mmol/L (≈ 39 mg/dL)**
  de LDL-C → **~22-25 %** d'événements vasculaires en moins par an de traitement ; **−2 mmol/L →
  ~45 %** (Socle D.2 — CTT Collaboration, Lancet 2010). Silverman 2016 : −23 % par mmol/L,
  cohérent tous traitements. Randomisation mendélienne : −1 mmol/L **sur la vie entière** → risque
  > 50 % moindre (≈ 3× l'effet d'une statine sur quelques années) → nourrit le message « plus
  **longtemps** ».

**Pièges (brief M5).** **Ne pas moraliser l'alimentation** : le LDL est en grande partie
hépatique/génétique → « ce n'est pas seulement ce que vous mangez ». Cibles **jamais imposées à
l'écran**.

**Sources.**
```ts
sources: [
  "ESC 2021 — Guidelines on cardiovascular disease prevention (cibles LDL — à re-sourcer)",
  "CTT Collaboration (Cholesterol Treatment Trialists', Lancet 2010)",
  "HAS — Prise en charge des dyslipidémies",
]
```

---

## Module 6 — Le tabac *(module léger — pont vers le thème Tabac)*

**Intention.** Le « pourquoi cardiovasculaire » du tabac (accélération de la plaque + thrombose
aiguë) et sa **réversibilité rapide** — puis **orienter** vers le thème Tabac.

**Message(s) à l'écran** (bref, motivant ; qualitatif — pas de fraction chiffrée) :
- « Le tabac **accélère le bouchage** et favorise le caillot. »
- « Dès l'arrêt, le cœur **commence à se réparer**. »
- « Pour arrêter, un accompagnement complet existe → **thème Tabac**. » *(pont.)*

**RÉ-ENRICHISSEMENT — mécanisme CV, validé Thibault 2026-07-24** *(gate G-A8,
plan `refonte-audit-2026-07/S6` — 2026-07-24)*
> **Contexte.** La décision Thibault du 2026-07-23 (retrait de la frise de réversibilité, ligne
> ci-dessus au Calibrage) a réduit le M6 câblé à une bascule 2 états sans mécanisme. La décision
> Thibault du **2026-07-23** demande de **ré-enrichir** le module avec un objet qui **montre comment
> le tabac abîme les artères** (pas restaurer la frise — nouvel objet mécanisme). Les 5 étapes du
> mécanisme sont **sourcées** dans le rapport OpenEvidence Socle **§E.1** (`evidence-cardio/
> 2026-07-21-…-socle.md`, ligne 108 : « Dysfonction endothéliale, activation plaquettaire, ↑
> fibrinogène, stress oxydatif, inflammation, spasme coronaire → accélère l'athérosclérose +
> favorise la thrombose aiguë ») et **§E.2** (réversibilité). Ce qui manque, et qui doit être validé
> cliniquement avant tout code, c'est la **traduction en registre patient** (sans jargon, sans
> chiffre) de ces étapes et **l'ordre** dans lequel les montrer sur l'artère héros. Formulations
> ci-dessous = **validées** (Thibault 2026-07-24) — gate G-A8 levée.
>
> Séquence proposée sur l'**artère héros** partagée (Fumeur → Arrêté ; qualitatif, aucun chiffre) :
> 1. **Agression de la paroi** (Socle E.1 — dysfonction endothéliale, stress oxydatif, inflammation) :
>    « À chaque cigarette, la **paroi intérieure de l'artère s'irrite et s'abîme**. » *(validé Thibault 2026-07-24)*
> 2. **Vasoconstriction / spasme** (Socle E.1 — spasme coronaire) : « L'artère **se serre** : elle se
>    contracte et laisse moins bien passer le sang. » *(validé Thibault 2026-07-24 — étape absente du §M6 précédent)*
> 3. **Accélération de la plaque** (Socle E.1 — accélère l'athérosclérose) : « Sur cette paroi
>    fragilisée, la **plaque se dépose et grossit plus vite**. » *(validé Thibault 2026-07-24)*
> 4. **Thrombose** (Socle E.1 — activation plaquettaire, ↑ fibrinogène, thrombose aiguë) : « Le sang
>    devient **plus épais, plus collant** : un **caillot** peut boucher le passage d'un coup. »
>    *(validé Thibault 2026-07-24)*
> 5. **Réversibilité** (Socle E.2 — surrisque coronaire −½ dès la 1ʳᵉ année, rejoint le non-fumeur
>    en ~15 ans ; jamais chiffré à l'écran) : « **Dès l'arrêt**, l'artère se détend et le cœur
>    **commence à se réparer** — le sur-risque **reflue vite**. » *(validé Thibault 2026-07-24 ; conserve le message
>    positif non négociable.)*
>
> **Garde-fous (invariants du thème, à respecter dans l'objet) :** aucun chiffre à l'écran (E.2
> reste hors écran) ; aucune aspirine ; tabac **binaire** (Fumeur / Arrêté), pas de palier ;
> registre non anxiogène (« voilà ce qu'on protège »), pas d'artère gore ; **pont** « → Thème
> Tabac » conservé, non dupliqué. Les 5 formulations ci-dessus sont **validées cliniquement par
> Thibault (2026-07-24)** — gate G-A8 levée, câblage de l'objet interactif autorisé (module M6
> `src/features/cardio/tabac/`, S6).

**2ᵉ niveau (survol).**
- « **Même quelques cigarettes comptent** » : 2-5 cig/j → HR 1,57 sur la mortalité CV
  (Socle E.1-E.2 — Cross-Cohort Collaboration, PLoS Med 2025).

**Calibrage (jamais à l'écran).**
- Endpoints sourcés (Socle E.2, pour mémoire — non représentés à l'écran) : surrisque coronaire
  **−½ dès la 1ʳᵉ année** ; rejoint le non-fumeur en **~15 ans** (coronaire), 5-15 ans (AVC) ;
  > 80 % du surrisque éliminé à 20 ans ; arrêt avant 40 ans → −90 % du risque de décès lié au
  tabac.
- **Pas de frise de réversibilité** *(correction Thibault 2026-07-23, retire la décision
  précédente)* : elle ne faisait que dupliquer la barre de risque (2 états Fumeur/Arrêté, aucun
  jalon temporel réel affiché) sans intérêt pédagogique propre — la barre de risque seule porte
  le message.

**Pièges (brief M6).** Rester **court** : le « comment arrêter » vit dans le thème Tabac. Ici = le
« pourquoi CV » + l'aiguillage. Message = **arrêt** (pas de seuil « sûr »).

**Sources.**
```ts
sources: [
  "ESC 2021 — Guidelines on cardiovascular disease prevention",
  "Cross-Cohort Collaboration (Tasdighi E et al., PLoS Med 2025)",
  "Tabac Info Service / HAS — arrêt du tabac (pont thème Tabac)",
]
```

---

## Module 7 — Bouger

**Intention.** Bouger ≠ sport ; **ce qu'on fait déjà compte** ; un seul effort, plusieurs
bénéfices ; le plus grand saut = de *rien* à *un peu*.

**Message(s) à l'écran** (motivant, valorisant ; qualitatif) :
- « Bouger, ce n'est pas faire du sport. »
- « Ce que vous faites déjà compte. » *(marcher, ménage, jardinage, escaliers, porter les
  courses…)*
- « Un seul effort, **plusieurs bénéfices** : tension, cholestérol, sucre, stress, cœur. »
- « Le plus grand pas : passer de **rien** à **un peu**. » *(jauge sans plafond, pas de couperet.)*

**2ᵉ niveau (survol).**
- Recommandations ESC 2021 / OMS 2020 : **150-300 min/sem** d'activité modérée **OU** 75-150 min/sem
  vigoureuse ; renforcement musculaire **≥ 2 j/sem** ; ≥ 65 ans : + équilibre ≥ 3 j/sem (Socle F.3).
  Le repère « 150 min » reste **discret**, jamais un couperet.

**Calibrage (jamais à l'écran).**
- Dose-réponse **curvilinéaire** : bénéfice relatif maximal en passant de l'inactivité à ~30 min de
  marche/jour ; recos (150 min/sem) → ~−30 % de mortalité ; 3-5× les recos → ~−40 %, sans excès de
  risque (Socle F.2). **Jamais le −23/−40 % brut à l'écran** (brief). Pilote la forme de la jauge
  et de la courbe dose-réponse.

**Pièges (brief M7).** Jauge **sans plafond**, pas de barre « objectif atteint/échoué ».
Sédentarité = message « bouger un peu >> rien ». **Aucun chiffre d'étude à l'écran.**

**Sources.**
```ts
sources: [
  "OMS 2020 — Lignes directrices activité physique et sédentarité",
  "ESC 2021 — Guidelines on cardiovascular disease prevention",
]
```

---

## Module 8 — Manger pour ses artères

**Intention.** L'**assiette méditerranéenne** comme soin des artères ; le **sel** et les
**graisses** ; sans catalogue ni moralisation.

**Message(s) à l'écran** (appétissant, tactile, culturellement ouvert ; qualitatif) :
- « L'assiette méditerranéenne **soigne les artères**. »
  **// à revalider (Thibault) — formulation reformulée** : le rapport indique que le message
  patient de la section Nutrition n'a **pas été fourni** (Socle G.5 : « non fourni explicitement —
  à reformuler »). Cette phrase est une proposition à valider.
- « Le **sel** fait monter la tension. » *(lien direct au tuyau du M4.)*
- « Bons gras / gras à limiter. » *(insaturés favorables ; saturés → LDL, lien M5.)*

**2ᵉ niveau (survol).**
- Modèle méditerranéen (ESC 2021, Socle G.3) : fruits, légumes, légumineuses, céréales complètes,
  poisson, huile d'olive, noix ; limiter graisses saturées ; limiter sel.
- **Sel** : **✅ G1 (2026-07-22) : aucun seuil chiffré** (pas de g/j à l'écran ni au survol) —
  message qualitatif unique **« limiter le sel »**.

**Calibrage (jamais à l'écran).**
- Force de preuve du modèle (pilote l'intensité du « ça soigne ») : **PREDIMED** HR 0,70
  (0,55-0,89) sur le composite IDM/AVC/décès CV, HR 0,58 (0,42-0,82) sur l'AVC (Socle G.2) ;
  Lyon Diet Heart Study RR 0,27 (post-IDM) ; DASH : PAS −8 à −14 mmHg chez l'hypertendu.

**Pièges (brief M8).** **Diversité culturelle** (maghrébin, subsaharien, asiatique…) sans base de
données. **Pas de moralisation**, pas de régime restrictif punitif. **Jamais de chiffres imposés.**

**Sources.**
```ts
sources: [
  "ESC 2021 — Guidelines on cardiovascular disease prevention",
  "PREDIMED (Estruch R et al., NEJM 2018)",
  "SPF / PNNS — repères nutritionnels (repère sel — à re-sourcer)",
]
```

---

## Module 9 — Les autres leviers *(alcool · sommeil/apnées · stress)*

**Intention.** Les leviers qu'on oublie : réels, sourcés, sans culpabiliser. 3 volets ouverts à la
carte.

**Message(s) à l'écran** (sobre, exploratoire ; qualitatif) :
- **Alcool** : **✅ G1 (2026-07-22) : message = les repères SPF** — « **moins de 2 verres/jour, pas
  tous les jours, ≤ 10 par semaine** » (repère comportemental, affiché ; pas un seuil de labo). On
  s'en tient à ce message ; on n'affirme pas plus fort « non cardioprotecteur » (courbe en J
  *contestée*, pas réfutée — Complément J).
- **Sommeil / apnées** : « Le sommeil **répare le cœur**. » / « Ronflements, pauses respiratoires
  la nuit ? **À signaler** (dépistage possible). »
- **Stress** : « Le stress chronique **n'est pas que dans la tête**. » / « Le gérer — activité,
  relaxation, lien social — protège aussi le cœur. »

**2ᵉ niveau (survol).**
- **Alcool** — repères **Santé Publique France** : **maximum 2 verres/jour, pas tous les jours,
  ≤ 10 verres/semaine** (Complément J — SPF). *(Sourcé.)*
- **Sommeil** : durée **7-9 h** (AHA « Life's Essential 8 ») ; signes de **SAOS** (ronflements +
  pauses respiratoires) → orienter vers un **dépistage** (Complément J).
- **Stress** : dépistage dépression/anxiété/stress pro/isolement ; interventions multimodales
  (ESC 2021, Complément J).

**Calibrage (jamais à l'écran).**
- Alcool : au-delà de **3 verres/j**, risque systématiquement augmenté (HTA, FA, AVC hémorragique,
  cardiomyopathie) ; RR d'HTA 1,7 pour 50 g/j, 2,5 pour 100 g/j ; FA +10 %/verre au-delà de 14 g/j
  (Complément J). Bénéfice observationnel faible dose (−17/−18 % mortalité) **non causal**
  (randomisation mendélienne).
- Sommeil : SAOS → **doublement** du risque CV ; sommeil sain → −26 % mortalité (ASCVD), +~3 ans
  d'espérance de vie à 45 ans ; SAOS sévère non diagnostiqué chez ~40 % des STEMI (Complément J).
- Stress : stress pro RR 1,40 ; stress perçu RR 1,27 ; isolement social RR 1,50 (Complément J).

**Pièges (brief M9).** **Ne pas culpabiliser** (stress). Alcool : message clair « non
cardioprotecteur » **sans** ton prohibitionniste. **SAOS = orienter vers un dépistage, jamais
diagnostiquer à l'écran.**

**Sources.**
```ts
sources: [
  "Santé Publique France — repères de consommation d'alcool",
  "AHA — Life's Essential 8 (durée de sommeil) / Scientific Statement OSA & CVD",
  "ESC 2021 — Guidelines on cardiovascular disease prevention (stress psychosocial)",
]
```

---

## Module 10 — Reconnaître l'alerte *(module de survie — objet NEUF)*

**Intention.** Installer le réflexe **reconnaître → appeler le 15 → ne pas attendre**. « Chaque
minute compte » (time is brain / time is muscle).

**Message(s) à l'écran** (panneau de sortie de secours ; se lit sous stress) :
- **AVC — carte VITE** : « **V**isage qui tombe » · « **I**ncapacité à lever un bras » ·
  « **T**rouble de la parole » · « **E**n urgence → **15** ».
- **Infarctus — signes classiques** (3 cartes, restaurées 2026-07-23 depuis le brief d'origine
  §Module 10, perdues dans une simplification antérieure — cf. « // à revalider » ci-dessous) :
  1. « Une douleur qui **serre ou pèse sur la poitrine**, et qui ne passe pas. » (+ repère de durée
     « > 5 min », voir 2ᵉ niveau).
  2. « La douleur peut **s'étendre** : au bras (surtout gauche), à la mâchoire, au dos. »
     (irradiation).
  3. « Autour de la douleur : **sueurs froides, essoufflement**, parfois des nausées. » (signes
     associés).
- **Infarctus — formes atypiques** (3 cartes, une par signe, chacune avec sa propre illustration —
  avant 2026-07-23 un seul bloc/pictogramme portait les 4 signes ; carte « nausées isolées »
  retirée le 2026-07-24, décision Thibault, gate G-M10-nausées : signe jugé trop peu spécifique,
  risque de fausses alertes) : « Douleur dans le **dos**, sans douleur de poitrine. » / « Douleur
  dans le **ventre**, sans douleur de poitrine. » / « Une **fatigue intense**, inhabituelle. » —
  chapeauté par « Parfois autrement — **surtout femmes, diabétiques, personnes âgées**. »
  **// à revalider (Thibault)** : formulation exacte des **signes classiques et atypiques**
  (équilibre sensibilité / fausses alertes) = jugement clinique (point signalé par S1.md). Le
  **Complément K** (« reconnaissance de l'accident aigu ») listé dans
  `evidence-cardio/2026-07-21-rapport-openevidence-cardio-socle.md` comme **section manquante**
  (2ᵉ prompt OpenEvidence jamais relancé) — ce contenu vient du brief `BRIEF_DESIGN_cardio.md`
  §Module 10 (déjà présent, jamais sourcé par un rapport clinique dédié), pas d'une nouvelle
  invention. Un vrai Complément K resterait utile pour sourcer précisément chaque signe.
- **Le geste unique** : « **Appelez le 15** (ou 112). Ne conduisez pas. N'attendez pas que ça
  passe. »
- « **Chaque minute compte.** »
- *(Numéros 15 / 112 = identifiants d'urgence, affichés — seule exception à la règle « pas de
  chiffre à l'écran ».)*

**2ᵉ niveau (survol) — minimal (objet de crise).**
- Repère de durée de la douleur : **> 5 min** (Complément K ; brief M10).
  **// à revalider (Thibault)** : pour une carte de survie, faut-il **remonter « > 5 min » à
  l'écran** plutôt qu'au survol ? (tension avec l'invariant « pas de chiffre » vs utilité vitale).

**Calibrage (jamais à l'écran).**
- Fenêtres de traitement qui pilotent le message « chaque minute compte » : STEMI reperfusion
  **≤ 90 min** ; thrombolyse AVC **≤ 4,5 h** ; thrombectomie 6-24 h selon imagerie (Complément K).
- **Aspirine** : **✅ G1 (2026-07-22) : ne PAS la mentionner du tout** (ni écran, ni survol) —
  contre-indiquée si l'accident est un **AVC hémorragique** (indiscernable sans imagerie). Le seul
  geste enseigné = **appeler le 15** et suivre ses consignes.

**Pièges (brief M10).** Clarté sous stress > esthétique. **Formes atypiques capitales** (ne pas
rater l'infarctus de la femme). Message unique = **appeler le 15**, ne pas conduire, ne pas
attendre. **Aspirine : non mentionnée** (décision G1) — jamais affichée ni suggérée.

**Sources.**
```ts
sources: [
  "SAMU — 15 / 112 (urgences)",
  "AHA & American Red Cross 2024 — First Aid Guidelines (FAST / VITE)",
  "ACC/AHA 2025 — Management of Acute Coronary Syndromes",
]
```

---

## Module 11 — Mes traitements qui protègent

**Intention.** Remplacer « mes cachets font baisser un chiffre » par « **mes traitements gardent
mes artères** ». En primaire : **tension + cholestérol**.

**Message(s) à l'écran** (explicatif, sobre ; transcrit l'ordonnance réelle, jamais un catalogue) :
- « Vos traitements ne baissent pas un chiffre : ils **gardent vos artères**. »
- **Antihypertenseurs** (clic → cœur/cerveau/reins s'allument) : « **Baisser la pression** protège
  le cœur, le cerveau et les reins. »
- **Statines / ézétimibe** (clic → plaque stabilisée partout) : « Elles **stabilisent la plaque
  partout** — le médicament le plus étudié au monde. »

**2ᵉ niveau (survol).**
- « Quoi surveiller » + craintes/observance : statines → douleurs musculaires / foie → messages
  rassurants d'observance (brief M11 ; Complément L).
- **Aspirine — non mentionnée** (✅ G1 2026-07-22, cohérence avec M10) : ne pas l'afficher dans
  l'outil cardio (prévention primaire). Rationnel conservé hors écran : pas d'aspirine en primaire
  de routine (Complément L — ESC 2021 ; USPSTF 2022).

**Calibrage (jamais à l'écran) — attache « classe/rôle » des zones qui s'allument.**
- **4 classes antihypertenseurs de 1ʳᵉ ligne** (IEC, ARA2, inhibiteurs calciques, diurétiques
  thiazidiques), efficacité comparable — **le bénéfice vient surtout de la baisse de PA**
  (Complément L). IEC/ARA2 → protection rénale ; ICa (dihydropyridines) → possible supériorité AVC ;
  thiazidiques → supériorité insuffisance cardiaque ; bêtabloquants **pas en 1ʳᵉ ligne** sauf
  indication. La **classe/rôle** porte la zone protégée (durable) ; la **molécule** = étiquette
  fine posée par le soignant (anti-obsolescence).
- Statines : ~−22 %/mmol/L de LDL + effets pléiotropes (stabilisation de plaque) ; ézétimibe −23 %
  de LDL en ajout ; iPCSK9 −60 % en ajout (Complément L).

**Pièges (brief M11).** **Verrou anti-auto-prescription** : on transcrit et explique, on ne
**compare ni ne choisit** aucune molécule. Corps **pur** (halo positif, aucune alerte dessus).
**Aspirine en primaire** : ne pas la banaliser ni la suggérer.

**Sources.**
```ts
sources: [
  "ESC 2021 — Guidelines on cardiovascular disease prevention",
  "CTT / statines (Collins R et al., Lancet 2016)",
  "USPSTF 2022 — Aspirin Use to Prevent CVD",
  "HAS — bon usage des antihypertenseurs et hypolipémiants",
]
```

---

## Module 12 — Mon suivi

**Intention.** Retourner le suivi en **tableau de bord** : automesure de tension, bilan lipidique,
réévaluation du risque. Patient aux commandes, jamais « révision des 15 000 km ».

**Message(s) à l'écran** (pilotage, calme mais actif ; qualitatif) :
- « **Mes 3 chiffres à suivre** : tension · LDL · **glycémie** » *(correction Thibault 2026-07-23 :
  remplace « tour de taille », devenu orphelin le même jour — le facteur M2 correspondant a été
  remplacé par « sédentarité » — par un chiffre qui correspond à l'une des 5 stations ci-dessous,
  au lieu d'un 3ᵉ chiffre sans station associée).*
  **✅ G-M12 tranché (2026-07-22) : « mes 3 chiffres »** (grille légère), **pas** le cadran annuel.
- Stations : automesure tension · bilan lipidique · réévaluation du risque · glycémie · fonction
  rénale.
- États : « fait = coché » · « à programmer / à rattraper = ambre + horloge » · « examen espacé =
  grisé, prochain prévu ». **Jamais de rouge.**
- « Pas un bilan accablant : une **couverture**. »

**2ᵉ niveau (survol) — fréquences (prévention primaire, Complément M).**
- Réévaluation du **risque global** : tous les **3-5 ans** (plus souvent si risque modéré-élevé).
- **Glycémie / HbA1c** : **1-3 ans** selon le risque.
- **Fonction rénale** : **annuelle** si haut risque / traitement IEC-ARA2 / diabète.
- **Bilan lipidique** : contrôle 4-12 sem après initiation/modification, puis 3-12 mois ; stable à
  la cible → **1×/an**.
- **Tension** : à chaque consultation ; **AMT (règle des 3)** au long cours.
- **⏳ Réserve G1 (Thibault — à confirmer avec l'HAS)** : les fréquences ci-dessus restent à
  confirmer côté HAS avant le câblage du M12 (Thibault s'en charge). **Non bloquant** (M12 = Vague 4).

**Calibrage (jamais à l'écran).** Cadence recommandée **pré-peuplée** = les fréquences ci-dessus.
Statut lu sur l'**intervalle recommandé**, pas l'année civile (couverture, pas bilan accablant).

**Pièges (brief M12).** **Décision de conception à valider** (cadran vs « mes 3 chiffres »).
**Jamais de rouge** (le rouge-santé reste aux modules 2/4/5). Jamais « on est en novembre et vous
n'avez rien fait ».

**Sources.**
```ts
sources: [
  "HAS — suivi du risque cardiovasculaire en prévention primaire",
  "ESC 2021 — Guidelines on cardiovascular disease prevention",
]
```

---

## 13. Journal des décisions de contenu

Statut au **2026-07-22, après G1** (relecture soignant de Thibault). Décisions consignées ci-dessous ;
seule réserve restante = confirmation HAS des fréquences de suivi (M12), **non bloquante**.

| Module | Statut | Décision G1 (2026-07-22) |
|---|---|---|
| **M1** — L'artère | ✅ validé | Vitesse d'animation = design (rien à valider cliniquement). |
| **M2** — Mon risque global | ✅ validé | **Jamais de cible LDL en g/L** ; seuils modulés selon le risque CV (hors écran). Feux qualitatifs. |
| **M3** — Où l'accident frappe | ✅ validé | RAS (ordres de grandeur par territoire : optionnels, non affichés). |
| **M4** — La tension | ✅ validé | **AMT < 135/85 conservé** ; « < 140/90 » retiré ; message « une mesure unique n'est pas fiable ». |
| **M5** — Le cholestérol (LDL) | ✅ validé | Idem M2 : **jamais de g/L** ; « réduction ≥ 50 % » = argument hors écran. |
| **M6** — Le tabac | ✅ validé | Extrémités de frise sourcées ; jalons intermédiaires = design. |
| **M7** — Bouger | ✅ validé | Repère « 150 min » discret ; jamais le −23/−40 % à l'écran. |
| **M8** — Manger | ✅ validé | **Sel : aucun seuil chiffré**, message « limiter le sel ». |
| **M9** — Autres leviers | ✅ validé | **Alcool = repères SPF** « moins de 2/j, ≤ 10/sem » ; on n'affirme pas plus fort. |
| **M10** — Reconnaître l'alerte | ✅ validé | **Aspirine : ne pas la mentionner.** Geste unique = appeler le 15. Signes atypiques conservés. |
| **M11** — Mes traitements | ✅ validé | Aspirine **non mentionnée** (cohérence M10). Verrou anti-auto-prescription. |
| **M12** — Mon suivi | ⏳ réserve HAS | « **Mes 3 chiffres** » tranché ; **fréquences de suivi à confirmer avec l'HAS** (Thibault) avant câblage — non bloquant. |

**G1 franchie (2026-07-22).** Le pilote M1-M3 (déjà bâti) est conforme. Les modules M4-M12
(Vagues 3-4) liront ce doc validé. Seule la ligne M12 attend la confirmation HAS des fréquences
(Thibault), sans bloquer le fan-out des autres modules.
