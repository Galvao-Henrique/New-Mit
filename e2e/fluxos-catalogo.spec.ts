import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 } });

/** Abre a página e espera a hidratação (o efeito do mapa marca aria-pressed nas peças). */
async function abrir(page: Page) {
  await page.goto('/');
  await expect(page.locator('#peca-pa')).toHaveAttribute('aria-pressed', 'false');
}

const catalogo = (page: Page) => page.locator('#catalogo');
const cards = (page: Page) => catalogo(page).locator('h3');
const botaoTopo = (page: Page) => page.locator('header [data-cotacao-topo]');

async function adicionar(page: Page, nome: string) {
  await catalogo(page)
    .getByRole('button', { name: `Adicionar à cotação: ${nome}` })
    .click();
}

test('filtro Aves mostra 8 cortes', async ({ page }) => {
  await abrir(page);
  await catalogo(page).getByRole('button', { name: 'Aves', exact: true }).click();
  await expect(catalogo(page).getByRole('button', { name: 'Aves', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(cards(page)).toHaveCount(8);
  await expect(catalogo(page).getByText('8 cortes', { exact: true })).toBeVisible();
});

test('busca sem acento', async ({ page }) => {
  await abrir(page);
  await catalogo(page).getByLabel('Buscar corte').fill('figado');
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toHaveText('Fígado de Bovino');
  await expect(catalogo(page).getByText('1 corte', { exact: true })).toBeVisible();
});

test('busca vazia', async ({ page }) => {
  await abrir(page);
  const campo = catalogo(page).getByLabel('Buscar corte');
  await campo.fill('xyz');
  await expect(catalogo(page).getByText('Nenhum corte encontrado para “xyz”.')).toBeVisible();
  await catalogo(page).getByRole('button', { name: 'Limpar busca' }).click();
  await expect(cards(page)).toHaveCount(9);
  await expect(campo).toHaveValue('');
  await expect(campo).toBeFocused();
  await expect(catalogo(page).getByText('Mostrando 1–9 de 24 cortes', { exact: true })).toBeVisible();
});

test('corte sem foto própria mostra a silhueta e nenhuma imagem', async ({ page }) => {
  await abrir(page);
  const card = catalogo(page).locator('article', { has: page.getByRole('heading', { name: 'Boi Casado' }) });
  await expect(card.locator('[data-midia="silhueta"] svg[data-silhueta="bovinos"]')).toHaveCount(1);
  await expect(card.locator('img')).toHaveCount(0);
});

test('corte com foto própria continua com a foto', async ({ page }) => {
  await abrir(page);
  await catalogo(page).getByLabel('Buscar corte').fill('nuggets');
  const card = catalogo(page).locator('article', { has: page.getByRole('heading', { name: 'Nuggets de Frango' }) });
  await expect(card.locator('[data-midia="foto"] img')).toHaveCount(1);
  await expect(card.locator('svg[data-silhueta]')).toHaveCount(0);
});

test('adicionar e remover', async ({ page }) => {
  await abrir(page);
  await adicionar(page, 'Boi Casado');
  await adicionar(page, 'Pá de Boi');
  await expect(botaoTopo(page)).toContainText('Cotação (2)');
  await expect(page.getByText('2 itens na cotação')).toBeVisible();

  await page.getByRole('button', { name: 'Ver cotação' }).click();
  const painel = page.getByRole('dialog', { name: 'Sua lista de cotação' });
  await expect(painel).toBeVisible();
  await painel.getByRole('button', { name: /Remover Pá de Boi/ }).click();
  await expect(painel.getByText('Pá de Boi')).toHaveCount(0);
  await expect(botaoTopo(page)).toContainText('Cotação (1)');
});

test('lista persiste ao recarregar', async ({ page }) => {
  await abrir(page);
  await adicionar(page, 'Boi Casado');
  await botaoTopo(page).click();
  await page.getByLabel('Observação (opcional)').fill('teste');
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(botaoTopo(page)).toContainText('Cotação (1)');
  await botaoTopo(page).click();
  await expect(page.getByLabel('Observação (opcional)')).toHaveValue('teste');
});

test('link do WhatsApp', async ({ page }) => {
  await abrir(page);
  await adicionar(page, 'Boi Casado');
  await botaoTopo(page).click();
  await page.getByLabel('Observação (opcional)').fill('teste');
  const href = await page.getByRole('link', { name: 'Enviar pelo WhatsApp' }).getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/5512997052003\?text=/);
  const texto = decodeURIComponent(href!.split('?text=')[1]);
  expect(texto).toContain('• Boi Casado (Bovino Com Osso)');
  expect(texto).toContain('*Observação:* teste');
});

test('lista vazia mostra o convite para o catálogo', async ({ page }) => {
  await abrir(page);
  await botaoTopo(page).click();
  const painel = page.getByRole('dialog', { name: 'Sua lista de cotação' });
  await expect(painel.getByText('Sua lista está vazia.')).toBeVisible();
  await expect(painel.getByRole('link', { name: 'Enviar pelo WhatsApp' })).toHaveCount(0);
  await painel.getByRole('link', { name: 'Ver catálogo' }).click();
  await expect(painel).toBeHidden();
  await expect(catalogo(page)).toBeInViewport();
});

test('Esc fecha e devolve o foco', async ({ page }) => {
  await abrir(page);
  await botaoTopo(page).focus();
  await page.keyboard.press('Enter');
  const painel = page.getByRole('dialog', { name: 'Sua lista de cotação' });
  await expect(painel).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(painel).toBeHidden();
  await expect(botaoTopo(page)).toBeFocused();
});

test.describe('localStorage corrompido', () => {
  test('texto que não é JSON não quebra', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('mitata-site-cotacao', '{lixo'));
    await abrir(page);
    await expect(botaoTopo(page)).toContainText('Cotação (0)');
  });

  test('item de corte que saiu do catálogo é descartado', async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem(
        'mitata-site-cotacao',
        '{"state":{"itens":[{"corteSlug":"saiu","nome":"X","subcategoria":"Y"}]},"version":1}',
      ),
    );
    await abrir(page);
    await expect(botaoTopo(page)).toContainText('Cotação (0)');
  });
});

test('sem erros no console ao carregar com lista salva', async ({ page }) => {
  const erros: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') erros.push(m.text());
  });
  page.on('pageerror', (e) => erros.push(e.message));
  await page.addInitScript(() =>
    localStorage.setItem(
      'mitata-site-cotacao',
      '{"state":{"itens":[{"corteSlug":"moela","nome":"Moela","subcategoria":"Aves"}],"observacao":""},"version":1}',
    ),
  );
  await abrir(page);
  await expect(botaoTopo(page)).toContainText('Cotação (1)');
  expect(erros).toEqual([]);
});

test.describe('paginação', () => {
  const pagina = (page: Page) => catalogo(page).getByRole('navigation', { name: 'Páginas do catálogo' });
  const resumo = (page: Page, texto: string) => catalogo(page).getByText(texto, { exact: true });

  test('9, 9 e 6 cortes por página, com Próxima e números', async ({ page }) => {
    await abrir(page);
    await expect(cards(page)).toHaveCount(9);
    await expect(resumo(page, 'Mostrando 1–9 de 24 cortes')).toBeVisible();
    await expect(pagina(page).getByRole('button', { name: 'Anterior' })).toBeDisabled();
    await expect(pagina(page).getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page');

    await pagina(page).getByRole('button', { name: 'Próxima' }).click();
    await expect(cards(page)).toHaveCount(9);
    await expect(resumo(page, 'Mostrando 10–18 de 24 cortes')).toBeVisible();
    await expect(pagina(page).getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page');
    await expect(pagina(page).getByRole('button', { name: 'Página 1' })).not.toHaveAttribute('aria-current', 'page');

    await pagina(page).getByRole('button', { name: 'Página 3' }).click();
    await expect(cards(page)).toHaveCount(6);
    await expect(resumo(page, 'Mostrando 19–24 de 24 cortes')).toBeVisible();
    await expect(pagina(page).getByRole('button', { name: 'Próxima' })).toBeDisabled();

    await pagina(page).getByRole('button', { name: 'Anterior' }).click();
    await expect(pagina(page).getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page');
  });

  test('filtro Aves (8) não mostra a paginação', async ({ page }) => {
    await abrir(page);
    await catalogo(page).getByRole('button', { name: 'Aves', exact: true }).click();
    await expect(cards(page)).toHaveCount(8);
    await expect(pagina(page)).toHaveCount(0);
  });

  test('buscar na página 3 volta para a página 1', async ({ page }) => {
    await abrir(page);
    await pagina(page).getByRole('button', { name: 'Página 3' }).click();
    await expect(cards(page)).toHaveCount(6);
    await catalogo(page).getByLabel('Buscar corte').fill('a');
    await expect(pagina(page).getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page');
  });

  test('trocar de categoria na página 2 volta para a página 1', async ({ page }) => {
    await abrir(page);
    await pagina(page).getByRole('button', { name: 'Próxima' }).click();
    await catalogo(page).getByRole('button', { name: 'Todos', exact: true }).click();
    await expect(pagina(page).getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page');
  });

  test('ao mudar de página o foco vai para o resumo dos resultados', async ({ page }) => {
    await abrir(page);
    await pagina(page).getByRole('button', { name: 'Próxima' }).click();
    await expect(resumo(page, 'Mostrando 10–18 de 24 cortes')).toBeFocused();
  });

  test.describe('celular', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('dois cards lado a lado', async ({ page }) => {
      await abrir(page);
      const a = await cards(page).nth(0).boundingBox();
      const b = await cards(page).nth(1).boundingBox();
      expect(Math.abs(a!.y - b!.y)).toBeLessThan(1);
      expect(b!.x).toBeGreaterThan(a!.x + a!.width - 1);
    });

    test('card sozinho na última linha fica centralizado, com a largura normal', async ({ page }) => {
      await abrir(page);
      await catalogo(page).getByRole('button', { name: 'Bovinos', exact: true }).click();
      await expect(cards(page)).toHaveCount(7);
      const itens = catalogo(page).locator('article');
      const primeiro = await itens.nth(0).boundingBox();
      const ultimo = await itens.nth(6).boundingBox();
      expect(Math.abs(ultimo!.width - primeiro!.width)).toBeLessThan(1);
      expect(Math.abs(ultimo!.x + ultimo!.width / 2 - 390 / 2)).toBeLessThan(1);
    });

    test('botão do card tem 44px ou mais e o nome acessível completo', async ({ page }) => {
      await abrir(page);
      const botao = catalogo(page).getByRole('button', { name: 'Adicionar à cotação: Boi Casado' });
      await expect(botao.locator('span:visible')).toHaveText('Adicionar');
      expect((await botao.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    });
  });
});
