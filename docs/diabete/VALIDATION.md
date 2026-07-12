# docs/diabete/VALIDATION.md — checklist visuelle / UX (passe humaine, thème diabète)

> Validation **visuelle** déléguée à Thibault, **non bloquante** pour les commits.
> Claude consigne ici (ne tente jamais de vérifier lui-même : pas de navigateur côté Claude).
> Dérouler en une session : `npm run dev`, puis cocher.
>
> Légende statut : [ ] à valider · [x] OK · [!] à corriger (décrire dessous).
> Rappel cadre : lisible à ~1 m, sobre, interactif (≠ diaporama).
>
> **Portée** : checklists visuelles du chantier `plans/audit-diabete/` (S1-S6, audit 2026-07-12,
> 12 corrections). Consolidées fidèlement depuis les sections « Bilan de session » de
> `plans/audit-diabete/S1.md` à `S6.md`. Les checklists visuelles diabète antérieures
> (`theme-diabete`, `alimentation-v2`, `illustrations-diabete`, `corrections-visuelles-diabete`
> v1/v2/v3) restent dans le `VALIDATION.md` racine, section « Thème diabète » / chantiers
> `corrections-visuelles-diabete*` — non déplacées ici, portée historique.
> **Purge** : supprimer un bloc entièrement `[x]` après la passe humaine — l'historique git suffit.
> L'historique détaillé (T1-T11) est dans `git log` + raconté dans `STATUS.md` (« Ce qui
> fonctionne », `## Phase 14`) et `DECISIONS.md` (2026-07-12).

---

## Cardio — S1 (T1-T2 : fusion « Les leviers »→« L'artère », retrait des 3 textes)

- [ ] 3 onglets numérotés ①②③ dans la barre de navigation du module (plus d'onglet « Les leviers »
      séparé).
- [ ] Onglet ① (« Les facteurs de risque ») affiche les 5 chips **avec icône** (Sucre/Tension/
      Cholestérol/Tabac/Sédentarité), cliquables, qui font grossir/réduire la plaque sur
      l'illustration de l'artère juste en dessous.
- [ ] Icône + libellé bien alignés dans chaque chip (gap visuellement correct, pas de
      chevauchement).
- [ ] Cible tactile des chips confortable (≥ 44 px) à l'écran, pas seulement en CSS.
- [ ] Survol/focus clavier d'un chip fait apparaître l'infobulle de seuil (ex. « HbA1c < 7 % »)
      sans être coupée par le bord de la carte ou masquée par les chips voisins.
- [ ] Onglet ① : **plus** de sur-titre « L'artère — un seul objet, réversible », **plus** de
      « Passage du sang : X % », **plus** de message d'état sous l'image — uniquement l'image de
      l'artère + la plaque qui réagit visuellement aux chips.
- [ ] La carte de l'artère (`.arterePanel`) ne paraît pas anormalement vide en haut sans ces
      textes ; si besoin, ajuster le padding (non fait par l'agent, à caler à l'œil).
- [ ] Onglets ② (Anatomie) et ③ (Fiche) inchangés visuellement par rapport à avant la session
      (contenu identique, juste renumérotés).
- [ ] Légende de bas de page (`.caption`) affiche bien le libellé de l'onglet actif correspondant
      (« ① Les facteurs de risque », « ② L'anatomie », « ③ La fiche »).

## Hypo — S2 (T3 : illustrations des signes dans « Ma carte »)

- [ ] Dans « Ma carte » (temps ③), les signes cochés au temps ① s'affichent **avec leur
      illustration** (placeholder ou PNG), comme dans « Mon profil hypo ».
- [ ] La carte reste lisible à ~1 m avec plusieurs signes cochés (jusqu'à 7).
- [ ] La carte **ne déborde pas** / ne pousse pas excessivement au scroll, y compris avec 7 signes
      cochés.
- [ ] Le fallback « À définir avec le soignant » s'affiche bien quand aucun signe n'est coché.
- [ ] La **fiche imprimée** (bouton « Imprimer ma carte ») garde ses chips texte pour « Mes
      signes » (inchangée).

## Alimentation — S3 (T4-T7 : courbe remontée dans la colonne + allègements)

- [ ] **T4** — Sur les 4 défis (Composition, Qualité, Ordre, Repas complet), la courbe « Glycémie
      après le repas » est dans la colonne du défi, agrandie, visible sans scroll ; l'enchaînement
      « je manipule → je vois le résultat juste dessous » est préservé.
- [ ] **T5** — Composition : assiette plus grande + icône de reset (sans texte) + pas de compteur
      « Dans l'assiette : … » ; la courbe (T4) est juste dessous.
- [ ] **T6** — Qualité : 2 cartes de comparaison remontées (plus de rangée de duels), chaque carte
      garde son badge « Pic … » mais plus de « Vous aviez dit » ni « Bonne prédiction » ; reset en
      icône ; la courbe (T4) grande et visible sans scroll.
- [ ] **T7** — Ordre et Repas complet montrent la courbe agrandie, remontée, sans espace mort
      au-dessus ; pas de scroll ajouté.

## Insuline « Décider » — S4 (T8 : réglage expérimentable de la lente)

- [ ] Temps ② « Décider » → choisir « Plusieurs nuits qui montent », puis « Monter la lente » :
      la courbe s'aplatit (revient dans la cible) et la flèche passe à « → ».
- [ ] Même situation, « Baisser la lente » : la courbe plonge vers le bas (message d'hypo
      matinale).
- [ ] « Déjà haut après le repas, stable » : les 3 réglages ne changent presque rien à la courbe
      (message « la lente n'y change presque rien »).
- [ ] Changer de situation ou de profil réinitialise le réglage (les 3 boutons repassent à l'état
      neutre, pas de message affiché).
- [ ] Aucun chiffre brut affiché nulle part dans cet écran.
- [ ] Cibles des 3 boutons ≥ 44 px, état actif visible sans dépendre de la seule couleur
      (contour + repère `activeDoubled`).

## Insuline rapide — S5 (T9-T10 : modèle convergent onglet ③ + cumul expérimentable onglet ④)

### Onglet ③ — courbes de départ convergentes + correction (T9)

- [ ] Onglet ③ : Basse / Cible / Haute donnent 3 courbes de **formes différentes** qui
      **convergent** (ce n'est plus une simple translation constante).
- [ ] Onglet ③ : sur « Haute », activer le toggle « Ajouter une correction de rapide » fait
      **redescendre** la courbe dans la bande cible (impact visible, aucun chiffre affiché).
- [ ] Onglet ③ : « Basse » renvoie toujours vers l'hypo (porte « Traiter l'hypo d'abord »),
      « Cible » inchangé.
- [ ] Cible tactile du toggle de correction (③) ≥ 44 px, `aria-pressed` correct, contour + ✓
      visibles quand actif (`activeDoubled`).

### Onglet ④ — cumul, 2 situations × 3 recorrections, 6 cases (T10, mécanisme IOB retenu en 3ᵉ tentative — cf. `DECISIONS.md`)

- [ ] **A (redescend seule) + rien** : la courbe revient d'elle-même dans la bande cible, message
      confirmant que la dose de départ suffisait.
- [ ] **A + tôt** : plonge sous la cible, message + porte hypo affichée.
- [ ] **A + attente** : plonge sous la cible également (dose pas nécessaire, même après avoir
      attendu), message + porte hypo affichée.
- [ ] **B (reste haute) + rien** : la courbe reste visiblement au-dessus de la bande cible en fin
      de fenêtre (pas de porte hypo, pas de plongeon).
- [ ] **B + tôt** : plonge sous la cible et n'en ressort pas (pas de rebond visible), message +
      porte hypo affichée.
- [ ] **B + attente** : redescend et se stabilise **dans** la bande cible (pas sous 25, pas
      au-dessus de 60), message positif, **pas** de porte hypo.
- [ ] Les 2 rangées de boutons (situation / recorrection) : cible tactile ≥ 44 px, `aria-pressed`
      correct, contour + ✓ visibles quand actif (`activeDoubled`), aucun chiffre affiché.
- [ ] Changer de situation réinitialise bien le choix de recorrection à « Je n'ajoute pas de
      dose ».
- [ ] Onglets ①②③ inchangés visuellement par cette tentative (aucune régression attendue).

> Note S5 : « B + rien » présente un creux transitoire vers t≈20-25 (~58, légèrement sous la bande
> cible 60) avant de remonter et se stabiliser haut — attendu (reflet de la 1ʳᵉ dose qui couvre
> encore une partie du pic du repas), pas un défaut du mécanisme ; à confirmer que ça ne se lit pas
> comme un bug à l'écran.

## Cadre transverse zéro-scroll — S6 (T11 : resserrement du cadre partagé + mesure des résiduels)

> Mesures ci-dessous faites par **lecture de code** (tailles fixes, `viewBox`, gaps/paddings), pas
> par rendu navigateur — ce sont des **estimations**, à vérifier à l'écran. Cocher « tient sans
> scroll » onglet par onglet ; sinon noter l'écart observé face à l'estimation.

### Tabac (rétro-compat — accueil + au moins 2 modules)

- [ ] Accueil tabac : rendu inchangé ou mieux resserré (moins d'espace mort en haut/bas), aucune
      régression visuelle (chevauchement, texte coupé, alignement cassé).
- [ ] Module tabac n°1 (ex. `nicotine`) : header + contenu resserrés par rapport à avant, rien de
      coupé ni chevauché.
- [ ] Module tabac n°2 (ex. `boite-a-outils`) : idem.
- [ ] Aucun `ModuleShell` sans `wide`/`nav` (usage tabac standard) ne rend différemment de
      « avant, en mieux resserré » — pas de régression de mise en page.

### Diabète — accueil + 10 modules, à 1366×768 et 1024×768

- [ ] Accueil : tient sans scroll à 1366×768 (**estimation : ne tient probablement pas**, ~200px
      de trop, famille « Se soigner »).
- [ ] Accueil : tient sans scroll à 1024×768 (**estimation : idem, ~200px**).
- [ ] Mécanisme (vue unique) : tient aux 2 résolutions (**estimation : oui, large marge**).
- [ ] Risque cardio ① Facteurs de risque : tient aux 2 résolutions (**estimation : oui**).
- [ ] Risque cardio ② L'anatomie : tient à 1366×768 / 1024×768 (**estimation : limite/dépasse**,
      silhouette fixe 560px).
- [ ] Risque cardio ③ La fiche : tient aux 2 résolutions (**estimation : oui**).
- [ ] Alimentation ① Composition, ② Qualité, ③ Ordre, ④ Repas complet, ★ Synthèse : tient aux 2
      résolutions (**estimation : non pour la plupart, surtout ④** — courbe glycémie pleine
      largeur).
- [ ] Activité ① Le rayonnement : tient aux 2 résolutions (**estimation : non**, carré 640×640
      fixe).
- [ ] Activité ② Le volume, ③ Le timing : tient aux 2 résolutions (**estimation : oui, ③ limite à
      1024**).
- [ ] Complications (organes simples) : tient aux 2 résolutions (**estimation : oui**).
- [ ] Complications (organe « pied ») : tient à 1366×768 / 1024×768 (**estimation :
      limite/dépasse à 1024**).
- [ ] Suivi ① Le parcours : tient à 1366×768 / 1024×768 (**estimation : limite à 1366, dépasse
      largement à 1024** — à vérifier en priorité, plus gros résiduel estimé, breakpoint de
      layout mal calé).
- [ ] Suivi ② La fiche : tient aux 2 résolutions (**estimation : oui, overlay scrollable dédié**).
- [ ] Traitements (état initial) : tient à 1366×768 / 1024×768 (**estimation : oui à 1366,
      dépasse à 1024**).
- [ ] Traitements (avec panneau/ligne sélectionnée) : tient aux 2 résolutions (**estimation :
      dépasse aux deux** — à vérifier en priorité, breakpoint de layout mal calé).
- [ ] Hypoglycémie ① Mon profil hypo : tient aux 2 résolutions (**estimation : oui**).
- [ ] Hypoglycémie ② Le réflexe 15/15 : tient aux 2 résolutions (**estimation : non**, courbe non
      plafonnée).
- [ ] Hypoglycémie ③ Ma carte : tient à 1366×768 / 1024×768 (**estimation : oui à 1366, limite à
      1024**).
- [ ] Insuline ① Lire la courbe : tient aux 2 résolutions (**estimation : limite à 1366**).
- [ ] Insuline ② Décider : tient aux 2 résolutions (**estimation : non, le plus dépassé du
      module**).
- [ ] Insuline rapide (les 4 onglets ①②③④) : tient aux 2 résolutions (**estimation : non à 1366
      pour tous, bordeline à 1024** ; header lui-même proche du wrap dès 1366 à cause du titre
      long).

### Lisibilité

- [ ] Texte de contenu toujours lisible à ~1 m sur l'ensemble des écrans resserrés (aucune taille
      de police de corps perçue comme réduite — seuls paddings/marges ont changé, `--font-size-*`
      non touché).

**Si des résiduels sont confirmés à l'écran** : ne pas les corriger dans cette passe (hors
périmètre du chantier `audit-diabete`, transversal S6 uniquement) — les reporter tels quels (ou
avec les écarts constatés) pour une micro-session de calage per-module, en priorisant **Suivi**
« Le parcours » et **Traitements** « avec panneau » (breakpoints à revoir) et `CourbeGlycemie`
(plafond de hauteur à ajouter). Cf. `STATUS.md` § Phase 14, « Résiduels non résolus ».
