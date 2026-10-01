import type { Metadata } from 'next';
import imagem from '@/app/opengraph-image.jpg';

/**
 * Open Graph de uma página secundária. Definir `openGraph` numa página substitui o da raiz
 * (inclusive a imagem do arquivo opengraph-image), então a imagem é repetida aqui.
 */
export function openGraphDaPagina(title: string, description: string): NonNullable<Metadata['openGraph']> {
  return {
    title,
    description,
    images: [{ url: imagem.src, width: imagem.width, height: imagem.height }],
  };
}
