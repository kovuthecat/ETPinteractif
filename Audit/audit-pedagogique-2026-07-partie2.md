# Audit pédagogique ETP interactif — Partie 2 (complément)

> **Auditeur** : passe indépendante et critique, sur la **prod** déployée
> (`https://etp-interactif.vercel.app/consultation.html`), le **2026-07-23**.
> **Méthode** : navigateur in-app, manipulation réelle de chaque objet (onglets, sliders,
> radios, drag & drop, fiches). Référentiels : `docs/cardio/CONTENU_cardio.md` (M7-M12) et
> `docs/diabete/10-insuline-rapide.md`.
> **Aucun fichier source modifié, aucun build, aucun commit** — seul ce rapport est écrit.
> Ce document **complète** l'audit partie 1 (Tabac 10/10, Diabète 9/9, Cardio M1-M6 + M11 partiel) ;
> il ne réaudite pas ces modules.

---

## 1. Périmètre couvert + verdict global

**Modules réellement manipulés (7/7 du périmètre)** :

| # | Module | Thème | Verdict |
|---|--------|-------|---------|
| M7 | Bouger | Cardio | **Solide** |
| M8 | Manger pour ses artères | Cardio | **Solide** (dette d'illustration partielle) |
| M9 | Les autres leviers | Cardio | **Perfectible** (interactions décoratives) |
| M10 | Reconnaître l'alerte | Cardio | **Solide sur le fond / à finaliser sur la forme** (placeholders) |
| M11 | Mes traitements qui protègent | Cardio | **Solide** |
| M12 | Mon suivi | Cardio | **Solide** |
| — | Insuline rapide (avant le repas) | Diabète | **Solide** |

**Verdict global de cette passe.** Lot de bonne qualité, nettement au-dessus du seuil « diaporama » :
la plupart des modules sont de **vrais objets interactifs** où le patient expérimente (jauge d'activité
sans plafond, assiette à frontières glissables, silhouette qui s'allume par classe de médicament,
courbes de glycémie réactives). **Aucune erreur console** sur toute la session. **Aucun module à
refondre.** Les deux réserves réelles sont (a) une **dette d'illustration inégale et concentrée au
pire endroit** — le module de survie M10 est **entièrement en placeholders** — et (b) quelques
**interactions décoratives** (leviers « stress » de M9, check-list SAOS) qui se cliquent sans rien
apprendre. Rien de médicalement faux repéré.

---

## 2. Audit détaillé par module

### M7 — Bouger  ·  Verdict : SOLIDE

**Objectif annoncé** (doc M7) : bouger ≠ sport ; ce qu'on fait déjà compte ; un seul effort, plusieurs
bénéfices ; le plus grand saut = de *rien* à *un peu* ; jauge sans plafond.

1. **Objectif pédagogique — atteint.** Le patient comprend clairement les 4 messages. La grille propose
   des activités *du quotidien* (marche, ménage, escaliers, porter les courses, se lever d'une chaise,
   se relever du sol…), plusieurs tagguées « bon pour les muscles » — le message « ce que vous faites
   déjà compte » est incarné, pas asséné. Le total du jour affiche « … minutes · **et ça continue ···→** »
   (jauge explicitement sans plafond) et le refrain « Le plus grand pas : passer de rien à un peu ».
2. **Pertinence de l'objet — bonne.** Deux objets complémentaires et bien choisis : (a) une **jauge
   cumulative** d'activités, (b) un **2ᵉ onglet « La régularité »** = grille de semaine (L-M-M-J-V-S-D)
   cliquable avec barre « Protection sur la semaine » qui matérialise la décroissance 48-72 h et le
   repère « pas plus de 2 jours sans activité ». La régularité comme objet distinct est une vraie
   trouvaille pédagogique (rare et juste cliniquement).
3. **Interactivité — réelle, non décorative.** Le patient sélectionne des activités (pastille
   `aria-pressed`, « Marche✓ »), règle chaque durée au stepper +/- (pas de 5 min), et le total se
   recalcule (testé : Marche activée à 25 min → total « 25 minutes »). L'onglet régularité réagit aux
   jours cochés. Compréhensible sans le soignant.
4. **Fonctionnalité — OK.** Icônes = **vraies images PNG 512×512** qui chargent (Marche, Vélo, Ménage…),
   pas de placeholder. Aucun bug bloquant.

**Bugs / réserves mineures**
- **Incohérence 5 vs 6 bénéfices** : la phrase de tête liste « tension, cholestérol, **sucre**, stress,
  cœur » (5), mais le panneau affiche **6 cartes** (ajoute « Poids / tour de taille » et sépare Glycémie).
  Aligner le décompte, ou assumer les 6.
- **« Poids / tour de taille »** figure comme bénéfice de l'activité — légitime en soi, mais à noter au
  vu des décisions G1 (le facteur « tour de taille » a été retiré de M2 et remplacé par « glycémie » en
  M12). Vérifier que ce libellé ne réintroduit pas une notion volontairement écartée ailleurs.

---

### M8 — Manger pour ses artères  ·  Verdict : SOLIDE (dette d'illustration partielle)

**Objectif annoncé** (doc M8) : l'assiette méditerranéenne soigne les artères ; le sel ; bons/mauvais
gras ; diversité culturelle, sans moralisation ni chiffre imposé.

1. **Objectif pédagogique — atteint.** Onglet « Familles d'aliments » : *amis des artères* (huiles
   végétales, oméga-3, légumes, légumineuses, oléagineux, céréales complètes) vs *à limiter*
   (charcuterie, graisses saturées, sucreries, sel). Onglet « Composer mon assiette » : le patient
   compose et reçoit une **analyse d'équilibre** qualitative. Message « limiter le sel » **sans aucun
   seuil chiffré** (conforme décision G1). Le clic sur « Sel » explique le lien au tuyau du M4 (« fait
   monter la tension → la pression sur la paroi »).
2. **Pertinence de l'objet — excellente.** L'**assiette-camembert à 3 frontières** (Légumes / Féculents /
   Protéines) + un **garde-manger** par catégories = véhicule tactile idéal. Les **5 repas-types** sont
   **culturellement ouverts** exactement comme le demande le doc (Couscous légumes-merguez ; Riz-poisson
   façon thiéboudienne ; Poulet-plantain ; Assiette végétarienne ; Petit-déj méditerranéen).
3. **Interactivité — réelle (assiette) / plus « cliquable » (familles).** *Assiette* = vraiment
   expérimentale : ajout d'aliment par clic (testé : Brocoli → légende « Légumes 33% — Brocoli » et
   analyse « Pas assez de légumes : … la moitié de l'assiette »), **frontières glissables** (testé :
   drag → Légumes 33→22 %, Protéines 34→45 %), repas-type qui remplit les 3 secteurs et déclenche
   l'analyse (merguez détectée comme charcuterie → message sel/tension). *Familles* = « toucher pour
   lire pourquoi » : correct mais plus proche du cliquable que de l'expérimentation.
4. **Fonctionnalité — OK, mais illustrations inégales.** Les images qui chargent sont de vraies PNG
   512px. **MAIS** dans le garde-manger, **~14 repères sont des tuiles-placeholder** (un `div` affichant
   seulement le mot : « Tomate », « Courgette », « Aubergine », « Poivron », « Épinards », « Haricots
   verts », « Oignon », « Gombo », « Potiron », « Chou »…) tandis qu'une minorité (Brocoli, Carotte,
   Semoule, Merguez…) a un vrai visuel. **Incohérence visible dans un même garde-manger** : à côté d'un
   brocoli illustré, une « Tomate » n'est que le mot « Tomate ».

**Bugs / réserves**
- Dette d'illustration du garde-manger (cf. ci-dessus) — pas bloquant, mais nuit à la lisibilité à 1 m
  et à l'aspect « appétissant » voulu par le doc.

---

### M9 — Les autres leviers  ·  Verdict : PERFECTIBLE

**Objectif annoncé** (doc M9) : alcool / sommeil-apnées / stress ; réels, sourcés, sans culpabiliser ;
alcool = repères SPF ; SAOS = orienter vers dépistage, jamais diagnostiquer.

1. **Objectif pédagogique — globalement atteint.** Trois onglets bien séparés. **Alcool** : sélecteur
   verres/jour (1-6) + fréquence (tous les jours → occasionnellement), message réactif et **repère SPF
   affiché mot pour mot** (« moins de 2 verres/jour, pas tous les jours, ≤ 10 par semaine »), conforme.
   **Sommeil** : sélecteur d'heures (4-11 h), « Le sommeil répare le cœur », section SAOS « à signaler
   (dépistage possible) » — **non diagnostique**, conforme. **Stress** : « n'est pas que dans la tête »,
   facteur de risque reconnu, slider de stress perçu.
2. **Pertinence des objets — correcte.** Sélecteurs discrets et sobres, cohérents entre les 3 volets.
3. **Interactivité — partiellement décorative (le point faible du lot).**
   - *Alcool* — **bien** : 4 verres + tous les jours → « … deux repères non tenus en même temps (environ
     28 verres/semaine) ». Comparaison comportementale au repère SPF, **pas un score de risque** (conforme
     à l'exception « repères alcool affichés » du doc).
   - *Sommeil* — **bien** sur les heures (4 h → « Trop court : associé à un risque cardiovasculaire plus
     élevé »), **mais** la **check-list SAOS est inerte** : cocher « Pauses respiratoires observées »
     bascule la case mais **ne déclenche aucun message agrégé** (pas de « plusieurs signes → parlez-en à
     votre médecin »). On coche, rien ne se passe → l'interaction paraît décorative.
   - *Stress* — le slider réagit (max → « Niveau élevé et durable : un effet mesurable sur le corps »),
     **mais les 3 leviers « Activité / Relaxation / Lien social » sont purement décoratifs** : le clic
     met un état `aria-pressed=true` et **ne révèle aucun conseil ni contenu**. Un patient qui clique
     « Relaxation » n'apprend rien de plus.
4. **Fonctionnalité — OK.** Aucun bug technique, aucune erreur console. Les « morts » sont des manques
   de contenu réactif, pas des plantages.

**Réserves**
- Ajouter une conséquence à la check-list SAOS (message d'orientation quand ≥ 1 ou ≥ 2 cases cochées).
- Donner un **payoff** aux 3 leviers stress (au minimum une phrase-conseil par levier), sinon les
  retirer : en l'état ils créent une fausse promesse d'interactivité.

---

### M10 — Reconnaître l'alerte  ·  Verdict : SOLIDE SUR LE FOND / À FINALISER SUR LA FORME  ·  (audité en priorité)

**Objectif annoncé** (doc M10) : réflexe reconnaître → appeler le 15 → ne pas attendre ; carte VITE (AVC)
+ infarctus classiques ET atypiques ; « chaque minute compte » ; aspirine non mentionnée.

1. **Objectif pédagogique — atteint sur le contenu.** Tout le contenu attendu est présent et exact :
   - **Carte VITE** (onglet 1) : **V**isage qui tombe · **I**ncapacité à lever un bras · **T**rouble de
     la parole · **E**n urgence → 15. Lettres grosses et colorées, libellés lisibles.
   - **Infarctus classiques** (onglet 2, **3 cartes**) : douleur qui serre/pèse sur la poitrine « et qui
     ne passe pas » (+ repère **« Ça dure — plus de 5 minutes »** remonté à l'écran) · irradiation
     bras gauche/mâchoire/dos · sueurs froides/essoufflement/nausées.
   - **Formes atypiques** (**4 cartes** dans un encadré ambre distinctif « PARFOIS AUTREMENT — surtout
     femmes, diabétiques, personnes âgées ») : dos · ventre · fatigue intense · nausées isolées.
   - **Geste unique** : bandeau rouge « **15** — Appelez le 15 (ou 112). Ne conduisez pas. N'attendez pas
     que ça passe. » + « Chaque minute compte. » **Aspirine jamais mentionnée** (conforme G1).
   → Les **3 cartes classiques** et les **4 cartes atypiques** s'affichent bien, chacune séparément.
2. **Pertinence de l'objet — bonne, dans l'esprit « panneau de sortie de secours ».** Le bandeau « 15 »
   est gros, rouge, très lisible à 1 m. L'encadré ambre isole bien les formes atypiques (mémorisation).
   La **fiche imprimable « Ma fiche »** (carte-réflexe VITE + infarctus, date, QR vers l'app patient,
   « rien n'est enregistré ») est un bon emporter-chez-soi.
3. **Interactivité — volontairement faible, et c'est acceptable ici.** Le module est essentiellement
   **2 onglets + une fiche** : on ne « manipule » pas, on lit une signalétique. Pour un objet de survie
   c'est légitime (on n'expérimente pas des signes d'infarctus). À noter tout de même : c'est le module
   le plus proche du « diaporama cliquable » du lot — assumé par sa nature.
4. **Fonctionnalité — la grosse réserve : illustrations en placeholders.** **Toutes** les vignettes du
   module sont des **placeholders** : cases/cercles vides contenant le mot grisé répété (« Visage »,
   « Bras », « Parole », « Urgence » ; « La douleur », « Ça s'étend » ; « Dos », « Ventre », « Fatigue »,
   « Nausées »). **Aucun pictogramme réel.** Pour la carte censée « se lire en état de panique » et être
   **mémorisable**, l'absence d'iconographie est le manque le plus pénalisant du lot — d'autant que M7
   (icônes PNG) et M11 (silhouette PNG) montrent que l'app sait le faire ailleurs.

**Bugs / réserves**
- **Dette d'illustration totale** (cf. ci-dessus) — à traiter en priorité vu l'enjeu vital du module.
- **Incohérence de libellé écran ↔ fiche** : à l'écran « **Appelez le 15** (ou 112) » ; sur la fiche
  imprimée le corps de phrase devient « **Appelez immédiatement** (ou 112) » (le « 15 » n'y est que comme
  gros badge à côté). « (ou 112) » se lit alors comme l'alternative à un numéro absent de la phrase.
  Cosmétique, mais sur une carte de survie mieux vaut garder « Appelez le 15 (ou 112) » partout.
- **Point clinique à surveiller (non un bug)** : la carte atypique « **Nausées isolées, sans autre
  signe** » comme signe d'infarctus est très sensible → risque de fausses alertes. C'est un arbitrage
  sensibilité/spécificité **déjà signalé « // à revalider (Thibault) » dans le doc** ; je le confirme
  comme le point le plus discutable des 7 cartes, à valider par jugement clinique. Le reste des
  affirmations est médicalement sain.

---

### M11 — Mes traitements qui protègent  ·  Verdict : SOLIDE

**Objectif annoncé** (doc M11) : « mes traitements gardent mes artères » (≠ baisser un chiffre) ; en
primaire = tension + cholestérol ; verrou anti-auto-prescription ; aspirine non mentionnée.

1. **Objectif pédagogique — atteint.** Message de tête conforme : « Vos traitements ne baissent pas un
   chiffre : ils gardent vos artères. » On transcrit une ordonnance ligne par ligne, chaque classe
   allume les territoires qu'elle protège sur la silhouette.
2. **Pertinence de l'objet — bonne.** Ordonnance ↔ **silhouette réelle** (`silhouette.png` 512px) avec
   4 zones-hotspots (Cœur, Cerveau, Reins, Jambes). Véhicule juste pour « ce que ça protège ».
3. **Interactivité — réelle.** Chaque ligne = champ **molécule en texte libre** (le soignant transcrit
   l'ordonnance réelle) + menu de **classe** : IEC/ARA2, inhibiteur calcique, diurétique thiazidique,
   statine, ézétimibe (les 4 antihypertenseurs de 1ʳᵉ ligne + 2 hypolipémiants). **Aucune option
   aspirine** (conforme G1). Bouton « Voir l'effet » testé :
   - IEC/ARA2 → allume **Cœur + Cerveau + Reins** (classe `_hotspot--allume_`), **pas** Jambes +
     message « Baisser la pression protège le cœur, le cerveau et les reins ».
   - Statine → allume **les 4 territoires** + « Elles stabilisent la plaque partout — le médicament le
     plus étudié au monde. »
   → Comportement **exactement** conforme au doc. « Quoi surveiller » (ex. IEC/ARA2 : « tension et
   fonction rénale contrôlées par prise de sang ») et « Tout allumer sur la silhouette » présents.
   Le design **molécule libre + classe porteuse de l'effet** respecte bien le verrou anti-obsolescence
   et anti-auto-prescription (on transcrit/explique, on ne compare pas les molécules).
4. **Fonctionnalité — OK.** Silhouette et hotspots fonctionnels, pas d'erreur console.

**Réserves** : aucune bloquante.

---

### M12 — Mon suivi  ·  Verdict : SOLIDE

**Objectif annoncé** (doc M12) : suivi = tableau de bord, patient aux commandes ; « Mes 3 chiffres »
(tension / LDL / glycémie) + grille de stations ; **jamais de rouge**.

1. **Objectif pédagogique — atteint.** « Le suivi, comme un tableau de bord : vous restez aux commandes. »
   **« Mes 3 chiffres à suivre » = Tension / LDL / Glycémie** (la glycémie remplace bien le « tour de
   taille » orphelin, conforme correction 2026-07-23) + « Ces 3 chiffres se mesurent lors des examens
   ci-dessous ». Refrain « Pas un bilan accablant : une couverture. »
2. **Pertinence de l'objet — bonne.** Grille légère de 5 **stations** (Automesure tension, Bilan
   lipidique, Réévaluation du risque, Glycémie, Fonction rénale), chacune avec sa fréquence usuelle
   (marquée « à revalider », cohérent avec la réserve HAS non tranchée du doc). Fiche imprimable
   « Ma check-list frigo » (5 examens + lignes de date vierges, ton « couverture à votre rythme »).
3. **Interactivité — réelle et sobre.** Clic sur une station = cycle d'état, testé : **À programmer
   (ambre)** → **Fait (vert)** → **Espacé (grisé)**. Le patient « pilote » sa couverture.
4. **Fonctionnalité — OK, et invariant couleur respecté.** Vérifié par calcul des couleurs :
   À programmer = ambre (hue 80), Fait = vert (hue 145), Espacé = grisé — **aucun rouge** nulle part
   (conforme à l'invariant « le rouge reste réservé à l'état de santé, jamais une tâche non faite »).

**Réserves** : aucune bloquante. (Les « 3 chiffres » sont un en-tête statique renvoyant aux 5 stations
interactives — c'est cohérent, mais on pourrait à terme rendre les 3 chiffres eux-mêmes cliquables.)

---

### Insuline rapide (avant le repas) — Diabète  ·  Verdict : SOLIDE

**Objectif annoncé** (doc diabète 10) : DT2 basal-bolus ; la rapide couvre les glucides ; le bon moment ;
corriger avant le repas ; le piège du cumul ; rapide sans repas = hypo. Paliers qualitatifs, **jamais de
dose chiffrée** ; renvois au module 8 ; **pas de fiche imprimable**.

1. **Objectif pédagogique — atteint.** Les **5 temps** du doc sont présents comme **5 onglets** :
   ① Couvrir le repas · ② Le bon moment · ③ Corriger avant le repas · ④ Le piège du cumul ·
   ⑤ Et si je ne mange pas ? Refrain de sécurité affiché : « La bonne dose, c'est celle de votre
   protocole — ici on apprend le raisonnement, pas les chiffres. » **Pas de fiche imprimable** (conforme
   à l'interdiction explicite). Rappel « la rapide ne couvre que ce repas ; le reste, c'est la lente ».
2. **Pertinence de l'objet — excellente.** Une **courbe de glycémie SVG réactive** (bande-cible + « sans
   rapide » pointillé + « avec rapide ») pilotée par des radios/sliders : c'est le bon objet pour rendre
   visibles le pic, le timing et l'overshoot. Aucun chiffre de dose à l'écran.
3. **Interactivité — réelle sur 4 des 5 temps.** Testé onglet par onglet :
   - ① Beaucoup de glucides + Moins de dose → « Gros repas et peu de rapide : le pic n'est pas couvert,
     le sucre reste très haut. »
   - ② Slider de timing (-60 → +90 min) : au min « Injectée bien avant, la rapide a déjà commencé à
     agir… » ; au max « Injectée après le repas, la rapide arrive en retard : le pic a une longueur
     d'avance sur elle. »
   - ③ Glycémie « Haute » → « Départ haut, dose habituelle : ça reste au-dessus de la cible ; une
     correction en plus rapprocherait de la cible. »
   - ④ « Reste haute » + « Recorrige tout de suite » → « ça plonge sous la cible : les deux doses
     s'additionnent. » (leçon du *stacking* parfaitement matérialisée par la courbe qui plonge).
   - ⑤ « Et si je ne mange pas ? » : courbe qui plonge (« avec rapide, injectée quand même ») + règle
     d'or « on n'injecte pas la rapide si on ne mange pas » + bouton **« Ça ressemble à une hypo → le
     réflexe »** (renvoi module 8) + message d'exception (appétit incertain, personne âgée). C'est le
     seul onglet **quasi statique** (illustration + texte + 1 lien) — mais c'est justifié : c'est un
     scénario de mise en garde, pas un curseur à explorer.
4. **Fonctionnalité — OK.** Courbes = vrais graphes SVG rendus (viewBox 640×262, plusieurs tracés),
   pas de placeholder. Aucun chiffre affiché. Aucune erreur console.

**Réserves** : aucune bloquante.

---

## 3. Constats spécifiques à ce lot

**A. Dette d'illustration — inégale et mal répartie (constat central).**
L'app *sait* faire de vraies illustrations (M7 : icônes PNG 512px ; M11 : `silhouette.png` ; insuline :
graphes SVG). Mais elle ne l'a pas fait là où c'est le plus important :
- **M10 (survie) = 100 % placeholders** — le pire endroit possible pour une carte censée être
  mémorisable et lisible en panique. **Priorité n°1.**
- **M8 (garde-manger) = majorité de placeholders** (~14 tuiles-texte contre une poignée de vrais
  visuels), incohérent dans un même écran.
- M7, M11, M12, insuline : pas de dette notable.

**B. Interactions décoratives à corriger (M9).** Deux « morts » d'interaction : les 3 leviers stress
(clic sans payoff) et la check-list SAOS (cases sans conséquence). Ce sont les seuls endroits du lot où
l'on « clique pour rien ». À doter d'un contenu réactif ou à simplifier.

**C. Cohérence cardio ↔ diabète (doublons voulus, pas de conflit).**
- **M12 cardio « Mon suivi » ↔ suivi diabète** : M12 utilise « Mes 3 chiffres » + grille de stations
  légère (choix G-M12 tranché « mes 3 chiffres », *pas* le cadran annuel du diabète). La différence est
  **assumée par le doc**, ce n'est pas une incohérence — juste deux grammaires de suivi voisines à
  garder cohérentes visuellement si l'on veut une famille d'objets reconnaissable.
- **M8 cardio « assiette » ↔ assiette/garde-manger diabète** : le module insuline rapide renvoie
  explicitement à « l'assiette du module 2 » du diabète ; l'assiette-camembert + garde-manger de M8
  cardio partage manifestement la même grammaire. **Bonne réutilisation** — mais la dette d'illustration
  du garde-manger (constat A) se propagera aux deux thèmes s'ils partagent le composant.

**D. Sobriété / lisibilité à 1 m.** Globalement respectée : gros bandeau « 15 » (M10), lettres VITE
grosses, états couleur nets (M12). Les placeholders de M10/M8 sont le principal accroc à la lisibilité
« à 1 m ».

**E. Invariants médicaux — respectés dans ce lot.** Pas de dose chiffrée dans l'insuline rapide ; pas de
seuil de sel à l'écran (M8) ; repères SPF alcool affichés comme prévu (M9) ; aspirine jamais mentionnée
(M10, M11) ; jamais de rouge pour une tâche non faite (M12) ; SAOS = orienter, pas diagnostiquer (M9).
Seul point clinique à trancher : la carte « nausées isolées » de M10 (déjà « // à revalider » au doc).

---

## 4. Annexe technique — bugs / limitations avec repro

**Erreurs console** : **aucune** sur toute la session (cardio M7-M12 + insuline rapide), filtre
`onlyErrors=true`.

**Bugs / réserses reproductibles :**

1. **[M10] Illustrations = placeholders (tous).** Repro : Cardio → Reconnaître l'alerte → onglet
   AVC-VITE puis Infarctus-signes → chaque vignette est une case/cercle vide contenant le mot grisé.
   *Sévérité : haute (module de survie).*
2. **[M10] Libellé fiche ≠ écran.** Repro : Reconnaître l'alerte → « Ma fiche ». La fiche dit « Appelez
   **immédiatement** (ou 112) » alors que l'écran dit « Appelez **le 15** (ou 112) ». *Sévérité : faible
   (cosmétique, mais sur une carte de survie).*
3. **[M8] Garde-manger — illustrations mixtes.** Repro : Manger → « Composer mon assiette ». La plupart
   des aliments (Tomate, Courgette, Aubergine, Poivron, Épinards, Haricots verts, Oignon, Gombo,
   Potiron, Chou…) sont des tuiles-texte (`div[role=img]` sans image) ; une minorité a un vrai PNG.
   *Sévérité : moyenne (lisibilité / aspect appétissant).*
4. **[M9-Stress] 3 leviers décoratifs.** Repro : Autres leviers → Stress → cliquer « Activité » /
   « Relaxation » / « Lien social ». État `aria-pressed=true` mais **aucun contenu révélé**.
   *Sévérité : moyenne (fausse promesse d'interactivité).*
5. **[M9-Sommeil] Check-list SAOS inerte.** Repro : Autres leviers → Sommeil → cocher « Pauses
   respiratoires observées ». La case bascule mais **aucun message agrégé** n'apparaît. *Sévérité :
   faible-moyenne.*

**Limitations de la passe (transparence méthodo) :**
- **`screenshot` du pane instable** : après ouverture de la modale « Ma fiche » de M10, l'outil
  screenshot est resté **gelé** sur cette image pour le reste de la session. J'ai donc conduit l'audit
  via **`read_page` + inspection DOM (JS lecture seule)**, fiables et concordants (aria, classes,
  couleurs calculées, valeurs). Les rendus visuels de M10 (VITE, Infarctus, bandeau 15) ont été
  capturés **avant** le gel et sont documentés. Ce gel est un artefact de l'outil, **pas un bug du site**.
- **Clics par coordonnées parfois sans effet** (ex. radios de l'onglet ① insuline via `computer`), alors
  que le clic direct sur l'élément passait — vraisemblablement lié au décalage de l'espace-coordonnées du
  screenshot gelé, **pas** à un défaut du site (l'état React se met bien à jour). Toutes les interactions
  citées comme « fonctionnelles » ont été confirmées sur l'état réel du DOM.
- Le drag des frontières de l'assiette (M8) et le drag des sliders ont été validés (proportions et
  valeurs changées) ; le drag n'est **pas accessible au clavier** (poignées SVG sans `tabindex`/`role=slider`) —
  acceptable sur écran tactile de consultation, à noter pour l'accessibilité.

---

*Fin du rapport — partie 2. Modules non couverts : aucun (les 7 du périmètre ont été manipulés).*
