import { expect, test, type Page } from '@playwright/test';

/** Abre a página e espera o mapa ficar interativo (o efeito do cliente marca aria-pressed nas peças). */
async function abrirMapa(page: Page) {
  await page.goto('/');
  await expect(page.locator('#peca-pa')).toHaveAttribute('aria-pressed', 'false');
}

const painel = (page: Page) => page.locator('#cortes [aria-live="polite"]');

/**
 * Um ponto da peça, em coordenadas da janela, em que ela é o que está por cima.
 * Serve para qualquer desenho que cumpra o contrato (o centro de uma peça pode estar sob outra).
 */
async function pontoDaPeca(page: Page, peca: string) {
  await esperarRolagemParar(page);
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

/** O foco pelo teclado rola a página suavemente: espera a rolagem parar antes de medir. */
async function esperarRolagemParar(page: Page) {
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
}

/** Um ponto a 1 unidade do viewBox acima da borda de baixo da peça (na coluna mais perto do centro). */
async function pontoNaBordaDeBaixo(page: Page, peca: string) {
  await pontoDaPeca(page, peca); // rola até a peça e espera parar
  const ponto = await page.locator(`#peca-${peca}`).evaluate((el) => {
    const svg = (el as SVGGElement).ownerSVGElement!;
    const pxPorUnidade = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
    const r = el.getBoundingClientRect();
    let melhor: { x: number; y: number; distancia: number } | null = null;
    for (let i = 1; i < 24; i++) {
      const x = r.left + (r.width * i) / 24;
      for (let y = r.bottom - 0.5; y > r.top; y -= 0.5) {
        if (document.elementFromPoint(x, y)?.closest('[data-peca]') !== el) continue;
        const distancia = Math.abs(x - (r.left + r.width / 2));
        if (!melhor || distancia < melhor.distancia) melhor = { x, y: y - pxPorUnidade, distancia };
        break;
      }
    }
    return melhor;
  });
  if (!ponto) throw new Error(`Nenhuma borda da peça "peca-${peca}"`);
  return ponto;
}

/** Conta as mudanças de data-estado da peça a partir de agora (piscar = mais de uma). */
async function contarMudancas(page: Page, peca: string) {
  await page.locator(`#peca-${peca}`).evaluate((el) => {
    const w = window as unknown as { mudancas: number };
    w.mudancas = 0;
    new MutationObserver((ms) => (w.mudancas += ms.length)).observe(el, {
      attributes: true,
      attributeFilter: ['data-estado'],
    });
  });
  return () => page.evaluate(() => (window as unknown as { mudancas: number }).mudancas);
}

/** Passa o mouse no ponto e mexe 1–2 px para cada lado; a peça tem de continuar em destaque, sem piscar. */
async function mexerEmVolta(page: Page, ponto: { x: number; y: number }, peca: string, nome: string) {
  const mudancas = await contarMudancas(page, peca);
  await page.mouse.move(ponto.x, ponto.y);
  await expect(painel(page)).toHaveText(nome);
  for (const [dx, dy] of [
    [0, -1],
    [0, 1],
    [0, 2],
    [0, -2],
    [-1, 0],
    [1, 0],
    [-2, 0],
    [2, 0],
    [0, 0],
  ]) {
    await page.mouse.move(ponto.x + dx, ponto.y + dy);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(300);
  await expect(painel(page)).toHaveText(nome);
  await expect(page.locator(`#peca-${peca}`)).toHaveAttribute('data-estado', 'ativo');
  expect(await mudancas()).toBe(1);
}

test.use({ viewport: { width: 1440, height: 900 } });

test('passar o mouse na pá destaca só a pá', async ({ page }) => {
  await abrirMapa(page);
  const pa = await pontoDaPeca(page, 'pa');
  await page.mouse.move(pa.x, pa.y);
  await expect(page.locator('#peca-pa')).toHaveAttribute('data-estado', 'ativo');
  await expect(page.locator('#peca-traseiro')).toHaveAttribute('data-estado', 'inativo');
  await expect(page.locator('#peca-dianteiro')).toHaveAttribute('data-estado', 'inativo');
  await expect(painel(page)).toHaveText('Pá de Boi');
  // Só a prévia: o botão da cotação aparece depois de escolher (clique).
  await expect(page.locator('#cortes').getByText('Clique para escolher')).toBeVisible();
  await expect(page.locator('#cortes').getByRole('button', { name: 'Adicionar à cotação' })).toHaveCount(0);
});

test('mouse na língua fica estável', async ({ page }) => {
  await abrirMapa(page);
  await mexerEmVolta(page, await pontoDaPeca(page, 'lingua'), 'lingua', 'Língua Bovina');
});

test('mouse na borda de baixo do dianteiro fica estável', async ({ page }) => {
  await abrirMapa(page);
  await mexerEmVolta(page, await pontoNaBordaDeBaixo(page, 'dianteiro'), 'dianteiro', 'Dianteiro de Boi');
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

test('teclado: Enter escolhe e o Tab chega ao botão da peça escolhida', async ({ page }) => {
  await abrirMapa(page);
  const mapa = page.locator('#cortes');
  const pa = page.locator('#peca-pa');
  for (let i = 0; i < 40; i++) {
    if (await pa.evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(pa).toBeFocused();
  await expect(painel(page)).toHaveText('Pá de Boi');
  await expect(mapa.getByText('Enter para escolher')).toBeVisible();
  await expect(mapa.getByRole('button', { name: /^Adicionar à cotação/ })).toHaveCount(0);

  await page.keyboard.press('Enter');
  const adicionar = mapa.getByRole('button', { name: 'Adicionar à cotação: Pá de Boi', exact: true });
  await expect(adicionar).toBeVisible();

  // Passa pelas peças seguintes (prévias) até o botão; ao chegar nele, o cartão é o da pá.
  const focoNoBotao = () =>
    page.evaluate(() => document.activeElement?.textContent?.startsWith('Adicionar à cotação') ?? false);
  for (let i = 0; i < 20 && !(await focoNoBotao()); i++) await page.keyboard.press('Tab');
  await expect(adicionar).toBeFocused();
  await expect(painel(page)).toHaveText('Pá de Boi');
  await expect(pa).toHaveAttribute('data-estado', 'ativo');

  await page.keyboard.press('Enter');
  await expect(page.locator('header')).toContainText('Cotação (1)');
  await expect(mapa.getByRole('button', { name: 'Remover da cotação: Pá de Boi', exact: true })).toBeFocused();
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
    await expect(page.locator('#peca-dianteiro')).toHaveAttribute('aria-pressed', 'true');
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
