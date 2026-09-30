import { describe, expect, it } from 'vitest';
import { site } from '@/config/site';
import { cortes } from '@/data/cortes';
import { mensagemCotacao, whatsappUrl } from './whatsapp';

describe('whatsappUrl', () => {
  it('usa o número da empresa e a mensagem padrão de cotação', () => {
    const url = new URL(whatsappUrl());
    expect(url.origin + url.pathname).toBe(`https://wa.me/${site.whatsapp.numero}`);
    expect(url.searchParams.get('text')).toBe('Olá! Vim pelo site e gostaria de uma cotação para a minha empresa.');
  });

  it('codifica acentos, espaços e quebras de linha', () => {
    const url = whatsappUrl('Olá!\nPá de Boi & Rúmen');
    expect(url).toContain('text=Ol%C3%A1!%0AP%C3%A1%20de%20Boi%20%26%20R%C3%BAmen');
    expect(new URL(url).searchParams.get('text')).toBe('Olá!\nPá de Boi & Rúmen');
  });
});

describe('mensagemCotacao', () => {
  it('lista os cortes com o tipo e a observação', () => {
    expect(
      mensagemCotacao({
        observacao: 'Entrega às terças.',
        itens: [
          { corteSlug: 'boi-casado', nome: 'Boi Casado', subcategoria: 'Bovino Com Osso' },
          { corteSlug: 'moela', nome: 'Moela', subcategoria: 'Aves' },
        ],
      }),
    ).toBe(
      [
        'Olá! Vim pelo site e gostaria de uma cotação para a minha empresa.',
        '',
        '*Cortes:*',
        '• Boi Casado (Bovino Com Osso)',
        '• Moela (Aves)',
        '',
        '*Observação:* Entrega às terças.',
      ].join('\n'),
    );
  });

  it('omite a observação vazia', () => {
    const texto = mensagemCotacao({
      observacao: '  ',
      itens: [{ corteSlug: 'moela', nome: 'Moela', subcategoria: 'Aves' }],
    });
    expect(texto).not.toContain('Observação');
    expect(texto.endsWith('• Moela (Aves)')).toBe(true);
  });

  it('um link com os 24 cortes e observação em várias linhas volta idêntico ao decodificar', () => {
    const c = {
      itens: cortes.map(({ slug, nome, subcategoria }) => ({ corteSlug: slug, nome, subcategoria })),
      observacao: 'Linha 1\nLinha 2 & 50% 🥩',
    };
    expect(new URL(whatsappUrl(mensagemCotacao(c))).searchParams.get('text')).toBe(mensagemCotacao(c));
  });
});
