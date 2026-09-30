import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { cortes } from '@/data/cortes';
import type { Corte } from '@/types/catalogo';
import type { ItemCotacao } from '@/types/cotacao';

interface EstadoCotacao {
  itens: ItemCotacao[];
  observacao: string;
  painelAberto: boolean;

  adicionar(corte: Corte): void;
  remover(slug: string): void;
  alternar(corte: Corte): void;
  definirObservacao(texto: string): void;
  limpar(): void;
  abrirPainel(): void;
  fecharPainel(): void;
}

const slugsDoCatalogo = new Set(cortes.map((c) => c.slug));

/** Mantém só os itens bem formados cujo corte ainda existe no catálogo. */
export function descartarDesconhecidos(itens: unknown, slugs: ReadonlySet<string>): ItemCotacao[] {
  if (!Array.isArray(itens)) return [];
  const validos: ItemCotacao[] = [];
  for (const item of itens) {
    if (typeof item !== 'object' || item === null) continue;
    const { corteSlug, nome, subcategoria } = item as Record<string, unknown>;
    if (typeof corteSlug !== 'string' || typeof nome !== 'string' || typeof subcategoria !== 'string') continue;
    if (!slugs.has(corteSlug)) continue;
    validos.push({ corteSlug, nome, subcategoria });
  }
  return validos;
}

/** Elemento que abriu o painel, para devolver o foco ao fechar. */
let origemDoFoco: HTMLElement | null = null;

export function devolverFoco(): void {
  origemDoFoco?.focus();
  origemDoFoco = null;
}

/** Lista de cotação, salva no navegador (localStorage). */
export const useCotacao = create<EstadoCotacao>()(
  persist(
    (set, get) => ({
      itens: [],
      observacao: '',
      painelAberto: false,

      adicionar: (corte) => {
        if (get().itens.some((item) => item.corteSlug === corte.slug)) return;
        set((estado) => ({
          itens: [...estado.itens, { corteSlug: corte.slug, nome: corte.nome, subcategoria: corte.subcategoria }],
        }));
      },
      remover: (slug) => set((estado) => ({ itens: estado.itens.filter((item) => item.corteSlug !== slug) })),
      alternar: (corte) => {
        if (get().itens.some((item) => item.corteSlug === corte.slug)) get().remover(corte.slug);
        else get().adicionar(corte);
      },
      definirObservacao: (texto) => set({ observacao: texto }),
      limpar: () => set({ itens: [], observacao: '' }),
      abrirPainel: () => {
        if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
          origemDoFoco = document.activeElement;
        }
        set({ painelAberto: true });
      },
      fecharPainel: () => set({ painelAberto: false }),
    }),
    {
      name: 'mitata-site-cotacao',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // O painel não fica aberto entre visitas.
      partialize: ({ itens, observacao }) => ({ itens, observacao }),
      // Reidratado no cliente depois da hidratação do React.
      skipHydration: true,
      migrate: (salvo, versao) => (versao === 1 ? (salvo as never) : {}),
      merge: (salvo, atual) => {
        const s = salvo as { itens?: unknown; observacao?: unknown } | undefined;
        return {
          ...atual,
          observacao: typeof s?.observacao === 'string' ? s.observacao : '',
          itens: descartarDesconhecidos(s?.itens, slugsDoCatalogo),
        };
      },
    },
  ),
);
