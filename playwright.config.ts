import { defineConfig } from '@playwright/test';

/**
 * Projetos:
 * - fluxos: testes de comportamento do site;
 * - prints: capturas de tela para aprovação.
 *
 * Localmente usa o Edge instalado; no CI, o Chromium do Playwright.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3217',
    channel: process.env.CI ? undefined : 'msedge',
    locale: 'pt-BR',
  },
  timeout: 180_000,
  expect: { timeout: 60_000 },
  projects: [
    { name: 'fluxos', testMatch: /fluxos.*\.spec\.ts/ },
    { name: 'prints', testMatch: /prints\.spec\.ts/ },
  ],
  webServer: {
    command: 'pnpm start --port 3217',
    url: 'http://localhost:3217',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
