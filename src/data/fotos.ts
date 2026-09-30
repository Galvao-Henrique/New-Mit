import type { Corte } from '@/types/catalogo';
import registro from './fotos.json';

export interface Foto {
  id: string;
  arquivo: string;
  alt: string;
  autor: string;
  origem: string;
  licenca: 'Unsplash' | 'Pexels';
  download: string;
}

export const fotos: Foto[] = registro as Foto[];

export function foto(id: string): Foto {
  const encontrada = fotos.find((f) => f.id === id);
  if (!encontrada) throw new Error(`Foto não registrada: ${id}`);
  return encontrada;
}

/** Foto própria do corte e, na falta, a foto da categoria. */
export function fotoDoCorte(corte: Corte): Foto {
  return foto(corte.foto ?? `categoria-${corte.categoria}`);
}
