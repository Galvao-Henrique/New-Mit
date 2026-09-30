import type { CategoriaSlug, Corte } from '@/types/catalogo';

export type FiltroCategoria = CategoriaSlug | 'todos';

/** Minúsculas e sem acentos, para comparar "figado" com "Fígado". */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Filtra por categoria e por termo (no nome e na subcategoria). */
export function filtrarCortes(cortes: readonly Corte[], categoria: FiltroCategoria, termo: string): Corte[] {
  const busca = normalizar(termo);
  return cortes.filter((corte) => {
    const naCategoria = categoria === 'todos' || corte.categoria === categoria;
    const naBusca = !busca || normalizar(`${corte.nome} ${corte.subcategoria}`).includes(busca);
    return naCategoria && naBusca;
  });
}
