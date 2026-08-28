# OUTIL-INTERFACE-OE.md — interroger OpenEvidence en ligne de commande

> **Interface-OE** est une application Electron séparée
> (`C:\Users\kovu\SynologyDrive\Thibault\Projets\Interface-OE`) qui tient une session
> OpenEvidence derrière un routage hors UE cloisonné, et expose un CLI. Ce fichier est son mode
> d'emploi **côté ETP interactif** : ce qu'on peut faire, à quel prix, et ce qu'on ne fait pas.
>
> **Autorité des règles d'usage d'OE : `<Interface-OE>/CLAUDE.md`** (rythme humain, jamais l'API
> interne, arrêt sur défi anti-robot). En cas de divergence, c'est lui qui gagne, pas ce fichier.

## Ce que ça change, et ce que ça ne change pas

**Change :** les prompts OE du projet (`plans/*/PROMPT-OPENEVIDENCE.md`, rapports de
`docs/cardio/evidence-cardio/`, `docs/*/evidence-*/`) n'ont plus besoin d'être collés à la main.
Claude peut poser la question lui-même et déposer la réponse **en markdown, directement dans
`docs/<theme>/evidence-<theme>/`**.

**Ne change pas :** un rapport OE est une **source probante brute**, pas du contenu validé. Il
alimente la rédaction des docs d'autorité, qui passent ensuite la **relecture clinique de Thibault
(gate G1)** avant tout code. Rien de ce qui sort du CLI ne va à l'écran sans ce passage. Invariant
5 de `CLAUDE.md` (exactitude médicale, signaler plutôt qu'inventer) s'applique tel quel.

## Prérequis

- L'application résidente **lancée** : le CLI la démarre au besoin (sauf `--no-launch`).
- Le **routage hors UE actif** et la **session OE connectée** — la connexion se fait à la main
  dans la fenêtre de l'application. Le CLI ne se connecte jamais, ne saisit jamais d'identifiant.
- Le CLI **empaqueté** : `<Interface-OE>/out/cli/index.js`. Absent ou daté → `npm run build:cli`
  dans Interface-OE.

## La commande

```bash
node "C:/Users/kovu/SynologyDrive/Thibault/Projets/Interface-OE/out/cli/index.js" demander "<question>" --output "docs/<theme>/evidence-<theme>/<date>-rapport-openevidence-<sujet>.md" --json
```

Le binaire `interface-oe` n'est **pas** sur le `PATH` : appeler `node` + le chemin absolu. Attention
au chemin du dépôt, qui contient une espace (« ETP interactif ») — guillemets obligatoires.

| Option | Effet |
|---|---|
| `--output <chemin>` | Écrit une **copie markdown autonome** de la réponse. Chemin relatif = relatif au répertoire courant, donc à ce dépôt. **Refuse d'écraser** un fichier existant. |
| `--conversation <id>` | Relance dans une conversation OE existante (question de suivi) au lieu d'en ouvrir une neuve. |
| `--json` | Sortie machine : `{ok, etat, conversation, sortie}`. |
| `--no-launch` | Interdit de démarrer l'application ; échoue tout de suite si elle ne répond pas. |

**Codes de sortie** — les lire, ils portent le sens :

| Code | Signification | Conduite |
|---|---|---|
| `0` | Réponse complète, archivée | Continuer |
| `1` | Réponse **incomplète** ou erreur d'écriture | Le markdown dit ce qui manque en tête ; ne pas rédiger de contenu pédagogique dessus sans vérifier |
| `2` | Arguments invalides | Corriger l'appel (aucune requête OE consommée) |
| `3` | **Défi anti-robot** | **STOP.** On ne réessaie pas, on ne reformule pas, on ne relance pas plus tard de sa propre initiative : on rend la main à Thibault |
| `4` | Application injoignable | Le dire, ne pas insister |

## Ce qu'on récupère

- **La copie `--output`** : markdown autonome — titre = la question, lien de la conversation, date,
  corps de la réponse, section `## Références`. Une extraction incomplète est signalée **en tête**
  (`⚠️ Extraction …`).
- **L'archive de référence**, écrite par l'application et par elle seule :
  `%APPDATA%\interface-oe\conversations\<date-heure-slug>\` avec `conversation.md`, `images/`,
  `meta.json`.
- **Les figures** : dans la copie `--output`, elles sont référencées en chemin **relatif**
  (`images/…`) et ne s'affichent donc pas depuis ce dépôt. Les fichiers sont dans le dossier
  d'archive ci-dessus ; les copier à la main si une figure sert à concevoir un visuel.

## Le coût, et la règle de politesse

- **Une question = une vraie requête OE** sur le compte personnel de Thibault, avec un risque de
  compte (CGU assumées, DataDome déjà déclenché une fois). Le budget de requêtes est le sien.
- **Demander avant de poser** : annoncer les questions prévues et leur nombre, attendre l'accord.
  Jamais de rafale décidée seul.
- **Jamais de parallélisme.** L'application sérialise tout et impose un délai aléatoire de
  **20 à 60 s après la fin** de chaque requête : un appel peut donc attendre plusieurs minutes
  avant même de partir (la position dans la file s'affiche). Ce n'est pas un blocage — ne pas
  couper, ne pas mettre de timeout court, ne pas lancer plusieurs CLI en même temps.
- **Grouper** les sous-questions dans un seul prompt : c'est déjà la forme des prompts du projet
  (une question numérotée par item de module, cadre rappelé en tête).
- **Aucune donnée personnelle de patient** dans une question (invariant 1 de `CLAUDE.md` :
  zéro donnée patient) — contexte clinique et question de conduite à tenir uniquement.

## Le cadre à rappeler à OE, à chaque fois

Repris des prompts déjà écrits (`plans/insuline-affinements-2026-07/PROMPT-OPENEVIDENCE.md`) et
non négociable ici : ce sont des **messages d'éducation, jamais des posologies**. Les chiffres
(délais, fenêtres, durées) servent à *concevoir des paliers qualitatifs* et **ne sont pas affichés
au patient**. Demander explicitement à OE de signaler toute transposition hasardeuse (DT1→DT2
par exemple), et de citer ses recommandations et essais.

## Où ça s'insère

Circuit : prompt (ici) → `--output` dans `docs/<theme>/evidence-<theme>/` → rédaction du doc
d'autorité du thème (`docs/contenu-modules-tabac.md`, `docs/diabete/*`, `docs/cardio/CONTENU_cardio.md`)
→ **gate G1, relecture clinique de Thibault** → code. Le skill `recherche-preuve-etp` déroule ce
circuit.
