## 2026-08-06 — Chantier `recette-outils-2026-08` clos : 6 gates tranchées, fiche auto, analyse croisée cardio, synthèse carnet, app patient en tuile

### Décision
Plan `plans/recette-outils-2026-08/` clos (8/8 sessions, 3 vagues) sur la base d'une recette
navigateur in-app du même jour ayant exercé 13 identifiants d'outils sur 14 du module tabac
« Stratégies & outils », les modules diabète Alimentation/Activité, cardio Manger/Bouger, et
l'app patient. Six gates tranchées avec Thibault avant tout code :

1. **G-fiche** — un outil de la boîte à outils tabac rejoint désormais automatiquement « Ma
   boîte à outils » dès qu'il porte du contenu personnalisé (SI…ALORS, tirelire, 4 checklists,
   phrase de refus), plus une case « Dans ma fiche » directe sur chaque tuile.
2. **G-baremes** — décroissance de la barre de protection cardio (module Bouger) adoucie
   (-45→-30/jour, seuils 60/25→55/20) pour que 2 jours de repos consécutifs restent vert/ambre,
   conforme au repère affiché « pas plus de 2 jours consécutifs ».
3. **G-assiette** — l'analyse d'équilibre cardio Manger croise désormais les proportions du
   camembert ET la variété d'aliments réellement déposés par catégorie-cœur (avant : un seul
   aliment par catégorie retenu, le dernier écrasait les précédents ; l'analyse ne lisait que le
   camembert).
4. **G-carnet** — le carnet de suivi patient affiche une synthèse à 3 agrégats (tranches
   horaires, 3 contextes les plus fréquents, total 7 jours glissants) dès 5 saisies sur la
   fenêtre.
5. **G-densite** — l'app patient bascule du tout-déplié (jusqu'à 8 cartes complètes par
   situation) à un patron tuile + détail : l'outil le plus pertinent reste déplié par défaut, les
   autres sont à un tap.
6. **Cible anti-ennui** — la checklist « La liste anti-ennui » (tabac) complétée à 10
   suggestions (elle n'en offrait que 6 pour une cible affichée de 10, un déficit permanent).

### Contexte
La recette a d'abord confirmé que les outils interactifs eux-mêmes étaient solides (minuteurs
réels, invites temporisées, calculs justes) — le travail restant portait sur la plomberie autour
d'eux et deux incohérences pédagogiques constatées en marche : composer 5 plans « SI… ALORS… »
laissait le compteur de fiche à `(0)`, et ajouter 6 légumes dans l'assiette cardio sans toucher
au camembert laissait « Pas assez de légumes » à l'écran — l'interface contredisait le geste du
patient.

### Alternatives envisagées
Pour G-assiette : lier l'analyse aux aliments en sacrifiant le camembert réglable à la main
(écarté — c'est lui qui porte la pédagogie des proportions, jumelle du défi 4 du diabète) ou
rendre la séparation des deux mécaniques juste plus lisible sans les croiser (écarté — ne
corrigeait pas la contradiction). Pour G-densite : limiter à 3 outils + « voir plus » (écarté,
choix éditorial fort sur quels outils passent devant) ou replier seulement le texte « Comment
faire » en accordéon (écarté, insuffisant sur la hauteur totale).

### Raison du choix
Reprendre au plus près les 3 exemples de grammaire de messages déjà esquissés au cadrage du plan
plutôt que d'inventer une taxonomie plus large (S4) ; garder le camembert manipulable partout où
une mécanique existante fonctionnait déjà (S4, S8) ; préférer l'automatisme réversible à un
contrôle purement manuel pour ne plus jamais perdre le travail du patient (S2).

### Conséquences
- `src/features/cardio/lib/protectionSemaine.ts`, `analyseAssiette.ts` et
  `src/patient/lib/carnetSynthese.ts` créés (logique pure, testée) — 14 tests unitaires ajoutés,
  aucun n'existait avant sur ces mécaniques.
- `src/content/activites.ts` créé : les 13 activités diabète/cardio, dupliquées verbatim
  jusque-là, sont désormais mutualisées (même patron que `repas-types.ts`/`tabac/substituts.ts`).
- 3 minuteurs (Vague/4D, MinuteurGuide bouger+surfer, RespirationGuidee) pausables — une
  interruption ne fait plus repartir de zéro.
- `outil-bouger` affiche une mention « à faire chez vous » en consultation (minuteur de 10 min
  inadapté au temps de consultation).
- App patient : cas le plus chargé (« Envie irrépressible », 8 outils) ramené de 5,7 à 1,3 écran
  sur mobile, sans reculer le bouton « Démarrer » du premier outil (y=644 inchangé).
- Finitions : mot « craving » retiré du bouton d'entrée de crise, redondance du message alcool
  retirée de Phrase de refus, référence CSS morte supprimée (défi Qualité diabète).
- Gate systématique verte tout du long (`tsc -b --noEmit`, `npm run build`, `npm test` — 127→153
  tests), aucune dépendance runtime ajoutée.
- 3 commits poussés sur `origin/main` : `0c991ae` (illustrations + G-familles, hors périmètre de
  ce plan), `c6b9339` (vague 1 : S1/S3/S6/S7), `d765d94` (vague 2 : S2/S4).

### Impact IA
Aucune logique IA dans ce projet (application statique sans backend) — sans objet.
