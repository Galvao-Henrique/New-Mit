import { describe, expect, it } from 'vitest';
import { categorias } from './categorias';
import { cortes } from './cortes';

describe('catálogo', () => {
  it('tem os 24 cortes do site atual, na mesma ordem e com slugs únicos', () => {
    expect(cortes).toHaveLength(24);
    expect(cortes[0].slug).toBe('boi-casado');
    expect(new Set(cortes.map((c) => c.slug)).size).toBe(24);
  });

  it('"com" e "sem" ficam em minúsculas no meio dos nomes e das subcategorias', () => {
    for (const corte of cortes) {
      expect(`${corte.nome} | ${corte.subcategoria}`).not.toMatch(/\b(?:Com|Sem)\b/);
    }
  });

  it('toda categoria tem corte e foto', () => {
    for (const cat of categorias) {
      expect(cortes.some((c) => c.categoria === cat.slug)).toBe(true);
      expect(cat.foto).toBe(`categoria-${cat.slug}`);
    }
  });
});
