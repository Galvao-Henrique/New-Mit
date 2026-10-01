import { categorias } from '@/data/categorias';
import type { CategoriaSlug, Corte } from '@/types/catalogo';

export type FiltroCategoria = CategoriaSlug | 'todos';

/** Nome de cada categoria ("Suínos"), para a busca achar "suinos" ou "linguiças". */
const nomeDaCategoria = new Map<CategoriaSlug, string>(categorias.map((c) => [c.slug, c.nome]));

/** Minúsculas e sem acentos, para comparar "figado" com "Fígado". */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Cortes por página do catálogo (3 × 3 no desktop), igual em qualquer largura. */
export const POR_PAGINA = 9;

export function totalDePaginas(totalItens: number, porPagina: number): number {
  return Math.max(1, Math.ceil(totalItens / porPagina));
}

/** Itens da página `pagina` (começa em 1). */
export function paginar<T>(itens: readonly T[], pagina: number, porPagina: number): T[] {
  const inicio = (pagina - 1) * porPagina;
  return itens.slice(inicio, inicio + porPagina);
}

/** Filtra por categoria e por termo (no nome, na subcategoria e no nome da categoria). */
export function filtrarCortes(cortes: readonly Corte[], categoria: FiltroCategoria, termo: string): Corte[] {
  const busca = normalizar(termo);
  return cortes.filter((corte) => {
    const naCategoria = categoria === 'todos' || corte.categoria === categoria;
    const texto = `${corte.nome} ${corte.subcategoria} ${nomeDaCategoria.get(corte.categoria) ?? ''}`;
    const naBusca = !busca || normalizar(texto).includes(busca);
    return naCategoria && naBusca;
  });
}
