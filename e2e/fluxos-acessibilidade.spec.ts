import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const LARGURAS = [1440, 390];
const PAGINAS = ['/', '/creditos', '/privacidade'];

/** Abre a página inicial e espera a hidratação (o efeito do mapa marca aria-pressed nas peças). */
async function abrirInicio(page: Page) {
  await page.goto('/');
  await expect(page.locator('#peca-pa')).toHaveAttribute('aria-pressed', 'false');
}

// Movimento reduzido mostra tudo no estado final: sem isso, os [data-reveal] abaixo da dobra ficam com
// opacity 0 até serem rolados e o axe não mediria o contraste deles.
test.use({ reducedMotion: 'reduce' });

/*
 * Verificação manual conhecida: o axe devolve "incomplete" (não decide) para texto sobre foto ou degradê,
 * porque não consegue calcular o fundo: o link "Contato" do topo e o texto dos diferenciais sobre o degradê do
 * hero, e os rótulos dos cartões de categoria do catálogo (BOVINOS, SUÍNOS, AVES, LINGUIÇAS) sobre a foto.
 * Esses trechos são conferidos a olho nos prints (docs/prints), com véu marinho por trás do texto.
 */

/** Roda o axe e devolve só o que é grave, em texto legível para a mensagem de falha. */
async function violacoesGraves(page: Page) {
  // Revelações são transições de opacidade: medir o contraste no meio delas dá falso alarme.
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
  const translucidos = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter((el) => Number(getComputedStyle(el).opacity) < 1).length,
  );
  expect(translucidos, 'elementos [data-reveal] ainda com opacidade menor que 1').toBe(0);
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
}

for (const largura of LARGURAS) {
  test.describe(`axe em ${largura}px`, () => {
    test.use({ viewport: { width: largura, height: 900 } });

    for (const caminho of PAGINAS) {
      test(`${caminho} sem violações graves`, async ({ page }) => {
        if (caminho === '/') await abrirInicio(page);
        else await page.goto(caminho);
        await page.evaluate(() => document.fonts.ready);
        expect(await violacoesGraves(page)).toEqual([]);
      });
    }

    test('/ com o painel de cotação aberto sem violações graves', async ({ page }) => {
      await abrirInicio(page);
      await page
        .locator('#catalogo')
        .getByRole('button', { name: /^Adicionar à cotação:/ })
        .first()
        .click();
      await page.getByRole('button', { name: 'Ver cotação' }).click();
      await expect(page.getByRole('dialog', { name: 'Sua lista de cotação' })).toBeVisible();
      expect(await violacoesGraves(page)).toEqual([]);
    });

    test('/ com uma peça do mapa escolhida sem violações graves', async ({ page }) => {
      await abrirInicio(page);
      await page.locator('#peca-pa').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#peca-pa')).toHaveAttribute('aria-pressed', 'true');
      expect(await violacoesGraves(page)).toEqual([]);
    });
  });
}

test('os títulos de / seguem a ordem: um h1 e nenhum salto de nível', async ({ page }) => {
  await abrirInicio(page);
  const niveis = await page.evaluate(() =>
    [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => Number(h.tagName[1])),
  );
  expect(niveis.filter((n) => n === 1)).toHaveLength(1);
  expect(niveis[0]).toBe(1);
  for (let i = 1; i < niveis.length; i++) {
    expect(
      niveis[i] - niveis[i - 1],
      `título ${i + 1} (h${niveis[i]}) depois de h${niveis[i - 1]}`,
    ).toBeLessThanOrEqual(1);
  }
});
