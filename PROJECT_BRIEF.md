# PROJECT_BRIEF.md

## Objectif du projet

Application web interactive servant de **support d'éducation thérapeutique du patient (ETP)** en consultation. Le soignant et le patient explorent ensemble, sur un même écran/tablette, des modules visuels et interactifs (et non un diaporama linéaire). Moteur **multi-thèmes** : trois thèmes livrés — **sevrage tabagique**, **diabète**, **prévention cardiovasculaire** (primaire). Une **app patient autonome** (atteinte par QR) prolonge le thème tabac hors consultation.

## Usage prévu

- Usage personnel : oui (outil professionnel du soignant)
- Usage local : oui (hors-ligne, poste/tablette de consultation)
- Déploiement prévu : oui — consultation déployée en statique sur Vercel (`etp-interactif.vercel.app`) ; hébergement de l'app patient non encore fixé
- Utilisateurs autres que moi : oui (les patients regardent en consultation et utilisent seuls l'app patient ; potentiellement d'autres soignants)

## Fonctionnalités MVP

1. **Sélection de thème** puis **carte de modules** par thème, navigable librement et dans n'importe quel ordre (non-linéaire) : tabac 10 modules, diabète 10, cardio 12.
2. **Modules interactifs visuels** (bacs à sable temps réel, courbes, silhouettes et artères illustrées, cartes cliquables) — le soignant commente, l'écran illustre.
3. **Saisies éphémères en consultation** : boîte à outils tabac (14 outils, dont tirelire, SI… ALORS…, checklists, 4D, respiration), motivation, plan d'arrêt — mémorisées en session (`SelectionContext`), jamais persistées.
4. **Fiches à emporter** imprimables A4 et **livret d'accompagnement** tabac, composés à partir des choix de la séance, sans stockage.
5. **App patient autonome** (`patient.html`, bundle séparé) : mes substituts (titration du patch), agir face à une situation (outils interactifs), carnet de suivi avec synthèse — données conservées sur l'appareil du patient uniquement.

## Hors périmètre v1

- Côté consultation : tout stockage de données patient (aucune persistance, aucune base, aucun compte).
- App patient : réseau, compte ou donnée patient dans l'URL/le QR (contenu générique, persistance locale seulement).
- Prévention cardiovasculaire secondaire (post-infarctus/AVC, réadaptation).
- Porte de navigation inter-thèmes (cardio → diabète/tabac) : simple mention informative.
- Balance décisionnelle (écartée au profit d'une motivation centrée sur le positif).
- Questionnaire de profilage imposé / parcours auto-adaptatif (navigation = choix libre par centres d'intérêt).
- Authentification, comptes, suivi longitudinal côté soignant.

## Stack technique

- Frontend : **Vite + React + TypeScript**, deux entrées Vite (`consultation.html`, `patient.html`) ; icônes `lucide-react`
- Backend : aucun (local-first, full statique)
- Base de données : aucune — consultation sans persistance ; app patient en `localStorage` sur l'appareil
- Authentification : aucune
- Hébergement : statique (Vercel) + exécution locale
- Autres services : aucun au runtime ; Vitest pour les tests (logique pure par thème)

## Contraintes et priorités

- **Persistance scopée** : consultation = zéro donnée stockée (état de séance en mémoire, réinitialisé au rechargement) ; app patient = `localStorage` local, effaçable, avec repli si indisponible ; jamais de réseau.
- Conçu pour un **écran partagé en consultation** : gros visuels, peu de texte, lisible à 1 m, le soignant garde la main.
- Doit fonctionner **hors-ligne** (polices et illustrations locales, aucune dépendance réseau au runtime).
- **Pile runtime figée** : aucune dépendance runtime ajoutée (ni routeur, ni lib de QR, d'animation ou de drag & drop).
- **Moteur agnostique** : `src/components/`, `src/features/types.ts`, `src/features/registry.ts` ne connaissent aucun thème ; chaque thème vit sous `src/features/<theme>/`, un dossier par module.
- **Bundle patient isolé** : il n'importe jamais de module de consultation ; contenu partagé via `src/content/`.
- Contenu médical **sourcé** (HAS, Tabac Info Service, Santé publique France, ESC ; preuves via OpenEvidence), avec une autorité de contenu par thème (`docs/contenu-modules-tabac.md`, `docs/diabete/`, `docs/cardio/`) validée par Thibault avant câblage ; toute valeur non validée est marquée `// à revalider (Thibault)`.

## Risques connus

- **Exactitude médicale du contenu** : nombreuses valeurs nutritionnelles/cliniques encore `// à revalider (Thibault)` ; sources affichées incomplètes (tabac 3/10 modules, cardio 0/12).
- **Tentation de surcharger** : retomber dans un « diaporama riche » ou dépasser l'écran (débordements résiduels à 1024×768) ; garder l'interactivité et la sobriété visuelle.
- **Validation humaine en retard** : plusieurs chantiers récents vérifiés au navigateur mais pas encore vus par Thibault en usage réel.
- **App patient non déployée** : l'URL encodée dans le QR des fiches et du livret est un placeholder — QR non fonctionnel tant que l'hébergement n'est pas fixé.
- **Duplication entre thèmes** : composants dupliqués par thème assumés (illustrations, artère, silhouette) ; la généralisation différée peut rendre les retouches transverses coûteuses.

---

## Roadmap / jalons

> Backlog opérationnel : `TASKS.md`.

### Vision

Un **support d'ETP interactif et non-linéaire** pour la consultation, sobre et visuel, où le soignant illustre ses explications module par module, décliné par thème, prolongé par une app patient autonome.

### MVP

- [x] Scaffolding Vite + React + TS, organisation feature-first par module
- [x] Carte/menu central des modules (non-linéaire, libre)
- [x] Moteur de module générique (`ModuleShell` : titre, sources, retour à la carte)
- [x] 6 premiers modules tabac (composantes, nicotine, substituts, nicotine ≠ toxique, soulagement, craving fusionné dans « Stratégies & outils »)
- [x] Build statique déployé (Vercel)
- [ ] Test hors-ligne sur tablette de consultation

### Version 1

- [x] Modules tabac complémentaires : motivation, plan d'arrêt, bénéfices de l'arrêt, vrai/faux, boîte à outils interactive (14 outils)
- [x] Fiches récap imprimables et éphémères + livret d'accompagnement tabac
- [x] Moteur multi-thèmes + thème diabète (10 modules, dont insuline basale/rapide)
- [x] Thème prévention cardiovasculaire (12 modules)
- [x] App patient autonome (substituts, situations, carnet de suivi)
- [ ] Sources médicales affichées pour chaque module (diabète complet ; tabac et cardio partiels)
- [ ] Déploiement de l'app patient (URL définitive + QR régénéré)

### Version 2 / idées futures

- [ ] Porte de navigation inter-thèmes réelle
- [ ] Prévention cardiovasculaire secondaire
- [ ] Mode plein écran / présentation
- [ ] Accessibilité renforcée (taille de police réglable)

### Critères avant ajout de feature

Une feature ne doit être ajoutée que si :

- sa complexité et son coût de maintenance restent proportionnés ;
- elle se découpe en tâches ciblées sans refactor global injustifié ;
- elle se documente clairement dans `PROJECT_MAP.md` ;
- elle préserve la généricité du moteur et l'absence de données stockées côté consultation.

### À éviter pour l'instant

- Stockage de données patient côté consultation, comptes, suivi longitudinal.
- Parcours auto-adaptatif / profilage imposé.
- Dépendances runtime (frameworks d'animation, routeur, lib de QR) tant que du CSS/SVG simple suffit.
