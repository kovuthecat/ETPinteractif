# Rapport d'audit — App de consultation (2026-07-23)

Audit visuel et pédagogique de **l'app de consultation** (3 thèmes : tabac 10 modules, diabète
10 modules, cardio 12 modules). Objectif fixé par Thibault : **rendu pro et esthétique partout**,
et **le visuel doit servir le propos pédagogique**. Proposition annexe : **enrichir le
garde-manger** pour la population suivie (MSP Paris 20e) et **illustrer différentes situations**.

**Méthode** : navigation réelle dans le serveur de dev (in-app browser) sur les 3 accueils + un
échantillon représentatif de modules (Cardio : Risque, Manger, Alerte ; Diabète : Alimentation ;
Tabac : Vrai/faux), croisée avec la lecture du code (data, couverture d'assets, fichier de prompts).
Le rendu pixel-par-pixel reste à valider par Thibault ; ce rapport porte sur ce qui est objectivable
(couverture d'illustrations, cohérence des patrons, contenu des data).

---

## Verdict global

**L'ossature est déjà professionnelle.** Palette crème/serif cohérente, cartes-modules homogènes
entre les 3 thèmes (tuiles d'icônes teintées par famille + exergue en italique), interactions
vivantes et réussies (cockpit de risque multiplicatif, camembert-assiette à 3 poignées, courbe
glycémie live). Ce n'est **pas** un diaporama.

Les faiblesses ne sont **pas diffuses** — elles sont localisées et de 3 natures :
1. **Illustrations manquantes** qui laissent des trous « inachevés » bien visibles ;
2. **quelques incohérences de finition** ;
3. **garde-manger sous-doté** (contenu).

Le plus gros levier « rendu pro partout » est de **finir les illustrations déjà prévues**.

---

## Constat 1 — Illustrations manquantes (levier n°1)

### 1a. 🔴 Cardio · « Reconnaître l'alerte » — 11 placeholders vides (grave)

Sur une **carte de survie** censée être « gros pictos, se lit sous stress », les 4 tuiles VITE
(Visage / Bras / Parole / Urgence) et les 7 signes d'infarctus (3 classiques + 4 atypiques) sont des
**rectangles crème vides** avec seulement le mot écrit. Vérifié à l'écran : l'onglet a l'air cassé.
Le bandeau rouge « 15 » est fort, mais le cœur visuel du module (un visage qui tombe, un bras qui ne
se lève pas…) est absent.

→ **Les 11 prompts existent déjà** (`design/illustrations/prompts-illustrations-diabete.html`,
sections `cardio-vite` / `cardio-inf` / `cardio-inf-atypique`, style `CARDIO`). Il ne reste qu'à
**générer les PNG** et vérifier le câblage (automatique via `IllustrationSlot`, id → fichier).
**Impact maximal, zéro rédaction.**

### 1b. 🟠 Tabac · « Vrai ou faux ? » — 3 cartes visiblement trouées (+3 latentes)

Vérifié à l'écran : au milieu d'une grille par ailleurs bien illustrée, les 3 cartes « poids »
(`vf-poids-coeur`, `vf-fumer-mince`, `vf-poids-regime`) apparaissent en **placeholders** (« Pren… »,
« Mieu… », « Il faut… ») et cassent l'homogénéité. 3 autres sont latentes (`vf-vape-aide`,
`vf-double-usage`, `vf-vapeur-eau`). Les prompts **n'existaient pas** → **6 prompts ajoutés au HTML
le 2026-07-23** (section `tabac-vf`, style `Tabac carré`). Reste à générer.

*Latent aussi : `benef-horizon` (dernier jalon de « Ce que l'arrêt répare ») — sans image dédiée.
Non prioritaire (concept d'horizon, pas un organe) ; prompt à écrire si on veut le combler.*

### Récapitulatif couverture

| Zone | Manquant | Prompts | Action |
| --- | --- | --- | --- |
| Cardio Alerte | 4 VITE + 7 infarctus | ✅ existants | **Générer** (Thibault) |
| Tabac Vrai/faux | 6 `vf-*` | ✅ **ajoutés 2026-07-23** | Générer (Thibault) |
| Tabac Bénéfices | `benef-horizon` | ❌ | Optionnel |
| Garde-manger | 10 légumes + 7 aliments-situations | ✅ **ajoutés 2026-07-23** | Générer (Thibault) |

*Diabète : couverture d'illustrations essentiellement complète — rien à signaler côté assets.*

---

## Constat 2 — Finitions de cohérence visuelle

- **Cardio · Manger, onglet « Familles »** : les 10 cartes-repères portent **toutes la même icône
  flamme** (verte/rouge). Monotone et pédagogiquement muet — la flamme ne distingue pas « huiles »
  de « légumes » de « sel ». → un **picto distinct par famille**. *Approche à valider (remplace la
  flamme) → gate G-familles.*
- **Écran « Choisir un thème »** : cartes 100 % texte (aucune icône), 3ᵉ carte orpheline sous 2
  autres. → ajouter l'icône-signature de chaque thème (déjà présentes ailleurs) + équilibrer la
  grille.
- **Cardio · artère de « Mon risque global »** : la coupe en anneaux concentriques est un peu
  abstraite. Fonctionne (l'interaction plaque/curseur est claire) — candidat non prioritaire à une
  illustration plus figurative. *À confirmer visuellement.*

---

## Constat 3 — Garde-manger sous-doté (→ demande d'enrichissement)

**Diagnostic — deux problèmes, un systémique :**

1. **Rayon « Légumes » indigent dans les DEUX thèmes** : seulement **brocoli + carotte** (vérifié
   dans les data `alimentation/data.ts` et `manger/data.ts`), alors que toute la pédagogie répète
   « ½ légumes ». La catégorie qu'on veut voir remplie est la plus pauvre du garde-manger. **Point
   le plus important.**
2. **Cardio en retard de diversité culturelle sur diabète** : diabète possède déjà manioc/attiéké,
   igname, banane plantain, couscous complet, galette de riz, dattes (cohérent avec la population
   MSP) ; cardio en est amputé (26 aliments vs 31, tous les items culturels en moins).

**Décidé avec Thibault (2026-07-23) :**
- Enrichissement retenu (la liste ci-dessous).
- Presets « repas-types » : **cardio ET diabète**.

**Enrichissement retenu :**

**① Légumes ×10 (les deux thèmes)** — tomate, courgette, aubergine, poivron, épinards, haricots
verts, oignon, **gombo (okra)**, **potiron/courge**, chou. *(prompts ajoutés au HTML)*

**② Diversité culturelle cardio** — copier les assets déjà générés côté diabète (manioc, igname,
banane plantain, couscous complet, dattes) vers `cardio/` + les ajouter à `ALIMENTS_PLATEAU`.
*Zéro illustration à générer, juste des lignes de data.*

**③ Aliments-situations** — thon en boîte, merguez/viande hachée, fromage, féta, olives, houmous,
pois cassés/niébé. *(prompts ajoutés au HTML)* — chacun porte un enseignement (sel de la conserve,
gras saturé du fromage vs insaturé de l'avocat…).

**④ Presets « repas-types » (nouveauté pédagogique, illustrer les situations)** — un bouton
« Charger un repas-type » pré-remplit l'assiette avec un plat réel à commenter, au lieu de partir
d'une assiette vide : couscous légumes-merguez, thiéboudienne/riz-poisson, poulet-plantain, sandwich
jambon-beurre, petit-déjeuner pain-beurre-confiture, plat végétarien lentilles-riz. Côté diabète, le
preset alimente aussi la courbe glycémie. *Liste + composition à figer par Thibault → gate G-repas.*

---

## Priorisation

| # | Action | Effort | Impact | Qui |
| --- | --- | --- | --- | --- |
| 1 | Générer les 11 illustrations Cardio Alerte | Faible | 🔴 Très fort | Thibault (prompts prêts) |
| 2 | Enrichir data garde-manger (légumes + culturel + situations, 2 thèmes) | Moyen | 🔴 Fort | Claude |
| 3 | Générer légumes ×10 + 7 aliments-situations | Moyen | 🔴 Fort | Thibault (prompts prêts) |
| 4 | Générer 6 `vf-*` tabac | Faible | 🟠 Moyen | Thibault (prompts prêts) |
| 5 | Presets « repas-types » (2 thèmes) | Élevé | 🟠 Fort | Claude + gate Thibault |
| 6 | Écran « Choisir un thème » (icônes + grille) | Faible | 🟡 Faible | Claude |
| 7 | Pictos distincts « Familles » cardio | Moyen | 🟡 Moyen | gate + prompts + Thibault génère |

**Plan d'exécution détaillé** : `plans/enrichissement-visuel-2026-07/index.md`.

**Gates à trancher par Thibault** : composition exacte des repas-types + calibrage glycémie diabète
(G-repas) ; approche « picto par famille » remplaçant la flamme (G-familles) ; valeurs
nutritionnelles des nouveaux aliments (G-nutrition, `// à revalider`).
