# Architecture

## Priorités
1. Simplicité
2. Lisibilité
3. Maintenabilité
4. Testabilité
5. Extensibilité (multi-thèmes) seulement quand nécessaire

## Principe général

Application **statique, local-first, sans backend ni persistance**. Trois briques :

1. **Carte de modules** (accueil d'un thème) — point d'entrée, navigation libre.
2. **Moteur de module générique** — une coquille réutilisable qui affiche n'importe quel module
   (titre, contenu interactif, sources, bouton retour). Indépendant du thème.
3. **Modules de contenu** — chaque module est une feature isolée (composant + contenu + interactivité propre).

```text
Thème (tabac)
 └── Carte de modules
       └── Module (via moteur générique)
             ├── contenu visuel / schéma / animation légère
             ├── interaction éphémère éventuelle (saisie non persistée)
             └── sources médicales
```

## Modèle de données (en mémoire uniquement)

Aucune base. Les types décrivent la **structure du contenu**, pas des données patient :

```ts
type Theme = { id: string; titre: string; modules: ModuleDef[] };
type ModuleDef = {
  id: string;
  titre: string;
  resume: string;
  composant: ReactComponent;   // l'interactivité spécifique du module
  sources?: Source[];
};
```

L'état runtime (ex. valeur saisie dans un calculateur) vit dans le composant et **disparaît au démontage / rechargement**.

## Règles d'architecture
- Organisation **feature-first par module** ; dossiers globaux limités au réellement partagé.
- Pas d'abstraction avant besoin réel ; fichiers courts ; noms explicites.
- Le moteur de module ne doit **rien savoir** du tabac (généricité multi-thèmes).
- Animations : privilégier **CSS / SVG simples** avant toute lib d'animation lourde.
- Aucune brique de persistance ne doit être introduite (invariant projet).

## Accessibilité / ergonomie consultation
- Lisible à ~1 m : grandes typographies, contrastes élevés, cibles cliquables larges.
- Navigation au clavier/souris simple ; mode plein écran envisagé en v2.

## Garde-fous avant d'ajouter une abstraction
1. Le besoin est-il réel maintenant ?
2. La duplication est-elle réellement problématique ?
3. L'abstraction réduit-elle la complexité ou la déplace-t-elle ?
4. Claude Code pourra-t-il modifier la zone sans charger beaucoup de contexte ?
