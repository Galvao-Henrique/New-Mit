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
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${pasta}/${largura}.jpg`, type: 'jpeg', quality: 80, fullPage: true });
    expect(true).toBe(true);
  });
}
