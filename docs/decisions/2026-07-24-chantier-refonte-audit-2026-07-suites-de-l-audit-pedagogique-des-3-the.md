# 2026-07-24 — Chantier refonte-audit-2026-07 : suites de l'audit pédagogique des 3 thèmes

### Décision

Traiter les constats de l'audit pédagogique bi-agents du 2026-07-23 (`Audit/audit-pedagogique-2026-07.md`
+ `-partie2.md`) en 9 sessions, dont 6 codées dans cette passe (S1-S5, S7), 1 arrêtée sur gate contenu
(S6) et 1 hors vague (S8, bloquée PNG) :

1. **A1 — layout des modules à grand visuel diabète (S1)** : patron « colonne visuel réduite en empilé +
   contrôles visibles dans le premier écran » appliqué à Complications/Suivi/Insuline basale, sans
   composant partagé factorisé (le sur-dimensionnement avait 3 causes différentes par module — pas de
   sur-abstraction pour un motif non identique).
2. **A4 — insuline basale, feedback des décisions (S2)** : refrain de sécurité « ~3 jours / dans le
   doute on ne monte pas » rendu permanent, quel que soit le choix — pas une récompense de bonne
   réponse (posture ETP non évaluative).
3. **A5 — cardio M9, leviers stress + SAOS (S3)** : payoff réactif choisi (pas de dégradation en
   affichage non-cliquable) — le doc contenait assez de matière pour une phrase-conseil sobre par levier.
4. **A6a-g — micro-fixes groupés (S4)** : tous les 7 points reproduits sur le build à jour et corrigés
   (aucun faux positif dans ce lot).
5. **A7 — cardio M3, plaque-pivot (S5)** : enrichi **en place** (gate G-A7, défaut appliqué) — le
   moteur artère/silhouette partagé suffisait, aucun blocage technique justifiant une fusion de module.
6. **A8 — cardio M6, mécanisme CV tabac (S6) — BLOQUÉ gate contenu G-A8** : le doc `CONTENU_cardio.md`
   §M6 ne couvrait que 2 des 5 étapes du mécanisme en registre patient (paroi agressée et
   vasoconstriction/spasme manquaient). Conformément à la consigne « ne pas inventer de mécanisme non
   sourcé », une proposition a été écrite (sourcée OpenEvidence Socle §E.1/E.2) et le code de l'objet
   interactif **n'a pas été fait** — arrêt volontaire avant tout câblage.
7. **A10 — rétro-port barre de risque (S7)** : modèles de cumul cardio (multiplicatif) et diabète
   (moyenne pondérée des feux) jugés **incompatibles** — seule l'**UI** est partagée
   (`src/components/RisqueBarre.tsx`, score qualitatif 0-1, aucun chiffre affiché), chaque thème
   continue de calculer son propre score en interne.

### Contexte

Audit pédagogique critique mené au navigateur in-app sur la prod (2026-07-23), verdict : socle
pédagogique solide, aucun trou conceptuel majeur, problèmes concentrés et majoritairement de forme.
Deux constats de l'audit vérifiés dans le code **avant** planification pour ne pas ouvrir un chantier
sur un faux positif : le « défi Qualité sans courbe » (Alimentation) était un faux positif de layout
(absorbé par A1) ; le pré-cochage des mois passés du Suivi (`statusForMonth`) est une conception
délibérée, pas un bug — capturé comme question produit **G-Suivi**, non codé.

### Alternatives envisagées

- S6 : coder un mécanisme plausible mais non entièrement sourcé pour ne pas bloquer la session →
  écarté, contrevient explicitement à l'invariant « exactitude médicale, signaler plutôt qu'inventer »
  et à la consigne impérative de la fiche S6.
- S7 : partager le calcul de cumul entre cardio et diabète pour une seule source de vérité → écarté,
  les modèles de risque (facteurs, pondérations) diffèrent réellement entre les deux thèmes ; forcer un
  partage aurait introduit un couplage artificiel entre features indépendantes.
- S1 : factoriser un composant de layout partagé dès cette passe → écarté, les 3 causes de
  sur-dimensionnement étaient différentes par module (dimension fixe, plafond CSS, absence de grille) —
  pas de motif identique à abstraire sans sur-ingénierie.

### Raison du choix

Respecter la hiérarchie du plan : les correctifs de forme (S1, S3, S4, S7) s'exécutent sans gate
bloquante ; les refontes à contenu clinique nouveau (S5, S6) passent par une gate explicite avant tout
code d'objet interactif — S5 n'en avait pas besoin (mapping organe→accident déjà validé au G1 initial
du thème cardio), S6 en avait besoin et s'est arrêtée dessus.

### Conséquences

- **Nouveau composant partagé** `src/components/RisqueBarre.tsx` (+ `.module.css`) — générique,
  agnostique du thème (invariant 4), consommé par `CockpitFeux` (cardio, extraction propre depuis le
  code existant) et `RisqueCardioModule` (diabète, nouveau usage).
- **`docs/cardio/CONTENU_cardio.md` §M6 enrichi** d'une proposition de mécanisme CV (5 étapes, sourcée),
  marquée `// à revalider (Thibault)` — **bloque tout câblage de l'objet interactif M6 tant que non
  validée cliniquement**.
- Points `// à revalider (Thibault)` non bloquants : 3 phrases-conseil leviers stress (S3), 4 phrases de
  conséquence + libellé « Agir » de M3 (S5), sort du « tour de taille » M7 (S4, **G-M7-taille**).
- Gates non tranchées, hors périmètre code de ce chantier : **G-Suivi** (pré-cochage mois passés),
  **G-M10-nausées** (arbitrage clinique sensibilité/spécificité).

### Impact IA

- **S6 / M6 tabac** : ne pas coder l'objet interactif du mécanisme CV avant que Thibault ait validé ou
  corrigé les 5 formulations du bloc « PROPOSITION DE RÉ-ENRICHISSEMENT » dans
  `docs/cardio/CONTENU_cardio.md` §M6 — c'est la gate G-A8, toujours ouverte.
- **`RisqueBarre`** : composant générique réutilisable pour tout futur thème ayant besoin d'une barre de
  risque qualitative de synthèse — ne jamais y coder de logique de cumul spécifique à un thème (le score
  0-1 est calculé par l'appelant).
- **G-Suivi/G-M10-nausées/G-M7-taille** : décisions produit/clinique ouvertes, à trancher avec Thibault
  avant tout code futur sur `diabete/suivi` (pré-cochage), `cardio/alerte` (nausées) ou `cardio/bouger`
  (tour de taille).

