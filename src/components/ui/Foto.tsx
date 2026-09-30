import Image from 'next/image';
import type { Foto as FotoRegistrada } from '@/data/fotos';

type FotoProps = {
  foto: FotoRegistrada;
  sizes: string;
  prioridade?: boolean;
  className?: string;
};

/** Preenche o pai, que define a proporção (`relative` + `aspect-*`). */
export function Foto({ foto, sizes, prioridade = false, className = '' }: FotoProps) {
  return (
    <Image
      src={`/fotos/${foto.arquivo}`}
      alt={foto.alt}
      fill
      sizes={sizes}
      priority={prioridade}
      className={`object-cover ${className}`.trim()}
    />
  );
}
