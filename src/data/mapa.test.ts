import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { prepararSvgBoi } from '@/lib/mapa';
import { cortes } from './cortes';
import { itemDaPeca, itensMapa, PECAS, rotulosDosCortes } from './mapa';

describe('mapa do boi', () => {
  it('segue a tabela de peças e cortes da especificação', () => {
    expect(itensMapa).toEqual([
      { corteSlug: 'boi-casado', peca: null, destaca: ['dianteiro', 'pa', 'traseiro'] },
      { corteSlug: 'dianteiro-de-boi', peca: 'dianteiro', destaca: ['dianteiro', 'pa'] },
      { corteSlug: 'pa-de-boi', peca: 'pa', destaca: ['pa'] },
      { corteSlug: 'traseiro-de-boi', peca: 'traseiro', destaca: ['traseiro'] },
      { corteSlug: 'figado-de-bovino', peca: null, destaca: [] },
      { corteSlug: 'lingua-bovina', peca: null, destaca: [] },
      { corteSlug: 'rumen-de-bovino', peca: null, destaca: [] },
    ]);
  });

  it('todo corte bovino está no mapa e toda peça tem um corte', () => {
    const bovinos = cortes.filter((c) => c.categoria === 'bovinos').map((c) => c.slug);
    expect(itensMapa.map((i) => i.corteSlug)).toEqual(bovinos);

    const usadas = itensMapa.flatMap((i) => (i.peca ? [i.peca] : []));
    expect([...usadas].sort()).toEqual([...PECAS].sort());
    for (const p of PECAS) {
      expect(itemDaPeca(p).peca).toBe(p);
      expect(itemDaPeca(p).destaca).toContain(p);
    }
  });

  it('o nome de cada peça é o nome do corte', () => {
    expect(rotulosDosCortes).toEqual({
      dianteiro: 'Dianteiro de Boi',
      pa: 'Pá de Boi',
      traseiro: 'Traseiro de Boi',
    });
  });

  it('o boi.svg do projeto cumpre o contrato', () => {
    expect(() => prepararSvgBoi(readFileSync('src/assets/mapa/boi.svg', 'utf8'), rotulosDosCortes)).not.toThrow();
  });
});
