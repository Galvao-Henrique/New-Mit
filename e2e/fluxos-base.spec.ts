import { expect, test, type Locator, type Page } from '@playwright/test';

/** Cor de fundo calculada do topo fixo ("rgba(0, 0, 0, 0)" = transparente). */
const fundoDoTopo = (page: Page) => page.locator('header').evaluate((el) => getComputedStyle(el).backgroundColor);
const TRANSPARENTE = 'rgba(0, 0, 0, 0)';

/** Opacidade que se vê: a do elemento vezes a de todos os ancestrais. */
async function opacidadeVisivel(alvo: Locator) {
  return alvo.evaluate((el) => {
    let opacidade = 1;
    for (let e: Element | null = el; e; e = e.parentElement) opacidade *= Number(getComputedStyle(e).opacity);
    return opacidade;
  });
}

/** Bloqueia os scripts do Next (o CSS, também em _next/static/chunks/, continua): a hidratação nunca acontece. */
async function bloquearScripts(page: Page) {
  await page.route(
    (url) => url.pathname.startsWith('/_next/static/chunks/') && url.pathname.endsWith('.js'),
    (rota) => rota.abort(),
  );
}

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
  await page.waitForFunction(() => (window as { __hidratado?: boolean }).__hidratado === true);
  await expect(page.locator('html')).not.toHaveAttribute('data-rolado');
  expect(await fundoDoTopo(page)).toBe(TRANSPARENTE);
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(page.locator('html')).toHaveAttribute('data-rolado', '');
  await expect.poll(() => fundoDoTopo(page)).not.toBe(TRANSPARENTE);
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

test.describe('scripts do Next com falha (sem hidratação)', () => {
  test('o conteúdo aparece mesmo assim', async ({ page }) => {
    await bloquearScripts(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const alvos = [
      page.locator('#titulo-hero'),
      page.locator('#titulo-compromisso'),
      page.locator('#contato').getByRole('link', { name: /^Chamar no WhatsApp/ }),
    ];
    for (const alvo of alvos) {
      await expect.poll(() => opacidadeVisivel(alvo), { timeout: 5_000 }).toBe(1);
    }
  });

  test('link direto para #contato: o topo já fica sólido', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await bloquearScripts(page);
    await page.goto('/#contato', { waitUntil: 'domcontentloaded' });
    // O script do <head> marca a rolagem antes do React (aqui, o React nunca chega).
    await expect(page.locator('html')).toHaveAttribute('data-rolado', '', { timeout: 5_000 });
    await expect.poll(() => fundoDoTopo(page), { timeout: 5_000 }).not.toBe(TRANSPARENTE);
  });
});
