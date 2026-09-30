import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { categorias } from './categorias';
import { cortes } from './cortes';
import { foto, fotoDoCorte, fotos } from './fotos';

const obrigatorios = [
  'hero',
  'categoria-bovinos',
  'categoria-suinos',
  'categoria-aves',
  'categoria-linguicas',
  'compromisso',
  'empresas',
];

describe('fotos', () => {
  it.each(fotos)('$id tem arquivo, autor, origem, licença e alt em pt-BR', (f) => {
    expect(existsSync(`public/fotos/${f.arquivo}`)).toBe(true);
    expect(f.autor.trim()).not.toBe('');
    expect(new URL(f.origem).hostname).toMatch(/(^|\.)(unsplash|pexels)\.com$/);
    expect(['Unsplash', 'Pexels']).toContain(f.licenca);
    expect(f.alt.length).toBeGreaterThan(10);
  });

  it('ids obrigatórios existem e são únicos', () => {
    const ids = fotos.map((f) => f.id);
    for (const id of obrigatorios) expect(ids).toContain(id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda foto de corte e de categoria aponta para um id registrado', () => {
    for (const c of cortes) expect(() => fotoDoCorte(c)).not.toThrow();
    for (const cat of categorias) expect(() => foto(cat.foto)).not.toThrow();
  });

  it('foto() lança erro para id desconhecido', () => {
    expect(() => foto('nao-existe')).toThrow('Foto não registrada: nao-existe');
  });
});
