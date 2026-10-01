import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Corte } from '@/types/catalogo';

type Modulo = typeof import('./cotacao');
let useCotacao: Modulo['useCotacao'];
let descartarDesconhecidos: Modulo['descartarDesconhecidos'];

const boi: Corte = { slug: 'boi-casado', nome: 'Boi Casado', categoria: 'bovinos', subcategoria: 'Bovino com Osso' };

beforeAll(async () => {
  // O persist do zustand avisa quando não há localStorage (ambiente node).
  const dados = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => dados.get(k) ?? null,
    setItem: (k: string, v: string) => void dados.set(k, v),
    removeItem: (k: string) => void dados.delete(k),
    clear: () => dados.clear(),
  });
  ({ useCotacao, descartarDesconhecidos } = await import('./cotacao'));
});

beforeEach(() => {
  useCotacao.setState({ itens: [], observacao: '', painelAberto: false });
});

describe('useCotacao', () => {
  it('adicionar não duplica; alternar remove', () => {
    useCotacao.getState().adicionar(boi);
    useCotacao.getState().adicionar(boi);
    expect(useCotacao.getState().itens).toEqual([
      { corteSlug: 'boi-casado', nome: 'Boi Casado', subcategoria: 'Bovino com Osso' },
    ]);
    useCotacao.getState().alternar(boi);
    expect(useCotacao.getState().itens).toHaveLength(0);
    useCotacao.getState().alternar(boi);
    expect(useCotacao.getState().itens).toHaveLength(1);
  });

  it('remover tira só o corte pedido', () => {
    useCotacao.getState().adicionar(boi);
    useCotacao.getState().remover('outro');
    expect(useCotacao.getState().itens).toHaveLength(1);
    useCotacao.getState().remover('boi-casado');
    expect(useCotacao.getState().itens).toHaveLength(0);
  });

  it('limpar zera itens e observação', () => {
    useCotacao.getState().adicionar(boi);
    useCotacao.getState().definirObservacao('Entrega às terças.');
    expect(useCotacao.getState().observacao).toBe('Entrega às terças.');
    useCotacao.getState().limpar();
    expect(useCotacao.getState().itens).toEqual([]);
    expect(useCotacao.getState().observacao).toBe('');
  });

  it('abre e fecha o painel', () => {
    useCotacao.getState().abrirPainel();
    expect(useCotacao.getState().painelAberto).toBe(true);
    useCotacao.getState().fecharPainel();
    expect(useCotacao.getState().painelAberto).toBe(false);
  });
});

describe('descartarDesconhecidos', () => {
  it('descarta itens de cortes que não existem mais e entradas inválidas', () => {
    const slugs = new Set(['boi-casado']);
    expect(
      descartarDesconhecidos(
        [
          { corteSlug: 'boi-casado', nome: 'Boi Casado', subcategoria: 'Bovino com Osso' },
          { corteSlug: 'saiu', nome: 'X', subcategoria: 'Y' },
          null,
          'lixo',
        ],
        slugs,
      ),
    ).toEqual([{ corteSlug: 'boi-casado', nome: 'Boi Casado', subcategoria: 'Bovino com Osso' }]);
    expect(descartarDesconhecidos('não é lista', slugs)).toEqual([]);
  });
});
