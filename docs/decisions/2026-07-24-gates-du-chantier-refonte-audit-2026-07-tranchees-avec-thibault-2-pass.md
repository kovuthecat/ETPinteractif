# 2026-07-24 — Gates du chantier refonte-audit-2026-07 tranchées avec Thibault (2ᵉ passe)

### Décision

Suite à une discussion directe avec Thibault le jour même de la 1ʳᵉ passe du chantier, les 4 gates
restées ouvertes sont tranchées :

1. **G-A8 (mécanisme CV tabac, M6) — validée « OK pour les 5 »**. Les 5 formulations patient
   proposées en S6 (paroi agressée, vasoconstriction/spasme, plaque accélérée, thrombose,
   réversibilité) sont acceptées telles quelles. Conséquence : câblage immédiat de l'objet interactif
   — remplace la bascule 2 états par un curseur 5 étapes sur l'artère héros partagée.
2. **G-Suivi (pré-cochage des mois passés, diabète Suivi) — tranchée « neutre »**. Les mois passés ne
   sont plus pré-cochés « fait » par défaut ; ils repartent à « à programmer », cohérent avec
   « couverture, pas bilan ». Le clic manuel pour cocher un mois reste inchangé.
3. **G-M10-nausées (signe atypique d'infarctus, cardio M10) — tranchée « à retirer »**. La carte
   « nausées isolées, sans autre signe » est retirée (jugée trop peu spécifique, risque de fausses
   alertes). Les nausées associées à d'autres signes (signes classiques) ne sont pas concernées.
4. **G-M7-taille (cohérence « tour de taille », cardio M7 vs M2) — tranchée « acceptable »**. Le
   bénéfice « Poids / tour de taille » reste affiché en M7 (bénéfice de l'activité, contexte différent
   du facteur de risque du cockpit M2 dont il a été retiré) ; aucun changement de code, seule
   l'annotation `// à revalider` est levée.

### Contexte

Ces 4 gates avaient été codées avec un défaut sobre ou laissées en attente lors de la 1ʳᵉ passe du
chantier `refonte-audit-2026-07` (2026-07-24 matin). Thibault a demandé le détail de chaque gate en
conversation, tranché les 4 en une fois, ce qui a permis d'enchaîner immédiatement le code correspondant
dans la même journée (2ᵉ passe, 3 sessions parallèles + 1 correctif direct).

### Alternatives envisagées

- G-A8 : garder la bascule 2 états et se contenter de documenter le mécanisme en texte (2ᵉ niveau au
  survol) → écarté par le choix de Thibault, qui voulait un objet réellement manipulable et pas un texte
  de plus.
- G-Suivi : ajouter un 3ᵉ état intermédiaire (« passé non renseigné » visuellement distinct de « à
  programmer » futur) → écarté pour rester simple ; le statut `'a_programmer'` déjà existant sert aux
  deux cas (mois futurs et mois passés non cochés), sans complexifier le modèle d'état.
- G-M10-nausées : reformuler plutôt que retirer (ex. « nausées associées à un malaise ») → écarté,
  Thibault a tranché pour un retrait net plutôt qu'une nuance qui aurait pu rester ambiguë.

### Raison du choix

Débloquer entièrement le chantier `refonte-audit-2026-07` en une seule journée plutôt que de laisser 4
gates trainer indéfiniment ; les 4 décisions sont courtes et n'entraînent pas de refonte, seulement des
changements ciblés dans des zones disjointes (parallélisables sans risque de conflit).

### Conséquences

- **`src/features/cardio/tabac/TabacModule.tsx`/`.module.css`** réécrits (bascule → curseur 5 étapes,
  réutilise `ArtereCoupe` sans duplication). `docs/cardio/CONTENU_cardio.md` §M6 : statut des 5
  formulations passé de « à revalider » à « validé Thibault 2026-07-24 ».
- **`src/features/diabete/suivi/logic.ts`** : `statusForMonth()` retourne `'a_programmer'` pour
  `month <= currentMonth` (au lieu de `'fait'` pour `month < currentMonth`) — comportement documenté en
  commentaire au-dessus de la fonction.
- **`src/features/cardio/alerte/AlerteModule.tsx`/`.module.css`** : `SIGNES_ATYPIQUES` réduit à 3
  entrées, grille réajustée (`repeat(3, 1fr)` desktop) ; fiche imprimable et
  `docs/cardio/CONTENU_cardio.md` §M10 mis à jour en cohérence.
- **`src/features/cardio/bouger/BougerModule.tsx`** : commentaire `// à revalider (Thibault)` remplacé
  par la trace de la décision actée, aucun changement fonctionnel.
- Toutes les gates du chantier `refonte-audit-2026-07` sont désormais tranchées ; seule S8 reste
  bloquée (dépend des PNG à générer par Thibault, sans rapport avec ces gates).

### Impact IA

- **`docs/cardio/CONTENU_cardio.md` §M6** fait foi : les 5 formulations du mécanisme CV tabac sont
  validées, ne plus les remettre en question sans une nouvelle décision explicite de Thibault.
- **`statusForMonth()`** (diabète Suivi) : si un futur besoin réclame de distinguer visuellement « mois
  passé non fait » de « mois futur », il faudra un nouvel état — ne pas réutiliser `'a_programmer'` à la
  légère pour un cas different sans vérifier l'impact sur le rendu du cadran.
- **`SIGNES_ATYPIQUES`** (cardio Alerte) : 3 entrées désormais la norme — ne pas réintroduire les
  nausées isolées sans nouvelle décision clinique de Thibault.

