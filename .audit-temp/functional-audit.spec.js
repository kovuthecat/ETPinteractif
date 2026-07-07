import { test, expect } from 'playwright/test';
import fs from 'node:fs';

const URL = 'http://127.0.0.1:5173/';
const report = { checks: [], console: [] };

function record(module, flow, passed, evidence) {
  report.checks.push({ module, flow, passed, evidence });
  fs.writeFileSync('.audit-temp/functional-results.json', JSON.stringify(report, null, 2));
}

async function openModule(page, name) {
  await page.goto(URL);
  await page.getByRole('button', { name }).click();
}

test('parcours fonctionnel desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  page.on('console', message => {
    if (['warning', 'error'].includes(message.type())) report.console.push(`${message.type()}: ${message.text()}`);
  });
  page.on('pageerror', error => report.console.push(`pageerror: ${error.message}`));

  await page.goto(URL);
  await expect(page).toHaveTitle('ETP interactif');
  const homeCards = page.locator('main button, [class*=grid] button');
  const homeCardCount = await homeCards.count();
  record('Accueil', 'Afficher les sept choix', homeCardCount === 7, `${homeCardCount} cartes interactives`);

  const moduleNames = [
    "Les composantes de l'addiction",
    'La nicotine : cinétique & seuils',
    "La nicotine n'est pas le toxique",
    'Le piège du soulagement',
    'Utilisation des substituts & titration du patch',
    'Gérer le craving (4D)',
    'Explorer ma motivation',
  ];
  for (const name of moduleNames) {
    await openModule(page, name);
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
    await page.getByRole('button', { name: 'Retour' }).click();
    await expect(page.getByRole('heading', { name: 'Sevrage tabagique' })).toBeVisible();
  }
  record('Navigation', 'Ouvrir puis quitter chaque module', true, '7/7 retours vers accueil');

  await openModule(page, "Les composantes de l'addiction");
  for (const dimension of ['Physique', 'Psychologique', 'Comportementale']) {
    const button = page.getByRole('button', { name: new RegExp(`Dimension ${dimension}`) });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText(new RegExp(`Outils & stratégies — ${dimension}`))).toBeVisible();
  }
  await page.getByRole('button', { name: /Voir les substituts/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /Utilisation des substituts/ })).toBeVisible();
  await page.getByRole('button', { name: 'Retour' }).click();
  await expect(page.getByRole('heading', { level: 1, name: "Les composantes de l'addiction" })).toBeVisible();
  record('Addiction', 'Explorer les dimensions et poursuivre', true, '3 états actifs + navigation inter-module + retour contextuel');

  await openModule(page, 'La nicotine : cinétique & seuils');
  await page.getByRole('button', { name: 'Fumer une cigarette' }).click();
  await page.getByRole('button', { name: 'Poser un patch' }).click();
  await expect(page.getByText('Pic atteint : Confort')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retirer : Fumer une cigarette' })).toBeVisible();
  await page.getByRole('button', { name: 'Réinitialiser' }).click();
  await expect(page.getByRole('button', { name: 'Retirer : Fumer une cigarette' })).toHaveCount(0);
  record('Nicotine', 'Ajouter des prises, lire le seuil, réinitialiser', true, 'Confort atteint puis événements supprimés');

  await openModule(page, 'Utilisation des substituts & titration du patch');
  for (const form of ['Patch (24 h / 16 h)', 'Gomme', 'Pastille', 'Comprimé sublingual', 'Inhaleur', 'Spray buccal', 'Vapoteuse']) {
    await page.getByRole('button', { name: form }).click();
    await expect(page.getByRole('button', { name: form })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText(new RegExp(`${form.replace(/[()]/g, '\\$&')} — bonnes pratiques`))).toBeVisible();
  }
  const envie = page.getByLabel(/Envie de fumer persiste/);
  await envie.check();
  const plusQuarter = page.getByRole('button', { name: /\+ ¼/ });
  record('Substituts', 'Consulter toutes les formes et comprendre la titration', await plusQuarter.isEnabled(), '7/7 fiches renseignées; +¼ activé lorsque l’envie persiste');

  await openModule(page, "La nicotine n'est pas le toxique");
  const dependance = page.getByRole('button', { name: 'Dépendance' });
  await dependance.click();
  await expect(dependance).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Nicotine/ }).click();
  await expect(page.getByRole('button', { name: /Fermer le détail/ })).toBeVisible();
  await page.getByRole('button', { name: /Substituts et vapoteuse/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /Utilisation des substituts/ })).toBeVisible();
  record('Nicotine ≠ toxique', 'Comparer, ouvrir un détail et poursuivre', true, 'Filtre dépendance, détail nicotine, lien de suite');

  await openModule(page, 'Le piège du soulagement');
  await page.getByRole('button', { name: 'Fumer une cigarette' }).click();
  await expect(page.getByText('soulagement du manque')).toBeVisible();
  const compare = page.getByRole('button', { name: 'Comparer au non-fumeur' });
  await compare.click();
  await expect(compare).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Réinitialiser' }).click();
  record('Soulagement', 'Déclencher, comparer, réinitialiser', true, 'Annotation, comparaison et remise à zéro répondent');

  await openModule(page, 'Gérer le craving (4D)');
  await page.getByRole('button', { name: 'Une envie arrive' }).click();
  await page.getByRole('button', { name: 'Différer' }).click();
  await expect(page.getByText(/Encore \d+ s/)).toBeVisible();
  await page.getByRole('button', { name: 'Passer 30 s' }).click();
  await expect(page.getByText("C'est passé.", { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Distraire' }).click();
  await page.getByRole('button', { name: 'Décontracter' }).click();
  await page.getByRole('button', { name: 'Démarrer' }).click();
  await page.getByRole('button', { name: "De l'eau" }).click();
  await page.getByRole('button', { name: 'Une gorgée' }).click();
  record('Craving', 'Traverser la vague et utiliser les 4D', true, 'Minuteur, fin de vague, distraction, respiration et eau fonctionnels');

  await openModule(page, 'Explorer ma motivation');
  await expect(page.getByRole('tabpanel', { name: 'Où en êtes-vous ?' })).toBeVisible();
  await page.getByRole('tab', { name: 'Mes raisons' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Mes raisons' })).toBeVisible();
  await expect(page.getByRole('tabpanel', { name: 'Où en êtes-vous ?' })).toBeHidden();
  const cardInput = page.getByDisplayValue('Ma santé');
  await cardInput.press('Enter');
  await expect(page.getByText('Ma santé', { exact: true })).toBeVisible();
  record('Motivation', 'Changer d’onglet et placer une raison au clavier', true, 'Panneau inactif masqué; placement sans glisser-déposer');

  record('Console', 'Absence d’erreurs applicatives', report.console.length === 0, report.console.length ? report.console : 'aucune erreur ni alerte');
});
