import type { Corte } from '@/types/catalogo';

/** Os 24 cortes do site atual, na mesma ordem. */
export const cortes: Corte[] = [
  { slug: 'boi-casado', nome: 'Boi Casado', categoria: 'bovinos', subcategoria: 'Bovino Com Osso' },
  { slug: 'dianteiro-de-boi', nome: 'Dianteiro de Boi', categoria: 'bovinos', subcategoria: 'Bovino Com Osso' },
  { slug: 'pa-de-boi', nome: 'Pá de Boi', categoria: 'bovinos', subcategoria: 'Bovino Com Osso' },
  { slug: 'traseiro-de-boi', nome: 'Traseiro de Boi', categoria: 'bovinos', subcategoria: 'Bovino Com Osso' },
  { slug: 'figado-de-bovino', nome: 'Fígado de Bovino', categoria: 'bovinos', subcategoria: 'Miúdo Bovino' },
  { slug: 'lingua-bovina', nome: 'Língua Bovina', categoria: 'bovinos', subcategoria: 'Miúdo Bovino' },
  { slug: 'rumen-de-bovino', nome: 'Rúmen de Bovino', categoria: 'bovinos', subcategoria: 'Miúdo Bovino' },

  {
    slug: 'costelinha-suina',
    nome: 'Costelinha Suína',
    categoria: 'suinos',
    subcategoria: 'Suíno Com Osso',
    foto: 'costelinha-suina',
  },
  { slug: 'metade-suina', nome: 'Metade Suína', categoria: 'suinos', subcategoria: 'Suíno Com Osso' },
  {
    slug: 'pernil-suino-com-pele-e-com-osso',
    nome: 'Pernil Suíno Com Pele e Com Osso',
    categoria: 'suinos',
    subcategoria: 'Suíno Com Osso',
  },
  { slug: 'pe-suino', nome: 'Pé Suíno', categoria: 'suinos', subcategoria: 'Suíno Com Osso' },
  { slug: 'barriga-suina', nome: 'Barriga Suína', categoria: 'suinos', subcategoria: 'Suíno Sem Osso' },
  {
    slug: 'pernil-suino-sem-pele-e-sem-osso',
    nome: 'Pernil Suíno Sem Pele e Sem Osso',
    categoria: 'suinos',
    subcategoria: 'Suíno Sem Osso',
  },
  {
    slug: 'toucinho-lombar-com-pele',
    nome: 'Toucinho Lombar Com Pele',
    categoria: 'suinos',
    subcategoria: 'Suíno Sem Osso',
  },

  { slug: 'asa-de-frango', nome: 'Asa de Frango', categoria: 'aves', subcategoria: 'Aves' },
  { slug: 'coxa-com-sobrecoxa', nome: 'Coxa Com Sobrecoxa', categoria: 'aves', subcategoria: 'Aves' },
  { slug: 'coxinha-da-asa', nome: 'Coxinha da Asa', categoria: 'aves', subcategoria: 'Aves' },
  {
    slug: 'file-de-peito-de-frango',
    nome: 'Filé de Peito de Frango',
    categoria: 'aves',
    subcategoria: 'Aves',
    foto: 'file-de-peito-de-frango',
  },
  {
    slug: 'file-de-peito-de-frango-empanado',
    nome: 'Filé de Peito de Frango Empanado',
    categoria: 'aves',
    subcategoria: 'Aves',
  },
  { slug: 'moela', nome: 'Moela', categoria: 'aves', subcategoria: 'Aves' },
  {
    slug: 'nuggets-de-frango',
    nome: 'Nuggets de Frango',
    categoria: 'aves',
    subcategoria: 'Aves',
    foto: 'nuggets-de-frango',
  },
  { slug: 'peito-de-frango-com-osso', nome: 'Peito de Frango Com Osso', categoria: 'aves', subcategoria: 'Aves' },

  {
    slug: 'linguica-toscana-aurora',
    nome: 'Linguiça Toscana Aurora',
    categoria: 'linguicas',
    subcategoria: 'Linguiça',
  },
  { slug: 'linguica-toscana-sadia', nome: 'Linguiça Toscana Sadia', categoria: 'linguicas', subcategoria: 'Linguiça' },
];
