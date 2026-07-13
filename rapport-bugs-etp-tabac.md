# Rapport de bugs & améliorations — ETP interactif · module **Sevrage tabagique**

> **Origine** : audit navigateur (Claude in Chrome) sur https://etp-interactif.vercel.app/, reconstruit
> et **enrichi/corrigé** dans Claude Code le 2026-07-13 à partir du copier-coller intégral de la session
> (la conversation Chrome a planté au compactage avant de pouvoir télécharger ce rapport).
>
> **Ce que Claude Code a ajouté vs le rapport navigateur** :
> 1. Traduction des classes CSS hashées (`_kor9n_`, `_5l949_`, `_psxu9_`, `_1nkde_`, `_173na_`, `_s5dd4_`,
>    `_180jg_`, `_bp2v7_`, `_g2u2u_`, `_1o90u_`) en **chemins de fichiers source réels et vérifiés**.
> 2. **Correction de 2 recommandations erronées** du rapport navigateur (voir encadré ci-dessous).
>
> Stack : Vite + React + TS + CSS Modules, local-first, **zéro persistance** (invariant projet). `lucide-react`
> est déjà une dépendance runtime (utilisée dans les `registry.ts`) → les ajouts d'icônes ci-dessous
> n'introduisent aucune nouvelle dépendance.

---

## ⚠️ Deux corrections importantes au rapport navigateur (l'assistant Chrome n'avait pas accès au code ni aux contraintes projet)

**A. #T11 — NE PAS utiliser `localStorage`.** Le rapport navigateur recommandait de persister les sélections
dans `localStorage` (clé `etp:plan:tabac`). **C'est incompatible avec un invariant non négociable du projet**
([CLAUDE.md](CLAUDE.md), invariant 1) : « Zéro donnée patient stockée : aucune persistance (localStorage,
cookies, base, réseau). Interaction éphémère. » La bonne solution est un **état en mémoire** (React Context
placé au-dessus du switcher de modules dans `App.tsx`), qui survit à la navigation inter-modules mais se
réinitialise au rechargement de page — ce qui reste « éphémère » et conforme. Détail dans #T11.

**B. #T12 — Fausse alerte « illustrations manquantes ».** Le rapport navigateur concluait à des assets absents
(404). En réalité les 7 illustrations `benef-*.png` **existent** dans `public/illustrations/tabac/` **et sont
câblées** dans le code — mais elles ne s'affichent que dans la vue détail d'un organe (au clic), pas dans la
vue frise par défaut. Ce n'est donc pas un bug d'asset mais un problème de **mise en avant**. Détail dans #T12.

---

## Synthèse par priorité

| # | Titre | Priorité | Fichier(s) source |
|---|-------|----------|-------------------|
| **T11** | Aucune persistance des sélections entre modules → « Mon plan » repart de zéro | **Haute (archi)** | `src/App.tsx` + tous les modules à sélection |
| **T6** | « Titration du patch » affichée sur toutes les formes au lieu du seul Patch | **Haute (bug)** | `src/features/tabac/substituts/SubstitutsModule.tsx` |
| **T7** | Illustration vapoteuse démesurée / hors cadre | **Haute (bug layout)** | `src/features/tabac/substituts/SubstitutsModule.module.css` |
| T14 | Refonte « Mon plan d'arrêt » en livret + double mode d'impression | Structurant (produit) | `src/features/tabac/plan-arret/` + `src/components/FicheOverlay.tsx` |
| T16 | Module d'aide patient autonome (QR code) | Structurant (feature) | nouveau · `src/content/` partagé |
| T1 | Cercle « Comportementale » déborde + légende redondante | Moyenne (bug layout) | `src/features/tabac/addiction/AddictionModule.tsx` |
| T4 | Grille « Vrai ou faux ? » peu attractive + a11y | Moyenne (UI + a11y) | `src/features/tabac/idees-recues/IdeesRecuesModule.tsx` |
| T5 | Illustration trop petite sur cartes « Vrai ou faux ? » | Moyenne (1 prop) | `IdeesRecuesModule.tsx:89` (`size={96}`) |
| T8 | Checkbox « Dans ma fiche » trop grande → icône d'état | Moyenne (UI) | `src/features/tabac/boite-a-outils/` |
| T9 | Cartes « 4D » doivent recouvrir la courbe en transparence | Moyenne (UX/visuel) | `src/features/tabac/boite-a-outils/VagueCraving.tsx` |
| T10 | Illustrations trop petites sur grille « Stratégies & outils » | Moyenne (UI) | `src/features/tabac/boite-a-outils/BoiteAOutilsModule.tsx` |
| T15 | Ordre des sections : « Se motiver » en premier | Moyenne (UX) | `src/features/registry.ts` (ordre familles thème tabac) |
| T2 | Box de la courbe nicotine trop petite + esthétique datée | Basse (UI) | `src/features/tabac/nicotine/NicotineModule.tsx` |
| T3 | Marqueurs « R »/« A » → icônes Lucide *(rétroactif Diabète)* | Basse (UI) | `src/features/diabete/components/CourbeGlycemie.tsx:356` |
| T13 | Icônes Lucide dans l'en-tête des cartes-raisons | Basse (UI) | `src/features/tabac/motivation/MotivationModule.tsx` |
| T12 | ~~Illustrations d'organes manquantes~~ → **requalifié** (mise en avant) | À vérifier | `src/features/tabac/benefices-arret/BeneficesArretModule.tsx` |

---

## #T11 — [BUG ARCHI — priorité haute] Aucune persistance des sélections entre modules → « Mon plan d'arrêt » repart de zéro

**Écrans concernés** : tout le module Tabac, agrégé dans « Mon plan d'arrêt ».
**Comportement attendu** : « Mon plan d'arrêt » doit reprendre automatiquement ce qui a été sélectionné ailleurs
(situations cochées dans « Composantes de l'addiction », forme(s) de substitut, outils marqués « Dans ma fiche »
dans « Stratégies & outils », raisons de « Explorer ma motivation »…).
**Comportement constaté** : tout revient à 0 en quittant un module ; chaque section du plan réaffiche la liste
complète des options à re-sélectionner, sans pré-cochage. Cause : l'état vit uniquement dans le state React
**local** de chaque module, détruit au démontage du composant.

> **⚠️ Correctif à NE PAS suivre du rapport navigateur** : il proposait `localStorage` (clé `etp:plan:tabac`).
> **Interdit ici** — invariant projet « aucune persistance ». Voir l'encadré en tête de rapport.

**Correctif conforme au projet** :
- Introduire un **état global en mémoire** via un **React Context** (ex. `SelectionProvider` / `usePlan()`),
  monté dans `src/App.tsx` **au-dessus** du switcher de vues (`ModuleShell`). Comme la navigation se fait par
  état dans `App.tsx` (pas de router, pas de remontage global — cf. PROJECT_MAP), ce Context **survit au
  passage d'un module à l'autre** alors que le state local des modules, lui, est détruit.
- Forme suggérée de l'état : `{ situations: Set<string>, substituts: string[], outilsFiche: string[],
  raisons: string[], gestesEcart: string[], dateArret?: string }`.
- **Aucun `localStorage`/`sessionStorage`/cookie** : l'état se réinitialise au rechargement (F5), ce qui est
  exactement le comportement « éphémère » voulu. Prévoir une action explicite « Réinitialiser mon plan ».
- Câbler chaque module en écriture (les toggles/chips écrivent dans le Context au lieu d'un state local) et
  « Mon plan d'arrêt » en lecture (pré-cochage + édition qui met à jour le Context → cohérence bidirectionnelle).
- **Généricité** : le Context doit rester agnostique du thème (le moteur `src/components/` ne connaît aucun
  thème par son nom — invariant 4) ; prévoir une clé par thème dans l'état.

Sélecteurs utiles : situations `_situationChip_kor9n_109` ; formes `_formeCard_1nkde_36` ; cases « Dans ma
fiche » `label._tileCheck_173na_173 > input[type=checkbox]` (cf. #T8).

---

## #T6 — [BUG conditionnel — priorité haute] « Méthode de titration du patch » affichée sur toutes les formes

**Écran** : Agir → « Utilisation des substituts & titration du patch ». Sélecteur de forme : Patch (24h/16h),
Gomme, Pastille, Comprimé sublingual, Spray buccal, Vapoteuse.
**Fichier** : `src/features/tabac/substituts/SubstitutsModule.tsx` (rendu conditionnel) + `.module.css`
(`_sectionEyebrow_1nkde_13`, `_formeCard_1nkde_36`, actif `_formeCardActive_1nkde_62`).

**Attendu** : la section « Méthode de titration du patch » ne concerne que le Patch (l'intro dit « Pour la
titration du patch, on avance par quarts »). Elle devrait s'afficher **uniquement** quand la forme = Patch.
**Constaté** : elle s'affiche quelle que soit la forme (vérifié sur Vapoteuse : section présente, `display:block`).
Elle est rendue en permanence.

**Correctif** : conditionner le rendu de la section titration à `formeSélectionnée === 'patch'` (rendu
conditionnel React) ; pour les autres formes, ne pas monter ce bloc du tout.

---

## #T7 — [BUG layout — priorité haute] Illustration de la vapoteuse démesurée / hors cadre

**Écran** : même module, forme **Vapoteuse** → section « TECHNIQUE DE PRISE — VAPOTEUSE ».
**Fichier** : `src/features/tabac/substituts/SubstitutsModule.module.css` (`_techniqueImage_1nkde_204`,
conteneur `_techniqueCard_1nkde_173`).

**Problème** : l'illustration `substitut-vapoteuse.png` est rendue **868 × 868 px en dur** (`width:868px;
height:868px; max-width:none; object-fit:fill`), asset natif 900×900. Le conteneur fait 900 px `overflow:visible`
et l'image s'étend jusqu'à `right=1194px` alors que la colonne de contenu fait ~1120 px → **débordement**.

**Correctif** : remplacer les dimensions fixes par du responsive : `width:100%; max-width: 320–420px;
height:auto; object-fit:contain` (contain, pas `fill` qui déforme). Centrer + padding dans `_techniqueCard`.
**Vérifier chaque forme** : `_techniqueImage_1nkde_204` est probablement partagé par toutes les formes → le
correctif doit bénéficier à toutes (gomme, pastille, spray…), à contrôler après coup.

---

## #T14 — [Refonte produit MAJEURE] « Mon plan d'arrêt » → livret personnalisé + double mode d'impression

**Écran** : « Mon plan d'arrêt » (Agir) + système d'impression transversal.
**Fichiers** : `src/features/tabac/plan-arret/PlanArretModule.tsx` + `src/components/FicheOverlay.tsx`
(fiche générique A4 existante).
**Dépend de #T11** (l'état centralisé alimente le livret) — à traiter ensemble.

**Problème** : la fiche imprimable actuelle est un simple récapitulatif texte (listes à puces), **redondante et
moins riche** que les fiches individuelles des modules (pas d'illustrations, pas de reprise pédagogique).

**Vision cible** : concevoir « Mon plan d'arrêt » comme un **livret personnalisé d'accompagnement**, illustré et
mis en page, reprenant tout ce qui a été sélectionné. Deux modes d'impression :
1. **Fiche d'un module isolée** (comme aujourd'hui, via `FicheOverlay`).
2. **Livret complet** agrégeant tout le parcours, avec illustrations et structure soignée.

**Reco technique** :
- Abstraction commune : chaque module expose une « section imprimable » (titre, contenu, illustrations, items
  sélectionnés) ; le **livret** (`PrintableLivret`) les concatène, la **fiche isolée** en rend une seule.
- Deux points d'entrée : « Imprimer cette fiche » (par module) et « Imprimer mon livret complet » (depuis le plan).
- Feuille `@media print` dédiée : A4, sauts de page (`break-before/after`), en-têtes/pieds répétés,
  `print-color-adjust: exact` (cf. bug #4 du rapport Diabète, même piège d'impression).
- Structure du livret (ordre du parcours) : Couverture personnalisée (date d'arrêt) → Comprendre (rappels +
  situations cochées) → Mes substituts (forme + bonnes pratiques + illustration) → Situations & parades (outils
  sélectionnés, avec illustrations, cf. #T10) → Mes raisons (icônes #T13) → Si j'ai un écart → Mes bénéfices
  (organe par organe, illustrations `benef-*`, cf. #T12) → Contacts (39 89 / Tabac Info Service).
- N'inclure que ce qui a été sélectionné (livret réellement personnalisé). Le pied de page « rien n'est
  enregistré » reste vrai (état en mémoire only, cf. #T11).

---

## #T16 — [ÉVOLUTION / NOUVELLE FEATURE] Module d'aide patient autonome (accès par QR code)

**Portée** : Sevrage tabagique (transposable Diabète). Application **patient indépendante** de l'outil de
consultation, réutilisant le même contenu.
**Besoin** : un espace d'aide accessible seul par le patient (QR code sur les fiches imprimées), sans accès à
l'outil soignant complet.

**Périmètre v1** :
- « Comment utiliser mes substituts » — reprise du module Substituts (intégrer #T6 et #T7).
- « Comment agir face à une situation » — le patient choisit une situation → l'app propose les stratégies &
  outils adaptés (reprise du mapping situation → outils de « Stratégies & outils », avec illustrations #T10).

**Reco technique** :
- **Factoriser le contenu** (textes fiches substituts, situations, mapping situation→outils, fiches outils,
  illustrations) dans une couche partagée `src/content/`, source de vérité unique consommée par l'app
  consultation ET l'app patient (ne pas dupliquer).
- Espace patient sous une **route dédiée** (ex. `/aide`) avec layout/navigation propres, mobile-first, sans les
  entrées soignant. **Deep-linking** pour les QR : `/aide/substituts?forme=patch`, `/aide/situation/cafe-clope`…
- Génération des QR côté fiche imprimable (lib type `qrcode.react` — ⚠️ nouvelle dépendance runtime, à valider
  au regard de l'invariant 3 « aucune dépendance runtime ajoutée » ; sinon générer les QR hors-app).
- **Pas de données patient sur le serveur / dans l'URL** (donnée de santé, RGPD) → QR pointant vers du contenu
  générique par slug, pas vers les choix du patient.

**Cadrage tranché (Thibault, 2026-07-13)** : (1) **contenu générique** (jamais les choix du patient — aucune
donnée dans l'URL/serveur, RGPD) ; (2) **v1 = substituts + situations→outils** uniquement ; (3) **sous-domaine
séparé**, la route est **retirée de l'URL** de l'outil soignant (le patient n'accède jamais seul à la consultation).
Reste à trancher : dépendance runtime `qrcode` (sinon QR générés hors-app) — cf. invariant 3.

---

## #T1 — [Bug layout + nettoyage] Cercle « Comportementale » déborde + légende redondante

**Écran** : Comprendre → « Les composantes de l'addiction » (Venn 3 cercles + puces de situations + légende).
**Fichier** : `src/features/tabac/addiction/AddictionModule.tsx` (SVG inline) + `.module.css` (cercles
`_circleShape_kor9n_36`, puces `_situationChip_kor9n_109`, légende `_legend_kor9n_56` / `_legendItem_kor9n_65`).

**Problème 1 — débordement** : le cercle « Comportementale » (bas) chevauche la légende et des puces.
Géométrie (`viewBox 0 0 600 460`, cercles `r=130`) : Physique (cx210,cy160), Psychologique (cx390,cy160),
**Comportementale (cx300, cy300)** → bord bas `y=430`, à 30 px du bas (460). Correctifs : remonter `cy≈250–270`
et/ou réduire les rayons, **ou** viewBox `0 0 600 520` + padding bas ; vérifier le responsive.

**Problème 2 — légende redondante** : chaque cercle porte déjà son nom écrit dedans → **supprimer** le bloc
`_legend_kor9n_56` (résout aussi une partie du chevauchement).

---

## #T2 — [UI/esthétique] Agrandir et moderniser la box de la courbe nicotine

**Écran** : Comprendre → « La nicotine : cinétique & seuils » (frise 0→24 h, zones SURDOSAGE / CONFORT / MANQUE).
**Fichier** : `src/features/tabac/nicotine/NicotineModule.tsx` + `.module.css` (`_graphWrap_5l949_50`,
`_graphSvg_5l949_54`). Logique : `src/features/tabac/lib/nicotineCurve.ts`.

**Problème** : box trop plate (846×346, `viewBox 0 0 640 262`) ; bandes inégales (SURDOSAGE `h=36`, CONFORT
`h=140`, **MANQUE `h=24`** → ressemble à une barre) ; esthétique datée (aplats, pointillés basiques).
**Pistes** : agrandir la hauteur (ex. `viewBox 0 0 720 420`, box ~500px), rééquilibrer les 3 zones ; coins
arrondis, séparateurs fins, dégradés doux ; courbe plus épaisse `stroke-linecap/linejoin:round` + aire teintée ;
marqueurs à ombre douce + tooltip ; labels en pastilles. Couleurs oklch déjà en place (surdosage rouge, confort
vert, manque or).

---

## #T3 — [UI · rétroactif Diabète/Insuline] Marqueurs « R »/« A » → icônes Lucide

**Fichier (vérifié)** : `src/features/diabete/components/CourbeGlycemie.tsx` — un seul composant génère tous les
marqueurs de tous les onglets Insuline. La lettre vient de `meta.glyph` (table `MARQUEUR_META[m.type]` en tête
du fichier) :

```tsx
// CourbeGlycemie.tsx ~L349-361
<circle cx={x0} cy={badgeY} r={12} fill={`var(${meta.colorVar})`} className={styles.marqueurBadge} />
<text ... className={styles.marqueurGlyph}>{meta.glyph}</text>   {/* ← « R » / « A » à remplacer */}
<text ... className={styles.marqueurLabel}>{m.label}</text>       {/* ← « Repas » : conserver */}
```

**Reco** : ajouter un champ icône à `MARQUEUR_META` par `type`, remplacer le `<text>{meta.glyph}</text>` par le
path SVG d'une icône Lucide (~14-16 px, `stroke:#fff`). Mapping (confirmé Thibault) : **R (Repas) → `Utensils` ; A (injection d'insuline) → `Syringe`**.
`aria-label` sur le `<g>`.

---

## #T4 — [UI + a11y] Grille d'accueil « Vrai ou faux ? » peu attractive

**Écran** : Comprendre → « Vrai ou faux ? » (grille de 21 affirmations ; écrans détail/révélation réussis, à
garder comme référence).
**Fichiers** : `src/features/tabac/idees-recues/IdeesRecuesModule.tsx` (grille) + `.module.css` (`.grid`,
`.tile`, `.tileText`, `.progressText`) + `data.ts` (21 cartes).

**Problème** : 21 cartes texte quasi identiques, pas de hiérarchie/couleur/icône, aucun feedback vu/non-vu, rien
n'indique le clic. **⚠️ a11y** : `role="listitem"` posé sur un `<button>` est **incorrect** (un `listitem` doit
être enfant d'un `role="list"`, et ça masque le rôle bouton natif) → corriger (`<ul><li><button>` ou `role="list"`).

**Pistes** : icône/illustration en tête (voir #T5), regroupement par thème, marquage des cartes vues (coche/
opacité), barre de progression, hover clair, gap plus généreux, hauteurs homogènes, mode flashcards optionnel.

---

## #T5 — [UI · 1 prop] Illustration trop petite sur les cartes « Vrai ou faux ? »

**Fichier (vérifié)** : `src/features/tabac/idees-recues/IdeesRecuesModule.tsx:89` →
`<IllustrationSlot id={card.id} label={card.affirmation} size={96} />`.

**Mécanisme (vérifié)** : `IllustrationSlot` rend une vraie `<img src="/illustrations/tabac/<id>.png">` avec
`width/height = size` en style **inline** ([IllustrationSlot.tsx:39-47](src/features/tabac/components/IllustrationSlot.tsx#L39)).
Donc `size={96}` bride à **96×96 px** alors que l'asset natif fait 512×512, dans une carte `.card` de ~621 px.

**Correctif** : augmenter `size` pour l'écran détail (ex. `160`–`200`, ou responsive). La netteté ne se dégrade
pas (asset 512). Ne **pas** modifier la classe de base partagée (utilisée aussi par #T10 et par les signes hypo
diabète) — jouer sur la prop contextuelle.

---

## #T8 — [UI] Case « Dans ma fiche » trop grande → icône d'état discrète

**Écran** : Agir → « Stratégies & outils » (grille d'outils ; chaque carte a une case « Dans ma fiche »).
**Fichier** : `src/features/tabac/boite-a-outils/BoiteAOutilsModule.tsx` + `.module.css` (`_tileCheck_173na_173`).

**Problème** : la `<input type="checkbox">` (sans classe propre, `appearance:auto`) est rendue **44×44 px**
(probablement via `._tileCheck_173na_173 input { width:44px; height:44px }`), disproportionnée (14 occurrences).
**Reco** : remplacer par un **toggle compact stylé** — icône Lucide ~18-20 px `Circle/Plus` → `CheckCircle2`
(état « ajouté »), input natif masqué (`appearance:none`) mais conservé pour l'a11y (`aria-checked`, focus
clavier), cible tactile ≥ 32-40 px via padding invisible. Vérifier la réutilisation ailleurs (plan-arrêt…).

---

## #T9 — [UX/visuel] Les cartes « 4D » doivent recouvrir la courbe de l'envie en transparence

**Écran** : Agir → « Stratégies & outils » → outil « Laisser passer la vague — les 4D » (courbe de l'envie +
minuteur, puis 4 cartes D : Différer / Détourner / Se détendre-respirez / D'eau).
**Fichier** : `src/features/tabac/boite-a-outils/VagueCraving.tsx` (4D hérité de l'ex-module `craving`) +
`.module.css` (`_activeCard_s5dd4_69`, courbe `_svg_s5dd4_104`, cartes `_dCard_s5dd4_149`, rangée `_dRow_s5dd4_141`).

**Intention pédagogique** : les 4 D doivent **masquer partiellement** la courbe (visible en transparence
dessous) pour illustrer « ces techniques occupent le temps que l'envie passe ».
**État actuel** : courbe et 4 D empilées verticalement en flux normal, fonds blancs opaques, aucun `z-index`.
**Contraintes utilisateur** : courbe visible en transparence sous les D ; les 4 D restent lisibles ; la carte
« Se détendre — respirez » (animation de respiration cliquable, plus haute ~244px) doit être **au premier plan**
et utilisable.

**Reco** : `_activeCard` en `position:relative`, courbe SVG en couche de fond pleine zone, `_dRow` en
`position:absolute` par-dessus (ou grid empilé) ; cartes D en fond semi-transparent (`rgba(255,255,255,.72)` +
`backdrop-filter:blur(2px)`) — ajuster l'opacité jusqu'à lisibilité garantie sur la montée dorée (zone la plus
sombre) ; `z-index` de « Se détendre » le plus élevé, son cercle de respiration `pointer-events:auto` (vérifier
qu'aucune couche transparente ne l'intercepte) ; garder chaque `_dCard` cliquable.

---

## #T10 — [UI] Illustrations trop petites sur la grille « Stratégies & outils »

**Écran** : Agir → « Stratégies & outils » (grille de tuiles d'outils).
**Fichier** : `src/features/tabac/boite-a-outils/BoiteAOutilsModule.tsx` (tuiles `_tileBtn_173na_124`).
**Mécanisme** : même composant `IllustrationSlot` que #T5, ici appelé avec `size` ≈ **64** → 64×64 px (assets
natifs 512, `outil-*.png`). **Reco** : augmenter la taille contextuelle (tuiles ~88-112 px, détail 140-180 px)
via la prop, sans toucher la classe partagée. Grille équilibrée + responsive à vérifier.

> **Note transverse illustrations** : le même composant `IllustrationSlot` sous-dimensionne les images à
> plusieurs endroits (#T5 = 96 px, #T10 = 64 px, + signes hypo diabète). Envisager une **politique de tailles
> cohérente** (par contexte : grille / détail / carte), pilotée par la prop `size`, plutôt que des valeurs
> disparates. Le composant sait déjà gérer le fallback placeholder (asset 404) — pas de risque à agrandir.

---

## #T13 — [UI] Icône Lucide dans l'en-tête de chaque carte-raison

**Écran** : Se motiver → « Explorer ma motivation » → onglet « Mes raisons » (tableau de cartes-raisons + réserve).
**Fichier** : `src/features/tabac/motivation/MotivationModule.tsx` + `.module.css` (carte `_boardCard_180jg_245`,
sous-texte `_boardCardDetail_180jg_278`, réserve `_reserveCard_180jg_367`).

**Reco** : ajouter l'icône en **premier enfant** de chaque carte (tableau ET réserve), mapping raison → icône :
Ma santé → `HeartPulse` ; Goût/odorat → `Utensils` ; Mes proches → `Users` ; Le budget → `Wallet` ; Mon souffle
→ `Wind` ; Ma liberté → `Bird` ; raison perso → `Star`. Icône ~16-18 px, `aria-hidden`, colorisée selon la carte,
alignée au titre (flex+gap), sans écraser `_boardCardDetail`. Même logique extensible à « Mon plan → 5. Mes raisons ».

**Note connexe** : les cartes-exemples affichent des sous-textes provisoires (« exemple », « blablabla ») →
contenu placeholder à remplacer.

---

## #T15 — [UX/ordre] Placer « Se motiver » avant « Comprendre »

**Écran** : accueil du module Sevrage tabagique.
**Fichier** : l'ordre des familles (« Comprendre / Agir / Se motiver ») vient de la **définition du thème** dans
`src/features/registry.ts` (`ThemeDef`), pas du JSX (`Home.tsx` groupe par famille). Sections rendues :
`section._famille_bp2v7_32` / `h2._familleLabel_bp2v7_40` dans `div._container_bp2v7_1`.

**Ordre actuel** : Comprendre → Agir → Se motiver. **Ordre souhaité (confirmé)** : **Se motiver → Comprendre → Agir**.
**Correctif** : réordonner la liste des familles **du thème tabac uniquement** (data-driven), sans toucher le
thème Diabète (familles Comprendre / Agir / Se soigner, ordre différent).

---

## #T12 — [REQUALIFIÉ · à vérifier] Illustrations d'organes non mises en avant dans « Ce que l'arrêt répare »

**Écran** : Se motiver → « Ce que l'arrêt répare » (silhouette + pins d'organes + frise de 10 jalons).
**Fichier** : `src/features/tabac/benefices-arret/BeneficesArretModule.tsx` (+ `data.ts`, `SilhouetteCorps`).

> **Correction du rapport navigateur** : l'assistant Chrome concluait « assets absents (404) » car il **devinait**
> les noms (`repare-*.png`). En réalité les 7 illustrations existent bien : `public/illustrations/tabac/benef-cerveau|bouche|coeur|poumons|sang|peau|jambes.png`, **et elles sont câblées** via
> `IllustrationSlot id={`benef-${zoneDetail.id}`}` ([BeneficesArretModule.tsx:135](src/features/tabac/benefices-arret/BeneficesArretModule.tsx#L135)). Les id de zone correspondent aux fichiers (goût&odorat → `benef-bouche`, etc.).

**Vrai problème (confirmé par capture)** : les illustrations ne s'affichent **que dans la vue détail d'un organe**
(au clic d'un pin → branche `zoneDetail`, ligne 135). Dans la **vue frise par défaut** (branche `detailJalon`,
lignes 168-188), le panneau est en **texte seul** (échéance + bénéfice + chips de zones) et les **pins de la
silhouette sont des cercles vides** (`SilhouetteCorps` dessine des cercles d'état, pas d'images). D'où
l'impression « aucune illustration intégrée ». *(Seul `benef-horizon` apparaît, et uniquement au dernier jalon.)*

**Recommandations (au choix, décision produit)** :
1. **Surface principale** : dans la vue frise (`detailJalon`), afficher l'illustration `benef-<zone>` de la/les
   zone(s) concernée(s) par le jalon courant (`jalonCourant.zones`) — ex. à côté de chaque `zoneChip` (ligne 177)
   ou en visuel d'en-tête de la carte d'étape. C'est le geste qui répond directement à la demande.
2. Optionnel : illustrer les pins de la silhouette (mais des pins épurés peuvent être un choix de design de
   `SilhouetteCorps` — à ne pas casser à la légère).
3. Rendre les pins visuellement « cliquables » pour faire découvrir la vue détail (qui, elle, a déjà l'illustration).
4. **Vérifier** que chaque `zoneDetail.id` a bien son `benef-<id>.png` (sinon fallback placeholder crème
   silencieux) — surveiller en particulier goût/odorat ↔ `benef-bouche.png`.

---

## Assets / illustrations (note pour Claude Code)

Le dossier local `C:\Users\kovu\Downloads\illustration ETP` (154 fichiers) est le **pack source** des
illustrations (diabète ET tabac). La **majorité est déjà exportée** dans `public/illustrations/{diabete,tabac}/`
(vérifié : `benef-*`, `outil-*`, `substitut-*`, `vf-*`, `signe-*`, `resucrage-*`, `aliment-*`, `activite-*`…).
→ Contrairement au #T12 initial, il n'y a **pas** de gros lot d'assets « oubliés » à intégrer ; les problèmes
d'illustrations sont surtout des **tailles** (#T5, #T10) et de la **mise en avant** (#T12). Avant toute copie
depuis le dossier local, comparer avec l'existant dans `public/` pour éviter les doublons.

---

## Points « à vérifier / non audités »

- Modules **non audités** (RAS annoncé par l'utilisateur, mais non ouverts) : « Le piège du soulagement »,
  « La nicotine n'est pas le toxique ».
- ~~Signification exacte du marqueur « A » (#T3)~~ → **résolu** : « A » = injection d'insuline → `Syringe`.
- Contenu placeholder « exemple » / « blablabla » sur les cartes-raisons (#T13).
