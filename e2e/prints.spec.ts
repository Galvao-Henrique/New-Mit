import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import sharp from 'sharp';

test.use({ reducedMotion: 'reduce' });

const etapa = process.env.ETAPA ?? 'x';
/** O Chromium corrompe capturas de página inteira acima de ~16384px: a página sai em faixas e é costurada. */
const ALTURA_FAIXA = 6000;

for (const largura of [390, 768, 1440]) {
  test(`print ${largura}`, async ({ page }) => {
    const pasta = `docs/prints/etapa-${etapa}`;
    mkdirSync(pasta, { recursive: true });
    await page.setViewportSize({ width: largura, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    // Rola a página inteira para as fotos preguiçosas carregarem e as revelações dispararem.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
    await page.evaluate(() =>
      Promise.all(
        [...document.images].map((img) =>
          img.complete ? undefined : new Promise((r) => img.addEventListener('load', r, { once: true })),
        ),
      ),
    );

    const altura = await page.evaluate(() => document.documentElement.scrollHeight);
    const faixas: { input: Buffer; top: number; left: number }[] = [];
    for (let y = 0; y < altura; y += ALTURA_FAIXA) {
      // Rolar até a faixa mantém as fotos preguiçosas e as revelações dessa região carregadas.
      await page.evaluate((destino) => window.scrollTo({ top: destino, behavior: 'instant' }), y);
      await page.waitForTimeout(300);
      const input = await page.screenshot({
        type: 'png',
        fullPage: true,
        clip: { x: 0, y, width: largura, height: Math.min(ALTURA_FAIXA, altura - y) },
      });
      faixas.push({ input, top: y, left: 0 });
    }

    await sharp({ create: { width: largura, height: altura, channels: 3, background: '#ffffff' } })
      .composite(faixas)
      .jpeg({ quality: 80 })
      .toFile(`${pasta}/${largura}.jpg`);
    expect(faixas.length).toBeGreaterThan(0);
  });
}
