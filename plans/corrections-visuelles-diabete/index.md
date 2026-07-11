# Chantier — Corrections visuelles diabète (revue Thibault 2026-07-11)

> **Mode** : solo · **Exécutant** : Sonnet · **Effort** : xhigh · **Créé** : 2026-07-11.
> **Origine** : revue visuelle de Thibault sur le déployé (`etp-interactif.vercel.app`, == `origin/main` == `HEAD` au moment de la revue : le feedback porte donc sur le code actuel, rien n'est déjà corrigé). 13 captures annotées.
> **Autorités** : ce fichier · `PROJECT_BRIEF.md` · `DECISIONS.md` · `docs/diabete/BRIEF_DESIGN_diabete.md` · `plans/illustrations-diabete/index.md` (état illustration-driven, ancres §7).
> **Règle de validation** : jamais de navigateur/Playwright côté Claude. Chaque session = `tsc --noEmit` + `npm run build` + `npm test` verts, + checklist **visuelle** consignée dans `VALIDATION.md` (validée par Thibault à l'écran, `npm run dev`). Cf. `[[feedback_validation_visuelle]]`.

## 1. Le diagnostic (13 remarques → 5 causes-racines)

Les 13 captures ne sont pas 13 bugs isolés : ce sont **5 problèmes de fond partagés**. On corrige à la racine (composants partagés + une passe transverse), pas capture par capture — c'est ce qui évite les corrections itératives.

| # | Capture (fichier Downloads) | Module / écran | Cause | Session |
| --- | --- | --- | --- | --- |
| 1 | « 3 situations pas 2 / info hors cadre » | Insuline ③ | C + libellé | S8 |
| 2 | silhouette petite, zone ne s'allume pas | Traitements | **A** | S1 |
| 3 | tableau examens illisible / hors page | Suivi « Parcours » | **C** | S4 |
| 4 | remplacer le cercle blanc par l'image | Activité ① Rayonnement | **E** | S5 |
| 5 | pas de comparaison vs féculent seul | Alimentation ④ Proportion | **B** | S2 |
| 6 | effet « ordre idéal » peu visible | Alimentation ③ Ordre | **B** (décision : *rendre visible*) | S2 |
| 7 | mauvaise répartition / dimensionnement | Alimentation ② Qualité | **C** | S3 |
| 8 | éléments petits, beaucoup de vide | Alimentation ① Composition | **C** | S3 |
| 9 | pas de pic malgré 3 féculents | Alimentation ① Composition | **B** | S2 |
| 10 | silhouette petite, boutons organe inutiles | Complications | **A** | S1 |
| 11 | animations trop rapides / état final trop court | Mécanisme | timing | S6 |
| 12 | silhouette trop petite | Risque cardio ③ Anatomie | **A** | S1 |
| 13 | forme de la plaque pas adaptée à l'artère | Risque cardio ② Artère | plaque | S7 |

**Causes-racines** :
- **A — Silhouette partagée trop petite + retour « allumé » invisible.** `SilhouetteCorps.module.css` plafonne à `max-width: 340px` et les modules la logent dans une colonne étroite (~110-130 px rendus). Le halo hotspot (mode `bodyImage`) est un `opacity` très doux → invisible. Boutons/chips organe redondants avec des zones déjà cliquables.
- **B — La courbe glycémie ne « raconte » pas.** Modèle qui sature vite la charge (3 féculents ≈ 1) ; pas de bande-cible en module 2 ; pas de courbe de comparaison dans les défis ①/④ ; effet d'ordre trop faible visuellement.
- **C — Mise en page : petit + vide + débordant.** Alimentation : scène large mais éléments petits, beaucoup de marge morte. Suivi : cadran + panneau côte à côte → largeur > écran, lignes en 10-12 px illisibles et clippées. Modules trop hauts → contenu sous la ligne de flottaison.
- **D — Trop de texte explicatif.** Intros, légendes bas-de-page, hints, fils rouges redondants avec la narration du soignant. **Décision Thibault : passe agressive** (on ne garde que titres d'onglets, eyebrows courts, affordances).
- **E — Activité : image écrasée dans un gros cercle blanc.** Le `.node` (~100 px, fond crème) contient une image de 44-56 px → le cercle domine l'image.

## 2. Décisions tranchées (Thibault, 2026-07-11)

1. **Défi ③ Ordre : on GARDE et on rend l'effet VISIBLE** (pas de suppression). Amplifier l'effet de l'ordre dans le modèle + comparaison fantôme franche. `// à revalider (Thibault)` conservé sur les constantes.
2. **Passe « moins de texte » : AGRESSIVE** sur les 9 modules. Le soignant narre.
3. Les autres orientations (agrandir silhouette, retirer boutons organe, refonte Suivi, image plein-nœud, ralentir Mécanisme, plaque en croissant) sont validées telles quelles.

## 3. Points laissés à revalidation visuelle par Thibault (non bloquants, après passe)

- Nouvelles amplitudes de courbe (désaturation `K_CHARGE` + bonus d'ordre) — cohérence pédagogique.
- Rendu « croissant » de la plaque sur `artere-saine.png` (angle/position).
- Intensité franche du halo « allumé » de la silhouette (ni trop discret, ni criard).
- Tout est consigné dans `VALIDATION.md`, section par session.

## 4. Sessions

| Session | Contenu | Résout | Dépend de | Statut |
| --- | --- | --- | --- | --- |
| **S1** | Silhouette partagée : agrandir + halo « allumé » franc + zones cliquables directes ; retrait des boutons organe (Complications, Risque cardio ③) | #2, #10, #12 | — | [x] |
| **S2** | Courbe : désaturer `K_CHARGE`, amplifier l'ordre, bande-cible module 2, **courbe fantôme systématique** (défis ①③④) ; recalibrer les seuils du défi ② | #5, #6, #9 | — (touche la lib + tests) | [x] |
| **S3** | Layout Alimentation : scène pleine largeur, assiette/camembert/vignettes agrandis, marges mortes réduites | #7, #8 | S2 (mêmes fichiers) | [x] |
| **S4** | Suivi : cadran au-dessus, panneau pleine largeur, lignes d'examen simplifiées ≥14 px, plus de débordement | #3 | — | [x] |
| **S5** | Activité rayonnement : l'image remplit le nœud, fin du cercle blanc | #4 | — | [x] |
| **S6** | Mécanisme : ralentir la boucle + long palier sur l'état final (ou « Rejouer ») | #11 | — | [x] |
| **S7** | Plaque : dépôt en croissant collé à la paroi (rétrécit la lumière) | #13 | — | [x] |
| **S8** | Passe « moins de texte » agressive + réduction de hauteur (9 modules) + libellé onglet Insuline ③ | #1, D | **toutes** (dernier) | [x] |

Ordre conseillé : **S1 → S2 → S3 → S4 → S5 → S6 → S7 → S8**. S1 et S2 débloquent le plus. S8 en dernier (touche tous les modules, après stabilisation structurelle). S5/S6/S7 sont indépendants et peuvent glisser.

Chaque session : gates verts + `VALIDATION.md` + `DECISIONS.md`/`STATUS.md`/`TASKS.md` + `/fin-de-tache`. Détail dans les `S<n>.md`.

## 5. Garde-fous (valables pour toutes les sessions)

- **Zéro persistance**, zéro dépendance runtime ajoutée, moteur `src/components/` thème-agnostique (ne jamais coder « diabète » en dur dedans).
- **Rétro-compat tabac** : `SilhouetteCorps` sans `bodyImage` = comportement actuel intact ; toute évolution du composant partagé doit préserver le rendu tabac (module `benefices-arret`).
- **Contenu clinique** : ne rien inventer. Les constantes de courbe et libellés cliniques restent `// à revalider (Thibault)`.
- **Pas de régénération d'images** : ce chantier est layout/logique/CSS uniquement. Les 75 PNG de `public/illustrations/diabete/` sont figés (si un slot manque, c'est un ajout de donnée → hors chantier).
- **Tests** : `glycemieCurve.test.ts` porte des invariants qualitatifs. En S2, on peut ajuster les seuils numériques d'un test **en conscience** (documenter dans le statut), jamais casser un invariant qualitatif (monotonie, ordre des scénarios, somme TIR = 100…).
- Validation visuelle = humaine (Thibault), consignée dans `VALIDATION.md`. Ne pas prétendre avoir vu le rendu.
