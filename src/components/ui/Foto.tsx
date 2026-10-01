import Image from 'next/image';
import type { Foto as FotoRegistrada } from '@/data/fotos';

type FotoProps = {
  foto: FotoRegistrada;
  sizes: string;
  /** Foto principal acima da dobra: pré-carregada, com prioridade alta e sem loading="lazy". */
  prioridade?: boolean;
  className?: string;
  /** Foto só de enfeite (o texto ao lado já diz o que é): sem texto alternativo. */
  decorativa?: boolean;
};

/** Preenche o pai, que define a proporção (`relative` + `aspect-*`). */
export function Foto({ foto, sizes, prioridade = false, className = '', decorativa = false }: FotoProps) {
  return (
    <Image
      src={`/fotos/${foto.arquivo}`}
      alt={decorativa ? '' : foto.alt}
      fill
      sizes={sizes}
      // No Next 16, `preload` substitui `priority`, que já não põe fetchpriority="high" no <img>.
      preload={prioridade}
      fetchPriority={prioridade ? 'high' : undefined}
      loading={prioridade ? 'eager' : undefined}
      className={`object-cover ${className}`.trim()}
    />
  );
}
