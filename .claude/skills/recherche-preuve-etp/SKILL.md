---
name: recherche-preuve-etp
description: Circuit de collecte de preuve pour un contenu pédagogique ETP — cadrage du besoin par item de module, prompt OpenEvidence posé en ligne de commande via Interface-OE, dépôt du rapport brut dans `docs/<theme>/evidence-<theme>/`, puis rédaction du doc d'autorité soumis à la gate G1. À dérouler avant d'écrire ou de modifier un contenu médical de module (nouveau thème, nouvel item, affinement), jamais pour du code ou du design.
---

# Collecte de preuve pour un contenu ETP

Ce circuit produit de la **source probante brute**, puis un **doc d'autorité** — jamais du contenu
affiché directement. Sortie obligatoire du circuit : la **relecture clinique de Thibault (gate
G1)**. Invariant 5 de `CLAUDE.md` : contenu sourcé, en cas de doute clinique signaler plutôt
qu'inventer.

Exemples déjà faits, à prendre comme gabarits :
`plans/insuline-affinements-2026-07/PROMPT-OPENEVIDENCE.md` (forme du prompt),
`docs/cardio/evidence-cardio/2026-07-21-rapport-openevidence-cardio-socle.md` (forme du rapport),
`docs/diabete/09-insuline-basale.md` §5 (ce que devient le rapport dans le doc d'autorité).

## Étape 1 — Cadrer le besoin, item par item

Avant toute question : lire le doc d'autorité du thème (`docs/contenu-modules-tabac.md`,
`docs/diabete/*` + `00-global.md` pour la grammaire commune, `docs/cardio/CONTENU_cardio.md`) et
**dire quel item de quel module** a besoin de quoi. Une question par item, nommée, numérotée.

Ne pas relancer une preuve déjà établie et validée dans le projet — la rappeler pour mémoire.

## Étape 2 — Écrire le prompt OpenEvidence

Le prompt porte **le cadre**, pas seulement la question. Non négociable, repris du gabarit :

- **Public et situation** exacts (ex. patient DT2 insulinorequérant, schéma basal-bolus).
- **Ce sont des messages d'éducation, jamais des posologies.** Les chiffres (délais, fenêtres,
  durées) servent à concevoir des paliers qualitatifs et **ne sont pas affichés au patient**.
- Demander de **signaler toute transposition hasardeuse** (DT1→DT2, adulte→sujet âgé…).
- Demander les **recommandations citées** (ADA, consensus ADA/EASD, HAS, SFD…) et les essais clés.
- Sous-questions numérotées, chacune reliée à l'item qu'elle doit servir.
- **Aucune donnée personnelle de patient** (invariant 1 : zéro donnée patient).

Déposer le prompt dans le plan en cours (`plans/<chantier>/PROMPT-OPENEVIDENCE.md`) quand le
chantier en a un — c'est la trace de ce qui a été demandé.

## Étape 3 — Poser la question par le CLI Interface-OE

Mode d'emploi complet, coût, codes de sortie, garde-fous : **`docs/OUTIL-INTERFACE-OE.md`**. À lire
avant le premier appel d'une session, il fait autorité sur les points ci-dessous.

**Demander l'accord de Thibault avant de poser** : chaque question est une vraie requête sur son
compte OE et son budget. Annoncer le nombre de questions prévues.

```bash
node "C:/Users/kovu/SynologyDrive/Thibault/Projets/Interface-OE/out/cli/index.js" demander "<prompt>" --output "docs/<theme>/evidence-<theme>/<date>-rapport-openevidence-<sujet>.md" --json
```

- Une question à la fois, **jamais deux appels en parallèle**. Un appel peut attendre plusieurs
  minutes (file d'attente + délai de rythme humain de 20–60 s) : ne pas couper, ne pas mettre de
  timeout court.
- **Code de sortie 3 = défi anti-robot : arrêt immédiat**, aucun réessai, aucune reformulation, la
  main à Thibault.
- Code 1 = réponse incomplète : le markdown le dit en tête, ne pas rédiger de contenu dessus sans
  vérification.
- Repli si le CLI est indisponible (routage inactif, code 3, code 4) : Thibault colle le retour à la
  main au même chemin. Le circuit continue à l'étape 4, inchangé.

## Étape 4 — Rédiger le doc d'autorité, en gardant la source séparée

Le rapport brut reste tel quel dans `docs/<theme>/evidence-<theme>/` — on ne le retouche pas.
Le contenu pédagogique s'écrit **à côté**, dans le doc d'autorité du thème, en citant le rapport et
la recommandation d'origine.

À signaler explicitement plutôt qu'à lisser :
- ce qu'OE n'a pas trouvé (« aucun ECR ») ;
- une transposition qu'OE a signalée comme hasardeuse ;
- un chiffre utile au calibrage interne mais **non affichable** au patient.

## Étape 5 — Gate G1, relecture clinique humaine

Aucun contenu issu de ce circuit ne part au code avant la validation de Thibault. La consigner
comme le chantier le prévoit (`docs/<theme>/VALIDATION.md`, ou `VALIDATION.md` à la racine pour un
point N2). Rien d'autre ne va dans `VALIDATION.md`.
