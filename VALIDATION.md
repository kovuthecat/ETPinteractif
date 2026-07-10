# VALIDATION.md — checklist visuelle / UX (passe humaine)

> Validation **visuelle** déléguée à Thibault, **non bloquante** pour les commits.
> Claude consigne ici (ne tente pas de vérifier lui-même : pas de navigateur).
> Dérouler en une session : `npm run dev`, puis cocher.
>
> Légende statut : [ ] à valider · [x] OK · [!] à corriger (décrire dessous).
> Rappel cadre : lisible à ~1 m, sobre, interactif (≠ diaporama).
>
> **Portée : état *actuel* de l'app uniquement** (thème tabac, après refonte UI + moteur multi-thèmes).
> Ce fichier ne contient que ce qui reste à valider sur les écrans tels qu'ils existent aujourd'hui.
> **Purge** : supprimer un bloc entièrement `[x]` après la passe humaine — l'historique git suffit.
> L'historique détaillé des vagues de correction (T\*, C\*, R\*, V\*, A\*, S\*) est dans `git log` +
> raconté dans `STATUS.md` (« Ce qui fonctionne ») et `DECISIONS.md`.
> **Validation du thème diabète** : ira dans `docs/diabete/VALIDATION.md` quand il y aura du code à valider.

---

## Cadre transverse (à vérifier une fois, vaut pour tous les modules)

- [ ] Lisible à ~1 m : typographies larges, contrastes élevés, cibles cliquables ≥ 44 px.
- [ ] Aspect « papier chaud » : fond crème, cartes/panneaux blancs à ombre brune douce, rayons généreux.
- [ ] Typographie : titres en **Source Serif 4** (serif), texte courant en **Work Sans** (sans) ; accents FR nets.
- [ ] Onglet réseau : **aucune** requête vers `fonts.googleapis.com` / `fonts.gstatic.com` (fonts 100 % locales).
- [ ] Couleurs sémantiques distinctes et cohérentes : vert confort / rouge toxique / ambre vigilance / bleu nav.
- [ ] `prefers-reduced-motion` respecté (pas d'animation intempestive quand l'option OS est active).
- [ ] **Zéro persistance** : recharger la page (reload) ramène à l'accueil, aucune sélection conservée.
- [ ] Aucun débordement horizontal / hors-cadre sur écran large (≥ 1800 px), tablette et mobile.
- [ ] **S14/B8** (diabète, `IllustrationSlot`) : plus aucun texte de placeholder (aliment, illustration
      d'organe…) ne déborde de sa tuile, quelle que soit la taille — masqué sous ~56 px de côté.

## Sélection de thème + accueil

- [ ] Au lancement, écran « Choisir un thème » : 2 cartes — **Sevrage tabagique** (cliquable) et **Diabète**
      (grisée, badge « Bientôt disponible », non cliquable ; cliquer ne fait rien).
- [ ] « Sevrage tabagique » ouvre l'accueil du thème : grille de 7 cartes en 3 familles titrées —
      **Comprendre** (4), **Agir** (2), **Se motiver** (1), intertitres discrets.
- [ ] Cartes lisibles (icône + titre + résumé) ; entièrement cliquables ; grille 3 col → 2 col (768 px) → 1 col (480 px).
- [ ] Depuis un module, le bouton **Retour** ramène à l'accueil du thème (pile d'historique éphémère), pas à la sélection de thème.
- [ ] Bouton **« Sources »** en toutes lettres dans l'en-tête de chaque module (`:focus-visible` net au clavier) ;
      ouvre un pop-over (actuellement « à compléter », cf. questions de contenu ci-dessous).

## Module 1 — Les composantes de l'addiction (Venn)

- [ ] Diagramme de Venn à 3 cercles (Physique / Psychologique / Comportementale) à **géométrie fixe** (même rayon dans tous les états).
- [ ] Chaque titre est **contenu dans son propre cercle**, sans sous-texte ni halo blanc, sans chevaucher les autres (vérifier à 1440×900 + mobile ; « Comportementale » = le plus long).
- [ ] Message central « Ces dimensions s'alimentent entre elles » **toujours visible**.
- [ ] Cliquer un cercle le distingue (contour/opacité/léger agrandissement) et ouvre **un panneau latéral** unique (signes + pistes), jamais des bulles superposées au diagramme.
- [ ] Les boutons de renvoi (« autre module ») ouvrent bien Substituts / Nicotine / Craving et sont focusables au clavier.

## Module 2 — La nicotine : cinétique & seuils (frise statique)

- [ ] **Frise temporelle statique** (pas de balayage animé ni de curseur qui défile).
- [ ] Consigne d'amorce visible au-dessus des gestes ; chip **« Pic atteint : Manque / Confort / Trop haut »**.
- [ ] Ajouter une prise (cigarette / substitut ponctuel / vapoteuse / patch) par **glisser sur la frise** (position = temps) ; ligne fantôme pendant le drag ; fallback clic/clavier ajoute au temps suivant.
- [ ] Prises rapprochées : la courbe **cumule vers le haut** (zone rouge = surdosage) ; retrait par croix sur le pictogramme ou X dans la liste.
- [ ] Survol (ou focus clavier) des titres **MANQUE** / **SURDOSAGE** → pop-up des signes, sans débordement de la carte ; **rien** sur « ZONE DE CONFORT ».
- [ ] Mention « schéma illustratif » présente ; **aucun** dosage chiffré.

## Module 3 — Utilisation des substituts & titration (Agir)

- [ ] Sélecteur des **5 formes** (patch, gomme, pastille, comprimé sublingual, spray buccal) ; consigne « Sélectionnez une forme… » au-dessus des chips ; plus d'inhaleur ni de vapoteuse.
- [ ] Chaque forme affiche bonnes pratiques + erreurs (contenu réel) ; plus aucune « fiche en cours de rédaction ».
- [ ] Titration : bouton **« + ¼ (tous les 3 jours) »** + aide de condition ; patchs dessinés en grille **2×2** ; libellé « N patchs + ¼ » lisible.
- [ ] Cocher « Signes de surdosage » → **bannière d'alerte rouge** explicite avec bouton « Revenir en arrière (− ¼) » ; décocher la fait disparaître.
- [ ] Bloc « Dose de nuit » (si « Jour/Nuit » coché) toujours **≤ dose de jour** ; message « Expérimentez, fiez-vous à votre ressenti » présent ; **aucun** dosage chiffré.

## Module 4 — La nicotine n'est pas le toxique (Comprendre)

- [ ] Scène SVG « affiche » : cigarette/fumée au centre, hotspots toxiques reliés par trait pointillé à leur étiquette (étiquette collée à l'extrémité du trait, à toutes tailles d'écran).
- [ ] Sans couleur, on lit **« Ce qui rend malade »** vs **« Ce qui crée la dépendance »** (double encodage : icônes ⚠/🧠 + libellés).
- [ ] Cliquer un hotspot ouvre une pop-up **ancrée près du point** (jamais hors cadre) ; croix pour fermer ; sous 900 px, la pop-up devient un bandeau bas qui ne recouvre aucun hotspot.
- [ ] Filtre « toxiques » / « dépendance » : atténue **légèrement** l'autre groupe sans le masquer ; recliquer restaure la vue.
- [ ] Les 2 renvois ouvrent les bons modules.

## Module 5 — Le piège du soulagement (frise statique)

- [ ] **Frise statique** (pas de curseur ni de balayage) ; consigne en 2 temps visible dès l'ouverture, **encadrée** (bordure orange).
- [ ] Cliquer « Fumer une cigarette » dépose un pictogramme ; la **tension** chute au pic de nicotine (courbe repère pointillée) puis remonte ; enchaîner cumule les dents de scie.
- [ ] Annotation de délai (« puis ça remonte… ») entre chute et remontée ; légende **« Tension liée au manque »** (plus « Stress »).
- [ ] « Comparer au non-fumeur » superpose une ligne repère verte **sous** le creux le plus bas du fumeur (libellé texte, jamais couleur seule).
- [ ] Mention « schéma illustratif » présente ; ton non culpabilisant.

## Module 6 — Gérer le craving (4D) (Agir)

- [ ] « La vague de l'envie » : marqueur parcourt la cloche en ~30 s (états ça monte → pic → redescend → passé) ; bouton rejouer ; pas de fuite de timer après navigation.
- [ ] Les 4 D (Différer / Distraire / Décontracter / De l'eau) sont des **bascules** (plusieurs actives à la fois) ; leurs cartes se superposent sur la zone du pic et l'**estompent de plus en plus** (1 → 4 outils) sans jamais déborder du cadre.
- [ ] Widgets internes : compte à rebours « Différer », pulsation « Distraire » (figée si reduced-motion), cercle de respiration « Décontracter », séquence de gorgées « De l'eau ».
- [ ] **« C'est passé »** réservé à la **fin réelle** de la vague : « Différer » sans vague lancée affiche une invite, pas « C'est passé ».
- [ ] Aparté « Tabac Info Service 39 89 » discret.

## Module 7 — Explorer ma motivation (Se motiver)

- [ ] Deux onglets : **« Où en êtes-vous ? »** (échelles) / **« Mes raisons »** (tableau) ; un seul panneau visible à la fois ; bascule au clic + flèches clavier ; valeurs conservées au changement d'onglet.
- [ ] Deux curseurs 0–10 (importance / confiance), piste épaisse + bornes **« 0 »/« 10 »** visibles ; la relance change avec la valeur (aucune relance « plus bas » à 0 ni « plus haut » à 10).
- [ ] Onglet « Mes raisons » : cartes en **réserve** (bac) au-dessus d'un tableau ; glisser une carte réserve↔tableau (drop borné aux bords) ; les deux zones se surbrillent pendant le drag.
- [ ] Carte éditable (texte + détail) ; « + une raison » crée une carte dans la réserve (focus posé) ; clavier : Entrée/Espace place, Suppr/Retour renvoie à la réserve, flèches = nudge intra-tableau.
- [ ] Cartes 220–280 px (titres longs non tronqués) ; tableau à hauteur raisonnable.

## Socle fiches (X1) — `FicheOverlay` + impression

> Socle générique (`src/components/FicheOverlay.tsx` + section « Fiches » de `src/styles/global.css`),
> sans consommateur pour l'instant (les fiches concrètes arrivent en X2-X5). Pour valider visuellement,
> il faut un déclencheur temporaire (ex. bouton de test monté ad hoc dans un module, retiré après coup)
> ou attendre qu'une session X2-X5 câble un premier appelant. Décrit ci-dessous ce qu'il faut vérifier
> une fois un appel `<FicheOverlay eyebrow="…" titre="…" onClose={…}>contenu de test</FicheOverlay>`
> disponible à l'écran.

- [ ] À l'ouverture, fond assombri plein écran + feuille centrée proportion A4 portrait (`min(720px, 92vw)`,
      `aspect-ratio: 210/297`), ombre `--shadow-3`, fond `--color-surface` — cohérent avec l'esthétique
      « papier crème » du reste de l'app (pas de nouvelle palette).
- [ ] En-tête de la feuille : eyebrow (style `.eyebrow` existant), titre en **Source Serif**, date du jour
      en toutes lettres (ex. « 9 juillet 2026 »).
- [ ] Pied de la feuille : contenu `footer` (s'il est fourni) puis, toujours, la mention
      « Fiche générée en consultation — rien n'est enregistré. ».
- [ ] Si le contenu déborde la hauteur de la feuille, la feuille défile à l'écran (`overflow-y: auto`)
      sans casser la mise en page.
- [ ] Barre d'actions **hors feuille** (sous ou au-dessus) : bouton « Imprimer » (`.btn--primary`) et
      « Fermer » (`.btn--ghost`), cibles ≥ 44 px.
- [ ] Au montage, le focus clavier est posé sur le bouton **Fermer** (pas Imprimer).
- [ ] Cliquer le fond assombri (hors feuille) ferme l'overlay ; cliquer à l'intérieur de la feuille ne ferme pas.
- [ ] Touche **Échap** ferme l'overlay.
- [ ] Bouton « Fermer » ferme l'overlay.
- [ ] Lecteur d'écran / clavier : la boîte est annoncée comme dialogue modal (`role="dialog"`,
      `aria-modal="true"`), avec un libellé = titre de la fiche.
- [ ] **Aperçu avant impression** (Ctrl+P dans le navigateur) : une seule page A4, marges ~14 mm,
      **aucune** UI de l'app autour (le reste de l'écran/#root disparaît), la barre d'actions
      (Imprimer/Fermer) est absente de l'aperçu, la feuille s'adapte à la page (plus de proportion A4
      forcée en CSS, plus d'ombre/bordure superflue).
- [ ] Aucune régression visuelle ailleurs dans l'app (boutons `.btn`, `.chip`, `.card`, bandes de zone) —
      seuls des ajouts en fin de `global.css`.

## X6 — Portes de fin de module + fil rouge + `InfoHover`

> Contexte : `plans/extensions-tabac/X6.md`, autorité `docs/BRIEF_TABAC.md` §3.3-§3.5. Auto (tsc/vite
> build/vitest) déjà vert — ce qui suit est la passe humaine (navigation, lecture, survol).

### T2 — Portes de fin de module (`ModuleFooterNav`)

- [ ] Nicotine ≠ toxique : visuel du bloc « Continuer l'exploration » **inchangé** après migration sur
      `ModuleFooterNav` (mêmes libellés, mêmes cibles vers Substituts / Nicotine).
- [ ] Nicotine → portes « Bien utiliser les substituts » (→ substituts) et « Pourquoi la cigarette
      "soulage" » (→ soulagement), tout en bas du module.
- [ ] Soulagement → portes « Sortir du yo-yo : les substituts » (→ substituts) et « Tenir pendant
      l'envie : les 4D » (→ craving).
- [ ] Craving → portes « Explorer mes raisons d'arrêter » (→ motivation) et « Préparer mon plan
      d'arrêt » (→ plan-arret) ; **visibles dans les 3 phases** (idle / active / done), sous l'aparté
      39 89 — jamais masquées pendant le décompte.
- [ ] Substituts → portes « Préparer mon arrêt » (→ plan-arret) et « Voir l'effet sur 24 h »
      (→ nicotine).
- [ ] Motivation → porte unique « Passer au concret : mon plan » (→ plan-arret), visible sur les deux
      onglets (Où en êtes-vous ? / Mes raisons).
- [ ] Addiction et Plan d'arrêt : **aucune** porte en pied de module (déjà exemplaires / la fiche est
      la sortie).
- [ ] Chaque porte navigue vers le bon module et le bouton **Retour** ramène bien à l'accueil du thème
      (pas de régression de la pile de navigation).
- [ ] Boutons de porte cibles ≥ 44 px, focusables au clavier, `aria-label="Aller plus loin"` sur le
      `<nav>`.

### T3 — Fil rouge

- [ ] Accueil du thème tabac : sous le titre « Votre accompagnement », une ligne serif italique
      discrète (`--color-text-soft`) — « C'est la fumée qui rend malade. C'est le manque qui fait
      fumer. Et le manque, ça se traite. » — lisible sans lourdeur, pas de répétition sur l'écran de
      choix de thème.
- [ ] Clôture des 4 modules « Comprendre » (Addiction, Nicotine, Nicotine ≠ toxique, Soulagement) :
      même ligne, filet gauche fin, en toute dernière position du module (Nicotine ≠ toxique :
      remplace l'ancien paragraphe « À retenir »).
- [ ] Pas de fil rouge dans les modules Agir / Se motiver (Substituts, Craving, Motivation, Plan
      d'arrêt) en dehors du pied de fiche — pas de sur-répétition.
- [ ] Pied des 4 fiches (`FicheOverlay`) : carte anti-envie, méthode patch, mes raisons, mon plan
      d'arrêt — le refrain apparaît en petite taille italique, au-dessus de la mention fixe « Fiche
      générée en consultation — rien n'est enregistré. », y compris à l'impression (Ctrl+P).

### T4 — `InfoHover`

- [ ] Composant créé et **non câblé** dans l'app (comportement attendu — aucune entrée de
      `docs/BRIEF_TABAC.md` §3.5 validée à ce stade) : rien à observer à l'écran pour ce point tant que
      Thibault n'a pas validé de contenu. Cette ligne peut être cochée directement.
- [ ] Si/quand une entrée §3.5 est validée et câblée dans une session ultérieure : vérifier que le
      survol **et** le focus clavier (Tab) ouvrent le panneau, qu'il ne bloque jamais le clic sur
      l'élément déclencheur, et qu'il reste dans le cadre à toutes tailles d'écran.

## X8 — Fiche patch : marge « à colorier » + prise ponctuelle

> Contexte : `plans/extensions-tabac/X8.md` (demande Thibault 2026-07-09, hors brief initial). Auto
> (tsc/vite build/vitest 50 tests) déjà vert — ce qui suit est la passe humaine (écran + Ctrl+P).

- [ ] Écran (module Substituts, section titration) : rendu **inchangé** par rapport à avant X8 — la
      marge « à colorier » et le sélecteur de prise ponctuelle n'apparaissent que dans la fiche, pas
      à l'écran.
- [ ] Ouvrir la fiche (« Imprimer ma méthode ») avec une dose de jour quelconque (ex. 1 patch + ¼) :
      bloc « Ma dose du moment » → grille **Jour** = quarts pleins en **vert** puis quarts **vides** en
      plus, complétant le patch en cours **+ 1 patch entier vide** ; légende « Colorie ¼ de plus tous
      les 3 jours si l'envie persiste, sans signe de surdosage. » sous la grille.
- [ ] Si « Distinguer jour / nuit » est actif : la grille **Nuit** reste une simple photographie
      (aucune marge vide ajoutée au-delà de la dose actuelle).
- [ ] Sur la carte titration (avant le bouton « Imprimer ma méthode ») : bloc « Ajouter une prise
      ponctuelle à ma fiche » avec « Aucune » + les 4 formes ponctuelles (gomme, pastille, sublingual,
      spray) — **le patch n'est pas dans cette liste**. Sélection indépendante de la forme explorée
      plus haut dans le module (« Choisissez une forme pour ses bonnes pratiques »).
- [ ] Avec une forme ponctuelle sélectionnée, la fiche affiche un bloc « Ma prise ponctuelle — {forme} »
      (placeholder d'illustration + liste des bonnes pratiques de cette forme) entre la dose et le
      bandeau 39 89. Avec « Aucune », ce bloc est absent.
- [ ] **Ctrl+P (aperçu avant impression)** : les quarts pleins s'impriment bien en **vert plein**
      (pas de disparition de la couleur de fond) ; les quarts vides ont un **contour visible**
      (pointillé) permettant de les colorier au stylo une fois imprimés.
- [ ] La fiche tient sur **1 page A4**, y compris avec une prise ponctuelle sélectionnée et une dose de
      jour élevée (2-3 patchs). Si ce n'est pas le cas, le signaler plutôt que de considérer que c'est
      bloquant (cf. « Si bloqué » du plan X8, T3).
- [ ] Aucune dose en mg n'apparaît nulle part sur la fiche.

---

## Questions de contenu en attente de Thibault (indépendantes du visuel)

> Points de contenu médical / éditorial proposés par Claude, **à valider ou corriger par Thibault**.
> Dépouillement du 2026-07-08 : regroupements toxiques + formulation nicotine (Module 4), amplitudes
> du soulagement (Module 5) et cartes/échelles motivation (Module 7) **validés** → retirés. Inhaleur +
> vapoteuse **retirés** du Module 3 (cf. `DECISIONS.md`). Reste :

- [ ] **Sources exactes par module.** Chaque module a, dans son en-tête, un bouton « Sources » qui
  ouvre un petit encart. Aujourd'hui il affiche « à compléter » car on n'a encore renseigné **aucune
  référence** (le champ `sources` de `registry.ts` est vide). Il s'agit de fournir, **par module**,
  les références à citer (ex. « HAS — Arrêt du tabac, 2023 » / « Tabac Info Service » / un lien) pour
  que l'encart les affiche. Tant qu'elles manquent, l'app tourne mais sans afficher ses sources —
  c'est le seul point qui touche l'invariant « contenu sourcé ». *(C10)*
  → *Tu peux me les donner en vrac (une ligne par module) quand tu veux, je les câble.*

---

## Plan alimentation-v2 (S1-S4) — validation du 2026-07-09

**Statut** : chantier consolidé · commits locaux prêts (S1/S2/S3/S4 + contexte) · en attente de validation visuelle Thibault + revalidation données médicales

### Valeurs à revalider (S1 — données médicales brutes)

Toutes les valeurs ci-dessous sont des ordres de grandeur qualitatifs (tables Ciqual/GI-GL, repères SFD), marquées `// à revalider (Thibault)` dans le code. Checklist :

| Aliment | sel | graisses | oméga-3 | atout | Remarques |
| --- | --- | --- | --- | --- | --- |
| Baguette blanche | élevé | — | non | « Le pain, une source de sel insoupçonnée du quotidien. » | Source majeure de sel du quotidien |
| Pain complet | modéré | — | non | — | |
| Pain pita | modéré | — | non | — | |
| Riz blanc | faible | — | non | — | |
| Riz basmati | faible | — | non | — | |
| Riz complet | faible | — | non | — | |
| Semoule / couscous | faible | — | non | — | |
| Pomme de terre / purée | modéré | — | non | — | Purée présumée salée/beurrée |
| Patate douce | faible | — | non | — | |
| Igname | faible | — | non | — | |
| Manioc / attiéké | faible | — | non | — | |
| Galette de riz soufflé | faible | — | non | — | |
| Lentilles | faible | — | non | « Légumineuse : un féculent qui monte doucement. » | Pépite pédagogique |
| Pois chiches | faible | — | non | « Légumineuse : un féculent qui monte doucement. » | Pépite pédagogique |
| Pomme | faible | — | non | — | |
| Banane mûre | faible | — | non | — | |
| Dattes | faible | — | non | — | |
| Pastèque | faible | — | non | « IG réputé haut, mais CG basse par portion — la pastèque, ça va. » | Piège inversé |
| Brocoli | faible | — | non | — | |
| Carotte | faible | — | non | — | |
| Yaourt nature | faible | — | non | — | Lipides 3 g non significatifs |
| Poulet | faible | mixte | non | — | À confirmer : graisses mixte vs saturées ? |
| Œuf | faible | saturées | non | — | Jaune saturé |
| Avocat | faible | insaturées | non | — | |
| Huile d'olive | — | insaturées | non | — | Matière grasse pure |
| **Sardine** | élevé | insaturées | **oui** | — | Conserve présumée ; grammes proteines/lipides/fibres à revalider |
| **Saumon** | faible | insaturées | **oui** | — | Frais présumé (hors fumé) ; grammes à revalider |
| **Noix** | — | insaturées | **oui** | — | Non salées ; CG ~0-2 ; grammes à revalider |

**Seuils des paliers dérivés (constants en code, `// à revalider`) :**
- Fibres : `<2` (faible) · `2–4` (bon/modéré) · `>4` (élevé)
- Protéines : `<5` (faible) · `5–15` (bon/modéré) · `>15` (élevé)

### Checklist visuelle (S3 — auto-vérification code, jamais navigateur)

À valider par Thibault (`npm run dev`) :

- [ ] **Consigne en haut de la scène** : repositionnée en `.captionRow` au-dessus du contenu de chaque défi, alignée à gauche (taille ≈18px), textes de `getCaption()` verbatim inchangés (inclus `d3Hint` et libellés `D1_CAPTIONS`).

- [ ] **Coche + CTA sur les onglets joués** : coche `✓` en `--color-confort-strong` après le libellé d'un onglet (défi ①②③④, jamais ★) après les critères de jeu (assiette remplie ①, révèle ②, réordonnance ③, défi ④, jamais ★). CTA « Défi suivant → » n'apparaît qu'après le défi actif joué, jamais sur ★.

- [ ] **Défi ① : courbe fantôme « Vos féculents seuls »** : quand ≥1 féculent ET ≥1 frein, `CourbeSection` reçoit une 2ᵉ courbe `variante: 'fantome'`.

- [ ] **Défi ② : 4 chips duels suggérés** (baguette/pain complet, riz blanc/basmati, riz blanc/lentilles, dattes/pastèque) au-dessus des cartes, chip active marquée `aria-pressed`, glisser-déposer libre inchangé.

- [ ] **Défi ② au révèle : verdicts visuels francs** : 
  - Badge pill coloré (--color-confort/vigilance/toxique, texte blanc ≥16px gras, hauteur ≥36px) : « Pic bas / Pic moyen / Pic haut »
  - Ligne pictogramme (`Check`/`X` lucide) : « ✓ Bonne prédiction » (confort-strong) ou « ✗ Vous aviez dit : {niveau} » (texte normal, jamais rouge)
  - Liseré d'identité (border-top 5px, duoA bleu nav / duoB prune) sur chaque carte
  - Courbes bleu nav / prune étiquetées par nom d'aliment + marqueur de pic
  - Tracé animé (dashoffset 1→0, ~900ms ease-out au montage, respecte prefers-reduced-motion)

- [ ] **Panneau InfoHover au survol ET au clic verrouillant** (garde-manger + cartes ②) : 
  - Noms des aliments soulignés pointillés discrets (affordance)
  - Survol/focus ouvre, quitter referme — sauf si verrouillé
  - Clic/Enter/Espace bascule le verrouillage ; Escape referme et déverrouille
  - Clic hors du panneau referme si verrouillé
  - Contenu `FoodDetail` : titre + portion (soft), ligne CG (pastille + libellé), lignes Fibres/Protéines/Graisses/Sel (paliers ●●○, pas de grammes), badge oméga-3 si présent, phrase-clé en italique, pied « vaisseaux »
  - Lisible à ~1 m (texte ≥14px)

- [ ] **Défis ③④★ inchangés** : seuls touchés par les mécanismes transverses (coche, CTA, caption repositionnée).

- [ ] **Fiche imprimable** : inchangée de S5.

---

## Thème diabète (9 modules, S1-S12) — validation visuelle

> À valider par Thibault (passe visuelle `npm run dev`).
> Les checklists détaillées par module sont consignées dans `plans/theme-diabete/S<k>.md` (sections « Validation », « Humain »).
> Cette section centralise l'état de validation visuelle.

### Module 1 — Mécanisme (C'est quoi le diabète ?)

**Statut** : [ ] à valider par Thibault

Checklist (S4) :
- [ ] Temps 1 : 5 cellules ouvertes (vert), clé posée, 2 jetons par cellule ; vaisseau avec 3 jetons dégressifs.
- [ ] Temps 2 : cellule 0 ouverte, 4 autres fermées ; pancréas atténué ; vaisseau chargé de jetons.
- [ ] Temps 3 : 5 cellules rouillées ; pancréas net ; **vaisseau strictement identique au temps 2**.
- [ ] Temps 4 : mix cellules fermées/rouillées/ouvertes ; pancréas atténué ; bouton « Continuer vers Alimentation ».
- [ ] Navigation correcte, 4 points de progression, aucun terme culpabilisant.

### Module 2 — Alimentation (4 défis + synthèse, fiche)

**Statut** : [ ] à valider par Thibault (revu en S14, 2026-07-09 — checklist détaillée par bug
dans `plans/theme-diabete/S14.md` §Checklist visuelle)

Checklist (S5, toujours vraie) :
- [ ] Ajouter protéines aplatit ET retarde visiblement le pic.
- [ ] Féculent en dernier ≠ juste « plus petit » : le pic se décale.
- [ ] Pastèque = pastille verte (CG) malgré l'idée reçue.
- [ ] Fiche imprimable lisible ; aucun chiffre imposé hors survol.
- [ ] Drag HTML5 natif + fallback clic fonctionnels sur toutes zones de dépôt.

Checklist S14 (courbe par composition réelle + correctifs B1/B2/B3) :

- [ ] Défi 1 : assiette **vide** au chargement (plus de cercle féculent central) ; on peut y
      déposer plusieurs féculents et des fruits/laitiers ; chaque dépôt modifie la courbe.
- [ ] Défi 3 : déplacer le féculent d'une bouchée à l'autre change la courbe de façon graduée
      (pas juste « dernier vs pas dernier ») ; glisser un aliment du garde-manger sur une bouchée
      la remplace ; la carte courbe ne déborde plus à 1366×768.
- [ ] Défi 4 : chaque échange « +1 protéine / −1 féculent » abaisse le pic (plus d'inversion).

### Module 3 — Activité physique (rayonnement, jauge, timing)

**Statut** : [ ] à valider par Thibault (B4 en S14, 2026-07-09)

Checklist (S6) :
- [ ] Temps ① : rayonnement (SVG nœuds/rayons) et clic « Sucre » passent au temps ②.
- [ ] Temps ② : jauge ouverte (12 activités, minutes, total) sans plafond ; point « bon pour muscles ».
- [ ] Temps ③ : Marche 15 min écrête le pic ; Marche 120 min intact, queue accélérée.
- [ ] Fenêtre d'activité visible sur l'axe ; 6 micro-coupures distinctes de la marche.
- [ ] Marqueurs `activite` lisibles sur l'axe de `CourbeGlycemie`.
- [ ] **S14/B4** : survol/focus du badge « i » des 4 rayons → panneau entièrement lisible, y
      compris ceux adjacents au cercle central (Sucre, Autonomie, Cœur, Tête) — plus masqué derrière.

### Module 4 — Risque cardiovasculaire (5 feux, artère, anatomie, fiche)

**Statut** : [ ] à valider par Thibault

Checklist (S7) :
- [ ] Rouge→Vert dégage l'artère aussi visiblement que Vert→Rouge l'encrasse.
- [ ] Jamais de note/score affiché ; aucune couleur seule (libellé + couleur systématique).
- [ ] Plaque de vue ② et celle posée silhouette = même motif.
- [ ] Fiche imprimable OK (état 5 feux + leviers cochés).
- [ ] Seuils affichés au survol (HbA1c, TA, LDL — à revalider Thibault).

### Module 5 — Complications (silhouette exploratoire, « évitable », fiche pied)

**Statut** : [ ] à valider par Thibault

Checklist (S8) :
- [ ] Yeux/reins/nerfs/pied cliquables (sélection unique) ; Cerveau/Cœur verrouillés (tooltip « Déjà vu »).
- [ ] Chaque menace immédiatement suivie du badge « Évitable » (jamais menace seule).
- [ ] Fiche pied imprimable : checklist 6 items, encadré « −2/3 amputations », bandeau « si plaie ».
- [ ] Animation d'entrée douce sur panneau.

### Module 6 — Suivi (cadran année + fiche calendrier)

**Statut** : [ ] à valider par Thibault (B5 en S14, 2026-07-09 — **inverse D9 n°2**, cf. `DECISIONS.md`)

Checklist (S9, mise à jour S14) :
- [ ] **Cadran vide au montage** (aiguille + mois seuls) — plus de pré-peuplement automatique ;
      chaque « Placer sur le cadran » ajoute l'élément un par un.
- [ ] **Aucun rouge** (fait=vert, à programmer=ambre+horloge, à venir=beige, bisannuel+=grisé+badge).
- [ ] Densité de repères = message (passer 3→6 mois retire visiblement des points).
- [ ] Fiche A4 imprimable : check-list triée par mois, ✓/⏳, ligne « Date : __/__/____ ».
- [ ] HbA1c se comporte comme examen « chaque consultation ».
- [ ] Fréquences en constantes `// à revalider (Thibault — ADA/HAS-SFD)`.
- [ ] **S14/B5** : à 1440 px de large, la rangée Consultations et chacun des 7 examens tiennent
      chacun sur une seule ligne (repli 2 lignes max sous ~1100 px), tous visibles sans scroll
      horizontal.

### Module 7 — Traitements (ordonnance ↔ silhouette)

**Statut** : [ ] à valider par Thibault

Checklist (S10) :
- [ ] Sélectionner Dapagliflozine → Cœur + Reins + Sucre s'allument ensemble (halo + badge « plusieurs fronts »).
- [ ] Sélectionner Metformine → seul Sucre s'allume.
- [ ] Aucune alerte, aucun rouge sur silhouette (corps pur).
- [ ] Champ molécule en Source Serif 4 italique (effet « manuscrit », pas Caveat).
- [ ] Pastille « Quoi surveiller » navigue bien vers Hypoglycémie/Insuline.
- [ ] Phrases cliniques 8 classes en constantes `// à revalider (Thibault)`.

### Module 8 — Hypoglycémie (15/15, récupération/overshoot, carte-réflexe)

**Statut** : [ ] à valider par Thibault (B6 en S14, 2026-07-09)

Checklist (S11) :
- [ ] Sans patience (toggle overshoot) : courbe fantôme dépasse clairement bande cible.
- [ ] Avec patience : courbe principale se pose dans bande sans dépasser.
- [ ] Carte-réflexe (temps ③, écran + fiche) lisible à ~1 m : gros caractères, boucle 15/15 signalétique.
- [ ] Rappel chocolat/gras visuellement distinct.
- [ ] Rien sur hypo sévère/entourage/glucagon nulle part.
- [ ] **S14/B6** : un seul temps (①②③) visible à la fois ; cliquer un onglet change bien l'écran
      (les trois temps ne restent plus empilés).

### Module 9 — Insuline (traces capteur, TIR vivant, 3 situations)

**Statut** : [ ] à valider par Thibault (B7 en S14, 2026-07-09)

Checklist (S12, mise à jour S14) :
- [ ] Carte ① : **3 chips** — « Plusieurs nuits qui montent » · « Ça descend la nuit, bas au
      réveil » · « Déjà haut après le repas, stable » (plus de chip « Une seule nuit isolée »).
- [ ] « Ça descend la nuit » : les nuits descendent visiblement vers le bas de la bande, flèche
      de tendance ↘, TIR dégradé côté « bas ».
- [ ] Changer profil (jeune↔âgé) change le TIR à situation constante.
- [ ] Aucun chiffre générique à l'écran (pas de mg/dL, pas de dose) — hoverLegend non activé.
- [ ] Refrain de sécurité toujours visible (quel que soit l'onglet).
- [ ] « Plonge bas » mène à hypo d'abord.
- [ ] Raccord nuit → jour sans saut brutal visible sur la courbe, quel que soit le scénario.

