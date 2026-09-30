import { describe, expect, it } from 'vitest';
import { cortes } from '@/data/cortes';
import { filtrarCortes, normalizar } from './busca';

describe('normalizar', () => {
  it('remove acentos e deixa em minúsculas', () => {
    expect(normalizar(' Fígado de Bovino ')).toBe('figado de bovino');
  });
});

describe('filtrarCortes', () => {
  it('mantém os 24 cortes sem filtro', () => {
    expect(filtrarCortes(cortes, 'todos', '')).toHaveLength(24);
  });

  it('filtra por categoria', () => {
    expect(filtrarCortes(cortes, 'bovinos', '')).toHaveLength(7);
    expect(filtrarCortes(cortes, 'suinos', '')).toHaveLength(7);
    expect(filtrarCortes(cortes, 'aves', '')).toHaveLength(8);
    expect(filtrarCortes(cortes, 'linguicas', '')).toHaveLength(2);
  });

  it('encontra "fígado" digitado sem acento', () => {
    expect(filtrarCortes(cortes, 'todos', 'figado').map((c) => c.nome)).toEqual(['Fígado de Bovino']);
  });

  it('não casa com o texto do botão "Ver Corte"', () => {
    expect(filtrarCortes(cortes, 'todos', 'ver')).toHaveLength(0);
  });

  it('busca também na subcategoria', () => {
    expect(filtrarCortes(cortes, 'todos', 'miudo')).toHaveLength(3);
  });

  it('combina categoria e busca', () => {
    expect(filtrarCortes(cortes, 'suinos', 'pernil')).toHaveLength(2);
    expect(filtrarCortes(cortes, 'aves', 'pernil')).toHaveLength(0);
  });
});
