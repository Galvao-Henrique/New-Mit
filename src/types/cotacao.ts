export interface ItemCotacao {
  corteSlug: string;
  nome: string;
  subcategoria: string;
}

export interface Cotacao {
  itens: ItemCotacao[];
  observacao?: string;
}
