# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional-audit.spec.js >> parcours fonctionnel desktop
- Location: .audit-temp\functional-audit.spec.js:17:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Voir les substituts/ })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - button "Retour" [ref=e5] [cursor=pointer]:
      - img [ref=e6]
    - heading "Les composantes de l'addiction" [level=1] [ref=e8]
    - button "Sources" [ref=e10] [cursor=pointer]:
      - img [ref=e11]
      - generic [ref=e13]: Sources
  - generic [ref=e15]:
    - paragraph [ref=e16]: L'addiction au tabac a trois dimensions imbriquées. Cliquez un cercle pour l'explorer.
    - paragraph [ref=e17]: De quoi parle-t-on ? — Comportementale
    - generic [ref=e18]:
      - 'img "Trois cercles qui se chevauchent : physique, psychologique et comportementale"':
        - generic:
          - generic: Physique
          - generic: Manque · Irritabilité
        - generic:
          - generic: Psychologique
          - generic: Stress · Anxiété
        - generic:
          - generic: Comportementale
      - paragraph: Ces dimensions s'alimentent entre elles
      - button "Dimension Physique" [ref=e19] [cursor=pointer]
      - button "Dimension Psychologique" [ref=e20] [cursor=pointer]
      - button "Dimension Comportementale (sélectionnée)" [active] [pressed] [ref=e21] [cursor=pointer]
      - generic: Café-clope
      - generic: Après les repas
      - generic: En pause
      - generic: En voiture
      - generic: Avec le téléphone
      - generic: En social
      - generic: Avec l'alcool
    - generic [ref=e22]:
      - generic [ref=e23]:
        - generic [ref=e25]: Comportementale
        - generic [ref=e26]: →
        - generic [ref=e27]: "Symptômes :"
        - generic [ref=e28]: Café-clope · Après les repas · En pause · En voiture · Avec le téléphone · En social · Avec l'alcool
      - generic [ref=e29]:
        - generic [ref=e30]: "Stratégies :"
        - generic [ref=e31]: Repérer les automatismes et les associations pour les rompre progressivement. · Modifier les routines et les contextes favorables à la cigarette.
    - generic [ref=e32]:
      - paragraph [ref=e33]: Outils & stratégies — Comportementale
      - generic [ref=e35]:
        - paragraph [ref=e37]: Repérer les automatismes et les associations pour les rompre progressivement.
        - generic [ref=e38]:
          - paragraph [ref=e39]: Modifier les routines et les contextes favorables à la cigarette.
          - button "Gérer le craving autre module" [ref=e40] [cursor=pointer]:
            - generic [ref=e41]: Gérer le craving
            - generic [ref=e42]:
              - img [ref=e43]
              - text: autre module
```

# Test source

```ts
  1   | import { test, expect } from 'playwright/test';
  2   | import fs from 'node:fs';
  3   | 
  4   | const URL = 'http://127.0.0.1:5173/';
  5   | const report = { checks: [], console: [] };
  6   | 
  7   | function record(module, flow, passed, evidence) {
  8   |   report.checks.push({ module, flow, passed, evidence });
  9   |   fs.writeFileSync('.audit-temp/functional-results.json', JSON.stringify(report, null, 2));
  10  | }
  11  | 
  12  | async function openModule(page, name) {
  13  |   await page.goto(URL);
  14  |   await page.getByRole('button', { name }).click();
  15  | }
  16  | 
  17  | test('parcours fonctionnel desktop', async ({ page }) => {
  18  |   await page.setViewportSize({ width: 1440, height: 900 });
  19  |   page.on('console', message => {
  20  |     if (['warning', 'error'].includes(message.type())) report.console.push(`${message.type()}: ${message.text()}`);
  21  |   });
  22  |   page.on('pageerror', error => report.console.push(`pageerror: ${error.message}`));
  23  | 
  24  |   await page.goto(URL);
  25  |   await expect(page).toHaveTitle('ETP interactif');
  26  |   const homeCards = page.locator('main button, [class*=grid] button');
  27  |   const homeCardCount = await homeCards.count();
  28  |   record('Accueil', 'Afficher les sept choix', homeCardCount === 7, `${homeCardCount} cartes interactives`);
  29  | 
  30  |   const moduleNames = [
  31  |     "Les composantes de l'addiction",
  32  |     'La nicotine : cinétique & seuils',
  33  |     "La nicotine n'est pas le toxique",
  34  |     'Le piège du soulagement',
  35  |     'Utilisation des substituts & titration du patch',
  36  |     'Gérer le craving (4D)',
  37  |     'Explorer ma motivation',
  38  |   ];
  39  |   for (const name of moduleNames) {
  40  |     await openModule(page, name);
  41  |     await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  42  |     await page.getByRole('button', { name: 'Retour' }).click();
  43  |     await expect(page.getByRole('heading', { name: 'Sevrage tabagique' })).toBeVisible();
  44  |   }
  45  |   record('Navigation', 'Ouvrir puis quitter chaque module', true, '7/7 retours vers accueil');
  46  | 
  47  |   await openModule(page, "Les composantes de l'addiction");
  48  |   for (const dimension of ['Physique', 'Psychologique', 'Comportementale']) {
  49  |     const button = page.getByRole('button', { name: new RegExp(`Dimension ${dimension}`) });
  50  |     await button.click();
  51  |     await expect(button).toHaveAttribute('aria-pressed', 'true');
  52  |     await expect(page.getByText(new RegExp(`Outils & stratégies — ${dimension}`))).toBeVisible();
  53  |   }
> 54  |   await page.getByRole('button', { name: /Voir les substituts/ }).click();
      |                                                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  55  |   await expect(page.getByRole('heading', { level: 1, name: /Utilisation des substituts/ })).toBeVisible();
  56  |   await page.getByRole('button', { name: 'Retour' }).click();
  57  |   await expect(page.getByRole('heading', { level: 1, name: "Les composantes de l'addiction" })).toBeVisible();
  58  |   record('Addiction', 'Explorer les dimensions et poursuivre', true, '3 états actifs + navigation inter-module + retour contextuel');
  59  | 
  60  |   await openModule(page, 'La nicotine : cinétique & seuils');
  61  |   await page.getByRole('button', { name: 'Fumer une cigarette' }).click();
  62  |   await page.getByRole('button', { name: 'Poser un patch' }).click();
  63  |   await expect(page.getByText('Pic atteint : Confort')).toBeVisible();
  64  |   await expect(page.getByRole('button', { name: 'Retirer : Fumer une cigarette' })).toBeVisible();
  65  |   await page.getByRole('button', { name: 'Réinitialiser' }).click();
  66  |   await expect(page.getByRole('button', { name: 'Retirer : Fumer une cigarette' })).toHaveCount(0);
  67  |   record('Nicotine', 'Ajouter des prises, lire le seuil, réinitialiser', true, 'Confort atteint puis événements supprimés');
  68  | 
  69  |   await openModule(page, 'Utilisation des substituts & titration du patch');
  70  |   for (const form of ['Patch (24 h / 16 h)', 'Gomme', 'Pastille', 'Comprimé sublingual', 'Inhaleur', 'Spray buccal', 'Vapoteuse']) {
  71  |     await page.getByRole('button', { name: form }).click();
  72  |     await expect(page.getByRole('button', { name: form })).toHaveAttribute('aria-pressed', 'true');
  73  |     await expect(page.getByText(new RegExp(`${form.replace(/[()]/g, '\\$&')} — bonnes pratiques`))).toBeVisible();
  74  |   }
  75  |   const envie = page.getByLabel(/Envie de fumer persiste/);
  76  |   await envie.check();
  77  |   const plusQuarter = page.getByRole('button', { name: /\+ ¼/ });
  78  |   record('Substituts', 'Consulter toutes les formes et comprendre la titration', await plusQuarter.isEnabled(), '7/7 fiches renseignées; +¼ activé lorsque l’envie persiste');
  79  | 
  80  |   await openModule(page, "La nicotine n'est pas le toxique");
  81  |   const dependance = page.getByRole('button', { name: 'Dépendance' });
  82  |   await dependance.click();
  83  |   await expect(dependance).toHaveAttribute('aria-pressed', 'true');
  84  |   await page.getByRole('button', { name: /Nicotine/ }).click();
  85  |   await expect(page.getByRole('button', { name: /Fermer le détail/ })).toBeVisible();
  86  |   await page.getByRole('button', { name: /Substituts et vapoteuse/ }).click();
  87  |   await expect(page.getByRole('heading', { level: 1, name: /Utilisation des substituts/ })).toBeVisible();
  88  |   record('Nicotine ≠ toxique', 'Comparer, ouvrir un détail et poursuivre', true, 'Filtre dépendance, détail nicotine, lien de suite');
  89  | 
  90  |   await openModule(page, 'Le piège du soulagement');
  91  |   await page.getByRole('button', { name: 'Fumer une cigarette' }).click();
  92  |   await expect(page.getByText('soulagement du manque')).toBeVisible();
  93  |   const compare = page.getByRole('button', { name: 'Comparer au non-fumeur' });
  94  |   await compare.click();
  95  |   await expect(compare).toHaveAttribute('aria-pressed', 'true');
  96  |   await page.getByRole('button', { name: 'Réinitialiser' }).click();
  97  |   record('Soulagement', 'Déclencher, comparer, réinitialiser', true, 'Annotation, comparaison et remise à zéro répondent');
  98  | 
  99  |   await openModule(page, 'Gérer le craving (4D)');
  100 |   await page.getByRole('button', { name: 'Une envie arrive' }).click();
  101 |   await page.getByRole('button', { name: 'Différer' }).click();
  102 |   await expect(page.getByText(/Encore \d+ s/)).toBeVisible();
  103 |   await page.getByRole('button', { name: 'Passer 30 s' }).click();
  104 |   await expect(page.getByText("C'est passé.", { exact: true })).toBeVisible();
  105 |   await page.getByRole('button', { name: 'Distraire' }).click();
  106 |   await page.getByRole('button', { name: 'Décontracter' }).click();
  107 |   await page.getByRole('button', { name: 'Démarrer' }).click();
  108 |   await page.getByRole('button', { name: "De l'eau" }).click();
  109 |   await page.getByRole('button', { name: 'Une gorgée' }).click();
  110 |   record('Craving', 'Traverser la vague et utiliser les 4D', true, 'Minuteur, fin de vague, distraction, respiration et eau fonctionnels');
  111 | 
  112 |   await openModule(page, 'Explorer ma motivation');
  113 |   await expect(page.getByRole('tabpanel', { name: 'Où en êtes-vous ?' })).toBeVisible();
  114 |   await page.getByRole('tab', { name: 'Mes raisons' }).click();
  115 |   await expect(page.getByRole('tabpanel', { name: 'Mes raisons' })).toBeVisible();
  116 |   await expect(page.getByRole('tabpanel', { name: 'Où en êtes-vous ?' })).toBeHidden();
  117 |   const cardInput = page.getByDisplayValue('Ma santé');
  118 |   await cardInput.press('Enter');
  119 |   await expect(page.getByText('Ma santé', { exact: true })).toBeVisible();
  120 |   record('Motivation', 'Changer d’onglet et placer une raison au clavier', true, 'Panneau inactif masqué; placement sans glisser-déposer');
  121 | 
  122 |   record('Console', 'Absence d’erreurs applicatives', report.console.length === 0, report.console.length ? report.console : 'aucune erreur ni alerte');
  123 | });
  124 | 
```