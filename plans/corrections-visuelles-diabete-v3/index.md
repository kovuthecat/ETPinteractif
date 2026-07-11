# Chantier — Corrections visuelles diabète, tour 3 (audit Chrome 2026-07-11)

> **Mode** : solo · **Exécutant** : Sonnet · **Effort** : xhigh · **Créé** : 2026-07-11 (par Opus).
> **Origine** : **3ᵉ** revue, cette fois un **audit visuel réalisé dans Chrome sur le déployé** (`etp-interactif.vercel.app`), fichier source `audit chrome.md` (horodaté 17:28). Il passe **par-dessus le tour 2** (`plans/corrections-visuelles-diabete-v2/`, commits `c1a6f27`…`579eae4`, ~14:30) **déjà déployé** (`HEAD = origin/main`). Donc l'audit reflète l'état **post-v2** : quand il pointe un défaut que v2 prétendait corriger, c'est que **le correctif v2 est visuellement inopérant** — chaque session ci-dessous documente *pourquoi* (le cas le plus net : le bug Bézier de la plaque d'artère, jamais identifié par v2).
> **Autorités** : ce fichier · `audit chrome.md` (revue brute) · `PROJECT_BRIEF.md` · `DECISIONS.md` · `docs/diabete/BRIEF_DESIGN_diabete.md` · `plans/corrections-visuelles-diabete-v2/index.md` (ce que v2 a fait).
> **Règle de validation** : **jamais** de navigateur/Playwright côté Claude. Chaque session = `tsc --noEmit` + `npm run build` + `npm test` verts + checklist **visuelle** consignée dans `VALIDATION.md` (validée par Thibault à l'écran, `npm run dev`). Cf. `[[feedback_validation_visuelle]]`.

## 1. Décisions de Thibault (2026-07-11, tranchées avant rédaction)

1. **Bloc « Continuer l'exploration » (`ModuleFooterNav`) → supprimé PARTOUT** (diabète **et** tabac). Le composant et ses données d'items sont retirés. → **S2**.
2. **Refonte complète du chrome, côté diabète** : barre d'onglets **sur la même ligne que le titre** (aujourd'hui empilée dessous) **et** zone de contenu **élargie** (aujourd'hui plafonnée à 980 px sur un viewport bien plus large, ~277 px de marge morte de chaque côté). À **isoler du tabac** : le `ModuleShell` est partagé et le moteur reste **thème-agnostique** (invariant 4) → on ajoute des **props optionnelles**, on ne code jamais « diabète » en dur. → **S1**.
3. **Nouveau module « Insuline rapide en pré-prandial »** : **inclus** dans ce chantier (conception + implémentation). C'est un module pédagogique neuf, à contenu clinique sourcé. → **S10**.

## 2. La cause-racine transverse (à corriger d'abord)

**Tout part de la largeur.** `ModuleShell` (`src/components/ModuleShell.module.css`) plafonne `.header` **et** `.content` à `max-width: 980px` avec `padding-inline: 40px` → **~900 px de contenu utile**, quel que soit l'écran. Presque tous les défauts de mise en page de l'audit en découlent :

- Alimentation : le contenu des défis vit dans `.stage`, qui ne fait que **~531 px** (900 − gap − garde-manger) → cartes Qualité/Ordre qui s'empilent, courbe écrasée à ~197 px de haut.
- Risque cardio ③ : silhouette 560 + gap + colonne texte 420 = 1020 > 900 → le texte de résultat **retombe sous** la silhouette.
- Traitements : ordonnance bornée à 460 px → libellés tronqués.
- Activité ② / Suivi ① : largeur volée par le partage en colonnes → grille qui déborde, double scroll.

**S1 élargit le chrome diabète (cible ~1240–1280 px) et déplace la barre d'onglets dans le header.** Cela **desserre** la contrainte partout, mais **ne suffit pas** : chaque module garde un correctif propre (géométrie, structure, logique). Les sessions module supposent le chrome S1 en place et **recalibrent à l'intérieur de la nouvelle largeur** — les valeurs de px données sont des **points de départ à caler à l'œil** (consigner dans `VALIDATION.md`).

## 3. Diagnostic (audit → sessions)

| # audit | Écran | Symptôme (post-v2) | Cause réelle | Session |
| --- | --- | --- | --- | --- |
| 1.1 | Tous | Bloc « Continuer l'exploration » indésirable | Composant `ModuleFooterNav` rendu par 9 diabète + 8 tabac | **S2** |
| 1.2 | Tous | Onglets sous le titre + marges mortes + scroll | `ModuleShell` fige 980 px & sépare titre/onglets | **S1** |
| 2 | Mécanisme | Module interactif trop petit | `.scene width:100%` plafonnée par les 900 px du shell | **S1** (profite de l'élargissement) |
| 3.1 | Cardio ① Leviers | 5 feux en 4/1 au lieu de 3/2 | `.feuxRow` sans `max-width` → 4 tiennent sur 900 px | **S3** |
| 3.2 | Cardio ② Artère | **La plaque ne réduit jamais la lumière** | **Bug Bézier** : `peakY` passé comme point de contrôle, apex réel = moitié → pénétration ÷2. v2 n'a corrigé que la symétrie | **S3** |
| 3.3 | Cardio ③ Anatomie | Pin visible seulement si feux cochés ; texte sous la silhouette | Garde `rougeCount>0` (état partagé) ; 560+420 > 900 → wrap | **S3** |
| 4.1 | Alimentation | Courbe (résultat clé) écrasée ; espace haut perdu | `CourbeSection` piégée dans `.stage` ~531 px ; assiette 400×400 centrée | **S4** |
| 4.2 | Alim. Qualité | 2 cartes empilées | `.d2Card` basis 340 → 2×340+gap > 531 (wrap sur la basis, pas la taille rétrécie) ; le `min-width:0` de v2 est inopérant | **S4** |
| 4.3 | Alim. Ordre | 3 cartes en 2 lignes (2+1) | `.d3Slot` basis 170 → 558 > 531 (manque 27 px) ; même erreur v2 | **S4** |
| 5 | Activité ② Volume | Grille déborde (~1240 px) | `.volumeSide` vole la largeur → grille à 3-4 col × 5 rangées ; v2 n'a **pas** dé-grillé (juste `align-items`) | **S5** |
| 6 | Suivi ① Parcours | Cadran à agrandir ; double scroll examens | Côte-à-côte plafonne le cadran à 420 px ; `.examList max-height:480 + overflow:auto` | **S6** |
| 7 | Traitements | Ordonnance tronquée ; pas de picto mécanisme | `grid-template` colonne 1 = `minmax(320,460)` ; `data.ts` sans axe clé/serrure | **S7** |
| 8 | Hypoglycémie | Preview n'affiche que le **dernier** signe | Preview câblé sur `lastSigneClicked` (string) au lieu de `mySignes` (liste déjà calculée) | **S8** |
| 9 | Insuline ② | « Temps dans la cible » sans intérêt | Bloc `.tirRow` à retirer proprement (JSX + CSS + import) | **S9** |
| 10 | — | Adapter l'insuline **rapide** pré-prandiale | Nouveau module pédagogique (décision Thibault) | **S10** |

## 4. Sessions

| Session | Contenu | Résout | Dépend de | Statut |
| --- | --- | --- | --- | --- |
| **S1** | **Fondation chrome diabète** : `ModuleShell` gagne 2 props agnostiques (`nav` slot dans le header + largeur élargie) ; câbler les 9 modules diabète (barre d'onglets → header, `wide`) ; resserrer les marges ; Mécanisme profite de l'élargissement | 1.2, 2 | — | [x] |
| **S2** | **Retrait de `ModuleFooterNav` partout** (9 diabète + 8 tabac) + suppression du composant, de son CSS et des données d'items | 1.1 | — | [x] |
| **S3** | **Risque cardio (3 onglets)** : feux 3/2 (`max-width` `.feuxRow`) ; **fix Bézier de la plaque** (lumière ~30 % au max) ; découpler le pin des feux ; texte résultat plus grand & à côté de la silhouette | 3.1, 3.2, 3.3 | S1 | [x] |
| **S4** | **Alimentation** : sortir la courbe de `.stage` (pleine largeur = résultat clé) ; Qualité côte à côte ; Ordre 3 sur une ligne ; remonter shelf/assiette | 4.1, 4.2, 4.3 | S1 | [x] |
| **S5** | **Activité ② Volume** : grille pleine largeur + total en bandeau + cartes compactes → tient sans scroll | 5 | S1 | [x] |
| **S6** | **Suivi ① Parcours** : agrandir le cadran + retirer `max-height`/`overflow` de la liste + remonter le breakpoint → plus de double scroll | 6 | S1 | [x] |
| **S7** | **Traitements** : élargir l'ordonnance (`grid-template`) ; picto clé/serrure dans le panneau d'effet (`data.ts` + lucide `Lock`/`KeyRound` + pastille verte) | 7 | S1 | [x] |
| **S8** | **Hypoglycémie** : afficher **toutes** les illustrations des signes sélectionnés (`mySignes`) + retrait de l'état mort `lastSigneClicked` | 8 | S1 | [x] |
| **S9** | **Insuline** : retrait propre de « Temps dans la cible » (`.tirRow`) | 9 | S1 | [x] |
| **S10** | **Nouveau module « Insuline rapide (pré-prandial) »** : conception pédagogique sourcée + implémentation + enregistrement au registre diabète | 10 | S1 | [x] implémenté 2026-07-11 sur instruction explicite de Thibault ; relecture finale du contenu par Thibault encore attendue (cf. `DECISIONS.md`) |

**Ordre conseillé** : **S1 en premier** (fondation largeur/chrome, débloque tout le reste). **S2** peut se faire n'importe quand (transverse, mécanique). **S3 → S9** indépendants entre eux (fichiers disjoints), à faire après S1. **S10** en dernier (nouveau module, contenu à sourcer).

Chaque session : gates verts + `VALIDATION.md` + `DECISIONS.md`/`STATUS.md`/`TASKS.md` + `/fin-de-tache`. Détail dans les `S<n>.md`.

## 5. Points laissés à revalidation visuelle par Thibault (non bloquants)

- **Largeur cible du chrome** (~1240–1280 px ? plein écran resserré ?) et comportement de la barre d'onglets quand elle ne tient plus sur la ligne du titre (repli sous le titre).
- **Amplitude de la plaque** au max (30 % de lumière = réaliste sans caricature).
- **Alimentation** : la courbe pleine largeur sous shelf/assiette conserve-t-elle la lecture « interaction → résultat » ?
- **Activité / Suivi** : « sans scroll » tenu à 1024×768 (le piège des tours précédents).
- **Traitements** : classement clé/serrure des classes (iDPP4/aGLP1/gliflozine) — **à valider cliniquement** (cf. S7).
- **S10** : périmètre pédagogique et sources du nouveau module (cf. S10, bloquant côté contenu).

## 6. Garde-fous (toutes sessions)

- **Zéro persistance**, **zéro dépendance runtime ajoutée** (lucide-react est déjà là). Moteur `src/components/` **thème-agnostique** : les nouvelles props de `ModuleShell` ne connaissent aucun thème par son nom.
- **Rétro-compat tabac** : après S1, un `ModuleShell` sans les nouvelles props doit rendre **exactement** comme avant (le tabac ne passe pas `nav`/`wide`). Après S2, vérifier que la navigation tabac reste possible via l'accueil/carte (le footer n'était qu'un raccourci optionnel).
- **Cibles ≥ 44 px** pour tout élément interactif touché ou créé (steppers, micro-cartes, icônes).
- **Contenu clinique** : ne rien inventer. Constantes de courbe/plaque et libellés cliniques restent `// à revalider (Thibault)`. **S10** ne s'écrit pas sans sources (HAS) — signaler plutôt qu'inventer.
- **Pas de régénération d'images** : layout/logique/CSS uniquement (S1–S9). Les PNG de `public/illustrations/diabete/` sont figés.
- **Ne pas toucher au `viewBox` partagé** `640×262` de `CourbeGlycemie` (consommé aussi par Activité/Hypo/Insuline) : agrandir par le conteneur, pas par le composant.
- **Tests** : ne casser aucun invariant de `glycemieCurve.test.ts`. Garder `tempsDansCible` (testée) même après retrait de son affichage (S9).
- **Validation visuelle = humaine** (Thibault), consignée dans `VALIDATION.md`. Ne jamais prétendre avoir vu le rendu.
</content>
</invoke>
