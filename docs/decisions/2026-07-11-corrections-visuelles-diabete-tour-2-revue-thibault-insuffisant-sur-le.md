# 2026-07-11 — Corrections visuelles diabète, tour 2 (revue Thibault, insuffisant sur les tailles → 6 causes-racines)

### Décision ① — LA COURBE : plancher de taille posé dans le composant partagé, pas par module

`CourbeGlycemie.module.css` (`.wrap`) gagne un plancher `min-width: 440px` au-dessus de 480px
de viewport (aucun plancher en dessous, pour ne jamais provoquer de débordement réel sur
mobile). Alternative écartée : augmenter au cas par cas le `max-width` de chaque conteneur
consommateur (`courbeCard` Alimentation, `graphCard` Insuline, `timingCard` Activité,
`courbeCard` Hypoglycémie) — écarté car le plan (index v2 §T4) demande explicitement une
« règle partagée » pour éviter de la dupliquer/oublier sur l'un des 4 modules qui réutilisent
le composant.

**Conséquences** — Quand le conteneur flex parent (ex. Alimentation défi ③, garde-manger à
côté) ne peut pas offrir 440px, l'ancêtre `flex-wrap` reflue (le garde-manger passe sous la
courbe) au lieu de laisser la courbe s'écraser. Complété par un plafond `.courbeCard`
760→900px propre à Alimentation (défis ③/④ pleine largeur, sans garde-manger, restaient
capés bien en-dessous de l'espace réel).

### Décision ② — Risque cardio ③ : bug corrigé au passage (plaque déposée sur les 3 territoires)

En agrandissant la silhouette (S1-v2), code review a révélé que l'overlay `plaque.png` se
déposait sur **les 3 territoires** (cou/cœur/jambes) dès qu'un feu passait au rouge, au lieu du
seul territoire sélectionné (`zoneActive`) — comportement demandé explicitement par le plan
tour 2 (#3) mais qui était en réalité déjà cassé avant même l'agrandissement. Corrigé en même
temps (`ZONES.filter` → lecture directe de `PLAQUE_OVERLAYS[zoneActive]`).

### Décision ③ — Traitements : panneau texte masqué en entier plutôt qu'eyebrow seul

Le plan demandait de « garder l'eyebrow, retirer le paragraphe » narratif de guidage
(« Cliquez "Voir l'effet"… »). Un eyebrow seul sans carte de contenu en dessous aurait laissé
un intitulé flottant sans rien à décrire tant qu'aucune ligne n'est sélectionnée — le panneau
entier (`eyebrow` + carte) est donc masqué dans ce cas précis, et ne réapparaît que comme
sortie d'une interaction réelle (ligne sélectionnée, vue d'ensemble). Les cas avec contenu
(y compris l'état vide « Écrivez une molécule… ») gardent l'eyebrow + texte inchangés.

### Décision ④ — Alimentation défi ②/③ : passe défensive, pas un fix de cause confirmée

Le débordement rapporté (captures #14/#15) n'a pas pu être reproduit avec certitude par calcul
manuel des largeurs flex (`ModuleShell` content ≈900px, `.layout`/`.stage`/`.shelf` — le calcul
ne fait ressortir aucun dépassement garanti aux résolutions cibles, `flex-wrap` devrait replier
plutôt que déborder). Faute de navigateur côté Claude (règle projet), le correctif appliqué
retire les largeurs fixes redondantes avec `flex-basis` (`.d2Card`, `.d3Slot` → `min-width: 0`)
— une passe défensive conforme aux bonnes pratiques CSS flex, **pas un fix ciblé sur une cause
unique identifiée**. Signalé comme point prioritaire de revalidation dans `VALIDATION.md` et
`S6.md` plutôt que présenté comme résolu.

**Impact IA** — Si Thibault confirme que le débordement persiste après cette passe, la cause
réelle reste à investiguer avec un audit Playwright (Codex) plutôt qu'une nouvelle passe de
calcul manuel côté Claude — cf. `WORKFLOW.md` §2 (audit visuel = toujours Codex, jamais Claude).

