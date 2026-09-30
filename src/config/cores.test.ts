import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { cores } from './cores';

it('globals.css declara cada token com o mesmo valor', () => {
  const css = readFileSync('src/app/globals.css', 'utf8');
  for (const [nome, hex] of Object.entries(cores)) {
    expect(css).toContain(`--color-${nome}: ${hex};`);
  }
});
