# Module 9 — Insuline basale (lente)

> **Statut : CONTENU SOURCÉ ET VALIDÉ par Thibault (soignant) le 2026-07-21 (gate G1).**
> Rôle de la lente OK · sûreté du message générique d'horaire (y compris glargine U100) OK.
> Ce document est le **doc d'autorité** du module 9 (créé le 2026-07-21, plan
> `insuline-affinements-2026-07/S1`). Le module 9 existe déjà (titration nocturne « lire la courbe
> du capteur »). Ce doc **rétro-documente** l'existant **et** cadre deux ajouts issus de la revue
> prod 2026-07-21 : le **rôle de la lente** (item 3) et la **régularité/horaire** (item 1).
> **Sources** : rapport OpenEvidence `evidence-diabete/rapport-insuline-affinement.txt` (§§1-2).
> Toute valeur chiffrée ci-dessous sert au **calibrage interne** ; **aucune n'est affichée au
> patient** (invariant module 9 : « on n'enseigne aucun nombre », bande-cible posée par le soignant).
> **G1 validée le 2026-07-21 → l'implémentation (S4) est débloquée.**

## 1. Objectif pédagogique

**Périmètre** : patient adulte **diabétique de type 2**, insulinorequérant, sous **insuline basale**
(seule ou en schéma basal-bolus). Le module fait comprendre **ce que règle la lente** et **comment
juger si elle est bien réglée**, sans jamais afficher de dose ni de chiffre.

Idées à faire comprendre :

1. **La lente freine la « fabrique de sucre » du foie** (item 3, neuf) — à jeun, la nuit et entre
   les repas, le foie produit du glucose ; la basale le freine. C'est le sucre *de fond*, distinct
   du sucre *des repas* (rôle de la rapide, module 10).
2. **Une injection couvre 24 h, sans à-coups** (item 3, neuf) — les analogues lents ont un profil
   **plat, sans pic** ; d'où une injection par jour.
3. **Sans lente (ou dose trop faible), la nuit dérive** (item 3, neuf) — le foie n'est plus freiné,
   la glycémie monte la nuit → **hyperglycémie au réveil** (amplifiée par le phénomène de l'aube).
4. **On juge la lente sur la glycémie à jeun / nocturne** (existant, cœur du module) — pas sur les
   glycémies après repas. C'est le repère d'auto-titration (baisser / laisser / monter la lente).
5. **Même heure chaque jour** (item 1, neuf) — la basale se prend à un moment régulier ; une
   certaine souplesse existe **selon l'insuline**, à caler avec le soignant.
6. **Sécurité** (existant) — surdosage = hypo (surtout nocturne / au réveil) ; « dans le doute, on
   ne monte pas, on traite l'hypo d'abord ».

## 2. Message clé (une phrase)

« La lente, c'est le frein du foie : elle tient le sucre de fond, jour et nuit — on la juge sur la
glycémie du matin à jeun, pas sur celles des repas. »

## 3. Déroulé pédagogique (existant + ajouts)

Le module reste **un écran unique** : intro courte → courbe du capteur (24 h, coucher → coucher) →
chips situations nocturnes + réglage de la lente (baisser / laisser / monter) → carte hypo → refrains.
Les ajouts s'insèrent **sans noyer** la titration (qui reste le cœur interactif).

**① Intro « à quoi sert la lente » (item 3, neuf, en amont de la courbe).** Une à deux phrases : la
lente freine le foie (sucre de fond, nuit / à jeun), ≠ les repas. Analogies validées (littératie
variable) : *robinet qui coule doucement, toujours pareil* (profil plat) ; *ancre qui empêche le
bateau de dériver la nuit* (sans lente, la nuit monte). Option non interactive : un aperçu « sans
lente, la nuit dérive » réutilisant le scénario `derive_haute` déjà présent (illustration, pas un
nouvel outil). // à revalider (Thibault) : garder le mini-visuel ou le texte seul.

**② Lire la courbe et régler la lente (existant, cœur).** Inchangé : la trace du capteur sur 24 h,
le segment nuit/à jeun ↔ la lente, les bosses post-repas ↔ le bolus, les 4 motifs nocturnes → décision
(baisser / laisser / monter) → la courbe se corrige. Refrain « dans le doute, on ne monte pas ».

**③ Régularité / horaire (item 1, neuf, bloc court).** Message générique **sans nommer de molécule** :
« Fais ton injection **à la même heure chaque jour**. Selon ton insuline, **une certaine souplesse**
est possible — cale les détails avec ton soignant. » Ne **jamais** promettre de flexibilité générale
(dangereux pour la glargine U100, la moins souple). // à revalider (Thibault) : libellé exact.

**Refrain de sécurité (existant)** : « Régler la lente, c'est un travail d'équipe avec votre soignant
— pas une décision à prendre seul. »

## 4. Règles « chiffrées » → paliers qualitatifs (jamais à l'écran)

- **Rôle / profil** : « frein du foie », « profil plat sans pic », « 24 h ». Notions qualitatives ;
  aucune demi-vie ni durée affichée.
- **Repère de titration** : la glycémie **à jeun** juge la basale (cible interne ~80-130 mg/dL selon
  ADA/AACE — **affichée comme une bande, pas un nombre**, cf. invariant module 9). Rythme de titration
  interne : ~2-3 j (glargine) / 3-5 j (dégludec) — **non affiché**, c'est le geste (« +1 cran ») qui
  compte, pas la fréquence chiffrée.
- **Signal de surbasalisation** (calibrage soignant, non patient) : écart coucher→jeûn > 50 mg/dL →
  penser « trop de basale, il manque de la rapide ». Peut nourrir un message qualitatif du type « nuit
  plate mais haute → c'est le repas/rapide, pas la lente » (déjà présent dans le module). // à revalider.
- **Souplesse d'horaire** (calibrage interne, jamais affiché) : glargine U100 = stricte (pas d'étude
  de flexibilité, label « même heure ») ; glargine U300 = ±3 h documenté ; dégludec = intervalles
  8-40 h testés. → à l'écran : **un seul message générique** + renvoi soignant (G2, tranchée 2026-07-21).
- **Oubli / double-dose** (calibrage interne) : oubli → dérive hyperglycémique (plus marquée U100 que
  dégludec) ; double-dose → **hypo prolongée** possible (action longue → récupération lente) → surveiller
  de près, glucose à disposition, contacter le soignant. // à revalider (Thibault) : opportunité d'un
  court message « oubli/double-dose » dans le module, ou renvoi soignant seul.

## 5. Sources (rapport OpenEvidence 2026-07-21, `evidence-diabete/rapport-insuline-affinement.txt` §§1-2)

### Rôle, profil plat, dérive nocturne (item 3)
- **ADA — Standards of Care 2026, §9** (dc26-S009) — approche pharmacologique, rôle de la basale.
- **Type 2 Diabetes: Outpatient Insulin Management.** Marrison et al., *Am Fam Physician* 2026;113(6):542-550
  — la glycémie à jeun juge la basale ; les post-prandiales relèvent de la rapide/oraux.
- **Bolli GB et al.**, *Diabetes Obes Metab* 2026 (glargine, 25 ans) — profil plat des analogues lents.
- **Home PD.** *Diabetes Obes Metab* 2025;27(S5):3-15 — vue d'ensemble de l'insulinothérapie (non-spécialiste).
- **Staehr, Basu et al.** — production hépatique de glucose ; cortisol/glucagon nocturnes (dérive/aube).
- **Peng, Allada, Cai et al.** — phénomène de l'aube (~50 % des patients ; contre-régulation matinale).

### Régularité / horaire, souplesse par molécule (item 1)
- **Consensus ADA/EASD 2022** (dci22-0034) — « plus de flexibilité d'horaire » avec les analogues récents.
- **Labels FDA** glargine U100 / glargine U300 (Toujeo) / dégludec (Tresiba) — « même heure chaque jour » ;
  dégludec : « n'importe quel moment », ≥8 h entre injections si oubli.
- **Riddle MC et al.**, *Diabetes Technol Ther* 2016 — U300 : ±3 h (EDITION 1 & 2) sans perte d'efficacité.
- **Meneghini L et al.**, *Diabetes Care* 2013 — dégludec Flex : intervalles 8-40 h, non-infériorité.
- **Haahr & Heise 2014 ; Owens et al. 2019** — PK/PD comparées (variabilité intra-jour, durées d'action).
- **Uchida et al.** *Diabet Med* 2018 — surdosage dégludec → hypo prolongée (demi-vie allongée).

**Limite** : rapport OpenEvidence non filtré par un professionnel choisi par Thibault ; recos SFD
non explicitement interrogées (principes ADA/EASD/AACE largement repris en Europe). **Thibault
(soignant) doit relire et valider (G1)** — en particulier la sûreté du message générique d'horaire
pour un patient sous glargine U100.

## 6. Ce qui n'est pas fait

Aucune implémentation. Le plan `insuline-affinements-2026-07/S4` réalise les ajouts (intro rôle +
régularité/horaire + pont vers le module 10) **après** validation G1. Cible technique : réutiliser
le scénario `derive_haute` (`glycemieCurve.ts`) pour l'aperçu « sans lente », sans nouvel axe interactif.
