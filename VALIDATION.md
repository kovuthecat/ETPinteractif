# VALIDATION.md — checklist visuelle / UX (passe humaine)

> Validation **visuelle** déléguée à Thibault, **non bloquante** pour les commits.
> Claude consigne ici (ne tente pas de vérifier lui-même : pas de navigateur).
> Dérouler en une session : `npm run dev`, puis cocher.
>
> Légende statut : [ ] à valider · [x] OK · [!] à corriger (décrire dessous).
> Rappel cadre : lisible à ~1 m, sobre, interactif (≠ diaporama).

## T2 — Types, registre, navigation
- [ ] Liste cliquable des 6 modules s'affiche.
- [ ] Chaque entrée ouvre son stub « À venir ».
- [ ] Retour à l'accueil possible depuis un module.

## T3 — Coquille / sources / carte
- [ ] (Vérifié indirectement en T4 — composants consommés par la carte.)

## T4 — Carte centrale (accueil)
- [ ] Grille de 6 cartes lisibles (icône + titre + résumé).
- [ ] Clic sur une carte ouvre le module.
- [ ] Retour fonctionne.
- [ ] Titre de page sobre (« Sevrage tabagique »).

## T6 — Module 2 : nicotine (bac à sable)
- [ ] Chaque bouton (cigarette / substitut ponctuel / vapoteuse) modifie la courbe en direct.
- [ ] Toggle « Patch » visible et actif.
- [ ] 2 seuils (LOW, HIGH) visibles + bande « zone confortable ».
- [ ] « Réinitialiser » remet à zéro.
- [ ] Mention « schéma illustratif » présente.

## T7 — Module 5 : le piège du soulagement
- [ ] Bascule « Non-fumeur / Fumeur » change la courbe.
- [ ] Non-fumeur = ligne plate calme ; Fumeur = yo-yo sous LOW.
- [ ] Message change avec la bascule (ton non culpabilisant).

## T8 — Module 1 : composantes de l'addiction
- [ ] 3 piliers (Physique / Psychologique / Comportementale) sélectionnables.
- [ ] 2 onglets par pilier (« De quoi parle-t-on ? » / « Outils »).
- [ ] Boutons de renvoi (`onNavigate`) ouvrent le bon module.

## T9 — Module 3 : substituts & titration
- [ ] Sélecteur des 7 formes ; panneaux « Bonnes pratiques » / « Erreurs fréquentes ».
- [ ] Partie B : patch en 4 quarts ; ajout/retrait de quart cohérent avec les toggles.
- [ ] Toggle Jour/Nuit (nuit ≤ jour).
- [ ] Message permanent « expérimentez, fiez-vous à votre ressenti ».
- [ ] Aucun dosage chiffré affiché.

## T10 — Module 4 : la nicotine n'est pas le toxique
- [ ] Deux colonnes (fumée vs nicotine).
- [ ] Bascule « dépendance » / « rend malade » met en évidence le bon groupe.
- [ ] Clic sur un item montre son rôle ; renvois fonctionnent.

## T11 — Module 6 : gérer le craving (4D)
- [ ] « La vague de l'envie » : repère parcourt la cloche en ~30 s ; états ça monte → pic → redescend → passé.
- [ ] Bouton replay ; pas de fuite après navigation (timer nettoyé).
- [ ] 4 cartes D dépliables ; « Décontracter » anime la respiration (inspire 4 s / expire 6 s).
- [ ] Aparté « Tabac Info Service 39 89 » discret.
