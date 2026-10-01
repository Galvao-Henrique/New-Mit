import { expect, test, type Locator, type Page } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 } });

/** Abre a página e espera a hidratação (o efeito do mapa marca aria-pressed nas peças) e os efeitos dos contadores. */
async function abrirHidratada(page: Page) {
  await page.goto('/');
  await expect(page.locator('#peca-pa')).toHaveAttribute('aria-pressed', 'false');
  await page.waitForTimeout(300);
}

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
    await abrirHidratada(page);
    await page.evaluate(() => document.querySelector('#essencia')?.scrollIntoView({ behavior: 'instant' }));
    // Leitura única, sem espera: com movimento reduzido nunca houve um valor intermediário.
    const textos = await page.evaluate(() =>
      [...document.querySelectorAll('#essencia [data-contador]')].map((el) => el.textContent),
    );
    expect(textos).toEqual(['50 anos', '+20', '+100']);
  });
});

test('contadores animam até o valor final, passando por valores intermediários', async ({ page }) => {
  // Relógio falso instalado antes da página: o tempo só anda quando o teste manda.
  await page.clock.install();
  await abrirHidratada(page);
  const contadores = page.locator('#essencia [data-contador]');
  // Abaixo da tela na montagem: o contador já foi a 0.
  await expect(contadores.first()).toHaveText('0 anos');
  await page.evaluate(() => document.querySelector('#essencia')?.scrollIntoView({ behavior: 'instant' }));
  await page.clock.runFor(400);
  // A animação dura 1,2s: aos 400ms o valor está entre 0 e 50.
  const meio = Number.parseInt((await contadores.first().textContent()) ?? '', 10);
  expect(meio).toBeGreaterThan(0);
  expect(meio).toBeLessThan(50);
  await page.clock.runFor(1500);
  await expect(contadores.first()).toHaveText('50 anos');
  await expect(contadores.nth(1)).toHaveText('+20');
  await expect(contadores.nth(2)).toHaveText('+100');
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

/** Confere o link externo: nova aba, e o nome acessível começa pelo texto visível e avisa uma única vez. */
async function conferirLinkExterno(link: Locator, visivel: string) {
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
  await expect(link).toContainText('(abre em nova aba)');
  const texto = (await link.evaluate((el) => el.textContent ?? '')).trim();
  expect(texto.startsWith(visivel)).toBe(true);
  expect(texto.split('(abre em nova aba)')).toHaveLength(2);
  await expect(link).toHaveAccessibleName(new RegExp(`^${visivel.replace(/[()+]/g, '\\$&')}.*\\(abre em nova aba\\)`));
}

test('links externos abrem em nova aba com aviso acessível', async ({ page }) => {
  await page.goto('/');
  const casos = [
    {
      link: page.locator('#inicio').getByRole('link', { name: /^Cotação pelo WhatsApp/ }),
      visivel: 'Cotação pelo WhatsApp',
    },
    {
      link: page.locator('#contato').getByRole('link', { name: /^Chamar no WhatsApp/ }),
      visivel: 'Chamar no WhatsApp',
    },
    { link: page.locator('footer').getByRole('link', { name: /^Rua Adolpho Goll/ }), visivel: 'Rua Adolpho Goll' },
    { link: page.locator('footer').getByRole('link', { name: /^\(12\) 99705-2003/ }), visivel: '(12) 99705-2003' },
  ];
  for (const { link, visivel } of casos) await conferirLinkExterno(link, visivel);

  // Ícone do WhatsApp no topo: sem texto visível, o aviso vai no aria-label.
  const icone = page.locator('header').getByRole('link', { name: 'Falar no WhatsApp (abre em nova aba)', exact: true });
  await expect(icone).toHaveAttribute('target', '_blank');
  await expect(icone).toHaveAttribute('rel', /noopener/);
});

test('Enviar pelo WhatsApp avisa que abre em nova aba', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'mitata-site-cotacao',
      '{"state":{"itens":[{"corteSlug":"moela","nome":"Moela","subcategoria":"Aves"}],"observacao":""},"version":1}',
    ),
  );
  await abrirHidratada(page);
  await page.locator('header [data-cotacao-topo]').click();
  const painel = page.getByRole('dialog', { name: 'Sua lista de cotação' });
  await conferirLinkExterno(painel.getByRole('link', { name: /^Enviar pelo WhatsApp/ }), 'Enviar pelo WhatsApp');
});

test('textos revisados de Compromisso e Como comprar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sobre')).toContainText('Entregamos todos os dias, em todo o Vale do Paraíba.');
  await expect(page.locator('#contato')).toContainText('diga de quais cortes precisa');
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
