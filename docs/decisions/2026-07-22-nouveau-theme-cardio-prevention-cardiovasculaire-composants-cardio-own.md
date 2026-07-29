# 2026-07-22 — Nouveau thème `cardio` (« Prévention cardiovasculaire ») : composants cardio-owned, porte inter-thèmes en repli, gate contenu G1

### Décision

3ᵉ thème du moteur multi-thèmes (après tabac, diabète), câblé depuis un handoff Claude Design
(`design/Mosule cardio ETP interactif-handoff.zip`, prototype `ETP Cardio - Prototype.dc.html`, 12
modules) et le brief/evidence cliniques (`docs/cardio/`). Prévention **primaire** uniquement
(secondaire — post-infarctus/AVC, réadaptation, DAPT — hors v1). Quatre décisions structurantes,
tranchées avec Thibault le 2026-07-22 avant le fan-out des modules :

1. **Composants cardio-owned, pas de généralisation immédiate.** `ArtereCoupe` (artère réversible
   riche : dépôt, rupture, caillot, paroi renforcée) et `CockpitFeux` (cumul multiplicatif) vivent
   dans `src/features/cardio/components/`, découplés du diabète — même précédent que
   `IllustrationSlot` dupliqué par thème (cf. décision « Duplication assumée d'IllustrationSlot par
   thème », S1 illustrations-diabete). `Silhouette` réutilise le moteur générique `SilhouetteCorps`
   (wrapper mince, comme le diabète) ; le composant diabète `PlaqueArtere` n'a **pas** été réutilisé
   pour l'artère cardio : il ne dessine que le dépôt (`encrassement` 0→1), sans réversibilité ni
   rupture — insuffisant pour le brief cardio (réversibilité = message d'espoir non négociable).
2. **Porte inter-thèmes (M2→diabète, M6→tabac) : repli visuel, pas d'extension moteur.** La nav
   actuelle est strictement intra-thème (`onNavigate` reste sur le `themeId` courant ; seul chemin
   inter-thèmes = revenir au `ThemeSelector`). Les modules 2 et 6 affichent une mention informative
   non-navigante (« → Un parcours dédié existe dans le thème Diabète/Tabac ») plutôt que d'étendre
   `App.tsx`/`types.ts` (moteur partagé par les 3 thèmes, donc plus sensible). Extension réactivable
   plus tard si le besoin se confirme à l'usage.
3. **Module 12 « Mon suivi » = « mes 3 chiffres », pas le cadran annuel du diabète.** Le brief
   signalait lui-même le risque qu'un cadran annuel paraisse vide en prévention primaire (suivi léger,
   réévaluation tous les 3-5 ans). Grille de voyants légère (tension/LDL/tour de taille) retenue à la
   place, jamais de rouge (le rouge-santé reste réservé aux modules 2/4/5).
4. **Aspirine : jamais mentionnée à l'écran (modules 10 et 11).** Le rapport OpenEvidence (Complément
   K) mentionnait l'aspirine 160-325 mg « si disponible, en attendant » pour l'infarctus ; le brief
   posait explicitement le piège inverse (ne pas la banaliser). Arbitré en faveur de la **sûreté** :
   l'aspirine est contre-indiquée si l'accident est en réalité un AVC hémorragique, indiscernable sans
   imagerie — un panneau de survie ne peut pas se permettre cette ambiguïté. Le geste unique enseigné
   est « appelez le 15 (ou 112) » ; le module 11 (traitements) retire l'antiagrégant de sa table de
   classes (pas de comparaison/choix de molécule de toute façon, mais éviter jusqu'à la mention).

**Gate contenu (G1, verrou dur avant tout module).** `docs/cardio/CONTENU_cardio.md` distille le brief
+ les 2 rapports OpenEvidence (socle/complément) en un doc par module (message écran / 2ᵉ niveau
sourcé / calibrage jamais affiché / pièges / sources). Plusieurs seuils du brief se sont révélés **non
confirmables** par les rapports (tables ESC dégradées au copier-coller) : les cibles LDL en g/L
(`< 1,0` / `< 0,7`) et le seuil tensionnel « consultation < 140/90 ». Thibault a tranché le 2026-07-22 :
**jamais de cible LDL ou tensionnelle chiffrée à l'écran** (seuils modulés selon le niveau de risque
CV, hors écran) plutôt que d'attendre un re-sourçage ; **AMT < 135/85 conservé** (sourcé, solide) avec
le message « une seule mesure ne suffit pas » ; **sel** = message qualitatif seul, aucun g/j ; **alcool**
= repères Santé Publique France verbatim (« moins de 2/jour, pas tous les jours, ≤ 10/semaine »), sans
affirmer plus fort que le rapport (courbe en J *contestée*, pas réfutée). Seule réserve non bloquante :
les fréquences de suivi du module 12 restent `// à revalider (Thibault — HAS)`.

### Contexte

Précédent le plus proche : câblage du thème diabète (`plans/theme-diabete/`, 2026-07-09) — même
schéma (handoff Claude Design → registre de thème → modules), mais diabète n'avait pas de contenu
clinique aussi disputé (plusieurs seuils cardio se sont révélés dégradés/perdus dans le traitement du
rapport OpenEvidence, ce qui n'était pas arrivé aux rapports diabète/tabac).

### Alternatives envisagées

- Généraliser `ArtereCoupe`/`CockpitFeux` dans `src/components/` dès le câblage initial — écarté :
  aurait obligé à retoucher le module diabète existant (Risque cardiovasculaire) et à le retester,
  sans bénéfice pour un thème qui vient de naître. Peut être fait plus tard si un 3ᵉ usage émerge.
- Étendre le moteur pour une vraie porte inter-thèmes dès v1 — écarté : `App.tsx`/`types.ts` sont
  partagés par tabac et diabète ; le gain (un clic de moins) ne justifiait pas le risque de régression
  sur les deux thèmes existants pour une v1.
- Reprendre le cadran de l'année du diabète pour M12 — écarté par le brief lui-même (suivi léger en
  primaire, cadran risquant de paraître vide) et confirmé par Thibault.
- Afficher l'aspirine en 2ᵉ niveau seulement (comme initialement proposé par l'exécutant de S1) —
  écarté par Thibault : même en survol, la mention crée un risque de rappel erroné en situation
  d'urgence réelle ; la sûreté prime sur l'exhaustivité informative.

### Raison du choix

Cohérence avec l'invariant multi-thèmes (ne pas complexifier le moteur partagé pour un seul thème
naissant), et primauté de la sûreté clinique sur l'exhaustivité du contenu quand une source se révèle
dégradée ou ambiguë (mieux vaut un message qualitatif sourcé qu'un chiffre halluciné ou un rappel
dangereux sous stress).

### Conséquences

- `src/features/cardio/components/` et `src/features/cardio/lib/risqueCardio.ts` (21 invariants
  testés) sont la source de vérité du cumul multiplicatif et de la géométrie de plaque — toute
  retouche visuelle de l'artère doit passer par la lib, jamais par un composant de module.
- Les modules 2 et 6 portent chacun leur propre mention de repli (pas de composant partagé pour
  l'instant) — si une vraie porte inter-thèmes est développée plus tard, factoriser à ce moment-là.
- Aucune occurrence du mot « aspirine » ne doit apparaître dans un texte affiché des modules 10/11
  (vérifié par grep à la consolidation — seules des mentions en commentaire de maintenance
  subsistent) ; toute future évolution de ces modules doit préserver cet invariant.
- Les fréquences de suivi du module 12 (`SuiviModule.tsx`) sont marquées `// à revalider (Thibault —
  HAS)` — non bloquant, mais à trancher avant de considérer le module définitivement clos.

### Points ouverts (à revalider Thibault)

- Formulation exacte des signes atypiques d'infarctus (module 10, équilibre sensibilité/fausses alertes).
- Position du repère « > 5 min » (module 10) : laissé en sous-texte toujours visible faute de
  mécanisme de survol adapté à une carte de survie ; le doc de contenu posait la question ouverte de
  le remonter au 1ᵉʳ niveau.
- Accroche d'ouverture du module 8 (« l'assiette méditerranéenne soigne les artères ») : message
  patient non fourni par le rapport OpenEvidence, proposition de l'exécutant à juger par Thibault.
- Fréquences de suivi du module 12 — confirmation HAS.
- Validation visuelle des modules 4-12 (le pilote 1-3 est déjà validé, cf. `VALIDATION.md`).

### Impact IA

- `docs/cardio/CONTENU_cardio.md` devient l'autorité de contenu du thème cardio (au même titre que
  `docs/diabete/00-global.md` pour le diabète et `docs/contenu-modules-tabac.md` pour le tabac) — à
  lire avant toute future modification d'un module cardio, ne jamais réécrire son contenu depuis un
  module.
- Ne jamais réintroduire de valeur chiffrée (LDL, tension, sel, alcool) directement à l'écran d'un
  module cardio sans repasser par une gate de contenu équivalente à G1 — le précédent (tables ESC
  dégradées) montre que ces seuils sont un point de fragilité connu du pipeline evidence → contenu.
- Si un jour la porte inter-thèmes réelle ou la généralisation des composants sont entreprises,
  documenter la décision ici plutôt que de la coder silencieusement (les deux ont été explicitement
  écartées pour v1, pas oubliées).

