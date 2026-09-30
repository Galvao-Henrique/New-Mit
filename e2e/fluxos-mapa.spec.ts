import { expect, test, type Page } from '@playwright/test';

/** Abre a página e espera o mapa ficar interativo (o efeito do cliente marca aria-pressed nas peças). */
async function abrirMapa(page: Page) {
  await page.goto('/');
  await expect(page.locator('#peca-pa')).toHaveAttribute('aria-pressed', 'false');
}

/**
 * Um ponto da peça, em coordenadas da janela, em que ela é o que está por cima.
 * Serve para qualquer desenho que cumpra o contrato (o centro de uma peça pode estar sob outra).
 */
async function pontoDaPeca(page: Page, peca: string) {
  // O foco pelo teclado rola a página suavemente: espera a rolagem parar antes de medir.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let ultimo = -1;
        let iguais = 0;
        const passo = () => {
          iguais = scrollY === ultimo ? iguais + 1 : 0;
          ultimo = scrollY;
          if (iguais >= 10) resolve();
          else requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      }),
  );
  const ponto = await page.locator(`#peca-${peca}`).evaluate((el) => {
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const candidatos: [number, number][] = [];
    for (let i = 1; i < 16; i++) {
      for (let j = 1; j < 16; j++) candidatos.push([r.left + (r.width * i) / 16, r.top + (r.height * j) / 16]);
    }
    candidatos.sort((a, b) => Math.hypot(a[0] - cx, a[1] - cy) - Math.hypot(b[0] - cx, b[1] - cy));
    const achado = candidatos.find(([x, y]) => document.elementFromPoint(x, y)?.closest('[data-peca]') === el);
    return achado ? { x: achado[0], y: achado[1] } : null;
  });
  if (!ponto) throw new Error(`Nenhum ponto visível da peça "peca-${peca}"`);
  return ponto;
}

const painel = (page: Page) => page.locator('#cortes [aria-live="polite"]');

test.use({ viewport: { width: 1440, height: 900 } });

test('passar o mouse na pá destaca só a pá', async ({ page }) => {
  await abrirMapa(page);
  const pa = await pontoDaPeca(page, 'pa');
  await page.mouse.move(pa.x, pa.y);
  await expect(page.locator('#peca-pa')).toHaveAttribute('data-estado', 'ativo');
  await expect(page.locator('#peca-traseiro')).toHaveAttribute('data-estado', 'inativo');
  await expect(page.locator('#peca-dianteiro')).toHaveAttribute('data-estado', 'inativo');
  await expect(painel(page)).toHaveText('Pá de Boi');
});

test('Boi Casado na lista destaca dianteiro, pá e traseiro', async ({ page }) => {
  await abrirMapa(page);
  await page.locator('#cortes').getByRole('button', { name: 'Boi Casado' }).click();
  for (const peca of ['dianteiro', 'pa', 'traseiro']) {
    await expect(page.locator(`#peca-${peca}`)).toHaveAttribute('data-estado', 'ativo');
  }
  await expect(page.locator('#peca-figado')).toHaveAttribute('data-estado', 'inativo');
  await expect(painel(page)).toHaveText('Boi Casado');
});

test('teclado', async ({ page }) => {
  await abrirMapa(page);
  const traseiro = page.locator('#peca-traseiro');
  for (let i = 0; i < 40; i++) {
    if (await traseiro.evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(traseiro).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(painel(page)).toHaveText('Traseiro de Boi');

  // Passa o mouse em outra peça e tira: volta ao que foi escolhido pelo teclado.
  const pa = await pontoDaPeca(page, 'pa');
  await page.mouse.move(pa.x, pa.y);
  await expect(painel(page)).toHaveText('Pá de Boi');
  await page.mouse.move(4, 4);
  await expect(painel(page)).toHaveText('Traseiro de Boi');
  await expect(traseiro).toHaveAttribute('data-estado', 'ativo');
});

test.describe('celular', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test('toque fixa a peça', async ({ page }) => {
    await abrirMapa(page);
    const dianteiro = await pontoDaPeca(page, 'dianteiro');
    await page.touchscreen.tap(dianteiro.x, dianteiro.y);
    await expect(painel(page)).toHaveText('Dianteiro de Boi');
    await page.waitForTimeout(500);
    await expect(painel(page)).toHaveText('Dianteiro de Boi');
    await expect(page.locator('#peca-dianteiro')).toHaveAttribute('data-estado', 'ativo');
  });
});

test('adicionar pelo mapa', async ({ page }) => {
  await abrirMapa(page);
  const pa = await pontoDaPeca(page, 'pa');
  await page.mouse.click(pa.x, pa.y);
  await page.locator('#cortes').getByRole('button', { name: 'Adicionar à cotação' }).click();
  await expect(page.locator('header')).toContainText('Cotação (1)');
  await expect(page.locator('#cortes').getByRole('button', { name: 'Remover da cotação' })).toBeVisible();
});
