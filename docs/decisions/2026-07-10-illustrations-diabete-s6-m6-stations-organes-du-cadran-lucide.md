# 2026-07-10 — Illustrations diabète S6 : M6 stations/organes du cadran → lucide

### Décision

Les 9 icônes de station de `SuiviModule.tsx` (`suivi-stethoscope`, `suivi-prise-de-sang`,
`suivi-organe-<protects>` × 7) passent d'`IllustrationSlot` (jamais générées, placeholders
permanents) à un composant local `StationIcon` (lucide dans un cadre neutre circulaire/arrondi),
avec deux ajustements par rapport au libellé de l'index §4 :

1. **`defenses` → `Syringe`** (pas `ShieldPlus`, pourtant aussi suggéré). Dans le code actuel,
   `defenses` n'est le `protects` que d'un seul examen (« Vaccins ») — il n'existe pas de slot
   séparé « défenses immunitaires » vs « vaccins » comme le laissait entendre la formulation à
   deux entrées de l'index (`défenses → ShieldPlus`, `vaccins → Syringe`). Une seule icône,
   choisie pour matcher l'examen concret vu par le patient.
2. **`pied` → `Footprints`**, absent de la liste de l'index (qui ne couvrait pas ce cas) — ajout
   évident, lucide propose une icône directement adaptée.

Rein et dentiste suivent la décision déjà actée dans l'index §4 : rein reste l'image
`organe-reins.png` (S1) faute d'icône lucide adaptée ; dentiste (protège « bouche ») → `Smile`.

### Contexte

Suite de S1-S5. Session indépendante (pas de dépendance sur la silhouette ou le pipeline
d'assets), portant sur le cadran/panneau de réglage/porte « Ce que ça garde » de M6 uniquement.

### Raison du choix

Minimiser l'écart avec l'intention du plan (mêmes familles d'icônes suggérées) tout en respectant
la structure de données réelle (`ProtectsId`, une seule dimension de clé pour l'icône) plutôt que
d'introduire une distinction vaccins/défenses qui n'existe nulle part ailleurs dans le code.

### Conséquences

- `IllustrationSlot` n'est plus importé dans `SuiviModule.tsx` ; les ids `suivi-*` ne sont plus
  référencés (aucune image `suivi-*.png` à produire — ils étaient de toute façon toujours restés
  au stade placeholder).
- Le cadran, l'aiguille et le centre (motif fil rouge, `dialCenter*`) restent des tracés SVG codés,
  inchangés.

### Impact IA

- Si Thibault souhaite distinguer vaccins de « défenses immunitaires » avec deux icônes, cela
  demande d'abord un changement de modèle de données (`ExamDef` ou une nouvelle clé), pas un
  changement purement visuel de `StationIcon`.
