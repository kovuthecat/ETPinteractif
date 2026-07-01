# PLAN corrections-v4 — Index   (rédigé par Opus)

> Lot issu de l'audit `AUDIT_UI_UX_PLAYWRIGHT.md` (Thibault, 2026-07-01). **Postérieur au lot
> v3** (V1–V8, appliqué). Ne re-traite PAS ce que v3 a déjà couvert (Venn agrandi, radial,
> cumul nicotine, masque craving, reformulation toxique, onglets + réserve motivation) : il
> **affine** et traite ce que l'audit ajoute. **Un fichier `.md` par correctif** : chaque
> exécutant ne lit QUE son fichier + les fichiers listés dans sa section « Lire ».

- **Date :** 2026-07-01 · **Rédigé par :** Opus · **Branche :** — (repo local, main)
- **Source :** `AUDIT_UI_UX_PLAYWRIGHT.md` (audit Playwright desktop, note globale 6,5/10).

## Convention de validation (toutes tâches)
- **Auto** = gate du commit (exécutant) : `tsc -b` + `vite build` (+ `vitest run` si la tâche
  touche `src/lib/`). `npm`/`node` absents du PATH dans cet env — utiliser `node_modules/.bin`
  via `/c/Program Files/nodejs/node.exe` (cf. STATUS.md) avant de déclarer l'auto indisponible.
- **Visuel** = responsabilité de Thibault, non bloquant : l'exécutant NE vérifie PAS le rendu
  (pas de navigateur/capture). Il reporte 1 ligne dans `VALIDATION.md` (quoi regarder /
  attendu) et continue.

## Invariants (rappel CLAUDE.md)
Zéro persistance · local-first · aucune dépendance runtime ajoutée · exactitude médicale
sourcée · sobriété + lisibilité à ~1 m · généricité multi-thèmes (rien de « tabac » dans le moteur).

## Deux priorités P0 (avant toute démonstration)
1. **A1 — Substituts « À compléter »** : les 7 formes affichent un placeholder (`FORMES_DATA`
   tout en « À compléter »). L'écran ressemble à une fiche clinique mais son contenu central est
   absent. Contenu détaillé = **autorité Thibault** (cf. `docs/contenu-modules.md` §Module 3-A,
   « à fournir »). → publier un contenu validé **ou** masquer honnêtement (pas de faux-semblant).
2. **A2 — Motivation, panneaux non masqués** : `.section { display: flex }` **écrase**
   l'attribut `hidden` (les règles d'auteur battent la règle UA `[hidden]{display:none}`). Les
   deux onglets s'affichent donc simultanément malgré `hidden={…}`. Correctif CSS 1 ligne.

## Correctifs
| ID  | Priorité | Module | Objet | Fichier |
|-----|----------|--------|-------|---------|
| A1  | **P0**   | substituts | Finaliser/masquer les fiches « À compléter » + rendre le bouton désactivé explicable | `A1-substituts-contenu.md` |
| A2  | **P0**   | motivation | Corriger le masquage des onglets (`.section[hidden]`) | `A2-motivation-masquage.md` |
| A3  | P1       | accueil | Grille intentionnelle : familles Comprendre / Agir / Se motiver, résumés lisibles | `A3-accueil-grille.md` |
| A4  | P1       | coquille | « Sources » en toutes lettres + focus clavier visible renforcé | `A4-affordances-sources.md` |
| A5  | P2       | addiction | Vocabulaire desktop (« Cliquez »), titre physique, légende couleur↔symptômes↔stratégies | `A5-addiction-desktop-legende.md` |
| A6  | P2       | nicotine | Consigne d'amorce + renommer « État actuel » → « Pic », lisibilité de la frise | `A6-nicotine-consigne-libelle.md` |
| A7  | P2       | nicotine-toxique | Garder la dépendance lisible dans les deux états ; ne pas reposer que sur rouge/vert | `A7-toxique-equilibre.md` |
| A8  | P2       | soulagement | Consigne de lecture en 2 temps + qualifier « stress » (tension liée au manque) | `A8-soulagement-lecture.md` |
| A9  | P2       | craving | Un outil activé juste après « Passer 30 s » affiche « C'est passé » trop tôt | `A9-craving-timing.md` |
| A10 | P2       | motivation | Cartes plus larges (titre entier), réserve non tronquée, sliders bornés 0/10 | `A10-motivation-cartes-sliders.md` |
| A11 | P2       | nicotine | Glisser-déposer les prises sur la frise (position = temps) | `A11-nicotine-drag-frise.md` |
| A12 | P2       | motivation | Placer/retirer les cartes par glisser-déposer (réserve ↔ tableau) | `A12-motivation-drag-drop.md` |

## Ordre recommandé
**A2 → A1** (P0 d'abord ; A2 est un one-liner CSS) → **A4 → A3** (coquille puis accueil) →
polissage par écran **A5, A6, A7, A8, A9, A10**. Puis les **drag-and-drop** : **A6 → A11**
(nicotine, A11 après A6) et **A2 → A10 → A12** (motivation ; A12 supprime les boutons Placer/
Retirer et suppose A10 fait). Modules indépendants sinon, ordre libre.

## Décisions d'interaction validées par Thibault (2026-07-01)
Deux changements d'**interaction** demandés par l'audit contredisaient des choix v3 : **Thibault
les a validés** → fiches A11 et A12 rédigées.
1. **Nicotine — drag-and-drop des items sur la frise** (audit §2) : on remplace le clic auto
   (`nextEventTime`) par un dépôt à la position choisie (temps). Un **fallback clic/clavier** est
   conservé pour l'accessibilité. → `A11`.
2. **Motivation — glisser-déposer réserve ↔ tableau** (audit §7) : on retire les boutons
   « Placer / Retirer » au profit du drag natif HTML5 (plus robuste que la capture pointeur
   inter-conteneurs qui avait fait échouer V8), avec **équivalents clavier** (Entrée = placer,
   Suppr = retirer). → `A12`.

## Suivi
Ajouter le bloc « Corrections v4 » dans `TASKS.md` ; mettre à jour `STATUS.md` en fin de lot.
