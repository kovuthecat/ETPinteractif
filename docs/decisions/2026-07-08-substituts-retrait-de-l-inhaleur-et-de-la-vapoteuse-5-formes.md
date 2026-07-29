# 2026-07-08 — Substituts : retrait de l'inhaleur et de la vapoteuse (5 formes)

### Décision

Le Module 3 (substituts & titration) ne propose plus que **5 formes** : patch, gomme, pastille,
comprimé sublingual, spray buccal. **Inhaleur** et **vapoteuse** sont retirés du sélecteur de formes.

### Contexte

Ces deux formes étaient les seules restées sans contenu validé (affichées « Fiche en cours de
rédaction — à voir avec votre soignant », état `enRedaction`). Plutôt que de rédiger leur contenu,
Thibault (autorité clinique) a tranché pour leur retrait lors du dépouillement des questions ouvertes
de `VALIDATION.md` (2026-07-08).

### Alternatives envisagées

- Rédiger le contenu bonnes pratiques / erreurs pour l'inhaleur et la vapoteuse → écarté par Thibault.
- Garder le repli « en rédaction » indéfiniment → écarté : laisse deux formes vides dans le sélecteur.

### Raison du choix

Un module qui ne présente que des formes à contenu validé ; suppression du mécanisme `enRedaction`
devenu inutile (code mort). Décision de l'expert clinique.

### Conséquences

- **Revient sur une décision antérieure du 2026-06-28** (« Substituts : toutes les formes + la
  vapoteuse ») pour le périmètre du Module 3. La vapoteuse **reste** un outil d'aide à l'arrêt à part
  entière et **demeure présente comme geste du bac à sable Nicotine (Module 2)** — seule sa présence
  comme « forme de substitut » du Module 3 est retirée.
- `SubstitutsModule.tsx` : type `FormeId` réduit à 5, `FORMES_DATA` idem, suppression du type
  `enRedaction`, de sa branche de rendu (`panelRedaction`) et des classes CSS associées
  (`formeCardMuted`, `panelRedaction`). `tsc -b` + `vite build` verts.
- `docs/contenu-modules-tabac.md` mis à jour (décision transverse, Module 3, données cliniques,
  « reste à fournir »).

### Impact IA

- `docs/contenu-modules-tabac.md` reste l'autorité : le Module 3 = 5 formes. Ne pas réintroduire
  inhaleur/vapoteuse comme formes sans une nouvelle décision de Thibault.
- **Question laissée ouverte** (signalée à Thibault) : faut-il aussi retirer la vapoteuse du bac à
  sable Nicotine (Module 2) et des renvois du Module 4, ou la démonstration de cinétique la garde-t-elle ?

