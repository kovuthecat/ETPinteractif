# 2026-07-23 — Chantier enrichissement-visuel-2026-07 : finition visuelle & garde-manger

### Décision

Trois axes structurants pour la finition visuelle de l'app de consultation, émergents de l'audit
`rapport-audit-consultation-2026-07.md` (2026-07-23) :

1. **Prompts d'illustration ajoutés au HTML** (D1) : 23 nouveaux prompts dans
   `design/illustrations/prompts-illustrations-diabete.html` (6 `vf-*` tabac vrai/faux, 10 légumes
   garde-manger, 7 aliments-situations — thon, merguez, fromage, féta, olives, houmous, pois cassés)
   + 11 prompts Alerte cardio préexistants. Chaque aliment partagé copié dans `diabete/ ET cardio/`.
   **Génération des PNG : chantier Thibault (S6), pilotée par l'audit.**

2. **Enrichissement garde-manger appliqué aux DEUX thèmes** (D2) : rayon « Légumes » passant de
   brocoli+carotte à 12 items (tomate, courgette, aubergine, poivron, épinards, haricots-verts,
   oignon, gombo, potiron, chou) + 7 aliments-situations ; cardio enrichi aussi de 6 féculents
   culturels diabète (manioc, igname, banane-plantain, couscous-complet, dattes, galette-riz) par
   réutilisation PNG — aucun nouveau prompt. **Source partagée** : les nouvelles données = ordres de
   grandeur Ciqual/GI-GL dans `features/diabete/alimentation/data.ts` (`FOODS`) et
   `features/cardio/manger/data.ts` (`ALIMENTS_PLATEAU`), toutes marquées `// à revalider (Thibault)`.
   Invariant **aucun chiffre à l'écran** (paliers qualitatifs seuls) préservé.

3. **Presets « repas-types » : mécanique partagée, effets spécifiques par thème** (D4) : nouveau fichier
   `src/content/repas-types.ts` (source de vérité unique) exportant 5 presets (couscous-merguez,
   riz-poisson thiéboudienne, poulet-plantain, lentilles-œuf, petit-déj méditerranéen). Bouton
   « Charger un repas-type » dans les deux modules (`MangerModule` cardio, `AlimentationModule` diabète).
   Côté **cardio** : mappe vers `repFood` + `extras` + 3 frontières camembert (pré-remplit puis
   modifiable). Côté **diabète** : mappe vers l'assiette + déclenche `paramsFromAssiette`
   (courbe glycémie live, pédagogiquement riche). **Composition/proportions = ordres de grandeur**,
   marquées `// à revalider (Thibault)` — aucun verrouillage post-chargement. Zéro persistance.

4. **Garde-manger cardio passé d'une colonne empilée à des onglets par catégorie** (D2b) : même patron
   que diabète (`AlimentationModule`), 6 onglets (Légumes/Féculents/Protéines/Matières grasses/Fruits/
   Laitiers), une seule catégorie visible à la fois — absorbe naturellement l'enrichissement de 26 → 49
   aliments. Le défaut initial (Légumes) est le rayon enrichi.

5. **Écran de sélection de thème : icônes par thème + grille équilibrée** (D6) : ajout générique du
   champ `Icon: LucideIcon` à `ThemeDef` (moteur agnostique du nom de thème). Icônes implémentées :
   tabac = `CigaretteOff` (lucide), diabète = `Droplet`, cardio = `Heart`. Grille repositionnée à
   3 colonnes (ou 3 cartes alignées selon taille). `ThemeSelector` n'affiche que si ≥ 2 thèmes —
   usage mono-thème inchangé (pas de friction).

6. **Nettoyage du fichier de prompts (hygiène)** (V0-bis) : suppression de 71 prompts obsolètes
   (illustrations déjà générées et présentes dans `public/illustrations/**`), conservation de 23
   prompts existants + ajout de 11 cardio Alerte + 6 tabac vrai/faux. Le fichier HTML redevient
   fonctionnel (structure JS valide, aucun bruit de prompts périmés).

### Contexte

Chantier issu d'un audit visuel complet de l'app de consultation (navigation in-app, 2026-07-23).
L'ossature est déjà professionnelle (palette crème/serif, cartes-modules cohérentes, interactions
vivantes) ; les faiblesses sont localisées : illustrations manquantes (trous visuels), quelques
incohérences de finition, garde-manger sous-doté culturellement. Le plus gros levier « rendu pro »
est de finaliser les illustrations prévues (prompts écrits, génération à faire par Thibault). L'enrichissement
du garde-manger répond à un besoin réel : la population MSP Paris 20e (maghrébine/africaine/antillaise)
n'est pas représentée dans les deux thèmes avant ce chantier.

### Alternatives envisagées

- Attendre la génération Thibault avant de toucher aux data — écarté : les data peuvent référencer les
  aliments avant que leurs PNG existent (fallback `IllustrationSlot` placeholder) ; commencer les data
  et prompts en parallèle accélère sans risque de régression.
- Garde-manger cardio : ajouter une scrollbar sur une seule colonne — écarté : patron onglets
  (diabète) éprouvé, générique, évite le scroll; réutiliser plutôt qu'inventer.
- Presets repas-types : réutiliser directement les aliments déjà dans `FOODS` — partiellement faisable,
  mais la composition réelle (portions, mélange protéines+lipides) suppose de créer une abstraction
  aliment différente de `Food` seul ; nouveau fichier `repas-types.ts` (implicitement) sépare bien
  les deux concepts (aliments comme données, repas comme scénarios pédagogiques).
- Familles cardio (D5) : proposée mais non tranchée (gate **G-familles**). Repli sûr = garder la
  flamme unique, différencier au moins par une teinte ou une forme (décision plus tard si validée).

### Raison du choix

(1) et (2) répondent directement à l'audit : finir les illustrations prévues (zéro nouvelle mécanique,
prompts seulement) + enrichir la représentativité culturelle sans inventer de contenu. (3) et (4)
maximisent la réutilisabilité (une source partagée repas-types, un patron d'UI onglets) et la pédagogie
(la courbe glycémie se met à jour en direct au chargement d'un repas-type diabète). (5) et (6) sont
des finitions de polish (moteur générique, nettoyage hygiène).

### Conséquences

- **Champ `Icon` ajouté à `ThemeDef`** (`features/types.ts` + tous les thèmes dans `registry.ts`) —
  migration entièrement isolée (aucun impact modules métier).
- **Nouveaux fichiers créés** : `src/content/repas-types.ts` (partagé, aucun dépendance thème) ;
  aucune dépendance runtime ajoutée.
- **Data enrichies** : table `FOODS` (diabète, S1), table `ALIMENTS_PLATEAU` (cardio, S1) ; toutes les
  valeurs neuves `// à revalider`. Si Thibault ajuste les chiffres (après validation clinique),
  modification isolée des tables (pas de code logique impactée, sauf `paramsFromAssiette` si les
  paliers de CG changent drastiquement — peu probable).
- **Valeurs nutritionnelles marquées `// à revalider`** (17 aliments + 6 situations diabète, sel/graisses
  cardio, priorisation de brocoli/carotte/lentilles comme pépites pédagogiques) — **point de revue
  clinique incontournable avant clôture du chantier** (gate G-nutrition). Formellement, les ordres de
  grandeur sont viables au MVP (l'app tourne, interactivité fonctionnelle) mais la légitimité clinique
  en dépend.
- **Gates non tranchées** : G-nutrition, G-repas (composition + calibrage courbe), G-familles (approche
  picto). Sessions S5/S6 bloquées en conséquence, à débloquer parallèlement à la génération PNG.

### Impact IA

- Lire D1-D6 ci-dessus si modification ultérieure du garde-manger, choix de thème, ou
  repas-types — l'architecture est documentée explicitement.
- **Fichier `repas-types.ts`** : source unique, aucun duplication d'IDs ou de listes. Ne pas encoder
  de composition de repas ailleurs (les modules ne sont que des consommateurs).
- **Field `Icon`** sur `ThemeDef` : aucun contenu en dur dans les modules (iconographie reste générique).
  Un thème futur ajoute simplement une icône à son entrée `registry.ts`.
- Si Thibault demande un ajustement de plage de CG des aliments ou proportion d'un repas-type,
  modification purement tabulaire (données), pas de logique à revoir (sauf mention explicite).
