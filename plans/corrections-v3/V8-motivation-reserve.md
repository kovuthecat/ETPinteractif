# V8 — Motivation : tableau plus grand + cartes en réserve · Modèle : Sonnet, effort : high

> Lire UNIQUEMENT ce fichier + les fichiers « Lire ». Design fixé par Opus. Doute → STOP.
> **Faire APRÈS V7** (onglet « Mes raisons » déjà en place).

- **Capture :** `corrections/Pas utilisable tel quel. Tableau plus grand. Cartes initialement hors du tableau. On place dedans les pertinentes..PNG`
- **Décision Thibault :** cartes en **réserve** ; on glisse les pertinentes dans le tableau ;
  retirer une carte la **renvoie au bac** (rien n'est perdu).

## But
Rendre le tableau « Mes raisons » réellement utilisable : **agrandir le tableau**, et faire
**démarrer les cartes hors du tableau** (une **réserve/bac**). L'utilisateur **glisse dans le
tableau** les raisons pertinentes ; une carte tirée hors du tableau **revient à la réserve**.

## Lire
- `src/features/motivation/MotivationModule.tsx`
- `src/features/motivation/MotivationModule.module.css`

## Modifier
- `src/features/motivation/MotivationModule.tsx`
- `src/features/motivation/MotivationModule.module.css`

## Hors périmètre
- Ne PAS ajouter de dépendance (drag natif via pointer events, comme l'existant). Zéro
  persistance. Ne pas toucher aux échelles (V7). Garder « + Une raison ».

## Conception (fixée)
- **Deux zones** : une **réserve** (bac, hors tableau) et le **tableau** (whiteboard) agrandi.
- **Modèle d'état** par carte : ajouter un champ de zone, ex. `placed: boolean` (dans la réserve
  vs sur le tableau). Les cartes `SEED_CARTES` démarrent **`placed: false`** (dans la réserve).
  Position `x/y` en % **relative au tableau** n'a de sens que si `placed`.
- **Réserve** : liste/grille compacte de cartes (chips lisibles), pas de position libre — juste
  une pioche. Chaque carte y est éditable (texte) ou au moins déplaçable vers le tableau.
- **Glisser réserve → tableau** : au drop dans le tableau, `placed=true` + calcul `x/y` au point
  de dépôt (réutiliser `pointerPct` sur le conteneur du tableau).
- **Glisser tableau → hors tableau** (drop hors des bornes) : `placed=false`, retour à la réserve.
- **Clavier / accessibilité** : conserver le déplacement flèches pour les cartes placées ;
  ajouter un moyen non-drag de placer/retirer (ex. bouton « Placer »/« Retirer » sur la carte)
  pour rester utilisable sans souris et au doigt. Cibles ≥ 44 px.
- **Agrandir** le `.whiteboard` (hauteur nettement supérieure, borné par `.content`).
- **« + Une raison »** : crée une carte — décider où : proposer **dans la réserve** (cohérent :
  on la placera ensuite) ; l'éditer sur place.

## Étapes
1. Étendre le type `Carte` avec `placed: boolean` ; `SEED_CARTES` → `placed:false`.
2. Rendre deux conteneurs : `.reserve` (cartes `!placed`) et `.whiteboard` agrandi (cartes `placed`).
3. Drag : au `pointerup`, déterminer si le point est dans le tableau → set `placed` + `x/y` ;
   sinon renvoyer à la réserve (`placed:false`).
4. Ajouter les boutons non-drag « Placer » / « Retirer » sur chaque carte (fallback clavier/tactile).
5. Conserver le nudge clavier (flèches) pour les cartes placées ; édition texte/detail inchangée.
6. `ajouterCarte` : créer la carte dans la réserve (`placed:false`), focus sur son input.
7. CSS : styles `.reserve`, cartes compactes de réserve, `.whiteboard` agrandi ; états lisibles.

## Validation
- **auto :** `tsc -b` + `vite build` OK.
- **visuel (→ VALIDATION.md) :** au départ, toutes les cartes sont dans la réserve, tableau vide
  et grand ; glisser une carte dans le tableau l'y fixe ; la ressortir la renvoie au bac ;
  « Placer »/« Retirer » fonctionnent sans souris ; « + Une raison » ajoute dans la réserve ;
  déplacement clavier OK pour les cartes placées ; utilisable au doigt.

## Si bloqué
Si le drag inter-zones au pointer natif est trop fragile (capture/hit-test) → s'appuyer d'abord
sur les boutons « Placer »/« Retirer » (interaction robuste) et garder le drag pour le
repositionnement **dans** le tableau. Signaler le choix dans VALIDATION.md. Doute → STOP.

## Commit
`feat(motivation): réserve de cartes + tableau agrandi, glisser pour placer/retirer (V8)`

## Statut
[ ] à faire
