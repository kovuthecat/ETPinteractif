# Chantier — Corrections visuelles diabète, tour 2 (revue Thibault 2026-07-11)

> **Mode** : solo · **Exécutant** : Sonnet · **Effort** : xhigh · **Créé** : 2026-07-11.
> **Origine** : 2ᵉ revue visuelle de Thibault sur le déployé (`etp-interactif.vercel.app`), **par-dessus le chantier `corrections-visuelles-diabete` (S1–S8) déjà committé sur `main`** (commits `8935b3d`…`5831282`). Les annotations disent explicitement « **encore** trop petite », « **toujours** trop petite », « **beaucoup mieux mais**… » → le tour 1 a atterri mais reste **insuffisant** sur les tailles, et de nouveaux points apparaissent (feux cardio, Suivi side-by-side, dégraissage Insuline). Source : 14 captures annotées (`Downloads/`) + audit Playwright de Codex (`AUDIT-DIABETE.md`).
> **Autorités** : ce fichier · `PROJECT_BRIEF.md` · `DECISIONS.md` · `docs/diabete/BRIEF_DESIGN_diabete.md` · `plans/corrections-visuelles-diabete/index.md` (tour 1, ce qui a déjà été fait).
> **Règle de validation** : jamais de navigateur/Playwright côté Claude. Chaque session = `tsc --noEmit` + `npm run build` + `npm test` verts + checklist **visuelle** consignée dans `VALIDATION.md` (validée par Thibault à l'écran, `npm run dev`). Cf. `[[feedback_validation_visuelle]]`.

## 1. Ce que le tour 1 a déjà fait (à ne pas refaire, à pousser plus loin)

| Tour 1 | Résultat livré | Verdict tour 2 |
| --- | --- | --- |
| S1 silhouettes | 420 / 400 / 400 px, halo « allumé », boutons organe retirés | **Insuffisant** : encore trop petites vs écran → S1-v2 |
| S4 Suivi | passé **empilé** (cadran au-dessus, panneau pleine largeur) pour tuer le débordement | **À reprendre** : Thibault veut **side-by-side** (voir les examens qu'on place), sans re-déborder → S3-v2 |
| S7 plaque | dépôt en croissant collé à la paroi | **Beaucoup mieux**, mais au niveau max la plaque reste trop timide → S2-v2 |
| S8 passe texte | allègement 9 modules | **Résidus** : bloc narratif Traitements + textes Insuline survivent → S1-v2 / S4-v2 |

## 2. Le diagnostic (14 captures + audit → 6 causes-racines)

Comme au tour 1 : on corrige **à la racine** (composants/règles partagés), pas capture par capture.

| # | Remarque (capture / audit) | Module / écran | Cause | Session |
| --- | --- | --- | --- | --- |
| 1 | « silhouette toujours trop petite, effet invisible » | Traitements | **A** | S1 |
| 2 | « supprimer le texte, le soignant narre » | Traitements (bloc « ce que ce traitement protège ») | **D** | S1 |
| 3 | « silhouette encore trop petite ; plaques seulement sur la zone sélectionnée » | Risque cardio ③ Anatomie | **A** + plaque-localisée | S1 |
| 4 | « toujours beaucoup trop petite » | Complications | **A** | S1 |
| 5 | 5 boutons « Vert » → icônes-boutons colorées + fourchette au survol | Risque cardio ① Leviers | **F** | S2 |
| 6 | « au max, plaques doivent obstruer 70 % de la lumière » | Risque cardio ② Artère | plaque-calibration | S2 |
| 7 | « rebasculer en side-by-side, voir les examens placés ; icône au lieu du bouton » | Suivi | **C** (revert S4) | S3 |
| 8 | onglet « Zone-cible » → simple bouton d'état | Insuline ① | **C** | S4 |
| 9 | « supprimer le texte + la barre Temps-dans-la-cible n'apporte rien ici » | Insuline ② Lire la courbe | **D** | S4 |
| 10 | « retirer le titre, présenter simplement les 3 situations » | Insuline ③ Décider | **D** + libellé | S4 |
| 11 | « très petit par rapport à l'écran » | Activité ① Rayonnement | **A** | S5 |
| 12 | « déborde un peu ; un peu trop bien organisé » | Activité ② Volume | **C** + rythme visuel | S5 |
| 13 | micro-coupures 30×30 px (audit) | Activité ③ Timing | cible-tactile | S5 |
| 14 | « déborde de l'écran » | Alimentation ② Qualité | **C** | S6 |
| 15 | « déborde + courbe de glycémie trop petite » | Alimentation ③ Ordre | **C** + **B** | S6 |
| 16 | « idem courbe trop petite » | Alimentation ④ Proportion | **B** | S6 |

**Causes-racines** :
- **A — Objets pédagogiques encore sous-dimensionnés.** Silhouettes (Traitements, Complications, Risque cardio ③) et schéma rayonnement (Activité ①) occupent une fraction de l'écran ; l'« effet » (organe allumé, plaque, rayons) est invisible à ~1 m. Le tour 1 a agrandi, pas assez : il faut que **l'objet domine l'écran**.
- **B — LA COURBE glycémie reste trop petite** dans Alimentation ③/④ pour lire la différence de pic.
- **C — Mise en page : débordements résiduels + choix de disposition.** Alimentation ②/③ débordent encore ; Suivi doit repasser **side-by-side** sans déborder (l'inverse de S4) ; Insuline ① ne mérite pas un onglet plein écran.
- **D — Textes résiduels.** La passe S8 a laissé du narratif (Traitements, Insuline ②) et un titre de section trompeur (Insuline ③). **Décision Thibault reconduite : passe agressive, le soignant narre.**
- **F — Feux cardio : fusionner icône et état.** L'icône devient le bouton (couleur = état), la fourchette reste au survol, le bouton « Vert » séparé disparaît. Corrige aussi le point d'accessibilité « 5 boutons nommés Vert » relevé par l'audit.

## 3. Décisions tranchées (Thibault, 2026-07-11)

1. **Tailles : viser franchement grand** — l'objet central domine l'écran (silhouettes, courbe, rayonnement). Constantes de départ dans les sessions, **à caler à l'œil** (consigner dans `VALIDATION.md`).
2. **Suivi : side-by-side** (on revient sur le choix S4), **mais** lignes d'examen drastiquement simplifiées pour ne pas re-déborder. Bouton « Placer sur le cadran » → **icône Lucide**.
3. **Feux : l'icône Lucide EST le bouton** (couleur = état), fourchette au survol conservée, bouton texte « Vert/Orange/Rouge » retiré — **mais un nom d'état accessible est conservé** (jamais couleur seule).
4. **Artère : au niveau max, lumière ramenée à ~30 %** (plaque ≈ 70 %) — réglage géométrique, pas de chiffre imposé à l'écran (le « 30 % » existant est une info de 2ᵉ niveau, cf. brief).
5. **Passe texte agressive** reconduite sur les résidus.

## 4. Points laissés à revalidation visuelle par Thibault (non bloquants)

- Tailles cibles exactes des silhouettes / courbe / rayonnement (grandes mais sans recouvrement / sans pousser le contenu sous la ligne de flottaison).
- Intensité de l'obstruction à 70 % (réaliste sans être caricatural).
- Lisibilité du side-by-side Suivi sur écran contraint (1024×768) — le piège du tour 1.
- Feux : la couleur seule reste-t-elle assez lisible une fois le bouton texte retiré ? (garde-fou accessibilité ci-dessous).

## 5. Sessions

| Session | Contenu | Résout | Dépend de | Statut |
| --- | --- | --- | --- | --- |
| **S1** | Silhouettes tour 2 : vraiment dominantes (Traitements, Complications, Risque cardio ③) + plaques limitées à la zone sélectionnée + retrait du bloc texte Traitements | #1, #2, #3, #4 | — | [x] |
| **S2** | Feux cardio : icône-bouton coloré (retrait du bouton état, nom accessible conservé, fourchette au survol) + artère au max = lumière ~30 % | #5, #6 | S1 (même fichier Risque cardio) | [x] |
| **S3** | Suivi : repasser side-by-side sans déborder, examens visibles/lisibles, « Placer sur le cadran » → icône Lucide | #7 | — | [x] |
| **S4** | Insuline : onglet ① → bouton d'état ; onglet ② dégraissé (texte + barre TIR non pertinente) ; onglet ③ sans titre de section | #8, #9, #10 | — | [x] |
| **S5** | Activité : rayonnement agrandi ; volume dé-grillé + débordement corrigé ; micro-coupures ≥ 44 px | #11, #12, #13 | — | [x] |
| **S6** | Alimentation : débordements Qualité/Ordre corrigés + LA COURBE (Ordre/Proportion) agrandie | #14, #15, #16 | — | [x] |

Ordre conseillé : **S1 → S2** (même module, séquentiel), puis **S3 / S4 / S5 / S6** indépendants. S1 débloque le plus (règle de taille partagée).

Chaque session : gates verts + `VALIDATION.md` + `DECISIONS.md`/`STATUS.md`/`TASKS.md` + `/fin-de-tache`. Détail dans les `S<n>.md`.

**Chantier clos le 2026-07-11** (les 6 sessions faites, gates verts sur chacune). Mode solo (Sonnet), commits par tâche en fin de plan, push en attente de validation Thibault (cf. §6 des garde-fous et le point bloquant signalé en S6 sur le mécanisme exact du débordement Alimentation).

## 6. Garde-fous (toutes sessions)

- **Zéro persistance**, zéro dépendance runtime ajoutée, moteur `src/components/` thème-agnostique (ne jamais coder « diabète » en dur dedans).
- **Rétro-compat tabac** : `SilhouetteCorps` sans `bodyImage` inchangé (module `benefices-arret`).
- **Accessibilité feux (S2)** : retirer le libellé texte visible « Vert » est autorisé, mais chaque icône-bouton **doit garder un nom accessible discriminant** (`aria-label="Tension : orange"` etc.) — l'audit reprochait justement 5 cibles nommées « Vert » indistinctement ; ne pas retomber dans « couleur seule ».
- **Cibles ≥ 44 px** pour tout nouvel élément interactif (micro-coupures, icônes « placer », icônes-feux).
- **Contenu clinique** : ne rien inventer ; constantes de courbe/plaque et libellés cliniques restent `// à revalider (Thibault)`.
- **Pas de régénération d'images** : layout/logique/CSS uniquement. Les PNG de `public/illustrations/diabete/` sont figés.
- **Tests** : ne casser aucun invariant qualitatif de `glycemieCurve.test.ts`. Ajustement de seuil numérique seulement en conscience et documenté.
- Validation visuelle = humaine (Thibault), consignée dans `VALIDATION.md`. Ne pas prétendre avoir vu le rendu.
