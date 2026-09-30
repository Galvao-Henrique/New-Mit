export type CategoriaSlug = 'bovinos' | 'suinos' | 'aves' | 'linguicas';

export interface Corte {
  slug: string;
  nome: string;
  categoria: CategoriaSlug;
  /** Rótulo exibido no card, ex.: "Bovino Com Osso". */
  subcategoria: string;
  /** Id da foto em `fotos.json`. */
  foto?: string;
}

export interface Categoria {
  slug: CategoriaSlug;
  nome: string;
  descricao: string;
  /** Id da foto em `fotos.json`. */
  foto: string;
}
