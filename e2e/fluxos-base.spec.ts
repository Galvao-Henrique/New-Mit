import { expect, test } from '@playwright/test';

test('menu leva às seções', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Sobre' }).click();
  await expect(page.locator('#sobre')).toBeInViewport();
});

test('menu do celular abre e fecha', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  const dialogo = page.getByRole('dialog');
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole('link', { name: 'Cortes' }).click();
  await expect(dialogo).toBeHidden();
  await expect(page.locator('#cortes')).toBeInViewport();
});

test('topo fica sólido ao rolar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const topo = page.locator('header');
  await expect(topo).not.toHaveAttribute('data-solido', 'true');
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(topo).toHaveAttribute('data-solido', 'true');
});

test('pular para o conteúdo', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
});

for (const caminho of ['/', '/creditos', '/privacidade']) {
  for (const largura of [320, 390, 768, 1440]) {
    test(`nada passa da borda em ${caminho} a ${largura}px`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 900 });
      await page.goto(caminho);
      const cabe = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      expect(cabe).toBe(true);
    });
  }
}

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('sem JavaScript o conteúdo aparece', async ({ page }) => {
    // Sem JS o Chrome ignora loading="lazy" e baixa todas as fotos antes do `load`; o teste só precisa do DOM.
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const titulo = page.locator('h1');
    await expect(titulo).toBeVisible();
    await expect(titulo).toHaveCSS('opacity', '1');
  });
});
