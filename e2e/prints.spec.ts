import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

const etapa = process.env.ETAPA ?? 'x';

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
    await page.screenshot({ path: `${pasta}/${largura}.jpg`, type: 'jpeg', quality: 80, fullPage: true });
    expect(true).toBe(true);
  });
}
