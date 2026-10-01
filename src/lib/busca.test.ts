import { describe, expect, it } from 'vitest';
import { cortes } from '@/data/cortes';
import { filtrarCortes, normalizar, paginar, POR_PAGINA, totalDePaginas } from './busca';

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

describe('paginação', () => {
  it('calcula páginas com no mínimo 1', () => {
    expect(totalDePaginas(24, 9)).toBe(3);
    expect(totalDePaginas(9, 9)).toBe(1);
    expect(totalDePaginas(10, 9)).toBe(2);
    expect(totalDePaginas(0, 9)).toBe(1);
  });

  it('recorta a página pedida', () => {
    expect(paginar([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
    expect(paginar([1, 2, 3, 4, 5], 3, 2)).toEqual([5]);
  });

  it('divide os 24 cortes em 9, 9 e 6', () => {
    expect([1, 2, 3].map((p) => paginar(cortes, p, POR_PAGINA).length)).toEqual([9, 9, 6]);
  });

  it('página fora do intervalo vem vazia', () => {
    expect(paginar([1, 2, 3], 5, 2)).toEqual([]);
  });
});
