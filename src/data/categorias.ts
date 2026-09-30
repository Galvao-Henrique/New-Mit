import type { Categoria } from '@/types/catalogo';

export const categorias: Categoria[] = [
  { slug: 'bovinos', nome: 'Bovinos', descricao: 'Boi casado, quartos, pá e miúdos', foto: 'categoria-bovinos' },
  { slug: 'suinos', nome: 'Suínos', descricao: 'Pernil, costela, barriga e meia carcaça', foto: 'categoria-suinos' },
  { slug: 'aves', nome: 'Aves', descricao: 'Peito, coxa, asa, miúdos e empanados', foto: 'categoria-aves' },
  {
    slug: 'linguicas',
    nome: 'Linguiças',
    descricao: 'Toscanas das marcas Aurora e Sadia',
    foto: 'categoria-linguicas',
  },
];
