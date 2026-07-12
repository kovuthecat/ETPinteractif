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

## Chantier boite-a-outils (BO1-BO9) — validation du 2026-07-10

**Statut** : chantier consolidé (commits BO1-BO8 + contexte) · en attente de validation visuelle
Thibault (`npm run dev`) — aucune vérification navigateur n'a été faite côté Claude, conformément à la
règle projet. Checklists reprises des sections « Validation visuelle » de chaque `S<k>.md`
(`plans/boite-a-outils/`).

### Module 1 — Composantes (refonte radiale, BO3)

- [ ] Chaque pilier déploie ses situations en éventail sur son secteur (7 items max pour physique/
      comportementale, 6 pour psychologique) sans recouvrir les deux autres cercles ni les zones de
      clic des cercles. Si chevauchement à l'écran : élargir le secteur d'arc et/ou le rayon du menu
      radial (clause « Si bloqué » de `S3.md`, non déclenchée par construction mais jamais vérifiée à
      l'écran).
- [ ] Sélection/désélection visible autrement que par la couleur (fond plein + icône `Check` + texte
      inversé).
- [ ] Sélection conservée en changeant de pilier (garanti par construction : un seul `Set` au niveau du
      module).
- [ ] « Stratégies et outils (n) » navigue vers `boite-a-outils` avec la sélection en contexte, la
      grille s'ouvre pré-filtrée.
- [ ] Retour arrière → sélection remise à zéro (comportement **accepté**, pas un bug : l'historique de
      navigation restaure la vue, pas le state interne du module).

### Module 6 — Stratégies & outils (BO1-BO2, ex-Craving)

- [ ] Arrivée sans contexte → les 14 outils s'affichent. Chip « Stress » seule active → visibles :
      `outil-bouger`, `outil-respiration` + les 4 transverses (`outil-vague-4d`, `outil-si-alors`,
      `outil-journal`, `outil-faux-pas`), soit 6 au total.
- [ ] Panneau de détail lisible à ~1 m : illustration, titre, badges situations (pastille pilier +
      libellé), mention de preuve qualitative (jamais de chiffre), bloc « Comment le proposer » en
      retrait, bouton renvoi si présent.
- [ ] « Lancer l'outil » (sur `outil-vague-4d`) ouvre la vague/4D : minuteur réel 180 s, 4 D,
      animation de respiration, fiche « Ma carte anti-envie » — mécanique strictement identique à
      l'ancien module Craving (aucune logique modifiée, seule la coquille a changé).
- [ ] Fiche « Ma boîte à outils » : grille 2 colonnes (1 colonne < 560px), lisible jusqu'à ~8-10 outils
      cochés (fallback consigne-seule au-delà du 8ᵉ implémenté) ; bouton désactivé à 0 outil coché.
- [ ] `ModuleFooterNav` en pied → Plan d'arrêt, Motivation.

### Module 3 — Substituts : vapoteuse (BO5)

- [ ] 6ᵉ forme « Vapoteuse » en dernière position avec badge « Réduction des risques » visible.
- [ ] Sélection → encart de statut sobre (bleu neutre `--color-nav`, pas rouge) + 4 bonnes pratiques +
      4 erreurs ; aucune mention mg/ml dans le contenu.
- [ ] `FORMES_PONCTUELLES` ignore la vapoteuse (absente de la titration du patch et du sélecteur
      « Ajouter une prise ponctuelle » de la fiche).
- [ ] Rangée de 6 formes reste lisible (wrap en 2 lignes si besoin, cibles ≥ 44 px conservées).

### Module 8 — Plan d'arrêt : section « Si j'ai un écart » (BO6)

- [ ] Section 7 visuellement cohérente avec les sections 2-5 (chips + saisie libre).
- [ ] Fiche A4 : bloc « Si j'ai un écart » présent si ≥ 1 geste coché, absent sinon ; la fiche reste
      sur une page avec les 7 sections pleines (aucun débordement constaté au build, à confirmer à
      l'écran).
- [ ] « Vapoteuse » sélectionnable en section 2 (substituts) et rendue sur la fiche imprimée.

### Module 10 — Vrai ou faux : 6 nouvelles cartes (BO4)

- [ ] Les 6 nouvelles cartes (`vf-poids-coeur`, `vf-fumer-mince`, `vf-poids-regime`, `vf-vape-aide`,
      `vf-double-usage`, `vf-vapeur-eau`) s'affichent et se retournent comme les 15 cartes existantes ;
      21 cartes au total, deck non cassé (pagination, compteur).
- [ ] Badge « …et c'est plus nuancé » présent sur `vf-vape-aide` (a un champ `nuance`).
- [ ] Renvois de `vf-faux-pas` et `vf-vague` mènent au module Stratégies & outils (libellé
      « Stratégies & outils »).

### Diabète — Module Activité : filtre « toniques uniquement » (BO8)

- [ ] Interrupteur `role="switch"` au-dessus de la réserve, libellé « Activités toniques uniquement »,
      double encodage position + texte « Toutes / Modérées+ ».
- [ ] Off → 12 activités dans la réserve ; on → seules les modérées (vélo, bricolage, jardinage,
      escaliers, danse, voiture).
- [ ] Une activité légère déjà cochée avant activation du filtre reste visible/comptée dans la jauge
      après activation (le filtre ne retire jamais un choix du patient).
- [ ] Retour à off → réserve complète à nouveau.

### Design (BO7)

- [ ] `design/illustrations/prompts-illustrations-diabete.html` : nouvelle section « Tabac — Stratégies
      & outils » (15 entrées : 14 outils + `substitut-vapoteuse`), même style `TQ` que les sections
      tabac existantes, compteurs/recherche du HTML non cassés.

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

## Illustrations diabète (S1) — validation du 2026-07-10

**Statut** : chantier S1 (pipeline d'assets + silhouette `bodyImage`/hotspot) livré · en attente de
validation visuelle Thibault (`npm run dev`) — aucune vérification navigateur faite côté Claude
(règle projet). Les 7 PNG ont été relus à l'œil par Claude (outil Read) : flood-fill propre (aucun
intérieur troué), palette quantifiée sans perte visible. **Aucun module n'est encore recâblé** (S2+
posera les overlays/panneaux) : ce qui suit ne concerne que la silhouette-image + hotspots.

- [ ] Silhouette (fond) affichée en carré dans la vue anatomie de M4, dans M5 et dans M7, sans
      déformation ni dépassement de cadre.
- [ ] Hotspots visuellement alignés sur les organes de l'illustration (cerveau/yeux/cou/cœur/reins/
      nerfs-main/jambes/pied — ancres `index.md` §7) ; si un hotspot semble décalé, le signaler (S2+
      recalibrera au besoin).
- [ ] Survol d'un hotspot déverrouillé → halo doux bleu-canard, disparaît en sortant ; état
      `ouvert`/`allume` → halo vert confort persistant même sans survol ; état `verrouille` → aucun
      halo, curseur « interdit ».
- [ ] Aucun cercle permanent ni icône superposée sur l'illustration en mode hotspot (contrairement au
      mode pastille tabac, qui doit rester identique à l'existant).
- [ ] **Tabac non régressé** : le module « Ce que l'arrêt répare » (`benefices-arret/`, silhouette
      générique sans `bodyImage`) affiche toujours le corps SVG codé + pastilles pleines avec icônes
      Lock/CheckCircle2/ShieldCheck, strictement comme avant S1.
- [ ] M4 (`RisqueCardioModule`, vue ③ « anatomie ») : les pastilles de plaque (encore codées à ce
      stade) restent visuellement proches des hotspots correspondants — un décalage franc est
      normal/attendu si le recalibrage fin n'est pas fait, mais aucune ne doit apparaître hors cadre.
- [ ] Poids des 7 PNG (`public/illustrations/diabete/`) raisonnable au chargement (26-99 Ko chacun).

### S2 — M5 Complications : illustration d'organe

- [ ] Cliquer yeux/reins/nerfs/pied affiche l'illustration de l'organe (104 px, cadre doux) à côté du
      titre, en tête du panneau détail — la bonne image pour le bon organe, rien de coupé/déformé.
- [ ] Pied : l'illustration en tête (`pied-auto-examen.png`) et celle plus bas dans le bloc « points de
      contrôle » sont la même image — pas de doublon choquant à l'écran.
- [ ] Cœur/cerveau (verrouillés) : toujours pas d'illustration, texte « déjà vu au module 4 » inchangé.
- [ ] Rien de coupé ni de débordant à ~1 m de lecture, tailles de police inchangées.

### S3 — M4 Risque cardiovasculaire : artère illustrée + plaque image + feux lucide

> ⚠️ Section la plus sensible de S3 : la position/rotation de la plaque overlay a été calculée hors
> navigateur (analyse de pixels), **jamais vérifiée à l'écran**. Un décalage est possible — signaler
> précisément ce qui ne colle pas (ex. « la plaque est trop haute », « pas assez tournée ») pour un
> ajustement ciblé des constantes `.artereOverlay` (CSS) et `PLAQUE_OVERLAYS` (module).

- [ ] Onglet **① Les leviers** : 5 icônes lucide (goutte sucre, jauge tension, gouttes cholestérol,
      cigarette tabac, fauteuil sédentarité) nettes dans leur cadre rond (74 px) ; cliquer un feu
      change bien son état (vert/orange/rouge) comme avant.
- [ ] Onglet **② L'artère** : l'illustration `artere-saine.png` s'affiche entière, non déformée ; une
      forme colorée (le dépôt) apparaît par-dessus dès qu'un feu passe au rouge, et **grossit**
      progressivement avec le nombre/l'intensité des feux rouges ; elle semble visuellement posée
      **dans** le passage du vaisseau (pas à côté, pas hors de l'image) ; le texte « Passage du sang :
      X % » en dessous varie de façon cohérente (100 % si tout est vert, qui diminue si des feux
      passent au rouge).
- [ ] Onglet **③ L'anatomie** : quand au moins un feu est rouge, une petite forme (plaque, ~26 px)
      apparaît sur le cou, le cœur et les jambes de la silhouette, à peu près à l'endroit de l'artère
      correspondante (pas flottante loin du corps, pas hors cadre) ; cliquer une zone ouvre bien le
      texte associé (AVC / infarctus / artérite) comme avant.
- [ ] Onglet **④ La fiche** : les 5 icônes lucide (plus petites, 56 px) s'affichent dans les cartes de
      la fiche à l'écran et sur la fiche imprimée (Ctrl+P) sans régression.
- [ ] Aucune régression : navigation entre les 4 onglets, textes de légende, bouton « Imprimer mes
      feux » inchangés.

### S4 — M1 Mécanisme : animation illustration-driven à 4 modes

> ⚠️ Positions/rotations des clés volantes calculées sur une boîte de référence 1060×340 (%),
> **jamais vérifiées à l'écran**. Signaler précisément ce qui ne colle pas (ex. « la clé rate la
> serrure », « le pancréas est trop loin ») pour un ajustement ciblé des constantes du module
> (`CELL_LEFT_PCT`, `KEY_TARGET_LEFT_PCT`, `KEY_TARGET_TOP_PCT`, `KEY_REST`).

- [ ] Les 4 boutons de mode (Sans diabète / Insulinopénie / Insulinorésistance / Mixte) changent
      bien la scène ; le mode actif est visuellement distinct (bordure/fond bleu-canard).
- [ ] La scène rejoue en boucle (~5 s) : au démarrage d'un mode, les cellules sont fermées, puis
      une ou plusieurs clés partent du pancréas vers une ou plusieurs serrures (visibles, animées),
      puis les cellules concernées changent d'image (ouverte/fermée/rouillée selon le mode), puis
      le nombre de jetons de sucre dans l'artère change et le libellé (bas/encore élevé/élevé)
      suit la bonne couleur.
- [ ] **Sans diabète** : 3 cellules ouvertes, 3 clés visibles, peu de jetons (sang bas, vert).
- [ ] **Insulinopénie** : 1 cellule ouverte + 2 fermées, 1 seule clé visible, jetons nombreux (sang
      encore élevé, ambre).
- [ ] **Insulinorésistance** : 3 cellules rouillées, **aucune clé volante** (la clé est déjà
      dessinée plantée dans l'image de la cellule rouillée), beaucoup de jetons (sang élevé, rouge).
- [ ] **Mixte** : 1 rouillée + 1 ouverte + 1 fermée, 1 seule clé volante (vers la cellule ouverte),
      jetons nombreux (sang élevé, rouge).
- [ ] Réduire les animations (préférence système « mouvement réduit ») : la scène affiche
      directement l'état final du mode choisi (cellules dans leur état, clé(s) visible(s) et
      « tournée(s) » dans la serrure si le mode en prévoit, jetons au nombre final) — **plus de
      cycle qui recommence toutes les ~5 s**, un seul état stable et lisible.
- [ ] Rien ne déborde du cadre à ~1 m de lecture, y compris sur petit écran (scène responsive).
- [ ] Bouton « Voir comment l'alimentation joue » en pied de module navigue bien vers le module
      Alimentation.

### S5 — M7 Traitements : silhouette-image (aucun changement de code, à confirmer visuellement)

- [ ] La silhouette de M7 s'affiche en image carrée (pas de régression suite à S1).
- [ ] Cliquer « Voir l'effet » sur une ligne allume cœur et/ou reins (halo doux, jamais de rouge)
      selon la classe de la molécule ; les autres organes ne s'affichent jamais sur ce module.
- [ ] Bouton « Ordonnance » (tout allumer) allume toutes les zones protégées par les lignes
      renseignées en même temps.
- [ ] Le halo « sucre » systémique (overlay doux autour de la silhouette) reste positif et discret.

### S6 — M6 Suivi : stations/organes → lucide

- [ ] Les icônes du cadran (consultation, prise de sang, chaque examen) sont nettes à 34-44 px —
      pas de flou ni de placeholder texte.
- [ ] Cohérence visuelle : toutes les icônes lucide partagent le même cadre (rond, fond clair,
      bordure fine, icône bleu-canard) ; l'icône rein (image) ne détonne pas trop dans l'ensemble.
- [ ] Icônes attendues : stéthoscope (consultation), tube à essai (prise de sang groupée HbA1c/
      bilan lipidique/rein), goutte (vaisseaux/HbA1c), cœur (bilan lipidique), œil (fond d'œil),
      pied (pied complet), sourire (dentiste), seringue (vaccins/défenses) — et le **rein en image**
      dans la liste des examens et le panneau « Ce que ça garde ».
- [ ] Le centre du cadran (motif fil rouge) et l'aiguille restent inchangés (toujours codés).
- [ ] Cliquer un examen dans le panneau « Ce que ça garde » : la porte s'ouvre avec la bonne icône/
      image à 160 px (silhouette pour cœur/reins/yeux/pied, icône ou image pour vaisseaux/bouche/
      défenses).

### S7 — Vignettes M2/M3/M8 (62 nouvelles, chantier illustrations-diabete clos)

- [ ] **M2 Garde-manger** : les 33 aliments affichent leur vignette (plus aucun placeholder texte)
      — en particulier les 5 nouveaux (pâtes blanches, pâtes complètes, couscous complet, banane
      plantain, haricots rouges) apparaissent dans la liste/le garde-manger avec la bonne image.
- [ ] **M3 Activité** : centre + 4 rayons illustrés (temps ①) ; les 13 activités (dont « Se relever
      du sol ») affichent leur vignette dans la jauge ouverte (temps ②).
- [ ] **M8 Hypoglycémie** : les 7 signes (temps ①, clic sur un signe) et les 4 resucrages affichent
      leur vignette, plus aucun placeholder.
- [ ] Rien de coupé/déformé à ~1 m de lecture ; poids de page raisonnable au chargement des
      garde-mangers/grilles (62 nouveaux PNG, 22-140 Ko chacun).
- [ ] **Défi ② Alimentation (comparaison)** : ajouter un des 5 nouveaux aliments à une comparaison
      ne casse rien (pic calculé, badge de verdict cohérent) — pas de recalibrage de seuils attendu.

#### Valeurs à revalider (S7 — 5 nouveaux aliments, ordres de grandeur qualitatifs)

| Aliment | cg | fibres | protéines | lipides | portion | Remarques |
| --- | --- | --- | --- | --- | --- | --- |
| Pâtes blanches | 18 | 2 | 5,5 | 1 | 150 g cuites | GI supposé plus bas que le riz blanc |
| Pâtes complètes | 12 | 4 | 6 | 1,5 | 150 g cuites | — |
| Couscous complet | 14 | 4 | 5,5 | 1 | 150 g cuit | Écho riz complet/pain complet |
| Banane plantain | 20 | 3 | 1,5 | 0,3 | 150 g cuite | Classée féculent (cuisinée), pas fruit |
| Haricots rouges | 7 | 7 | 9 | 0,5 | 150 g cuits | Légumineuse, même pépite pédagogique que lentilles/pois chiches |

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

## Corrections visuelles diabète (revue Thibault, 2026-07-11) · plan: → plans/corrections-visuelles-diabete/

> 13 captures annotées par Thibault sur le déployé. Détail par session dans
> `plans/corrections-visuelles-diabete/S<n>.md`. Statut global dans `index.md` du plan.

### S1 — Silhouette partagée agrandie + halo « allumé » + retrait boutons organe

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Silhouette nettement plus grande (élément dominant) dans Traitements, Complications, Risque
      cardio ③ — plus une vignette latérale.
- [ ] Zone active/ouverte/allumée : halo large + anneau net + léger `scale`, clairement visible
      (Traitements cœur/reins, Complications organe ouvert, Risque cardio territoire).
- [ ] Découvrabilité discrète au repos (fin anneau pointillé) sans « cercle plein ».
- [ ] Plus aucun bouton/chip organe redondant (Complications, Risque cardio ③) — sélection
      uniquement sur la silhouette.
- [ ] Complications : cliquer cœur/cerveau sur la silhouette ouvre bien le panneau « déjà vu —
      module 4 » (zones grisées mais cliquables, plus de chips).
- [ ] `prefers-reduced-motion` : pas de `scale` animé.
- [ ] **Tabac `benefices-arret` strictement inchangé** (corps SVG codé + pastilles pleines, aucune
      régression) — régression à vérifier explicitement.

### S2 — Courbe glycémie : pic lisible, bande-cible, comparaison fantôme, ordre visible

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Module 2 : une bande-cible (zone verte) apparaît derrière toutes les courbes (défis
      ①-④, synthèse, fiche imprimable) — cohérente avec celle du module 9 (Insuline).
- [ ] Un repas à base d'un seul féculent « rouge » (ex. riz blanc seul) culmine visiblement
      haut ; 3 féculents cumulés culminent encore plus haut, proche du plafond.
- [ ] Défi ① Composition : dès qu'il y a au moins un féculent dans l'assiette, une courbe
      fantôme « Vos féculents seuls » apparaît (sauf si l'assiette ne contient QUE des
      féculents — dans ce cas les deux courbes seraient identiques, fantôme masqué).
- [ ] Défi ④ Proportion : une courbe fantôme « Vos féculents seuls » apparaît dès qu'il y a
      au moins un féculent dans les réglages (masquée à 0 féculent).
- [ ] Défi ③ Ordre : l'écart entre la courbe actuelle et la courbe de référence est net et
      visible (pas juste perceptible) ; les libellés disent explicitement « Féculent en
      premier / au milieu / en dernier ».
- [ ] Défi ② Qualité : les 4 duels suggérés donnent des verdicts cohérents — baguette (haut)
      vs pain complet (moyen), riz blanc (haut) vs basmati (moyen), riz blanc (haut) vs
      lentilles (bas), dattes (haut) vs pastèque (bas).
- [ ] Rien ne casse visuellement avec la bande-cible superposée aux courbes fantômes/duo déjà
      colorées (lisibilité des 3 zones toxique/confort/vigilance).

⚠️ Point sensible (cf. `S2.md` §Écart) : les constantes de courbe ont été recalibrées par
ré-échantillonnage hors navigateur (script jetable), pas vérifiées à l'écran par Claude —
amplitudes et seuils du défi ② sont `// à revalider (Thibault)`.

### S3 — Layout Alimentation : scène pleine largeur, éléments agrandis

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Sur les 4 défis + synthèse, les éléments (assiette, camembert, cartes, vignettes)
      occupent l'espace disponible — plus de sensation « petit et vide ».
- [ ] Défi ② Qualité : les 2 cartes se répartissent sur la largeur de la scène (pas tassées
      au centre).
- [ ] Défi ③ Ordre : les 3 bouchées s'étalent sur la largeur, pas serrées.
- [ ] Garde-manger : vignettes plus grandes, `shelfGrid` toujours propre (scroll interne si
      besoin).
- [ ] Responsive < 900 px : garde-manger + scène s'empilent toujours proprement, rien ne
      déborde horizontalement.

### S4 — Suivi : cadran au-dessus, panneau pleine largeur, lignes lisibles

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Le cadran est toujours au-dessus, le panneau de réglage toujours pleine largeur en
      dessous — plus de côte-à-côte, rien n'est coupé à droite.
- [ ] Chaque ligne (consultations + 7 examens) tient sur une seule ligne à 1440 px, repli 2
      lignes max en dessous de 1100 px.
- [ ] Un seul contrôle de fréquence par ligne (stepper ‹ valeur ›, plus plusieurs chips côte
      à côte).
- [ ] Toutes les polices du paramétrage sont lisibles à distance (≥14 px).
- [ ] Cliquer l'icône d'un examen ouvre le panneau « Ce que ça garde » (nouvel emplacement
      du déclencheur, plus de bouton texte dédié).
- [ ] « Placer sur le cadran » reste accessible sur chaque ligne, le cadran se construit
      correctement au clic.
- [ ] Responsive mobile : rien ne déborde horizontalement.

### S5 — Activité ① Rayonnement : l'image remplit le nœud

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Les 5 nœuds (centre + Sucre/Cœur & vaisseaux/Tête/Autonomie) montrent l'illustration
      en grand — plus de grand aplat crème vide autour d'une petite image.
- [ ] Le label reste lisible sous chaque nœud (pas coupé, pas chevauchant les nœuds voisins).
- [ ] Cliquer le centre ou un rayon allume bien l'anneau (état franc), l'image reste visible
      sous l'anneau allumé.
- [ ] Les traits SVG du rayonnement pointent toujours exactement vers le centre des nœuds
      (pas de décalage visuel après agrandissement).

### S6 — Mécanisme : animation ralentie + état final tenu (option B)

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] La séquence se lit calmement (plus la sensation de « ça va trop vite »).
- [ ] L'état final (serrures + jetons de sucre + légende) reste affiché **indéfiniment** —
      plus de relance automatique qui coupe la lecture.
- [ ] Changer de mode relance proprement la séquence depuis le début.
- [ ] Cliquer « Rejouer » (sous la légende) relance la même séquence sans changer de mode.
- [ ] `prefers-reduced-motion` : pas de bouton « Rejouer », état final affiché directement.

### S7 — Plaque d'athérome : dépôt en croissant collé à la paroi

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

> ⚠️ Point le plus sensible de cette session : la géométrie du croissant a été calibrée par
> le calcul (formule), jamais vérifiée à l'écran par Claude (règle projet). Signaler
> précisément si le dépôt déborde de la lumière visible de `artere-saine.png` ou semble
> décalé — un ajustement de `.artereOverlay` (`RisqueCardioModule.module.css`) suffira.

- [ ] Onglet ② L'artère : le dépôt ressemble à un épaississement de paroi qui empiète sur la
      lumière (pas un disque flottant au milieu du vaisseau comme avant).
- [ ] Le dépôt grossit de façon cohérente à mesure que les feux passent au rouge (score
      cumulé) ; à encrassement élevé, un 2ᵉ dépôt apparaît sur la paroi opposée.
- [ ] Le texte « Passage du sang : X % » reste cohérent avec le rétrécissement visuel au
      centre du dépôt.
- [ ] Le dépôt reste dans les limites de la lumière de l'illustration, ne déborde pas sur la
      paroi peinte ni hors cadre.
- [ ] Onglet ③ L'anatomie (pastilles `plaque.png` par territoire) : inchangé, aucune
      régression.

### S8 — Passe « moins de texte » agressive (9 modules) + libellé Insuline ③

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Chaque module (Insuline, Alimentation, Activité, Risque cardio, Complications, Suivi,
      Traitements, Mécanisme, Hypoglycémie) est visiblement allégé — plus de paragraphe
      d'intro, plus de bande de légende explicative en bas d'écran répétant l'eyebrow.
- [ ] **Insuline** : onglet ③ dit « Décider » (plus « 2 situations ») ; les 2 cartes
      situations sont visibles sans scroller loin ; le refrain de sécurité reste visible.
- [ ] Aucune sortie interactive n'a disparu : `sideText` (Traitements), la décision affichée
      (Insuline ③), les verdicts/`achieved` (Alimentation), le détail au clic d'un rayon
      (Activité), le message d'artère (Risque cardio, raccourci mais présent), menace/
      évitable/geste (Complications), la carte-réflexe (Hypoglycémie).
- [ ] Les eyebrows/labels de boutons restent clairs même sans le paragraphe qui les
      accompagnait — le soignant peut narrer sans redondance avec l'écran.
- [ ] Aucun module ne reste nettement plus verbeux que les 8 autres (registre homogène).

**Chantier `corrections-visuelles-diabete` (S1-S8) clos ce jour** — voir
`plans/corrections-visuelles-diabete/` pour le détail complet. Points ouverts non bloquants :
alignement de la plaque d'athérome (S7, jamais vérifié à l'écran), amplitudes de la courbe
glycémie (S2, à revalider), intensité du halo « allumé » de la silhouette (S1, à calibrer).

## Corrections visuelles diabète, tour 2 (revue Thibault, 2026-07-11) · plan: → plans/corrections-visuelles-diabete-v2/

> 2ᵉ revue visuelle, par-dessus le tour 1 (S1-S8 ci-dessus, déjà committé) : le tour 1 a atterri
> mais reste insuffisant sur les tailles (« encore trop petite »), + nouveaux points (feux
> cardio, Suivi side-by-side, dégraissage Insuline). Détail par session dans
> `plans/corrections-visuelles-diabete-v2/S<n>.md`. Statut global dans `index.md` du plan.

### S1-v2 — Silhouettes vraiment dominantes + plaque localisée + texte Traitements retiré

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Traitements, Complications, Risque cardio ③ : la silhouette **domine** l'écran (élément
      principal, pas une vignette) — nettement plus grande qu'au tour 1 (hosts 420/400/400px
      → 560px, `.wrapImage` 460→640px).
- [ ] L'organe « allumé »/actif est franchement visible (halo + surface suffisants à la
      nouvelle taille).
- [ ] Traitements : plus de bloc de texte narratif dans le panneau latéral quand rien n'est
      sélectionné (le panneau entier disparaît, eyebrow compris).
- [ ] Risque cardio ③ Anatomie : le dépôt de plaque (`plaque.png`) n'apparaît **que** sur le
      territoire cliqué (cou/cœur/jambes) — plus sur les 3 en même temps dès qu'un feu est rouge.
- [ ] Pas de recouvrement à grande largeur (≥1800px) ni sur mobile.
- [ ] **Tabac `benefices-arret` strictement inchangé**.

### S2-v2 — Feux cardio : icône-bouton + artère à 70% au max

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Onglet ① Leviers : chaque icône de feu est elle-même le bouton cliquable, colorée selon
      l'état (vert/orange/rouge) — plus de bouton texte « Vert/Orange/Rouge » séparé en dessous.
- [ ] Bordure de l'icône plus épaisse à mesure que l'état s'aggrave (2/3/4px) — repère non
      chromatique en plus de la couleur.
- [ ] Survol/focus d'un feu : la fourchette de valeurs s'affiche toujours (2ᵉ niveau).
- [ ] Lecteur d'écran : chaque icône-feu annonce « {nom} : {état} » (ex. « Tension : orange »)
      distinctement — plus 5 cibles nommées « Vert » indistinctement.
- [ ] Onglet ② Artère : au niveau max (tous les feux au rouge), la lumière est nettement plus
      obstruée qu'avant (~30% visible, contre ~39% avant recalibration).
- [ ] Les 4 vues (Leviers/Artère/Anatomie/Fiche) restent cohérentes (même état des 5 feux partagé).

### S3-v2 — Suivi : side-by-side sans déborder + icône « placer »

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Cadran et panneau d'examens sont **côte à côte** (≥860px) — le tour 1 les avait empilés
      pour tuer un débordement ; placer un examen doit se voir en direct sur le cadran visible.
- [ ] **Critère bloquant** : aucun débordement horizontal à 1024×768 (le piège exact du tour 1).
- [ ] Lignes de consultation/examen lisibles (≥14px), pas de texte tronqué.
- [ ] « Placer sur le cadran »/« Retirer du cadran » : icône Lucide (MapPin/MapPinOff) au lieu
      d'un bouton texte, cible ≥44px, `aria-label` complet au survol/lecteur d'écran.
- [ ] Statut d'examen (fait/à programmer/à venir) : pastille compacte à côté du nom, toujours
      lisible malgré la disparition de la colonne texte.
- [ ] En dessous de 860px : repli propre en empilé (cadran au-dessus).

### S4-v2 — Insuline : profil en toggle, onglet lecture dégraissé, décider sans titre

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Le choix de profil (jeune/actif vs âgé/fragile) n'est plus un onglet plein écran : toggle
      compact visible en permanence au-dessus de la courbe, sur les 2 onglets restants.
- [ ] Onglet ① Lire la courbe : plus de narration (« Cliquez un segment… ») ni de titre bavard ;
      titre du graphique raccourci à « Courbe du capteur ».
- [ ] La barre « Temps dans la cible » n'apparaît plus que dans l'onglet ② Décider.
- [ ] Onglet ② Décider : les 3 situations (nuits qui montent / descend la nuit / haut stable
      après repas) sont présentées à plat, sans titre de section qui n'en décrivait qu'une.
- [ ] Changer de profil modifie toujours la bande-cible affichée sur la courbe.
- [ ] Le refrain de sécurité (« Dans le doute, on ne monte pas… ») reste visible en permanence.

### S5-v2 — Activité : rayonnement agrandi, volume dé-grillé, micro-coupures ≥44px

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Onglet ① Rayonnement : le schéma en étoile remplit nettement plus l'espace qu'au tour 1
      (`.rayonWrap` 480→640px, icônes agrandies en proportion) — sans recouvrement des labels.
- [ ] Onglet ② Volume : plus de débordement horizontal de la grille d'activités.
- [ ] Onglet ② Volume : moins « effet tableur » — les activités d'intensité modérée ont une
      carte légèrement plus généreuse (rythme visuel), sans devenir décoratif ou chargé.
- [ ] Onglet ③ Timing : les boutons de micro-coupures sont passés de 30×30 à 44×44px,
      espacement suffisant pour ne pas cliquer la mauvaise coupure.
- [ ] Le filtre « Activités toniques uniquement » et le total du jour restent fonctionnels.

### S6-v2 — Alimentation : débordements Qualité/Ordre corrigés + courbe agrandie

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

> ⚠️ Point le plus incertain de cette session : le mécanisme exact du débordement (#14/#15)
> n'a pas pu être confirmé par analyse statique seule (pas de navigateur côté Claude). Le
> correctif est une passe défensive (largeurs fixes redondantes retirées, plancher/plafond de
> la courbe) — **à vérifier en priorité**, cf. `S6.md` §Écart.

- [ ] **Critère bloquant** : aucun débordement horizontal dans les onglets Qualité et Ordre, à
      1024×768 **et** 1440×900.
- [ ] Onglets ③ Ordre et ④ Proportion : LA COURBE est nettement plus grande, la différence de
      pic entre les deux traces est lisible sans plisser les yeux.
- [ ] Défi ③ : si le nouveau plancher de largeur de la courbe (440px) force le garde-manger à
      passer sous la courbe plutôt qu'à côté sur un écran contraint, vérifier que ce repli reste
      acceptable visuellement.
- [ ] Aucune régression de la courbe dans les modules 3 (Activité, onglet Timing), 8
      (Hypoglycémie), 9 (Insuline) — tous en layout pleine largeur, ne devraient pas changer.

**Chantier `corrections-visuelles-diabete-v2` (S1-S6) clos ce jour** — voir
`plans/corrections-visuelles-diabete-v2/` pour le détail complet. Points ouverts non bloquants :
mécanisme exact du débordement Alimentation ②/③ non confirmé visuellement (S6), alignement de
l'artère au score max (S2), tailles cibles exactes des silhouettes/courbe/rayonnement laissées
« à caler à l'œil » par décision Thibault (§3 de l'index).


## Chantier `corrections-visuelles-diabete-v3` (audit Chrome déployé, 2026-07-11)

### S1-v3 — Fondation chrome diabète (onglets dans le header + contenu élargi)

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Diabète : contenu nettement plus large (~1240px), marges mortes très réduites par rapport
      à avant (qui plafonnait à 980px sur tout écran).
- [ ] Diabète, 6 modules (risque-cardio, alimentation, suivi, hypoglycémie, insuline, activité) :
      la barre d'onglets est sur la même ligne que le titre, pas empilée dessous ; repli propre
      sous le titre si la fenêtre est trop étroite pour tenir les deux sur une ligne.
- [ ] État actif de l'onglet toujours visible/cohérent après le déplacement dans le header.
- [ ] **Critère bloquant — Tabac : rendu strictement inchangé au pixel** (comparer 1-2 modules
      tabac avant/après, ex. Nicotine et Substituts) : c'est le garde-fou clé de cette session,
      le mécanisme `ModuleShell` étant partagé entre les deux thèmes.
- [ ] Mécanisme (« C'est quoi le diabète ? ») : la scène (pancréas/cellules/clés) est
      visiblement plus grande grâce à l'élargissement, sans décalage de position ni scroll
      horizontal.
- [ ] Aucun module diabète ne déborde horizontalement à 1024×768.
- [ ] Largeur cible ~1240px et comportement de repli de la barre d'onglets : provisoires,
      à caler à l'œil (cf. index v3 §5) — remonter tout réglage souhaité.

### S2-v3 — Retrait de `ModuleFooterNav` partout

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Plus aucun bloc « Continuer l'exploration » en bas d'écran, sur les 9 modules diabète
      (mecanisme, alimentation, activite, risque-cardio, complications, suivi, traitements,
      hypoglycemie, insuline) et les 8 modules tabac (benefices-arret, boite-a-outils,
      idees-recues, motivation, nicotine, nicotine-toxique, soulagement, substituts).
- [ ] La navigation d'un module à l'autre reste possible via l'accueil/carte de chaque thème.
- [ ] Aucun espace vide résiduel disgracieux en bas des modules où le bloc a disparu.

### S3-v3 — Risque cardio : feux 3/2, plaque qui obstrue vraiment, anatomie découplée

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Feux (vue ① Les leviers) : 3 cartes sur la première ligne, 2 sur la seconde, centrées.
- [ ] **Critère clé** : artère (vue ② L'artère) au score maximal (tous les feux au rouge) — la
      lumière est nettement réduite, la plaque en croissant empiète vraiment sur le passage du
      sang (à comparer à l'ancien rendu où les croissants restaient timides, collés aux parois).
      Progression douce et continue de 0 au score max.
- [ ] Anatomie (vue ③) : cliquer une zone du corps **sans avoir touché aucun feu** (tous au
      vert) affiche bien un pin — avant, il fallait au moins un feu rouge.
- [ ] Anatomie : le texte de résultat est nettement plus grand et lisible ; à côté de la
      silhouette sur un écran large, repasse en dessous sur un écran étroit.
- [ ] Rien ne déborde à 1024×768.
- [ ] À caler/revalider (Thibault) : amplitude finale de la plaque au score max (30 % de
      lumière = réaliste sans caricature ?) ; calage de l'overlay de la plaque sur l'image
      `artere-saine.png` maintenant que le dépôt est visuellement plus profond qu'avant.

### S4-v3 — Alimentation : courbe pleine largeur, Qualité côte à côte, Ordre sur une ligne

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] **Résultat clé** : LA COURBE est pleine largeur sous shelf/assiette, nettement plus haute
      qu'avant, visible sans scroll.
- [ ] La lecture « interaction → résultat » reste-t-elle claire malgré le changement d'ordre
      (interaction au-dessus, courbe dessous, au lieu de côte à côte) ?
- [ ] Qualité (défi ②) : les 2 cartes sont côte à côte (plus empilées).
- [ ] Ordre (défi ③) : les 3 cartes sont sur une seule ligne (plus 2+1).
- [ ] Défi ① : remplir l'assiette jusqu'à 10 aliments — vérifier qu'aucun chip ne déborde du
      cercle malgré sa réduction de taille (point identifié comme sensible par le plan).
- [ ] Espace en haut d'écran resserré (défis ① Composition et ④ Proportion).
- [ ] Garde-manger toujours lisible ; rien ne déborde à 1024×768.

### S5-v3 — Activité ② Volume : grille sans scroll

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] **Critère bloquant** : les 13 cartes d'activité + le bandeau total tiennent sans scroll
      (ni H ni V) à 1024×768.
- [ ] Bandeau total : gros nombre + jauge lisibles côte à côte ; en dessous de ~600px de large,
      repasse proprement en colonne sans chevauchement.
- [ ] Steppers : cible tactile confortable malgré le cercle visuel réduit à 24px ; « 180 min »
      non tronqué.
- [ ] Le filtre « Activités toniques uniquement » et le total du jour restent fonctionnels.

### S6-v3 — Suivi ① Parcours : cadran agrandi, plus de double scroll

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Cadran nettement plus grand (480→560px) ; icônes de station proportionnées.
- [ ] **Critère bloquant** : aucun scroll (H ni V) sur la liste d'examens à 1024×768 ; tous les
      examens visibles/atteignables.
- [ ] Lignes d'examen lisibles, tiennent sur une seule ligne dès que la largeur le permet.
- [ ] À ≥1200px : cadran et panneau d'examens côte à côte, rien ne se chevauche.
- [ ] Empilement conservé jusqu'à 1200px (au lieu de 860px) — vérifier que ça reste cohérent
      visuellement sur les tailles d'écran intermédiaires (900-1199px).

### S7-v3 — Traitements : ordonnance élargie + picto clé/serrure

**Statut** : [ ] à valider par Thibault — dont un point clinique (voir ci-dessous)

- [ ] Chaque traitement sur une ligne sans troncature ; pas de débordement horizontal à
      1024×768.
- [ ] « Voir l'effet » sur Metformine → cellule verrouillée (Lock) + cercle vert.
- [ ] « Voir l'effet » sur un sécrétagogue (sulfamide, iDPP4, aGLP1) ou l'insuline → clé
      (KeyRound) + cercle vert.
- [ ] Gliflozine / IEC-ARA2 / Statine → pas d'icône (hors métaphore clé/serrure, volontaire).
- [ ] Cohérence visuelle avec la métaphore clé/serrure du module Mécanisme.
- [ ] **À valider cliniquement** (bloquant contenu) : le classement iDPP4/aGLP1 en « sécrétion »
      (`picto: 'cle'`, effet incrétine) — cf. `data.ts`, marqué `// à revalider`.

### S8-v3 — Hypoglycémie : preview affiche tous les signes sélectionnés

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Sélectionner 4 signes → 4 vignettes affichées.
- [ ] Désélectionner un signe → sa vignette disparaît.
- [ ] Aucun signe sélectionné → pas de panneau preview.
- [ ] Jusqu'à 7 signes (tous sélectionnés) : rendu correct, retour à la ligne propre.
- [ ] Les `signe-*.png` sont encore des placeholders : plusieurs vignettes crème avec libellé
      est le comportement attendu (pas une erreur).
- [ ] Lisibilité du libellé réduit à 14px (déviation par rapport au 20px d'origine, cf. S8.md).

### S9-v3 — Insuline : retrait de « Temps dans la cible »

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] Plus de barre « Temps dans la cible » dans l'onglet ② Décider.
- [ ] L'onglet ② reste cohérent (courbe + 2 cartes de situations) sans ce bloc.
- [ ] Onglets ①/③ intacts, aucune régression sur la courbe ou le toggle de profil.

### S10-v3 — Nouveau module « Insuline rapide (pré-prandial) »

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11, implémenté sur instruction
explicite de Thibault — **avant** que la relecture finale du contenu source n'ait été
formellement actée, cf. `DECISIONS.md` § 2026-07-11 « S10 »)

- [ ] **Contenu** — relire `docs/diabete/10-insuline-rapide.md` (périmètre DT2 basal-bolus,
      déroulé 4 temps, sources OpenEvidence §5) et confirmer/corriger ; le fichier porte encore
      la mention « en attente de relecture finale » en tête.
- [ ] Le module apparaît sur la carte diabète (famille « Se soigner », juste après « Insuline :
      adapter les doses »), s'ouvre, est interactif, sobre, **sans aucun chiffre à l'écran**
      (ni dose, ni minutes, ni mg/dL).
- [ ] **① Couvrir le repas** : sélectionner « peu / repas moyen / beaucoup » de glucides → la
      courbe « avec rapide » reste nettement plus basse que « sans rapide », l'écart croît avec
      la quantité de glucides.
- [ ] **② Le bon moment** : déplacer le curseur d'injection de « bien avant » à « après le
      repas » → la courbe « avec rapide » couvre mieux le pic quand l'injection est avant le
      repas, moins bien en retard ; le curseur n'affiche aucun chiffre (ticks qualitatifs
      uniquement).
- [ ] **③ Corriger avant le repas** : les 3 états (basse/cible/haute) déplacent visiblement
      toute la courbe ; l'état « basse » affiche le message de prudence et le bouton « Traiter
      l'hypo d'abord » qui ouvre le module Hypoglycémie.
- [ ] **④ Le piège du cumul** : le bouton « Et si j'en remets trop tôt ? » ajoute une 2ᵉ courbe
      qui plonge nettement sous la bande-cible ; un bouton apparaît alors vers le module
      Hypoglycémie.
- [ ] Chrome `wide` + barre d'onglets dans le header (comme les autres modules à onglets) ;
      lisible à ~1 m ; cibles ≥ 44 px ; pas de scroll horizontal à 1024×768.
- [ ] Distinct du module 9 (insuline basale) : pas de confusion de contenu ni de doublon visuel.
- [ ] Refrain de sécurité visible en pied de module (« La bonne dose, c'est celle de votre
      protocole… ») — libellé à confirmer.

### Insuline basale (module 9) — message d'accompagnement (2026-07-11, hors chantier v3)

**Statut** : [ ] à valider par Thibault (code livré 2026-07-11)

- [ ] En pied du module Insuline (« adapter les doses »), sous le refrain de sécurité « Dans le
      doute, on ne monte pas — on traite l'hypo d'abord. », une note plus discrète apparaît :
      « Régler la lente, c'est un travail d'équipe avec votre soignant — pas une décision à
      prendre seul. »
- [ ] La note est visuellement secondaire (plus petite, gris doux) — le refrain de sécurité
      reste le message dominant.
- [ ] Présent sur les deux onglets (① Lire la courbe, ② Décider), comme le refrain.

---

## Audit diabète itération 2 (revue Thibault, 2026-07-12) · source: `Audit/audit-etp-interactif-iteration2.md`

> Corrections livrées 2026-07-12 (Opus, une passe). Gate : `tsc --noEmit` ✓ · `npm run build` ✓ ·
> `npm test` ✓ (95/95, dont 3 nouveaux invariants de scénarios). **Sans navigateur côté Claude** —
> tout ci-dessous est à confirmer à l'écran (`npm run dev`). Constantes cliniques (facteurs de dose,
> amplitudes des nouveaux scénarios) marquées `// à revalider (Thibault)`.

### Module 9 « Insuline : adapter les doses » — onglet ② Décider (points 1/2/3/4)

- [ ] **Point 2** — plus aucune phrase narrative sous le chip de situation : on ne voit que le nom
      de la situation (chip) + les 3 boutons Baisser/Laisser pareil/Monter + le message *après* clic.
      (Les 3 desc « Le taux grimpe pendant la nuit… », « La trace glisse vers le bas… », « Le taux est
      déjà haut… » ont disparu.)
- [ ] **Point 1** — situation « Plusieurs nuits qui montent » + **Baisser la lente** : la courbe
      **monte encore plus haut** (pas de descente/hypo) et le message parle d'aggravation vers le haut
      (« fait grimper encore plus haut la nuit »), plus jamais « on frôle l'hypo ».
- [ ] **Point 3** — situation « Ça descend la nuit, bas au réveil » + **Monter la lente** : la courbe
      **plonge plus bas** (hypo aggravée) et le message parle d'hypo creusée, plus jamais « ça continue
      de monter ».
- [ ] Les 4 bonnes/mauvaises réponses restantes restent cohérentes : Monter (situation 1) et Baisser
      (situation 2) aplatissent la dérive (message « revient dans la cible ») ; « Laisser pareil »
      prolonge la dérive de départ dans les deux cas.
- [ ] **Point 4** — situation « Déjà haut après le repas, stable » : les 3 boutons changent enfin
      **la courbe ET le message** (avant : figés). Baisser → la nuit repart à la hausse ; Laisser
      pareil → plate et haute ; Monter → glisse vers le bas (risque d'hypo). Les 3 messages disent
      tous « la lente n'est pas le problème, c'est le repas / le rapide du soir ».
- [ ] La flèche de tendance (↗/→/↘) près de la courbe reste cohérente avec le sens de chaque courbe.

### Module 10 « Insuline rapide (avant le repas) » — sélecteur de dose (points 5/6)

- [ ] **Point 5 — ① Couvrir le repas** : sous les 3 chips de repas, une **2ᵉ rangée** « Moins de
      dose / Dose habituelle / Plus de dose ». Les 9 combinaisons (3 repas × 3 doses) changent la
      courbe « avec rapide » : *habituelle* = pic couvert (comme avant), *moins* = pic mal couvert
      (sucre reste haut), *plus* = passe sous la cible (hypo). L'écart est plus marqué pour
      « Beaucoup de glucides » que pour « Peu ». Message sous le graphe cohérent avec la dose.
- [ ] **Point 6 — ③ Corriger avant le repas** : même 2ᵉ rangée de dose (l'ancien bouton unique
      « Ajouter une correction de rapide » a disparu). Les 3 glycémies de départ (Basse/Cible/Haute)
      déplacent toujours visiblement la courbe (bug « courbes identiques » du 1er rapport toujours
      corrigé), croisées avec les 3 doses = 9 combinaisons. Sur **Haute**, c'est « Plus de dose » qui
      ramène vers la cible ; sur **Cible**, « Plus » fait passer sous la cible ; sur **Basse**, le
      message de prudence + le bouton « Traiter l'hypo d'abord » (→ module Hypoglycémie) restent.
- [ ] Les chips de dose sont bien des radios (un seul actif), cibles ≥ 44 px, lisibles à ~1 m,
      **aucun chiffre** (ni dose, ni %) affiché — libellés qualitatifs uniquement.
- [ ] Onglets ② Le bon moment et ④ Le piège du cumul **inchangés** (hors périmètre de cet audit).
- [ ] Pas de scroll horizontal à 1024×768 / 1366×768 avec la rangée de dose ajoutée (2 rangées de
      chips empilées).

## Illustrations tabac (chantier illustrations-tabac) — validation du 2026-07-12

**Statut** : 42 PNG déposés + code câblé · en attente de validation visuelle Thibault (`npm run dev`)
— aucune vérification navigateur faite côté Claude (règle projet). Échantillon relu à l'œil par
Claude (outil Read, 4 images de familles différentes) : flood-fill propre, aucun artefact, aucune
perte de détail. Mapping fichier→id fait par correspondance de titre/affirmation (détail complet et
cas arbitrés dans `DECISIONS.md` 2026-07-12) — **jamais vérifié à l'écran par Claude**, c'est le
point principal à valider ici : la bonne image doit apparaître au bon endroit.

- [ ] **Ce que l'arrêt répare** (silhouette, 7 zones) : cliquer cerveau/bouche/cœur/poumons/sang/
      peau/jambes affiche chacun sa vignette (96 px, cadre arrondi) en tête du panneau détail ; le
      dernier jalon (« L'horizon retrouvé ») reste en placeholder (aucune image dédiée) — normal, pas
      un bug.
- [ ] **Stratégies & outils** (14 outils) : chacun des 14 outils affiche sa vignette (panneau détail,
      96 px, et carte réduite, 64 px) ; plus aucun placeholder texte sur la grille complète.
- [ ] **Vrai ou faux ?** (21 cartes) : 15 cartes affichent leur vignette (96 px) ; les 6 restantes
      (poids-cœur, fumer-mince, poids-régime, vape-aide, double-usage, vapeur-eau) affichent le
      placeholder crème habituel — attendu, pas une erreur de chargement.
  - Vérifier en particulier `vf-poids` (« Poids et arrêt ») : un seul visuel « poids » existait dans
    le lot ; affecté à cette carte (la plus centrale) plutôt qu'à `vf-poids-coeur`/`vf-fumer-mince`/
    `vf-poids-regime` — à confirmer que c'est le bon choix ou à réaffecter (aucun changement de code,
    juste renommer le fichier PNG si Thibault préfère une autre carte).
- [ ] **Substituts — technique de prise** : sélectionner gomme/pastille/sublingual/spray/vapoteuse
      affiche une scène illustrée large (pas de placeholder « illustration · technique de prise »)
      sous le titre « Technique de prise » ; le patch n'affiche jamais de technique (comportement
      inchangé, la titration remplace ce bloc pour cette forme) — l'image `substitut-patch.png`
      existe mais n'est actuellement jamais montrée par l'UI (non bloquant, cf. `DECISIONS.md`).
      Fiche imprimable (bloc « Ma prise ponctuelle », gomme/pastille/sublingual/spray) : même
      vignette qu'à l'écran.
- [ ] Rien de coupé/déformé/étiré à ~1 m de lecture, y compris les scènes larges substituts
      (aspect ratio d'origine préservé, pas de recadrage carré forcé).
- [ ] Poids de page raisonnable au chargement (42 PNG, 3,2 Mo au total, chargés à la demande par
      panneau — jamais tous en même temps).
