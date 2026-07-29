# 2026-07-10 — Chantier `boite-a-outils` (BO1-BO9) : fusion Craving → Stratégies & outils + 5 décisions

### Décision ① — Fusion Craving → Boîte à outils, module renommé « Stratégies & outils »

**Décision**

Le module `craving` disparaît du registre tabac ; `boite-a-outils` (« Stratégies & outils ») prend sa
place exacte (famille `agir`, hue `vigilance`). L'outil vague/4D est **déplacé** (pas réécrit) dans
`boite-a-outils/VagueCraving.tsx` — mécanique et fiche « Ma carte anti-envie » inchangées — et devient
un outil parmi 14, filtrables par situation. `src/features/tabac/craving/**` est supprimé (BO2). Tous
les renvois `'craving'` du thème (portes de fin de module, Vrai/faux) sont retargetés vers
`'boite-a-outils'`.

**Contexte**

Rapport OpenEvidence « stratégies comportementales du sevrage » (`docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`) : la vague/4D n'est qu'une des nombreuses techniques comportementales
validées (contrôle du stimulus, plans si-alors, activité physique brève, respiration, plan de secours
après un écart…). Élargir le module unique en une boîte à outils filtrable par situation, plutôt que
d'ajouter des modules séparés.

**Raison du choix**

Regrouper les techniques comportementales en un seul lieu filtrable évite la prolifération de modules
et permet un couplage direct avec le repérage de situations du Module 1 (Composantes).

**Conséquences**

- `docs/contenu-modules-tabac.md` Module 6 renommé et réécrit (table des 14 outils + détail).
- Fiche « Ma boîte à outils » (nouvelle, BO2) s'ajoute aux 4 fiches X1-X5 existantes (5 au total).
- `src/features/registry.ts` (registre générique multi-thèmes) conserve une occurrence textuelle du mot
  « craving » dans sa description libre du thème tabac — signalée par S1, **hors périmètre BO1 et BO9**
  (ni l'un ni l'autre n'a ce fichier dans sa zone « Modifier ») : reportée ci-dessous comme point ouvert.

### Décision ② — Contexte de navigation générique (`unknown`) dans le moteur

**Décision**

`ModuleProps` gagne `{ onNavigate: (id, context?: unknown) => void; context?: unknown }` ; `App.tsx`
stocke ce contexte dans l'entrée d'historique et le restitue au module au rendu. Le moteur ne connaît
**jamais** la forme du contexte (`unknown` strict, aucun type « situations » dans `types.ts`/`App.tsx`) ;
chaque thème valide lui-même la forme reçue (ex. `parseSelectionSituations` côté tabac).

**Contexte**

Nécessaire pour transmettre la sélection de situations du Module 1 (Composantes) vers le Module 6
(Stratégies & outils) sans coupler le moteur générique à un thème.

**Raison du choix**

Respecte l'invariant multi-thèmes (#4 de CLAUDE.md) : un mécanisme de contexte de navigation
réutilisable par tout thème futur, sans dette de conception spécifique au tabac.

**Conséquences**

- `navigateToModule` accepte et propage `context` ; le retour arrière restaure la vue (id + contexte)
  mais **pas** le state interne du module appelé (ex. `AddictionModule` : la sélection de situations
  n'est pas restaurée après un retour arrière — comportement accepté et documenté, cf. S3).
- Réutilisable par le thème diabète ou tout futur thème sans modification du moteur.

### Décision ③ — Situations partagées `situations.ts`, colonne vertébrale Addiction ↔ Stratégies & outils

**Décision**

La liste canonique des situations du thème tabac (3 piliers, 20 situations, ids stables) vit dans
`src/features/tabac/situations.ts`, consommée par `addiction/AddictionModule.tsx` (sélection radiale)
et `boite-a-outils/BoiteAOutilsModule.tsx` (filtre + badges). Le module Composantes (Addiction) perd ses
anciens champs `exemples`/`outils` et son panneau latéral de navigation directe.

**Contexte**

Éviter la duplication de libellés entre le Module 1 (qui servait déjà de carte d'orientation avec des
`exemples` par pilier) et le nouveau Module 6 filtrable par situation.

**Raison du choix**

Une seule source de vérité pour les situations, partagée par les deux seuls modules qui en ont besoin
— pas une promotion au moteur générique (les situations sont spécifiques au thème tabac).

**Conséquences**

- `AddictionModule.tsx` devient une page de repérage pur (sélection radiale, sans description ni
  solution à l'écran) ; toute narration pédagogique reste portée par le soignant.
- Ajouter/retirer une situation ne touche qu'un seul fichier (`situations.ts`), consommé par les deux
  modules sans duplication de libellés.

### Décision ④ — Niveaux de preuve à l'écran limités à 2 mentions qualitatives

**Décision**

Aucun chiffre brut d'étude (OR, SMD, RR, IC) n'est jamais affiché côté patient. Le module Stratégies &
outils n'expose que 2 registres qualitatifs par outil : « Efficacité démontrée dans les études » /
« Recommandé par les experts du sevrage ». Les chiffres du rapport OpenEvidence (si-alors OR 1,70 ;
exercice aigu SMD −1,64 ; counseling infirmier RR 1,29 ; recyclage post-rechute OR 3,5 ; paradoxe
tabac-stress SMD −0,37/−0,27 ; etc.) ne vivent **que** dans `docs/contenu-modules-tabac.md` (Module 6)
et dans le rapport source `docs/evidence-tabac/2026-07-10-rapport-openevidence-sevrage.md`.

**Contexte**

Cohérent avec l'invariant déjà en vigueur pour les autres modules (aucune unité/valeur chiffrée à
l'écran, cf. décision transverse initiale du 2026-06-28) — étendu explicitement aux niveaux de preuve
scientifique, qui n'ont pas leur place dans un entretien de consultation.

**Raison du choix**

Un patient n'a pas besoin (et ne doit pas être exposé à) un intervalle de confiance pour être convaincu
qu'une technique fonctionne ; la mention qualitative suffit à la crédibilité pédagogique du soignant.

**Conséquences**

- `Preuve` (type dans `boite-a-outils/data.ts`) est une union à 2 valeurs (`demontree` / `experts`), pas
  un champ numérique.
- Toute évolution du rapport OE se répercute uniquement dans la documentation, jamais dans le code
  écran.

### Décision ⑤ — Vapoteuse réintégrée comme outil de réduction des risques (à revalider)

**Décision**

La vapoteuse redevient une **6ᵉ forme** du module Substituts (`FormeId`), avec un traitement visuel
distinct (badge « Réduction des risques », encart de statut « pas un médicament ») — revenant
partiellement sur la décision du 2026-07-08 qui l'avait retirée avec l'inhaleur. Elle reste absente du
bac à sable Nicotine (Module 2) et des formes ponctuelles (`FORMES_PONCTUELLES`) de la titration.
Contenu rédigé par Fable d'après HAS/HCSP + rapport OE, marqué `// à revalider (Thibault)`.

**Contexte**

Le rapport OpenEvidence et 3 nouvelles cartes Vrai/faux (BO4) documentent la vapoteuse comme outil de
réduction des risques reconnu (HCSP), distinct des substituts validés — cohérent avec la carte
`vf-vapoteuse` déjà existante. La garder hors du Module 3 devenait incohérent avec ce contenu.

**Raison du choix**

Traiter la vapoteuse avec la même rigueur que les 5 autres formes (bonnes pratiques/erreurs) tout en la
distinguant clairement d'un médicament, pour ne pas induire en erreur sur son statut.

**Conséquences**

- `SubstitutsModule.tsx` : 6 formes, badge et encart conditionnés à la sélection `vapoteuse`.
- `docs/contenu-modules-tabac.md` Module 3 mis à jour ; note « à revalider (Thibault) » conservée
  jusqu'à validation clinique.
- Chips substituts du Module 8 (Plan d'arrêt) : « Vapoteuse » ajoutée en cohérence (BO6).

### Décision ⑥ — Filtre « toniques uniquement » côté diabète : ne touche jamais la jauge

**Décision**

Le module diabète Activité physique gagne un interrupteur `toniquesUniquement` (défaut `false`) qui
filtre la **réserve** d'activités affichées (masque les activités d'intensité légère) sans jamais
retirer une activité déjà placée dans la jauge par le patient. Le calcul de la jauge (total, rayons)
reste strictement inchangé.

**Contexte**

Permettre au soignant d'adapter le discours au public (ne montrer que les activités modérées+ à un
public pour qui la marche légère n'est pas un levier suffisant) sans jamais effacer un choix déjà fait
par le patient — invariant "on ne retire jamais un choix du patient".

**Raison du choix**

Séparer strictement la vue « réserve filtrée » de la vue « jauge/total » évite tout risque de
resynchronisation incohérente entre les deux, et respecte la mécanique existante du module.

**Conséquences**

- `ActiviteModule.tsx` : nouveau mémo `reserveView` (filtré) distinct de `activitiesView` (source de
  vérité de la jauge, inchangé).
- `data.ts` du module diabète non modifié (aucune nouvelle activité/catégorie ajoutée).

### Points ouverts (à revalider Thibault)

- **Vapoteuse dans les substituts** (BO5) : technique d'utilisation rédigée par Fable à partir des
  positions HAS/HCSP et du rapport OE — à revalider avant usage en consultation.
- **Nouvelles cartes Vrai/faux** (BO4) : sources internationales (NEJM, Cochrane 2025, ACC, JAMA) en
  attendant un équivalent HAS/SPF — 11 cartes sur 21 marquées `// à revalider (Thibault)`.
- **Formulations patient des 14 outils** (BO2) : adaptées du rapport OE — ton et exactitude à juger à
  l'usage en consultation.
- **Occurrences résiduelles du mot « craving »**, hors périmètre de tout `S<k>.md` de ce chantier (donc
  non corrigées ici, signalées pour une éventuelle session future) :
  - `src/features/registry.ts` (registre générique multi-thèmes) — description libre du thème tabac
    (« … gérer le craving et la motivation. »), signalée par S1 dès BO1.
  - `src/features/tabac/nicotine/NicotineModule.tsx` — libellé texte « Craving » dans une liste de
    signes de manque (pas un id de navigation).
  - `src/features/tabac/plan-arret/PlanArretModule.tsx` — commentaire de code référençant l'ancien
    chemin `features/tabac/craving/CravingModule.tsx` (supprimé), signalé par S2 dès BO2.
  - Occurrences légitimes (non résiduelles, à conserver) : `situations.ts` (id `craving` de la
    situation « Envie irrépressible »), `boite-a-outils/data.ts` (mêmes ids de situation),
    `boite-a-outils/VagueCraving.tsx` (nom du composant/fichier, choix délibéré de BO2 pour rappeler
    l'origine du code déplacé), et les mentions physiologiques génériques dans le Module 2/5
    (`docs/contenu-modules-tabac.md`, antérieures à ce chantier).

**Décision**

Les points de navigation du module 10 affichent visuellement en 20 px (discrétion) mais imposent une
cible tactile **réelle** ≥44 px (conformité invariant CLAUDE.md) via une zone invisible `:before` en
`inset: -12px`. Le correctif a été appliqué en **post-session par l'orchestrateur** avant S7.

**Contexte**

CLAUDE.md prescrit « cibles ≥44 px ». Les points de navigation étaient initialement au-dessus de ce
seuil. Correction requise pour l'accessibilité tactile sur tablette.

**Raison du choix**

Conformité à l'invariant sans compromettre l'esthétique du module.

**Conséquences**

- Aucune autre modification du module requise.
- Le pattern (cible invisible > affichage) devient réutilisable pour d'autres modules si besoin.
- `VALIDATION.md` doit noter : « cibles du module 10 testées ≥44 px ».
