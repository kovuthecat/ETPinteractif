# 2026-07-15 — Scopage de la persistance par contexte (consultation vs app patient)

### Décision

L'invariant #1 de `CLAUDE.md` (« zéro persistance ») s'applique désormais **à la consultation uniquement**.
Nouvelle architecture de persistance scopée :
- **Consultation** (bundle `consultation`) : zéro donnée stockée (localStorage, cookies, base, réseau). Interaction éphémère. La dose de titration pour le livret vit en mémoire de session (`SelectionContext`), jamais sur disque.
- **App patient** (bundle `patient`) : persistance locale **autorisée** — localStorage sur l'appareil du patient pour ses données personnelles (titration patch, carnet de suivi). Aucune donnée réseau. Bouton d'effacement et repli silencieux si stockage indisponible.

### Contexte

Deux usages distincts : consultation (poste partagé, données sensibles, sécurité RGPD maximale) vs app patient mobile (outil personnel du patient, données confidentielles sur son appareil). La décision initiale « zéro persistance partout » était surestrictive pour l'app patient.

### Alternatives envisagées

1. Persistance globale (localStorage partout) → risque RGPD en consultation sur poste partagé.
2. Zéro persistance partout → app patient inutilisable (patient ne peut pas conserver sa titration).
3. Backend synchronisé → viole l'invariant local-first et ajoute une dépendance réseau.

### Raison du choix

Maximiser l'utilité de l'app patient tout en préservant la sécurité de la consultation (contexte partagé). Les bundles sont isolés : aucune fuite de localStorage consultation vers patient ou vice-versa.

### Conséquences

- `src/patient/lib/storage.ts` : utilitaire localStorage typé + garde SSR/erreurs (storage indisponible gérée).
- Titration patch côté consultation : mémoire de session (`SelectionContext.titrationPatch`).
- Titration patch côté patient : localStorage (`etp.patient.titrationPatch`).
- Carnet de suivi patient : localStorage (`etp.patient.carnetConso`), liste d'entrées `{ id, dateHeure, contexte, ressenti }`.

### Impact IA

- Contexte : modéré (deux modèles de persistance à maintenir, bien délimités).
- Tests : storage.test.ts sur le repli (indisponibilité du stockage).
- Documentation : invariant #1 de CLAUDE.md amendé et scopé.

