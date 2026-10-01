import { expect, test } from '@playwright/test';
import { fotos } from '../src/data/fotos';

test('créditos lista um item por foto, com autor e link de origem', async ({ page }) => {
  await page.goto('/creditos');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const itens = page.locator('main li');
  await expect(itens).toHaveCount(fotos.length);
  for (const [i, f] of fotos.entries()) {
    const item = itens.nth(i);
    await expect(item).toContainText(f.autor);
    const link = item.getByRole('link');
    await expect(link).toHaveAttribute('href', f.origem);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toContainText('(abre em nova aba)');
  }
});

test('privacidade tem h1 "Privacidade" e os três pontos', async ({ page }) => {
  await page.goto('/privacidade');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacidade');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('main li')).toHaveCount(3);
  await expect(page.locator('main')).toContainText('só no seu navegador');
});

test('páginas secundárias levam o menu às âncoras da página inicial', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/privacidade');
  const menu = page.getByRole('navigation', { name: 'Principal' });
  await expect(menu.getByRole('link', { name: 'Cortes' })).toHaveAttribute('href', '/#cortes');
  await expect(menu.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '/#contato');
  await expect(page.getByRole('button', { name: /^Cotação/ })).toHaveCount(0);
});

test('rota inexistente responde 404 com "Página não encontrada"', async ({ page }) => {
  const resposta = await page.goto('/nao-existe');
  expect(resposta?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Página não encontrada');
  await expect(page.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/');
});

test('sitemap sem domínio é vazio e robots libera tudo', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const texto = await robots.text();
  expect(texto).toContain('Allow: /');
  expect(texto).not.toContain('Sitemap');
});

test('sem domínio, nenhuma página tem endereço canônico', async ({ page }) => {
  for (const rota of ['/', '/creditos', '/privacidade']) {
    await page.goto(rota);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  }
});

test('foto do hero com prioridade alta e logo do topo sem carregamento preguiçoso', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#inicio img');
  await expect(hero).toHaveAttribute('fetchpriority', 'high');
  await expect(hero).toHaveAttribute('loading', 'eager');
  await expect(page.locator('header img')).toHaveAttribute('loading', 'eager');
});

test('créditos e privacidade têm Open Graph próprio e mantêm a imagem', async ({ page }) => {
  for (const [rota, titulo] of [
    ['/creditos', 'Créditos das fotos | Mitata Alimentos'],
    ['/privacidade', 'Privacidade | Mitata Alimentos'],
  ]) {
    await page.goto(rota);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', titulo);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  }
});

test('JSON-LD LocalBusiness e imagem de compartilhamento na página inicial', async ({ page }) => {
  await page.goto('/');
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(json ?? '{}')['@type']).toBe('LocalBusiness');
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page).toHaveTitle('Mitata Alimentos | Atacado de carnes no Vale do Paraíba');
});
