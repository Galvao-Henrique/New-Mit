import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 } });

test('Contato leva a Como comprar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Contato' }).click();
  await expect(page.locator('#contato')).toBeInViewport();
  const botao = page.locator('#contato').getByRole('link', { name: /^Chamar no WhatsApp/ });
  await expect(botao).toHaveAttribute('href', /^https:\/\/wa\.me\/5512997052003\?text=/);
});

test.describe('movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('contadores com movimento reduzido mostram o valor final', async ({ page }) => {
    await page.goto('/');
    await page.locator('#essencia').scrollIntoViewIfNeeded();
    const essencia = page.locator('#essencia');
    await expect(essencia.getByText('50', { exact: false }).first()).toBeVisible();
    await expect(essencia.getByText('+20')).toBeVisible();
    await expect(essencia.getByText('+100')).toBeVisible();
  });
});

test('contadores animam até o valor final', async ({ page }) => {
  await page.goto('/');
  await page.locator('#essencia').scrollIntoViewIfNeeded();
  await expect(page.locator('#essencia [data-contador]').first()).toHaveText(/50/, { timeout: 3000 });
  await expect(page.locator('#essencia [data-contador]').nth(1)).toHaveText('+20', { timeout: 3000 });
  await expect(page.locator('#essencia [data-contador]').nth(2)).toHaveText('+100', { timeout: 3000 });
});

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('sem JavaScript os contadores mostram o valor final', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const contadores = page.locator('#essencia [data-contador]');
    await expect(contadores.nth(0)).toHaveText(/50/);
    await expect(contadores.nth(1)).toHaveText('+20');
    await expect(contadores.nth(2)).toHaveText('+100');
  });
});

test('rodapé', async ({ page }) => {
  await page.goto('/');
  const rodape = page.locator('footer');
  await expect(rodape.getByRole('link', { name: 'Créditos das fotos' })).toHaveAttribute('href', '/creditos');
  await expect(rodape.getByRole('link', { name: 'Privacidade' })).toHaveAttribute('href', '/privacidade');
  await expect(rodape.getByRole('link', { name: /^Rua Adolpho Goll/ })).toHaveAttribute(
    'href',
    /^https:\/\/www\.google\.com\/maps/,
  );
  await expect(rodape.getByRole('navigation', { name: 'Rodapé' })).toBeVisible();
});

test('compromisso tem os quatro pilares', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sobre h3')).toHaveText([
    'Entrega diária',
    'Qualidade',
    'Seleção criteriosa',
    'Atendimento especializado',
  ]);
});
