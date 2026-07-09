# BRIEF_TABAC.md — Brief design & pédagogie du thème tabac   (rédigé par Fable, 2026-07-09)

> **Rôle du document.** Pendant tabac du `docs/diabete/BRIEF_DESIGN_diabete.md` : il dit *à quoi ça
> ressemble* et *pourquoi*, module par module. Deux différences avec le diabète :
> 1. **L'autorité sur l'existant est le CODE** (`src/features/tabac/`) — les 7 modules sont déjà
>    construits et ont divergé des docs de cadrage. Le §2 les décrit tels qu'ils sont ; en cas de
>    doute, lire le composant.
> 2. Le §3 spécifie les **extensions** décidées le 2026-07-09 (v1 directe sans maquette Claude
>    Design, cf. `DECISIONS.md`) : c'est la partie normative, câblée par les sessions
>    `plans/extensions-tabac/X1..X7`.
>
> Système visuel (tokens, typo, primitives) : `docs/DESIGN_REFONTE.md` reste l'autorité. Contenu
> médical : `docs/contenu-modules-tabac.md` (à resynchroniser en X7).

---

## 0. Contexte (rappel en 5 points)

1. **Support de consultation**, écran partagé soignant + patient, narré par le soignant. Pas un e-learning.
2. **Public mixte** (ambivalents + engagés, toutes littératies) → ton **non injonctif**, jamais culpabilisant.
3. **Zéro persistance** : toute manipulation est éphémère ; les fiches (§3.1) s'impriment à la volée, rien n'est conservé.
4. **Qualitatif / relatif** : aucune unité ni valeur pharmacologique à l'écran ; mention « schéma illustratif ».
5. Lisible à ~1 m, cibles ≥ 44 px, couleur jamais seule (double encodage).

---

## 1. Système visuel commun (constaté dans le code — à maintenir)

- **Grammaire de zones MANQUE / CONFORT / SURDOSAGE** : bandes soft vigilance/confort/toxique +
  libellés capitales. Langage central du thème (modules Nicotine, Substituts via surdosage).
- **LA COURBE 24 h** (langage transversal n°1) : axe temps 0–24 h, niveau relatif. Deux
  incarnations du même objet : la **nicotinémie** (module Nicotine) et la **tension liée au manque**
  (module Soulagement) — moteur partagé `features/tabac/lib/nicotineCurve.ts`. Même identité
  graphique, jamais redessinée de zéro.
- **Le geste « placer sur la frise »** : clic = déposer un événement à cet instant, clic sur le
  marqueur = retirer (Nicotine, Soulagement). Un seul geste, appris une fois.
- **Tooltip de zone au survol/focus** (module Nicotine : signes de manque / de surdosage) —
  embryon du 2ᵉ niveau de lecture, généralisé au §3.5.
- **Porte de fin de module** (module Nicotine ≠ toxique : bloc « Continuer l'exploration ») —
  généralisée au §3.3.
- **Familles** : Comprendre · Agir · Se motiver (accueil).
- **Fil rouge** (nouveau, §3.4) : le refrain du thème, installé en exergue d'accueil et repris en
  clôture des modules « Comprendre ».

---

## 2. Fiches-modules rétroactives (l'existant, tel que codé)

> Format court : Intention · Objet & états · 2ᵉ niveau · Portes · ⚠️ Pièges (à ne pas casser).

### 2.1 Les composantes de l'addiction (`addiction/`)
**Intention.** 3 dimensions imbriquées (physique / psychologique / comportementale), chacune avec ses leviers.
**Objet.** Diagramme de Venn SVG à géométrie fixe ; clic sur un cercle → panneau latéral « Signes possibles » + « Pistes à explorer » avec **boutons de navigation contextuels** (substituts, nicotine, craving).
**2ᵉ niveau.** Aucun.
**Portes.** Contextuelles, dans le panneau (déjà exemplaires — ne pas dupliquer en pied de module).
**⚠️ Pièges.** Rester une carte d'orientation ; les 3 cercles restent toujours visibles ; message « ces dimensions s'alimentent entre elles ».

### 2.2 La nicotine : cinétique & seuils (`nicotine/`)
**Intention.** Visualiser le yo-yo du fumeur et comment patch (fond) + substitut ponctuel (pics) maintiennent dans la zone de confort.
**Objet.** Frise 24 h cliquable : outil (Cigarette / Patch / Substitut) puis clic = événement posé ; patch en **quarts de dose ±¼** ; chip « Pic atteint : <zone> » ; bandes de zones ; tooltips signes manque/surdosage au survol des labels.
**2ᵉ niveau.** Tooltips de zones (existant).
**Portes.** Aucune (→ §3.3).
**⚠️ Pièges.** Mention « schéma illustratif » obligatoire ; la logique de courbe vit dans `nicotineCurve.ts` (testée Vitest) — ne jamais la dupliquer dans un composant.

### 2.3 La nicotine n'est pas le toxique (`nicotine-toxique/`)
**Intention.** Lever le frein « je remplace une drogue par une autre » : la combustion rend malade, la nicotine crée la dépendance.
**Objet.** Scène SVG (cigarette, fumée, zone nicotine) + 5 hotspots ; filtres « Toxiques de la combustion » / « Dépendance » ; bulle de détail ancrée ; double encodage ⚠/🧠.
**2ᵉ niveau.** Détails par hotspot (clic).
**Portes.** Bloc « Continuer l'exploration » → substituts, nicotine (**le modèle** du pattern porte).
**⚠️ Pièges.** Nuance « la nicotine n'est pas anodine » conservée ; ne jamais présenter la vapoteuse comme inoffensive.

### 2.4 Le piège du soulagement (`soulagement/`)
**Intention.** Le « plaisir » de la cigarette = soulagement du manque qu'elle a créé ; même au plus bas, le fumeur reste au-dessus du niveau stable du non-fumeur.
**Objet.** Frise 24 h « tension liée au manque » : clic = cigarette (chute au creux puis remontée), annotation « puis ça remonte… », toggle « Comparer au non-fumeur » (ligne repère + légende conditionnelle), callout « Lecture en 2 temps ».
**2ᵉ niveau.** Aucun.
**Portes.** Aucune (→ §3.3 : la plus criante — le module s'achève sur le constat du yo-yo sans issue proposée).
**⚠️ Pièges.** Ton non culpabilisant ; mention « schéma illustratif » ; invariant testé « creux fumeur > basal non-fumeur ».

### 2.5 Utilisation des substituts & titration (`substituts/`)
**Intention.** Bonnes pratiques par forme (5 formes) + méthode de titration par quarts, en autonomisant (« fiez-vous à votre ressenti »).
**Objet.** Cartes-formes → panneaux bonnes pratiques / erreurs ; placeholder « Technique de prise » (illustrations à venir, ne pas inventer) ; titration interactive : états « envie persiste » / « surdosage » / « jour-nuit », quarts de patch dessinés, bannière `.alert` surdosage, dose de nuit bornée par la dose de jour.
**2ᵉ niveau.** Aucun (→ §3.5 : efficacité des substituts).
**Portes.** Aucune (→ §3.3).
**⚠️ Pièges.** **Aucune dose en mg, jamais** ; le surdosage désactive le « + ¼ » ; garder « + ¼ (tous les 3 jours) » conditionné à envie & pas-de-surdosage.

### 2.6 Gérer le craving — 4D (`craving/`)
**Intention.** L'envie est une vague qui retombe seule ; les 4D aident à tenir pendant ce temps.
**Objet.** **Compte à rebours réel de 3 min** (horloge 3:00 → 0:00), marqueur parcourant la vague Bézier, 3 phases idle/active/done ; 4 cartes D activables (Différer / Détourner l'attention / Se détendre-respirez avec animation de respiration / D'eau) ; aparté 39 89.
**2ᵉ niveau.** Aucun.
**Portes.** Aucune (→ §3.3).
**⚠️ Pièges.** C'est le module « de crise » du thème : le contenu doit rester exécutable pendant une envie réelle — peu de mots, gros. « C'est passé » réservé à la fin réelle du décompte.

### 2.7 Explorer ma motivation (`motivation/`)
**Intention.** Faire le point sur ses raisons, sans balance décisionnelle ni jugement.
**Objet.** 2 onglets. « Où en êtes-vous ? » : flux 2 questions au **cadran circulaire** 0–10 (Importance, Confiance), relances EM (« Pourquoi pas N−1 ? » / « Qu'est-ce qui aiderait à passer à N+1 ? »), écran de synthèse. « Mes raisons » : réserve de cartes seed (Ma santé, Mes proches, Le budget, Le goût/l'odorat, Mon souffle/ma forme, Ma liberté) → clic = ajout au tableau, repositionnement au pointeur, clic = édition (label + détail), « + une raison ».
**2ᵉ niveau.** Aucun.
**Portes.** Aucune (→ §3.3 : synthèse → plan d'arrêt).
**⚠️ Pièges.** Pas de balance avantages/inconvénients ; relances jamais culpabilisantes ; état 100 % éphémère.

---

## 3. Extensions (normatif — sessions X1..X7)

### 3.1 Les fiches à emporter (socle X1, fiches X2-X4)

Deux catégories (héritées du brief diabète) :
- **Fiche-photographie** : capture ce que *ce* patient vient de manipuler (raisons, dose, plan).
- **Fiche-mémo de référence** : contenu stable, identique pour tous (méthode, réflexe) — registre signalétique.

**Mécanisme zéro-donnée** : la fiche se compose à l'écran, s'imprime (`window.print()`), rien ne
persiste. Aucun compte, aucun historique.

**Composant générique `FicheOverlay`** (`src/components/`, le moteur reste agnostique du thème) :
- Overlay plein écran (portal sur `document.body`, fond assombri) contenant une **feuille**
  proportion A4 portrait ; boutons « Imprimer » et « Fermer » hors zone d'impression.
- En-tête de feuille : eyebrow du thème, **titre serif**, date du jour. Pied : contenu passé par
  l'appelant + mention fixe « Fiche générée en consultation — rien n'est enregistré ».
- Impression : `@page { size: A4; margin: 14mm }` ; `@media print` masque `#root` et les contrôles,
  seule la feuille s'imprime. ADN visuel = tokens existants (crème, Source Serif, hairlines) —
  **pas de nouvelle palette**.
- L'aperçu peut être **interactif** (cases à cocher pour personnaliser) ; les contrôles
  d'édition disparaissent à l'impression (seul l'état résultant s'imprime).

**Les 4 fiches du thème :**

| Fiche | Module | Catégorie | Contenu |
|---|---|---|---|
| **Ma carte anti-envie** | Craving (X2) | référence + dessus perso | La boucle signalétique : ① l'envie monte → ② elle retombe seule en 3 à 5 min → ③ pendant ce temps : les 4D (mes préférés cochés = accentués, les autres présents mais discrets) · **39 89 très visible**. Gros, très peu de mots — se lit pendant une envie. |
| **Ma méthode patch** | Substituts (X3) | référence + photographie | Les 3 règles (« + ¼ tous les 2-3 jours si l'envie persiste et pas de signe de surdosage » · « signes de surdosage → revenir à la dose précédente » · « sommeil perturbé → dose de nuit plus faible ») + **ma dose du moment** (quarts dessinés, jour et nuit si activé) + signes de surdosage listés. Aucun mg. |
| **Mes raisons** | Motivation (X4) | photographie | Les cartes du tableau (libellé + détail personnel) ; si renseignées, Importance et Confiance /10. Chaleureuse, personnelle. |
| **Mon plan d'arrêt** | Plan d'arrêt (X5) | photographie — **ROI frigo maximal** | Voir §3.2. |

### 3.2 Le module « Mon plan d'arrêt » (X5)

**Intention.** Clore l'arc : tout le thème est démonstration ou exploration — ce module est
l'**application** (pendant du module 6 Suivi du diabète). On rassemble ce qui a été compris et
choisi en un plan concret, imprimé, collé au frigo.
**Registry.** `id: 'plan-arret'`, famille `agir`, titre « Mon plan d'arrêt », hue `confort`,
icône `Flag`. Résumé : « Rassembler date, substituts, parades et raisons en un plan concret à emporter. »
**Registre visuel.** Pilotage, valorisant — le patient est aux commandes. Une colonne de sections
`card`, remplissage dans le désordre accepté, rien d'obligatoire.
**Les sections (objets réutilisés — module compositionnel) :**
1. **Ma date** — `<input type="date">` natif stylé + rappel grand format serif de la date choisie.
2. **Mes substituts** — chips multi-sélection des 5 formes + renvoi « la dose se règle par quarts, selon le ressenti » (porte vers Substituts).
3. **Mes situations à risque** — chips multi-sélection reprenant les automatismes du module Addiction (café-clope, après les repas, en pause, en voiture, avec le téléphone, en social, avec l'alcool) + « + autre » (champ libre).
4. **Mes parades** — chips des 4D + champ libre.
5. **Mes raisons** — chips du seed Motivation + champ libre. *(Pas d'import automatique depuis le module Motivation : zéro persistance inter-modules — la re-sélection prend dix secondes et se fait en parlant.)*
6. **Autour de moi** (bloc fixe, non manipulable) — Tabac Info Service **39 89**, en parler à un proche, être accompagné par un professionnel.
**Fiche.** Bouton « Imprimer mon plan » (actif dès qu'au moins une section est renseignée) →
`FicheOverlay` : la date en grand, puis chaque section renseignée (les vides ne s'impriment pas),
le bloc 39 89, le fil rouge en pied.
**⚠️ Pièges.** Non injonctif : une date se **choisit**, ne s'impose pas (le module reste utilisable
sans date). Aucun conseil de dose. Ne pas transformer en formulaire administratif : c'est un
tableau de bord personnel, pas un contrat.

### 3.3 Les portes de fin de module (X6)

Composant générique `ModuleFooterNav` (`src/components/`) : titre court + boutons `{label →}`,
extrait du bloc « Continuer l'exploration » de Nicotine ≠ toxique (qui migre dessus). Toujours
optionnel, jamais un enchaînement forcé. Câblage :

| Module | Portes (id → libellé) |
|---|---|
| Nicotine | `substituts` → « Bien utiliser les substituts » · `soulagement` → « Pourquoi la cigarette “soulage” » |
| Soulagement | `substituts` → « Sortir du yo-yo : les substituts » · `craving` → « Tenir pendant l'envie : les 4D » |
| Craving | `motivation` → « Explorer mes raisons d'arrêter » · `plan-arret` → « Préparer mon plan d'arrêt » |
| Substituts | `plan-arret` → « Préparer mon arrêt » · `nicotine` → « Voir l'effet sur 24 h » |
| Motivation | `plan-arret` → « Passer au concret : mon plan » |
| Nicotine ≠ toxique | inchangé (migre sur le composant) |
| Addiction | inchangé (portes contextuelles dans le panneau — ne pas doubler) |
| Plan d'arrêt | aucune — la **fiche** est la sortie |

### 3.4 Le fil rouge (X6)

> **« C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se traite. »**
> *(libellé ajustable par Thibault — la structure en 3 temps est la décision)*

Emplacements :
- **Exergue de l'accueil du thème** : champ optionnel `exergue?: string` sur `ThemeDef`
  (générique), rendu par `Home` sous le titre — une ligne Source Serif italique discrète.
- **Ligne de clôture** des 4 modules « Comprendre » (Addiction, Nicotine, Nicotine ≠ toxique,
  Soulagement) : classe globale `.filrouge` (serif italique, `--color-text-soft`, filet gauche
  fin). Sur Nicotine ≠ toxique, elle **remplace** l'actuel « À retenir » (même message, libellé
  harmonisé).
- **Pied des fiches** (via le footer de `FicheOverlay`).
- Pas de répétition dans Agir/Se motiver (la sur-répétition tue le refrain).

### 3.5 Le 2ᵉ niveau de lecture (X6)

Généraliser le pattern tooltip de zones du module Nicotine en composant `InfoHover`
(déclencheur au survol **et** au focus clavier, comme l'existant). Contenus proposés —
**⚠️ chacun à valider par Thibault avant câblage** (cohérent avec C10 sources, seul point encore
en attente) ; toute entrée non validée est simplement non câblée :

| Module | Ancre | Contenu proposé (à valider + sourcer) |
|---|---|---|
| Substituts | en-tête de la section titration | « Avec un substitut bien dosé, les chances de réussir son arrêt augmentent d'environ 50 à 60 %. » *(revue Cochrane TSN)* |
| Nicotine | légende / outil Cigarette | « La nicotine s'élimine vite (demi-vie ≈ 2 h) : c'est ce qui crée le yo-yo et les envies répétées. » |
| Craving | mention « 3 à 5 minutes » | « La plupart des envies retombent en quelques minutes, qu'on fume ou non — chaque vague surmontée affaiblit la suivante. » |

---

## 4. Récapitulatif transversal

**Objets partagés — même dessin à chaque réapparition :**
| Objet | Modules | Rôle |
|---|---|---|
| LA COURBE 24 h | Nicotine · Soulagement | nicotinémie / tension du manque |
| Zones MANQUE/CONFORT/SURDOSAGE | Nicotine · Substituts (surdosage) | grammaire d'états |
| Quarts de patch | Substituts · Nicotine (dose) · fiche patch · Plan d'arrêt (renvoi) | titration visuelle |
| Les 4D | Craving · fiche anti-envie · Plan d'arrêt (parades) | parades immédiates |
| Cartes raisons | Motivation · fiche raisons · Plan d'arrêt (chips) | leviers personnels |
| Fil rouge | accueil · 4 modules Comprendre · pieds de fiches | fumée ≠ nicotine ≠ manque |

**Registres émotionnels :** Addiction = carte d'orientation · Nicotine/Soulagement = démonstration
jouée · Nicotine ≠ toxique = déminage · Substituts = autonomisation · **Craving = crise
(signalétique)** · Motivation = introspection calme · **Plan d'arrêt = pilotage/engagement**.

**Fiches :** anti-envie (référence+perso) · méthode patch (référence+photo) · mes raisons (photo) ·
**mon plan d'arrêt (photo, ROI ++)**.

---

## 5. ⚠️ En attente de validation Thibault (avant ou pendant les sessions)

1. Libellé exact du **fil rouge** (§3.4) — la v1 part sur le libellé proposé.
2. Les 3 contenus du **2ᵉ niveau** (§3.5) + leurs sources exactes — non câblés tant que non validés.
3. **Plan d'arrêt** : libellés des sections et listes de chips (§3.2) — la v1 part sur la proposition.
4. Formulations cliniques des fiches patch et anti-envie (reprises du contenu déjà validé 2026-06-28 / 2026-07-01 — relecture rapide suffisante).
