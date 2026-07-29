# 2026-07-12 — Chantier audit-diabete (S1-S6) : 12 corrections + modèle de cumul insuline (excès persistant/IOB)

### Décision

Six sessions (S1-S6), onze tâches (T1-T11), corrigeant les 12 points d'un audit manuel de Thibault
sur le déployé (`Audit/audit-etp-interactif.md`, sélecteurs DOM), par-dessus le chantier
`corrections-visuelles-diabete-v3` déjà déployé : allègements de mise en page (Cardio S1,
Alimentation S3), réutilisation d'un composant existant (illustrations Hypo S2), passage d'un
affichage figé à un **système d'expérimentation** sur la famille Insuline (S4 réglage de la lente,
S5 modèle convergent + cumul de l'insuline rapide), resserrement transversal du cadre de
consultation (S6, zéro scroll). Détail complet session par session dans `plans/audit-diabete/`
(`index.md` + `S1.md`-`S6.md`, chacun avec sa section « Bilan de session »).

Le point notable de ce chantier est la **modélisation du cumul de doses d'insuline rapide** (S5,
T10, onglet ④, matrice de 6 cases). La case « situation B (reste haute) + attente + recorrection →
retour en cible » s'est révélée **structurellement irréalisable** avec deux mécanismes successifs —
démontré par preuve numérique (grid search exhaustif) à chaque tentative, pas un problème de
calage. Le mécanisme retenu (3ᵉ tentative, proposé et vérifié numériquement par le modèle **Fable**
sollicité spécifiquement pour cette réflexion, implémenté par Sonnet sur le fichier réel) introduit
une élévation de glycémie **persistante** (`exces`, qui ne décroît pas avec le seul écoulement du
temps), résorbée uniquement par une dose de correction réelle — pondérée par l'insuline encore
active de la 1ʳᵉ dose (IOB qualitatif, via une nouvelle fonction `fractionEffetDelivree`) au moment
de cette recorrection. C'est ce terme IOB qui distingue correctement une recorrection « tôt »
(sur-effet, IOB encore élevé → hypo) d'une recorrection « après attente » (IOB quasi nul → retour
en cible) — pas la taille d'un quelconque coussin résiduel qui se serait contenté de décroître avec
le temps.

### Contexte

Le plan `plans/audit-diabete/S5.md` (T10) posait une matrice pédagogique à 6 cases (2 situations
cliniques × 3 choix de recorrection) et un garde-fou explicite : si le modèle ne produit pas
proprement la case « B + attente → cible » sans calage fragile, **STOP**, ne pas fudger, proposer à
Thibault un ajout minimal au modèle et attendre l'arbitrage. Ce garde-fou s'est déclenché deux fois
de suite avant qu'une consultation ponctuelle du modèle Fable (autre agent, sollicité spécifiquement
pour réfléchir au problème de modélisation, hors du fil d'exécution normal Sonnet) ne trouve un
mécanisme fonctionnel.

### Alternatives envisagées

- **Tentative 1 — réutiliser tel quel l'écart de départ résorbé par le temps** (mécanisme de T9,
  `decalageDepart`/`DEPART_RESORPTION`) pour modéliser un repas B « sous-couvert » (paramètres
  `charge`/`frein`/`retard` poussés). Rejetée par preuve numérique : dans `repasLevelAt`, le
  paramètre `frein` réduit l'amplitude du pic **et** allonge sa durée simultanément — les deux
  effets d'un même paramètre s'opposent structurellement, rendant impossible d'obtenir à la fois
  « pic franchement au-dessus de la bande cible » et « encore élevé 150 min après le repas », pour
  n'importe quelle combinaison de `RepasParams` (même poussés à leurs bornes théoriques, le plafond
  atteignable à l'instant « attente » reste à peine 6 points au-dessus de la baseline).
- **Tentative 2 — un « plateau additif » à résorption très longue** (`plateauHaut?`,
  `PLATEAU_RESORPTION ≥ 400`, même schéma `ease` que T9). Rejetée après recherche exhaustive sur
  grille (dose × `PLATEAU_RESORPTION` × `plateauHaut`, plus de 500 combinaisons testées) : aucune ne
  satisfait simultanément les 3 conditions de la matrice ; pire, dans 81 % des configurations qui
  satisfont déjà « B reste haute », la case « attente » est aussi mauvaise ou pire que la case
  « tôt » — l'inverse exact de ce que la matrice demande. Cause structurelle identique en substance
  à la tentative 1 : à l'instant « attente », le plateau s'est déjà partiellement résorbé par le
  temps (un « coussin » plus petit qu'à l'instant « tôt ») — toute dose assez forte pour transpercer
  le grand coussin de « tôt » transperce nécessairement aussi le petit coussin de « attente »,
  provoquant une hypo dans les deux cas au lieu d'un atterrissage en douceur dans la cible pour
  « attente » seulement.
- Fudger les seuils de lecture de la matrice (assouplir les critères « plonge »/« cible ») pour
  faire passer une des deux tentatives → écarté explicitement par le mandat de la session
  (« ne pas implémenter une version dégradée silencieusement »).

### Raison du choix

Le mécanisme IOB (3ᵉ tentative) lève la cause structurelle commune aux deux pistes rejetées :
l'élévation persistante ne décroît **jamais** sous le seul effet du temps — seule une dose de
correction réelle la consomme, à hauteur de la dose ajoutée plus l'insuline encore active de la
1ʳᵉ dose (IOB, calculée via `fractionEffetDelivree`). À l'instant « attente », l'IOB de la 1ʳᵉ dose
est quasi nul → la recorrection agit sur l'excès sans effet résiduel qui s'ajoute, et atterrit dans
la cible. À l'instant « tôt », l'IOB de la 1ʳᵉ dose est encore élevé → il s'additionne à l'effet de
la recorrection et provoque l'hypo. C'est ce terme IOB — pas la taille d'un coussin résiduel
arbitraire qui aurait fini par décroître de lui-même — qui distingue correctement les deux cas,
condition que les deux mécanismes précédents ne pouvaient pas satisfaire par construction.

### Conséquences

- Deux nouveaux champs optionnels sur `BolusParams` (`glycemieCurve.ts`) : `exces?: number`
  (élévation persistante) et `doseCorrection?: number` (dose de la 2ᵉ injection, défaut = `dose`)
  — comportement strictement inchangé quand ils sont absents (non-régression garantie par
  construction, vérifiée par les 55 tests de `glycemieCurve.test.ts`, dont 4 nouveaux ; aucun test
  existant modifié à travers les 3 tentatives).
- Nouvelle constante `EXCES_CONSOMMATION` (modèle, `glycemieCurve.ts`) + `EXCES_SITUATION_B`
  (composant, `InsulineRapideModule.tsx`) — points d'excès résorbés par unité d'insuline mobilisée,
  `// à caler (Thibault)`.
- Nouvelle fonction privée `fractionEffetDelivree(dt)` — fraction cumulée (0→1) de l'effet d'un
  bolus déjà délivrée à l'instant `dt`, distincte de `bolusEffet` (intensité instantanée). Ni
  `bolusEffet` ni aucune autre fonction existante de `glycemieCurve.ts` n'ont été modifiées ; seule
  `sampleRepasAvecBolus` a été touchée à travers les 3 tentatives (garde-fou du plan `S5.md`
  respecté de bout en bout).
- `InsulineRapideModule.tsx` onglet ④ reconstruit : les états `situationCumul`
  (`'revient'|'reste-haut'`) et `recorrection` (`'aucune'|'tot'|'attente'`) remplacent l'ancien
  toggle binaire `cumulActive` ; nouvelle fonction `matriceCumul(...)` qui calcule le message et
  l'issue (« plonge » ou non) pour chacune des 6 cases. Onglets ①②③ non touchés par T10.
- Résiduels zéro-scroll (S6, cf. `STATUS.md` § Phase 14) : point ouvert du même chantier, hors
  périmètre de cette décision de modélisation — micro-session dédiée à prévoir (Suivi « Le
  parcours » et Traitements « avec panneau » en priorité, breakpoints de layout mal calés à
  1024×768).

### Impact IA

- Si Thibault ajuste `EXCES_SITUATION_B`/`EXCES_CONSOMMATION` (marqués `// à caler`), aucune
  reconception n'est nécessaire — seules les constantes changent.
- Toute future extension du modèle de cumul (`sampleRepasAvecBolus`) doit passer par une nouvelle
  décision documentée ici, dans le même esprit que le gel d'API du 2026-07-09 (S14, module
  Alimentation) : pas de modification silencieuse du modèle sans revalider les invariants qu'il
  protège.
- Avant toute nouvelle tentative de modélisation d'un mécanisme de cumul/persistance sur ce module,
  lire les deux tentatives rejetées ci-dessus (et le détail chiffré dans le bilan de
  `plans/audit-diabete/S5.md`) pour ne pas répéter une preuve déjà faite : les deux échouent pour
  des raisons structurelles du modèle `repasLevelAt`/`ease` (couplage pic/durée via `frein` ;
  résorption temporelle du coussin), pas par sous-calage de constantes — un nouvel ajustement de
  `PLATEAU_RESORPTION` ou de `frein` ne suffira pas à les faire fonctionner.

