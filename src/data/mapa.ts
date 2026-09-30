import { cortes } from './cortes';

/** Peças do `src/assets/mapa/boi.svg`: cada uma é um `<g id="peca-…">`. */
export const PECAS = ['dianteiro', 'pa', 'traseiro', 'lingua', 'figado', 'rumen'] as const;
export type Peca = (typeof PECAS)[number];

export interface ItemMapa {
  corteSlug: string;
  /** Peça do desenho que representa o corte; `null` para o item que só aparece no painel. */
  peca: Peca | null;
  /** Peças destacadas quando o item está em exibição. */
  destaca: readonly Peca[];
}

/** Os cortes bovinos, na ordem do catálogo (tabela da seção 5 da especificação). */
export const itensMapa: ItemMapa[] = [
  { corteSlug: 'boi-casado', peca: null, destaca: ['dianteiro', 'pa', 'traseiro'] },
  { corteSlug: 'dianteiro-de-boi', peca: 'dianteiro', destaca: ['dianteiro', 'pa'] },
  { corteSlug: 'pa-de-boi', peca: 'pa', destaca: ['pa'] },
  { corteSlug: 'traseiro-de-boi', peca: 'traseiro', destaca: ['traseiro'] },
  { corteSlug: 'figado-de-bovino', peca: 'figado', destaca: ['figado'] },
  { corteSlug: 'lingua-bovina', peca: 'lingua', destaca: ['lingua'] },
  { corteSlug: 'rumen-de-bovino', peca: 'rumen', destaca: ['rumen'] },
];

export function itemDaPeca(p: Peca): ItemMapa {
  const item = itensMapa.find((i) => i.peca === p);
  if (!item) throw new Error(`Peça sem corte: ${p}`);
  return item;
}

function nomeDoCorte(slug: string): string {
  const corte = cortes.find((c) => c.slug === slug);
  if (!corte) throw new Error(`Corte não encontrado: ${slug}`);
  return corte.nome;
}

/** Nome acessível de cada peça: o nome do corte que ela representa. */
export const rotulosDosCortes = Object.fromEntries(
  PECAS.map((p) => [p, nomeDoCorte(itemDaPeca(p).corteSlug)]),
) as Record<Peca, string>;
