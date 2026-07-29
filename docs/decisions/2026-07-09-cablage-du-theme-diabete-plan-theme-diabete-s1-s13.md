# 2026-07-09 — Câblage du thème diabète (plan theme-diabete, S1-S13)

### Décision

Implémenter les **9 modules du thème diabète** fidèlement à la maquette Claude Design (handoff
2026-07-09) et à la SPEC pédagogique (`docs/diabete/SPEC_outil_ETP_diabete.md`). Cinq décisions
transverses :

1. **Modèle glycémie paramétrique testé** (remplace le score linéaire de la maquette) : lib
   `glycemieCurve.ts` (S2, 50 tests Vitest) modèle temporel physiologiquement plausible,
   temps réel en abscisse (minutes), niveau 0–100 (relative), avec invariants testés
   (repas mixte → pic adouci & retardé ; activité précoce → pic écrêté ; récupération 15 g
   → latence ~5 min ; overshoot à 2ᵉ prise ; TIR vivant avec bande du profil). Chaque module
   (2 Alimentation, 3 Activité, 8 Hypoglycémie, 9 Insuline) **consomme cette lib sans la
   modifier** — une seule identité courbe, rendue par `CourbeGlycemie` (S3).

2. **Silhouette SVG dessinée à la main** (pas d'image) : `Silhouette.tsx` (S3) corps humain
   stylisé, sobre, digne (pas de mannequin médical), avec ancres nommées (cerveau, yeux, cœur,
   cou, reins, nerfs, jambes, pied) + motif vaisseaux discret. États visuels (actif, ouvert,
   verrouillé, allumé, masqué) utilisés par modules 4 Risque cardiovasculaire, 5 Complications,
   7 Traitements, 6 Suivi.

3. **Convention IllustrationSlot + illustrations-diabete** : composant `IllustrationSlot` (S1)
   props `id` → `<img src="/illustrations/diabete/{id}.png">` + placeholder sobre
   (tuile crème, label gris). Convention d'ids slugifiés ASCII (`aliment-pomme`,
   `signe-tremblements`, `resucrage-jus`, etc.) dans `S1.md` ; illustrations générées par
   Claude Design → dépôt en `public/illustrations/diabete/` (zéro blocage si manquantes,
   placeholder affiché).

4. **Familles diabète** (définies dans `registry.ts`) : 3 familles (reprennent le pattern
   tabac Comprendre/Agir/Se motiver) — **Comprendre** (M1 Mécanisme, M4 Risque cardiovasculaire,
   M5 Complications), **Agir au quotidien** (M2 Alimentation, M3 Activité physique),
   **Se soigner** (M6 Suivi, M7 Traitements, M8 Hypoglycémie, M9 Insuline). Hues manuels par
   module (`nav`, `confort`, `toxique`, `vigilance`).

5. **Pas de police Caveat** (« effet manuscrit ») : remplacée par **Source Serif 4 italique**
   (cf. M7 Traitements champ molécule — l'italique serif substitue le manuscrit, déjà dans
   `tokens.css` et `global.css`). Aucune nouvelle police externe (constraint hors-ligne).

### Conséquences

- Lib `glycemieCurve.ts` spécifique au thème diabète, isolée dans `src/features/diabete/lib/`.
- 4 composants transversaux (S3) génériques diabète — s'ajoutent au moteur.
- Illustrations : convention d'ids fixée, génération en parallèle, rendu jamais bloqué.
- Vague 2 (S4-S12) : 9 agents parallèles, chacun seul écrivain de son module.

### Points ouverts (à revalider Thibault)

- Fréquences module 6 (ADA/HAS-SFD), seuils module 4, CG aliments module 2, phrases cliniques module 7.

### Impact IA

- Lire `docs/diabete/SPEC_outil_ETP_diabete.md` (autorité pédagogique) + `BRIEF_DESIGN_diabete.md`.
- `glycemieCurve.ts` : lib testée, jamais modifier sans revalider tests.
- Silhouette/CourbeGlycemie/PlaqueArtere/SignatureEvitable : composants moteur diabète, réutilisables.

