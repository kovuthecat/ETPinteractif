## 2026-08-06 — Clôture enrichissement-visuel-2026-07 (S5-S8) : dépôt illustrations + G-familles

### Décision
1. Les 41 illustrations générées par Thibault (`Downloads/Illustration ETP manquante/`) sont déposées
   via un pipeline dédié (`design/illustrations/build_assets_manquantes_2026_08.py`) dans
   `public/illustrations/{diabete,cardio,tabac}/`. Aucune modification de code n'était nécessaire
   (`IllustrationSlot` résout déjà par id) — ceci clôt à la fois S6 de `enrichissement-visuel-2026-07`
   et sa session jumelle S8 de `refonte-audit-2026-07`.
2. **G-familles** (pictos des 10 repères cardio, module Manger) tranchée : icônes Lucide par repère
   (Droplet/Fish/Carrot/Bean/Nut/Wheat pour les 6 « amis » ; Ham/Croissant/Donut/Sparkles pour les 4
   « à limiter »), remplaçant la flamme unique. **Pas de nouvel asset PNG.**

### Contexte
L'audit consultation du 2026-07-23 avait relevé deux manques : (a) des modules entiers en
placeholders (Alerte cardio M10, garde-manger) faute de PNG livrés, et (b) les 10 cartes de
`RepereCard` (module Manger, onglet Familles) toutes identiques visuellement — seule la couleur
(vert/rouge) distinguait « ami » de « à limiter », le contenu textuel restant le seul repère réel.

### Alternatives envisagées
Pour G-familles : (1) 10 illustrations custom dans la famille graphique « aplats » des autres
visuels — écarté, relance un cycle de génération pour un gain marginal sur des pictos à 18px ; (2)
repli minimal (garder la flamme, accentuer teinte/forme) — écarté, ne répond pas au constat de
l'audit ; (3) icônes Lucide par repère — retenu.

### Raison du choix
Le thème tabac utilise déjà Lucide pour tous ses petits pictos (Cigarette, Pill, Brain, Wind…),
jugés cohérents avec le style éditorial et *volontairement* non illustrés (cf.
`design/illustrations/prompts-illustrations-diabete.html`, encart « Revue tabac »). Étendre ce
principe aux repères cardio est cohérent, gratuit (bibliothèque déjà une dépendance du projet, zéro
asset à produire) et immédiat.

### Conséquences
- `public/illustrations/{diabete,cardio}/` : +21 fichiers partagés (10 légumes + 7 situations + 4
  « monde »), déposés dans les deux dossiers. `public/illustrations/tabac/` : +6 vrai/faux.
  `public/illustrations/cardio/` : +14 (Alerte VITE/infarctus/atypiques, artère fumeur/arrêt,
  automesure).
- `infarctus-atypique-nausees.png` déposé mais **orphelin** : la carte correspondante avait été
  retirée du code cardio M10 le 2026-07-24 (gate `G-M10-nausées`, chantier `refonte-audit-2026-07`).
  Fichier inutilisé, aucune action requise sauf si Thibault souhaite la restaurer.
- `src/features/cardio/manger/MangerModule.tsx` : import `Flame` retiré, remplacé par
  `REPERE_ICONS` (map id → `LucideIcon`) ; classes CSS `.flameAmi`/`.flameLimiter` renommées
  `.repereIconAmi`/`.repereIconLimiter` (`MangerModule.module.css`).
- N1 (navigateur in-app) et N2 (Thibault) validés le 2026-08-06 pour les 41 illustrations. Les
  icônes de repères restent à valider visuellement par Thibault (juste déployées).
- Plans `enrichissement-visuel-2026-07` (6/6 sessions) et `refonte-audit-2026-07` (8/8 sessions)
  intégralement clos.

### Impact IA
Aucun — dépôt d'assets statiques + swap d'icônes, aucune logique métier touchée. Gate systématique
(`tsc -b --noEmit`, `npm run build`, `npm test` 127/127) verte avant et après.
